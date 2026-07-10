#!/usr/bin/env python3
"""PreToolUse hook: deny Edit/Write on dev-task-progress.md / qa-task-progress.md
unless the matching design skill ran this session. Fail-open on any error."""
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

    file_path = data.get("tool_input", {}).get("file_path", "")
    if not file_path:
        return

    if file_path.endswith("dev-task-progress.md"):
        required_skill = "dev-architect"
    elif file_path.endswith("qa-task-progress.md"):
        required_skill = "qa-architect"
    else:
        return

    if not skill_invoked(transcript_path, required_skill):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"{required_skill} has not run yet this session. Design must "
                    f"complete before task breakdown (dev-architect/qa-architect "
                    f"SKILL.md Step 0 chain). Call Skill({required_skill}) first."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
