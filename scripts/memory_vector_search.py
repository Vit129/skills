#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["sentence-transformers", "numpy"]
# ///
"""Semantic (embedding) search across curated memory files — agent-memory/*.md,
agent-memory/knowledge/**/*.md, skills/candidates/*.md, projects/*/memory/*.md.

Complements session_search.py (raw transcript, FTS5 keyword) with meaning-based
recall over the *curated* memory layer, using the same sentence-transformers
model class already declared as graphify's optional `embeddings` extra
(pyproject.toml) — no new library choice, same locally-run model, no hosted API.

Usage:
    uv run memory_vector_search.py "<query>" [--limit N] [--reindex-all]

First run downloads the model (~90MB, one-time, cached by sentence-transformers
in ~/.cache). Index is incremental: a file is only re-embedded when its mtime
changes since the last index build.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

CLAUDE_DIR = Path.home() / ".claude"
INDEX_PATH = CLAUDE_DIR / "agent-memory" / ".state" / "memory-vectors.json"
MODEL_NAME = "all-MiniLM-L6-v2"

SOURCE_GLOBS = [
    CLAUDE_DIR / "agent-memory",
    CLAUDE_DIR / "skills" / "candidates",
    CLAUDE_DIR / "projects",
]
EXCLUDE_NAMES = {"README.md", "MEMORY.md", "PLAYBOOK.md", "SKILL-LOG.md",
                  "EVAL-STATE.md", "CANDIDATE-STATE.md", "DECAY-STATE.md"}


def collect_files() -> list[Path]:
    files: list[Path] = []
    for root in SOURCE_GLOBS:
        if not root.exists():
            continue
        for f in root.rglob("*.md"):
            if f.name in EXCLUDE_NAMES:
                continue
            if "/.state/" in str(f) or "/decay-checks/" in str(f) or "/evals/" in str(f) or "/candidate-checks/" in str(f):
                continue
            files.append(f)
    return files


def load_index() -> dict:
    if INDEX_PATH.exists():
        return json.loads(INDEX_PATH.read_text())
    return {}


def save_index(index: dict) -> None:
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    INDEX_PATH.write_text(json.dumps(index))


def build_index(force: bool = False) -> dict:
    from sentence_transformers import SentenceTransformer

    index = {} if force else load_index()
    files = collect_files()
    to_embed = []
    for f in files:
        key = str(f)
        mtime = f.stat().st_mtime
        cached = index.get(key)
        if cached and cached.get("mtime") == mtime:
            continue
        to_embed.append((key, mtime, f))

    stale_keys = [k for k in index if k not in {str(f) for f in files}]
    for k in stale_keys:
        del index[k]

    if to_embed:
        model = SentenceTransformer(MODEL_NAME)
        texts = [f.read_text(errors="ignore") for _, _, f in to_embed]
        vectors = model.encode(texts, normalize_embeddings=True).tolist()
        for (key, mtime, _), vec in zip(to_embed, vectors):
            index[key] = {"mtime": mtime, "vector": vec}

    save_index(index)
    return index


def search(query: str, limit: int) -> list[tuple[str, float]]:
    import numpy as np
    from sentence_transformers import SentenceTransformer

    index = build_index()
    if not index:
        return []

    model = SentenceTransformer(MODEL_NAME)
    q_vec = model.encode([query], normalize_embeddings=True)[0]

    keys = list(index.keys())
    matrix = np.array([index[k]["vector"] for k in keys])
    scores = matrix @ q_vec
    ranked = sorted(zip(keys, scores.tolist()), key=lambda x: x[1], reverse=True)
    return ranked[:limit]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    parser.add_argument("--limit", type=int, default=5)
    parser.add_argument("--reindex-all", action="store_true", help="re-embed every file, ignore mtime cache")
    args = parser.parse_args()

    if args.reindex_all:
        build_index(force=True)

    results = search(args.query, args.limit)
    if not results:
        print("No memory files indexed yet.", file=sys.stderr)
        sys.exit(1)

    for path, score in results:
        rel = path.replace(str(Path.home()) + "/", "")
        print(f"{score:.3f}  {rel}")


if __name__ == "__main__":
    main()
