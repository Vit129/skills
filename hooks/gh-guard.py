#!/usr/bin/env python3
"""PreToolUse(Bash) hook: block GitHub CLI in Azure-DevOps-only trees.

`~/.kiro/**` and `~/Git/Company/**` push exclusively to Azure DevOps, so any
`gh` command there is a mistake — the agent should use `git`/`az repos`
instead (see rules/core.md → VCS Remote by Path). This is the hard-block
companion to that instruction; the instruction still covers Codex/Gemini/Kiro,
which don't read Claude's hooks.

Fail-open: any error → allow. A convenience guard must never wedge real work.
"""
import json
import os
import re
import sys

# Azure-DevOps-only roots (expanded to absolute, no trailing slash)
ADO_ROOTS = [
    os.path.realpath(os.path.expanduser("~/.kiro")),
    os.path.realpath(os.path.expanduser("~/Git/Company")),
]

# `gh` as a command token: at string start, or after a shell separator
# (; | & newline, or && / ||). Catches compound commands like `cd x && gh pr`,
# which a settings.json prefix-deny would miss.
GH_AT_CMD_POS = re.compile(r"(?:^|[\n;|&])\s*gh\b")


def under_ado_root(cwd: str) -> bool:
    real = os.path.realpath(cwd)
    for root in ADO_ROOTS:
        if real == root or real.startswith(root + os.sep):
            return True
    return False


def main():
    data = json.load(sys.stdin)
    if data.get("tool_name") != "Bash":
        return
    command = data.get("tool_input", {}).get("command", "")
    cwd = data.get("cwd") or os.environ.get("CLAUDE_CWD") or os.getcwd()

    if under_ado_root(cwd) and GH_AT_CMD_POS.search(command):
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    "This tree (~/.kiro or ~/Git/Company) is Azure DevOps only — "
                    "`gh`/GitHub CLI is blocked here. Use `git push` (remote is "
                    "ssh.dev.azure.com) or `az repos pr create` instead. "
                    "See rules/core.md → VCS Remote by Path."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass  # fail-open: never block work on a guard error
