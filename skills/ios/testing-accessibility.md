# iOS Testing and Accessibility Reference

Use this reference when adding SwiftUI identifiers, UI tests, accessibility
metadata, or review checks for native iOS features.

Official docs:

- Accessibility: https://developer.apple.com/documentation/accessibility/
- SwiftUI accessibility modifiers: https://developer.apple.com/documentation/swiftui/view-accessibility
- Performing accessibility testing: https://developer.apple.com/documentation/accessibility/performing-accessibility-testing-for-your-app
- XCTest: https://developer.apple.com/documentation/xctest

## Accessibility Contract

- Accessibility is part of the component contract, not post-merge polish.
- User-facing controls need useful labels, values, hints, and traits when the
  visible text is not enough.
- Dynamic content should remain understandable with VoiceOver, Dynamic Type,
  reduced motion, increased contrast, and right-to-left layout where applicable.
- Do not hide important content from accessibility unless an equivalent
  accessible element exists.

## UI Test Identifiers

- Add `.accessibilityIdentifier(...)` to interactive controls, critical status
  labels, dynamic rows, list containers, forms, and retry actions.
- Use stable identifiers independent of localization.
- Namespace identifiers by feature: `login.submit-button`,
  `portfolio.position-row.AAPL`, `settings.currency-picker`.
- Do not use display strings as selectors in UI tests when a stable identifier
  is available.
- For repeated rows, include a stable domain key rather than the row index when
  possible.

## XCTest and XCUITest

- Unit-test view models, route parsing, error mapping, repository behavior, and
  persistence mapping.
- UI-test critical user flows and accessibility identifiers.
- Use fakes or isolated stores; avoid tests that depend on live network, shared
  state, or real credentials.
- Keep tests deterministic by controlling clocks, UUIDs, fixtures, and network
  responses when the project has the seams for it.

## Accessibility Review

- Verify controls have accessible names and roles.
- Verify state changes are perceivable, especially loading, error, empty, and
  success transitions.
- Verify tap targets are large enough and not crowded.
- Verify text scales without clipping or overlap.
- Verify important color meaning has a non-color signal.

## Review Checks

- Critical elements have stable `accessibilityIdentifier` values.
- UI tests target identifiers rather than visible text where practical.
- Accessibility labels and traits describe the user's task.
- Tests isolate storage, network, clocks, and credentials.
- The feature has coverage for loading, success, empty, and error states.
