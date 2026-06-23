# Appium MCP Setup — Installation & Integration

Step-by-step setup for using Appium MCP server with Robot Framework and Flutter testing.

---

## Prerequisites

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v22+ | `node --version` |
| npm | latest | `npm --version` |
| Java JDK | 8+ | `java -version` |
| Android SDK | latest | `echo $ANDROID_HOME` |
| Xcode (macOS) | 15+ | `xcode-select -p` |
| Python | 3.10+ | `python3 --version` |
| Robot Framework | 7+ | `robot --version` |

---

## Step 1: Install Appium MCP (via mcpSetup.sh)

```bash
bash ~/.kiro/scripts/setup/mcpSetup.sh --force --appium
```

This adds `appium-mcp` to `~/.kiro/settings/mcp.json` (disabled by default).

### Or manually add to mcp.json:

```json
"appium-mcp": {
  "command": "npx",
  "args": ["-y", "appium-mcp@latest"],
  "env": {
    "ANDROID_HOME": "/Users/<you>/Library/Android/sdk",
    "NO_UI": "true"
  },
  "disabled": true,
  "autoApprove": []
}
```

### Enable when ready:

Change `"disabled": true` → `"disabled": false` in mcp.json, then restart Kiro.

---

## Step 2: Android SDK Setup

```bash
# Set ANDROID_HOME (add to ~/.zshrc or ~/.bashrc)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools

# Verify
adb devices
```

### Required SDK Components

```bash
sdkmanager "platform-tools"
sdkmanager "platforms;android-34"
sdkmanager "system-images;android-34;google_apis;arm64-v8a"
sdkmanager "emulator"
```

### Create Emulator (if needed)

```bash
avdmanager create avd -n Pixel7 -k "system-images;android-34;google_apis;arm64-v8a" -d pixel_7
emulator -avd Pixel7
```

---

## Step 3: iOS Setup (macOS only)

```bash
# Install Xcode CLI tools
xcode-select --install

# Install iOS simulators via Xcode → Settings → Platforms

# Verify
xcrun simctl list devices
```

---

## Step 4: Flutter App Build (for testing)

```bash
# Android — debug build (required for Flutter Driver)
flutter build apk --debug
# Output: build/app/outputs/flutter-apk/app-debug.apk

# iOS — debug build
flutter build ios --debug --simulator
# Output: build/ios/iphonesimulator/Runner.app
```

> ⚠️ **Release builds won't work** — Flutter Driver needs VM service (only in debug/profile).

---

## Step 5: Robot Framework Dependencies

```bash
pip install robotframework robotframework-appiumlibrary pyyaml python-dotenv
```

### requirements.txt

```
robotframework>=7.0
robotframework-appiumlibrary>=2.1
PyYAML>=6.0
python-dotenv>=1.0
```

---

## Step 6: Appium Flutter Driver (for direct Flutter testing)

Appium MCP handles driver management internally. But if running Appium standalone:

```bash
# Install Appium (standalone, only if NOT using appium-mcp)
npm install -g appium

# Install Flutter driver
appium driver install appium-flutter-driver

# Install UiAutomator2 (Android fallback)
appium driver install uiautomator2

# Install XCUITest (iOS fallback)
appium driver install xcuitest

# Verify
appium driver list --installed
```

> **Note:** When using appium-mcp, Appium server is managed by the MCP server itself — no separate `appium` process needed.

---

## Step 7: Capabilities Config (per project)

Create `capabilities.json` in your project:

```json
{
  "android": {
    "platformName": "Android",
    "appium:app": "./apps/android/app-debug.apk",
    "appium:deviceName": "Pixel7",
    "appium:automationName": "Flutter",
    "appium:noReset": true
  },
  "ios": {
    "platformName": "iOS",
    "appium:app": "./apps/ios/Runner.app",
    "appium:deviceName": "iPhone 15 Pro",
    "appium:platformVersion": "17.0",
    "appium:automationName": "Flutter",
    "appium:noReset": true
  }
}
```

Point to it via env:

```json
"appium-mcp": {
  "env": {
    "ANDROID_HOME": "...",
    "CAPABILITIES_CONFIG": "/path/to/project/capabilities.json"
  }
}
```

---

## How It All Connects

```
┌─────────────────────────────────────────────────────────────┐
│  AI Agent (Kiro / Claude Code)                              │
│    │                                                         │
│    ├── appium-mcp (MCP server, stdio)                       │
│    │     ├── appium_session_management → create session      │
│    │     ├── appium_find_element → find by accessibility_id  │
│    │     ├── appium_gesture → tap, scroll, swipe            │
│    │     ├── appium_screenshot → capture screen             │
│    │     └── appium_get_page_source → XML for locators      │
│    │                                                         │
│    └── Robot Framework (writes .robot tests using locators)  │
│          └── AppiumLibrary → runs tests in CI               │
└─────────────────────────────────────────────────────────────┘
```

---

## Workflow: AI Agent + Appium MCP + Robot Framework

1. **AI uses Appium MCP** to explore the Flutter app (find elements, take screenshots)
2. **AI generates locators** using `generate_locators` or `appium_get_page_source`
3. **AI writes Robot Framework tests** using those locators + flutter-appium.md patterns
4. **Robot Framework runs tests** in CI via `robot` command (no MCP needed at runtime)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `appium-mcp` timeout on start | Increase `"timeout": 100` in mcp.json |
| `ANDROID_HOME` not found | Set in mcp.json `env` AND shell profile |
| No devices found | Start emulator: `emulator -avd <name>` or connect USB device |
| Flutter context not available | Ensure `automationName=Flutter` + debug build |
| iOS WDA fails | Run `appium_prepare_ios_real_device` tool or use simulator |
| MCP server crashes | Check Node.js version (need v22+) |

---

## Quick Verification

After setup, verify in Kiro:

1. Enable `appium-mcp` in mcp.json (`disabled: false`)
2. Restart Kiro
3. Ask: "list available devices" → should trigger `select_device` tool
4. If device found → setup is complete ✅
