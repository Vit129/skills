# Frontend Standards — Always Active

Applies to all React/TypeScript/Tailwind work. Loaded every session.

## React

- Functional components only — no class components
- One component per file, named export preferred
- Keep components < 150 lines — split if larger
- Custom hooks for reusable logic, prefix with `use`
- Use functional setState for stable callbacks: `setState(prev => ...)`
- Derive state during render, not in effects
- Put interaction logic in event handlers, not effects

### React 19 Hooks
- `useActionState` — form actions + state (replaces `useFormState`)
- `useOptimistic` — instant UI before server confirms
- `useFormStatus` — read pending state inside `<form>` children
- `use(promise)` — read async resources in render

### Performance
- `React.memo()` only when measured — not by default
- `useMemo`/`useCallback` only for measured bottlenecks
- `startTransition` for non-urgent updates
- Import directly — no barrel files: `import { Button } from './Button'` not `from './components'`

## Tailwind CSS v4

- Utility first — avoid `@apply` unless for reusable components
- Never construct class names dynamically: `text-${color}-500` ❌ — use full class names
- Mobile first: default → `md:` → `lg:`
- Dark mode via `dark:` variant
- Consistent spacing: `p-4`, `m-2`, `gap-4` (8px scale)

## UI States — Mandatory for Async Data

Every component loading async data MUST handle all 4 states:

| State | User sees | testId |
|-------|-----------|--------|
| loading | Skeleton / spinner | `[feature]-loading` |
| success | Content | `[feature]-content` |
| empty | Message + action | `[feature]-empty-state` |
| error | Message + retry | `[feature]-error-state` |

```typescript
type UiState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'empty' }
  | { status: 'error'; message: string }
```

No boolean flags (`isLoading`, `isError`) — use typed union.

## Test Identifiers

- `data-testid` on every interactive or verifiable element
- Format: `btn-[action]-[context]`, `[component]-[element]`, `[component]-[element]-{id}`
- Always kebab-case English — never Thai text in identifiers
- Dynamic list items MUST include item ID: `flight-result-item-{id}` not `item-0`

## Naming

| Thing | Convention |
|-------|-----------|
| Component | `PascalCase.tsx` |
| Hook | `camelCase` with `use` prefix |
| Utils | `camelCase.ts` |
| Folders | `kebab-case/` |
| Constants | `SCREAMING_SNAKE_CASE` |
| testid | `kebab-case` English |
