---
name: cmux
description: Use when the user asks about cmux, cmux CLI, cmux workspaces, panes, surfaces, browser automation, agent hooks, cmux settings, Ghostty integration, or controlling local terminal/browser sessions through cmux. This skill turns the agent into a cmux expert who verifies the local CLI first, uses cmux refs correctly, and safely edits/reloads cmux configuration.
---

# cmux Expert

Use this skill for any task involving `cmux`, including explaining usage, opening projects, controlling terminal panes, driving browser surfaces, configuring settings, setting up hooks, or debugging a cmux session.

## First Checks

Run these before giving detailed advice or automating cmux:

```bash
command -v cmux
cmux --help
cmux version
cmux ping
```

If the CLI is unavailable, check the app bundle path first:

```bash
/Applications/cmux.app/Contents/Resources/bin/cmux --help
```

Do not assume remote docs are current. Prefer local `cmux --help`, then `cmux docs <topic>`.

## Mental Model

cmux is controlled through a Unix socket. It organizes the UI as:

- Window: top-level cmux app window
- Workspace: project/session tab group
- Pane: split region
- Surface: terminal or browser tab inside a pane

Commands accept UUIDs, short refs, or indexes:

```text
window:1
workspace:2
pane:3
surface:4
tab:1
```

Inside cmux terminals, these environment variables are usually set and act as defaults:

```text
CMUX_WORKSPACE_ID
CMUX_SURFACE_ID
CMUX_TAB_ID
CMUX_SOCKET_PATH
```

Use explicit refs when automation could hit the wrong pane or workspace.

## Core Workflow

Open a project:

```bash
cmux /path/to/project
cmux .
```

Inspect session structure:

```bash
cmux tree --all
cmux list-windows
cmux list-workspaces
cmux list-panes
cmux list-pane-surfaces
```

Create or select workspace:

```bash
cmux new-workspace --name "Work" --cwd /path/to/project
cmux select-workspace --workspace workspace:1
cmux rename-workspace "New Name"
```

Split and focus:

```bash
cmux new-split right
cmux new-split down
cmux new-pane --type terminal --direction right
cmux focus-pane --pane pane:1
```

Send text to a terminal:

```bash
cmux send --surface surface:1 "npm test"
cmux send-key --surface surface:1 Enter
```

Read terminal output:

```bash
cmux read-screen --surface surface:1 --lines 80
cmux capture-pane --surface surface:1 --scrollback --lines 200
```

Prefer `read-screen` for current screen state and `capture-pane --scrollback` when history matters.

## Browser Automation

Use cmux browser commands when the browser is inside cmux:

```bash
cmux browser open http://localhost:3000
cmux browser snapshot
cmux browser click "button"
cmux browser fill "input[name=email]" "user@example.com"
cmux browser press Enter
cmux browser screenshot --out /tmp/cmux-browser.png
```

Useful checks:

```bash
cmux browser url
cmux browser console list
cmux browser errors list
cmux browser wait --selector "#root" --timeout-ms 10000
```

When testing UI, combine browser state with app logs:

```bash
cmux browser snapshot --compact
cmux read-screen --lines 120
```

## Agent Hooks And Teams

For agent workflows:

```bash
cmux claude-teams
cmux codex-teams
cmux hooks setup --agent claude
cmux hooks setup --agent codex
cmux hooks feed --source codex
```

Before changing hooks, inspect existing setup and explain what will be installed. Avoid removing hooks unless the user explicitly asks:

```bash
cmux hooks setup --agent codex
cmux hooks uninstall --agent codex
```

## Config And Settings

Use local docs and paths:

```bash
cmux docs settings
cmux docs shortcuts
cmux docs dock
cmux settings path
cmux config path
cmux config check
cmux config validate
```

Before editing `cmux.json`, back it up:

```bash
cp ~/.config/cmux/cmux.json ~/.config/cmux/cmux.json.$(date +%Y%m%d-%H%M%S).bak
```

Reload without restarting the app:

```bash
cmux reload-config
```

`cmux reload-config` reloads both Ghostty config and `~/.config/cmux/cmux.json`, then refreshes terminals in place.

Ghostty terminal behavior belongs in:

```text
~/.config/ghostty/config
```

Prefer Ghostty config for terminal features Ghostty already supports, such as transparency, blur, fonts, themes, and terminal keybinds.

## Diagnostics

Use these for troubleshooting:

```bash
cmux ping
cmux capabilities
cmux surface-health
cmux debug-terminals
cmux top --all --processes
cmux memory --all
cmux events --limit 50
```

If commands fail due to socket authentication, check in this order:

1. `--password`
2. `CMUX_SOCKET_PASSWORD`
3. Saved password in Settings

If a command targets the wrong pane, inspect refs with `cmux tree --all` and rerun with explicit `--workspace`, `--pane`, or `--surface`.

## Safety Rules

- Verify local CLI behavior with `cmux --help` before using rarely used commands.
- Use explicit refs for destructive, focus-changing, or automation-heavy commands.
- Back up config before editing.
- Prefer `cmux reload-config` over app restarts.
- Do not use broad close commands unless the user explicitly asks.
- When reporting results, include the exact command used and the target ref if relevant.

