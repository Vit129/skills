# Android Testing and Accessibility Reference

Use this reference for Compose semantics, `testTag`, content descriptions, and
UI tests.

Official docs:

- Compose semantics: https://developer.android.com/jetpack/compose/semantics
- Compose testing codelab: https://developer.android.com/codelabs/jetpack-compose-testing

## Semantics Contract

- Semantics support accessibility, autofill, and testing.
- Standard Material and Compose foundation components provide useful semantics,
  but custom components must add their own.
- Icon-only controls need meaningful `contentDescription`.
- Decorative images should not add noisy accessibility content.

## Test Tags

- Add `Modifier.testTag(...)` to critical interactive controls, dynamic rows,
  state containers, and test-only anchors that do not have stable semantics.
- Prefer user-visible semantics for tests when reliable; use `testTag` for
  explicit contracts and repeated dynamic content.
- Namespace tags by feature, for example `portfolio.position-row.AAPL`.

## Compose UI Tests

- Test user-visible behavior and state transitions.
- Use fake repositories and deterministic fixtures.
- Cover loading, success, empty, and error states.
- Avoid tests that depend on real network, real credentials, or shared device
  state.

## Review Checks

- Custom UI has useful semantics.
- Critical test targets have stable tags or accessible semantics.
- Tests use deterministic fake data.
- Text scales without clipping and tap targets remain usable.
