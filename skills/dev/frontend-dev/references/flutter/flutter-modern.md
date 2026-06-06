# Modern Flutter Reference

Use this reference for Flutter state, navigation, accessibility, testing,
performance, and DevTools decisions.

Official docs:

- Flutter docs: https://docs.flutter.dev/
- State management: https://docs.flutter.dev/data-and-backend/state-mgmt/intro
- Navigation: https://docs.flutter.dev/ui/navigation
- Testing: https://docs.flutter.dev/testing
- Accessibility: https://docs.flutter.dev/ui/accessibility
- Accessibility testing: https://docs.flutter.dev/ui/accessibility/accessibility-testing
- DevTools: https://docs.flutter.dev/tools/devtools

## Widget Rules

- Prefer `StatelessWidget` until local mutable state is required.
- Keep `build()` methods cheap and readable.
- Use `const` constructors whenever all arguments are compile-time constants.
- Extract repeated UI into named widgets rather than large private helper
  methods when reuse or testing matters.
- Avoid side effects in `build()`.

## State Rules

- Local ephemeral state: `StatefulWidget` and `setState`.
- Shared feature state: use the project's existing pattern such as Provider,
  Riverpod, Bloc, or ValueNotifier.
- Keep app-wide state minimal; scope state to the feature or route when possible.
- Represent screen state explicitly: loading, success, empty, and error.
- Keep networking and persistence out of widgets; use repositories/services.

## Navigation

- Use the project router first. `go_router` is a good default for declarative
  routing and deep links when no project router exists.
- Pass stable IDs or route parameters, not large mutable domain objects.
- Keep deep-link parsing and auth redirects outside leaf widgets.

## Testing and Accessibility

- Unit-test business logic and repositories.
- Widget-test UI states and interactions.
- Integration-test critical user flows.
- Add `Key` values to dynamic widgets and controls when tests need stable
  selectors.
- Use semantics labels for icon-only or custom controls.
- Add accessibility guideline tests when a feature has meaningful accessibility
  risk.

## Performance

- Use lazy list builders for long collections.
- Avoid rebuilding large subtrees by keeping state local and using const widgets.
- Profile with Flutter DevTools before optimizing.
- Do not add caching, memoization, or isolates without a measured bottleneck.
