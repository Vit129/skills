# React Standards

Guidelines for building React applications.

## Component Design
- Functional components only — no class components
- One component per file, named export preferred
- Keep components small: if >150 lines, split into sub-components
- Co-locate related files: `Button.tsx`, `Button.test.tsx`, `Button.module.css`

## Hooks
- Custom hooks for reusable logic: `useAuth()`, `useFetch()`, `useDebounce()`
- Follow rules of hooks: only call at top level, only call in React functions
- Prefix with `use`: `usePortfolio`, not `getPortfolio`

## State Management
- Local state: `useState` for component-level
- Shared state: Context API for small apps, Zustand/Jotai for medium, Redux for large
- Server state: React Query / TanStack Query for API data
- Avoid prop drilling >2 levels — use context or composition instead

## Folder Structure
```
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

## Performance
- `React.memo()` for expensive renders that receive same props
- `useMemo` / `useCallback` only when there's a measured performance issue — don't premature optimize
- Lazy load routes: `React.lazy()` + `Suspense`
- Avoid inline object/array creation in JSX props

## Tips
- Prefer composition over inheritance
- Lift state up only when needed — keep state as local as possible
- Use TypeScript for all new components
- Error boundaries for graceful failure handling
