# Swift 6 XCTest Reference

## @MainActor Tests

When the type under test is `@MainActor`, the test class must be too.
Otherwise Swift 6 strict concurrency will reject cross-actor access.

```swift
@MainActor
final class MyModelTests: XCTestCase {
    // All funcs inherit @MainActor — no hop needed
    func testInitialState() {
        let model = MyModel()
        XCTAssertTrue(model.items.isEmpty)
    }
}
```

`XCTestCase` subclasses annotated `@MainActor` run their test methods on the
main actor. This matches the execution context of `@Observable` SwiftUI models
in harness-terminal.

---

## Async Tests

```swift
@MainActor
final class ScanTests: XCTestCase {
    func testScanPopulates() async throws {
        let model = PaletteModel(actions: [], recentIDs: [], mode: .normal)
        model.startFileScan()
        // Give the detached Task time to complete
        try await Task.sleep(for: .milliseconds(300))
        XCTAssertFalse(model.cachedFileEntries.entries.isEmpty)
    }
}
```

Avoid `XCTestExpectation` + `waitForExpectations` for new tests —
`async throws` + `Task.sleep` is cleaner under Swift Concurrency.

Use `XCTestExpectation` only when bridging callback-based APIs that
cannot be made async.

---

## Testing @Observable Models

`@Observable` tracks per-property reads. Tests don't need `withObservationTracking`
— just read properties directly after calling the method under test.

```swift
@MainActor
final class PaletteModelTests: XCTestCase {

    private func makeModel(
        actions: [PaletteAction] = [],
        mode: CommandPaletteController.PaletteMode = .normal
    ) -> PaletteModel {
        PaletteModel(actions: actions, recentIDs: [], mode: mode)
    }

    func testEmptyQueryProducesNoRows() {
        let model = makeModel()
        XCTAssertTrue(model.rows.isEmpty)
    }

    func testGrepModePreloadsQuery() {
        let model = makeModel(mode: .grep("TODO"))
        XCTAssertEqual(model.query, "TODO")
    }

    func testMoveSelectionWrapsAround() {
        let actions = (0..<3).map { i in
            PaletteAction(id: "\(i)", title: "Action \(i)", subtitle: "",
                          symbol: "star", shortcut: "", section: .actions) {}
        }
        let model = makeModel(actions: actions)
        // seed query so rows populate
        model.rebuildRows(query: "")
        let last = model.selectableIndexes.last!
        model.selectedRowIndex = last
        model.moveSelection(by: 1)
        XCTAssertEqual(model.selectedRowIndex, model.selectableIndexes.first)
    }
}
```

---

## Task.detached in Production Code

When the model starts a `Task.detached` (file scan, grep), the test must
yield before asserting on the result:

```swift
func testFileScanCachesEntries() async throws {
    let model = makeModel()
    model.startFileScan()
    // Spin until populated or timeout
    for _ in 0..<20 {
        if !model.cachedFileEntries.entries.isEmpty { break }
        try await Task.sleep(for: .milliseconds(50))
    }
    XCTAssertFalse(model.cachedFileEntries.entries.isEmpty,
                   "file scan should populate within 1 s")
}
```

For deterministic tests, inject the root path via a parameter rather than
reading from `SessionCoordinator` — that requires a real coordinator running.

---

## Isolating from SessionCoordinator / NSApp

Models that call `SessionCoordinator.shared` or `NSApp` in handlers are hard
to test in isolation. Two options:

1. **Inject a closure** — pass the coordinator call as a `() -> Void` in the
   `PaletteAction` handler; the test provides a spy closure instead.
2. **Test at the model boundary** — assert on `model.rows`, `model.selectedRowIndex`,
   and `model.query` only. Don't invoke `activate()` in unit tests; that
   reaches into live app state.

---

## Package.swift — Adding a Test Target

```swift
// In Package.swift, add to targets array:
.testTarget(
    name: "HarnessAppTests",
    dependencies: ["HarnessApp"],   // GUI app target — needs @testable import
    path: "Tests/HarnessAppTests"
),
```

Then create `Tests/HarnessAppTests/` and add test files.

`@testable import HarnessApp` gives access to `internal` types.
`private` types in HarnessApp source files remain unreachable — promote them
to `internal` first (see SKILL.md Testability Rule).

---

## Naming Convention

```
Tests/<TargetName>Tests/<TypeName>Tests.swift

func test<Behavior>_<Condition>_<ExpectedResult>()
// or just
func test<What>()   // when context is obvious from class name
```

Examples:
```swift
func testRebuildRows_emptyActions_producesNoRows()
func testMoveSelection_wrapsAroundEnd()
func testGrepMode_nonEmptyInitialQuery_preseedsQueryField()
```
