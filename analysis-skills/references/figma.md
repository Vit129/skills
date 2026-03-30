# Figma & UI Analysis

Extract UI components, interactions, and test implications from Figma designs or screenshots.

## When to use
- Feature has Figma links or UI mockups
- Need to understand what screens, components, and flows exist
- Mapping design to test scenarios

## How it works
1. **Check for visual context** — Figma link in requirements? Screenshots provided? If nothing → ask user
2. **Identify screens** — list all screens and their purpose
3. **Extract components** — buttons, forms, tables, modals, dropdowns
4. **Map interactions** — click, submit, navigate, hover, drag
5. **Identify states** — default, loading, error, success, empty
6. **Map to business rules** — which UI element enforces which rule?
7. **Simulate errors** — what happens on network failure, slow load, empty data?

## Output
```
Screens: [list with purpose]
Components: Buttons [list], Forms [list], Tables [list]
Interactions: Click [what happens], Submit [what happens]
States: Default, Loading, Error, Success
Business Rules: [element] → [rule it enforces]
Edge Cases: Network failure → [behavior], Empty state → [behavior]
```
