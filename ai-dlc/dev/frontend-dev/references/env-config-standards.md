# Environment Config Standards — All Platforms

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Manage environment-specific configuration (API URLs, feature flags, keys) consistently and securely across all platforms.

---

## Environments

| Env | Purpose |
|---|---|
| `local` | Developer's local machine |
| `sit` | System Integration Testing (default for QA) |
| `uat` | User Acceptance Testing |
| `prod` | Production |

---

## What Goes Where

| Type | Location | Examples |
|---|---|---|
| Sensitive | CI/CD secrets only — never in repo | passwords, API keys, OAuth secrets |
| Non-sensitive config | Environment config file | BASE_URL, FEATURE_FLAGS, TIMEOUT |
| Business test data | Fixture / constants file | companyCode, productCode, test user roles |

> ⚠️ Never commit sensitive values to the repository — use CI/CD secret injection.

---

## Key Naming Convention

Use `SCREAMING_SNAKE_CASE` for all config keys:

```
BASE_URL
API_TIMEOUT_MS
FEATURE_FLAG_DARK_MODE
CLIENT_ID
```

---

## Platform Implementation

### React / Web

```bash
# .env.sit
VITE_BASE_URL=https://api-sit.example.com
VITE_API_TIMEOUT_MS=10000
VITE_FEATURE_FLAG_DARK_MODE=false

# .env.uat
VITE_BASE_URL=https://api-uat.example.com
VITE_API_TIMEOUT_MS=10000
VITE_FEATURE_FLAG_DARK_MODE=true
```

```typescript
// config.ts — single access point
export const config = {
  baseUrl: import.meta.env.VITE_BASE_URL,
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS),
  featureFlags: {
    darkMode: import.meta.env.VITE_FEATURE_FLAG_DARK_MODE === 'true',
  },
}
```

> Never access `import.meta.env` or `process.env` directly in components — always go through `config.ts`.

---

### Flutter

```bash
# Run with --dart-define per environment
flutter run --dart-define=BASE_URL=https://api-sit.example.com \
            --dart-define=API_TIMEOUT_MS=10000
```

```dart
// config.dart — single access point
class AppConfig {
  static const baseUrl = String.fromEnvironment('BASE_URL', defaultValue: 'http://localhost:3000');
  static const apiTimeoutMs = int.fromEnvironment('API_TIMEOUT_MS', defaultValue: 10000);
}
```

> Use `--dart-define-from-file=config.sit.json` for multiple values.

---

### Android (Kotlin)

```groovy
// build.gradle — per flavor
android {
    flavorDimensions += "env"
    productFlavors {
        sit {
            buildConfigField "String", "BASE_URL", '"https://api-sit.example.com"'
            buildConfigField "int", "API_TIMEOUT_MS", "10000"
        }
        uat {
            buildConfigField "String", "BASE_URL", '"https://api-uat.example.com"'
            buildConfigField "int", "API_TIMEOUT_MS", "10000"
        }
    }
}
```

```kotlin
// AppConfig.kt — single access point
object AppConfig {
    val baseUrl: String = BuildConfig.BASE_URL
    val apiTimeoutMs: Int = BuildConfig.API_TIMEOUT_MS
}
```

---

### iOS (Swift)

```xml
<!-- Info.plist per scheme -->
<key>BASE_URL</key>
<string>$(BASE_URL)</string>
<key>API_TIMEOUT_MS</key>
<string>$(API_TIMEOUT_MS)</string>
```

```swift
// AppConfig.swift — single access point
enum AppConfig {
    static let baseUrl: String = Bundle.main.infoDictionary?["BASE_URL"] as? String ?? "http://localhost:3000"
    static let apiTimeoutMs: Int = Int(Bundle.main.infoDictionary?["API_TIMEOUT_MS"] as? String ?? "10000") ?? 10000
}
```

> Set `BASE_URL` and other values in Xcode scheme environment variables per target.

---

## Rules

1. Every platform MUST have a single `AppConfig` / `config.ts` access point — never read env vars directly in business logic
2. Sensitive values MUST use CI/CD secret injection — never hardcoded or committed
3. All keys MUST use `SCREAMING_SNAKE_CASE`
4. Default values MUST point to `local` or `sit` — never `prod`
5. Config files per environment MUST be committed (without secrets) — `.env.sit`, `config.sit.json`, etc.
6. `.env.local` and files containing secrets MUST be in `.gitignore`
