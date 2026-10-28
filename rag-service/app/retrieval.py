import re
from typing import Any, Dict, List, Set, Tuple

from .bm25_index import Bm25Index
from .config import settings
from .embeddings import embed_query
from .reranker import rerank
from .vector_store import FaissVectorStore

_NUMBER_LIST = r"(\d+[a-zA-Z]{0,3}(?:\s*(?:,|and|&|or)\s*\d+[a-zA-Z]{0,3})*)"
ARTICLE_PATTERN = re.compile(rf"(?:\barticles?|\barts?\.|अनुच्छेद)\s*{_NUMBER_LIST}", re.IGNORECASE)
SECTION_PATTERN = re.compile(rf"(?:\bsections?|\bsecs?\.|धारा)\s*{_NUMBER_LIST}", re.IGNORECASE)
_NUMBER = re.compile(r"\d+[a-zA-Z]{0,3}")
# Linked provisions added per query; links are listed most important first.
MAX_LINKED = 3


def _numbers(pattern: re.Pattern, query: str) -> Set[str]:
    return {n.lower() for group in pattern.findall(query) for n in _NUMBER.findall(group)}


class HybridRetriever:
    """Combines dense (FAISS) and sparse (BM25) retrieval with direct article/section lookup."""

    def __init__(self, vector_store: FaissVectorStore, bm25_index: Bm25Index):
        self.vector_store = vector_store
        self.bm25_index = bm25_index
        # First chunk of each item, so a judgment's linked provisions can be added by ID.
        self.first_chunks: Dict[str, Dict[str, Any]] = {}
        for m in vector_store.metadata:
            self.first_chunks.setdefault(m["item_id"], m)
        self.act_aliases: Dict[str, str] = {
            alias.lower(): m["act_or_case_name"]
            for m in vector_store.metadata
            if m.get("source_type") == "act_section"
            for alias in m.get("act_aliases", [])
        }
        # "IPC 302", "BNS section 103": a section number written straight after an act's name.
        aliases = "|".join(re.escape(a) for a in sorted(self.act_aliases, key=len, reverse=True))
        self.alias_section_pattern = re.compile(
            rf"\b(?:{aliases})\s*(?:sections?|secs?\.|s\.)?\s*{_NUMBER_LIST}", re.IGNORECASE
        ) if aliases else None

    def _named_acts(self, query: str) -> Set[str]:
        lowered = query.lower()
        return {
            act
            for alias, act in self.act_aliases.items()
            if re.search(rf"\b{re.escape(alias)}\b", lowered)
        }

    def direct_lookup(self, query: str) -> List[Dict[str, Any]]:
        """Chunks for every article/section the query names explicitly.

        Article numbers match articles only. Section numbers match act sections only, restricted to
        the act(s) the query names; an unnamed section number is used only when exactly one act has it.
        A named repealed section also brings in the section that replaced it ("IPC 302" -> BNS 103).
        """
        articles = _numbers(ARTICLE_PATTERN, query)
        sections = _numbers(SECTION_PATTERN, query)
        if self.alias_section_pattern:
            sections |= _numbers(self.alias_section_pattern, query)
        if not articles and not sections:
            return []

        named_acts = self._named_acts(query)
        article_hits = []
        section_hits = []
        successor_hits = []
        for m in self.vector_store.metadata:
            number = str(m.get("number") or "").lower()
            if m.get("source_type") == "article" and number in articles:
                article_hits.append(m)
            elif m.get("source_type") == "act_section" and number in sections:
                section_hits.append(m)
            elif any(r["act"] in named_acts and r["number"].lower() in sections for r in m.get("replaces", [])):
                successor_hits.append(m)

        if named_acts:
            section_hits = [m for m in section_hits if m["act_or_case_name"] in named_acts]
        elif len({m["act_or_case_name"] for m in section_hits}) > 1:
            section_hits = []

        # Current law first: "IPC 302" puts BNS 103 ahead of the repealed IPC entry, so it becomes [S1].
        return article_hits + successor_hits + section_hits

    def hybrid_search(
        self, query: str, top_k: int, use_dense: bool = True, use_sparse: bool = True
    ) -> List[Dict[str, Any]]:
        """Weighted fusion of min-max-normalised dense and BM25 scores; either side can be switched off
        (System B is dense only).

        Min-max rather than divide-by-max, because e5 cosines are compressed into a narrow band
        (~0.80-0.85): dividing by the max gives every candidate ~1.0 and lets BM25 noise decide.

        Returns [] when the best raw dense cosine is below settings.min_relevance: the fused scores
        are normalised per query, so they cannot tell an off-topic query from an on-topic one.
        The floor applies even when use_dense is off, so every system rejects the same off-topic
        queries and the switches change only the ranking.
        """
        dense_results = self.vector_store.search(embed_query(query), top_k=top_k * 2)
        if not dense_results or dense_results[0][1] < settings.min_relevance:
            return []
        if not use_dense:
            dense_results = []
        sparse_results = self.bm25_index.search(query, top_k=top_k * 2) if use_sparse else []

        combined: Dict[str, Tuple[Dict[str, Any], float]] = {}
        for results, weight in ((dense_results, settings.dense_weight), (sparse_results, settings.sparse_weight)):
            if not results:
                continue
            low = min(score for _, score in results)
            spread = max(score for _, score in results) - low or 1.0
            for meta, score in results:
                key = meta["chunk_id"]
                prev = combined[key][1] if key in combined else 0.0
                combined[key] = (meta, prev + weight * (score - low) / spread)

        ranked = sorted(combined.values(), key=lambda x: x[1], reverse=True)[:top_k]
        return [{**meta, "score": score} for meta, score in ranked]

    def linked_provisions(self, results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """The provisions linked to retrieved judgments (data/corpus/case_links.json), so "What did
        Kesavananda decide?" also brings Article 368. Up to MAX_LINKED, each scored like its judgment."""
        present = {r["item_id"] for r in results}
        added: List[Dict[str, Any]] = []
        for hit in results:
            for item_id in hit.get("related_articles", []):
                if len(added) >= MAX_LINKED:
                    return added
                if item_id not in present and item_id in self.first_chunks:
                    present.add(item_id)
                    added.append({**self.first_chunks[item_id], "score": hit["score"]})
        return added

    def retrieve(
        self,
        query: str,
        top_k: int | None = None,
        use_case_links: bool = True,
        use_dense: bool = True,
        use_sparse: bool = True,
        use_reranker: bool = False,
    ) -> List[Dict[str, Any]]:
        """Direct hits first (score 1.0, never truncated), then hybrid results up to top_k, then the
        provisions linked to any retrieved judgment. With use_reranker, the hybrid results are the best
        top_k of settings.rerank_candidates by cross-encoder score."""
        top_k = top_k or settings.top_k

        results = [{**m, "score": 1.0} for m in self.direct_lookup(query)]
        seen = {r["chunk_id"] for r in results}
        pool = settings.rerank_candidates if use_reranker else top_k
        hits = self.hybrid_search(query, pool, use_dense=use_dense, use_sparse=use_sparse)
        if use_reranker:
            hits = rerank(query, [h for h in hits if h["chunk_id"] not in seen])
        for hit in hits:
            if len(results) >= top_k:
                break
            if hit["chunk_id"] not in seen:
                results.append(hit)
        if use_case_links:
            results += self.linked_provisions(results)
        return results
