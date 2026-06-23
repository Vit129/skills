# Mobile Performance

> ใช้เมื่อต้อง profile, optimize, หรือ benchmark mobile app performance (Android + iOS)

## When to Use

- App startup ช้า (> 2s cold start)
- UI jank / frame drops ระหว่างใช้งาน
- Memory usage สูงผิดปกติ หรือ app crash จาก OOM
- Battery drain เร็วกว่าที่ควร
- ต้อง benchmark ก่อน/หลัง optimization

## Key Metrics

| Metric | Good | Acceptable | Poor |
|--------|------|-----------|------|
| Cold start | < 1.5s | < 3s | > 3s |
| Warm start | < 500ms | < 1s | > 1s |
| Frame rate | 60 fps | > 45 fps | < 30 fps |
| Memory (idle) | < 100MB | < 200MB | > 300MB |
| Memory (active) | < 200MB | < 350MB | > 500MB |
| App size (APK/IPA) | < 30MB | < 60MB | > 100MB |
| Battery (1hr active) | < 5% | < 10% | > 15% |

## Profiling Workflow

```
1. BASELINE  → Measure current state (cold start, memory, fps)
2. IDENTIFY  → Profile to find bottleneck
3. FIX       → Address specific issue
4. VERIFY    → Measure again, confirm improvement
5. AUTOMATE  → Add to CI (startup time benchmark, memory leak detection)
```

## Android Profiling

### Startup Time

```bash
# Measure cold start
adb shell am force-stop com.example.app
adb shell am start-activity -W -n com.example.app/.MainActivity

# Output:
# TotalTime: 1234  ← this is your cold start time (ms)

# Automated benchmark (10 runs, average)
for i in {1..10}; do
  adb shell am force-stop com.example.app
  adb shell am start-activity -W -n com.example.app/.MainActivity 2>&1 | grep TotalTime
  sleep 2
done
```

### Memory Profiling

```bash
# Snapshot memory usage
adb shell dumpsys meminfo com.example.app

# Key sections:
# - Java Heap: object allocations
# - Native Heap: C/C++ allocations (images, buffers)
# - Graphics: GPU buffers
# - Total PSS: actual memory footprint

# Track over time (every 5s for 2 min)
for i in {1..24}; do
  echo "=== $(date) ==="
  adb shell dumpsys meminfo com.example.app | grep "TOTAL PSS"
  sleep 5
done
```

### Memory Leak Detection

```bash
# Trigger GC then check
adb shell am dumpheap com.example.app /data/local/tmp/heap.hprof
adb pull /data/local/tmp/heap.hprof

# Open in Android Studio → Profiler → Memory → Import heap dump
# Look for:
# - Activities/Fragments that should be destroyed but aren't
# - Growing number of same object type
# - Bitmap objects not recycled
```

### Frame Rate (Jank Detection)

```bash
# Enable GPU rendering profiling
adb shell setprop debug.hwui.profile true

# Dump frame stats
adb shell dumpsys gfxinfo com.example.app framestats

# Look for frames > 16ms (60fps target)
# Janky frames = frames that took > 16.67ms to render
```

### Android Studio Profiler

```
1. Run app in Debug mode
2. View → Tool Windows → Profiler
3. CPU: Find long methods (> 16ms on main thread)
4. Memory: Watch for steady growth (leak indicator)
5. Network: Check request waterfalls, large payloads
```

## iOS Profiling

### Startup Time

```bash
# Xcode → Product → Scheme → Edit Scheme
# Environment Variables: DYLD_PRINT_STATISTICS = 1

# Output shows:
# Total pre-main time: 320ms
#   dylib loading: 180ms
#   rebase/binding: 40ms
#   ObjC setup: 30ms
#   initializer: 70ms
# Total main() time: 800ms
```

### Instruments (Xcode)

```
1. Product → Profile (Cmd+I)
2. Choose template:
   - Time Profiler: CPU bottlenecks
   - Allocations: Memory usage + leaks
   - Core Animation: Frame rate + GPU
   - Energy Log: Battery impact
   - Network: Request timing
```

### Memory Leak Detection (iOS)

```
1. Instruments → Leaks template
2. Run app, navigate through screens
3. Go back to previous screen
4. Check: does memory return to baseline?
5. If not → leak detected → check retain cycles
```

### Common iOS Memory Issues

```swift
// BAD: Strong reference cycle
class ViewController {
  var closure: (() -> Void)?
  func setup() {
    closure = { self.doSomething() }  // self is captured strongly
  }
}

// GOOD: Weak capture
class ViewController {
  var closure: (() -> Void)?
  func setup() {
    closure = { [weak self] in self?.doSomething() }
  }
}
```

## Common Mobile Performance Issues

### App Startup

| Cause | Fix |
|-------|-----|
| Too many libraries initialized at launch | Lazy-init non-critical SDKs |
| Large splash screen image | Compress, use vector |
| Synchronous network call on main thread | Move to background thread |
| Heavy database migration | Run async, show progress |
| Too many auto-loaded modules | Code splitting, on-demand loading |

### Memory

| Cause | Fix |
|-------|-----|
| Images not downsampled | Load at display size, not full resolution |
| Leaked Activities/ViewControllers | Check lifecycle, weak references |
| Unbounded cache | Set max size, implement LRU eviction |
| WebView not released | Destroy WebView on screen exit |
| Large lists without recycling | Use RecyclerView (Android) / LazyVStack (iOS) |

### Frame Rate

| Cause | Fix |
|-------|-----|
| Heavy computation on main thread | Move to background thread/coroutine |
| Complex view hierarchy | Flatten layout, use ConstraintLayout |
| Overdraw (multiple layers) | Remove unnecessary backgrounds |
| Large image decoding | Decode off main thread, use thumbnails |
| Frequent re-renders | Memoize, skip unchanged items |

## Automated Performance Testing (CI)

### Android (Macrobenchmark)

```kotlin
@RunWith(AndroidJUnit4::class)
class StartupBenchmark {
  @get:Rule
  val benchmarkRule = MacrobenchmarkRule()

  @Test
  fun startup() = benchmarkRule.measureRepeated(
    packageName = "com.example.app",
    metrics = listOf(StartupTimingMetric()),
    iterations = 5,
    startupMode = StartupMode.COLD,
  ) {
    pressHome()
    startActivityAndWait()
  }
}
```

### iOS (XCTest Performance)

```swift
func testStartupPerformance() throws {
  measure(metrics: [XCTApplicationLaunchMetric()]) {
    XCUIApplication().launch()
  }
}

func testScrollPerformance() throws {
  let app = XCUIApplication()
  app.launch()

  measure(metrics: [XCTOSSignpostMetric.scrollDecelerationMetric]) {
    app.swipeUp()
  }
}
```

## Decision Framework

| Observation | Root Cause | Action |
|-------------|-----------|--------|
| Cold start > 3s | Too much init at launch | Profile startup, lazy-init SDKs |
| Memory grows and never drops | Memory leak | Heap dump, find retained objects |
| Jank during scroll | Main thread blocked | Profile CPU, move work off main thread |
| App size > 100MB | Uncompressed assets, unused code | Shrink resources, enable ProGuard/R8 |
| Battery drain high | Background work, wake locks | Check background tasks, reduce polling |
| Crash at high memory | No memory pressure handling | Implement `onLowMemory`, reduce cache |
