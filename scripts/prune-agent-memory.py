#!/usr/bin/env python3
"""
Prune stale entries from a single agent-memory/ directory.
Pruned content is archived to COMPLETED-TASKS-ARCHIVE.md, never deleted outright.

Usage:
  prune-agent-memory.py <agent-memory-dir> [keep_days=7] [max_prev_rows=5]
"""

import re
import sys
from datetime import date, timedelta
from pathlib import Path

DIR = Path(sys.argv[1]).expanduser().resolve()
KEEP_DAYS = int(sys.argv[2]) if len(sys.argv) > 2 else 7
MAX_PREV_ROWS = int(sys.argv[3]) if len(sys.argv) > 3 else 5
CUTOFF = date.today() - timedelta(days=KEEP_DAYS)

MEMORY = DIR / "MEMORY.md"
CONTEXT = DIR / "CONTEXT.md"
ARCHIVE = DIR / "COMPLETED-TASKS-ARCHIVE.md"


def parse_date(s: str) -> date | None:
    try:
        return date.fromisoformat(s)
    except ValueError:
        return None


def prune_memory(text: str) -> tuple[str, int, str]:
    lines = text.splitlines(keepends=True)
    out = []
    archived = []
    removed = 0
    in_decisions = False

    i = 0
    while i < len(lines):
        line = lines[i]

        if line.startswith("## Active Decisions"):
            in_decisions = True
            out.append(line)
            i += 1
            continue
        if line.startswith("## ") and in_decisions:
            in_decisions = False

        if in_decisions and line.startswith("- ["):
            m = re.match(r"- \[(\d{4}-\d{2}-\d{2})\]", line)
            if m:
                d = parse_date(m.group(1))
                if d and d <= CUTOFF:
                    removed += 1
                    archived.append(line)
                    i += 1
                    continue

        # Drop freeform dated H2 sections (e.g. "## 2026-06-25 — ...")
        if line.startswith("## "):
            m = re.match(r"## (\d{4}-\d{2}-\d{2})", line)
            if m:
                d = parse_date(m.group(1))
                if d and d <= CUTOFF:
                    removed += 1
                    archived.append(line)
                    i += 1
                    while i < len(lines) and not lines[i].startswith("## "):
                        archived.append(lines[i])
                        i += 1
                    continue

        out.append(line)
        i += 1

    return "".join(out), removed, "".join(archived)


def prune_context(text: str) -> tuple[str, int, str]:
    """
    1. Drop ### Previous: YYYY-MM-DD and ### This session (YYYY-MM-DD) blocks older than cutoff.
    2. Trim oldest rows from the 'Previous sessions' table (max MAX_PREV_ROWS).
    """
    lines = text.splitlines(keepends=True)
    removed = 0
    archived = []

    # Pass 1: drop stale dated ### blocks (### Previous: / ### This session)
    out = []
    i = 0
    while i < len(lines):
        line = lines[i]
        m = re.match(r"### (?:Previous[:\s]+|This session[:\s]*\(?)(\d{4}-\d{2}-\d{2})", line)
        if m:
            d = parse_date(m.group(1))
            if d and d <= CUTOFF:
                removed += 1
                archived.append(line)
                i += 1
                while i < len(lines) and not re.match(r"#{2,3} ", lines[i]):
                    archived.append(lines[i])
                    i += 1
                continue
        out.append(line)
        i += 1
    lines = out

    # Pass 2: trim previous sessions table rows
    table_header_idx = None
    for idx, line in enumerate(lines):
        if "| Date" in line and "| Task" in line:
            table_header_idx = idx
            break

    if table_header_idx is None:
        return "".join(lines), removed, "".join(archived)

    header_lines = lines[:table_header_idx + 2]
    rows = []
    i = table_header_idx + 2
    while i < len(lines) and lines[i].startswith("|"):
        rows.append(lines[i])
        i += 1
    rest = lines[i:]

    if len(rows) > MAX_PREV_ROWS:
        removed += len(rows) - MAX_PREV_ROWS
        archived.extend(rows[: len(rows) - MAX_PREV_ROWS])
        rows = rows[-MAX_PREV_ROWS:]

    return "".join(header_lines + rows + rest), removed, "".join(archived)


def run(path: Path, prune_fn, label: str):
    if not path.exists():
        return
    text = path.read_text()
    new_text, n, archived = prune_fn(text)
    if n:
        path.write_text(new_text)
        if archived.strip():
            with ARCHIVE.open("a") as f:
                f.write(f"\n## Pruned from {label} — {date.today().isoformat()}\n")
                f.write(archived)
                if not archived.endswith("\n"):
                    f.write("\n")
        print(f"    {label}: -{n} (archived to {ARCHIVE.name})")
    else:
        print(f"    {label}: clean")


print(f"  {DIR}")
run(MEMORY, prune_memory, "MEMORY.md")
run(CONTEXT, prune_context, "CONTEXT.md")
