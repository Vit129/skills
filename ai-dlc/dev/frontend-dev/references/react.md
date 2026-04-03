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

## Performance (Vercel Best Practices)

### Critical — Eliminating Waterfalls
- Use `Promise.all()` for independent async operations
- Start promises early, await late in API routes
- Use Suspense to stream content
- Move `await` into branches where actually used

### Critical — Bundle Size
- Import directly, avoid barrel files: `import { Button } from './Button'` not `from './components'`
- Use `next/dynamic` for heavy components
- Load analytics/logging after hydration
- Preload on hover/focus for perceived speed

### High — Server-Side (Next.js)
- Use `React.cache()` for per-request deduplication
- Avoid module-level mutable state in RSC/SSR
- Minimize data passed to client components
- Parallelize fetches across components

### Medium — Re-render Optimization
- `React.memo()` for expensive renders that receive same props
- `useMemo` / `useCallback` only when there's a measured performance issue — don't premature optimize
- Hoist default non-primitive props outside component
- Use primitive dependencies in effects
- Use `startTransition` for non-urgent updates
- Use `useDeferredValue` for expensive renders to keep input responsive

### Medium — Rendering
- Lazy load routes: `React.lazy()` + `Suspense`
- Avoid inline object/array creation in JSX props
- Use ternary, not `&&` for conditionals (avoids `0` render bug)
- Extract static JSX outside components

### Low-Medium — JavaScript
- Build `Map` for repeated lookups instead of `Array.find` in loops
- Use `Set`/`Map` for O(1) lookups
- Return early from functions
- Defer non-critical work: `requestIdleCallback`

## Tips
- Prefer composition over inheritance
- Lift state up only when needed — keep state as local as possible
- Use TypeScript for all new components
- Error boundaries for graceful failure handling
- Put interaction logic in event handlers, not effects
