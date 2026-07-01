# Plan: Install mobilewright (deferred — not currently installed)

## Context

Researched `mobilewright` (Playwright-style mobile test framework, TS) + `mobilecli` (Go device-control backend) as an alternative to Robot Framework+AppiumLibrary for native iOS/Android app testing. Conclusion: good fit for Swift UIKit/SwiftUI, Kotlin Compose/Views, RN, MAUI, KMP, Cordova/Capacitor, NativeScript — **not** Flutter (pending upstream), **not** macOS desktop (harness-terminal stays on RF+HarnessUILibrary).

Decided against wrapping this in a Claude skill (like `playwright-cli`, it's just a CLI tool, not a skill). Installed it once to verify (`npm install -g mobilewright@0.0.46`, confirmed via `mobilewright doctor` — all green except no device currently connected), then **uninstalled it** since there's no active mobile testing task right now. This plan documents the install steps so it can be redone quickly when actually needed.

## Known issue

`mobilewright@0.0.47` (latest on npm) is currently broken — it declares a dependency on `@mobilewright/inspector`, which was never published to the npm registry. `npm install -g mobilewright` fails with a 404 on that package. **Pin to `0.0.46`** until upstream fixes the release.

## Install steps (when needed)

```bash
npm install -g mobilewright@0.0.46
mobilewright doctor      # verify env: Xcode, Android SDK, mobilecli, connected devices
mobilewright devices     # confirm target device/sim/emulator visible
mobilewright init        # scaffold mobilewright.config.ts in target project
```

- Global bin lives at `/Users/supavit.cho/.hermes/node/bin/mobilewright` (same PATH as `appium`, `codex`) — should already resolve in a normal terminal.
- `mobilewright doctor` also pulls in `mobilecli` automatically as a dependency — no separate install needed.
- Before reinstalling, re-check `npm view mobilewright versions` in case upstream has published a fixed `0.0.48+`.

## Uninstall

```bash
npm uninstall -g mobilewright
```

## Not yet decided

- Which project this would actually be used in (no active mobile test task at time of writing)
- Whether to scaffold `mobilewright.config.ts` per-project or centrally
