# Google Apps Script Sync Logic

Patterns for syncing frontend data with Google Sheets via Apps Script web app.

## Architecture

- Frontend stores data locally (e.g., LocalStorage)
- GAS web app acts as REST-like backend (doGet for reads, doPost for writes)
- Google Sheets as database — one sheet per data type

## Entry Points

**doGet(e)** — Read data + write-via-GET (CORS workaround)
```javascript
function doGet(e) {
  const action = e.parameter.action;
  const payload = e.parameter.payload; // write-via-GET
  if (payload) {
    // parse and save
  } else {
    // read and return
  }
  return jsonOut(result);
}
```

**doPost(e)** — Write data (JSON body or form POST)
```javascript
function doPost(e) {
  // Accept both JSON body and form POST (payload field)
  // Route by action → call save function
  return jsonOut({ ok: true });
}
```

## Common Patterns

**Read from sheet → array of objects:**
```javascript
function getFromSheet(sheetName, headers, numericCols) {
  const sheet = getOrCreateSheet(sheetName, headers);
  const rows = sheet.getDataRange().getValues();
  return rows.slice(1).map(row => rowToObj(headers, row, numericCols));
}
```

**Write array of objects → sheet:**
```javascript
function saveToSheet(sheetName, headers, list) {
  const sheet = getOrCreateSheet(sheetName, headers);
  sheet.clearContents();
  const rows = [headers, ...list.map(item => headers.map(k => item[k] ?? ''))];
  sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
}
```

**Key-value storage (for config/settings):**
```javascript
function saveKeyValue(sheetName, data) {
  const entries = [['key', 'value'],
    ...Object.entries(data).map(([k, v]) =>
      [k, typeof v === 'object' ? JSON.stringify(v) : String(v)]
    )];
  sheet.getRange(1, 1, entries.length, 2).setValues(entries);
}
```

**JSON response helper:**
```javascript
function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## Data Type Handling

- **Dates:** Sheets returns Date objects → force convert to `YYYY-MM-DD` string
- **Numbers:** Use `parseFloat(val) || 0` for numeric columns
- **Booleans/Zero:** Force to `String(val)` before writing — Sheets loses `0` and `false` otherwise
- **Objects:** Serialize as `JSON.stringify()`, parse back with `JSON.parse()`

## CORS Workaround

Browsers can't POST to GAS directly due to CORS. Two solutions:
1. **Write-via-GET:** `?action=save&payload=encodeURIComponent(JSON.stringify(data))`
2. **Hidden form POST:** Submit via invisible `<form>` with payload field

## Deploy

1. Deploy → New deployment → Web app
2. Execute as: Me / Who has access: Anyone
3. Copy Web App URL → use in frontend
4. After changes: Manage deployments → Edit → New version → Deploy

## Tips

- Split data by category into separate sheets (e.g., one sheet per broker, per data type)
- Use `getOrCreateSheet()` to auto-create sheets with headers on first access
- Always wrap in try/catch and return `{ ok: false, error: message }` on failure
- Use `sheet.clearContents()` + bulk `setValues()` instead of row-by-row for performance
