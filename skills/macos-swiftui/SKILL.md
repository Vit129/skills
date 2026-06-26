---
name: macos-swiftui
description: >
  Use when working with SwiftUI on macOS: NSHostingView, NSViewRepresentable, List onDrag,
  SwiftUI drag-drop, OutlineGroup, NavigationSplitView, @Observable, Transferable,
  or any macOS UI component integration with AppKit.
version: 1.1.0
last_improved: 2026-06-26
improvement_count: 1
---

# macOS SwiftUI Skill

## Trigger
SwiftUI macOS, NSHostingView, NSViewRepresentable, List onDrag, SwiftUI drag-drop,
OutlineGroup, NavigationSplitView, @Observable, Transferable, macOS UI component

---

## Load Right Reference

| Task | Load |
|------|------|
| Swift types, async/await, actors, Sendable | `references/swift-lang.md` |
| @State, @Observable, @Binding, state wrappers | `references/state-management.md` |
| NavigationSplitView, List tree, toolbar, shortcuts | `references/ui-components.md` |
| .onDrag, .dropDestination, Transferable, UTType | `references/drag-drop.md` |
| NSHostingView, NSViewRepresentable, bridging | `references/appkit-swiftui.md` |
| Async FileManager, directory scan, lazy children | `references/filesystem.md` |

---

## Anti-Patterns

| Anti-pattern | Fix |
|---|---|
| Side effects in `body` | Use `.task { }` or `.onAppear { }` |
| `@StateObject` with `@Observable` | Use `@State` with `@Observable`; `@StateObject` only for `ObservableObject` |
| NSItemProvider callback updating `@State` directly | Dispatch to `DispatchQueue.main` or `Task { @MainActor in }` |
| File I/O on main thread | `Task.detached(priority: .utility)` |
| Force-unwrap NSItemProvider loads | Always check error + nil |
| `FileRepresentation`-only Transferable | Always add `CodableRepresentation` fallback |
| Fat `@EnvironmentObject` re-rendering all | Break into focused models; use `@Observable` per-property tracking |

---

## When to Fall Back to AppKit

| Need | Reason |
|---|---|
| Drag preview customization | SwiftUI previews corrupt/invisible on macOS; use `NSDraggingItem.imageComponentsProvider` |
| Hierarchical drag-to-reorder | `List(children:)` cannot reorder hierarchical items as of macOS 14 |
| `NSSplitView` programmatic collapse | `NavigationSplitView` can't collapse programmatically |
| Rich text / `NSAttributedString` editing | `TextEditor` is too thin; need `NSTextView` |
| Per-location context menus | SwiftUI `.contextMenu` fires per-view; AppKit `NSMenu` varies by click position |
| Complex multi-column `NSTableView` | SwiftUI `Table` lacks row actions, complex cell editing |
| Menu bar status items | `MenuBarExtra` (macOS 13+) for simple; `NSStatusItem` for complex |
