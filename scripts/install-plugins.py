#!/usr/bin/env python3
"""Install/refresh the checked-in plugin + marketplace wiring via the claude CLI.

settings.json's enabledPlugins/extraKnownMarketplaces don't survive a
`git clone` on a new machine (settings.json is gitignored, machine-local).
scripts/settings-plugins.template.json is the checked-in source of truth
(committed); this script diffs it against the real settings.json and runs
`claude plugin marketplace add` / `claude plugin install` for anything
missing. Idempotent and additive only -- never disables/removes a plugin,
so anything toggled off by hand stays off. Safe to re-run.

Before this script existed, bootstrap-new-machine.sh hardcoded only 2 of 23
enabled plugins (agy, 9arm-skills) -- the other 21 had no reinstall path at
all and would simply be missing on a fresh machine.

Usage: python3 install-plugins.py [--dry-run] [path-to-settings.json]
"""
import json
import os
import subprocess
import sys
from pathlib import Path

TEMPLATE = Path.home() / ".claude" / "scripts" / "settings-plugins.template.json"


def marketplace_add_arg(cfg):
    src = cfg.get("source", {})
    kind = src.get("source")
    if kind == "github":
        return src.get("repo")
    if kind == "git":
        return src.get("url")
    if kind == "directory":
        return os.path.expandvars(src.get("path", ""))
    return None


def main():
    args = [a for a in sys.argv[1:] if a != "--dry-run"]
    dry_run = "--dry-run" in sys.argv[1:]
    settings_path = Path(args[0]) if args else Path.home() / ".claude" / "settings.json"

    template = json.loads(TEMPLATE.read_text())
    settings = json.loads(settings_path.read_text()) if settings_path.exists() else {}

    known_markets = set(settings.get("extraKnownMarketplaces", {}).keys())
    enabled = set(settings.get("enabledPlugins", {}).keys())

    actions = []

    for name, cfg in template["extraKnownMarketplaces"].items():
        if name in known_markets:
            continue
        arg = marketplace_add_arg(cfg)
        if not arg:
            print(f"  skip marketplace {name}: unrecognized source shape")
            continue
        actions.append(("marketplace", arg))

    for plugin_id in template["enabledPlugins"]:
        if plugin_id in enabled:
            continue
        actions.append(("plugin", plugin_id))

    if not actions:
        print(f"already up to date: {settings_path}")
        return

    for kind, arg in actions:
        if kind == "marketplace":
            cmd = ["claude", "plugin", "marketplace", "add", arg]
        else:
            cmd = ["claude", "plugin", "install", arg]
        print(f"  {'[dry-run] ' if dry_run else ''}{' '.join(cmd)}")
        if not dry_run:
            subprocess.run(cmd, check=False)


if __name__ == "__main__":
    main()
