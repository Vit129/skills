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
 * @version 7.0 - Auto-Split Per Folder + Skeleton Assertions
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
 * @fixes-v6
 *  14. [ENV_DECL]     Fix env declaration stripping — handle `const x: type = ...` with type annotations
 *  15. [DEDUP]        Dedup duplicate method names — append _2, _3 suffix for same-name methods
 *  16. [UNDECL_VARS]  Auto-declare url, dynamicHeaders, requestBody when used but not declared in Service
 *  17. [SPEC_ROUTE]   Spec calls helper.serviceProp.method() instead of helper.method() (match Helper pattern)
 *  18. [CHAI_ASSERT]  40+ Chai→Playwright assertion transforms (pm.expect → expect)
 *  19. [FOREACH]      forEach + await → for...of loop (prevent SyntaxError)
 *  20. [JSONDATA]     Auto-declare jsonData, actualData when used but not declared
 * @fixes-v7
 *  21. [AUTO_SPLIT]   Auto-detect ## 📁 Folder headers → generate 1 spec + 1 service per top-level folder
 *  22. [SKELETON]     --skeleton flag → generate clean assertion skeletons instead of raw copied code
 *  23. [FOLDER_LABEL] extractTestBlocks now tracks folder context from markdown headers
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
const inputArgPath = inputIndex !== -1 && args[inputIndex + 1] ? args[inputIndex + 1] : null;

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

// ───────────────────────────────────────────────
// [v7.3] AUTO-DETECT --input from tests-api/ folders
// ───────────────────────────────────────────────
function findProjectRootMd(start: string): string | null {
    let dir = start;
    while (true) {
        if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
        const parent = path.dirname(dir);
        if (parent === dir) return null;
        dir = parent;
    }
}

// ───────────────────────────────────────────────
// KNOWLEDGE ROOT RESOLVER
// Supports any prefix: ~/.claude/skills/knowledge, ~/ai-agent/skills/knowledge, etc.
// Pattern: {anything}/skills/knowledge/
// ───────────────────────────────────────────────
function findKnowledgeRoot(start: string): string {
    // 1. Walk up from cwd looking for skills/knowledge/
    let dir = start;
    while (true) {
        const candidate = path.join(dir, 'skills', 'knowledge');
        if (fs.existsSync(candidate)) return candidate;
        const parent = path.dirname(dir);
        if (parent === dir) break;
        dir = parent;
    }
    // 2. Fallback: ~/.claude/skills/ai-dlc/knowledge
    const homeDefault = path.join(process.env.HOME ?? '~', '.claude', 'skills', 'ai-dlc', 'knowledge');
    if (fs.existsSync(homeDefault)) return homeDefault;
    // 3. Last resort: relative to script location
    return path.join(__dirname, '..', '..', '..', 'knowledge');
}

const KNOWLEDGE_ROOT = findKnowledgeRoot(process.cwd());
const KNOWLEDGE_API_INDEX = path.join(KNOWLEDGE_ROOT, 'automation', 'api', 'apiIndex.json');

async function resolveInputPath(): Promise<string> {
    if (inputArgPath) return inputArgPath;

    const root = findProjectRootMd(process.cwd()) ?? process.cwd();
    const testsApiDir = path.join(root, specDirName);

    if (!fs.existsSync(testsApiDir)) {
        console.error(`❌ --input is required (tests-api/ not found at ${sanitizeLog(testsApiDir)})`);
        process.exit(1);
    }

    const folders = fs.readdirSync(testsApiDir)
        .filter(f => fs.statSync(path.join(testsApiDir, f)).isDirectory());

    if (folders.length === 0) {
        console.error(`❌ --input is required (no folders found in ${sanitizeLog(testsApiDir)})`);
        process.exit(1);
    }

    if (folders.length === 1) {
        const auto = path.join(testsApiDir, folders[0]);
        console.log(`\n📂 Auto-detected --input: ${sanitizeLog(auto)}`);
        return auto;
    }

    // Multiple folders — interactive select
    const { select } = await import('@inquirer/prompts');
    const selected = await select({
        message: '📂 Select collection folder for --input (Use Arrow Keys):',
        pageSize: 15,
        choices: folders.map((f, i) => ({ name: `Option ${i + 1}: ${f}`, value: f })),
    });
    return path.join(testsApiDir, selected);
}

const specDirName    = specDirIdx    !== -1 && args[specDirIdx    + 1] ? args[specDirIdx    + 1] : workflowStructure.specDir;
const helperDirName  = helperDirIdx  !== -1 && args[helperDirIdx  + 1] ? args[helperDirIdx  + 1] : workflowStructure.helperDir;
const schemaDirName  = schemaDirIdx  !== -1 && args[schemaDirIdx  + 1] ? args[schemaDirIdx  + 1] : workflowStructure.schemaDir;
const fixtureDirName = fixtureDirIdx !== -1 && args[fixtureDirIdx + 1] ? args[fixtureDirIdx + 1] : workflowStructure.fixtureDir;

// [v7.0] --skeleton: generate clean assertion skeletons instead of raw copied code
const skeletonMode = args.includes('--skeleton');
// [v7.0] --no-split: disable auto-split (legacy single-file mode)
const noSplitMode = args.includes('--no-split');

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
const KNOWLEDGE_PATH = KNOWLEDGE_API_INDEX;
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
// [FIX #23] Now tracks folder context from ## 📁 / ### 📁 headers
// ───────────────────────────────────────────────
interface TestBlock {
    label: string;       // folder path (e.g. "SearchData > Success")
    testName: string;    // request name
    fullBody: string;    // entire body
    topFolder: string;   // top-level folder (e.g. "AMFW01000")
    subFolder: string;   // sub-folder path (e.g. "SearchData > Success")
    endpoint: string;    // endpoint URL if detected
    httpMethod: string;  // HTTP method if detected
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

    // [FIX #23] Track folder hierarchy from markdown headers
    let currentTopFolder = 'General';    // ## 📁 Folder: XXX
    let currentSubFolders: string[] = []; // ### 📁, #### 📁, ##### 📁
    let currentEndpoint = '';
    let currentHttpMethod = '';

    for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const line = lines[lineIdx];

        // [FIX #23] Detect folder headers: ## 📁 Folder: NAME
        const folderMatch = line.match(/^(#{2,6})\s+📁\s+Folder:\s*(.+?)(?:\s*-\s*.+)?$/);
        if (folderMatch) {
            const level = folderMatch[1].length; // 2=##, 3=###, 4=####, etc.
            const folderName = folderMatch[2].trim();

            if (level === 2) {
                // Top-level folder (e.g. "AMFW01000")
                currentTopFolder = folderName;
                currentSubFolders = [];
            } else {
                // Sub-folder — truncate stack to current depth then push
                const subIdx = level - 3; // ### = 0, #### = 1, ##### = 2
                currentSubFolders = currentSubFolders.slice(0, subIdx);
                currentSubFolders.push(folderName);
            }
            continue;
        }

        // Detect endpoint from markdown: **Endpoint:** `POST {{url}}/path`
        const endpointMatch = line.match(/\*\*Endpoint:\*\*\s*`(\w+)\s+(.+?)`/);
        if (endpointMatch) {
            currentHttpMethod = endpointMatch[1].toUpperCase();
            currentEndpoint = endpointMatch[2].trim();
        }

        if (!insideBlock) {
            const headerMatch = line.match(/^test\(['"`](.+?)['"`],\s*async/);
            if (headerMatch) {
                const fullName = headerMatch[1];
                if (fullName.includes(' > ')) {
                    const parts = fullName.split(' > ');
                    currentName = parts.pop() || '';
                    currentLabel = parts.join(' > ');
                } else {
                    // [FIX #23] Use sub-folder path as label instead of 'General'
                    currentLabel = currentSubFolders.length > 0
                        ? currentSubFolders.join(' > ')
                        : 'General';
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
                blocks.push({
                    label: currentLabel,
                    testName: currentName,
                    fullBody: currentLines.join('\n'),
                    topFolder: currentTopFolder,
                    subFolder: currentSubFolders.join(' > ') || 'General',
                    endpoint: currentEndpoint,
                    httpMethod: currentHttpMethod,
                });
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

    // ─────────────────────────────────────────
    // [FIX #18] Chai → Playwright assertion transforms
    // ─────────────────────────────────────────
    // pm.response.to.have.status(200) → expect(response.status()).toBe(200)
    t = t.replace(/pm\.response\.to\.have\.status\((\d+)\)/g, 'expect(response.status()).toBe($1)');

    // pm.expect(x).to.be.eql(y) → expect(x).toEqual(y)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.eql\((.+?)\)/g, 'expect($1).toEqual($2)');

    // pm.expect(x).to.eql(y) → expect(x).toEqual(y)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.eql\((.+?)\)/g, 'expect($1).toEqual($2)');

    // pm.expect(x).to.equal(y) → expect(x).toBe(y)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.equal\((.+?)\)/g, 'expect($1).toBe($2)');

    // pm.expect(x).to.be.true → expect(x).toBe(true)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.true/g, 'expect($1).toBe(true)');

    // pm.expect(x).to.be.false → expect(x).toBe(false)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.false/g, 'expect($1).toBe(false)');

    // pm.expect(x).to.be.null → expect(x).toBeNull()
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.null/g, 'expect($1).toBeNull()');

    // pm.expect(x).to.be.not.null → expect(x).not.toBeNull()
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.not\.null/g, 'expect($1).not.toBeNull()');

    // pm.expect(x).to.not.be.null → expect(x).not.toBeNull()
    t = t.replace(/pm\.expect\((.+?)\)\.to\.not\.be\.null/g, 'expect($1).not.toBeNull()');

    // pm.expect(x).to.be.undefined → expect(x).toBeUndefined()
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.undefined/g, 'expect($1).toBeUndefined()');

    // pm.expect(x).to.be.a('string') → expect(typeof x).toBe('string')
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.a\(['"](\w+)['"]\)/g, "expect(typeof $1).toBe('$2')");

    // pm.expect(x).to.be.an('array') → expect(Array.isArray(x)).toBe(true)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.an\(['"]array['"]\)/g, 'expect(Array.isArray($1)).toBe(true)');

    // pm.expect(x).to.have.property('y') → expect(x).toHaveProperty('y')
    t = t.replace(/pm\.expect\((.+?)\)\.to\.have\.property\((.+?)\)/g, 'expect($1).toHaveProperty($2)');

    // pm.expect(x).to.include(y) → expect(x).toContain(y)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.include\((.+?)\)/g, 'expect($1).toContain($2)');

    // pm.expect(x).to.have.lengthOf(n) → expect(x).toHaveLength(n)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.have\.lengthOf\((.+?)\)/g, 'expect($1).toHaveLength($2)');

    // pm.expect(x).to.be.above(n) → expect(x).toBeGreaterThan(n)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.above\((.+?)\)/g, 'expect($1).toBeGreaterThan($2)');

    // pm.expect(x).to.be.below(n) → expect(x).toBeLessThan(n)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.below\((.+?)\)/g, 'expect($1).toBeLessThan($2)');

    // pm.expect(x).to.be.at.least(n) → expect(x).toBeGreaterThanOrEqual(n)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.at\.least\((.+?)\)/g, 'expect($1).toBeGreaterThanOrEqual($2)');

    // pm.expect(x).to.be.at.most(n) → expect(x).toBeLessThanOrEqual(n)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.be\.at\.most\((.+?)\)/g, 'expect($1).toBeLessThanOrEqual($2)');

    // pm.expect(x).to.have.length.above(0) → expect(x.length).toBeGreaterThan(0)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.have\.length\.above\((.+?)\)/g, 'expect($1.length).toBeGreaterThan($2)');

    // pm.expect(x).to.not.be.empty → expect(x.length).toBeGreaterThan(0)
    t = t.replace(/pm\.expect\((.+?)\)\.to\.not\.be\.empty/g, 'expect($1.length).toBeGreaterThan(0)');

    // Catch-all: remaining pm.expect(x).to.be.xxx → comment for manual fix
    t = t.replace(/pm\.expect\((.+?)\)\.(to\.[\w.]+(?:\(.+?\))?)/g, '/* ⚠️ Manual: pm.expect($1).$2 */');

    // pm.response.json() → responseJson (already declared in spec)
    t = t.replace(/pm\.response\.json\(\)/g, 'responseJson');

    // pm.response.text() → responseText
    t = t.replace(/pm\.response\.text\(\)/g, 'responseText');

    // pm.response.code → response.status()
    t = t.replace(/pm\.response\.code/g, 'response.status()');

    // pm.response.headers → response.headers()
    t = t.replace(/pm\.response\.headers/g, 'response.headers()');

    // Strip Chai chaining leftovers: .that.is.not.empty, .that.has.lengthOf(0), etc.
    t = t.replace(/\.that\.is\.not\.empty/g, '');
    t = t.replace(/\.that\.has\.lengthOf\((\d+)\)/g, '');
    t = t.replace(/\.that\.is\.an?\(['"](\w+)['"]\)/g, '');
    // [FIX #21] Additional Chai chaining leftovers after Playwright assertions
    t = t.replace(/\.that\.is\.empty/g, '');
    t = t.replace(/\.and\.not\.empty/g, '');
    t = t.replace(/\.above\((\d+)\)/g, '');
    t = t.replace(/\.with\.lengthOf\((\d+)\)/g, '');
    t = t.replace(/\.and\.not\.be\.empty/g, '');

    // ─────────────────────────────────────────
    // [FIX #19] forEach + await → for...of
    // ─────────────────────────────────────────
    // Pattern: xxx.forEach(item => { ... await ... }) or xxx.forEach(async (item) => { ... })
    t = t.replace(
        /(\w[\w.[\]]*?)\.forEach\s*\(\s*(?:async\s+)?\(?(\w+)\)?\s*=>\s*\{/g,
        'for (const $2 of $1) {'
    );
    // Handle: xxx.forEach((item, index) => { — 2 params (keep index as let)
    t = t.replace(
        /(\w[\w.[\]]*?)\.forEach\s*\(\s*(?:async\s+)?\((\w+)\s*,\s*(\w+)\)\s*=>\s*\{/g,
        'for (const [$2, $3] of $1.entries()) {'
    );
    // Also handle: xxx.forEach(function(item) { or xxx.forEach(async function(item) {
    t = t.replace(
        /(\w[\w.[\]]*?)\.forEach\s*\(\s*(?:async\s+)?function\s*\(\s*(\w+)\s*\)\s*\{/g,
        'for (const $2 of $1) {'
    );
    // Handle: xxx.forEach(function(item, index) {
    t = t.replace(
        /(\w[\w.[\]]*?)\.forEach\s*\(\s*(?:async\s+)?function\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)\s*\{/g,
        'for (const [$2, $3] of $1.entries()) {'
    );

    // ─────────────────────────────────────────
    // [FIX #20] jsonData → declare from responseJson
    // ─────────────────────────────────────────
    // If code uses `jsonData` but doesn't declare it, add declaration
    if (/\bjsonData\b/.test(t) && !/\b(?:const|let|var)\s+jsonData\b/.test(t)) {
        // Replace first bare assignment `jsonData = responseJson;` with `let jsonData = responseJson;`
        if (/jsonData\s*=\s*responseJson/.test(t)) {
            t = t.replace(/jsonData\s*=\s*responseJson/, 'let jsonData = responseJson');
        } else {
            // Add declaration at the top
            t = 'let jsonData: any;\n' + t;
        }
    }

    // [FIX #20b] actualData → declare if undeclared
    if (/\bactualData\b/.test(t) && !/\b(?:const|let|var)\s+actualData\b/.test(t)) {
        if (/actualData\s*=/.test(t)) {
            t = t.replace(/actualData\s*=/, 'let actualData =');
        } else {
            t = 'let actualData: any;\n' + t;
        }
    }

    // [FIX #20c] requestBody → declare if undeclared (used in assertions like JSON.parse(requestBody))
    if (/\brequestBody\b/.test(t) && !/\b(?:const|let|var)\s+requestBody\b/.test(t)) {
        t = 'const requestBody = JSON.stringify(data.body ?? data);\n' + t;
    }

    // [FIX #20d] iuserConvertTestData / xxxTestData → these come from fixture but spec doesn't destructure
    // Replace bare iuserConvertTestData with fixture import reference
    // (This is handled at spec level, not here)

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
// [v7.0] SKELETON ASSERTION BUILDER
// ───────────────────────────────────────────────
function buildSkeletonAssertions(snippet: { action: string; assertions: string; testName: string; httpMethod: string; endpoint: string }): string {
    const combined = snippet.action + '\n' + snippet.assertions;

    // Detect response type from original code
    const needsJson = combined.includes('responseJson') || combined.includes('.json()') || combined.includes('jsonData');
    const needsText = combined.includes('responseText') || combined.includes('.text()');

    // Detect status code from original assertions
    const statusMatch = combined.match(/expect\(response\.status\(\)\)\.toBe\((\d+)\)/);
    const expectedStatus = statusMatch ? statusMatch[1] : '200';

    // Count original assertion lines to give a hint
    const assertionLineCount = snippet.assertions.split('\n').filter(l => l.trim().includes('expect(')).length;

    const lines: string[] = [];
    lines.push(`                await test.step('Status code is ${expectedStatus}', async () => {`);
    lines.push(`                    expect(response.status()).toBe(${expectedStatus});`);
    lines.push(`                });`);

    if (needsJson) {
        lines.push(`                await test.step('Response body validation', async () => {`);
        lines.push(`                    const responseJson = await response.json();`);
        lines.push(`                    // TODO: Add assertions (~${assertionLineCount} from Postman)`);
        lines.push(`                    expect(responseJson).toBeTruthy();`);
        lines.push(`                });`);
    } else if (needsText) {
        lines.push(`                await test.step('Response body validation', async () => {`);
        lines.push(`                    const responseText = await response.text();`);
        lines.push(`                    // TODO: Add assertions (~${assertionLineCount} from Postman)`);
        lines.push(`                    expect(responseText).toBeTruthy();`);
        lines.push(`                });`);
    }

    return lines.join('\n');
}

// ───────────────────────────────────────────────
// [v7.0] GROUP BLOCKS BY TOP-LEVEL FOLDER
// ───────────────────────────────────────────────
interface FolderGroup {
    topFolder: string;       // e.g. "AMFW01000"
    blocks: TestBlock[];     // all test blocks in this folder
    subFolders: string[];    // unique sub-folder names
}

function groupByTopFolder(blocks: TestBlock[]): FolderGroup[] {
    const map = new Map<string, TestBlock[]>();
    const order: string[] = [];

    for (const block of blocks) {
        const key = block.topFolder || 'General';
        if (!map.has(key)) {
            map.set(key, []);
            order.push(key);
        }
        map.get(key)!.push(block);
    }

    return order.map(key => {
        const folderBlocks = map.get(key)!;
        const subFolders = [...new Set(folderBlocks.map(b => b.subFolder).filter(s => s && s !== 'General'))];
        return { topFolder: key, blocks: folderBlocks, subFolders };
    });
}

// ───────────────────────────────────────────────
// [v7.0] PROCESS FOLDER GROUP — generates 1 spec + services per top-level folder
// ───────────────────────────────────────────────
interface FolderGroupContext {
    group: FolderGroup;
    inputFile: string;
    targetDir: string;
    kebabName: string;              // parent collection kebab name
    collectionSystemName: string;   // parent collection system name
    envMarkdownRaw: string;
    markdownRaw: string;
    collectionHelpersData: string;
    extraImports: string[];
    extraImportsStr: string;
    needsCollectionHelpers: boolean;
    needsXml2js: boolean;
    needsCrypto: boolean;
    needsCheerio: boolean;
    needsMoment: boolean;
    helperDir: string;
    schemaDir: string;
    fixtureDir: string;
}

async function processFolderGroup(ctx: FolderGroupContext) {
    const { group, inputFile, targetDir, kebabName: parentKebab } = ctx;
    const { helperDir, schemaDir, fixtureDir } = ctx;

    // Naming: use topFolder as the system name for this split
    const folderSystemName = group.topFolder;
    const folderKebab = toKebabCase(folderSystemName) || 'api-feature';
    const folderCamel = toCamelCase(folderSystemName);
    const folderPascal = toPascalCase(folderSystemName);

    // Output under parent kebab folder: tests-api/<parentKebab>/<folderKebab>.spec.ts
    const specSubDir = path.join(path.dirname(inputFile), folderKebab);

    console.log(`\n📦 Processing folder: ${sanitizeLog(folderSystemName)} (${group.blocks.length} requests)`);

    // ─────────────────────────────────────────
    // Parse blocks into snippets
    // ─────────────────────────────────────────
    interface SplitSnippet {
        label: string;
        testName: string;
        action: string;
        assertions: string;
        isDataDriven: boolean;
        iterationKeys: string[];
        needsSerial: boolean;
        needsStateStore: boolean;
        hasControlFlow: boolean;
        endpoint: string;
        httpMethod: string;
    }

    const testSnippets: SplitSnippet[] = group.blocks.map(block => {
        const body = block.fullBody;

        const actionMatch = body.match(
            /\/\/ ━━━ 🎬 Action ━━━\s*([\s\S]+?)(?=\/\/ ━━━ ✅ Assertions|\/\/ ━━━|$)/
        );
        const assertMatch = body.match(
            /\/\/ ━━━ ✅ Assertions ━━━\s*([\s\S]+?)(?=\}\);?\s*$|$)/
        );

        let action = actionMatch ? actionMatch[1].trim() : '// TODO: Action';
        let assertions = assertMatch ? assertMatch[1].trim() : '// TODO: Assertions';

        action = transformAdvancedLogic(action, folderCamel);
        assertions = transformAdvancedLogic(assertions, folderCamel);

        const iterationKeys = extractIterationKeys(body);
        const isDataDriven = iterationKeys.length > 0 || body.includes('pm.iterationData');
        const needsStateStore = detectStateStore(body);
        const hasControlFlow = body.includes('setNextRequest') || body.includes('CONTROL_FLOW');
        const needsSerial = needsStateStore || hasControlFlow;

        return {
            // [v7.1 FIX] Use only first sub-folder level as service grouping key
            // e.g. "SearchData > Success > ค้นหา..." → "SearchData"
            label: (block.subFolder || block.label || 'General').split(' > ')[0],
            testName: block.testName,
            action,
            assertions,
            isDataDriven,
            iterationKeys,
            needsSerial,
            needsStateStore,
            hasControlFlow,
            endpoint: block.endpoint,
            httpMethod: block.httpMethod,
        };
    });

    // ─────────────────────────────────────────
    // ENV PARSING (reuse from parent context)
    // ─────────────────────────────────────────
    const extractedEnvKeys: Record<string, string> = {};
    if (ctx.envMarkdownRaw) {
        const dotEnvMatch = ctx.envMarkdownRaw.match(
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

    const machineDecls: Record<string, string> = {};
    if (ctx.envMarkdownRaw) {
        const machineMatch = ctx.envMarkdownRaw.match(
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

    const playwrightDecls: Record<string, string> = {};
    if (ctx.envMarkdownRaw && Object.keys(machineDecls).length === 0) {
        const pwDeclMatch = ctx.envMarkdownRaw.match(
            /## 🎭 Playwright Variable Declarations[\s\S]*?```typescript\n([\s\S]*?)\n```/
        );
        if (pwDeclMatch) {
            pwDeclMatch[1].split('\n').forEach(line => {
                const declMatch = line.match(/^const\s+\w+\s*=.*process\.env\['([^']+)'\]/);
                if (declMatch) playwrightDecls[declMatch[1]] = line.trim();
            });
        }
    }

    const allEnvDecls: Record<string, string> = { ...playwrightDecls, ...machineDecls };
    const envEntries: string[] = [];
    const allEnvKeys = new Set([...Object.keys(extractedEnvKeys), ...Object.keys(allEnvDecls)]);

    allEnvKeys.forEach(k => {
        const rawVal = extractedEnvKeys[k];
        const decl = allEnvDecls[k];
        if (decl) {
            const valExpr = decl.replace(/^const\s+\w+\s*(?::\s*\S+\s*)?=\s*/, '').replace(/;.*$/, '').trim();
            envEntries.push(`        ${getSafeVarName(k)}: ${valExpr},`);
        } else if (rawVal !== undefined) {
            envEntries.push(`        ${k}: ${rawVal ? JSON.stringify(rawVal) : '""'},`);
        }
    });

    const envProperties = envEntries.length > 0
        ? envEntries.join('\n')
        : `        // No environment variables found\n        placeholder: true`;

    const allIterationKeys = [...new Set(testSnippets.flatMap(s => s.iterationKeys))];
    const iterationInterface = allIterationKeys.length > 0
        ? `\nexport interface ${folderPascal}IterationRow {\n` +
          allIterationKeys.map(k => `    ${k}: string; // TODO: update type`).join('\n') +
          '\n}\n'
        : '';
    const iterationDataType = allIterationKeys.length > 0 ? `${folderPascal}IterationRow` : '{ placeholder: string }';
    const iterationDataRows = allIterationKeys.length > 0
        ? `[\n        // TODO: fill iteration rows — keys: ${allIterationKeys.join(', ')}\n        { ${allIterationKeys.map(k => `${k}: ''`).join(', ')} },\n    ]`
        : `[\n        { placeholder: 'value1' },\n    ]`;

    // ─────────────────────────────────────────
    // FILE 1: DATA FIXTURE
    // ─────────────────────────────────────────
    const fixtureExtraImports = [
        ctx.needsCrypto ? `import * as crypto from 'crypto';` : '',
    ].filter(Boolean).join('\n');

    const dataFileContent = [
        `import { test as base } from '@playwright/test';`,
        fixtureExtraImports,
        iterationInterface.trimEnd(),
    ].filter(Boolean).join('\n') + `
// 📦 Data kept in Fixtures (AAA Pattern)
export const ${folderCamel}Data = {
    env: {
${envProperties}
    },
    iterationData: ${iterationDataRows},
    samplePayload: {
        placeholder: true
    }
};

export type ${folderPascal}Fixtures = {
    ${folderCamel}TestData: typeof ${folderCamel}Data;
};

export const test = base.extend<${folderPascal}Fixtures>({
    ${folderCamel}TestData: async ({}, use) => {
        await use(${folderCamel}Data);
    }
});
export { expect } from '@playwright/test';
`;

    // ─────────────────────────────────────────
    // FILE 2: SERVICES (per sub-folder label)
    // ─────────────────────────────────────────
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
        ctx.needsMoment ? `import moment from 'moment';` : '',
        ctx.needsCheerio ? `import * as cheerio from 'cheerio';` : '',
        ctx.needsXml2js ? `import { parseStringPromise } from 'xml2js';` : '',
    ].filter(Boolean).join('\n');

    const serviceFiles: { path: string; content: string; className: string }[] = [];

    labelGroups.forEach((snippets, label) => {
        const serviceLabel = label === 'General' ? folderSystemName : label;
        const serviceCamel = toCamelCase(serviceLabel);
        const servicePascal = toPascalCase(serviceLabel);
        const serviceClassName = `${servicePascal}Service`;

        let serviceMethods = '';
        const methodNameCounts = new Map<string, number>();
        const needsCollHelperInService = snippets.some(s =>
            s.action.includes('CollectionHelpers.') || s.assertions.includes('CollectionHelpers.')
        );

        snippets.forEach(snippet => {
            let methodName = toCamelCase(snippet.testName) + 'Request';

            const count = methodNameCounts.get(methodName) || 0;
            methodNameCounts.set(methodName, count + 1);
            if (count > 0) methodName = `${methodName}_${count + 1}`;

            // [v7.0 SKELETON] — generate clean method with only the HTTP call
            if (skeletonMode) {
                const method = (snippet.httpMethod || 'post').toLowerCase();
                const endpointHint = snippet.endpoint
                    ? `'${snippet.endpoint}'`
                    : `data.endpoint || ''`;

                serviceMethods += `
    /**
     * @description ${snippet.label} > ${snippet.testName}
     * @endpoint ${snippet.httpMethod || 'POST'} ${snippet.endpoint || 'TODO'}
     */
    async ${methodName}(data: any = {}): Promise<any> {
        const url = data.endpoint || ${endpointHint};
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...data.headers,
        };
        const response = await this.request.${method}(url, {
            headers,
            ${method !== 'get' && method !== 'delete' ? 'data: data.body ?? data,' : ''}
        });
        return response;
    }
`;
            } else {
                // Full mode — existing logic
                let actionInClass = snippet.action
                    .replace(/(?<![.\w])request\.(get|post|put|patch|delete|head|fetch|dispose|storageState)\b/g, 'this.request.$1');

                const httpMethodMatch = actionInClass.match(/this\.request\.(get|post|put|patch|delete)\s*\(/);
                const httpMethod = httpMethodMatch ? httpMethodMatch[1] : 'post';

                const usesUrl = /\burl\b/.test(actionInClass) && !/\b(?:const|let|var)\s+url\b/.test(actionInClass);
                const usesDynamicHeaders = /\bdynamicHeaders\b/.test(actionInClass) && !/\b(?:const|let|var)\s+dynamicHeaders\b/.test(actionInClass);
                const usesRequestBody = /\brequestBody\b/.test(actionInClass) && !/\b(?:const|let|var)\s+requestBody\b/.test(actionInClass);

                const varDecls: string[] = [];
                if (usesUrl) varDecls.push(`const url = new URL(data.endpoint || '', data.baseUrl || process.env['BASE_URL'] || '');`);
                if (usesDynamicHeaders) varDecls.push(`const dynamicHeaders: Record<string, string> = {\n            'Content-Type': 'application/json',\n            ...data.headers,\n        };`);
                if (usesRequestBody) varDecls.push(`const requestBody = data.body ?? data;`);
                if (varDecls.length > 0) actionInClass = varDecls.map(d => '  ' + d).join('\n') + '\n' + actionInClass;

                const hasResponseDecl = /\bconst response\b/.test(actionInClass) || /\blet response\b/.test(actionInClass);
                const returnLine = hasResponseDecl ? '        return response;' : '        // TODO: return the response variable';

                serviceMethods += `
    /**
     * @description ${snippet.label} > ${snippet.testName}
     */
    async ${methodName}(data: any = {}): Promise<any> {
${actionInClass.split('\n').map(l => '        ' + l).join('\n')}
${returnLine}
    }
`;
            }
        });

        const collHelperServiceImport = needsCollHelperInService && !skeletonMode
            ? `import { CollectionHelpers } from '../core/CollectionHelpers';\n`
            : '';

        const serviceContent =
            `${fsImport}import { APIRequestContext } from '@playwright/test';
${helperExtraImports ? helperExtraImports + '\n' : ''}${collHelperServiceImport}
// ⚙️ Service: ${serviceLabel} — Business actions (endpoint-aware)
export class ${serviceClassName} {
    constructor(private readonly request: APIRequestContext) {}
${serviceMethods}
}
`;
        const servicePath = path.join(targetDir, helperDir, parentKebab, folderKebab, `${serviceCamel}Service.ts`);
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

// 🔌 Main Controller for ${folderSystemName} — composes domain Services
export class ${folderPascal}Helper {
${serviceProperties}

    constructor(request: APIRequestContext) {
${serviceInits}
    }
}
`;

    // ─────────────────────────────────────────
    // FILE 3: SPEC
    // ─────────────────────────────────────────
    const anySerial = testSnippets.some(s => s.needsSerial);
    const anyStateStore = testSnippets.some(s => s.needsStateStore);
    const stateStoreDecl = anyStateStore
        ? `\n    // ⚠️ PARALLEL RISK: ใช้ stateStore สำหรับ shared runtime state\n    const stateStore: Record<string, string> = {};\n`
        : '';
    const describeDecorator = anySerial ? 'test.describe.serial' : 'test.describe';

    let specTestCases = '';
    // [v7.2 FIX] Per-service dedup counter — must match service method naming exactly
    const specMethodNameCountsPerService = new Map<string, Map<string, number>>();

    testSnippets.forEach((snippet, index) => {
        const tcId = `[TC-${String(index + 1).padStart(4, '0')}]`;
        let methodName = toCamelCase(snippet.testName) + 'Request';

        const snippetLabel = snippet.label || 'General';
        const serviceLabel = snippetLabel === 'General' ? folderSystemName : snippetLabel;
        const servicePropName = toCamelCase(toPascalCase(serviceLabel).replace(/Service$/, ''));

        // Per-service counter — matches how service file generates method names
        if (!specMethodNameCountsPerService.has(servicePropName)) {
            specMethodNameCountsPerService.set(servicePropName, new Map());
        }
        const svcCounts = specMethodNameCountsPerService.get(servicePropName)!;
        const count = svcCounts.get(methodName) || 0;
        svcCounts.set(methodName, count + 1);
        if (count > 0) methodName = `${methodName}_${count + 1}`;

        // [v7.2 FIX] Escape single quotes in test title to prevent syntax errors
        const testTitle = `${tcId} ${snippet.testName}`.replace(/'/g, "\\'");

        const ctrlComment = snippet.hasControlFlow
            ? `\n        // ⚠️ [CONTROL_FLOW] Request มี setNextRequest — ตรวจสอบลำดับ test.step ด้วยมือ`
            : '';

        if (skeletonMode) {
            // [v7.0 SKELETON] — clean test case with TODO assertions
            const skeletonAssertions = buildSkeletonAssertions(snippet);
            const safeTestName = snippet.testName.replace(/'/g, "\\'");
            specTestCases += `
    test('${testTitle}', async ({ request, ${folderCamel}TestData }) => {
        const helper = new ${folderPascal}Helper(request);${ctrlComment}
        await test.step('API: ${safeTestName}', async () => {
            const response = await helper.${servicePropName}.${methodName}();

${skeletonAssertions}
        });
    });
`;
        } else if (snippet.isDataDriven) {
            const rowType = allIterationKeys.length > 0 ? iterationDataType : '{ placeholder: string }';
            const respSnippet = buildResponseSnippet(snippet.action, snippet.assertions);
            specTestCases += `
    test('${testTitle}', async ({ request, ${folderCamel}TestData }) => {
        const helper = new ${folderPascal}Helper(request);${ctrlComment}
        for (const data of ${folderCamel}Data.iterationData as ${rowType}[]) {
            await test.step(\`API: ${snippet.testName} — \${JSON.stringify(data)}\`, async () => {
                const response = await helper.${servicePropName}.${methodName}(data);

${respSnippet}
${snippet.assertions.split('\n').map(l => '                ' + l).join('\n')}
            });
        }
    });
`;
        } else {
            const respSnippet = buildResponseSnippet(snippet.action, snippet.assertions);
            specTestCases += `
    test('${testTitle}', async ({ request, ${folderCamel}TestData }) => {
        const helper = new ${folderPascal}Helper(request);${ctrlComment}
        await test.step('API: ${snippet.testName}', async () => {
            const response = await helper.${servicePropName}.${methodName}();

${respSnippet}
${snippet.assertions.split('\n').map(l => '                ' + l).join('\n')}
        });
    });
`;
        }
    });

    const stateStoreBeforeAll = anyStateStore
        ? `\n    test.beforeAll(async () => {\n        // ⚠️ PARALLEL RISK: pre-seed stateStore from env if needed\n        // Object.assign(stateStore, { myVar: process.env['myVar'] || '' });\n    });\n`
        : '';

    const collHelperImport = ctx.needsCollectionHelpers && !skeletonMode
        ? `import { CollectionHelpers } from '../../../${helperDir}/core/CollectionHelpers';\n`
        : '';

    // Relative path from spec to fixtures/helpers — spec is in tests-api/<parentKebab>/<folderKebab>/
    const specFileContent =
        `import { test, expect } from '../../../${fixtureDir}/${parentKebab}/${folderKebab}/${folderCamel}Data';
import { ${folderPascal}Helper } from '../../../${helperDir}/${parentKebab}/${folderKebab}/${folderCamel}Helper';
import { ${folderCamel}Data } from '../../../${fixtureDir}/${parentKebab}/${folderKebab}/${folderCamel}Data';
import { validate${folderPascal}Response } from '../../../${schemaDir}/${parentKebab}/${folderKebab}/${folderCamel}Schema';
${collHelperImport}
// ───────────────────────────────────────────────
// ${folderSystemName} API Spec (auto-split from ${ctx.collectionSystemName})
// ───────────────────────────────────────────────
${describeDecorator}('[PBI-0000] ${folderSystemName} API Workflow @regression', () => {
${stateStoreDecl}${stateStoreBeforeAll}
    let testId: string;

    test.beforeEach(async ({ request }) => {
        testId = \`${folderSystemName}_\${Date.now()}\`;
    });

    test.afterEach(async ({ request }) => {
        // cleanup if needed
    });

${specTestCases}
});
`;

    // ─────────────────────────────────────────
    // FILE 4: SCHEMA
    // ─────────────────────────────────────────
    const schemaFileContent =
`import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv({ allErrors: true });

export interface ${folderPascal}Response {
    [key: string]: unknown;
}

export const ${folderCamel}ResponseSchema: JSONSchemaType<${folderPascal}Response> = {
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: true,
} as JSONSchemaType<${folderPascal}Response>;

export const validate${folderPascal}Response = ajv.compile(${folderCamel}ResponseSchema);
`;

    // ─────────────────────────────────────────
    // WRITE FILES
    // ─────────────────────────────────────────
    function ensureAndWrite(fPath: string, content: string) {
        const cwd = process.cwd();
        const safePath = safeResolvePath(cwd, fPath);
        const dir = path.dirname(safePath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(safePath, content, 'utf-8');
        console.log(`   ✅ ${sanitizeLog(path.relative(cwd, safePath))}`);
    }

    const specPath    = path.join(specSubDir, `${folderCamel}.spec.ts`);
    const helperPath  = path.join(targetDir, helperDir, parentKebab, folderKebab, `${folderCamel}Helper.ts`);
    const schemaPath  = path.join(targetDir, schemaDir, parentKebab, folderKebab, `${folderCamel}Schema.ts`);
    const fixturePath = path.join(targetDir, fixtureDir, parentKebab, folderKebab, `${folderCamel}Data.ts`);

    const serialCount = testSnippets.filter(s => s.needsSerial).length;
    const dataDrivenCount = testSnippets.filter(s => s.isDataDriven).length;

    console.log(`\n   ─── ${folderSystemName} ───`);
    console.log(`   Tests: ${testSnippets.length} | Data-driven: ${dataDrivenCount} | Serial: ${serialCount} | Services: ${serviceFiles.length}`);
    if (skeletonMode) console.log(`   Mode: SKELETON (clean assertions, compiles immediately)`);

    const written: string[] = [];
    const failed: string[] = [];
    function tryWrite(fPath: string, content: string) {
        try {
            ensureAndWrite(fPath, content);
            written.push(path.basename(fPath));
        } catch (e: any) {
            failed.push(path.basename(fPath));
            console.error(`   ❌ Failed: ${sanitizeLog(path.basename(fPath))}: ${sanitizeLog(e.message)}`);
        }
    }

    tryWrite(fixturePath, dataFileContent);
    serviceFiles.forEach(sf => tryWrite(sf.path, sf.content));
    tryWrite(helperPath, helperFileContent);
    tryWrite(schemaPath, schemaFileContent);
    tryWrite(specPath, specFileContent);

    if (written.length > 0) console.log(`   PASS (${written.length}): ${written.join(', ')}`);
    if (failed.length > 0)  console.log(`   FAIL (${failed.length}): ${failed.join(', ')}`);
}

// ───────────────────────────────────────────────
// CORE PROCESSING LOGIC (v7)
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
    // [v7.0] Now includes folder context
    // ─────────────────────────────────────────
    const rawBlocks = extractTestBlocks(markdownRaw);

    if (rawBlocks.length === 0) {
        console.warn(`⚠️ No test blocks found in ${sanitizeLog(inputFile)}. Skipping...`);
        return;
    }

    // ─────────────────────────────────────────
    // [v7.0] AUTO-SPLIT: detect top-level folders
    // ─────────────────────────────────────────
    const folderGroups = groupByTopFolder(rawBlocks);
    const hasMultipleFolders = folderGroups.length > 1 ||
        (folderGroups.length === 1 && folderGroups[0].topFolder !== 'General');

    if (hasMultipleFolders && !noSplitMode) {
        console.log(`\n🔀 AUTO-SPLIT: Detected ${folderGroups.length} top-level folders`);
        folderGroups.forEach(fg => {
            console.log(`   📁 ${sanitizeLog(fg.topFolder)}: ${fg.blocks.length} requests, sub-folders: [${fg.subFolders.join(', ')}]`);
        });

        // Process each folder group as a separate spec
        for (const group of folderGroups) {
            await processFolderGroup({
                group,
                inputFile,
                targetDir,
                kebabName,
                collectionSystemName: systemName,
                envMarkdownRaw,
                markdownRaw,
                collectionHelpersData,
                extraImports,
                extraImportsStr,
                needsCollectionHelpers,
                needsXml2js,
                needsCrypto,
                needsCheerio,
                needsMoment,
                helperDir: helperDirName,
                schemaDir: schemaDirName,
                fixtureDir: fixtureDirName,
            });
        }

        // Write CollectionHelpers once (shared across all split folders)
        if (collectionHelpersData && !skeletonMode) {
            const collHelperPath = path.join(targetDir, helperDirName, 'core', 'CollectionHelpers.ts');
            const helperHeader = `import { APIRequestContext } from '@playwright/test';\nimport * as crypto from 'crypto';\nimport { parseStringPromise } from 'xml2js';\n\n/**\n * 💡 CoE Global Helpers\n * common functions migrated from Postman Collection Variables\n */\n`;
            const finalCollectionHelper = `${helperHeader}\n${collectionHelpersData.replace('export const CollectionHelpers = {', 'export const CollectionHelpers = {\n    // 🔄 XML Wrapper for Postman compatibility\n    xml2Json: async (xml: string) => await parseStringPromise(xml),')}\n`;
            const cwd = process.cwd();
            const safePath = safeResolvePath(cwd, collHelperPath);
            const dir = path.dirname(safePath);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(safePath, finalCollectionHelper, 'utf-8');
            console.log(`\n   ✅ CollectionHelpers.ts (shared)`);
        }

        // Summary
        const totalBlocks = folderGroups.reduce((sum, fg) => sum + fg.blocks.length, 0);
        console.log(`\n=========================================`);
        console.log(`✅ AUTO-SPLIT COMPLETE: ${systemName}`);
        console.log(`=========================================`);
        console.log(`   Total requests : ${totalBlocks}`);
        console.log(`   Folders split  : ${folderGroups.length}`);
        console.log(`   Mode           : ${skeletonMode ? 'SKELETON' : 'FULL'}`);
        console.log(`=========================================`);
        return;
    }

    // ─────────────────────────────────────────
    // LEGACY: single-file mode (--no-split or single folder)
    // ─────────────────────────────────────────

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
            // [FIX #14] strip `const varName: type =` ออก (รวม type annotation)
            const valExpr = decl.replace(/^const\s+\w+\s*(?::\s*\S+\s*)?=\s*/, '').replace(/;.*$/, '').trim();
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
        // [FIX #15] Track method names to dedup duplicates
        const methodNameCounts = new Map<string, number>();
        const needsCollHelperInService = snippets.some(s =>
            s.action.includes('CollectionHelpers.') || s.assertions.includes('CollectionHelpers.')
        );
        snippets.forEach(snippet => {
            let methodName = toCamelCase(snippet.testName) + 'Request';

            // [FIX #15] Dedup: append _2, _3, etc. for duplicate method names
            const count = methodNameCounts.get(methodName) || 0;
            methodNameCounts.set(methodName, count + 1);
            if (count > 0) {
                methodName = `${methodName}_${count + 1}`;
            }

            // Replace bare `request.` with `this.request.` inside class methods
            let actionInClass = snippet.action
                .replace(/(?<![.\w])request\.(get|post|put|patch|delete|head|fetch|dispose|storageState)\b/g, 'this.request.$1');

            // [FIX #16] Detect HTTP method from action to build proper url/headers/body
            const httpMethodMatch = actionInClass.match(/this\.request\.(get|post|put|patch|delete)\s*\(/);
            const httpMethod = httpMethodMatch ? httpMethodMatch[1] : 'post';

            // [FIX #16] Check if url, dynamicHeaders, requestBody are used but not declared
            const usesUrl = /\burl\b/.test(actionInClass) && !/\b(?:const|let|var)\s+url\b/.test(actionInClass);
            const usesDynamicHeaders = /\bdynamicHeaders\b/.test(actionInClass) && !/\b(?:const|let|var)\s+dynamicHeaders\b/.test(actionInClass);
            const usesRequestBody = /\brequestBody\b/.test(actionInClass) && !/\b(?:const|let|var)\s+requestBody\b/.test(actionInClass);

            // Build variable declarations for undeclared references
            const varDecls: string[] = [];
            if (usesUrl) {
                varDecls.push(`const url = new URL(data.endpoint || '', data.baseUrl || process.env['BASE_URL'] || '');`);
            }
            if (usesDynamicHeaders) {
                varDecls.push(`const dynamicHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...data.headers,
        };`);
            }
            if (usesRequestBody) {
                varDecls.push(`const requestBody = data.body ?? data;`);
            }

            if (varDecls.length > 0) {
                actionInClass = varDecls.map(d => '  ' + d).join('\n') + '\n' + actionInClass;
            }

            const hasResponseDecl = /\bconst response\b/.test(actionInClass) || /\blet response\b/.test(actionInClass);
            const returnLine = hasResponseDecl ? '        return response;' : '        // TODO: return the response variable';
            serviceMethods += `
    /**
     * @description ${snippet.label} > ${snippet.testName}
     */
    async ${methodName}(data: any = {}): Promise<any> {
${actionInClass.split('\n').map(l => '        ' + l).join('\n')}
${returnLine}
    }
`;
        });

        const collHelperServiceImport = needsCollHelperInService
            ? `import { CollectionHelpers } from '../core/CollectionHelpers';\n`
            : '';

        const serviceContent =
            `${fsImport}import { APIRequestContext } from '@playwright/test';
${helperExtraImports ? helperExtraImports + '\n' : ''}${collHelperServiceImport}
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

    // [FIX #15] Track method names in spec to match service dedup
    const specMethodNameCounts = new Map<string, number>();

    testSnippets.forEach((snippet, index) => {
        const tcId = `[TC-${String(index + 1).padStart(4, '0')}]`;
        let methodName = toCamelCase(snippet.testName) + 'Request';

        // [FIX #15] Dedup: must match service method naming
        const count = specMethodNameCounts.get(methodName) || 0;
        specMethodNameCounts.set(methodName, count + 1);
        if (count > 0) {
            methodName = `${methodName}_${count + 1}`;
        }

        const testTitle = `${tcId} ${snippet.testName}`.replace(/'/g, "\\'");
        const snippetLabel = snippet.label || 'General';
        const serviceLabel = snippetLabel === 'General' ? systemName : snippetLabel;
        const servicePropName = toCamelCase(toPascalCase(serviceLabel).replace(/Service$/, ''));

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
    test('${testTitle}', async ({ request, ${camelName}TestData }) => {
        const helper = new ${pascalName}Helper(request);${ctrlComment}
        for (const data of ${camelName}Data.iterationData as ${rowType}[]) {
            await test.step(\`API: ${snippet.testName} — \${JSON.stringify(data)}\`, async () => {
                // 📝 Arrange: Prepare data from Fixtures (Do not hardcode here)
                // const reqData = data;

                // 🎬 Act: Execute the API call
                const response = await helper.${servicePropName}.${methodName}(data);

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
    test('${testTitle}', async ({ request, ${camelName}TestData }) => {
        const helper = new ${pascalName}Helper(request);${ctrlComment}
        await test.step('API: ${snippet.testName}', async () => {
            // 📝 Arrange: Prepare data from Fixtures (Do not hardcode here)
            // const reqData = ${camelName}Data.samplePayload;

            // 🎬 Act: Execute the API call
            const response = await helper.${servicePropName}.${methodName}();

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
    // [v7.3] Resolve --input (auto-detect if not provided)
    const inputPath = await resolveInputPath();

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
            const mdFiles = files.filter(f => {
                const fullF = path.join(inputPath, f);
                return f.endsWith('.md')
                    && !f.toLowerCase().includes('.env.md')
                    && f.toLowerCase() !== 'readme.md'
                    && f.toLowerCase() !== 'env.md'
                    && f.toLowerCase() !== 'environment.md'
                    && fs.statSync(fullF).isFile(); // [FIX] skip directories named *.md
            });
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