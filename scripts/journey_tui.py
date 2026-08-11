#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["rich"]
# ///
"""Terminal-native learning journey — mirrors Hermes Agent's own documented
`hermes journey list / delete / edit` subcommands (not the live TUI overlay,
which needs a real interactive event loop this sandbox can't verify works;
these three subcommands are what Hermes actually ships as testable CLI
surface, per its own docs).

Real local process, real filesystem access — no browser sandbox, no HTTP
server. Meant to run directly in a Kouen pane (or any terminal).

Usage:
    journey_tui.py list
    journey_tui.py delete <name> [-y]
    journey_tui.py edit <name>
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from journey_timeline import build_timeline  # noqa: E402

from rich.console import Console
from rich.table import Table

console = Console()

TYPE_COLOR = {"memory": "cyan", "knowledge": "magenta", "skill-candidate": "yellow"}


def cmd_list(_args) -> None:
    nodes = build_timeline()
    table = Table(title=f"Learning Journey — {len(nodes)} nodes (oldest first)")
    table.add_column("Date", style="dim")
    table.add_column("Type")
    table.add_column("Name", style="bold")
    table.add_column("Description")
    for n in nodes:
        color = TYPE_COLOR.get(n["type"], "white")
        table.add_row(
            n["timestamp"][:10],
            f"[{color}]{n['type']}[/{color}]",
            n["name"],
            n["description"][:70],
        )
    console.print(table)


def find_node(name: str) -> dict | None:
    for n in build_timeline():
        if n["name"] == name:
            return n
    return None


def cmd_delete(args) -> None:
    node = find_node(args.node)
    if node is None:
        console.print(f"[red]No node named '{args.node}'.[/red] Run `list` to see valid names.")
        sys.exit(1)

    path = Path.home() / node["path"]
    if not args.yes:
        console.print(f"About to delete: [bold]{node['name']}[/bold] ({node['path']})")
        confirm = console.input("Type 'yes' to confirm: ")
        if confirm.strip().lower() != "yes":
            console.print("Cancelled.")
            return

    path.unlink()
    console.print(f"[green]Deleted[/green] {node['path']}")


def cmd_edit(args) -> None:
    node = find_node(args.node)
    if node is None:
        console.print(f"[red]No node named '{args.node}'.[/red] Run `list` to see valid names.")
        sys.exit(1)

    path = Path.home() / node["path"]
    editor = os.environ.get("EDITOR", "vi")
    subprocess.run([editor, str(path)])


def main() -> None:
    parser = argparse.ArgumentParser(description="Terminal-native learning journey (Hermes /journey equivalent)")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="List all learned nodes")

    p_delete = sub.add_parser("delete", help="Delete a node's source file")
    p_delete.add_argument("node", help="Node name (see `list`)")
    p_delete.add_argument("-y", "--yes", action="store_true", help="skip confirmation")

    p_edit = sub.add_parser("edit", help="Open a node's source file in $EDITOR")
    p_edit.add_argument("node", help="Node name (see `list`)")

    args = parser.parse_args()
    {"list": cmd_list, "delete": cmd_delete, "edit": cmd_edit}[args.command](args)


if __name__ == "__main__":
    main()
