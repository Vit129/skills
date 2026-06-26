# Detection Checklist (7 Categories)

Scan in this order. Each category has specific patterns to look for.

## 1. Cross-Boundary Contract Mismatches
Where two pieces of code **agree on intent but disagree on shape**.

| Check | Example |
|-------|---------|
| Function name at call site ≠ definition | `getUserName()` called but `getUsername()` defined |
| Parameter count mismatch | Caller passes 3 args, function expects 2 |
| Parameter type mismatch | Caller sends `string`, receiver expects `number` |
| Return type mismatch | Function returns `T \| null`, caller doesn't handle null |
| Interface implementation gaps | Class claims to implement interface but misses a method |
| Event name mismatch | Publisher emits `user.created`, subscriber listens `userCreated` |
| API contract drift | Frontend expects `{ data: [] }`, backend returns `{ items: [] }` |

## 2. Serialization & Encoding Gaps
Where data **crosses a wire or storage boundary** and loses fidelity.

| Check | Example |
|-------|---------|
| Casing mismatch | Code uses `camelCase`, JSON/DB uses `snake_case`, no mapping |
| Optional vs required confusion | Field optional in type, but code accesses without null check |
| Date/time format mismatch | ISO string stored, epoch number expected |
| Encoding layers | Double-encoding URLs, HTML entities in JSON, UTF-8 vs Latin-1 |
| Missing fields after schema change | New field added to DB, old code doesn't read/write it |
| Enum string vs number | TypeScript enum serializes as number, API expects string |

## 3. Logic Bugs
Where the code **computes the wrong answer**.

| Check | Example |
|-------|---------|
| Off-by-one | `< length` vs `<= length`, 0-indexed vs 1-indexed |
| Double counting | Fee calculated in service AND in controller |
| Inverted condition | `if (!isValid)` where `if (isValid)` intended |
| Dead code after early return | Code after `return` / `throw` that never executes |
| Shadowed variables | Inner scope re-declares outer variable, hides the real value |
| Wrong operator | `=` vs `==`, `&&` vs `||`, `+` (concat) vs `+` (add) |
| Incorrect default | Default value doesn't match business rule |

## 4. Property & Method Access Errors
Where code **reaches for something that isn't there**.

| Check | Example |
|-------|---------|
| Null/undefined dereference | `user.address.city` when `address` can be null |
| Wrong property name | `response.data` vs `response.body` |
| Array access without bounds check | `items[0]` when array might be empty |
| Optional chaining inconsistency | `user?.name` in one place, `user.name` in another |
| Type narrowing gaps | After `if (x)` check, code still treats x as possibly falsy |

## 5. Async & Concurrency Bugs
Where **timing or ordering** assumptions are wrong.

| Check | Example |
|-------|---------|
| Missing await | `const data = fetchData()` — gets Promise, not data |
| Race condition | Two requests modify same resource, last-write-wins silently |
| Resource leak | Connection/stream opened but not closed on error path |
| Unhandled rejection | Promise `.catch()` missing, error swallowed |
| Stale closure | Event handler captures old state, doesn't see updates |
| Concurrent modification | Iterating collection while another path modifies it |

## 6. Placeholder & Stub Code
Where code **pretends to work but doesn't**.

| Check | Example |
|-------|---------|
| TODO/FIXME/HACK in production path | `// TODO: implement validation` |
| Empty catch blocks | `catch (e) {}` — error swallowed silently |
| Hardcoded values | `if (userId === "admin")` instead of proper auth |
| Unused function results | `calculateTotal()` called but return value discarded |
| Dead imports | Import statement but symbol never used |
| Console.log left in | Debug logging in production code |

## 7. Language-Specific Checks

**TypeScript / JavaScript:** `any` hiding mismatches · `as` assertions bypassing safety · `==` instead of `===` · missing `readonly` · `JSON.parse()` without validation

**Python:** mutable default args (`def f(x=[])`) · `is` vs `==` for values · missing `__init__` assignments · bare `except:`

**C# / .NET:** `async void` (unobservable exceptions) · missing `ConfigureAwait(false)` in libs · `IDisposable` not disposed · string comparison without `StringComparison`

**Swift:** force-unwrap `!` on optionals that can be nil · `try!` swallowing throws · retain cycles (strong `self` in closures) · `@MainActor` violations
