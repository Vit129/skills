#!/usr/bin/env python3
"""PreToolUse hook: deny reading a project-local skill's SKILL.md
(<project-root>/_skills/**/SKILL.md or <project-root>/.claude/skills/**/SKILL.md)
until that project root has been explicitly trusted.

Project-local skills (routing.md's "Project-Local Skill vs Identically-Named
Global Skill") are markdown procedure files a project's own CLAUDE.md points
the agent at directly via Read -- unlike ~/.claude/skills/*, they are never
routed through the Skill tool, so nothing else in this workspace gates them.
A cloned/forked repo could vendor one to get an agent to silently follow
injected instructions. Mirrors Hermes Agent's `hermes skills trust <path>`
(PR #88566) -- same threat, same fix shape: gate at first-read, not at
write/execute time.

Trust is a persistent allowlist (agent-memory/.state/skill-trust.json,
maintained by scripts/trust-project-skill.sh), not per-session -- once a
project is trusted it stays trusted across sessions, same as Hermes's model.

Fail-open on any error -- a broken gate must never block a legitimate read.
"""
import json
import re
import sys
from pathlib import Path

TRUST_FILE = Path.home() / ".claude" / "agent-memory" / ".state" / "skill-trust.json"
GLOBAL_SKILL_ROOTS = (
    str(Path.home() / ".claude" / "skills") + "/",
    str(Path.home() / ".claude" / "plugins") + "/",
)
LOCAL_SKILL_DIR_PATTERN = re.compile(r"^(.*?)/(?:_skills|\.claude/skills|\.agents/skills)/.*/SKILL\.md$")


def find_project_root(file_path: str) -> str | None:
    if any(file_path.startswith(root) for root in GLOBAL_SKILL_ROOTS):
        return None
    m = LOCAL_SKILL_DIR_PATTERN.match(file_path)
    return m.group(1) if m else None


def is_trusted(project_root: str) -> bool:
    if not TRUST_FILE.exists():
        return False
    try:
        trusted = json.loads(TRUST_FILE.read_text())
    except (json.JSONDecodeError, OSError):
        return False
    return project_root in trusted


def main() -> None:
    data = json.load(sys.stdin)
    if data.get("tool_name") != "Read":
        return

    file_path = data.get("tool_input", {}).get("file_path", "")
    project_root = find_project_root(file_path)
    if project_root is None or is_trusted(project_root):
        return

    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": "deny",
            "permissionDecisionReason": (
                f"project-skill-trust-gate: {project_root} has not been trusted as a "
                "source of project-local skills yet. This is a repo-vendored skill file "
                "(routing.md's project-local-skill convention), not a global "
                "~/.claude/skills/ one -- ask the user via AskUserQuestion whether to "
                f"trust this project, then run `bash ~/.claude/scripts/trust-project-skill.sh "
                f"{project_root}` and retry the read. Do not trust silently."
            ),
        }
    }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
