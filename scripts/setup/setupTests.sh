#!/bin/bash

# COE Standard Test Automation Setup Script
# Follows coe-standard-linux-agent-pool structure

if [ -z "${1:-}" ]; then
    echo "❌ กรุณาระบุ folder (เช่น Automate2, AAA/Automate3, . สำหรับ root)"
    echo "Usage: $0 [PROJECT_NAME_OR_PATH|.|--self] [--force]"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Walk up from cwd to find project root
_dir="$(pwd)"
while [ "$_dir" != "/" ]; do
  if [ -d "$_dir/.git" ]; then
    BASE_DIR="$_dir"
    break
  fi
  _dir="$(dirname "$_dir")"
done
if [ -z "${BASE_DIR:-}" ]; then
  echo "⚠️  .git/ not found — falling back to cwd"
  BASE_DIR="$(pwd)"
fi

FORCE=0
TARGET_DIR=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    *) TARGET_DIR="$1"; shift ;;
  esac
done

# ── Folder detection (same as setupMemory.sh) ──
cd "$BASE_DIR" || exit 1
source "$SCRIPT_DIR/_resolveTarget.sh"

cd "$TARGET_DIR" || exit 1
echo "📁 Working in: $(pwd)"
echo ""

echo "🚀 Starting COE Standard Setup..."

# Install Volta & Node
if ! command -v volta &> /dev/null; then
    echo "📦 Installing Volta..."
    curl https://get.volta.sh | bash
    export VOLTA_HOME="$HOME/.volta"
    export PATH="$VOLTA_HOME/bin:$PATH"
    [ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null || true
    [ -f "$HOME/.bashrc" ] && source "$HOME/.bashrc" 2>/dev/null || true
    echo "✅ Volta installed"
else
    echo "✅ Volta already installed"
fi

export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"

if ! volta list node 2>/dev/null | grep -q "node"; then
    echo "📦 Installing Node.js LTS..."
    volta install node@lts
    echo "✅ Node.js installed"
else
    echo "✅ Node.js already installed ($(node -v 2>/dev/null || echo 'version check failed'))"
fi

echo "🚀 Creating COE standard directory structure..."

# Create COE standard structure
mkdir -p tests/api-testing/{tests-api,helpers,schemas,fixtures,postman,pipelines,db-scripts}
mkdir -p tests/web-testing/{tests-web,pages,helpers,fixtures,pipelines,db-scripts}
mkdir -p tests/mobile-testing/{tests-mobile,pages,keywords,fixtures,helpers,apps,config,pipelines,db-scripts}
mkdir -p tests/test-scenario


echo "✅ Directory structure created"

# Setup API Testing
echo "📦 Setting up API testing..."
cd tests/api-testing

cat > package.json << 'EOF'
{
  "name": "api-tests",
  "version": "1.0.0",
  "scripts": {
    "report": "playwright show-report",
    "api:sit": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts",
    "api:uat": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.ts",
    "api:sit:initial-run:cliMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts tests-api/initialRun.spec.ts",
    "api:sit:initial-run:guiMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts --ui tests-api/initialRun.spec.ts"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@types/node": "^22.10.5",
    "dotenv": "^16.4.5",
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "cross-env": "^7.0.3"
  }
}
EOF

cat > playwright.config.ts << 'EOF'
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.ENV || 'sit';
const envFile = env.toLowerCase() === 'sit' ? '.env' : `.env.${env.toLowerCase()}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

export default defineConfig({
  testDir: './tests-api',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    trace: 'retain-on-failure',
  },
});
EOF

cat > .env << 'EOF'
ENV=sit
API_BASE_URL=https://www.your-company.com
API_TIMEOUT=30000
EOF

cat > .env.local << 'EOF'
ENV=local
API_BASE_URL=http://localhost:3000
API_TIMEOUT=30000
EOF

cat > .env.uat << 'EOF'
ENV=uat
API_BASE_URL=https://api.uat.example.com
API_TIMEOUT=30000
EOF

cat > tests-api/initialRun.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Initial API Setup Check', () => {
    test('Should successfully fetch data from your-company.com', async ({ request }) => {
        const response = await request.get('/');
        // We check for exactly 200 status code
        expect(response.status()).toBe(200);
        
        console.log('✅ API Connectivity Verified to your-company.com. Status:', response.status());
    });
});
EOF

npm install
if [ $? -eq 0 ]; then
    echo "✅ API dependencies installed successfully"
else
    echo "❌ API dependencies installation failed"
    exit 1
fi


cd ../..
echo "✅ API testing setup complete"

# Setup Web Testing
echo "📦 Setting up Web testing..."
cd tests/web-testing

cat > package.json << 'EOF'
{
  "name": "web-tests",
  "version": "1.0.0",
  "scripts": {
    "report": "playwright show-report",
    "ui:sit": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts",
    "ui:uat": "cross-env LANG=th ENV=uat playwright test --config=playwright.config.ts",
    "ui:sit:initial-run:cliMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts tests-web/initialRun.spec.ts",
    "ui:sit:initial-run:guiMode": "cross-env LANG=th ENV=sit playwright test --config=playwright.config.ts --ui tests-web/initialRun.spec.ts"
  },
  "devDependencies": {
    "@playwright/test": "^1.57.0",
    "@types/node": "^22.10.5",
    "dotenv": "^16.4.5",
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "cross-env": "^7.0.3"
  }
}
EOF

cat > playwright.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

const env = process.env.ENV || 'sit';
const envFile = env.toLowerCase() === 'sit' ? '.env' : `.env.${env.toLowerCase()}`;
dotenv.config({ path: path.resolve(__dirname, envFile) });

export default defineConfig({
  testDir: './tests-web',
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://sit.example.com',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}),
      },
    },
    {
      name: 'Microsoft Edge',
      use: {
        ...devices['Desktop Edge'],
        ...(process.env.BROWSER_CHANNEL ? { channel: 'msedge' } : {}),
      },
    },
  ],
});
EOF

cat > .env << 'EOF'
ENV=sit
WEB_BASE_URL=https://www.your-company.com
WEB_TIMEOUT=30000
EOF

cat > .env.local << 'EOF'
ENV=local
WEB_BASE_URL=http://localhost:3000
WEB_TIMEOUT=30000
EOF

cat > .env.uat << 'EOF'
ENV=uat
WEB_BASE_URL=https://uat.example.com
WEB_TIMEOUT=30000
EOF

cat > tests-web/initialRun.spec.ts << 'EOF'
import { test, expect } from '@playwright/test';

test.describe('Initial Web UI Setup Check', () => {
    test('Should successfully launch browser and load your-company.com', async ({ page }) => {
        await page.goto('https://www.your-company.com');
        
        const title = await page.title();
        console.log(`✅ Browser Launched Successfully. Page Title: "${title}"`);
        
        expect(title).not.toBe('');
        await expect(page).toHaveURL(/axonstech/);
    });
});
EOF

npm install
if [ $? -eq 0 ]; then
    echo "✅ Web dependencies installed successfully"
else
    echo "❌ Web dependencies installation failed"
    exit 1
fi


cd ../..
echo "✅ Web testing setup complete"

cd tests/web-testing
npx playwright install --with-deps
if [ $? -eq 0 ]; then
    echo "✅ Playwright browsers installed successfully"
else
    echo "❌ Playwright browsers installation failed"
    exit 1
fi
cd ../..
echo "✅ Playwright browsers and dependencies installed"

# Install Playwright CLI (for AI agent browser automation)
echo "📦 Installing Playwright CLI..."
npm install -g @playwright/cli@latest
if [ $? -eq 0 ]; then
    echo "✅ Playwright CLI installed ($(playwright-cli --version 2>/dev/null || echo 'installed'))"
    # Install skills for AI agent (Claude Code, Kiro, GitHub Copilot)
    echo "📦 Installing Playwright CLI skills..."
    playwright-cli install --skills
    if [ $? -eq 0 ]; then
        echo "✅ Playwright CLI skills installed"
    else
        echo "⚠️  Skills install failed, try manually: playwright-cli install --skills"
    fi
else
    echo "⚠️  Playwright CLI global install failed, will use npx fallback"
fi

# Setup Chrome DevTools MCP (global Kiro config)
echo "📝 Setting up Chrome DevTools MCP..."
KIRO_MCP_DIR="$HOME/.kiro/settings"
KIRO_MCP_FILE="$KIRO_MCP_DIR/mcp.json"
mkdir -p "$KIRO_MCP_DIR"

if [ -f "$KIRO_MCP_FILE" ]; then
    if grep -q '"chrome-devtools"' "$KIRO_MCP_FILE"; then
        echo "✅ Chrome DevTools MCP already configured in $KIRO_MCP_FILE"
    else
        # Inject chrome-devtools into existing mcpServers object
        if command -v node &> /dev/null; then
            node -e "
const fs = require('fs');
const cfg = JSON.parse(fs.readFileSync('$KIRO_MCP_FILE', 'utf8'));
if (!cfg.mcpServers) cfg.mcpServers = {};
cfg.mcpServers['chrome-devtools'] = {
  command: 'npx',
  args: ['-y', 'chrome-devtools-mcp@latest'],
  disabled: false,
  autoApprove: []
};
fs.writeFileSync('$KIRO_MCP_FILE', JSON.stringify(cfg, null, 2));
"
            echo "✅ Chrome DevTools MCP added to $KIRO_MCP_FILE"
        else
            echo "⚠️  Node.js not available yet, skipping MCP config injection"
        fi
    fi
else
    # Create new mcp.json with chrome-devtools
    cat > "$KIRO_MCP_FILE" << 'MCP_EOF'
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"],
      "disabled": false,
      "autoApprove": []
    }
  }
}
MCP_EOF
    echo "✅ Chrome DevTools MCP config created at $KIRO_MCP_FILE"
fi

# Create Playwright CLI config (inside web-testing)
echo "📝 Setting up Playwright CLI config..."
mkdir -p tests/web-testing/.playwright
cat > tests/web-testing/.playwright/cli.config.json << 'PWCLI_EOF'
{
  "browser": {
    "browserName": "chromium",
    "isolated": true,
    "launchOptions": {
      "headless": true
    },
    "contextOptions": {
      "viewport": { "width": 1280, "height": 720 }
    }
  },
  "outputDir": ".playwright/output",
  "outputMode": "file",
  "console": {
    "level": "info"
  },
  "network": {
    "allowedOrigins": [],
    "blockedOrigins": []
  },
  "testIdAttribute": "data-testid",
  "timeouts": {
    "action": 5000,
    "navigation": 60000
  },
  "codegen": "typescript"
}
PWCLI_EOF
echo "✅ .playwright/cli.config.json created"

# Setup Mobile Testing
echo "📦 Setting up Mobile testing..."
cd tests/mobile-testing

cat > requirements.txt << 'EOF'
# Core Dependencies (Required)
robotframework==6.0.1
robotframework-appiumlibrary==2.0.0
Appium-Python-Client>=3.0.0

# Test Data & Configuration (Recommended)
PyYAML==6.0.1
python-dotenv==1.0.0

# Database Integration (Optional)
pymysql==1.1.0
EOF

# Setup Appium Server via NPM (since it's a Node.js package)
echo "📦 Setting up Appium Server via NPM..."
cat > package.json << 'EOF'
{
  "name": "mobile-testing-tools",
  "version": "1.0.0",
  "dependencies": {
    "appium": "2.11.5"
  }
}
EOF
npm install
./node_modules/.bin/appium driver install uiautomator2 || true
./node_modules/.bin/appium driver install xcuitest || true

cat > .env << 'EOF'
# Global Mobile Testing Configuration
APPIUM_HOST=127.0.0.1
APPIUM_PORT=4723
IMPLICIT_WAIT=10
EXPLICIT_WAIT=30
EOF

cat > .env.android.sit << 'EOF'
PLATFORM_NAME=Android
PLATFORM_VERSION=13.0
DEVICE_NAME=Android Emulator
APP_PACKAGE=com.example.app
APP_ACTIVITY=.MainActivity
EOF

cat > .env.ios.sit << 'EOF'
PLATFORM_NAME=iOS
PLATFORM_VERSION=16.0
DEVICE_NAME=iPhone 14
BUNDLE_ID=com.example.app
EOF

cat > apps/.gitignore << 'EOF'
*.apk
*.ipa
!.gitignore
EOF

cat > apps/versions.json << 'EOF'
{
  "android": {
    "sit": "app-sit-v1.0.0.apk",
    "uat": "app-uat-v1.0.0.apk"
  },
  "ios": {
    "sit": "app-sit-v1.0.0.ipa",
    "uat": "app-uat-v1.0.0.ipa"
  }
}
EOF

mkdir -p tests-mobile/android/auth
mkdir -p tests-mobile/ios/auth
mkdir -p pages/android/auth
mkdir -p pages/ios/auth

cat > tests-mobile/android/initialRun.robot << 'EOF'
*** Settings ***
Library    AppiumLibrary
Library    OperatingSystem

*** Test Cases ***
Verify Mobile Setup Android
    [Tags]    smoke
    Log    ✅ Mobile Testing Setup Complete - Android
EOF

cat > tests-mobile/ios/initialRun.robot << 'EOF'
*** Settings ***
Library    AppiumLibrary
Library    OperatingSystem

*** Test Cases ***
Verify Mobile Setup iOS
    [Tags]    smoke
    Log    ✅ Mobile Testing Setup Complete - iOS
EOF

cat > pages/android/auth/LoginPage.robot << 'EOF'
*** Settings ***
Library    AppiumLibrary

*** Keywords ***
Open App
    Log    Opening Android App
EOF

cat > pages/ios/auth/LoginPage.robot << 'EOF'
*** Settings ***
Library    AppiumLibrary

*** Keywords ***
Open App
    Log    Opening iOS App
EOF




if command -v python3 &> /dev/null; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    
    echo "📦 Installing Robot Framework and dependencies (this may take a moment)..."
    pip install --upgrade pip
    pip install -r requirements.txt
    
    if [ $? -eq 0 ]; then
        echo "✅ Mobile testing setup complete (Virtual Environment ready)"
    else
        echo "⚠️  Pip install failed. Please try manual install: source venv/bin/activate && pip install -r requirements.txt"
    fi
    deactivate 2>/dev/null || true
else
    echo "⚠️  Python3 not found, skipping pip install"
    echo "✅ Mobile testing structure created (manual pip install required)"
fi

cd ../..

# Run verification tests
echo ""
echo "✅ Running verification tests..."

echo "📋 Checking versions..."
if command -v node &> /dev/null && command -v npm &> /dev/null; then
    node -v && npm -v 
    if [ -d "tests/api-testing/node_modules" ] && [ -d "tests/web-testing/node_modules" ]; then
        npx playwright --version
    else
        echo "⚠️  Playwright not available, skipping version check"
    fi
    if command -v robot &> /dev/null; then
        robot --version
    else
        echo "⚠️  Robot Framework not found in PATH"
    fi
else
    echo "❌ Node.js or npm not installed"
    exit 1
fi

echo ""
echo "🧪 Running API smoke test..."
if [ -d "tests/api-testing/node_modules" ]; then
    cd tests/api-testing && npm run api:sit:initial-run:cliMode
    if [ $? -eq 0 ]; then
        echo "✅ API smoke test passed"
    else
        echo "❌ API smoke test failed"
        exit 1
    fi
    cd ../..
else
    echo "❌ API testing dependencies not installed, skipping smoke test"
fi

echo ""
echo "🧪 Running Web UI smoke test..."
if [ -d "tests/web-testing/node_modules" ]; then
    cd tests/web-testing && npm run ui:sit:initial-run:cliMode
    if [ $? -eq 0 ]; then
        echo "✅ Web UI smoke test passed"
    else
        echo "❌ Web UI smoke test failed"
        exit 1
    fi
    cd ../..
fi

echo ""
echo "🧪 Running Mobile (Robot Framework) smoke test..."
if [ -d "tests/mobile-testing/venv" ]; then
    cd tests/mobile-testing
    source venv/bin/activate
    robot --outputdir test-results tests-mobile
    if [ $? -eq 0 ]; then
        echo "✅ Mobile smoke test passed"
    else
        echo "❌ Mobile smoke test failed"
        exit 1
    fi
    deactivate
    cd ../..
else
    echo "❌ Mobile testing venv not found, skipping smoke test"
fi

# Skip Git initialization to avoid interfering with existing monorepo structure
echo ""
echo "🔧 Setting up Git automation..."

# Setup .gitignore (inline)
echo "📝 Setting up .gitignore for test automation..."
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'GITIGNORE_EOF'
# Global OS Files
.DS_Store
Thumbs.db

# Dependencies
node_modules/
venv/
env/

# IDE & Editor
.vscode/
.idea/
*.swp
*.swo
*.iml

# Playwright (API & Web)
test-results/
playwright-report/
playwright/.cache/
playwright/.auth/
blob-report/
tests/*/playwright-report/
tests/*/test-results/

# Playwright CLI
.playwright/output/
.playwright-cli/

# Robot Framework & Python (Mobile)
log.html
report.html
output.xml
results/
screenshots/
__pycache__/
*.pyc
*.py[cod]
*$py.class
.pytest_cache/
*.log
*.tmp

# Environment Files - Ignore LOCAL only
.env.local
.env.android.local
.env.ios.local

# Playwright CLI (AI agent browser automation)
.claude/
.playwright/
.playwright-cli/

GITIGNORE_EOF
# Setup README.md (Concise & Linked)
echo "📝 Creating Project README.md..."
cat > README.md << EOF
# ${TARGET_DIR} - QA Automation

Project สำหรับการทดสอบอัตโนมัติ (API, Web, Mobile) ตามมาตรฐาน **COE Standard**.

---

## 📖 Rules & Standards (Single Source of Truth)

AI Agents และทีมงานทุกคน **ต้อง** ปฏิบัติตามกฎมาตรฐานในไฟล์หลัก:

- 🔌 **API Testing:** ~/.kiro/skills/rules/playwright-rules/references/api.md
- 🌐 **Web UI Testing:** ~/.kiro/skills/rules/playwright-rules/references/web-ui.md
- 📱 **Mobile (Android):** ~/.kiro/skills/rules/robotframework-rules/references/android.md
- 📱 **Mobile (iOS):** ~/.kiro/skills/rules/robotframework-rules/references/ios.md
- 🤖 **AI-DLC Workflow:** ~/.kiro/skills/governance/aidlc/references/workflow.md

---

## 📁 Project Structure

- \`tests/api-testing/\`: Automation สำหรับ API (Playwright + TS)
- \`tests/web-testing/\`: Automation สำหรับ Web (Playwright + POM)
- \`tests/mobile-testing/\`: Automation สำหรับ Mobile (Robot Framework + Appium)
- \`tests/test-scenario/\`: จัดเก็บเอกสาร Scenario ทั้งหมด (MD/CSV)

---

## 🚀 เริ่มใช้งาน AI (Kiro)

พิมพ์ trigger เช่น: \`test scenario PBI-12345\`, \`สร้าง api test\`, \`start AI-DLC\`

ถ้า Kiro ไม่รู้จัก skills: \`Read AGENTS.md and follow those instructions\`

EOF
    echo "✅ README.md created"
else
    echo "✅ .gitignore already exists"
fi

echo ""
echo "✅ COE Standard Setup completed!"
echo ""

# Verify setup (inline)
echo "🔍 Verifying setup..."
echo ""

FAILED=0

# 1. .gitignore setup
if [ -f .gitignore ]; then
    if grep -q "test-results/" .gitignore && grep -q "node_modules/" .gitignore; then
        echo "✅ .gitignore configured"
    else
        echo "❌ .gitignore incomplete"
        FAILED=1
    fi
else
    echo "❌ .gitignore missing"
    FAILED=1
fi

echo ""
if [ $FAILED -eq 0 ]; then
    echo "🎉 Setup completed successfully!"
else
    echo "⚠️  Setup incomplete. Please check errors above."
    exit 1
fi

# Getting Started Guide
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📖 GETTING STARTED — อ่านก่อนเริ่มทำงาน"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1️⃣  ภาพรวมระบบ (อ่านก่อน)"
echo "    📄 AGENTS.md (workspace root)"
echo "       → Skills index, trigger phrases, agent tier + Karpathy principles"
echo ""
echo "2️⃣  AI-DLC Workflow"
echo "    📄 ~/.kiro/skills/governance/aidlc/references/workflow.md"
echo "       → Phase-by-phase flow, routing logic, anti-shortcut rules"
echo "    📄 ~/.kiro/skills/governance/aidlc/references/workflow-process.md"
echo "       → Who does what: User / AI / QA Lead / Azure DevOps"
echo ""
echo "3️⃣  โครงสร้างโปรเจกต์ที่เพิ่งสร้าง"
echo "    📁 $TARGET_DIR/"
echo "       ├── tests/api-testing/     → Playwright API tests"
echo "       ├── tests/web-testing/     → Playwright Web UI tests"
echo "       ├── tests/mobile-testing/  → Robot Framework + Appium"
echo "       └── tests/test-scenario/   → Test scenario docs (MD/CSV)"
echo ""
echo "4️⃣  เริ่มใช้งาน AI (Kiro)"
echo "    → เปิด Kiro IDE และเปิด project folder"
echo "    → พิมพ์ trigger เช่น: 'test scenario PBI-12345', 'สร้าง api test', 'start AI-DLC'"
echo "    → Kiro จะถามว่า QA / Dev / Both แล้วเริ่ม workflow ตาม phase ที่ถูกต้อง"
echo "    → AI จะดึงข้อมูล PBI จาก Azure DevOps (ผ่าน MCP) และวาง folder structure ให้"
echo "    → ตรวจสอบว่า path เป็น [SYSTEM_KEBAB]/[SYSTEM_FEATURE_KEBAB]/ ถูกต้องก่อน approve"
echo "    💡 ถ้า Kiro ไม่รู้จัก skills: 'Read AGENTS.md and follow those instructions'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
exit 0
