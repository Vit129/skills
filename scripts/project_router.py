#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["sentence-transformers", "numpy"]
# ///
"""Content-based project guess for a free-text note (e.g. a Kouen Task title).

Second signal for rules/routing.md's Kouen Task Sync flow, alongside the
existing live-session cwd cross-reference — fires even after the originating
session is closed. Always prints a candidate guess or an explicit
"no confident match"; never picks silently. The confirm-with-user step in
routing.md is unchanged by this script.

Usage:
    uv run project_router.py "<task title>" [--include-company] [--limit N]
        [--min-score S] [--margin M] [--show-all] [--reindex-all]
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

CLAUDE_DIR = Path.home() / ".claude"
INDEX_PATH = CLAUDE_DIR / "agent-memory" / ".state" / "project-router-index.json"
THRESHOLDS_PATH = CLAUDE_DIR / "agent-memory" / ".state" / "router-thresholds.json"
CALIBRATION_LOG_PATH = CLAUDE_DIR / "agent-memory" / "router-calibration-log.jsonl"
# paraphrase-multilingual-MiniLM-L12-v2, not all-MiniLM-L6-v2: the latter is
# English-only and was found (2026-08-12, live testing) to collapse EVERY
# pure-Thai query to the identical embedding vector regardless of content
# (cosine similarity 1.0 across 3 unrelated Thai sentences) -- its tokenizer
# has no Thai vocabulary. Verified the multilingual model actually
# discriminates by meaning AND recognizes cross-lingual equivalence: Thai
# "went to gym" vs English "went to the gym" (same meaning) scored 0.66,
# vs 0.31-0.49 against unrelated Thai sentences.
MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
MAX_CHARS_PER_SOURCE = 900  # explicit cutoff ahead of MiniLM's own silent 256-wordpiece truncation

PERSONAL_ROOT = Path.home() / "Git" / "Personal"
COMPANY_ROOT = Path.home() / "Git" / "Company"
SKIP_PROJECTS = {"9arm-skills"}  # read-only third-party clone, core.md No-Touch Paths
SKIP_DIR_NAMES = {"untitled folder"}  # confirmed junk, not a real project

# Defaults — used until scripts/router-calibration-scheduler.sh has enough
# real confirm/reject outcomes (from CALIBRATION_LOG_PATH) to write real
# values to THRESHOLDS_PATH. --min-score/--margin CLI flags always win over
# both.
DEFAULT_MIN_ABS_SCORE = 0.15
DEFAULT_MIN_MARGIN = 0.03


def load_calibrated_thresholds() -> tuple[float, float]:
    if THRESHOLDS_PATH.exists():
        try:
            data = json.loads(THRESHOLDS_PATH.read_text())
            if data.get("model") != MODEL_NAME:
                # Same reasoning as load_index()'s _model check -- a
                # threshold calibrated against a different model's score
                # distribution is meaningless here, fall back to defaults
                # rather than applying a wrong-scale number silently.
                return DEFAULT_MIN_ABS_SCORE, DEFAULT_MIN_MARGIN
            return float(data["min_abs_score"]), float(data["min_margin"])
        except Exception:
            pass
    return DEFAULT_MIN_ABS_SCORE, DEFAULT_MIN_MARGIN


def discover_projects(include_company: bool) -> list[Path]:
    roots = [PERSONAL_ROOT] + ([COMPANY_ROOT] if include_company else [])
    projects = []
    for root in roots:
        if not root.exists():
            continue
        for d in sorted(root.iterdir()):
            if not d.is_dir():
                continue
            if d.name.startswith("."):
                continue
            if d.name in SKIP_PROJECTS or d.name in SKIP_DIR_NAMES:
                continue
            projects.append(d)
    return projects


def build_identity_text(project_dir: Path) -> tuple[str, list[str], float]:
    parts, sources, mtimes = [], [], []
    for fname in ("README.md", "PRODUCT.md"):
        f = project_dir / fname
        if f.exists():
            raw = f.read_text(errors="ignore")[:MAX_CHARS_PER_SOURCE]
            parts.append(raw)
            sources.append(fname)
            mtimes.append(f.stat().st_mtime)
    if parts:
        return "\n\n".join(parts), sources, max(mtimes)
    return project_dir.name, [], project_dir.stat().st_mtime


def load_index() -> dict:
    if not INDEX_PATH.exists():
        return {}
    data = json.loads(INDEX_PATH.read_text())
    if data.get("_model") != MODEL_NAME:
        # Different embedding space -- vectors from another model are not
        # comparable (this is exactly the class of bug that produced the
        # cosine=1.0-for-everything failure mode: silently mixing
        # incompatible embeddings). Discard entirely, forces a full
        # re-embed on next build_index() rather than serving nonsense.
        return {}
    return data.get("entries", {})


def save_index(index: dict) -> None:
    INDEX_PATH.parent.mkdir(parents=True, exist_ok=True)
    INDEX_PATH.write_text(json.dumps({"_model": MODEL_NAME, "entries": index}))


def build_index(include_company: bool, force: bool = False, model=None) -> dict:
    index = {} if force else load_index()
    projects = discover_projects(include_company)
    to_embed = []
    live_keys = set()
    for p in projects:
        key = str(p)
        live_keys.add(key)
        text, sources, mtime = build_identity_text(p)
        cached = index.get(key)
        if cached and cached.get("mtime") == mtime and cached.get("sources") == sources:
            continue
        to_embed.append((key, mtime, sources, text))

    for k in list(index):
        if k not in live_keys:
            del index[k]

    if to_embed:
        if model is None:
            from sentence_transformers import SentenceTransformer
            model = SentenceTransformer(MODEL_NAME)
        texts = [t for *_, t in to_embed]
        vectors = model.encode(texts, normalize_embeddings=True).tolist()
        for (key, mtime, sources, _), vec in zip(to_embed, vectors):
            index[key] = {"mtime": mtime, "sources": sources, "vector": vec}

    save_index(index)
    return index


def query(text: str, include_company: bool, limit: int, model=None) -> list[tuple[str, float]]:
    import numpy as np

    # Loaded once (or reused from the caller, e.g. main()'s --reindex-all pass)
    # and reused for build_index()'s re-embedding pass too — avoids paying
    # model-load cost twice in the common case of an actively edited workspace
    # (some project's README/PRODUCT.md changed since last run).
    if model is None:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer(MODEL_NAME)
    index = build_index(include_company, model=model)
    if not index:
        return []

    q_vec = model.encode([text], normalize_embeddings=True)[0]

    keys = list(index.keys())
    matrix = np.array([index[k]["vector"] for k in keys])
    scores = matrix @ q_vec
    ranked = sorted(zip(keys, scores.tolist()), key=lambda x: x[1], reverse=True)
    return ranked[:limit]


def main() -> None:
    default_min_score, default_margin = load_calibrated_thresholds()

    parser = argparse.ArgumentParser(
        description="Content-based project guess for a free-text task title "
        "(Kouen Task Sync signal #2 — candidate guess only, never a silent action)"
    )
    parser.add_argument(
        "text", nargs="?", default=None,
        help="free-text query, typically a Kouen task title. Prefer --query-file "
        "for text from an untrusted/free-text source (e.g. a Kouen task title) — "
        "avoids shell-interpolating arbitrary content into the command string.",
    )
    parser.add_argument(
        "--query-file", type=str, default=None,
        help="read the query text from this file instead of argv (write the task "
        "title here with the Write tool first) — the safe path for untrusted text",
    )
    parser.add_argument(
        "--include-company", action="store_true",
        help="also index ~/Git/Company/* (opt-in, see routing.md)",
    )
    parser.add_argument("--limit", type=int, default=3)
    parser.add_argument("--min-score", type=float, default=default_min_score)
    parser.add_argument("--margin", type=float, default=default_margin)
    parser.add_argument(
        "--show-all", action="store_true",
        help="bypass confidence gating, print raw ranked list (for calibration)",
    )
    parser.add_argument(
        "--json", action="store_true",
        help="machine-readable output for the calibration-logging step "
        "(scripts/router_log_outcome.py) instead of the human-readable text",
    )
    parser.add_argument("--reindex-all", action="store_true")
    args = parser.parse_args()

    if args.query_file:
        query_text = Path(args.query_file).read_text().strip()
    elif args.text is not None:
        query_text = args.text
    else:
        parser.error("provide either a positional query or --query-file")

    model = None
    if args.reindex_all:
        from sentence_transformers import SentenceTransformer
        model = SentenceTransformer(MODEL_NAME)
        build_index(args.include_company, force=True, model=model)

    results = query(query_text, args.include_company, max(args.limit, 2), model=model)
    home = str(Path.home())

    if not results:
        if args.json:
            print(json.dumps({"error": "no_projects_discovered"}))
            sys.exit(1)
        print(
            "No index yet — no projects discovered under ~/Git/Personal "
            "(and ~/Git/Company if --include-company).",
            file=sys.stderr,
        )
        sys.exit(1)

    top_score = results[0][1]
    second_score = results[1][1] if len(results) > 1 else -1.0
    confident = (top_score >= args.min_score) and (top_score - second_score >= args.margin)

    if args.json:
        # For scripts/router_log_outcome.py -- write this straight to a file
        # (untrusted-text-safe, same reasoning as --query-file) and pass that
        # file's path to router_log_outcome.py rather than re-typing scores
        # into a shell command.
        print(json.dumps({
            "query": query_text,
            "top_project": results[0][0].replace(home + "/", "~/"),
            "top_score": top_score,
            "second_score": second_score,
            "confident": confident,
            "min_score_used": args.min_score,
            "margin_used": args.margin,
        }))
        return

    if not args.show_all and not confident:
        print(
            "No confident content-based match (best guess below threshold "
            "or too close to runner-up) — cwd cross-reference and manual "
            "confirm are still required."
        )
        sys.exit(0)

    index = load_index()
    for path, score in results[: args.limit]:
        rel = path.replace(home + "/", "~/")
        sources = index.get(path, {}).get("sources", [])
        tag = "" if sources else "  (name only — no README.md/PRODUCT.md, weak signal)"
        print(f"{score:.3f}  {rel}{tag}")


if __name__ == "__main__":
    main()
