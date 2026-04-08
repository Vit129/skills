# Logging Standards — All Platforms

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Consistent log levels, format, and security rules across all platforms so logs are useful for debugging without leaking sensitive data.

---

## Log Levels

| Level | When to use |
|---|---|
| `debug` | Detailed flow info — dev/sit only, never prod |
| `info` | Key business events (user logged in, order created) |
| `warn` | Recoverable issues (retry attempt, fallback used) |
| `error` | Failures that need attention (API error, crash) |

---

## Log Format

Every log entry MUST include:

```
[LEVEL] [timestamp] [context] message | metadata
```

Example:
```
[ERROR] 2026-04-07T10:30:00Z [FlightService.search] API call failed | { endpoint: '/flights', status: 500, userId: 'u-123' }
```

---

## Security Rules (All Platforms)

**NEVER log:**
- Passwords, tokens, API keys
- Full credit card numbers, CVV
- Personal data: full name + ID combination, passport number
- OAuth codes or refresh tokens

**Safe to log:**
- User ID (not full profile)
- Error codes and messages
- Endpoint paths (not full URLs with query params containing sensitive data)
- Timestamps and durations

---

## Platform Implementation

### React / Web

```typescript
// logger.ts — single access point
const isDev = import.meta.env.DEV

export const logger = {
  debug: (msg: string, meta?: object) => { if (isDev) console.debug(`[DEBUG]`, msg, meta) },
  info:  (msg: string, meta?: object) => console.info(`[INFO]`, msg, meta),
  warn:  (msg: string, meta?: object) => console.warn(`[WARN]`, msg, meta),
  error: (msg: string, error?: unknown, meta?: object) => {
    console.error(`[ERROR]`, msg, error, meta)
    // send to monitoring service (e.g., Sentry) in prod
  },
}

// Usage
logger.info('Flight search started', { origin: 'BKK', destination: 'NRT' })
logger.error('Flight search failed', err, { endpoint: '/flights', status: 500 })
```

---

### Flutter

```dart
// logger.dart — single access point
import 'package:logger/logger.dart';

class AppLogger {
  static final _logger = Logger(
    printer: PrettyPrinter(methodCount: 0),
    level: kDebugMode ? Level.debug : Level.info,
  );

  static void debug(String msg, [dynamic meta]) => _logger.d('$msg | $meta');
  static void info(String msg, [dynamic meta])  => _logger.i('$msg | $meta');
  static void warn(String msg, [dynamic meta])  => _logger.w('$msg | $meta');
  static void error(String msg, [dynamic error, StackTrace? stack]) =>
      _logger.e(msg, error: error, stackTrace: stack);
}

// Usage
AppLogger.info('Flight search started', {'origin': 'BKK'});
AppLogger.error('Flight search failed', e, stackTrace);
```

---

### Android (Kotlin)

```kotlin
// AppLogger.kt — single access point
object AppLogger {
    private const val TAG = "AppLogger"

    fun debug(context: String, msg: String, meta: Any? = null) {
        if (BuildConfig.DEBUG) Log.d(TAG, "[$context] $msg | $meta")
    }
    fun info(context: String, msg: String, meta: Any? = null) =
        Log.i(TAG, "[$context] $msg | $meta")
    fun warn(context: String, msg: String, meta: Any? = null) =
        Log.w(TAG, "[$context] $msg | $meta")
    fun error(context: String, msg: String, throwable: Throwable? = null) =
        Log.e(TAG, "[$context] $msg", throwable)
}

// Usage
AppLogger.info("FlightService", "Search started", mapOf("origin" to "BKK"))
AppLogger.error("FlightService", "Search failed", exception)
```

---

### iOS (Swift)

```swift
// AppLogger.swift — single access point
import OSLog

enum AppLogger {
    private static let logger = Logger(subsystem: Bundle.main.bundleIdentifier ?? "app", category: "general")

    static func debug(_ msg: String, meta: [String: Any]? = nil) {
        #if DEBUG
        logger.debug("\(msg) | \(String(describing: meta))")
        #endif
    }
    static func info(_ msg: String, meta: [String: Any]? = nil) {
        logger.info("\(msg) | \(String(describing: meta))")
    }
    static func warn(_ msg: String, meta: [String: Any]? = nil) {
        logger.warning("\(msg) | \(String(describing: meta))")
    }
    static func error(_ msg: String, error: Error? = nil) {
        logger.error("\(msg) | \(String(describing: error))")
    }
}

// Usage
AppLogger.info("Flight search started", meta: ["origin": "BKK"])
AppLogger.error("Flight search failed", error: err)
```

---

## Rules

1. Never use `print()`, `console.log()`, `println()` directly — always use the project logger
2. `debug` logs MUST be disabled in production builds
3. Sensitive data MUST never appear in any log level
4. Every `error` log MUST include the original exception/error object
5. Log context MUST identify the class/service where the log originated
6. In production, error logs SHOULD be forwarded to a monitoring service (e.g., Sentry, Firebase Crashlytics)
