#!/usr/bin/env python3
"""PreToolUse hook: deny claude-in-chrome / chrome-devtools tool calls while
Kouen (KouenDaemon) is running. Kouen's own mcp__kouen__kouenBrowser* tools
are the default per rules/routing.md "Browser Automation Tool Priority" -
browser panes live inside the user's terminal multiplexer alongside their
other active sessions, the more integrated environment.
Fail-open on any error - a broken gate must never block legitimate work.
"""
import json
import subprocess
import sys


CHROME_PREFIXES = ("mcp__claude-in-chrome__", "mcp__chrome-devtools__")


def kouen_running():
    return subprocess.run(
        ["pgrep", "-q", "KouenDaemon"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    ).returncode == 0


def main():
    data = json.load(sys.stdin)
    tool_name = data.get("tool_name", "")
    if not tool_name.startswith(CHROME_PREFIXES):
        return

    if kouen_running():
        print(json.dumps({
            "hookSpecificOutput": {
                "hookEventName": "PreToolUse",
                "permissionDecision": "deny",
                "permissionDecisionReason": (
                    f"Kouen is running - use mcp__kouen__kouenBrowser* tools "
                    f"instead of {tool_name} (rules/routing.md 'Browser "
                    "Automation Tool Priority': Kouen is the default, "
                    "browser panes live inside the user's terminal "
                    "alongside their other sessions). Call mcp__kouen__kouenList "
                    "first if unsure, then kouenBrowserOpen/Navigate/Interact/"
                    "Evaluate/Screenshot. Only fall back to this tool if Kouen "
                    "genuinely cannot do the task (e.g. needs the user's real "
                    "Chrome login/session) - state that reason to the user "
                    "before falling back, don't silently switch."
                ),
            }
        }))


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
