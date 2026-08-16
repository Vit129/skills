#!/usr/bin/env python3
"""Install/refresh checked-in functional (non-cosmetic) settings.json prefs.

Deliberately narrow: only keys that are actually load-bearing wiring, not
personal taste. statusLine wires up statusline-command.sh (already checked
into this repo) -- without this key the script just sits there unused and
Claude Code falls back to its own default statusline. theme/model/
effortLevel/verbose/etc. are real personal preferences with a sane built-in
default if absent -- deliberately NOT included here; losing them on a new
machine isn't breakage, so they don't need a restore path.

Additive only: only sets a key if entirely absent from settings.json, never
overwrites a value the user configured/changed. Safe to re-run.

Usage: python3 install-prefs.py [path-to-settings.json]
"""
import json
import os
import sys
from pathlib import Path

TEMPLATE = Path.home() / ".claude" / "scripts" / "settings-prefs.template.json"


def main():
    target_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / ".claude" / "settings.json"
    settings = json.loads(target_path.read_text()) if target_path.exists() else {}

    template = json.loads(TEMPLATE.read_text())
    added = []
    for key, value in template.items():
        if key in settings:
            continue
        if isinstance(value, dict):
            value = {
                k: (os.path.expandvars(v) if isinstance(v, str) else v)
                for k, v in value.items()
            }
        settings[key] = value
        added.append(key)

    if not added:
        print(f"already up to date: {target_path}")
        return

    target_path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n")
    print(f"added {len(added)} pref(s) to {target_path}: {', '.join(added)}")


if __name__ == "__main__":
    main()
