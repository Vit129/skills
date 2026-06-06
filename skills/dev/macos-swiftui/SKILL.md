---
name: macos-swiftui
description: >
  Use when working with SwiftUI on macOS: NSHostingView, NSViewRepresentable, List onDrag,
  SwiftUI drag-drop, OutlineGroup, NavigationSplitView, @Observable, Transferable,
  or any macOS UI component integration with AppKit.
version: 1.0.0
last_improved: 2026-05-31
improvement_count: 0
---

# macOS SwiftUI Skill

## Trigger
SwiftUI macOS, NSHostingView, NSViewRepresentable, List onDrag, SwiftUI drag-drop, OutlineGroup, NavigationSplitView, @Observable, Transferable, macOS UI component

---

## 1. Swift Language Essentials

### Types
```swift
struct Point { var x: Double; var y: Double }       // value type
enum Direction { case north, south, east, west }    // value type
class ViewModel { var count = 0 }                   // reference type
typealias FileID = UUID
```

### Optionals
```swift
var name: String? = nil
if let name { print(name) }          // Swift 5.7+ shorthand
guard let name else { return }
let safe = name ?? "default"
let count = name?.count              // optional chaining → Int?
```

### Async/Await
```swift
func fetchData(from url: URL) async throws -> Data {
    let (data, _) = try await URLSession.shared.data(from: url)
    return data
}

// Concurrent tasks
async let a = loadFile(at: pathA)
async let b = loadFile(at: pathB)
let (fileA, fileB) = try await (a, b)
```

### Actors
```swift
actor FileCache {
    private var cache: [URL: Data] = [:]
    func store(_ data: Data, for url: URL) { cache[url] = data }
    func retrieve(for url: URL) -> Data? { cache[url] }
}

@MainActor class AppState { var isLoading = false }
await MainActor.run { self.isLoading = false }
```

### Sendable
```swift
struct FileItem: Sendable { let id: UUID; let name: String; let url: URL }

// Class requires manual safety proof
final class ManagedBuffer: @unchecked Sendable {
    private let lock = NSLock()
    // ...manual locking
}
```

---

## 2. SwiftUI State Management

| Wrapper | Owner | Use |
|---|---|---|
| `@State` | View | Local value/object |
| `@Binding` | View | Two-way link to parent |
| `@StateObject` | View | Owns `ObservableObject` (macOS 11–13) |
| `@ObservedObject` | View | References `ObservableObject` not owned |
| `@EnvironmentObject` | View | Injected `ObservableObject` from ancestor |
| `@Observable` + `@State` | View | Owns new Observation object (macOS 14+) |
| `@Bindable` | View | Creates bindings to `@Observable` |
| `@Environment` | View | System or custom environment values |

### @Observable (macOS 14+ / Swift 5.9) — prefer this
```swift
@Observable
class FileTreeModel {
    var files: [FileNode] = []
    var selectedID: FileNode.ID? = nil

    @ObservationIgnored           // opt-out specific property from tracking
    private var cancellables: Set<AnyCancellable> = []
}

// Owns it
struct FileTreeView: View {
    @State private var model = FileTreeModel()
    var body: some View { FileList(model: model) }
}

// Passed in — no wrapper needed, auto-tracked
struct FileList: View {
    var model: FileTreeModel
    var body: some View { List(model.files) { Text($0.name) } }
}

// Bindings to @Observable
struct SearchBar: View {
    @Bindable var model: FileTreeModel
    var body: some View { TextField("Search", text: $model.searchQuery) }
}

// Environment injection
struct MyApp: App {
    @State private var model = FileTreeModel()
    var body: some Scene {
        WindowGroup { ContentView().environment(model) }
    }
}
struct ContentView: View {
    @Environment(FileTreeModel.self) private var model
}
```

### ObservableObject (macOS 11–13 compat)
```swift
class LegacyModel: ObservableObject {
    @Published var files: [FileItem] = []
}
struct LegacyView: View {
    @StateObject private var model = LegacyModel()
}
```

**@Observable vs ObservableObject:**
| | `ObservableObject` | `@Observable` |
|---|---|---|
| Re-render granularity | Any `@Published` change → all subscribers | Per-property — only views that READ the changed property |
| In view (owned) | `@StateObject` | `@State` |
| In view (passed in) | `@ObservedObject` | plain `var` |
| Environment | `.environmentObject` / `@EnvironmentObject` | `.environment` / `@Environment(Type.self)` |
| Min macOS | 11 | 14 |

---

## 3. SwiftUI macOS UI Components

### NavigationSplitView (macOS 13+)
```swift
NavigationSplitView {
    List(items, selection: $selected) { Label($0.name, systemImage: $0.icon) }
        .navigationSplitViewColumnWidth(min: 180, ideal: 220)
} detail: {
    if let selected { DetailView(item: selected) }
    else { Text("Select an item").foregroundStyle(.secondary) }
}
```

### List — Hierarchical (File Tree)
```swift
struct FileNode: Identifiable {
    let id = UUID()
    var name: String
    var url: URL
    var isDirectory: Bool
    var children: [FileNode]?   // nil = leaf, [] = empty expandable dir
}

// Auto expand/collapse — built in, no delegate needed
List(rootNodes, children: \.children, selection: $selection) { node in
    Label(node.name, systemImage: node.isDirectory ? "folder" : "doc")
        .onDrag {
            NSItemProvider(contentsOf: node.url) ?? NSItemProvider()
        }
        .contextMenu {
            Button("Copy Path") { copyPath(node) }
            Button("Reveal in Finder") { reveal(node) }
        }
        .onTapGesture(count: 2) { openFile(node) }
}
.listStyle(.sidebar)
.scrollContentBackground(.hidden)
```

**Why List > NSOutlineView for drag-source trees:**
- `.onDrag` has no event conflict with click or expand — no `action` selector needed
- `children:` auto-manages expand/collapse — no `outlineViewItemWillExpand` delegate
- No `pasteboardWriterForRow`, `setDraggingSourceOperationMask`, `registerForDraggedTypes` on source side
- Terminal drop destination (AppKit) reads pasteboard from SwiftUI drag — fully compatible

### Context Menu
```swift
Text(item.name)
    .contextMenu {
        Button("Open") { open(item) }
        Button("Rename...") { rename(item) }
        Divider()
        Button("Delete", role: .destructive) { delete(item) }
    }
```

### Toolbar
```swift
.toolbar {
    ToolbarItem(placement: .primaryAction) {
        Button(action: add) { Label("Add", systemImage: "plus") }
    }
}
```

### Keyboard Shortcuts
```swift
Button("Save") { save() }.keyboardShortcut("s", modifiers: .command)
Button("Delete") { delete() }.keyboardShortcut(.delete, modifiers: [])
```

---

## 4. Drag and Drop

### Generation 1: NSItemProvider (macOS 11+)
```swift
// Source
Label(node.name, systemImage: "doc")
    .onDrag {
        NSItemProvider(contentsOf: node.url) ?? NSItemProvider()
    }

// Destination
VStack { }
    .onDrop(of: [.fileURL], isTargeted: $isTargeted) { providers in
        for provider in providers {
            provider.loadObject(ofClass: URL.self) { url, _ in
                guard let url else { return }
                DispatchQueue.main.async { handleDrop(url: url) }
            }
        }
        return true
    }
```

**macOS quirks:**
- `.onDrag` can conflict with tap gesture on the same view — workaround: apply `.onDrag` to a dedicated drag handle or outer container
- NSItemProvider callbacks fire on background thread — always dispatch UI updates to `DispatchQueue.main`
- Drag previews on macOS can be invisible/corrupt — known SwiftUI bug; no pure-SwiftUI fix

### Generation 2: Transferable (macOS 13+) — prefer for in-app
```swift
// Step 1: Conform to Transferable
extension UTType {
    static let fileNode = UTType(exportedAs: "com.harness.filenode")
}

extension FileNode: Transferable {
    static var transferRepresentation: some TransferRepresentation {
        CodableRepresentation(contentType: .fileNode)
        ProxyRepresentation(exporting: \.url)   // fallback for cross-app
    }
}

// Step 2: Use .draggable / .dropDestination
List(nodes, children: \.children) { node in
    Label(node.name, systemImage: "doc")
        .draggable(node)
}

DropZone()
    .dropDestination(for: FileNode.self) { items, _ in
        handleDrop(items); return true
    } isTargeted: { highlighted = $0 }

// Drop URLs from Finder (URL already Transferable)
TerminalView()
    .dropDestination(for: URL.self) { urls, _ in
        urls.forEach { pastePathToTerminal($0) }; return true
    }
```

**TransferRepresentation types:**
| Type | Use When |
|---|---|
| `CodableRepresentation` | Custom `Codable` types within app |
| `ProxyRepresentation` | Delegate to another Transferable (URL, String) |
| `DataRepresentation` | Manual byte-level encoding |
| `FileRepresentation` | Large files — avoid loading into memory |

**Known bug:** `FileRepresentation`-only conformance silently fails on macOS drop. Always include `CodableRepresentation` or `DataRepresentation` as fallback.

### UTType Reference
```swift
UTType.fileURL    UTType.url       UTType.plainText
UTType.json       UTType.image     UTType.png
UTType.jpeg       UTType.pdf       UTType.folder
```

---

## 5. Embedding: AppKit ↔ SwiftUI

### NSHostingView — SwiftUI inside AppKit
```swift
// In NSViewController / NSView
let swiftUIView = FileTreeView(rootPath: path)
let hostingView = NSHostingView(rootView: swiftUIView)
hostingView.translatesAutoresizingMaskIntoConstraints = false
parentView.addSubview(hostingView)
NSLayoutConstraint.activate([
    hostingView.topAnchor.constraint(equalTo: parentView.topAnchor),
    hostingView.leadingAnchor.constraint(equalTo: parentView.leadingAnchor),
    hostingView.trailingAnchor.constraint(equalTo: parentView.trailingAnchor),
    hostingView.bottomAnchor.constraint(equalTo: parentView.bottomAnchor),
])

// Update SwiftUI content
hostingView.rootView = FileTreeView(rootPath: newPath)
```

### NSViewRepresentable — AppKit inside SwiftUI
```swift
struct TerminalSurfaceView: NSViewRepresentable {
    var onDrop: (URL) -> Void

    func makeNSView(context: Context) -> HarnessTerminalSurfaceView {
        let view = HarnessTerminalSurfaceView()
        view.onFileDrop = context.coordinator.handleDrop
        return view
    }

    func updateNSView(_ nsView: HarnessTerminalSurfaceView, context: Context) {
        nsView.onFileDrop = context.coordinator.handleDrop
    }

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    class Coordinator: NSObject {
        var parent: TerminalSurfaceView
        init(_ parent: TerminalSurfaceView) { self.parent = parent }
        func handleDrop(_ url: URL) { parent.onDrop(url) }
    }
}
```

**Rules:**
- `makeNSView` — create and configure once
- `updateNSView` — sync SwiftUI state → AppKit; guard before setting to avoid loops
- `makeCoordinator()` called before `makeNSView` — coordinator outlives view recreation
- Teardown: `static func dismantleNSView(_ nsView:, coordinator:)`

### Bridging actions: SwiftUI → AppKit host
```swift
struct FileTreeView: View {
    var onDoubleClick: (FileNode) -> Void
    var onContextAction: (FileNode, ContextAction) -> Void

    var body: some View {
        List(nodes, children: \.children) { node in
            Label(node.name, systemImage: node.isDirectory ? "folder" : "doc")
                .onTapGesture(count: 2) { onDoubleClick(node) }
                .contextMenu { /* calls onContextAction */ }
        }
    }
}

// In AppKit host
let view = FileTreeView(
    onDoubleClick: { node in coordinator.openFile(node.url) },
    onContextAction: { node, action in coordinator.handle(action, for: node) }
)
hostingView.rootView = view
```

---

## 6. File System (async)

```swift
// Async directory scan
func buildFileTree(at root: URL) async throws -> [FileNode] {
    try await Task.detached(priority: .utility) {
        var nodes: [FileNode] = []
        let fm = FileManager.default
        let contents = try fm.contentsOfDirectory(
            at: root,
            includingPropertiesForKeys: [.isDirectoryKey],
            options: .skipsHiddenFiles
        ).sorted { $0.lastPathComponent < $1.lastPathComponent }

        for url in contents {
            let isDir = (try? url.resourceValues(forKeys: [.isDirectoryKey]).isDirectory) ?? false
            nodes.append(FileNode(
                name: url.lastPathComponent,
                url: url,
                isDirectory: isDir,
                children: isDir ? [] : nil   // [] = expandable, load lazily
            ))
        }
        return nodes
    }.value
}

// In SwiftUI view
.task { nodes = try await buildFileTree(at: rootURL) }
.task(id: expandedNodeID) {
    guard let id = expandedNodeID else { return }
    // load children for expanded node
}
```

---

## 7. Anti-Patterns

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

## 8. When to Fall Back to AppKit

| Need | Reason |
|---|---|
| Drag preview customization | SwiftUI previews corrupt/invisible on macOS; use `NSDraggingItem.imageComponentsProvider` |
| Hierarchical drag-to-reorder | `List(children:)` cannot reorder hierarchical items as of macOS 14 |
| `NSSplitView` programmatic collapse | `NavigationSplitView` can't collapse programmatically |
| Rich text / `NSAttributedString` editing | `TextEditor` is too thin; need `NSTextView` |
| Per-location context menus | SwiftUI `.contextMenu` fires per-view; AppKit `NSMenu` varies by click position |
| Complex multi-column `NSTableView` | SwiftUI `Table` lacks row actions, complex cell editing |
| Menu bar status items | `MenuBarExtra` (macOS 13+) for simple; `NSStatusItem` for complex |
