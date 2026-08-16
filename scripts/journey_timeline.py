#!/usr/bin/env python3
"""Learning journey timeline — cheap version of Hermes Agent's `/journey`.

Hermes's own /journey is an interactive TUI/desktop visual (a "constellation"
you can scrub through, with per-node prune/edit). This workspace has no such
UI surface (coding.md §6: no checked-in HTML reports; human-viewable UI goes
through the Artifact tool, on demand, not persisted here) — so this is the
markdown-data half only: every learned memory/skill-candidate, oldest first,
one line each. Pipe to the Artifact tool if you want it rendered visually;
this script itself just emits data.

Pruning already exists via other paths, not duplicated here:
- Claude Code memory (projects/*/memory/*.md) — edit/delete the file directly
- skills/candidates/*.md — delete directly, or decay-scheduler flags stale ones
- agent-memory/knowledge/*.md — same

Usage: python3 journey_timeline.py [--json]
"""
from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path

CLAUDE_DIR = Path.home() / ".claude"
PROJECTS_DIR = CLAUDE_DIR / "projects"
KNOWLEDGE_DIR = CLAUDE_DIR / "agent-memory" / "knowledge"
CANDIDATES_DIR = CLAUDE_DIR / "skills" / "candidates"

FRONTMATTER_FIELD = re.compile(r"^(\w+):\s*(.+)$")


def parse_frontmatter(text: str) -> dict:
    if not text.startswith("---"):
        return {}
    end = text.find("\n---", 3)
    if end == -1:
        return {}
    block = text[3:end]
    fields = {}
    for line in block.splitlines():
        m = FRONTMATTER_FIELD.match(line.strip())
        if m:
            fields[m.group(1)] = m.group(2).strip().strip('"')
    return fields


def parse_iso(ts: str) -> datetime | None:
    for fmt in ("%Y-%m-%dT%H:%M:%S.%fZ", "%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%d"):
        try:
            return datetime.strptime(ts, fmt)
        except ValueError:
            continue
    return None


def collect_cc_memory() -> list[dict]:
    nodes = []
    if not PROJECTS_DIR.exists():
        return nodes
    for project_dir in sorted(PROJECTS_DIR.iterdir()):
        memory_dir = project_dir / "memory"
        if not memory_dir.is_dir():
            continue
        for f in sorted(memory_dir.glob("*.md")):
            if f.name == "MEMORY.md":
                continue
            fm = parse_frontmatter(f.read_text(errors="ignore"))
            ts = parse_iso(fm.get("modified", "")) or datetime.fromtimestamp(f.stat().st_mtime)
            nodes.append({
                "type": "memory",
                "subtype": fm.get("type", "?"),
                "name": fm.get("name", f.stem),
                "description": fm.get("description", ""),
                "timestamp": ts.isoformat(),
                "path": str(f.relative_to(Path.home())),
                "project": project_dir.name,
            })
    return nodes


def collect_knowledge() -> list[dict]:
    nodes = []
    if not KNOWLEDGE_DIR.exists():
        return nodes
    for f in sorted(KNOWLEDGE_DIR.glob("*.md")):
        ts = datetime.fromtimestamp(f.stat().st_mtime)
        first_line = ""
        for line in f.read_text(errors="ignore").splitlines():
            if line.strip() and not line.startswith("#") and line.strip() != "---":
                first_line = line.strip()[:100]
                break
        nodes.append({
            "type": "knowledge",
            "subtype": "pattern",
            "name": f.stem,
            "description": first_line,
            "timestamp": ts.isoformat(),
            "path": str(f.relative_to(Path.home())),
        })
    return nodes


def collect_candidates() -> list[dict]:
    nodes = []
    if not CANDIDATES_DIR.exists():
        return nodes
    for f in sorted(CANDIDATES_DIR.glob("*.md")):
        if f.name == "README.md":
            continue
        fm = parse_frontmatter(f.read_text(errors="ignore"))
        ts = parse_iso(fm.get("created_at", "")) or datetime.fromtimestamp(f.stat().st_mtime)
        hit_count = fm.get("hit_count", "?")
        nodes.append({
            "type": "skill-candidate",
            "subtype": f"hit_count={hit_count}",
            "name": fm.get("name", f.stem),
            "description": fm.get("description", ""),
            "timestamp": ts.isoformat(),
            "path": str(f.relative_to(Path.home())),
        })
    return nodes


def build_timeline() -> list[dict]:
    nodes = collect_cc_memory() + collect_knowledge() + collect_candidates()
    nodes.sort(key=lambda n: n["timestamp"])
    return nodes


def main() -> None:
    nodes = build_timeline()
    if "--json" in sys.argv:
        print(json.dumps(nodes, indent=2))
        return

    print(f"# Learning Journey — {len(nodes)} nodes (oldest first)\n")
    for n in nodes:
        date = n["timestamp"][:10]
        desc = f" — {n['description']}" if n["description"] else ""
        project = f" ({n['project']})" if n.get("project") else ""
        print(f"- {date}  [{n['type']}/{n['subtype']}]{project}  **{n['name']}**{desc}")
        print(f"  `{n['path']}`")


if __name__ == "__main__":
    main()
