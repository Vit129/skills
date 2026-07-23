# appium-mcp Setup (Kiro / other MCP clients)

Lets an AI assistant drive Appium in natural language via MCP, without a separate install — `npx appium-mcp@latest` runs it directly.

## Config location (Kiro)

User-level: `~/.kiro/settings/mcp.json`, under `mcpServers`.

## Two GUI-app gotchas that cause silent connection failures

### 1. `"command": "npx"` alone will not resolve

GUI apps (Kiro, and Electron/native apps generally) do **not** inherit the shell's PATH — they get a default PATH like `/usr/bin:/bin:/usr/sbin:/sbin`. If Node is managed via volta/nvm/asdf, plain `npx` is invisible to the GUI process even though it works fine from a terminal.

**Fix:** use the absolute path to the node version manager's `npx` binary:

```bash
which npx     # e.g. /Users/<user>/.volta/bin/npx
```

```json
{
  "command": "/Users/<user>/.volta/bin/npx",
  "args": ["-y", "appium-mcp@latest"]
}
```

Verify this actually works under a bare PATH before trusting it:
```bash
env -i PATH="/usr/bin:/bin:/usr/sbin:/sbin" /Users/<user>/.volta/bin/npx --version
```
(volta's `npx` shim is a compiled binary that resolves its own node — confirmed it still runs with an empty PATH. A shebang-script-based npx from nvm etc. may behave differently; verify per-environment.)

### 2. `timeout` is milliseconds, not seconds

Kiro's own MCP logs (`~/.kiro/logs/<session>/mcp.log`) showed the literal error:
```
MCP server 'appium-mcp' connection timed out after 100ms
```
from a config value of `"timeout": 100` — meant as a generous number by whoever wrote the example, but Kiro reads it as milliseconds. A cold `npx appium-mcp@latest` can take 10-15+ seconds the first time (package resolution + install), so 100ms fails almost every time.

**Fix:** set a realistic value, e.g. `"timeout": 60000` (60s).

## Full working entry

```json
"appium-mcp": {
  "command": "/Users/<user>/.volta/bin/npx",
  "args": ["-y", "appium-mcp@latest"],
  "disabled": false,
  "timeout": 60000,
  "type": "stdio",
  "env": {
    "ANDROID_HOME": "/Users/<user>/Library/Android/sdk"
  }
}
```

## Debugging a "connection failed" with no visible error in the UI

Kiro writes structured MCP logs to disk even when the panel shows nothing useful:
```bash
find ~/.kiro/logs -iname "mcp.log" | sort | tail -1   # latest session
grep -i "<server-name>" <that-log>
```
This is the fastest path to the real error — check it before guessing at PATH/timeout/env causes.

## After any mcp.json edit

Kiro needs to reconnect/reload the specific MCP server (or restart the app if the panel has no reload button) to pick up config changes — editing the file alone does not hot-apply.
