#!/usr/bin/env python3
"""Install/refresh the checked-in MCP server wiring into settings.json.

settings.json itself is gitignored (personal, machine-local) so mcpServers
wiring doesn't survive a `git clone` on a new machine the way scripts/ does.
scripts/settings-mcp.template.json is the checked-in source of truth
(committed); this script merges it into the real settings.json.

Idempotent and additive only: for each server name in the template, add it
if missing. Never overwrites an existing entry, so anything you configured
or toggled by hand (disabled/enabled, env vars) survives. Safe to re-run.

Usage: python3 install-mcp.py [path-to-settings.json]
"""
import json
import shutil
import sys
from pathlib import Path

HOME = str(Path.home())
TEMPLATE = Path.home() / ".claude" / "scripts" / "settings-mcp.template.json"


def resolve(command):
    return command.replace("$HOME", HOME) if isinstance(command, str) else command


def main():
    target_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / ".claude" / "settings.json"

    settings = json.loads(target_path.read_text()) if target_path.exists() else {}
    settings.setdefault("mcpServers", {})

    template = json.loads(TEMPLATE.read_text())

    added = []
    for name, block in template.items():
        if name in settings["mcpServers"]:
            continue
        entry = json.loads(json.dumps(block))
        entry["command"] = resolve(entry.get("command", ""))
        settings["mcpServers"][name] = entry
        added.append(name)

        cmd = entry.get("command", "")
        if cmd and not shutil.which(cmd) and not Path(cmd).exists():
            print(f"  warning: {name} binary not found at {cmd} -- install its dependency first (entry added anyway)")

    target_path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n")

    if added:
        print(f"added {len(added)} mcp server(s) to {target_path}: {', '.join(added)}")
    else:
        print(f"already up to date: {target_path}")


if __name__ == "__main__":
    main()
