---
name: frontend-dev
description: >
  This skill should be used when the user asks to "build a React app", "create a Flutter widget",
  "set up Tailwind", "configure Vite", "build Android Kotlin UI", "build iOS Swift UI",
  "write a component", "implement this design in code", "set up Next.js", "use Server Components",
  "use React 19 hooks", "use useActionState", "use useOptimistic",
  or needs frontend development guidance for web or mobile applications.
  Use this for IMPLEMENTATION (how to code it), not design decisions (what to build).
---

# Frontend Development

Build and maintain frontend applications across web and mobile.

Use this skill to implement components in code (React, Next.js, Tailwind, Flutter, native).
Use `ui-designer` first if design tokens, visual language, or component specs haven't been defined yet.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "React component", "hooks", "state management", "React 19", "useActionState", "useOptimistic" | `references/web/react.md` |
| "Next.js", "App Router", "Server Components", "Server Actions", "RSC", "streaming" | `references/web/nextjs.md` |
| "Tailwind", "utility classes", "Tailwind v4" | `references/web/tailwind-standards.md` |
| "Vite config", "Vite + React", "Tailwind plugin" | `references/web/vite-config.md` |
| "Flutter", "widget", "navigation", "networking" | `references/flutter/flutter.md` |
| "Android", "Kotlin", "Jetpack Compose", "Hilt", "Coroutines" | `references/android/android-kotlin.md` |
| "iOS", "Swift", "SwiftUI", "async/await", "Combine", "@Observable" | `references/ios/ios-swift.md` |
| "code review", "review frontend code", "check quality", "audit code" | `references/shared/frontend-code-review.md` |
| "env config", "environment variables", "feature flags" | `references/shared/env-config-standards.md` |
| "error handling", "error boundary", "catch error" | `references/shared/error-handling-standards.md` |
| "logging", "logger", "log levels" | `references/shared/logging-standards.md` |
| "navigation", "routing", "deep link" | `references/shared/navigation-standards.md` |
| "testability", "data-testid", "accessibilityIdentifier", "testTag" | `references/shared/testability-standards.md` |
| "loading state", "empty state", "error state", "UI states" | `references/shared/ui-states-standards.md` |

## Web
- **React** — Component design, hooks, React 19 new hooks (useActionState, useOptimistic, useFormStatus). (Read `references/web/react.md`)
- **Next.js 15** — App Router, Server Components, Server Actions, streaming, middleware. (Read `references/web/nextjs.md`)
- **Tailwind CSS** — Tailwind v4 utility classes and best practices. (Read `references/web/tailwind-standards.md`)
- **Vite Config** — Vite configuration with React + Tailwind plugin. (Read `references/web/vite-config.md`)

## Mobile
- **Flutter** — Widget design, state management, navigation, networking. (Read `references/flutter/flutter.md`)
- **Android Native (Kotlin)** — MVVM, Jetpack Compose 2025, Hilt, Coroutines. (Read `references/android/android-kotlin.md`)
- **iOS Native (Swift)** — MVVM, SwiftUI, @Observable (iOS 17+), async/await. (Read `references/ios/ios-swift.md`)

## Shared Standards (All Platforms)
- **Frontend Code Review** — Static audit checklist for all platforms: architecture, UI states, testability, error handling. (Read `references/shared/frontend-code-review.md`)
- **Env Config** — Environment variables, feature flags, secrets management. (Read `references/shared/env-config-standards.md`)
- **Error Handling** — Error categories, logging, user-friendly messages. (Read `references/shared/error-handling-standards.md`)
- **Logging** — Log levels, format, security rules. (Read `references/shared/logging-standards.md`)
- **Navigation** — Route naming, deep links, navigation patterns. (Read `references/shared/navigation-standards.md`)
- **Testability** — data-testid, accessibilityIdentifier, testTag naming conventions. (Read `references/shared/testability-standards.md`)
- **UI States** — Loading, Success, Empty, Error state patterns. (Read `references/shared/ui-states-standards.md`)
