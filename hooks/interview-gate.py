#!/usr/bin/env python3
"""PreToolUse hook: deny Edit/Write unless Skill(interview) was invoked this
session. interview is the mandatory single entry point for every task -
its own SKILL.md Step 0 fast-paths trivial/clear-scope work (1-line check)
rather than blocking, then hands off to whichever skill routing.md's table
says fits (debug-mantra, dev-architect, etc.). So requiring "interview"
specifically - not just any skill - is what forces every task through that
routing step instead of letting the agent jump straight to a specific skill.
Fail-open on any error - a broken gate must never block a legitimate edit.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from _gate_common import skill_invoked  # noqa: E402


def main():
    data = json.load(sys.stdin)
    if data.get("tool_name") not in ("Edit", "Write"):
        return

    transcript_path = data.get("transcript_path")
    if not transcript_path:
        return

    if not skill_invoked(transcript_path, "interview"):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    "interview has not run yet this session. Call Skill(interview) "
                    "first - it is the mandatory entry point for every task "
                    "(rules/routing.md), then it routes to the fitting skill. "
                    "Step 0 is a 1-line scope check for trivial/clear work, not a "
                    "blocker."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
