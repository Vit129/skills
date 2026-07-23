---
name: appium-ops
description: >
  This skill should be used when the user asks to "install appium", "setup appium",
  "ลง appium", "แก้ appium", "appium ไม่ทำงาน", "appium connection failed",
  "appium driver", "upgrade appium", "downgrade appium", "appium version",
  "xcuitest", "uiautomator2", "appium doctor", "appium capabilities",
  "appium mcp", "setup appium-mcp", "kiro appium", "appium inspector",
  or needs to manage the Appium ecosystem end-to-end: core/driver install,
  version compatibility, npm install failures, capabilities JSON, or MCP wiring.
---

# Appium Ops

Manage the full Appium environment — core + drivers + MCP integration — not test code itself (that's `robotframework-testing`/`playwright-testing`).

## Objective

Get a working Appium install: correct core/driver version pairing, verified (not just CLI-reported) driver health, and optional MCP wiring for AI-driven control — in one pass, without leaving silent partial installs behind.

## Load Right Reference

| User says / situation | Load |
|---|---|
| "which xcuitest/uiautomator2 version", "appium v2 vs v3", version pinning | `references/version-compat.md` |
| npm install fails, "ENOTEMPTY", "Cannot find module", driver install "succeeds" but session still fails | `references/npm-troubleshooting.md` |
| "capabilities json", "desired capabilities", "appium:app", install-if-missing-else-launch | `references/capabilities.md` |
| "appium-mcp", "kiro mcp appium", "claude in chrome mcp appium", MCP connection timeout | `references/mcp-setup.md` |

## Process

1. **Pin target major version** — ask which Appium major (2.x or 3.x) if not obvious from an existing project doc/spec. HitL: single-select (v2 / v3 / "whatever's newest"). Read `version-compat.md` for the peer-dependency check command before picking driver versions.
2. **Install/pin core** — `volta install appium@<major>` (this workspace uses volta-managed global installs, not plain `npm install -g`). Verify with `appium --version`.
3. **Install drivers matching core** — check `npm view appium-xcuitest-driver@<version> peerDependencies` / same for `appium-uiautomator2-driver` before installing, so the driver's required Appium range actually matches the pinned core. Don't just install "latest" blind.
4. **If npm install fails or driver claims success but session creation errors** — go to `npm-troubleshooting.md`. Known failure modes: `ENOTEMPTY` rename races (npm 11.6.2 arborist bug) and silently-dropped nested deps (e.g. `@appium/logger` missing under `@appium/support` despite a "successfully installed" toast).
5. **Verify for real** — run `appium driver list --installed` AND `node -e "require('<path-to-driver>/node_modules/@appium/support/build/lib/logging.js')"` on each installed driver. The CLI success message is not sufficient evidence — it has been wrong before on this machine.
6. **Optional: wire MCP** — if the user wants AI-driven Appium control (Kiro, Claude), read `mcp-setup.md` before editing any `mcp.json`. GUI apps don't inherit shell PATH; timeout fields are milliseconds, not seconds.
7. **Optional: hand off capabilities** — if the user is about to open Appium Inspector or write a session config, read `capabilities.md` for the Android/iOS templates and the `noReset` vs `fullReset` distinction.

## Rules

- NEVER trust "successfully installed" / "no warnings" from `appium driver install` alone — a silently broken nested dependency has shipped that message on this machine twice. Confirm with a direct `node -e "require(...)"` on the deep chain before declaring done.
- ALWAYS check peer dependency compatibility (`npm view <pkg>@<version> peerDependencies`) before installing a driver version — major driver versions (10.x/11.x xcuitest, 5.x+ uiautomator2) dropped Appium v2 support entirely; only 9.10.5 (xcuitest) / 4.2.3 (uiautomator2) support v2.
- When an npm install throws `ENOTEMPTY` on a rename, that is not the target package's fault — it's leftover state from a prior partial install. See `npm-troubleshooting.md` for the clean-vs-wipe decision.
- Global `appium`/`npx` installs in this workspace are volta-managed (`volta install appium@X`, binaries under `~/.volta/bin`) — don't suggest plain `npm install -g appium` as the fix path here.
- Before wiping `~/.appium/node_modules`, confirm with the user (destructive, even though it's a rebuildable cache) — don't silently `rm -rf` it.
