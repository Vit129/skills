---
name: frontend-dev
description: >
  This skill should be used when the user asks to "build a React app", "create a Flutter widget",
  "set up Tailwind", "configure Vite", "build Android Kotlin UI", "build iOS Swift UI",
  "write a component", "implement this design in code",
  or needs frontend development guidance for web or mobile applications.
  Use this for IMPLEMENTATION (how to code it), not design decisions (what to build).
---

# Frontend Development

Build and maintain frontend applications across web and mobile.

Use this skill to implement components in code (React, Tailwind, Flutter, native).
Use `ui-designer` first if design tokens, visual language, or component specs haven't been defined yet.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "React component", "hooks", "state management", "folder structure" | `references/react.md` |
| "Tailwind", "utility classes", "Tailwind v4" | `references/tailwind-standards.md` |
| "Vite config", "Vite + React", "Tailwind plugin" | `references/vite-config.md` |
| "Flutter", "widget", "navigation", "networking" | `references/flutter.md` |
| "Android", "Kotlin", "Jetpack Compose", "Hilt", "Coroutines" | `references/android-kotlin.md` |
| "iOS", "Swift", "SwiftUI", "async/await", "Combine" | `references/ios-swift.md` |

## Web
- **React** — Component design, hooks, state management, folder structure. (Read `references/react.md`)
- **Tailwind CSS** — Tailwind v4 utility classes and best practices. (Read `references/tailwind-standards.md`)
- **Vite Config** — Vite configuration with React + Tailwind plugin. (Read `references/vite-config.md`)

## Mobile
- **Flutter** — Widget design, state management, navigation, networking. (Read `references/flutter.md`)
- **Android Native (Kotlin)** — MVVM, Jetpack Compose, Hilt, Coroutines. (Read `references/android-kotlin.md`)
- **iOS Native (Swift)** — MVVM, SwiftUI, async/await, Combine. (Read `references/ios-swift.md`)
