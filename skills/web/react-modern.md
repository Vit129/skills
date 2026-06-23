# Modern React Reference

Use this reference for React hooks, state, effects, forms, optimistic updates,
and TypeScript component review.

Official docs:

- Built-in React hooks: https://react.dev/reference/react/hooks
- `useState`: https://react.dev/reference/react/useState
- `useEffect`: https://react.dev/reference/react/useEffect
- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js data mutations: https://nextjs.org/docs/app/getting-started/mutating-data

## Component Rules

- Use function components.
- Keep component files cohesive; split once render logic or state transitions
  become hard to scan.
- Keep component props typed and narrow.
- Prefer composition over global state or deep prop drilling.
- Put interaction logic in event handlers, not effects.

## Hook Rules

- Call hooks only at the top level of React functions or custom hooks.
- Use custom hooks for reusable stateful logic, not for hiding unrelated
  concerns in one large hook.
- Keep effect dependencies honest. Do not suppress dependency warnings without a
  documented reason.
- Use effects to synchronize with external systems such as DOM APIs, network
  subscriptions, timers, or browser storage.
- Derive state during render when it can be computed from props or state.

## React 19 Form and Optimistic Patterns

- Use `useActionState` for action-backed form state where the framework supports
  it.
- Use `useFormStatus` inside form descendants for pending UI.
- Use `useOptimistic` for immediate UI updates that later reconcile with server
  results.
- Keep optimistic reducers pure and reversible.

## Server State

- Prefer framework data loading or a server-state library over ad hoc
  `useEffect` fetches when the app already has that pattern.
- Avoid request waterfalls. Start independent requests early and coordinate with
  `Promise.all`.
- Keep loading, error, empty, and success states explicit.

## Performance

- Use `memo`, `useMemo`, and `useCallback` when there is measured churn, an
  expensive calculation, or a stable identity contract.
- Use `startTransition` for non-urgent updates.
- Use `useDeferredValue` for expensive rendering that should not block input.
- Avoid barrel imports for large component libraries when they inflate bundles.
