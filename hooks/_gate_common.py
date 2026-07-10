"""Shared helpers for PreToolUse gate hooks. Fail-open: callers catch all errors."""
import json


def skill_invoked(transcript_path, skill_name=None):
    """Return True if a Skill tool_use appears in the transcript.

    skill_name=None matches any Skill(...) call; pass a name to require that
    specific skill.
    """
    with open(transcript_path) as f:
        for line in f:
            try:
                obj = json.loads(line)
            except Exception:
                continue
            content = obj.get("message", {}).get("content")
            if not isinstance(content, list):
                continue
            for block in content:
                if (isinstance(block, dict)
                        and block.get("type") == "tool_use"
                        and block.get("name") == "Skill"):
                    if skill_name is None or block.get("input", {}).get("skill") == skill_name:
                        return True
    return False
