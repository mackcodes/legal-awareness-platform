#!/usr/bin/env bash
# The whole Phase 10 evaluation, in order. Every step resumes where it stopped, so after any
# interruption run this again. Needs the RAG service running (python run.py).
#
# Usage (from rag-service/): bash scripts/eval/run_all.sh [delay seconds, default 13 for the free tier]
set -euo pipefail
cd "$(dirname "$0")/../.."
PY=venv/Scripts/python
DELAY=${1:-13}

# Run 1 first: the rated run, so judging can start before runs 2-3.
$PY scripts/eval/run_evaluation.py --runs 1 --delay "$DELAY"
[ -f eval/review/rating_sheet_all.csv ] || $PY scripts/eval/make_rating_sheet.py
$PY scripts/eval/judge_answers.py --delay "$DELAY"
$PY scripts/eval/run_evaluation.py --runs 3 --delay "$DELAY"
$PY scripts/eval/build_master_table.py
$PY scripts/eval/significance.py
echo "Evaluation complete."
