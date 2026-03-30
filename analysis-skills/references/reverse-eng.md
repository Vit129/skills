# Reverse Engineering

Scan an existing codebase to understand its architecture before starting new work.

## When to use
- Joining an existing project (brownfield)
- Need to understand what's already built before adding features
- Documenting an undocumented system

## How it works
1. **Detect project type** — look for existing code files. No code = greenfield, skip this
2. **Identify tech stack** — scan package.json, requirements.txt, pom.xml, go.mod, etc.
3. **Analyze architecture** — directory structure, entry points, config files → monolith / microservices / serverless
4. **Map code structure** — key components, business logic location, data models, API endpoints
5. **Document findings** — write product context, tech context, structure context

## Output
```
Product: [what the app does, key features, user types]
Tech: [language, framework, database, infrastructure]
Architecture: [pattern, module boundaries, integration points]
Structure: [key folders, components, data models]
Recommendations: [suggested approach for new development]
```

## Tips
- Scan production code only — not test code
- If context files already exist, compare and update only changed sections
- Only document what you actually find — never hallucinate
