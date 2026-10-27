import re
from typing import Any, Dict, List, Set, Tuple

from .bm25_index import Bm25Index
from .config import settings
from .embeddings import embed_query
from .vector_store import FaissVectorStore

_NUMBER_LIST = r"(\d+[a-zA-Z]{0,3}(?:\s*(?:,|and|&|or)\s*\d+[a-zA-Z]{0,3})*)"
ARTICLE_PATTERN = re.compile(rf"(?:\barticles?|\barts?\.|अनुच्छेद)\s*{_NUMBER_LIST}", re.IGNORECASE)
SECTION_PATTERN = re.compile(rf"(?:\bsections?|\bsecs?\.|धारा)\s*{_NUMBER_LIST}", re.IGNORECASE)
_NUMBER = re.compile(r"\d+[a-zA-Z]{0,3}")


def _numbers(pattern: re.Pattern, query: str) -> Set[str]:
    return {n.lower() for group in pattern.findall(query) for n in _NUMBER.findall(group)}


class HybridRetriever:
    """Combines dense (FAISS) and sparse (BM25) retrieval with direct article/section lookup."""

    def __init__(self, vector_store: FaissVectorStore, bm25_index: Bm25Index):
        self.vector_store = vector_store
        self.bm25_index = bm25_index
        self.act_aliases: Dict[str, str] = {
            alias.lower(): m["act_or_case_name"]
            for m in vector_store.metadata
            if m.get("source_type") == "act_section"
            for alias in m.get("act_aliases", [])
        }

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
        """
        articles = _numbers(ARTICLE_PATTERN, query)
        sections = _numbers(SECTION_PATTERN, query)
        if not articles and not sections:
            return []

        article_hits = []
        section_hits = []
        for m in self.vector_store.metadata:
            number = str(m.get("number") or "").lower()
            if m.get("source_type") == "article" and number in articles:
                article_hits.append(m)
            elif m.get("source_type") == "act_section" and number in sections:
                section_hits.append(m)

        named_acts = self._named_acts(query)
        if named_acts:
            section_hits = [m for m in section_hits if m["act_or_case_name"] in named_acts]
        elif len({m["act_or_case_name"] for m in section_hits}) > 1:
            section_hits = []

        return article_hits + section_hits

    def hybrid_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
        """Weighted fusion of max-normalised dense and BM25 scores.

        Returns [] when the best raw dense cosine is below settings.min_relevance: the fused scores
        are normalised per query, so they cannot tell an off-topic query from an on-topic one.
        """
        dense_results = self.vector_store.search(embed_query(query), top_k=top_k * 2)
        if not dense_results or dense_results[0][1] < settings.min_relevance:
            return []
        sparse_results = self.bm25_index.search(query, top_k=top_k * 2)

        combined: Dict[str, Tuple[Dict[str, Any], float]] = {}
        for results, weight in ((dense_results, settings.dense_weight), (sparse_results, settings.sparse_weight)):
            max_score = max((score for _, score in results), default=0.0) or 1.0
            for meta, score in results:
                key = meta["chunk_id"]
                prev = combined[key][1] if key in combined else 0.0
                combined[key] = (meta, prev + weight * score / max_score)

        ranked = sorted(combined.values(), key=lambda x: x[1], reverse=True)[:top_k]
        return [{**meta, "score": score} for meta, score in ranked]

    def retrieve(self, query: str, top_k: int | None = None) -> List[Dict[str, Any]]:
        """Direct hits first (score 1.0, never truncated), then hybrid results up to top_k."""
        top_k = top_k or settings.top_k

        results = [{**m, "score": 1.0} for m in self.direct_lookup(query)]
        seen = {r["chunk_id"] for r in results}
        for hit in self.hybrid_search(query, top_k):
            if len(results) >= top_k:
                break
            if hit["chunk_id"] not in seen:
                results.append(hit)
        return results
