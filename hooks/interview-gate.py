#!/usr/bin/env python3
"""PreToolUse hook: deny Edit/Write unless some Skill(...) was invoked this
session. routing.md only requires Skill(interview) specifically when scope is
unclear - for clear-scope tasks (bug fix, etc.) routing.md sends the agent
straight to the matching skill (debug-mantra, etc.) instead. So this gate
accepts ANY skill call as evidence the routing table was consulted, not just
"interview" literally. Fail-open on any error - a broken gate must never
block a legitimate edit.
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

    if not skill_invoked(transcript_path):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    "No Skill(...) invoked yet this session. Per rules/routing.md, "
                    "call the skill that matches this task first (or Skill(interview) "
                    "if scope/intent is unclear) before file edits."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
