# Algorithm of Thought (AoT)

Simulate an algorithmic search process — explore multiple paths, backtrack when stuck, select the best route.
Similar to DFS/BFS on a tree of possible solutions, but executed mentally rather than in code.

## When to use
- Problem has multiple branching decision points
- Need to explore both happy paths and dead-ends before deciding
- Greedy approach (picking the first option found) tends to give suboptimal results
- Need traceable reasoning showing why each path was chosen or rejected

## How it works

### Phase 1: Define the Search Space
1. Clearly state the problem and goal
2. Identify all decision points — how many options at each
3. Define evaluation criteria for judging good vs bad paths

### Phase 2: Explore (DFS-style)
4. Choose the first option → expand as deep as possible
5. At each node, evaluate:
   - ✅ Promising → continue expanding
   - ⚠️ Uncertain → note it, continue cautiously
   - ❌ Dead-end → stop, record reason, **backtrack**
6. When backtracking → return to the most recent decision point with remaining options → try the next one

### Phase 3: Evaluate & Select
7. Compare all explored paths
8. Score against criteria defined in Phase 1
9. Select the best path — explain why others were eliminated

## Key Principles
- **Backtracking is strength, not failure** — backtracking means learning that path doesn't work
- **Record dead-ends** — document every dead-end with reason to avoid revisiting
- **Depth before breadth** — go deep first, backtrack if stuck, don't explore shallowly across all options
- **Prune early** — if a path is clearly wrong, cut it immediately without exploring further

## Tips
- Use tree notation (indentation) to show exploration depth
- If decision points are many (>5 options), prune with heuristics before going deep
- Combine with CoT — use CoT at each node to evaluate promising vs dead-end
- Combine with LATS — use AoT to explore first, then feed top candidates into LATS scoring

## Example
```
Problem: Choose database strategy for a multi-tenant booking system

Goal: Support 50+ tenants, data isolation, query performance

Decision Points:
  D1: DB Architecture → [Shared DB, Schema-per-tenant, DB-per-tenant]
  D2: Caching → [Redis, In-memory, No cache]
  D3: Read/Write split → [Yes, No]

Exploration:

[D1] Shared DB
  ├─ ✅ Easy to deploy, low cost
  ├─ [D2] Redis cache
  │   ├─ ✅ Good query performance
  │   ├─ [D3] Read/Write split
  │   │   └─ ✅ Scalable — VIABLE PATH (Score: 7/10)
  │   └─ [D3] No split
  │       └─ ⚠️ Potential write bottleneck — VIABLE BUT RISKY (Score: 5/10)
  └─ [D2] No cache
      └─ ❌ 50 tenants on shared table = slow queries — DEAD END

[D1] Schema-per-tenant
  ├─ ✅ Good data isolation
  ├─ ⚠️ Migrations must run across 50 schemas
  ├─ [D2] Redis cache
  │   └─ [D3] Read/Write split
  │       └─ ✅ Isolation + Performance — VIABLE PATH (Score: 8/10)
  └─ [D2] No cache
      └─ ⚠️ Acceptable if queries are simple — VIABLE (Score: 6/10)

[D1] DB-per-tenant
  ├─ ✅ Maximum isolation
  ├─ ❌ 50 DB instances = operational nightmare, very high cost
  └─ DEAD END (pruned — D2, D3 not explored)

Selected: Schema-per-tenant + Redis + Read/Write split (8/10)
Reason: Balances isolation with operational cost
         Dead-ends show Shared DB doesn't scale, DB-per-tenant is too expensive
```

## Comparison with Other Techniques

| Technique | Best for | Difference from AoT |
|-----------|----------|---------------------|
| CoT | Linear problems, step-by-step | AoT explores multiple paths + backtracks |
| LATS | Comparing N options flat | AoT explores as a tree (deep + branching) |
| Step-Back | Zooming out to see the big picture | AoT dives deep into each path's details |
| AoT | Problems with multi-level branching decisions | Uses backtracking as its core mechanism |
