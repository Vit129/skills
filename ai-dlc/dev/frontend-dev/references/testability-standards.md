# Testability Standards — Test Identifier (All Platforms)

> **Applies to:** React, Flutter, Android (Kotlin), iOS (Swift)
> **Purpose:** Ensure every interactive or verifiable UI element has a stable test identifier so QA automation can locate it without depending on CSS classes, text content, or fragile XPath.

---

## Why This Matters

| Locator Type | Stability | Problem |
|---|---|---|
| CSS class | ❌ Low | Changes with design updates |
| Text content | ❌ Low | Changes with copy/i18n |
| XPath | ❌ Low | Breaks on layout changes |
| Test identifier | ✅ High | Dedicated for testing only — stable |

---

## Platform Implementation

### React / Web
Use `data-testid` attribute:

```tsx
<form data-testid="flight-search-form">
  <select data-testid="trip-type-selector" />
  <button data-testid="btn-search-flights">Search</button>
</form>

<ul data-testid="flight-result-list">
  {flights.map(f => (
    <li key={f.id} data-testid={`flight-result-item-${f.id}`}>
      <button data-testid={`btn-select-flight-${f.id}`}>Select</button>
    </li>
  ))}
</ul>
```

QA uses: `page.getByTestId('flight-search-form')`

---

### Flutter
Use `Semantics` widget with `identifier` or `key`:

```dart
// Option 1: semanticsLabel (preferred for Appium/Robot Framework)
Semantics(
  identifier: 'flight-search-form',
  child: Form(...),
)

// Option 2: Key (for Flutter integration tests)
ElevatedButton(
  key: const Key('btn-search-flights'),
  onPressed: () {},
  child: const Text('Search'),
)

// Dynamic list
ListView.builder(
  itemBuilder: (context, index) => Semantics(
    identifier: 'flight-result-item-${flights[index].id}',
    child: ListTile(...),
  ),
)
```

QA uses: `accessibility_id=flight-search-form`

---

### Android (Kotlin / Jetpack Compose)

**Compose:**
```kotlin
// Use testTag modifier
Button(
    modifier = Modifier.testTag("btn-search-flights"),
    onClick = {}
) { Text("Search") }

LazyColumn {
    items(flights) { flight ->
        FlightItem(
            modifier = Modifier.testTag("flight-result-item-${flight.id}")
        )
    }
}
```

**XML Layout:**
```xml
<Button
    android:id="@+id/btn_search_flights"
    android:contentDescription="btn-search-flights"
    ... />

<RecyclerView
    android:id="@+id/flight_result_list"
    android:contentDescription="flight-result-list"
    ... />
```

QA uses: `accessibility_id=btn-search-flights`

---

### iOS (Swift / SwiftUI)

```swift
// SwiftUI — use accessibilityIdentifier
Button("Search") {}
    .accessibilityIdentifier("btn-search-flights")

Form {}
    .accessibilityIdentifier("flight-search-form")

// Dynamic list
ForEach(flights) { flight in
    FlightRow(flight: flight)
        .accessibilityIdentifier("flight-result-item-\(flight.id)")
}

// UIKit
button.accessibilityIdentifier = "btn-search-flights"
tableView.accessibilityIdentifier = "flight-result-list"
```

QA uses: `accessibility_id=btn-search-flights`

---

## Naming Convention (All Platforms)

Use **kebab-case**, descriptive, scoped to the component:

```
[component]-[element]           → flight-search-form
btn-[action]-[context]          → btn-search-flights
[component]-[element]-{id}      → flight-result-item-{id}   ← dynamic lists
[component]-[state]-badge       → pass-recommendation-badge
```

### ✅ Good examples
```
flight-search-form
trip-type-selector
btn-search-flights
flight-result-list
flight-result-item-FL001
btn-select-flight-FL001
booking-confirmation
booking-qr-code
visa-status-banner
```

### ❌ Bad examples
```
button          ← too generic
list            ← too generic
item1           ← not descriptive, not dynamic
searchBtn       ← camelCase
search_form     ← snake_case
```

---

## What Needs a Test Identifier

| Element Type | Required |
|---|---|
| Buttons (submit, action, navigation) | ✅ Mandatory |
| Form inputs, selects, checkboxes | ✅ Mandatory |
| Result lists / tables | ✅ Mandatory |
| Individual list/table items | ✅ Mandatory (with `{id}`) |
| Status indicators, banners, badges | ✅ Mandatory |
| Modal dialogs, confirmation panels | ✅ Mandatory |
| QR codes, images with test value | ✅ Mandatory |
| Static decorative elements | ❌ Not needed |
| Layout containers (unless QA asserts on them) | ❌ Not needed |

---

## Playwright Locator Usage (Web)

QA ใช้ locators ตาม priority นี้:

| Priority | Locator | เมื่อไหร่ |
|---|---|---|
| #1 | `getByTestId` | containers, lists, dynamic items, translatable elements |
| #2 | `getByRole` | semantic elements ที่ชื่อ stable (button, dialog, link) |
| #3 | `getByLabel` | form fields ที่มี label |

**Hybrid pattern (standard):**
```typescript
// scope ด้วย testId แล้ว target ด้วย role + label จาก Labels.ts
page.getByTestId('flight-result-item-FL001').getByRole('button', { name: L.btnSelectFlight }).click()
page.getByTestId('flight-search-form').getByRole('button', { name: L.btnSearchFlights }).click()

// container มี button เดียว — ไม่ต้องระบุ name
page.getByTestId('flight-search-form').getByRole('button').click()
```

## i18n / Bi-language (TH/EN)

ระบบออกแบบเพื่อรองรับ **TH/EN bi-language**:

- `data-testid` / `accessibilityIdentifier` ต้องเป็น **English kebab-case เสมอ** — ไม่ขึ้นกับภาษา UI
- ข้อความที่แสดงผล (button label, heading) ต้องมาจาก **i18n key** ไม่ hardcode
- QA เก็บ UI labels ใน `[systemFeature]Labels.ts` แยกจาก business data

**Labels file structure:**
```typescript
// fixtures/[SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/[systemFeature]Labels.ts
export const flightBookingLabels = {
  th: {
    btnSelectFlight:  'เลือก',
    btnSearchFlights: 'ค้นหาเที่ยวบิน',
    btnConfirmBooking:'ยืนยันการจอง',
  },
  en: {
    btnSelectFlight:  'Select',
    btnSearchFlights: 'Search Flights',
    btnConfirmBooking:'Confirm Booking',
  },
}

// usage
const L = flightBookingLabels[process.env.LANG ?? 'th']
await page.getByTestId('flight-result-item-FL001')
         .getByRole('button', { name: L.btnSelectFlight }).click()
```

```tsx
// dev side — identifier เป็น EN เสมอ, text มาจาก i18n key
<button data-testid="btn-search-flights">{t('search.flights')}</button>
```

## Rules

1. Test identifiers are **for testing only** — never use in CSS, JS logic, or styling
2. Names **must match exactly** what is defined in the Logical Design spec — coordinate with QA before implementation
3. **PR will not be approved** if new interactive components are missing test identifiers
4. Do **not remove or rename** existing identifiers without notifying QA first
5. Dynamic list items **must include the item ID** — never use index (`item-0`, `item-1`)
6. Identifier names must be **identical across Android and iOS** for shared keyword support in Robot Framework
7. All identifier names MUST be in **English kebab-case** — never Thai text in identifiers
8. `Labels.ts` MUST have both `th` and `en` keys — never single language only
9. Never hardcode Thai or English text in `getByRole({ name })` — always use `L.keyName` from `Labels.ts`
