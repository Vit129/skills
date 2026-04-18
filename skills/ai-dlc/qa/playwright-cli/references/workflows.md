# Browser Automation Workflows

Standard procedures for common web tasks using `playwright-cli`.

## 🔐 Login Flow
1. `playwright-cli open <login_url> -s=login_session`
2. Identify input refs for username/password from the snapshot.
3. `playwright-cli click <user_input_ref>` then `playwright-cli type "<username>"`
4. `playwright-cli click <pass_input_ref>` then `playwright-cli type "<password>"`
5. `playwright-cli click <login_button_ref>`
6. Verify successful login by checking for new elements or URL change.

## 📸 Visual Inspection & Scrapping
1. Open the target page.
2. Use `playwright-cli snapshot` to read the structured content.
3. If data is hidden, use `click` to expand sections or tabs.
4. Capture evidence with `playwright-cli screenshot`.

## 🧪 UI/UX Testing
1. Navigate through the site.
2. Validate that critical elements (Buttons, Forms, Charts) have the correct `ref` and properties.
3. Use `--headed` mode when debugging locally to see real-time interactions.
