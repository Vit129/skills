#!/usr/bin/env python3
"""PreToolUse hook (global, applies to every project): deny Edit/Write if the
current project's own CLAUDE.md declares a mandatory pre-work skill (a
'## ... MANDATORY ...' section containing `Skill(name)`) and that skill hasn't
run yet this session. One shared gate instead of a bespoke per-project script -
any project can opt in just by writing that section in its own CLAUDE.md.
Fail-open on any error - a broken gate must never block a legitimate edit."""
import json
import os
import re
import sys

MANDATORY_HEADING = re.compile(r"^#+.*mandatory.*$", re.IGNORECASE)
SKILL_CALL = re.compile(r"`Skill\(([a-zA-Z0-9_-]+)\)`")


def find_mandatory_skill(claude_md_path):
    """Return (skill_name, section_title) from the first '## ... MANDATORY ...'
    section that names a Skill(...), or None if there's no such directive."""
    try:
        with open(claude_md_path) as f:
            lines = f.readlines()
    except Exception:
        return None

    in_section = False
    section_title = None
    for line in lines:
        if line.startswith("#"):
            if MANDATORY_HEADING.match(line.strip()):
                in_section = True
                section_title = line.strip().lstrip("#").strip()
                continue
            else:
                in_section = False
                continue
        if in_section:
            m = SKILL_CALL.search(line)
            if m:
                return m.group(1), section_title
    return None


def skill_seen(transcript_path, skill_name):
    try:
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
                            and block.get("name") == "Skill"
                            and block.get("input", {}).get("skill") == skill_name):
                        return True
    except Exception:
        pass
    return False


def main():
    data = json.load(sys.stdin)
    cwd = data.get("cwd")
    if not cwd:
        return

    claude_md = os.path.join(cwd, "CLAUDE.md")
    if not os.path.isfile(claude_md):
        return

    found = find_mandatory_skill(claude_md)
    if not found:
        return
    skill_name, section_title = found

    transcript_path = data.get("transcript_path")
    if not transcript_path:
        return

    if not skill_seen(transcript_path, skill_name):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"This project's CLAUDE.md ('{section_title}') requires "
                    f"Skill({skill_name}) before file work. Call Skill({skill_name}) first."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
