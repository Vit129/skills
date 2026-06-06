---
name: react-web
description: >
  Use this reference when building, reviewing, or refactoring React, TypeScript,
  client components, hooks, state, forms, Suspense, or modern web UI code.
version: 1.0.0
last_improved: 2026-06-06
improvement_count: 0
---

# React and Web Frontend

Build React features with TypeScript, accessible UI contracts, explicit state,
and framework-aware server/client boundaries.

## Load Order

Read these references before editing React code:

1. `react.md` for React architecture, hooks, state, performance, and UI rules.
2. `react-modern.md` for React official-doc anchors and modern hook rules.
3. `nextjs.md` when the app uses Next.js App Router or Server Components.
4. `vite-config.md` when Vite setup or environment handling is involved.
5. `tailwind-standards.md` when Tailwind classes or config are involved.
6. `../shared/testability-standards.md` for `data-testid` rules.
7. `../shared/ui-states-standards.md` for loading, success, empty, and error states.
8. `../shared/error-handling-standards.md` for user-safe errors.
9. `../shared/navigation-standards.md` when routing or deep links are involved.

## Official Documentation Anchors

- React hooks: https://react.dev/reference/react/hooks
- `useState`: https://react.dev/reference/react/useState
- `useEffect`: https://react.dev/reference/react/useEffect
- Next.js App Router: https://nextjs.org/docs/app
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js mutating data: https://nextjs.org/docs/app/getting-started/mutating-data
- Vite: https://vite.dev/guide/
- Tailwind CSS: https://tailwindcss.com/docs

## Review Checklist

- Components are functional, typed, and small enough to reason about.
- Hooks follow the Rules of Hooks and dependency arrays are correct.
- Effects synchronize with external systems; derived state is calculated during
  render instead of copied through effects.
- All four UI states are handled.
- Interactive elements have accessible names and stable test IDs when needed.
- Server/client boundary is explicit in Next.js.
- Expensive memoization is justified by measurement or known hot paths.
