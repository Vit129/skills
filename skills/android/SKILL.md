---
name: android
description: >
  Use this reference when building, reviewing, or refactoring Android native
  code with Kotlin, Jetpack Compose, ViewModel, StateFlow, Navigation Compose,
  Hilt, Room, coroutines, or Compose UI tests.
version: 1.0.0
last_improved: 2026-06-06
improvement_count: 0
---

# Android Kotlin and Jetpack Compose

Build Android native features with Kotlin-first, Compose-first implementation.
Use XML views or Fragments only for legacy surfaces or project-specific
constraints.

## Load Order

Read these references before editing Android code:

1. `android-kotlin.md` for architecture and implementation patterns.
2. `compose.md` for Compose state, UI structure, navigation, and lifecycle.
3. `coroutines-flow.md` for `StateFlow`, lifecycle collection, and dispatcher rules.
4. `testing-accessibility.md` for semantics, `testTag`, and Compose UI tests.
5. `../shared/testability-standards.md` for cross-platform testability rules.
6. `../shared/ui-states-standards.md` for loading, success, empty, and error states.
7. `../shared/error-handling-standards.md` for user-safe errors.
8. `../shared/navigation-standards.md` when routes or deep links are involved.
9. `../shared/logging-standards.md` when adding diagnostics.
10. `../shared/env-config-standards.md` when touching configuration or secrets.

## Default Stack

- Language: Kotlin.
- UI: Jetpack Compose for new views.
- Architecture: MVVM by feature.
- State: immutable screen state exposed as `StateFlow`.
- UI collection: `collectAsStateWithLifecycle()`.
- Navigation: Navigation Compose with typed route wrappers where the project
  supports them.
- DI: Hilt when already present or appropriate for the app.
- Persistence: Room for structured local data.
- Networking: Retrofit/OkHttp or the project standard.

## Official Documentation Anchors

- Compose state: https://developer.android.com/develop/ui/compose/state
- State hoisting: https://developer.android.com/develop/ui/compose/state-hoisting
- `collectAsStateWithLifecycle`: https://developer.android.com/reference/kotlin/androidx/lifecycle/compose/collectAsStateWithLifecycle
- Navigation Compose: https://developer.android.com/develop/ui/compose/navigation
- Compose semantics: https://developer.android.com/jetpack/compose/semantics
- Compose testing: https://developer.android.com/codelabs/jetpack-compose-testing

## Review Checklist

- Screen state is explicit and immutable.
- State is hoisted to the lowest common owner.
- Business state lives in a `ViewModel`; ephemeral UI element state stays near
  the composable unless business logic requires otherwise.
- Flow collection uses `collectAsStateWithLifecycle()`.
- New lists use lazy containers.
- Critical controls and dynamic rows have semantics or `testTag`.
- Navigation passes stable IDs or route values, not large mutable objects.
- No blocking IO or CPU-heavy work runs on the main thread.
