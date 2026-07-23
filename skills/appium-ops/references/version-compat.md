# Version Compatibility (Appium v2 vs v3)

Appium 3 changed the driver peer-dependency contract. Most driver majors released after that cutover only declare `appium: ^3.0.0-rc.2` — installing "latest" on a v2 core produces a peer-dependency warning (non-fatal at install time, but sessions can fail at runtime).

## Check before installing

```bash
appium --version                                    # current core
npm view appium-xcuitest-driver@<version> peerDependencies
npm view appium-uiautomator2-driver@<version> peerDependencies
```

## Known-good pairings (confirmed on this machine, 2026-07)

| Core | xcuitest | uiautomator2 |
|---|---|---|
| Appium 2.x (2.19.0) | **9.10.5** (last version with `appium: ^2.5.4`) | **4.2.3** (last version with `appium: ^2.4.1 \|\| ^3.0.0-beta.0`) |
| Appium 3.x (3.5.2) | 11.17.7 (latest at time of writing) | 8.1.1 (latest at time of writing) |

Everything above xcuitest 9.10.5 / uiautomator2 5.0.0 requires Appium 3 — there is no "latest driver on old core" option once you cross that line.

## Switching core major

```bash
volta install appium@2        # or appium@3, or a pinned version like appium@2.19.0
appium --version               # confirm the switch took
```

Switching core major **requires reinstalling both drivers** at a version matching the new core's peer range — a driver installed for v2 will throw peer-dependency warnings (and can fail at session-creation time) under a v3 core, and vice versa.

```bash
appium driver uninstall xcuitest
appium driver install xcuitest@<version matching new core>
appium driver uninstall uiautomator2
appium driver install uiautomator2@<version matching new core>
```

## Which one does the user actually need?

Don't assume "latest is always right." Check for:
- A project's own setup doc (e.g. an onboarding guide that explicitly says "Appium (v2)") — that's the team standard, follow it even if a newer major exists.
- Whether any other tool in the same pipeline (Robot Framework AppiumLibrary, an MCP server, CI config) pins to a specific major.
- If genuinely no constraint exists anywhere, ask the user rather than picking silently — this has flipped mid-session on this machine already (v2 → v3 per explicit user request after initially matching a doc that said v2).
