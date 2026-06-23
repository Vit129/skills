# SwiftUI Reference

Use this reference for new native iOS views, view refactors, navigation, and
preview work.

Official docs:

- SwiftUI: https://developer.apple.com/documentation/swiftui/
- SwiftUI app overview: https://developer.apple.com/documentation/technologyoverviews/swiftui
- NavigationStack: https://developer.apple.com/documentation/SwiftUI/NavigationStack
- NavigationPath: https://developer.apple.com/documentation/swiftui/navigationpath
- Understanding the navigation stack: https://developer.apple.com/documentation/swiftui/understanding-the-navigation-stack
- Robust navigation sample: https://developer.apple.com/documentation/swiftui/bringing-robust-navigation-structure-to-your-swiftui-app

## App Structure

- Define app entry with `@main` and the `App` protocol for new SwiftUI apps.
- Initialize global dependencies at the app boundary, not inside leaf views.
- Keep scenes, feature roots, and route containers separate from leaf
  components.
- Use SwiftUI for new app surfaces; bridge UIKit only for legacy components,
  unavailable SwiftUI behavior, or third-party SDK integration.

## View Composition

- Keep `body` declarative and cheap.
- Extract repeated UI into focused `View` types or private computed views.
- Do not put network calls, database writes, heavy parsing, or business rules in
  `body`.
- Prefer standard controls, lists, forms, toolbars, sheets, and alerts before
  custom implementations.
- Use platform-adaptive APIs where available; avoid hard-coded iPhone-only
  layouts unless the feature is intentionally phone-only.

## State and Data Flow

- Local primitive UI state: `@State`.
- Parent-to-child values: plain immutable properties.
- Child-to-parent events: closures.
- Derived values: computed properties on the model or view model.
- Shared app context: `@Environment` or a project-owned dependency container.
- Observable reference model: use Observation rules in `observation.md`.

## Navigation

- New code should use value-driven `NavigationStack` with
  `navigationDestination(for:)`.
- Use `[Route]` where all stack entries are one route enum.
- Use `NavigationPath` only when the stack needs multiple unrelated value types.
- Keep route parsing and deep-link validation outside the view layer.
- Avoid using full domain model objects as navigation path values. Use stable
  IDs or small route values.
- Do not use deprecated `NavigationView` for new code.

Example route model:

```swift
enum AppRoute: Hashable {
    case holdingDetail(symbol: String)
    case transaction(id: UUID)
}
```

## Lifecycle

- Use `.task` to start async loading tied to a view's lifecycle.
- Use `.task(id:)` when the work depends on an identity value.
- Keep cancellation-friendly async code; avoid detached tasks unless there is a
  clear ownership reason.
- Use `scenePhase` at app or feature root level for background persistence or
  route restoration.

## Previews

- Add `#Preview` for meaningful screens and reusable components.
- Include loading, success, empty, and error states when the component owns a
  state model.
- Use local fake repositories or static fixtures, not live network calls.
- Keep preview-only data free of secrets and real customer data.

## Review Checks

- View `body` is readable and side-effect free.
- Navigation is value-driven and testable.
- Lifecycle work uses `.task` or an explicit model method.
- Preview fixtures cover realistic states.
- Layout supports Dynamic Type and does not assume one screen size.
