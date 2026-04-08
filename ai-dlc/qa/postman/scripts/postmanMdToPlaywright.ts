import * as fs from 'fs';
import * as path from 'path';

// ───────────────────────────────────────────────
// SECURITY HELPERS
// ───────────────────────────────────────────────
function sanitizeLog(s: string): string {
    return s.replace(/[\r\n]/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
}

const ALLOWED_EXTENSIONS = new Set(['.md']);
function safeResolvePath(base: string, userInput: string): string {
    const resolved = path.resolve(userInput);
    const baseResolved = path.resolve(base);
    if (!resolved.startsWith(baseResolved + path.sep) && resolved !== baseResolved) {
        throw new Error(`Path traversal detected: ${sanitizeLog(userInput)}`);
    }
    return resolved;
}

/**
 * 🚀 postmanMdToPlaywright.ts (Postman Markdown to Playwright)
 * @version 5.0 - Multi-Service Architecture
 * @fixes-v4
 *   1. [PARSER]       Stack-based block extractor — แทน testRegex ที่หลุด nested });
 *   2. [ITER_DATA]    pm.iterationData → extract keys จริง + typed interface + test.each
 *   3. [SEND_REQ]     pm.sendRequest CPS → await transform (brace-safe)
 *   4. [CTRL_FLOW]    setNextRequest → test.describe.serial hint + sequential steps
 *   5. [HELPER]       helperMethods → guard response scope + Thai name fallback
 *   6. [RESP_TYPE]    responseJson → content-type guard แทน hardcode .json()
 *   7. [SYS_NAME]     systemName → อ่านจาก H1 header แทน describe()
 *   8. [COLL_HELPER]  collectionHelpersData → strip code fence ก่อน match
 *   9. [DATA_DETECT]  isDataDriven → detect จาก `data.` pattern + iterationKeys
 *  10. [STATE_STORE]  stateStore → detect + emit test.describe.serial + beforeAll
 * @fixes-v5
 *  11. [MULTI_SVC]    Multi-Service Architecture — แยก *Service.ts per label, Helper เป็น entry point
 *  12. [LIFECYCLE]    beforeEach/afterEach — improved DB strategy stubs with request fixture
 *  13. [SERIAL_ID]    test.describe.serial ยังคง [PBI-0000] prefix ตาม playwright-rules
 */

// ───────────────────────────────────────────────
// CONFIG & CONSTANTS
// ───────────────────────────────────────────────
const DEFAULT_HELPER_DIR = 'helpers';
const DEFAULT_FIXTURE_DIR = 'fixtures';
const DEFAULT_SCHEMA_DIR  = 'schemas';
const DEFAULT_SPEC_DIR    = 'tests-api';
const DEFAULT_SYSTEM_NAME = 'api-feature';
const WORKFLOW_MD_PATH    = path.join(process.cwd(), 'skills/ai-dlc/qa/playwright-testing/references/workflow.md');

// ───────────────────────────────────────────────
// WORKFLOW STRUCTURE LOADER
// ───────────────────────────────────────────────
interface WorkflowStructure {
    specDir: string;
    helperDir: string;
    schemaDir: string;
    fixtureDir: string;
}

function loadWorkflowStructure(): WorkflowStructure {
    const defaults: WorkflowStructure = {
        specDir:    DEFAULT_SPEC_DIR,
        helperDir:  DEFAULT_HELPER_DIR,
        schemaDir:  DEFAULT_SCHEMA_DIR,
        fixtureDir: DEFAULT_FIXTURE_DIR,
    };

    if (!fs.existsSync(WORKFLOW_MD_PATH)) {
        console.warn('⚠️  workflow.md not found — using default folder structure');
        return defaults;
    }

    try {
        const md = fs.readFileSync(WORKFLOW_MD_PATH, 'utf-8');

        // Find the api-testing folder structure fenced block
        const structureMatch = md.match(/```\n(tests\/api-testing\/[\s\S]*?)\n```/);
        if (!structureMatch) return defaults;

        const treeLines = structureMatch[1].split('\n')
            .filter(l => /[├└]──/.test(l));

        // Extract first path segment from each tree line
        const segments = treeLines
            .map(l => { const m = l.match(/[├└]──\s+([^/\s]+)\//); return m ? m[1] : null; })
            .filter((s): s is string => s !== null);

        const result: WorkflowStructure = {
            specDir:    segments.find(s => s.startsWith('tests-')) ?? defaults.specDir,
            helperDir:  segments.find(s => s === 'helpers')         ?? defaults.helperDir,
            schemaDir:  segments.find(s => s === 'schemas')         ?? defaults.schemaDir,
            fixtureDir: segments.find(s => s === 'fixtures')        ?? defaults.fixtureDir,
        };

        console.log(`\n📐 Workflow Structure (from workflow.md)`);
        console.log(`   Spec    : ${result.specDir}/`);
        console.log(`   Helper  : ${result.helperDir}/`);
        console.log(`   Schema  : ${result.schemaDir}/`);
        console.log(`   Fixture : ${result.fixtureDir}/`);

        return result;
    } catch {
        console.warn('⚠️  Failed to parse workflow.md — using default folder structure');
        return defaults;
    }
}

const workflowStructure = loadWorkflowStructure();

// ───────────────────────────────────────────────
// ARG PARSING
// ───────────────────────────────────────────────
const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
if (inputIndex === -1 || !args[inputIndex + 1]) {
    console.error('❌ Usage: npx ts-node postmanMdToPlaywright.ts --input <directory_or_file.md> [--env-input <env.md>] [--output-dir <directory>] [--spec-dir <name>] [--helper-dir <name>] [--schema-dir <name>] [--fixture-dir <name>]');
    process.exit(1);
}
const inputPath = args[inputIndex + 1];

const envInputIndex = args.indexOf('--env-input');
const envInputFile = envInputIndex !== -1 && args[envInputIndex + 1] ? args[envInputIndex + 1] : null;

const outputDirIndex = args.indexOf('--output-dir');
const baseOutputDir = outputDirIndex !== -1 && args[outputDirIndex + 1]
    ? args[outputDirIndex + 1]
    : process.cwd();

const specDirIdx    = args.indexOf('--spec-dir');
const helperDirIdx  = args.indexOf('--helper-dir');
const schemaDirIdx  = args.indexOf('--schema-dir');
const fixtureDirIdx = args.indexOf('--fixture-dir');

const specDirName    = specDirIdx    !== -1 && args[specDirIdx    + 1] ? args[specDirIdx    + 1] : workflowStructure.specDir;
const helperDirName  = helperDirIdx  !== -1 && args[helperDirIdx  + 1] ? args[helperDirIdx  + 1] : workflowStructure.helperDir;
const schemaDirName  = schemaDirIdx  !== -1 && args[schemaDirIdx  + 1] ? args[schemaDirIdx  + 1] : workflowStructure.schemaDir;
const fixtureDirName = fixtureDirIdx !== -1 && args[fixtureDirIdx + 1] ? args[fixtureDirIdx + 1] : workflowStructure.fixtureDir;

// ───────────────────────────────────────────────
// STRING HELPERS
// ───────────────────────────────────────────────
function toKebabCase(str: string): string {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_.]+/g, '-')       // dots, spaces, underscores → dash
        .toLowerCase()
        .replace(/[^a-z0-9-\u0E00-\u0E7F]/g, '')
        .replace(/-+/g, '-')
        .replace(/^[\d-]+/, '')         // strip leading digits/dashes (e.g. "9-5-" from "9.5")
        .replace(/^-|-$/g, '');
}

function toCamelCase(str: string): string {
    const kebab = toKebabCase(str);
    return kebab.replace(/-([a-z0-9\u0E00-\u0E7F])/g, g => g[1].toUpperCase()) || 'unnamed';
}

// Pascal case ใช้สำหรับ class names
function toPascalCase(str: string): string {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// ───────────────────────────────────────────────
// KNOWLEDGE BASE INTEGRATION
// ───────────────────────────────────────────────
const KNOWLEDGE_PATH = path.join(process.cwd(), 'ai-agent/knowledge/automation/api/apiIndex.json');
let knowledgeBase: any = null;
try {
    if (fs.existsSync(KNOWLEDGE_PATH)) {
        knowledgeBase = JSON.parse(fs.readFileSync(KNOWLEDGE_PATH, 'utf-8'));
        console.log(`\n🧠 Knowledge Base Loaded: v${sanitizeLog(String(knowledgeBase.version ?? ''))}`);
    }
} catch (e) { console.warn('⚠️ Could not load Knowledge Base'); }

function getRecommendation(code: string): string[] {
    const tips: string[] = [];
    if (!knowledgeBase) return tips;
    if (code.includes('token') || code.includes('Authorization')) {
        const auth = knowledgeBase.templates?.auth?.[0];
        if (auth) tips.push(`// 💡 [KB] Auth: Use ${sanitizeLog(String(auth.id ?? ''))} helper — ${sanitizeLog(String(auth.description ?? ''))}`);
    }
    if (code.includes('multipart') || code.includes('fs.createReadStream')) {
        const file = knowledgeBase.templates?.file?.[0];
        if (file) tips.push(`// 💡 [KB] File: Use ${sanitizeLog(String(file.id ?? ''))} helper — ${sanitizeLog(String(file.description ?? ''))}`);
    }
    if (code.includes('expect(')) {
        const val = knowledgeBase.templates?.validation?.[0];
        if (val) tips.push(`// 💡 [KB] Validation: Check ${sanitizeLog(String(val.id ?? ''))} — ${sanitizeLog(String(val.description ?? ''))}`);
    }
    if (code.includes('stateStore') || code.includes('PARALLEL RISK')) {
        const util = knowledgeBase.templates?.utils?.[0];
        if (util) tips.push(`// 💡 [KB] Utils: ${sanitizeLog(String(util.id ?? ''))} — ${sanitizeLog(String(util.description ?? ''))}`);
    }
    // เพิ่ม recent lessons hint
    if (knowledgeBase.recent_lessons && knowledgeBase.recent_lessons.length > 0) {
        knowledgeBase.recent_lessons.forEach((lesson: any) => {
            if (lesson.summary && (
                (code.includes('route') && lesson.summary.includes('route')) ||
                (code.includes('module') && lesson.summary.includes('module-level')) ||
                (code.includes('mock') && lesson.summary.includes('Mock'))
            )) {
                tips.push(`// 📖 [LESSON ${lesson.id}] ${lesson.summary}`);
            }
        });
    }
    return tips;
}

// ───────────────────────────────────────────────
// [FIX #1] STACK-BASED BLOCK EXTRACTOR
// ───────────────────────────────────────────────
interface TestBlock {
    label: string;       // folder path
    testName: string;    // request name
    fullBody: string;    // entire body
}

function extractTestBlocks(markdown: string): TestBlock[] {
    const blocks: TestBlock[] = [];
    const lines = markdown.split('\n');

    let insideBlock = false;
    let depth = 0;
    let currentLines: string[] = [];
    let currentLabel = '';
    let currentName = '';
    let inString: string | null = null;

    for (const line of lines) {
        if (!insideBlock) {
            const headerMatch = line.match(/^test\(['"`](.+?)['"`],\s*async/);
            if (headerMatch) {
                const fullName = headerMatch[1];
                if (fullName.includes(' > ')) {
                    const parts = fullName.split(' > ');
                    currentName = parts.pop() || '';
                    currentLabel = parts.join(' > ');
                } else {
                    currentLabel = 'General';
                    currentName = fullName;
                }
                insideBlock = true;
                depth = 0;
                currentLines = [];
                inString = null;
                // [FIX] count braces on the header line itself
                for (let i = 0; i < line.length; i++) {
                    const ch = line[i];
                    const prev = i > 0 ? line[i - 1] : '';
                    if ((ch === '"' || ch === "'" || ch === '`') && prev !== '\\') {
                        inString = inString === null ? ch : (inString === ch ? null : inString);
                    }
                    if (inString) continue;
                    if (ch === '{') depth++;
                    if (ch === '}') depth--;
                }
            }
        } else {
            currentLines.push(line);
            for (let i = 0; i < line.length; i++) {
                const ch = line[i];
                const prev = i > 0 ? line[i - 1] : '';
                if ((ch === '"' || ch === "'" || ch === '`') && prev !== '\\') {
                    inString = inString === null ? ch : (inString === ch ? null : inString);
                }
                if (inString) continue;
                if (ch === '{') depth++;
                if (ch === '}') depth--;
            }
            if (depth === 0 && line.trim().startsWith('}')) {
                blocks.push({ label: currentLabel, testName: currentName, fullBody: currentLines.join('\n') });
                insideBlock = false;
            }
        }
    }
    return blocks;
}

// ───────────────────────────────────────────────
// [FIX #2] ITERATION DATA KEY EXTRACTOR
// ───────────────────────────────────────────────
function extractIterationKeys(body: string): string[] {
    // ดึง keys จาก pm.iterationData.get('key') และ data.key (หลัง transform)
    const pmKeys = [...body.matchAll(/pm\.iterationData\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g)].map(m => m[1]);
    const dataKeys = [...body.matchAll(/\bdata\.([a-zA-Z_]\w*)/g)].map(m => m[1]);
    return [...new Set([...pmKeys, ...dataKeys])];
}

// ───────────────────────────────────────────────
// [FIX #3] CPS → ASYNC/AWAIT (brace-safe)
// ───────────────────────────────────────────────
function transformSendRequest(code: string): string {
    // ใช้ stack นับ brace แทน regex greedy
    const tag = 'pm.sendRequest';
    let result = code;
    let searchFrom = 0;

    while (true) {
        const startIdx = result.indexOf(tag, searchFrom);
        if (startIdx === -1) break;

        // หา opening ( ของ pm.sendRequest(
        const parenOpen = result.indexOf('(', startIdx + tag.length);
        if (parenOpen === -1) break;

        // นับ paren depth เพื่อหา closing )
        let parenDepth = 0;
        let endIdx = -1;
        let inStr: string | null = null;

        for (let i = parenOpen; i < result.length; i++) {
            const ch = result[i];
            const prev = i > 0 ? result[i - 1] : '';
            if ((ch === '"' || ch === "'" || ch === '`') && prev !== '\\') {
                inStr = inStr === null ? ch : (inStr === ch ? null : inStr);
            }
            if (inStr) continue;
            if (ch === '(') parenDepth++;
            if (ch === ')') {
                parenDepth--;
                if (parenDepth === 0) { endIdx = i; break; }
            }
        }

        if (endIdx === -1) break;

        const callStr = result.slice(startIdx, endIdx + 1);

        // Extract config (first arg) and callback (second arg) using stack-based search
        const innerContent = result.slice(parenOpen + 1, endIdx);

        // find the comma separating config from callback (outside parens/braces/strings)
        let cbSepIdx = -1;
        {
            let d = 0, s: string | null = null;
            for (let i = 0; i < innerContent.length; i++) {
                const ch = innerContent[i], prev = i > 0 ? innerContent[i - 1] : '';
                if ((ch === '"' || ch === "'" || ch === '`') && prev !== '\\') s = s === null ? ch : (s === ch ? null : s);
                if (s) continue;
                if (ch === '(' || ch === '{' || ch === '[') d++;
                if (ch === ')' || ch === '}' || ch === ']') d--;
                if (ch === ',' && d === 0) { cbSepIdx = i; break; }
            }
        }

        let replacement: string;
        if (cbSepIdx !== -1) {
            const configRaw = innerContent.slice(0, cbSepIdx).trim();
            const cbRaw = innerContent.slice(cbSepIdx + 1).trim();
            const cbHeaderMatch = cbRaw.match(/^(?:async\s+)?function\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/);

            if (cbHeaderMatch) {
                const errParam = cbHeaderMatch[1];
                const resParam = cbHeaderMatch[2];
                // extract callback body using brace stack
                const cbBodyStart = cbRaw.indexOf('{') + 1;
                let bd = 1, cbBodyEnd = cbBodyStart, inS: string | null = null;
                for (let i = cbBodyStart; i < cbRaw.length && bd > 0; i++) {
                    const ch = cbRaw[i], prev = i > 0 ? cbRaw[i - 1] : '';
                    if ((ch === '"' || ch === "'" || ch === '`') && prev !== '\\') inS = inS === null ? ch : (inS === ch ? null : inS);
                    if (inS) { cbBodyEnd = i; continue; }
                    if (ch === '{') bd++;
                    if (ch === '}') bd--;
                    cbBodyEnd = i;
                }
                const bodyRaw = cbRaw.slice(cbBodyStart, cbBodyEnd).trim();

                const configClean = configRaw
                    .replace(/pm\.(?:environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
                        (_, k) => `process.env['${k}']`);

                const bodyClean = bodyRaw
                    .replace(/pm\.(?:environment|globals|variables)\.set\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\);?/g,
                        (_, k, v) => `process.env['${k}'] = String(${v});`)
                    .replace(/pm\.(?:environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
                        (_, k) => `process.env['${k}']`)
                    .replace(new RegExp(`\\b${resParam}\\.json\\(\\)`, 'g'), '_sendReqJson')
                    .replace(new RegExp(`\\b${resParam}\\.code\\b`, 'g'), '_sendReqRes.status()')
                    // strip if (err) { ... } blocks left from CPS
                    .replace(new RegExp(`if\\s*\\(\\s*${errParam}\\s*\\)\\s*\\{[\\s\\S]*?\\}`, 'g'), '')
                    .replace(new RegExp(`\\b${errParam}\\b`, 'g'), '_sendReqErr');

                replacement = [
                    `// ⚡ [CPS→ASYNC] pm.sendRequest converted`,
                    `const _sendReqRes = await request.fetch(${configClean});`,
                    `if (!_sendReqRes.ok()) throw new Error(\`Pre-request failed: \${_sendReqRes.status()}\`);`,
                    `const _sendReqJson = await _sendReqRes.json();`,
                    bodyClean,
                ].join('\n        ');
            } else {
                replacement = `// ⚠️ [MANUAL] pm.sendRequest — complex pattern, migrate manually\n        // Raw: ${callStr.replace(/\n/g, ' ')}`;
            }
        } else {
            replacement = `// ⚠️ [MANUAL] pm.sendRequest — complex pattern, migrate manually\n        // Raw: ${callStr.replace(/\n/g, ' ')}`;
        }

        result = result.slice(0, startIdx) + replacement + result.slice(endIdx + 1);
        searchFrom = startIdx + replacement.length;
    }

    return result;
}

// ───────────────────────────────────────────────
// [FIX #6] RESPONSE SNIPPET — content-type guard
// ───────────────────────────────────────────────
function buildResponseSnippet(action: string, assertions: string): string {
    const combined = action + '\n' + assertions;
    const needsJson = combined.includes('responseJson') ||
        combined.includes('pm.response.json()');
    const needsText = combined.includes('responseText') ||
        combined.includes('pm.response.text()');
    const statusOnly = !needsJson && !needsText;

    if (statusOnly) {
        return `        // No response body parsing needed`;
    }
    if (needsText) {
        return `        const responseText = await response.text();`;
    }
    // json (default)
    return [
        `        const _ct = response.headers()['content-type'] || '';`,
        `        if (!_ct.includes('application/json')) {`,
        `            throw new Error(\`Expected JSON but got \${_ct} (status: \${response.status()})\`);`,
        `        }`,
        `        const responseJson = await response.json();`,
    ].join('\n');
}

// ───────────────────────────────────────────────
// [FIX #10] STATE STORE DETECTOR
// ───────────────────────────────────────────────
function detectStateStore(body: string): boolean {
    return body.includes('stateStore[') || body.includes('stateStore.');
}

// ───────────────────────────────────────────────
// ADVANCED TRANSFORMS (v4 — used inside block body)
// ───────────────────────────────────────────────
// Global helper for name resolution (matching readPostmanEnv)
function getSafeVarName(key: string): string {
    return key.replace(/[-. ]/g, '_');
}

function transformAdvancedLogic(code: string, systemCamelName: string): string {
    let t = code;

    // [FIX #3] pm.sendRequest → CPS-to-async
    if (t.includes('pm.sendRequest')) t = transformSendRequest(t);

    // [FIX #11] Helper Parameter Overrides — stack-based to handle multiline body
    const rbTag = 'let requestBody: any = ';
    const rbIdx = t.indexOf(rbTag);
    if (rbIdx !== -1) {
        const valStart = rbIdx + rbTag.length;
        // find the terminating ; outside all brackets
        let bd = 0, inS: string | null = null, rbEnd = -1;
        for (let i = valStart; i < t.length; i++) {
            const ch = t[i], prev = i > 0 ? t[i - 1] : '';
            if ((ch === '"' || ch === "'" || ch === '`') && prev !== '\\') inS = inS === null ? ch : (inS === ch ? null : inS);
            if (inS) continue;
            if (ch === '(' || ch === '{' || ch === '[') bd++;
            if (ch === ')' || ch === '}' || ch === ']') bd--;
            if (ch === ';' && bd === 0) { rbEnd = i; break; }
        }
        if (rbEnd !== -1) {
            const origVal = t.slice(valStart, rbEnd).trim();
            t = t.slice(0, rbIdx) + `let requestBody: any = data && Object.keys(data).length > 0 ? data : ${origVal};` + t.slice(rbEnd + 1);
        }
    }

    // [FIX #4] setNextRequest → serial hint
    t = t.replace(/(postman|pm\.execution)\.setNextRequest\s*\((.+?)\)/g,
        `// ⚠️ [CONTROL_FLOW] setNextRequest($2) — use test.describe.serial + sequential test.step`);

    // [FIX #2] pm.iterationData.get → data.key
    t = t.replace(/pm\.iterationData\.get\s*\(\s*['"](.+?)['"]\s*\)/g, (_, k) => `data.${getSafeVarName(k)} // 📊 [DATA_DRIVEN]`);

    // Fixture refs
    t = t.replace(/process\.env\['([^']+)'\]/g, (_, k) => `${systemCamelName}TestData.env.${getSafeVarName(k)}`);

    // Postman Helpers
    t = t.replace(/replaceIn\((.+?)\)/g, `/* replaceIn: manual random needed */ $1`);

    // deps
    t = t.replace(/require\(['"]moment['"]\)/g, `require('moment') // 🕒 add to package.json`);
    t = t.replace(/require\(['"]lodash['"]\)/g, `_ // 🛠️ import _ from 'lodash'`);
    t = t.replace(/require\(['"]ajv['"]\)/g, `Ajv // 🛡️ import Ajv from 'ajv'`);
    t = t.replace(/cheerio\.load\(/g, `cheerio.load( // 🌐 consider Playwright locators`);

    // Knowledge Base Tips
    const tips = getRecommendation(t);
    if (tips.length > 0) t = tips.map(tip => `// ${tip}`).join('\n') + '\n' + t;

    if (t.includes('AI_ASSIST_NEEDED')) t = `// 🚨 ACTION REQUIRED: Logic refactor needed (Loops/Mutation)\n` + t;
    if (t.includes('eval(')) t = `// ⚠️ [DANGER] eval() detected — check CollectionHelpers\n` + t;

    return t;
}

// ───────────────────────────────────────────────
// CORE PROCESSING LOGIC (v4)
// ───────────────────────────────────────────────
async function processFile(
    inputFile: string,
    envInput: string | null,
    targetDir: string,
    opts: { specDir: string; helperDir: string; schemaDir: string; fixtureDir: string } = {
        specDir:    specDirName,
        helperDir:  helperDirName,
        schemaDir:  schemaDirName,
        fixtureDir: fixtureDirName,
    }
) {
    const { helperDir, schemaDir, fixtureDir } = opts;
    // [SECURITY] validate paths are within cwd
    const cwd = process.cwd();
    try {
        safeResolvePath(cwd, inputFile);
        if (envInput) safeResolvePath(cwd, envInput);
        safeResolvePath(cwd, targetDir);
    } catch (e: any) {
        console.error(`❌ ${sanitizeLog(e.message)}`);
        return;
    }
    const ext = path.extname(inputFile).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
        console.error(`❌ Unsupported file type: ${sanitizeLog(ext)}`);
        return;
    }
    console.log(`\n📖 Processing: ${sanitizeLog(inputFile)}`);

    let markdownRaw = '';
    try {
        markdownRaw = fs.readFileSync(inputFile, 'utf-8');
    } catch {
        console.error(`❌ Failed to read: ${sanitizeLog(inputFile)}`);
        return;
    }

    let envMarkdownRaw = '';
    if (envInput) {
        try {
            envMarkdownRaw = fs.readFileSync(envInput, 'utf-8');
            console.log(`✅ Loaded Env Markdown: ${sanitizeLog(envInput)}`);
        } catch {
            console.error(`⚠️ Failed to read env file: ${sanitizeLog(envInput)}`);
        }
    }

    // ─────────────────────────────────────────
    // [FIX #7] systemName — อ่านจาก H1 header
    // ─────────────────────────────────────────
    let systemName = DEFAULT_SYSTEM_NAME;
    const h1Match = markdownRaw.match(/^#\s+📖\s+(.+?)\s+[—–-]/m)   // "# 📖 CollectionName — ..."
        || markdownRaw.match(/^#\s+(.+)$/m);                 // fallback: any H1
    if (h1Match) {
        systemName = h1Match[1].replace(/[^\w\s-]/g, '').trim() || DEFAULT_SYSTEM_NAME;
    }

    // kebabName = folder name ของ input file (ตรงกับ tests-api/<folder>)
    const kebabName = path.basename(path.dirname(inputFile)) || toKebabCase(systemName) || 'api-feature';
    const camelName = toCamelCase(systemName);
    const pascalName = toPascalCase(systemName);

    // ─────────────────────────────────────────
    // [FIX #8] collectionHelpersData — strip code fence
    // ─────────────────────────────────────────
    // Markdown emit ``` typescript ... ``` ครอบอยู่ ต้อง strip ออกก่อน match
    const strippedMd = markdownRaw.replace(/```[\w]*\n([\s\S]*?)```/g, '$1');
    const helperFnBlocks = strippedMd.match(/export const CollectionHelpers\s*=\s*\{[\s\S]*?\};/);
    const collectionHelpersData = helperFnBlocks ? helperFnBlocks[0] : '';

    // ─────────────────────────────────────────
    // [NEW] Parse Standard Imports from collection MD
    // ─────────────────────────────────────────
    // readPostmanCollection v6.0 emits ## 📦 Standard Imports block
    const collectionImports: string[] = [];
    const stdImportsMatch = markdownRaw.match(
        /## 📦 Standard Imports[\s\S]*?```typescript\n([\s\S]*?)\n```/
    );
    if (stdImportsMatch) {
        stdImportsMatch[1].split('\n')
            .map(l => l.trim())
            .filter(l => l.startsWith('import '))
            .forEach(l => collectionImports.push(l));
    }
    // deduplicate + filter out base playwright import (we handle it ourselves)
    const extraImports = [...new Set(collectionImports)].filter(
        l => !l.includes('@playwright/test') && !l.includes('fs from')
    );
    const extraImportsStr = extraImports.length > 0 ? extraImports.join('\n') + '\n' : '';
    const needsCollectionHelpers = strippedMd.includes('CollectionHelpers.');
    const needsXml2js = extraImports.some(l => l.includes('xml2js'));
    const needsCrypto = extraImports.some(l => l.includes('crypto'));
    const needsCheerio = extraImports.some(l => l.includes('cheerio'));
    const needsMoment = extraImports.some(l => l.includes('moment'));

    // ─────────────────────────────────────────
    // [FIX #1] Extract test blocks (stack-based)
    // ─────────────────────────────────────────
    const rawBlocks = extractTestBlocks(markdownRaw);

    if (rawBlocks.length === 0) {
        console.warn(`⚠️ No test blocks found in ${sanitizeLog(inputFile)}. Skipping...`);
        return;
    }

    // ─────────────────────────────────────────
    // Parse each block into structured snippet
    // ─────────────────────────────────────────
    interface TestSnippet {
        label: string;
        testName: string;
        action: string;
        assertions: string;
        isDataDriven: boolean;
        iterationKeys: string[];
        needsSerial: boolean;
        needsStateStore: boolean;
        hasControlFlow: boolean;
    }

    const testSnippets: TestSnippet[] = rawBlocks.map(block => {
        const body = block.fullBody;

        // extract action block
        const actionMatch = body.match(
            /\/\/ ━━━ 🎬 Action ━━━\s*([\s\S]+?)(?=\/\/ ━━━ ✅ Assertions|\/\/ ━━━|$)/
        );
        // extract assertions block
        const assertMatch = body.match(
            /\/\/ ━━━ ✅ Assertions ━━━\s*([\s\S]+?)(?=\}\);?\s*$|$)/
        );

        let action = actionMatch ? actionMatch[1].trim() : '// TODO: Action';
        let assertions = assertMatch ? assertMatch[1].trim() : '// TODO: Assertions';

        // apply transforms
        action = transformAdvancedLogic(action, camelName);
        assertions = transformAdvancedLogic(assertions, camelName);

        // [FIX #9] isDataDriven — ตรวจจาก iterationData keys และ data. pattern
        const iterationKeys = extractIterationKeys(body);
        const isDataDriven = iterationKeys.length > 0 ||
            body.includes('pm.iterationData');

        // [FIX #10] stateStore detection
        const needsStateStore = detectStateStore(body);

        // [FIX #4] control flow detection
        const hasControlFlow = body.includes('setNextRequest') ||
            body.includes('CONTROL_FLOW');

        const needsSerial = needsStateStore || hasControlFlow;

        return {
            label: block.label,
            testName: block.testName,
            action,
            assertions,
            isDataDriven,
            iterationKeys,
            needsSerial,
            needsStateStore,
            hasControlFlow,
        };
    });

    // ─────────────────────────────────────────
    // Extract Env Variables from env markdown
    // ─────────────────────────────────────────

    // [CONNECT #1] อ่าน .env properties block (key=value) — ใช้สำหรับ default values
    const extractedEnvKeys: Record<string, string> = {};
    if (envMarkdownRaw) {
        const dotEnvMatch = envMarkdownRaw.match(
            /## 📝 \.env Snippet[\s\S]*?```properties\n([\s\S]*?)\n```/
        );
        if (dotEnvMatch) {
            dotEnvMatch[1].split('\n').forEach(l => {
                if (l.trim() && !l.startsWith('#')) {
                    const [k, ...rest] = l.split('=');
                    if (k?.trim()) extractedEnvKeys[k.trim()] = rest.join('=').trim();
                }
            });
        }
    }

    // [CONNECT #2] อ่าน Machine-Readable Declarations section (key:::declaration)
    // format ที่ readPostmanEnv v4 emit — parse แบบ exact split ไม่ใช้ regex ซับซ้อน
    const machineDecls: Record<string, string> = {}; // key → full TS declaration
    if (envMarkdownRaw) {
        const machineMatch = envMarkdownRaw.match(
            /## 🔌 Machine-Readable Declarations[\s\S]*?```env-declarations\n([\s\S]*?)\n```/
        );
        if (machineMatch) {
            machineMatch[1].split('\n').forEach(line => {
                const sepIdx = line.indexOf(':::');
                if (sepIdx !== -1) {
                    const k = line.slice(0, sepIdx).trim();
                    const decl = line.slice(sepIdx + 3).trim();
                    if (k && decl) machineDecls[k] = decl;
                }
            });
        }
    }

    // [CONNECT #3] อ่าน Playwright Variable Declarations section (fallback สำหรับ env.md จาก v3)
    // ใช้เมื่อไม่มี Machine-Readable section (backward compat)
    const playwrightDecls: Record<string, string> = {};
    if (envMarkdownRaw && Object.keys(machineDecls).length === 0) {
        const pwDeclMatch = envMarkdownRaw.match(
            /## 🎭 Playwright Variable Declarations[\s\S]*?```typescript\n([\s\S]*?)\n```/
        );
        if (pwDeclMatch) {
            pwDeclMatch[1].split('\n').forEach(line => {
                // match: const varName = process.env['key']...
                const declMatch = line.match(/^const\s+\w+\s*=.*process\.env\['([^']+)'\]/);
                if (declMatch) {
                    playwrightDecls[declMatch[1]] = line.trim();
                }
            });
        }
    }

    // รวม source: machineDecls ก่อน ถ้าไม่มีใช้ playwrightDecls
    const allEnvDecls: Record<string, string> = { ...playwrightDecls, ...machineDecls };

    // ─────────────────────────────────────────
    // Build env block สำหรับ fixture
    // ─────────────────────────────────────────
    // [CONNECT #4] ใช้ typed declarations แทน raw string ทุกตัว
    const envEntries: string[] = [];

    // รวม keys จากทุก source: extracted .env + machineDecls + playwrightDecls
    const allEnvKeys = new Set([
        ...Object.keys(extractedEnvKeys),
        ...Object.keys(allEnvDecls),
    ]);

    allEnvKeys.forEach(k => {
        const rawVal = extractedEnvKeys[k];
        const decl = allEnvDecls[k];

        if (decl) {
            // มี typed declaration จาก readPostmanEnv v4 — ใช้เลย
            // strip `const varName =` ออก เอาแค่ส่วน value expression
            const valExpr = decl.replace(/^const\s+\w+\s*=\s*/, '').replace(/;.*$/, '').trim();
            envEntries.push(`        ${getSafeVarName(k)}: ${valExpr},`);
        } else if (rawVal !== undefined) {
            // fallback — raw string value
            envEntries.push(`        ${k}: ${rawVal ? JSON.stringify(rawVal) : '""'},`);
        }
    });

    const envProperties = envEntries.length > 0
        ? envEntries.join('\n')
        : `        // No environment variables found\n        placeholder: true`;

    // ─────────────────────────────────────────
    // [CONNECT #5] อ่าน used-vars จาก collection.md
    // เพื่อ cross-check ว่า env declarations ครบ
    // ─────────────────────────────────────────
    const collectionUsedVars = new Set<string>();
    const usedVarsMatch = markdownRaw.match(
        /## 🔗 Used Variables \(Machine-Readable\)[\s\S]*?```used-vars\n([\s\S]*?)\n```/
    );
    if (usedVarsMatch) {
        usedVarsMatch[1].split(',').map(s => s.trim()).filter(Boolean)
            .forEach(v => collectionUsedVars.add(v));
    }

    // vars ที่ collection ใช้แต่ไม่มี env declaration → warning ใน fixture
    const missingEnvDecls = [...collectionUsedVars].filter(v =>
        !allEnvDecls[v] && !extractedEnvKeys[v]
    );
    if (missingEnvDecls.length > 0) {
        console.warn(`\n⚠️  Missing env declarations for: ${sanitizeLog(missingEnvDecls.join(', '))}`);
        console.warn(`   Run readPostmanEnv with --used-vars ${sanitizeLog([...collectionUsedVars].join(','))}`);
        missingEnvDecls.forEach(v => {
            if (!envEntries.some(e => e.includes(`${v}:`))) {
                envEntries.push(`        // ⚠️ MISSING: ${v} — run readPostmanEnv to get declaration`);
                envEntries.push(`        // ${v}: process.env['${v}'],`);
            }
        });
    }
    const allIterationKeys = [...new Set(testSnippets.flatMap(s => s.iterationKeys))];
    const iterationInterface = allIterationKeys.length > 0
        ? `\nexport interface ${pascalName}IterationRow {\n` +
        allIterationKeys.map(k => `    ${k}: string; // TODO: update type`).join('\n') +
        '\n}\n'
        : '';

    const iterationDataType = allIterationKeys.length > 0
        ? `${pascalName}IterationRow`
        : '{ placeholder: string }';

    const iterationDataRows = allIterationKeys.length > 0
        ? `[\n        // TODO: fill iteration rows — keys: ${allIterationKeys.join(', ')}\n        { ${allIterationKeys.map(k => `${k}: ''`).join(', ')} },\n    ]`
        : `[\n        { placeholder: 'value1' },\n        { placeholder: 'value2' },\n    ]`;

    // ─────────────────────────────────────────
    // FILE 1: DATA FIXTURE
    // ─────────────────────────────────────────
    const fixtureExtraImports = [
        needsCrypto ? `import * as crypto from 'crypto';` : '',
    ].filter(Boolean).join('\n');

    const dataFileContent = [
        `import { test as base } from '@playwright/test';`,
        fixtureExtraImports,
        iterationInterface.trimEnd(),
    ].filter(Boolean).join('\n') + `
// 📦 Data kept in Fixtures (AAA Pattern)
export const ${camelName}Data = {
    // 🌍 Environment Variables
    env: {
${envProperties}
    },

    // 📊 Iteration Data — migrate CSV/JSON runner data here
    iterationData: ${iterationDataRows},

    samplePayload: {
        placeholder: true
    }
};

export type ${pascalName}Fixtures = {
    ${camelName}TestData: typeof ${camelName}Data;
};

export const test = base.extend<${pascalName}Fixtures>({
    ${camelName}TestData: async ({}, use) => {
        await use(${camelName}Data);
    }
});
export { expect } from '@playwright/test';
`;

    // ─────────────────────────────────────────
    // FILE 2: SERVICE (domain logic — per label/folder)
    // ─────────────────────────────────────────
    // Group snippets by label → each label = one Service class
    const labelGroups = new Map<string, typeof testSnippets>();
    testSnippets.forEach(snippet => {
        const label = snippet.label || 'General';
        if (!labelGroups.has(label)) labelGroups.set(label, []);
        labelGroups.get(label)!.push(snippet);
    });

    let needsFs = false;
    testSnippets.forEach(s => { if (s.action.includes('fs.')) needsFs = true; });

    const fsImport = needsFs ? "import * as fs from 'fs';\n" : '';
    const helperExtraImports = [
        needsMoment ? `import moment from 'moment';` : '',
        needsCheerio ? `import * as cheerio from 'cheerio';` : '',
        needsXml2js ? `import { parseStringPromise } from 'xml2js';` : '',
        extraImportsStr.trim() && !needsMoment && !needsCheerio && !needsXml2js ? extraImportsStr : '',
    ].filter(Boolean).join('\n');

    // Generate one *Service.ts per label group
    const serviceFiles: { path: string; content: string; className: string }[] = [];
    labelGroups.forEach((snippets, label) => {
        const serviceLabel = label === 'General' ? systemName : label;
        const serviceCamel = toCamelCase(serviceLabel);
        const servicePascal = toPascalCase(serviceLabel);
        const serviceClassName = `${servicePascal}Service`;

        let serviceMethods = '';
        snippets.forEach(snippet => {
            const methodName = toCamelCase(snippet.testName) + 'Request';
            const hasResponseDecl = /\bconst response\b/.test(snippet.action) || /\blet response\b/.test(snippet.action);
            const returnLine = hasResponseDecl ? '        return response;' : '        // TODO: return the response variable';
            serviceMethods += `
    /**
     * @description ${snippet.label} > ${snippet.testName}
     */
    async ${methodName}(data: any = {}): Promise<any> {
${snippet.action.split('\n').map(l => '        ' + l).join('\n')}
${returnLine}
    }
`;
        });

        const serviceContent =
            `${fsImport}import { APIRequestContext } from '@playwright/test';
${helperExtraImports ? helperExtraImports + '\n' : ''}
// ⚙️ Service: ${serviceLabel} — Business actions (endpoint-aware)
export class ${serviceClassName} {
    constructor(private readonly request: APIRequestContext) {}
${serviceMethods}
}
`;
        const servicePath = path.join(targetDir, helperDirName, kebabName, `${serviceCamel}Service.ts`);
        serviceFiles.push({ path: servicePath, content: serviceContent, className: serviceClassName });
    });

    // ─────────────────────────────────────────
    // FILE 2b: HELPER (entry point — composes Services)
    // ─────────────────────────────────────────
    const serviceImports = serviceFiles.map(sf =>
        `import { ${sf.className} } from './${path.basename(sf.path, '.ts')}';`
    ).join('\n');

    const serviceProperties = serviceFiles.map(sf => {
        const propName = toCamelCase(sf.className.replace(/Service$/, ''));
        return `    public readonly ${propName}: ${sf.className};`;
    }).join('\n');

    const serviceInits = serviceFiles.map(sf => {
        const propName = toCamelCase(sf.className.replace(/Service$/, ''));
        return `        this.${propName} = new ${sf.className}(request);`;
    }).join('\n');

    const helperFileContent =
        `import { APIRequestContext } from '@playwright/test';
${serviceImports}

// 🔌 Main Controller for ${systemName} — composes domain Services
export class ${pascalName}Helper {
${serviceProperties}

    constructor(request: APIRequestContext) {
${serviceInits}
    }
}
`;

    // ─────────────────────────────────────────
    // FILE 3: SPEC
    // ─────────────────────────────────────────

    // [FIX #10] stateStore declaration ถ้ามี parallel risk
    const anySerial = testSnippets.some(s => s.needsSerial);
    const anyStateStore = testSnippets.some(s => s.needsStateStore);
    const stateStoreDecl = anyStateStore
        ? `\n    // ⚠️ PARALLEL RISK: ใช้ stateStore สำหรับ shared runtime state\n    const stateStore: Record<string, string> = {};\n`
        : '';
    const describeDecorator = anySerial ? 'test.describe.serial' : 'test.describe';

    let specTestCases = '';

    testSnippets.forEach((snippet, index) => {
        const tcId = `[TC-${String(index + 1).padStart(4, '0')}]`;
        const methodName = toCamelCase(snippet.testName) + 'Request';
        const testTitle = `${tcId} ${snippet.testName}`;

        // [FIX #6] response snippet — check action + assertions combined
        const respSnippet = buildResponseSnippet(snippet.action, snippet.assertions);

        // [FIX #4] control flow comment
        const ctrlComment = snippet.hasControlFlow
            ? `\n        // ⚠️ [CONTROL_FLOW] Request มี setNextRequest — ตรวจสอบลำดับ test.step ด้วยมือ`
            : '';

        if (snippet.isDataDriven) {
            // [FIX #10] for...of แทน test.each เพื่อรองรับ await ใน loop
            const rowType = allIterationKeys.length > 0 ? iterationDataType : '{ placeholder: string }';
            specTestCases +=
                `
    // 📊 [DATA_DRIVEN] for...of loop — migrated from Postman Runner IterationData
    test('${testTitle}', async ({ request }) => {
        const helper = new ${pascalName}Helper(request);${ctrlComment}
        for (const data of ${camelName}Data.iterationData as ${rowType}[]) {
            await test.step(\`API: ${snippet.testName} — \${JSON.stringify(data)}\`, async () => {
                // 📝 Arrange: Prepare data from Fixtures (Do not hardcode here)
                // const reqData = data;

                // 🎬 Act: Execute the API call
                const response = await helper.${methodName}(data);

                // ✅ Assert: Status and Response validation
${respSnippet}
${snippet.assertions.split('\n').map(l => '                ' + l).join('\n')}
            });
        }
    });
`;
        } else {
            specTestCases +=
                `
    test('${testTitle}', async ({ request }) => {
        const helper = new ${pascalName}Helper(request);${ctrlComment}
        await test.step('API: ${snippet.testName}', async () => {
            // 📝 Arrange: Prepare data from Fixtures (Do not hardcode here)
            // const reqData = ${camelName}Data.samplePayload;

            // 🎬 Act: Execute the API call
            const response = await helper.${methodName}();

            // ✅ Assert: Status and Response validation
${respSnippet}
${snippet.assertions.split('\n').map(l => '                ' + l).join('\n')}
        });
    });
`;
        }
    });

    // stateStore beforeAll — init จาก process.env ถ้ามี stateStore
    const stateStoreBeforeAll = anyStateStore
        ? `\n    test.beforeAll(async () => {\n        // ⚠️ PARALLEL RISK: pre-seed stateStore from env if needed\n        // Object.assign(stateStore, { myVar: process.env['myVar'] || '' });\n    });\n`
        : '';

    // auto-import CollectionHelpers ถ้าถูกใช้
    const collHelperImport = needsCollectionHelpers
        ? `import { CollectionHelpers } from '../../${helperDir}/core/CollectionHelpers';\n`
        : '';

    const specFileContent =
        `import { test, expect } from '../../${fixtureDir}/${kebabName}/${camelName}Data';
import { ${pascalName}Helper } from '../../${helperDir}/${kebabName}/${camelName}Helper';
import { ${camelName}Data } from '../../${fixtureDir}/${kebabName}/${camelName}Data';
import { validate${pascalName}Response } from '../../${schemaDir}/${kebabName}/${camelName}Schema';
${collHelperImport}
// ───────────────────────────────────────────────
// ${systemName} API Spec
// ───────────────────────────────────────────────
${describeDecorator}('[PBI-0000] ${systemName} API Workflow @regression', () => {
${stateStoreDecl}${stateStoreBeforeAll}
    let testId: string;

    test.beforeEach(async ({ request }) => {
        testId = \`${systemName}_\${Date.now()}\`;
        // ⚠️ [DB STRATEGY]: Seed test data before each test
        // const helper = new ${pascalName}Helper(request);
        // await dbHelper.seed(testId, { ...${camelName}Data.samplePayload });
    });

    test.afterEach(async ({ request }) => {
        // ⚠️ [DB STRATEGY - SAFETY NET]: Always cleanup to prevent data leakage
        // Even if test crashes, this runs — ensuring DB stays clean
        // await dbHelper.cleanup(testId);
    });

${specTestCases}
});
`;

    // ─────────────────────────────────────────
    // FILE 4: SCHEMA (AJV)
    // ─────────────────────────────────────────
    const schemaFileContent =
`import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv({ allErrors: true });

// TODO: Replace with actual response shape
export interface ${pascalName}Response {
    // Add fields here
    [key: string]: unknown;
}

export const ${camelName}ResponseSchema: JSONSchemaType<${pascalName}Response> = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true,
} as JSONSchemaType<${pascalName}Response>;

export const validate${pascalName}Response = ajv.compile(${camelName}ResponseSchema);
`;

    // ─────────────────────────────────────────
    // FILE 5: COLLECTION HELPER
    // ─────────────────────────────────────────
    const helperHeader = `import { APIRequestContext } from '@playwright/test';
import * as crypto from 'crypto';
import { parseStringPromise } from 'xml2js';

/**
 * 💡 CoE Global Helpers
 * common functions migrated from Postman Collection Variables
 */
`;
    const finalCollectionHelper = collectionHelpersData
        ? `${helperHeader}\n${collectionHelpersData.replace('export const CollectionHelpers = {', 'export const CollectionHelpers = {\n    // 🔄 XML Wrapper for Postman compatibility\n    xml2Json: async (xml: string) => await parseStringPromise(xml),')}\n`
        : `${helperHeader}\nexport const CollectionHelpers = {};\n`;

    // ─────────────────────────────────────────
    // FILE EXPORT
    // ─────────────────────────────────────────
    function ensureAndWrite(fPath: string, content: string) {
        const cwd = process.cwd();
        const safePath = safeResolvePath(cwd, fPath);
        const dir = path.dirname(safePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(safePath, content, 'utf-8');
        console.log(`✅ Written: ${sanitizeLog(safePath)}`);
    }

    const inputDir = path.dirname(inputFile);
    const specPath       = path.join(inputDir, `${camelName}.spec.ts`);
    const helperPath     = path.join(targetDir, helperDir,  kebabName, `${camelName}Helper.ts`);
    const schemaPath     = path.join(targetDir, schemaDir,  kebabName, `${camelName}Schema.ts`);
    const fixturePath    = path.join(targetDir, fixtureDir, kebabName, `${camelName}Data.ts`);
    const collHelperPath = path.join(targetDir, helperDir,  'core',    'CollectionHelpers.ts');

    // Summary
    const serialCount = testSnippets.filter(s => s.needsSerial).length;
    const dataDrivenCount = testSnippets.filter(s => s.isDataDriven).length;

    // ── Before ──
    console.log('\n=========================================');
    console.log(`🤖 ${systemName}`);
    console.log('=========================================');
    console.log(`   Test blocks   : ${testSnippets.length}`);
    console.log(`   Data-driven   : ${dataDrivenCount}`);
    console.log(`   Serial        : ${serialCount}`);
    console.log(`   Services      : ${serviceFiles.length}`);
    console.log(`   Iteration keys: ${sanitizeLog(allIterationKeys.join(', ') || 'none')}`);
    console.log('\n📄 Generating:');
    console.log(`   Fixture : ${sanitizeLog(fixturePath)}`);
    serviceFiles.forEach(sf => console.log(`   Service : ${sanitizeLog(sf.path)}`));
    console.log(`   Helper  : ${sanitizeLog(helperPath)}`);
    console.log(`   Schema  : ${sanitizeLog(schemaPath)}`);
    console.log(`   Spec    : ${sanitizeLog(specPath)}`);
    if (collectionHelpersData) console.log(`   Core    : ${sanitizeLog(collHelperPath)}`);

    // ── Write ──
    const written: string[] = [];
    const failed: string[] = [];
    function tryWrite(fPath: string, content: string) {
        try {
            ensureAndWrite(fPath, content);
            written.push(path.basename(fPath));
        } catch (e: any) {
            failed.push(path.basename(fPath));
            console.error(`❌ Failed to write ${sanitizeLog(fPath)}: ${sanitizeLog(e.message)}`);
        }
    }
    tryWrite(fixturePath, dataFileContent);
    serviceFiles.forEach(sf => tryWrite(sf.path, sf.content));
    tryWrite(helperPath, helperFileContent);
    tryWrite(schemaPath, schemaFileContent);
    tryWrite(specPath, specFileContent);
    if (collectionHelpersData) tryWrite(collHelperPath, finalCollectionHelper);

    // ── After ──
    console.log('\n=========================================');
    console.log(`✅ Done: ${systemName}`);
    console.log('=========================================');
    if (written.length > 0) console.log(`   PASS (${written.length}): ${written.join(', ')}`);
    if (failed.length > 0)  console.log(`   FAIL (${failed.length}): ${failed.join(', ')}`);
    console.log('=========================================');
}

// ───────────────────────────────────────────────
// MAIN EXECUTION
// ───────────────────────────────────────────────
(async () => {
    // [SECURITY] validate top-level input paths
    try {
        const cwd = process.cwd();
        safeResolvePath(cwd, inputPath);
        if (envInputFile) safeResolvePath(cwd, envInputFile);
        safeResolvePath(cwd, baseOutputDir);
    } catch (e: any) {
        console.error(`❌ ${sanitizeLog(e.message)}`);
        process.exit(1);
    }

    if (!fs.existsSync(inputPath)) {
        console.error(`❌ Path not found: ${sanitizeLog(inputPath)}`);
        process.exit(1);
    }

    const stats = fs.statSync(inputPath);
    if (stats.isDirectory()) {
        console.log(`📂 Scanning directory: ${sanitizeLog(inputPath)}`);
        const files = fs.readdirSync(inputPath);

        const folderName = path.basename(inputPath);
        const primaryMd = files.find(f => f.toLowerCase() === `${folderName.toLowerCase()}.md`);

        if (primaryMd) {
            const fullPath = path.join(inputPath, primaryMd);
            let localEnvInput = envInputFile;
            if (!localEnvInput) {
                const envFile = files.find(f => f.toLowerCase().includes('.env.md') || f.toLowerCase() === 'env.md' || f.toLowerCase().includes('environment.md'));
                if (envFile) localEnvInput = path.join(inputPath, envFile);
            }
            await processFile(fullPath, localEnvInput, baseOutputDir);
        } else {
            const mdFiles = files.filter(f => f.endsWith('.md') && !f.toLowerCase().includes('.env.md') && f.toLowerCase() !== 'readme.md');
            if (mdFiles.length === 0) {
                console.error(`❌ No markdown files found in ${sanitizeLog(inputPath)}`);
            } else {
                for (const file of mdFiles) {
                    const fullPath = path.join(inputPath, file);
                    await processFile(fullPath, envInputFile, baseOutputDir);
                }
            }
        }
    } else {
        await processFile(inputPath, envInputFile, baseOutputDir);
    }
})().catch(err => {
    console.error('❌ Error during execution:', err);
    process.exit(1);
});