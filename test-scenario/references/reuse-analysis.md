# Reuse Analysis

Find similar test scenarios before designing new ones.

## When to use
- Before designing any new test scenario
- Want to avoid duplicating existing test logic

## Process
1. Read `testScenarioIndex.json` — check for existing features
2. Abstract the intent — "Create X", "Validate Y status"
3. Fuzzy search — compare intent vs existing features
4. Deep comparison — match by logic flow, not entity name
   - >80% similarity → Clone & Tweak
   - >50% similarity → Pattern Reference
   - <50% → Fresh Design

## Output
```
Intent: [abstract intent]
Match: [Feature Name] (XX% match)
- Reusable: [steps / data / assertions]
- Strategy: Clone & Tweak / Pattern Reference / Fresh Design
- Modifications needed: [rename X→Y, update validations, keep flow]
```

## Rules
- Always check index before designing from scratch
- Compare logic flow, not feature names — "Create Order" ≈ "Create Invoice"
- Explicitly state what's unique vs what can be reused
