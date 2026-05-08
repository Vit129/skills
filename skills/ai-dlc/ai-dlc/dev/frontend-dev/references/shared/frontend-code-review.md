# Frontend Code Review

Static code audit checklist for all frontend platforms.
Load platform-specific reference first (react.md, android-kotlin.md, ios-swift.md, flutter.md).

## When to Use

- After implementing a feature (before PR)
- After AI generates code (verify quality)
- Sprint code review sessions

## Checklist — All Platforms

### Architecture
- [ ] Clean Architecture layers respected: presentation → domain → data
- [ ] No business logic in UI components/views
- [ ] State management follows platform pattern (see below)
- [ ] No circular dependencies between modules

### UI States (Mandatory — see `ui-states-standards.md`)
- [ ] All 4 states handled: Loading, Success, Empty, Error
- [ ] Typed state model (sealed class / union type) — no boolean flags
- [ ] Error state has retry action
- [ ] Loading state shows skeleton/spinner — not blank screen

### Testability (Mandatory — see `testability-standards.md`)
- [ ] All interactive elements have test identifiers
- [ ] Naming: English kebab-case (`btn-search-flights`)
- [ ] Dynamic lists include item ID (`flight-result-item-{id}`)
- [ ] No index-based identifiers (`item-0`, `item-1`)

### Error Handling (see `error-handling-standards.md`)
- [ ] Every API call has error handling — no silent failures
- [ ] User-friendly messages — no raw stack traces
- [ ] Error messages from constants/strings file — not hardcoded

### Environment Config (see `env-config-standards.md`)
- [ ] Single AppConfig / config.ts access point
- [ ] No `import.meta.env` / `BuildConfig` / `Bundle.main` directly in components
- [ ] No secrets in code — CI/CD injection only

---

## Platform-Specific Checks

### React / Next.js
- [ ] Functional components only — no class components
- [ ] Hooks at top level — no conditional hooks
- [ ] No prop drilling >2 levels — use context or composition
- [ ] `useMemo`/`useCallback` only for measured performance issues
- [ ] Server Components default (Next.js) — `"use client"` only when needed
- [ ] No `useEffect` for data fetching in Server Components
- [ ] Images via `next/image`, fonts via `next/font`
- [ ] No barrel file imports — import directly from component file

### Android (Kotlin / Jetpack Compose)
- [ ] Composable functions: small, focused, reusable
- [ ] State hoisting: state up, events down
- [ ] `collectAsStateWithLifecycle()` for Flow → Compose state
- [ ] No blocking main thread — use `Dispatchers.IO` for network/DB
- [ ] Hilt DI: `@Inject`, `@HiltAndroidApp`, proper scoping
- [ ] Kotlin Serialization for JSON — not Gson
- [ ] `sealed class` for UI states — not data class with nullable fields

### iOS (Swift / SwiftUI)
- [ ] Small views — extract sub-views when >50 lines
- [ ] `@State` for local, `@StateObject` for owned VMs
- [ ] `@Observable` macro (iOS 17+) preferred over `ObservableObject`
- [ ] `async/await` for async operations — no completion handlers for new code
- [ ] `@MainActor` for UI updates
- [ ] No force unwrap `!` — use `guard let`, `if let`, `??`
- [ ] Keychain for sensitive data — not UserDefaults

### Flutter
- [ ] `const` constructors wherever possible
- [ ] `ListView.builder` for long lists — never `ListView(children: [...])`
- [ ] `final` over `var` — immutability by default
- [ ] State scoped to smallest widget tree possible
- [ ] `go_router` for navigation — named routes for deep linking
- [ ] `freezed` or `json_serializable` for models — not manual fromJson

---

## Review Report Format

```markdown
### 🔍 Frontend Code Review
- Status: APPROVED ✅ / NEEDS FIX ⚠️
- Platform: React / Android / iOS / Flutter
- Files Reviewed: {N}

| Severity | File | Issue | Fix |
|----------|------|-------|-----|
| 🔴 High | UserCard.tsx | Missing error state | Add Error UI state |
| 🔴 High | LoginScreen.kt | Blocking main thread | Move to Dispatchers.IO |
| 🟡 Med | FlightList.dart | Not using ListView.builder | Replace with builder |
| 🟢 Low | ProfileView.swift | Missing accessibilityIdentifier | Add identifier |

Critical Blockers: {N}
```

## Severity Guide

| Severity | Criteria | Action |
|----------|----------|--------|
| 🔴 High | Missing UI states, blocking main thread, no error handling, secrets in code | Must fix before merge |
| 🟡 Medium | Missing test IDs, suboptimal patterns, missing const | Fix before PR approval |
| 🟢 Low | Naming nitpicks, missing comments, import order | Fix when convenient |
