# Testability Standards — Test Identifier (All Platforms)

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Ensure every interactive or verifiable UI element has a stable test identifier.

---

## Platform Implementation

### React / Web
Use `data-testid` attribute:
```tsx
<button data-testid="btn-search-flights">Search</button>
<ul data-testid="flight-result-list">
  {flights.map(f => (
    <li key={f.id} data-testid={`flight-result-item-${f.id}`}>...</li>
  ))}
</ul>
```

### Flutter
```dart
Semantics(identifier: 'btn-search-flights', child: ElevatedButton(...))
```

### Android (Compose)
```kotlin
Button(modifier = Modifier.testTag("btn-search-flights"), onClick = {}) { Text("Search") }
```

### iOS (SwiftUI)
```swift
Button("Search") {}.accessibilityIdentifier("btn-search-flights")
```

---

## Naming Convention (All Platforms)

Use **kebab-case**, descriptive, scoped to the component:

```
btn-[action]-[context]          → btn-search-flights
[component]-[element]           → flight-search-form
[component]-[element]-{id}      → flight-result-item-{id}   ← dynamic lists
```

## What Needs a Test Identifier

| Element Type | Required |
|---|---|
| Buttons (submit, action, navigation) | ✅ Mandatory |
| Form inputs, selects, checkboxes | ✅ Mandatory |
| Result lists / tables | ✅ Mandatory |
| Individual list/table items | ✅ Mandatory (with `{id}`) |
| Status indicators, banners, badges | ✅ Mandatory |
| Modal dialogs, confirmation panels | ✅ Mandatory |
| Static decorative elements | ❌ Not needed |

## i18n / Bi-language (TH/EN)

- `data-testid` / `accessibilityIdentifier` ต้องเป็น **English kebab-case เสมอ**
- QA เก็บ UI labels ใน `[systemFeature]Labels.ts` แยกจาก business data

```typescript
export const flightBookingLabels = {
  th: { btnSelectFlight: 'เลือก', btnSearchFlights: 'ค้นหาเที่ยวบิน' },
  en: { btnSelectFlight: 'Select', btnSearchFlights: 'Search Flights' },
}
const L = flightBookingLabels[process.env.LANG ?? 'th']
await page.getByTestId('flight-result-item-FL001')
         .getByRole('button', { name: L.btnSelectFlight }).click()
```

## Rules

1. Test identifiers are **for testing only** — never use in CSS, JS logic, or styling
2. Names **must match exactly** what is defined in the Logical Design spec
3. **PR will not be approved** if new interactive components are missing test identifiers
4. Dynamic list items **must include the item ID** — never use index (`item-0`, `item-1`)
5. Identifier names must be **identical across Android and iOS** for shared keyword support
6. All identifier names MUST be in **English kebab-case** — never Thai text in identifiers
