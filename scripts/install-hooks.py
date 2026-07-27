#!/usr/bin/env python3
"""Install/refresh the checked-in hook wiring into settings.json.

settings.json itself is gitignored (personal, machine-local) so hook wiring
doesn't survive a `git clone` on a new machine the way scripts/hooks/ do.
scripts/settings-hooks.template.json is the checked-in source of truth
(committed); this script merges it into the real settings.json.

Idempotent and additive only: for each (event, matcher, command) in the
template, add it if missing. Never removes or replaces an existing block, so
anything you configured by hand (or that a template update doesn't know
about yet) survives. Safe to re-run.

Usage: python3 install-hooks.py [path-to-settings.json]
"""
import json
import sys
from pathlib import Path

HOME = str(Path.home())
TEMPLATE = Path.home() / ".claude" / "scripts" / "settings-hooks.template.json"


def load_template():
    raw = TEMPLATE.read_text()
    return json.loads(raw)


def normalize(command):
    # Template and hand-authored entries mix "$HOME/..." and the resolved
    # absolute path for the same real command -- compare on the resolved form.
    return command.replace("$HOME", HOME)


def merge(target_hooks, template_hooks):
    added = []
    for event, blocks in template_hooks.items():
        target_hooks.setdefault(event, [])
        for block in blocks:
            matcher = block["matcher"]
            existing_block = next(
                (b for b in target_hooks[event] if b.get("matcher") == matcher), None
            )
            if existing_block is None:
                target_hooks[event].append(json.loads(json.dumps(block)))
                added.append(f"{event}/{matcher} (new block, {len(block['hooks'])} hook(s))")
                continue
            existing_commands = {normalize(h.get("command", "")) for h in existing_block.get("hooks", [])}
            for h in block["hooks"]:
                if normalize(h["command"]) not in existing_commands:
                    existing_block.setdefault("hooks", []).append(json.loads(json.dumps(h)))
                    added.append(f"{event}/{matcher}: {h['command']}")
    return added


def main():
    target_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / ".claude" / "settings.json"

    if target_path.exists():
        settings = json.loads(target_path.read_text())
    else:
        settings = {}

    settings.setdefault("hooks", {})

    template = load_template()
    added = merge(settings["hooks"], template)

    target_path.write_text(json.dumps(settings, indent=2, ensure_ascii=False) + "\n")

    if added:
        print(f"added {len(added)} hook(s) to {target_path}:")
        for a in added:
            print(f"  - {a}")
    else:
        print(f"already up to date: {target_path}")


if __name__ == "__main__":
    main()
