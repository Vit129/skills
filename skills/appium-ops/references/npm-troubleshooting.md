# npm Install Troubleshooting for ~/.appium

`appium driver install`/`update` shells out to npm under `~/.appium` with `--global-style --omit=peer --no-package-lock`. On npm 11.6.2 this combination has two observed failure modes on this machine. Neither is the target package's fault — don't chase the package name in the error.

## Failure mode 1 — `ENOTEMPTY` on rename

```
npm error code ENOTEMPTY
npm error syscall rename
npm error path .../node_modules/<pkg>
npm error dest .../node_modules/.<pkg>-<random>
```

This is leftover state from a prior interrupted/partial install racing npm's rename-to-temp-then-delete reify step. Retrying the same command just hits the **next** stale package alphabetically — whack-a-mole, potentially 50-100+ packages deep. Don't loop through them one at a time past 2-3 attempts.

**Fix:** confirm with the user, then wipe the whole cache and reinstall clean:

```bash
rm -rf ~/.appium/node_modules      # ask first — rebuildable, but still destructive
appium driver install uiautomator2
appium driver install xcuitest
```

`~/.appium/node_modules` is a rebuildable npm cache, not user code — safe to nuke once confirmed, but still ask before running `rm -rf` on it (matches this workspace's general destructive-action policy).

## Failure mode 2 — silently missing nested dependency

Symptom: `appium driver install` reports `✔ successfully installed`, `appium driver list --installed` shows no warnings, but creating a session throws:

```
Cannot find module '@appium/logger'
Require stack:
- .../node_modules/appium-<x>-driver/node_modules/@appium/support/build/lib/logging.js
```

This reproduced **twice in a row** on this machine, including after a full `rm -rf node_modules` + fresh reinstall — the CLI's success reporting does not verify the full nested dependency tree. `npm cache ls @appium/logger` will typically show the tarball was fetched, just never extracted into place.

**Diagnose:**
```bash
node -e "require('<path-to-driver>/node_modules/@appium/support/build/lib/logging.js')"
```
If this throws `Cannot find module '@appium/logger'`, the install is broken regardless of what the appium CLI printed.

**Fix (works without another full wipe):** install the missing package directly into the nested location with plain npm, bypassing appium's special install flags:

```bash
cd ~/.appium/node_modules/appium-<x>-driver/node_modules/@appium
npm install @appium/logger@<version matching @appium/support's declared dependency> --no-save
```

Get the exact version to install from the dependent package itself, don't guess:
```bash
cat ~/.appium/node_modules/appium-<x>-driver/node_modules/@appium/support/package.json \
  | python3 -c "import json,sys; print(json.load(sys.stdin)['dependencies']['@appium/logger'])"
```

Re-run the `node -e "require(...)"` check after — do this for **every** installed driver, not just the one that errored first. Both xcuitest and uiautomator2 hit this independently in the same session.

## Failure mode 3 — fix applied but Inspector/client still shows the old error

If failure mode 2 was just fixed on disk (node_modules patched, `node -e "require(...)"` now passes) but a client (Appium Inspector, a test runner, an MCP tool) still reports the exact same `Cannot find module` error — check for an **already-running `appium` server process** from before the fix:

```bash
ps aux | grep -i appium | grep -v grep
```

Appium requires each driver **once, at server startup** (`Attempting to load driver <x>...` in server logs), not per-session. If that process's driver-load happened before the nested dependency was patched in, every session request on that same process keeps failing forever — the fix on disk is irrelevant to an already-running process, since Node only re-resolves `require()` on process start, not on later filesystem changes.

**Fix:** kill the stale server process and start a fresh one. Confirm the fix actually landed by starting a throwaway server on a scratch port and hitting `/session` directly (bypasses Inspector/client entirely, isolates driver-load from client-side issues):

```bash
appium server --port 4726 &
sleep 5
curl -s -X POST http://localhost:4726/session -H "Content-Type: application/json" -d '{
  "capabilities": {"alwaysMatch": {"platformName": "Android", "appium:automationName": "UiAutomator2", "appium:deviceName": "<avd-name>"}, "firstMatch": [{}]}
}'
```
A `200` with a `sessionId` confirms the driver load is fixed — anything failing afterward is a client-side/stale-process issue, not the install.

## General rule

Never declare an Appium driver install "done" on the CLI's word alone. The verification step (Rules section in `SKILL.md`) is mandatory, not optional, on this workspace's npm version. And never declare a *fix* done without restarting whatever long-lived server process the client actually talks to — a passing `node -e require` check on disk doesn't retroactively fix a process that already loaded the broken module.
