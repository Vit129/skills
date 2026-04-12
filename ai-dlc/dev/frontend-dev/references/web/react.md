# React Standards

Guidelines for building React and Next.js applications.

## Component Design
- Functional components only — no class components
- One component per file, named export preferred
- Keep components small: if >150 lines, split into sub-components
- Co-locate related files: `Button.tsx`, `Button.test.tsx`, `Button.module.css`
- No inline component definitions inside other components

## Hooks
- Custom hooks for reusable logic: `useAuth()`, `useFetch()`, `useDebounce()`
- Follow rules of hooks: only call at top level, only call in React functions
- Prefix with `use`: `usePortfolio`, not `getPortfolio`
- Split hooks with independent dependencies — don't combine unrelated state

## React 19 New Hooks
- `useActionState` — replaces `useFormState`, handles form actions + state
- `useOptimistic` — instant UI update before server confirms
- `useFormStatus` — inside form child components to read pending state
- `use(promise)` — read async resources in render (replaces some useEffect patterns)

```tsx
// useActionState
const [state, formAction, isPending] = useActionState(serverAction, initialState)

// useOptimistic
const [optimisticList, addOptimistic] = useOptimistic(list, (state, newItem) => [...state, newItem])

// useFormStatus (must be inside <form>)
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Saving...' : 'Save'}</button>
}
```

## State Management
- Local state: `useState` for component-level
- Shared state: Context API for small apps, Zustand/Jotai for medium, Redux for large
- Server state: React Query / TanStack Query for API data
- Avoid prop drilling >2 levels — use context or composition instead
- Use functional setState for stable callbacks: `setState(prev => ...)`
- Derive state during render, not in effects

## Folder Structure

```text
src/
├── components/     — reusable UI primitives (Button, Input, Modal)
├── features/       — feature-based modules (auth/, dashboard/, settings/)
├── hooks/          — custom hooks
├── pages/          — route-level components (thin, compose features)
├── data/           — data layer (API calls, stores, types)
├── utils/          — pure utility functions
└── assets/         — static files (images, fonts)
```

## Naming
- Components: PascalCase (`UserCard.tsx`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Utils: camelCase (`formatDate.ts`)
- Folders: kebab-case (`user-management/`)
- Constants: SCREAMING_SNAKE_CASE (`MAX_RETRY`)

## Performance (React 19 + Compiler)

### React Compiler (Experimental — Next.js 15.5+)
- Automatically memoizes components — reduces need for manual `useMemo`/`useCallback`
- Enable in `next.config.ts`: `experimental: { reactCompiler: true }`
- Still use `useMemo` for expensive computations until compiler is stable

### Critical — Eliminating Waterfalls
- Use `Promise.all()` for independent async operations
- Start promises early, await late in API routes
- Use Suspense to stream content

### High — Bundle Size
- Import directly, avoid barrel files: `import { Button } from './Button'` not `from './components'`
- Use `React.lazy` + `Suspense` for heavy components
- Load analytics/logging after hydration

### Medium — Re-render Optimization
- `React.memo()` for expensive renders that receive same props
- `useMemo` / `useCallback` only when there's a measured performance issue
- Use `startTransition` for non-urgent updates
- Use `useDeferredValue` for expensive renders to keep input responsive

## Cross-Platform Standards

These topics apply to all platforms — see dedicated files for full details:

- **Testability (data-testid):** `../shared/testability-standards.md`
- **UI States (Loading/Empty/Error):** `../shared/ui-states-standards.md`
- **Error Handling:** `../shared/error-handling-standards.md`
- **Environment Config:** `../shared/env-config-standards.md`
- **Logging:** `../shared/logging-standards.md`
- **Navigation & Deep Links:** `../shared/navigation-standards.md`

## Tips
- Prefer composition over inheritance
- Lift state up only when needed — keep state as local as possible
- Use TypeScript for all new components
- Error boundaries for graceful failure handling
- Put interaction logic in event handlers, not effects
