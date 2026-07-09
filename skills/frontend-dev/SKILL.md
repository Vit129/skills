---
name: frontend-dev
description: >
  This skill should be used when the user asks to "build a React app",
  "create a Flutter widget", "set up Tailwind",
  "configure Vite", "build Android Kotlin UI",
  "build iOS Swift UI", "write a component",
  "implement this design in code", "implement design", "set up Next.js",
  "use Server Components", "use React 19 hooks", "use useActionState", "use useOptimistic",
  or needs frontend development guidance for web or mobile applications.
  Use this for IMPLEMENTATION (how to code it), not design decisions (what to build).
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# Frontend Development


Build and maintain frontend applications across web and mobile.

Use this skill to implement components in code (React, Next.js, Tailwind, Flutter, native).
Use `ui-designer` first if design tokens, visual language, or component specs haven't been defined yet.

## When to Load Each Reference

| User says | Load |
|-----------|------|
| "React component", "hooks", "state management", "React 19", "useActionState", "useOptimistic" | `references/web/SKILL.md` |
| "Next.js", "App Router", "Server Components", "Server Actions", "RSC", "streaming" | `references/web/nextjs.md` |
| "Tailwind", "utility classes", "Tailwind v4" | `references/web/tailwind-standards.md` |
| "Vite config", "Vite + React", "Tailwind plugin" | `references/web/vite-config.md` |
| "Flutter", "widget", "navigation", "networking" | `references/flutter/SKILL.md` |
| "Android", "Kotlin", "Jetpack Compose", "Hilt", "Coroutines" | `references/android/SKILL.md` |
| "iOS", "Swift", "SwiftUI", "async/await", "Combine", "@Observable" | `references/ios/SKILL.md` |
| "code review", "review frontend code", "check quality", "audit code" | `references/shared/frontend-code-review.md` |
| "env config", "environment variables", "feature flags" | `references/shared/env-config-standards.md` |
| "error handling", "error boundary", "catch error" | `references/shared/error-handling-standards.md` |
| "logging", "logger", "log levels" | `references/shared/logging-standards.md` |
| "navigation", "routing", "deep link" | `references/shared/navigation-standards.md` |
| "testability", "data-testid", "accessibilityIdentifier", "testTag" | `references/shared/testability-standards.md` |
| "loading state", "empty state", "error state", "UI states" | `references/shared/ui-states-standards.md` |

## Web
- **React** — Component design, hooks, React 19 new hooks (useActionState, useOptimistic, useFormStatus). (Read `references/web/SKILL.md`)
- **Next.js 15** — App Router, Server Components, Server Actions, streaming, middleware. (Read `references/web/nextjs.md`)
- **Tailwind CSS** — Tailwind v4 utility classes and best practices. (Read `references/web/tailwind-standards.md`)
- **Vite Config** — Vite configuration with React + Tailwind plugin. (Read `references/web/vite-config.md`)

## Mobile
- **Flutter** — Widget design, state management, navigation, networking. (Read `references/flutter/SKILL.md`)
- **Android Native (Kotlin)** — MVVM, Jetpack Compose, Hilt, Coroutines. (Read `references/android/SKILL.md`)
- **iOS Native (Swift)** — MVVM, SwiftUI, @Observable (iOS 17+), async/await. (Read `references/ios/SKILL.md`)

## Shared Standards (All Platforms)
- **Frontend Code Review** — Static audit checklist for all platforms: architecture, UI states, testability, error handling. (Read `references/shared/frontend-code-review.md`)
- **Env Config** — Environment variables, feature flags, secrets management. (Read `references/shared/env-config-standards.md`)
- **Error Handling** — Error categories, logging, user-friendly messages. (Read `references/shared/error-handling-standards.md`)
- **Logging** — Log levels, format, security rules. (Read `references/shared/logging-standards.md`)
- **Navigation** — Route naming, deep links, navigation patterns. (Read `references/shared/navigation-standards.md`)
- **Testability** — data-testid, accessibilityIdentifier, testTag naming conventions. (Read `references/shared/testability-standards.md`)
- **UI States** — Loading, Success, Empty, Error state patterns. (Read `references/shared/ui-states-standards.md`)

## Inline Process

1. **Check prerequisites** — If design tokens/component specs don't exist yet, use `ui-designer` skill first. This skill is for IMPLEMENTATION, not design decisions.
2. **Identify the stack** — Match to ONE platform: React, Next.js 15, Tailwind CSS, Vite, Flutter, Android Kotlin, or iOS Swift. Load the corresponding reference.
3. **Implement with testability** — Add `data-testid` on ALL interactive elements during component creation. Use platform equivalents: `accessibilityIdentifier` (iOS), `testTag` (Android).
4. **Handle all 4 UI states** — Every component must handle: Loading, Success, Empty, and Error states. These are part of the component contract, not polish for later.
5. **Write LLM-friendly comments** — Non-trivial functions get JSDoc/TSDoc with: what + why + who calls + params/return/throws.
6. **Follow platform patterns** — React 19: useActionState, useOptimistic. Next.js 15: Server vs Client Components. Mobile: MVVM, proper state management.
7. **Apply shared standards** — Environment config, error handling, logging, navigation, fresh provider/store per test.
8. **Verify build** — `data-testid` present, all 4 UI states handled, build passes, TypeScript clean (`tsc --noEmit`).

## ⚠️ Gotchas

- **Gemini introduces bugs on logic-heavy edits** — Gemini tends to fix one bug and introduce another (e.g., `null` vs `[]` conditional logic). Fix: use Claude Sonnet for any task graded 🟡 Medium or above. Never hand off Gemini output to Claude without flagging the cost.
- **Component missing `data-testid`** — new components built without testability attributes break Playwright tests silently. Fix: always add `data-testid` during component creation, not as an afterthought.
- **State not reset between renders** — shared state (context, store) leaks between component renders in tests. Fix: wrap each test in a fresh provider/store instance.
- **LLM-Friendly comments omitted** — agent writes code without intent comments, making future AI edits error-prone. Fix: every non-trivial function needs a comment block with what + why + who calls it.

## LLM-Friendly Code Comments

Write comments that AI agents can understand — not just humans:

```ts
// ❌ Old style (for humans only):
// validate input

// ✅ New style (for AI + humans):
// Validates user input against business rules before saving to DB.
// If validation fails, returns structured error with field-level messages.
// Called by: handleSubmit() in FormComponent.
```

**Principles:**
- State **what** + **why** + **who calls** — not just what
- Include context AI needs to edit correctly (dependencies, side effects, constraints)
- Function signatures: add JSDoc/TSDoc with params + return + throws
- Complex logic: add comment block before section explaining the business rule

---

## Anti-Rationalization Table

| Excuse to Skip | Counter-Argument |
|---|---|
| "I'll add data-testid later when QA needs it" | Missing testability attributes break Playwright tests silently — QA discovers the gap only after writing tests that can't find elements. Add `data-testid` during component creation, always. |
| "I don't need to load the reference file — I know React/Next.js well enough" | References contain project-specific conventions (React 19 hooks like useActionState, Next.js 15 App Router patterns). Using outdated patterns from training data introduces inconsistencies. |
| "UI states (loading, empty, error) can be added in a follow-up PR" | Components without state handling crash or show blank screens in production. Loading/empty/error states are part of the component contract, not polish. Ship them together. |
| "I'll skip LLM-friendly comments — the code is self-documenting" | Future AI edits on uncommented code produce bugs because the agent can't infer intent, dependencies, or side effects. Comments with what+why+who-calls prevent regression. |
| "I'll use the same state management approach for all components" | Server Components, Client Components, and shared state have different patterns in Next.js 15. Using client-side state where server state suffices bloats the bundle and breaks streaming. |

---

## Red Flags

- 🚩 New component has no `data-testid` attributes → Testability standard violated; add identifiers before merging.
- 🚩 Test file creates components without wrapping in fresh provider/store → Shared state leaks between tests causing flaky failures; isolate each test's state.
- 🚩 Agent used Gemini for a logic-heavy edit without flagging the risk → Gemini introduces subtle bugs on medium+ complexity; escalate to Claude Sonnet for logic-heavy work.
- 🚩 Component handles only the success state → Missing loading/empty/error states; load `ui-states-standards.md` and implement all 4 states.
- 🚩 Functions lack JSDoc/TSDoc with params + return + throws → LLM-friendly comment standard not followed; add documentation for non-trivial functions.

---


## Consistency Contract

> These steps MUST execute in the same order every time this skill runs.
> Output may vary, but the workflow is fixed.
> If any step is skipped without a documented skip condition, the session-save hook will flag this skill.

## Verification

Before declaring frontend implementation complete, confirm:

- [ ] `data-testid` on all interactive elements
- [ ] All 4 UI states handled (Loading, Success, Empty, Error)
- [ ] LLM-friendly comments on non-trivial functions
- [ ] Correct reference loaded for stack (React/Next.js/Flutter/Kotlin/Swift)
- [ ] No shared state leaking between component instances
- [ ] Build passes: `npm run build` / `flutter build` / `xcodebuild`
- [ ] TypeScript: `tsc --noEmit` clean


---

## Required Context

| Dependency | Type | Purpose |
|-----------|------|---------|
| Design system / component library | Design reference | Tokens, component specs, visual language |
| Existing component patterns in codebase | Source code | Match conventions, reuse patterns |
| `references/web/*.md` or `references/flutter/*.md` | Skill reference | Platform-specific implementation patterns |
| `ui-designer` skill output (if exists) | Design spec | Component specs and design tokens |
| `knowledge/lessons/` | Lessons learnt | Check before execute |

## Human-in-the-Loop Points

| Step | Approval Type | When |
|------|--------------|------|
| After component structure proposal | Checkbox (confirm hierarchy) | Before implementing component tree |
| After state management choice | Single select (local vs global vs server) | When multiple state approaches are valid |
| After UI states implementation | Open field | Review loading/empty/error state handling |

**Rule:** At decision points, always present 2-3 options with tradeoffs — never a single answer.

## Self-Learning

After user approves the output:

1. **Record good example:** Save approved output to `knowledge/lessons/frontend/{pattern}.md`
2. **Record failures:** If output was rejected → note what went wrong for next time
3. **Progressive update:** If a new pattern proved effective → append to relevant knowledge index
4. **Confidence tracking:** `confidence: 1.0` (user-approved) vs `confidence: 0.7` (auto-generated)

### Improvement Tracking

- **Hook:** `session-save.json` appends to `agent-memory/skill-log.md` after every session using this skill
- **Hook:** `skill-improve.json` logs when user corrects this skill's output (silent)
- **Promotion:** 3x same issue in skill-log → auto-apply fix to this SKILL.md + bump version
- **Eval:** `eval-check.json` runs pass@3 weekly if this skill is flagged in `memory.md`
