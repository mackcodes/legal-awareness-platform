from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    gemini_api_key: str = ""
    gemini_api_url: str = (
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
    )
    embedding_model_name: str = "intfloat/multilingual-e5-small"
    corpus_path: str = "data/corpus/full_corpus.json"
    corpus_version: str = "Corpus of 28 Oct 2026: COI as on 1 May 2024; Acts from India Code and Gazette prints incl. Labour Codes, MV Act, POCSO, POSH, DV Act; BPR&D IPC-BNS mapping; 34 SC judgments (S.C.R. headnotes, AWS Open Data); app-data"
    index_dir: str = "data/index"
    top_k: int = 5
    reranker_model_name: str = "BAAI/bge-reranker-v2-m3"
    # Hybrid candidates passed to the reranker, which keeps the best top_k.
    rerank_candidates: int = 20
    dense_weight: float = 0.6
    sparse_weight: float = 0.4
    # Floor on the raw dense cosine of the best hit; below it the query is treated as out of scope.
    min_relevance: float = 0.79
    rag_service_port: int = 8000
    # Required header value for /chat when set; see DEPLOYMENT.md.
    rag_shared_secret: str = ""
    log_path: str = "data/logs/rag_queries.jsonl"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
