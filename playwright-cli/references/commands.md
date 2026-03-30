# Playwright CLI Commands & Targeting

Detailed guide for using `playwright-cli` to interact with web pages efficiently.

## Core Commands
- `playwright-cli open <URL>`: Open a page (use `--headed` for visible browser).
- `playwright-cli type "<text>"`: Type into the currently focused element.
- `playwright-cli click <ref>`: Click an element by its reference ID (e.g., `e1`).
- `playwright-cli screenshot`: Capture the current page state.
- `playwright-cli show`: Open the visual dashboard to monitor sessions.
- `playwright-cli snapshot`: Get a YAML snapshot of the page with element references.

## Element Targeting (Refs)
After each action, `playwright-cli` provides a YAML snapshot. Use the `ref` attribute (e.g., `e15`) to target elements:
- **Buttons/Links:** `click e1`
- **Inputs:** `type "My Value"` (after focusing or clicking the input ref).
- **Navigation:** `back`, `reload`.

## Session Management
- Use `-s=session_name` to maintain cookies and storage state across commands.
- Ideal for testing flows that require login.
