# Swift Language Essentials

## Types
```swift
struct Point { var x: Double; var y: Double }       // value type
enum Direction { case north, south, east, west }    // value type
class ViewModel { var count = 0 }                   // reference type
typealias FileID = UUID
```

## Optionals
```swift
var name: String? = nil
if let name { print(name) }          // Swift 5.7+ shorthand
guard let name else { return }
let safe = name ?? "default"
let count = name?.count              // optional chaining → Int?
```

## Async/Await
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

## Actors
```swift
actor FileCache {
    private var cache: [URL: Data] = [:]
    func store(_ data: Data, for url: URL) { cache[url] = data }
    func retrieve(for url: URL) -> Data? { cache[url] }
}

@MainActor class AppState { var isLoading = false }
await MainActor.run { self.isLoading = false }
```

## Sendable
```swift
struct FileItem: Sendable { let id: UUID; let name: String; let url: URL }

// Class requires manual safety proof
final class ManagedBuffer: @unchecked Sendable {
    private let lock = NSLock()
    // ...manual locking
}
```
