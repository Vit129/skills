#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["rich"]
# ///
"""Terminal-native learning journey — mirrors Hermes Agent's own documented
`hermes journey list / delete / edit` subcommands, plus an `overlay`
subcommand for the live/interactive scrub Hermes's TUI offers.

Real local process, real filesystem access — no browser sandbox, no HTTP
server. Meant to run directly in a Kouen pane (or any terminal).

Usage:
    journey_tui.py list
    journey_tui.py delete <name> [-y]
    journey_tui.py edit <name>
    journey_tui.py overlay   # live scrub: n/space next, p previous, f play/pause, q quit
"""
from __future__ import annotations

import argparse
import os
import select
import subprocess
import sys
import termios
import tty
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from journey_timeline import build_timeline  # noqa: E402

from rich.console import Console
from rich.live import Live
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


# --- overlay: pure logic first (unit-testable without a real TTY), then the
# raw-terminal loop that drives it (not verifiable in a non-interactive
# sandbox -- kept as thin as possible so the untested surface is small).

def overlay_apply_key(key: str, idx: int, playing: bool, total: int) -> tuple[int, bool, bool]:
    """(new_idx, new_playing, should_quit). Pure -- no I/O, fully testable."""
    if key == "q":
        return idx, playing, True
    if key in ("n", " "):
        return min(idx + 1, total - 1), False, False
    if key == "p":
        return max(idx - 1, 0), False, False
    if key == "f":
        return idx, not playing, False
    return idx, playing, False


def overlay_advance(idx: int, total: int) -> tuple[int, bool]:
    """Auto-play tick: (new_idx, still_playing). Stops playing at the end."""
    if idx >= total - 1:
        return total - 1, False
    return idx + 1, True


def render_overlay(nodes: list[dict], idx: int, playing: bool) -> Table:
    table = Table(title=f"Learning Journey — node {idx + 1}/{len(nodes)}  [{'PLAYING' if playing else 'paused'}]")
    table.add_column("Date", style="dim")
    table.add_column("Type")
    table.add_column("Name", style="bold")
    table.add_column("Description")
    start = max(0, idx - 8)
    for i in range(start, idx + 1):
        n = nodes[i]
        color = TYPE_COLOR.get(n["type"], "white")
        row_style = "reverse" if i == idx else None
        table.add_row(
            n["timestamp"][:10],
            f"[{color}]{n['type']}[/{color}]",
            n["name"],
            n["description"][:60],
            style=row_style,
        )
    table.caption = "n/space next · p previous · f play/pause · q quit"
    return table


def cmd_overlay(_args) -> None:
    nodes = build_timeline()
    if not nodes:
        console.print("[yellow]No nodes to show.[/yellow]")
        return

    if not sys.stdin.isatty():
        console.print("[red]overlay needs a real terminal (stdin is not a TTY).[/red] "
                      "Run it directly in a Kouen pane or any interactive shell — "
                      "use `list`/`delete`/`edit` for non-interactive/scripted use.")
        sys.exit(1)

    idx = len(nodes) - 1
    playing = False

    fd = sys.stdin.fileno()
    old_settings = termios.tcgetattr(fd)
    try:
        tty.setcbreak(fd)
        with Live(render_overlay(nodes, idx, playing), console=console, screen=True, refresh_per_second=10) as live:
            while True:
                timeout = 0.5 if playing else 0.1
                ready, _, _ = select.select([sys.stdin], [], [], timeout)
                if ready:
                    key = sys.stdin.read(1)
                    idx, playing, quit_ = overlay_apply_key(key, idx, playing, len(nodes))
                    if quit_:
                        break
                elif playing:
                    idx, playing = overlay_advance(idx, len(nodes))
                live.update(render_overlay(nodes, idx, playing))
    finally:
        termios.tcsetattr(fd, termios.TCSADRAIN, old_settings)


def main() -> None:
    parser = argparse.ArgumentParser(description="Terminal-native learning journey (Hermes /journey equivalent)")
    sub = parser.add_subparsers(dest="command", required=True)

    sub.add_parser("list", help="List all learned nodes")

    p_delete = sub.add_parser("delete", help="Delete a node's source file")
    p_delete.add_argument("node", help="Node name (see `list`)")
    p_delete.add_argument("-y", "--yes", action="store_true", help="skip confirmation")

    p_edit = sub.add_parser("edit", help="Open a node's source file in $EDITOR")
    p_edit.add_argument("node", help="Node name (see `list`)")

    sub.add_parser("overlay", help="Live interactive scrub (n/space next, p previous, f play/pause, q quit)")

    args = parser.parse_args()
    {"list": cmd_list, "delete": cmd_delete, "edit": cmd_edit, "overlay": cmd_overlay}[args.command](args)


if __name__ == "__main__":
    main()
