# Test-Driven Development (TDD)

Write tests first, then implement the minimum code to pass, then refactor.

## When to use

- Building new features or modules
- Refactoring existing code with confidence
- Designing APIs or business logic where correctness matters

## The Cycle: Red → Green → Refactor

1. **Red** — Write a failing test that describes the desired behavior
2. **Green** — Write the minimum code to make the test pass
3. **Refactor** — Clean up code while keeping all tests green

Repeat for each behavior increment.

## Process

1. Start from requirements or user stories
2. Break each story into small testable behaviors
3. For each behavior:
   - Write one test (assert expected outcome)
   - Run it — confirm it fails (Red)
   - Implement just enough code to pass (Green)
   - Refactor — remove duplication, improve naming, extract functions
   - Run all tests — confirm nothing broke
4. Move to next behavior

## Test structure (Arrange-Act-Assert)

```text
// Arrange — set up preconditions
// Act — execute the behavior under test
// Assert — verify the expected outcome
```

## Guidelines

- One assertion per test (or one logical concept)
- Test behavior, not implementation details
- Name tests descriptively: `should [expected behavior] when [condition]`
- Keep tests independent — no shared mutable state
- Fast tests — mock external dependencies (DB, APIs, file system)
- Test edge cases: empty input, null, boundary values, error paths

## When to use mocks

- External services (APIs, databases, message queues)
- Time-dependent logic (use clock mocks)
- Non-deterministic behavior (random, network)
- Do NOT mock the unit under test itself

## Anti-patterns to avoid

- Writing tests after code (defeats the design benefit)
- Testing private methods directly
- Tests that depend on execution order
- Over-mocking (testing mocks instead of behavior)
- Skipping the refactor step

## TDD with existing code

1. Write characterization tests — capture current behavior
2. Refactor with safety net of passing tests
3. Add new behavior using Red → Green → Refactor
