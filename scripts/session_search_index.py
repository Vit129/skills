#!/usr/bin/env python3
"""Incrementally index ~/.claude/projects/*/*.jsonl session transcripts into a
SQLite FTS5 database for cross-session full-text recall.

Narrow, native version of the one real gap found comparing against Hermes
Agent (github.com/NousResearch/hermes-agent): FTS5 session search. Built as a
small addition to ~/.claude, not by adopting Hermes's own agent runtime --
see agent-memory/knowledge/ for that decision.

Only user/assistant text turns are indexed (no thinking blocks, no raw tool
output) -- this is conversational recall, not a full transcript replay.

Usage:
    python3 session_search_index.py            # incremental (default)
    python3 session_search_index.py --rebuild  # drop and reindex everything
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from pathlib import Path

CLAUDE_HOME = Path.home() / ".claude"
PROJECTS_DIR = CLAUDE_HOME / "projects"
DB_PATH = CLAUDE_HOME / "agent-memory" / ".state" / "session-search.db"


def _extract_text(entry: dict) -> str | None:
    msg = entry.get("message")
    if not isinstance(msg, dict):
        return None
    content = msg.get("content")
    if isinstance(content, str):
        text = content.strip()
        return text or None
    if isinstance(content, list):
        parts = [
            block.get("text", "").strip()
            for block in content
            if isinstance(block, dict) and block.get("type") == "text"
        ]
        parts = [p for p in parts if p]
        return "\n".join(parts) if parts else None
    return None


def _ensure_schema(con: sqlite3.Connection) -> None:
    con.executescript(
        """
        CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
            content, session_id UNINDEXED, project UNINDEXED,
            role UNINDEXED, timestamp UNINDEXED, cwd UNINDEXED
        );
        CREATE TABLE IF NOT EXISTS indexed_files (
            path TEXT PRIMARY KEY, mtime REAL NOT NULL,
            size INTEGER NOT NULL, bytes_indexed INTEGER NOT NULL
        );
        """
    )


def _index_file(con: sqlite3.Connection, path: Path, project: str, resume_offset: int) -> int:
    added = 0
    with path.open("rb") as fh:
        fh.seek(resume_offset)
        for raw_line in fh:
            try:
                entry = json.loads(raw_line)
            except (json.JSONDecodeError, UnicodeDecodeError):
                continue
            if entry.get("type") not in ("user", "assistant"):
                continue
            text = _extract_text(entry)
            if not text or len(text) < 4:
                continue
            msg = entry.get("message") or {}
            con.execute(
                "INSERT INTO messages_fts (content, session_id, project, role, timestamp, cwd) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (
                    text,
                    entry.get("sessionId", ""),
                    project,
                    msg.get("role", entry.get("type", "")),
                    entry.get("timestamp", ""),
                    entry.get("cwd", ""),
                ),
            )
            added += 1
        new_offset = fh.tell()
    return added, new_offset


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--rebuild", action="store_true", help="drop and reindex everything")
    args = parser.parse_args()

    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    if args.rebuild and DB_PATH.exists():
        DB_PATH.unlink()

    con = sqlite3.connect(str(DB_PATH))
    _ensure_schema(con)

    files = sorted(PROJECTS_DIR.glob("**/*.jsonl"))
    total_added = 0
    files_touched = 0
    for path in files:
        stat = path.stat()
        project = path.relative_to(PROJECTS_DIR).parts[0]
        row = con.execute(
            "SELECT mtime, size, bytes_indexed FROM indexed_files WHERE path = ?",
            (str(path),),
        ).fetchone()
        resume_offset = 0
        if row is not None:
            old_mtime, old_size, bytes_indexed = row
            if stat.st_mtime == old_mtime and stat.st_size == old_size:
                continue  # unchanged, nothing to do
            if stat.st_size >= old_size:
                resume_offset = bytes_indexed  # grew (or same) -> resume from last offset
            # else: file shrank/rewritten -- fall through, resume_offset stays 0 (full reindex of this file)

        added, new_offset = _index_file(con, path, project, resume_offset)
        con.execute(
            "INSERT INTO indexed_files (path, mtime, size, bytes_indexed) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(path) DO UPDATE SET mtime=excluded.mtime, size=excluded.size, "
            "bytes_indexed=excluded.bytes_indexed",
            (str(path), stat.st_mtime, stat.st_size, new_offset),
        )
        total_added += added
        if added:
            files_touched += 1

    con.commit()
    total_rows = con.execute("SELECT count(*) FROM messages_fts").fetchone()[0]
    con.close()
    print(
        f"Indexed {total_added} new message(s) across {files_touched} file(s) "
        f"({len(files)} total transcripts scanned). {total_rows} messages in index."
    )


if __name__ == "__main__":
    main()
