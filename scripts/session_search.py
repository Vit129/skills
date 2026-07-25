#!/usr/bin/env python3
"""Full-text search across indexed session transcripts.
Run session_search_index.py first (or let this script auto-run it).

Usage:
    python3 session_search.py "<query>" [--limit N] [--project SLUG]
"""
from __future__ import annotations

import argparse
import sqlite3
import subprocess
import sys
from pathlib import Path

DB_PATH = Path.home() / ".claude" / "agent-memory" / "session-search.db"
INDEXER = Path(__file__).parent / "session_search_index.py"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("query")
    parser.add_argument("--limit", type=int, default=10)
    parser.add_argument("--project", default=None, help="filter to one project dir slug")
    parser.add_argument("--no-reindex", action="store_true", help="skip the auto incremental reindex")
    args = parser.parse_args()

    if not args.no_reindex:
        subprocess.run([sys.executable, str(INDEXER)], check=False, stdout=subprocess.DEVNULL)

    if not DB_PATH.exists():
        print("No index yet -- run session_search_index.py first.", file=sys.stderr)
        sys.exit(1)

    con = sqlite3.connect(str(DB_PATH))
    sql = (
        "SELECT project, role, timestamp, snippet(messages_fts, 0, '[', ']', ' ... ', 20) "
        "FROM messages_fts WHERE messages_fts MATCH ? "
    )
    params: list = [args.query]
    if args.project:
        sql += "AND project = ? "
        params.append(args.project)
    sql += "ORDER BY rank LIMIT ?"
    params.append(args.limit)

    rows = con.execute(sql, params).fetchall()
    con.close()

    if not rows:
        print(f"No matches for: {args.query}")
        return

    for project, role, timestamp, snippet in rows:
        date = timestamp.split("T")[0] if timestamp else "?"
        print(f"[{date}] {project} ({role})")
        print(f"  {snippet}")
        print()


if __name__ == "__main__":
    main()
