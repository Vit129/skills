# Test Scenario Reuse Analysis

Identify reusable test scenarios and patterns across features before designing new ones.

## When to use
- Before designing any new test scenario
- Mapping requirements to existing test scenarios
- Finding reusable patterns from existing test scenario files

## Process

### Part 1: Test Pattern Matching
1. Scan existing test scenario files in `.aidlc/` for the current system
2. Abstract Intent: extract core intent (e.g., "Create X", "Validate Y status")
3. Fuzzy Search: compare intent vs existing features
4. Deep Comparison — compare by LOGIC, not by entity name:
   - "Create Order" logic might be 90% identical to "Create Invoice"
   - Check: Setup → Action → Assert State pattern
   - If logic similarity > 80% → Clone & Tweak Candidate
   - If logic similarity > 50% → Pattern Reference

### Abstract Test Pattern Protocol
- Deconstruct Flow: Input (Data) → Action (User/API) → Output (Response/UI)
- Search by Flow: find existing scenarios with same flow structure even if object is different
- Verify Reusability: can I reuse Step definitions? Data Structure? Assertions?

### Part 2: Gap & Adaptation Strategy
1. Clone Candidate: [Feature Name] (Similarity: XX%)
2. Modifications Needed:
   - Data Pivot: change "Order ID" → "Invoice ID"
   - Step Tweak: change "Click Buy" → "Click Issue"
   - Assertion Adjustment: change "Status: Placed" → "Status: Issued"
3. New Logic: what is unique to this feature that must be newly written?

## Rules
- Always scan existing test scenario files in `.aidlc/` before designing
- Never ignore matches because "Feature Name" doesn't match exactly
- Compare Logic not Labels
- Explicitly state what needs to change (Gap)
- Never reuse "Bad Practices" (blind cloning without review)
