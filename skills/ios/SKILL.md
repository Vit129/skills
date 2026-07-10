---
name: ios
description: >
  Use this reference when building, reviewing, or refactoring native iOS code
  with Swift, SwiftUI, SwiftData, Observation, async/await, Combine, XCTest,
  or Xcode project conventions.
version: 1.0.0
last_improved: 2026-06-06
improvement_count: 0
---

# iOS Swift and SwiftUI

Build native iOS features with Swift-first, SwiftUI-first implementation. Use
UIKit only for legacy surfaces, platform gaps, or wrappers around existing code.

## Load Order

Read these references before editing iOS code:

1. `ios-swift.md` for native iOS architecture and implementation patterns.
2. `swiftui.md` for SwiftUI structure, state, layout, navigation, and previews.
3. `observation.md` for `@Observable`, `@State`, `@Bindable`, and migration rules.
4. `swiftdata.md` when persistence, offline cache, or model history is involved.
5. `testing-accessibility.md` for accessibility and UI test identifiers.
6. `../shared/testability-standards.md` for cross-platform testability rules.
7. `../shared/ui-states-standards.md` for loading, success, empty, and error states.
8. `../shared/error-handling-standards.md` for user-safe errors.
9. `../shared/navigation-standards.md` when routing or deep links are involved.
10. `../shared/logging-standards.md` when adding diagnostics.
11. `../shared/env-config-standards.md` when touching configuration or secrets.

## Testability

- Add `.accessibilityIdentifier(...)` to interactive controls, critical labels,
  dynamic rows, and state containers.
- Use stable identifiers, not localized text.
- Keep identifiers namespaced by feature, for example
  `portfolio.position-row.AAPL` or `login.submit-button`.
- Keep preview fixtures and test fakes near the feature unless the app already
  has shared fixture conventions.
