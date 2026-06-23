---
name: flutter-dart
description: >
  Use this reference when building, reviewing, or refactoring Flutter code with
  Dart, widgets, state management, navigation, networking, accessibility,
  widget tests, integration tests, or Flutter DevTools.
version: 1.0.0
last_improved: 2026-06-06
improvement_count: 0
---

# Flutter and Dart

Build Flutter features with Dart-first, widget-composition-first implementation.
Prefer project conventions for state management; do not introduce a new app-wide
state library without a clear reason.

## Load Order

Read these references before editing Flutter code:

1. `flutter.md` for local architecture and implementation patterns.
2. `flutter-modern.md` for official-doc-backed state, navigation, testing, and
   accessibility guidance.
3. `../shared/testability-standards.md` for cross-platform testability rules.
4. `../shared/ui-states-standards.md` for loading, success, empty, and error states.
5. `../shared/error-handling-standards.md` for user-safe errors.
6. `../shared/navigation-standards.md` when routes or deep links are involved.
7. `../shared/logging-standards.md` when adding diagnostics.
8. `../shared/env-config-standards.md` when touching configuration or secrets.

## Official Documentation Anchors

- Flutter docs: https://docs.flutter.dev/
- State management: https://docs.flutter.dev/data-and-backend/state-mgmt/intro
- Navigation: https://docs.flutter.dev/ui/navigation
- Testing: https://docs.flutter.dev/testing
- Accessibility: https://docs.flutter.dev/ui/accessibility
- Accessibility testing: https://docs.flutter.dev/ui/accessibility/accessibility-testing
- DevTools: https://docs.flutter.dev/tools/devtools

## Review Checklist

- Widgets are small, composable, and use `const` constructors where possible.
- State is scoped to the smallest useful owner.
- Screens handle loading, success, empty, and error states.
- Navigation passes stable route parameters, not large mutable objects.
- User-facing strings are localized or follow the project localization pattern.
- Critical controls and dynamic content have stable `Key` or semantics where
  tests need them.
- `flutter analyze` and relevant tests are run with the project's real commands.
