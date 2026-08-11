#!/usr/bin/env python3
"""Log one confirm/reject outcome from project_router.py's guess, for
scripts/router-calibration-scheduler.sh to learn real thresholds from.

Takes structured input from a file (never argv/stdin free text directly) --
same untrusted-text reasoning as project_router.py's --query-file: a Kouen
task title or a user's correction is free text and must never be
shell-interpolated. Write the outcome JSON with the Write tool first, then
point this script at that file.

Input file format (JSON):
{
  "query": "<the task title that was guessed on>",
  "top_score": 0.337,
  "second_score": 0.120,
  "guessed_project": "~/Git/Personal/Fitness-Tracker",
  "outcome": "confirmed" | "rejected",
  "actual_project": "~/Git/Personal/Foo"   # optional, only if outcome=rejected and user stated it
}

Usage: router_log_outcome.py --outcome-file <path>
"""
from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

LOG_PATH = Path.home() / ".claude" / "agent-memory" / "router-calibration-log.jsonl"
REQUIRED_FIELDS = ("query", "top_score", "second_score", "guessed_project", "outcome")
VALID_OUTCOMES = ("confirmed", "rejected")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--outcome-file", required=True, help="path to the outcome JSON (see module docstring)")
    args = parser.parse_args()

    try:
        data = json.loads(Path(args.outcome_file).read_text())
    except Exception as e:
        print(f"could not read/parse outcome file: {e}", file=sys.stderr)
        sys.exit(1)

    missing = [f for f in REQUIRED_FIELDS if f not in data]
    if missing:
        print(f"missing required field(s): {', '.join(missing)}", file=sys.stderr)
        sys.exit(1)
    if data["outcome"] not in VALID_OUTCOMES:
        print(f"outcome must be one of {VALID_OUTCOMES}, got {data['outcome']!r}", file=sys.stderr)
        sys.exit(1)

    entry = {
        "logged_at": datetime.now(timezone.utc).isoformat(),
        "query": data["query"],
        "top_score": float(data["top_score"]),
        "second_score": float(data["second_score"]),
        "guessed_project": data["guessed_project"],
        "outcome": data["outcome"],
        "actual_project": data.get("actual_project"),
    }

    LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    with LOG_PATH.open("a") as f:
        f.write(json.dumps(entry) + "\n")

    print(f"logged: {entry['outcome']} for {entry['guessed_project']!r}")


if __name__ == "__main__":
    main()
