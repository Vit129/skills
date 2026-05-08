/**
 * @file readPostmanCollection.ts
 * @version 6.0 - v5.3 format + v4 capabilities + arrow key folder selection
 */
import * as fs from 'fs';
import * as path from 'path';

function toKebabCase(str: string): string {
  return str.toLowerCase().trim()
    .replace(/[^\w\u0E00-\u0E7F\s]+/g, '-')
    .replace(/\s+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '')
    .replace(/^[\d-]+/, '');
}
function toCamelCase(str: string): string {
  if (!/[a-z]/i.test(str)) return str.replace(/\s+/g, '');
  return str.replace(/[^a-zA-Z\u0E00-\u0E7F\s\-_]+/g, '')
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase())
    .replace(/[\s\-_]+/g, '');
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Usage: npx ts-node readPostmanCollection.ts <collection.json> [--output <out_dir>] [--folder <name>]');
  process.exit(1);
}
const filePath = path.resolve(args[0]);
const outputIndex = args.indexOf('--output');
const outputArgPath = outputIndex !== -1 && args[outputIndex + 1] ? path.resolve(args[outputIndex + 1]) : null;
const folderIndex = args.indexOf('--folder');
const targetFolder = folderIndex !== -1 && args[folderIndex + 1] ? args[folderIndex + 1] : null;

function findProjectRoot(start: string): string | null {
  let dir = start;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

async function resolveOutputPath(): Promise<string> {
  if (outputArgPath) return outputArgPath;

  const isTestProject = (r: string) =>
    fs.existsSync(path.join(r, 'playwright.config.ts')) ||
    fs.existsSync(path.join(r, 'playwright.config.js')) ||
    fs.existsSync(path.join(r, 'tsconfig.json'));

  const allRoots = [process.cwd(), path.dirname(filePath)]
    .map(findProjectRoot)
    .filter((r): r is string => r !== null);
  const uniqueRoots = [...new Set(allRoots)].filter(isTestProject);

  let root: string;
  if (uniqueRoots.length > 1) {
    // Use first test project root found (no interactive prompt)
    root = uniqueRoots[0];
    console.log(`📂 Multiple project roots found, using: ${root}`);
  } else {
    root = uniqueRoots[0] ?? process.cwd();
  }

  // Auto-derive output from collection name → tests-api/<kebab-name>/
  const collectionName = toKebabCase(data?.info?.name || path.basename(filePath, '.json'));
  const testsApiDir = path.join(root, 'tests-api');
  console.log(`\n📂 Auto-detected output: ${path.join(testsApiDir, collectionName)}`);
  return path.join(testsApiDir, collectionName);
}

let data: any;
try { data = JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
catch { console.error('❌ Cannot read or parse JSON file'); process.exit(1); }

console.log(`\n📂 Collection: ${data.info?.name}`);

// ── GLOBAL STATE ──
const IGNORED_HEADERS = ['host', 'content-length', 'user-agent', 'accept', 'accept-encoding', 'connection', 'cookie', 'postman-token', 'cache-control'];
const collectionVars: any[] = data.variable || [];
const collectionVarMap = new Map<string, string>(collectionVars.map((v: any) => [v.key, String(v.value || '')]));
const globalEnvVarsUsed = new Set<string>();
const functionVars: string[] = [];
const valueVars: any[] = [];
collectionVars.forEach((v: any) => {
  const val = String(v.value || '');
  if (val.includes('function') || val.includes('=>')) functionVars.push(v.key);
  else valueVars.push(v);
});
let totalRequests = 0;
const validationIssues: string[] = [];
const testGroups = new Map<string, string[]>();
const importsNeeded = new Set<string>(['{ test, expect } from "@playwright/test"']);

// ── PASS 1: EXECUTION GRAPH ──
interface RequestNode {
  id: string; name: string; folderChain: any[];
  setNextTargets: string[]; isConditionalFlow: boolean;
  setsVars: string[]; getsVars: string[];
}
const requestGraph = new Map<string, RequestNode>();

function buildExecutionGraph(items: any[], folderChain: any[] = []): void {
  items.forEach((item: any) => {
    if (item.item && Array.isArray(item.item)) { buildExecutionGraph(item.item, [...folderChain, item]); return; }
    if (!item.request) return;
    const allExec = [
      ...(item.event?.find((e: any) => e.listen === 'prerequest')?.script?.exec || []),
      ...(item.event?.find((e: any) => e.listen === 'test')?.script?.exec || []),
    ].join('\n');
    const nextMatches = [...allExec.matchAll(/(?:pm\.execution|postman)\.setNextRequest\s*\(\s*['"]([^'"]*)['"]\s*\)/g)];
    const isConditional = /if\s*\([\s\S]+?(?:pm\.execution|postman)\.setNextRequest/.test(allExec);
    const setsVars: string[] = [];
    const getsVars: string[] = [];
    for (const m of allExec.matchAll(/pm\.(?:environment|globals|variables)\.set\s*\(\s*['"]([^'"]+)['"]/g)) setsVars.push(m[1]);
    for (const m of allExec.matchAll(/pm\.(?:environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]/g)) getsVars.push(m[1]);
    requestGraph.set(item.name, { id: item.id || item.name, name: item.name, folderChain, setNextTargets: nextMatches.map(m => m[1]), isConditionalFlow: isConditional, setsVars, getsVars });
  });
}

interface StateDependency { variable: string; setBy: string[]; usedBy: string[]; isParallelRisk: boolean; }
function analyzeStateDependencies(): StateDependency[] {
  const setMap = new Map<string, string[]>();
  const getMap = new Map<string, string[]>();
  requestGraph.forEach(node => {
    node.setsVars.forEach(v => { if (!setMap.has(v)) setMap.set(v, []); setMap.get(v)!.push(node.name); });
    node.getsVars.forEach(v => { if (!getMap.has(v)) getMap.set(v, []); getMap.get(v)!.push(node.name); });
  });
  const allVars = new Set([...setMap.keys(), ...getMap.keys()]);
  return Array.from(allVars).map(v => ({ variable: v, setBy: setMap.get(v) || [], usedBy: getMap.get(v) || [], isParallelRisk: (setMap.get(v)?.length || 0) > 0 && (getMap.get(v)?.length || 0) > 0 }));
}

function resolveAuth(item: any, folderChain: any[]): any {
  const reqAuth = item.request?.auth;
  if (reqAuth && reqAuth.type && reqAuth.type !== 'noauth') return reqAuth;
  for (let i = folderChain.length - 1; i >= 0; i--) {
    const f = folderChain[i];
    if (f.auth && f.auth.type && f.auth.type !== 'noauth') return f.auth;
  }
  const collAuth = data.auth;
  if (collAuth && collAuth.type && collAuth.type !== 'noauth') return collAuth;
  return null;
}

// ── PASS 2: VAR REGISTRY ──
class VarRegistry {
  private normalized = new Map<string, string>();
  private collisions: string[] = [];
  register(originalKey: string): string {
    const base = originalKey.replace(/[-. ]/g, '_');
    if (!this.normalized.has(base)) { this.normalized.set(base, originalKey); return base; }
    if (this.normalized.get(base) === originalKey) return base;
    const uniqueName = `${base}_${[...this.normalized.keys()].filter(k => k.startsWith(base)).length}`;
    this.collisions.push(`- ⚠️ **VAR COLLISION:** \`${originalKey}\` → \`${uniqueName}\``);
    this.normalized.set(uniqueName, originalKey);
    return uniqueName;
  }
  getCollisions(): string[] { return this.collisions; }
}
const varRegistry = new VarRegistry();

function extractVarsFromText(text: string, target: Set<string>) {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (matches) matches.forEach((m: string) => target.add(m.replace(/\{\{|\}\}/g, '').trim()));
}

// ── PASS 3-B: CPS → ASYNC/AWAIT ──
function transformSendRequest(block: string, method: string, reqName: string): string[] {
  const fullMatch = block.match(/pm\.sendRequest\s*\(\s*([\s\S]+?)\s*,\s*function\s*\((\w+)\s*,\s*(\w+)\)\s*\{([\s\S]+?)\}\s*\)/);
  if (fullMatch) {
    const [, configRaw, errParam, resParam, bodyRaw] = fullMatch;

    // 1. normalize header array → headers object
    let configClean = configRaw.replace(
      /header\s*:\s*\[([\s\S]+?)\]/,
      (_: string, arr: string) => {
        const pairs = [...arr.matchAll(/\{\s*key\s*:\s*['"]([^'"]+)['"]\s*,\s*value\s*:\s*([^}]+?)\s*\}/g)];
        const obj = pairs.map(([, k, v]) => `'${k}': ${v.trim()}`).join(', ');
        return `headers: { ${obj} }`;
      }
    );

    // 2. detect urlencoded body → Playwright `form:` object (not URLSearchParams string)
    const urlencodedMatch = configClean.match(/body\s*:\s*\{[\s\S]*?mode\s*:\s*['"]urlencoded['"][\s\S]*?urlencoded\s*:\s*(\[[\s\S]+?\])/);
    let playwrightBodyKey = 'data';
    let playwrightBodyValue = '';
    if (urlencodedMatch) {
      try {
        const pairs: { key: string, value: string }[] = JSON.parse(urlencodedMatch[1]);
        const entries = pairs.map(p => {
          const v = String(p.value || '').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => { globalEnvVarsUsed.add(k); return `\${process.env['${k}']}`; });
          return `    '${p.key}': \`${v}\``;
        }).join(',\n');
        playwrightBodyKey = 'form';
        playwrightBodyValue = `{\n${entries}\n  }`;
        // strip body: {...} from configClean — rebuild as Playwright fetch options
        configClean = configClean.replace(/,?\s*body\s*:\s*\{[\s\S]*?mode\s*:\s*['"]urlencoded['"][\s\S]*?\}\s*(?=,|\}|$)/, '');
      } catch { /* fallback: leave as-is */ }
    }

    configClean = configClean.replace(/pm\.(?:environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, k) => { globalEnvVarsUsed.add(k); return `process.env['${k}']`; });

    // flag hardcoded secrets in config
    const secretPattern = /['"](?:client_secret|password|secret|token)['"]\s*:\s*['"]([^'"]{8,})['"](?!\s*\+)/g;
    configClean = configClean.replace(secretPattern, (m, val) => {
      validationIssues.push(`#### ⚠️ [${method}] ${reqName}\n- **สาเหตุ:** Hardcoded secret \`${val.substring(0, 8)}...\` ใน sendRequest\n- **วิธีแก้:** ย้ายไป process.env`);
      return m.replace(val, '/* ⚠️ HARDCODED SECRET */');
    });

    // 3. clean body: strip err variable (CPS callback stripped but err may leak), dedup jsonData
    const bodyClean = bodyRaw
      .replace(/pm\.(?:environment|globals|variables)\.set\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\);?/g, (_, k, val) => { globalEnvVarsUsed.add(k); return `process.env['${k}'] = String(${val});`; })
      .replace(/pm\.(?:environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, k) => { globalEnvVarsUsed.add(k); return `process.env['${k}']`; })
      // strip: if (err) { ... } blocks left over from CPS
      .replace(new RegExp(`if\\s*\\(\\s*${errParam}\\s*\\)\\s*\\{[\\s\\S]*?\\}`, 'g'), '')
      // strip: var/let/const jsonData = resParam.json() — already declared as _preJson
      .replace(/(?:var|let|const)\s+jsonData\s*=\s*_preJson\s*;?/g, '// jsonData = _preJson (use _preJson directly)')
      .replace(new RegExp(`\\b${resParam}\\.json\\(\\)`, 'g'), '_preJson')
      .replace(new RegExp(`\\b${resParam}\\.code\\b`, 'g'), '_preResponse.status()').trim();

    const fetchOptions = playwrightBodyValue
      ? `{ ...${configClean.trim()}, ${playwrightBodyKey}: ${playwrightBodyValue} }`
      : configClean.trim();

    return [
      `  // ⚡ [CPS→ASYNC] pm.sendRequest converted`,
      `  const _preResponse = await request.fetch(${fetchOptions});`,
      `  if (!_preResponse.ok()) throw new Error(\`Pre-request failed: \${_preResponse.status()}\`);`,
      `  const _preJson = await _preResponse.json();`,
      ...bodyClean.split('\n').filter(l => l.trim()).map(l => `  ${l.trim()}`),
    ];
  }
  const shortMatch = block.match(/pm\.sendRequest\s*\(\s*(['"`][^'"`]+['"`])\s*,/);
  if (shortMatch) {
    validationIssues.push(`#### ⚠️ [${method}] ${reqName}\n- **สาเหตุ:** \`pm.sendRequest\` shorthand\n- **วิธีแก้:** แปลงเป็น \`await request.get(url)\``);
    return [`  // ⚠️ [MANUAL] pm.sendRequest shorthand`, `  // const _preResponse = await request.get(${shortMatch[1]});`, `  // Raw: ${block.trim()}`];
  }
  validationIssues.push(`#### ⚠️ [${method}] ${reqName}\n- **สาเหตุ:** \`pm.sendRequest\` pattern ซับซ้อน\n- **วิธีแก้:** migrate ด้วยมือ`);
  return [`  // ⚠️ [MANUAL] pm.sendRequest — too complex`, `  // Raw: ${block.trim()}`];
}

function convertPreRequest(execLines: string[], method: string, reqName: string): string {
  if (!execLines || execLines.length === 0) return '';
  const converted: string[] = [`  // ⚡ Pre-request: converted from Postman`];
  const src = execLines.join('\n').replace(/\r/g, '');
  // extract pm.sendRequest blocks first (multi-line)
  const sendReqBlocks: { start: number, end: number, result: string[] }[] = [];
  const lines = src.split('\n');
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith('pm.sendRequest')) {
      // collect until balanced closing );
      let depth = 0, blockLines = [];
      let j = i;
      while (j < lines.length) {
        const l = lines[j];
        for (const ch of l) { if (ch === '(') depth++; else if (ch === ')') depth--; }
        blockLines.push(l);
        j++;
        if (depth <= 0) break;
      }
      sendReqBlocks.push({ start: i, end: j - 1, result: transformSendRequest(blockLines.join('\n'), method, reqName) });
      i = j;
    } else { i++; }
  }
  // now process line by line, substituting sendRequest blocks
  let lineIdx = 0;
  const sendReqMap = new Map(sendReqBlocks.map(b => [b.start, b]));
  while (lineIdx < lines.length) {
    if (sendReqMap.has(lineIdx)) {
      const block = sendReqMap.get(lineIdx)!;
      converted.push(...block.result);
      lineIdx = block.end + 1;
      continue;
    }
    let line = lines[lineIdx].trim();
    lineIdx++;
    if (!line) continue;
    if (line.match(/require\s*\(\s*['"]crypto-js['"]\s*\)/)) { converted.push(`  // 📦 import CryptoJS from 'crypto-js';`); continue; }
    if (line.match(/require\s*\(\s*['"]moment['"]\s*\)/)) continue;
    const momentFormatMatch = line.match(/(?:const|let|var)\s+(\w+)\s*=\s*\w+\s*\(\s*\)\.format\s*\(\s*['"]([^'"]+)['"]\s*\)/);
    if (momentFormatMatch) {
      const [, varName, fmt] = momentFormatMatch;
      const knownFormats: Record<string, string> = {
        'DD/MM/YYYY, HH:mm': `{ day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit', hour12:false }`,
        'YYYY-MM-DD': `{ year:'numeric', month:'2-digit', day:'2-digit' }`,
        'DD/MM/YYYY': `{ day:'2-digit', month:'2-digit', year:'numeric' }`,
        'HH:mm:ss': `{ hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }`,
        'YYYY-MM-DDTHH:mm:ss': `{ year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false }`,
      };
      const isKnownFmt = fmt in knownFormats;
      if (isKnownFmt) {
        const nativeFmt = knownFormats[fmt];
        converted.push(`  const ${varName} = new Date().toLocaleString('en-GB', ${nativeFmt}).replace(/\//g, '/');`);
      } else {
        converted.push(`  // ⚠️ moment format '${fmt}' → migrate manually`);
        converted.push(`  const ${varName} = new Date().toISOString(); // TODO: format '${fmt}'`);
      }
      continue;
    }
    if (line.match(/require\s*\(/)) {
      const mod = line.match(/require\s*\(\s*['"](.+?)['"]\s*\)/)?.[1] || 'unknown';
      importsNeeded.add(`* as _mod from "${mod}"`);
      converted.push(`  // ⚠️ require() → import manually: ${line}`); continue;
    }
    const evalMatch = line.match(/(?:(?:const|let|var)\s+(\w+)\s*=\s*)?eval\s*\(\s*pm\.collectionVariables\.get\s*\(\s*['"]([\w]+)['"]\s*\)\s*\)/);
    if (evalMatch) {
      const [, varName, fnName] = evalMatch;
      if (varName) converted.push(`  const ${varName} = CollectionHelpers.${fnName}.bind(CollectionHelpers);`);
      else converted.push(`  CollectionHelpers.${fnName}();`);
      continue;
    }
    // handle: varName(args) where varName was assigned from eval above
    const evalCallMatch = line.match(/^(\w+)\s*\((.*)\)\s*;?$/);
    if (evalCallMatch && converted.some(l => l.includes(`const ${evalCallMatch[1]} = CollectionHelpers`))) {
      converted.push(`  ${evalCallMatch[1]}(${evalCallMatch[2]});`);
      continue;
    }
    if (line.includes('pm.request.headers.add') || line.includes('pm.request.headers.upsert')) {
      const h = line.match(/\(\s*\{\s*key:\s*['"](.+?)['"]\s*,\s*value:\s*(.+?)\s*\}\s*\)/);
      if (h) converted.push(`  dynamicHeaders['${h[1]}'] = String(${h[2].replace(/pm\.\w+\.get\(['"](.+?)['"]\)/g, "process.env['$1']")});`);
      continue;
    }
    if (line.includes('pm.request.url.addQueryParams')) {
      const q = line.match(/\(\s*['"](.+?)['"]\s*,\s*(.+?)\s*\)/) || line.match(/\(\s*(.+?)\s*\)/);
      if (q) converted.push(`  url.searchParams.append('${q[1]}', String(${q[2] || "''"}));`);
      continue;
    }
    if (line.includes('pm.execution.skipRequest')) {
      converted.push(`  test.skip(true, 'Skipped by Postman script'); return;`);
      continue;
    }
    line = line.replace(/pm\.info\.requestName/g, `'${reqName}'`);
    line = line.replace(/pm\.info\.iteration/g, '0 /* pm.info.iteration: use Playwright repeat */');
    line = line.replace(/pm\.iterationData\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "process.env['iterationData_$1'] /* load from CSV/JSON */");
    line = line.replace(/pm\.variables\.replaceIn\s*\(\s*(.+?)\s*\)/g, 'replaceIn($1)');
    line = line.replace(/pm\.(environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, _s, key) => { globalEnvVarsUsed.add(key); return `process.env['${key}']`; });
    line = line.replace(/pm\.(environment|globals|variables)\.set\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\);?$/, (_, _s, key, val) => {
      globalEnvVarsUsed.add(key);
      const deps = stateDeps.find(d => d.variable === key);
      if (deps?.isParallelRisk) return `stateStore['${key}'] = String(${val}); // ⚠️ PARALLEL RISK`;
      return `process.env['${key}'] = String(${val});`;
    });
    line = line.replace(/pm\.collectionVariables\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, key) => `/* collectionVar: ${key} */`);
    line = line.replace(/pm\.collectionVariables\.set\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\);?$/g, (_, key, val) => `/* collectionVar.set: ${key} = ${val} — migrate to stateStore['${key}'] */`);
    line = line.replace(/pm\.cookies\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "(await request.storageState()).cookies.find(c=>c.name==='$1')?.value");
    line = line.replace(/pm\.cookies\.has\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "!!(await request.storageState()).cookies.find(c=>c.name==='$1')");
    line = line.replace(/btoa\s*\((.+?)\)/g, "Buffer.from($1).toString('base64')");
    line = line.replace(/atob\s*\((.+?)\)/g, "Buffer.from($1, 'base64').toString()");
    line = line.replace(/pm\.response\.text\(\)/g, 'responseText');
    line = line.replace(/crypto\.HmacSHA256\s*\((.+?),\s*(.+?)\)\.toString\(crypto\.enc\.Hex\)/g, 'CryptoJS.HmacSHA256($1, $2).toString(CryptoJS.enc.Hex)');
    if (line === '});' || line === '})') continue;
    converted.push(`  ${line}`);
  }
  return converted.join('\n');
}

function convertTestScript(execLines: string[], method: string, reqName: string, itemUsedVars: Set<string>): string {
  if (!execLines || execLines.length === 0) return '';
  const converted: string[] = [];
  let braceDepth = 0, insidePmTest = false;
  let inString: string | null = null;
  for (const rawLine of execLines.join('\n').split('\n')) {
    let line = rawLine.replace(/\r/g, '').trim();
    if (!line) continue;
    for (const ch of line) {
      if ((ch === '"' || ch === "'" || ch === '`') && inString === null) inString = ch;
      else if (inString === ch) inString = null;
      if (inString) continue;
      if (ch === '{') braceDepth++;
      if (ch === '}') braceDepth--;
    }
    const testMatch = line.match(/^pm\.test\s*\(\s*(['"`])(.+?)\1\s*,\s*(?:async\s+)?function\s*\(\)\s*\{?\s*$/);
    if (testMatch) { converted.push(`  await test.step('${testMatch[2].replace(/'/g, "\\'")}', async () => {`); insidePmTest = true; braceDepth = 1; continue; }
    if ((line === '});' || line === '})') && insidePmTest && braceDepth <= 0) { converted.push(`  });`); insidePmTest = false; braceDepth = 0; continue; }
    line = line.replace(/pm\.response\.to\.have\.status\s*\(\s*(\d+)\s*\)/g, 'expect(response.status()).toBe($1)');
    line = line.replace(/pm\.response\.headers\.get\s*\(\s*['"](.+?)['"]\s*\)/g, "responseHeaders['$1'.toLowerCase()]");
    line = line.replace(/pm\.response\.headers\.has\s*\(\s*['"](.+?)['"]\s*\)/g, "!!responseHeaders['$1'.toLowerCase()]");
    line = line.replace(/pm\.expect\s*\(\s*pm\.response\.json\(\)\s*\)\.to\.have\.property\s*\(\s*['"]([^'"]+)['"]\s*\)/g, `expect(responseJson).toHaveProperty('$1')`);
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.have\.(?:nested\.)?(?:deep\.)?property\s*\(\s*['"]([^'"]+)['"]\s*(?:,\s*(.+?))?\s*\)/g, (_, p1, p2, p3) => p3 ? `expect(${p1}).toHaveProperty('${p2}', ${p3})` : `expect(${p1}).toHaveProperty('${p2}')`);
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.eql\s*\((.+?)\)/g, 'expect($1).toEqual($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.equal\s*\((.+?)\)/g, 'expect($1).toBe($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.include\s*\((.+?)\)/g, 'expect($1).toContain($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.have\.string\s*\((.+?)\)/g, 'expect($1).toContain($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.have\.lengthOf\s*\((.+?)\)/g, 'expect($1).toHaveLength($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.true/g, 'expect($1).toBe(true)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.false/g, 'expect($1).toBe(false)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.exist/g, 'expect($1).toBeDefined()');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.null/g, 'expect($1).toBeNull()');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.above\s*\((.+?)\)/g, 'expect($1).toBeGreaterThan($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.greaterThan\s*\((.+?)\)/g, 'expect($1).toBeGreaterThan($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.at\.most\s*\((.+?)\)/g, 'expect($1).toBeLessThanOrEqual($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.lessThan\s*\((.+?)\)/g, 'expect($1).toBeLessThan($2)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.string(?!\s*\()/g, 'expect(typeof $1).toBe("string")');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.an?\s*\(\s*['"]array['"]\s*\)/g, 'expect(Array.isArray($1)).toBe(true)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.an?\s*\(\s*['"]object['"]\s*\)/g, 'expect(typeof $1).toBe("object")');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.oneOf\s*\(\s*(\[.+?\])\s*\)/g, 'expect($2).toContain($1)');
    line = line.replace(/pm\.expect\s*\((.+?)\)\.to\.be\.a\s*\(\s*['"](\w+)['"]\s*\)/g, 'expect(typeof $1).toBe("$2")');
    line = line.replace(/(?:var|let|const)\s+(\w+)\s*=\s*pm\.response\.json\(\)\s*(\.[^;]+)?\s*;?/g, (_, varName, accessPath) => {
      if (varName === 'jsonData' || varName === 'responseJson') return `// ${varName} already declared\n  ${varName} = responseJson${accessPath || ''};`;
      return `const ${varName} = responseJson${accessPath || ''};`;
    });
    const setMatch = line.match(/pm\.(environment|globals|variables)\.set\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\);?$/);
    if (setMatch) {
      globalEnvVarsUsed.add(setMatch[2]); itemUsedVars.add(setMatch[2]);
      const deps = stateDeps.find(d => d.variable === setMatch[2]);
      converted.push(deps?.isParallelRisk ? `  stateStore['${setMatch[2]}'] = String(${setMatch[3]}); // ⚠️ PARALLEL RISK` : `  process.env['${setMatch[2]}'] = String(${setMatch[3]});`);
      continue;
    }
    line = line.replace(/pm\.(environment|globals|variables)\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, _s, key) => { globalEnvVarsUsed.add(key); itemUsedVars.add(key); return `process.env['${key}']`; });
    const inlineFnMatch = line.match(/^(?:function|async function)\s+(\w+)\s*\(/);
    if (inlineFnMatch) { converted.push(`  // 📌 CollectionHelpers.${inlineFnMatch[1]}() — extracted`); continue; }
    const pmVerifyMatch = line.match(/^(pmVerify\w+|verifyError|verifySuccess|verifyResult|verifyObject)\s*\(/);
    if (pmVerifyMatch) { converted.push(`  // 📌 CollectionHelpers.${pmVerifyMatch[1]}(${line.replace(/^\w+\s*\(/, '').replace(/\)\s*;?$/, '')});`); continue; }
    const evalCollMatch = line.match(/(?:(?:const|let|var)\s+(\w+)\s*=\s*)?eval\s*\(\s*pm\.collectionVariables\.get\s*\(\s*['"]([\w]+)['"]\s*\)\s*\)/);
    if (evalCollMatch) {
      const [, varName, fnName] = evalCollMatch;
      if (varName) converted.push(`  const ${varName} = CollectionHelpers.${fnName}.bind(CollectionHelpers);`);
      else converted.push(`  CollectionHelpers.${fnName}();`);
      continue;
    }
    const evalCallMatch = line.match(/^(\w+)\s*\((.*)\)\s*;?$/);
    if (evalCallMatch && converted.some(l => l.includes(`const ${evalCallMatch[1]} = CollectionHelpers`))) {
      converted.push(`  ${evalCallMatch[1]}(${evalCallMatch[2]});`);
      continue;
    }
    line = line.replace(/pm\.request\.body\.raw/g, 'requestBody');
    line = line.replace(/pm\.request\.body/g, 'requestBody');
    line = line.replace(/pm\.response\.json\(\)/g, 'responseJson');
    line = line.replace(/pm\.response\.code/g, 'response.status()');
    line = line.replace(/pm\.response\.to\.be\.success/g, 'expect(response.ok()).toBe(true)');
    line = line.replace(/pm\.response\.responseTime/g, '(Date.now() - _startTime)');
    line = line.replace(/pm\.response\.text\(\)/g, 'responseText');
    line = line.replace(/pm\.info\.requestName/g, `'${reqName}'`);
    line = line.replace(/pm\.info\.iteration/g, '0 /* pm.info.iteration: use Playwright repeat */');
    line = line.replace(/pm\.iterationData\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "process.env['iterationData_$1'] /* load from CSV/JSON */");
    line = line.replace(/pm\.collectionVariables\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, (_, key) => `/* collectionVar: ${key} */`);
    line = line.replace(/pm\.collectionVariables\.set\s*\(\s*['"]([^'"]+)['"]\s*,\s*(.+?)\s*\);?$/g, (_, key, val) => `stateStore['${key}'] = String(${val}); // collectionVar.set`);
    line = line.replace(/pm\.cookies\.get\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "(await request.storageState()).cookies.find(c=>c.name==='$1')?.value");
    line = line.replace(/pm\.cookies\.has\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "!!(await request.storageState()).cookies.find(c=>c.name==='$1')");
    line = line.replace(/btoa\s*\((.+?)\)/g, "Buffer.from($1).toString('base64')");
    line = line.replace(/atob\s*\((.+?)\)/g, "Buffer.from($1, 'base64').toString()");
    if (line.includes('pm.execution.setNextRequest(null') || line.includes('postman.setNextRequest(null')) { converted.push(`  return; // ⚠️ WORKFLOW STOP`); continue; }
    if (line.includes('postman.setNextRequest') || line.includes('pm.execution.setNextRequest')) { converted.push(`  // ⚠️ WORKFLOW: ${line.trim()}`); continue; }
    if (line === '});' || line === '})') { converted.push(`  });`); continue; }
    if (line.startsWith('pm.')) { converted.push(`  // ⚠️ Manual: ${line}`); continue; }
    converted.push(`  ${line}`);
  }
  return converted.join('\n');
}

// ── PASS 4: RESPONSE TYPE DETECTOR ──
function detectResponseType(testLines: string[]): 'json' | 'text' | 'none' | 'unknown' {
  const src = testLines.join('\n');
  if (!src.trim()) return 'none';
  if (src.includes('pm.response.json()') || src.includes('responseJson')) return 'json';
  if (src.includes('pm.response.text()')) return 'text';
  if (/pm\.response\.to\.have\.status|response\.status\(\)/.test(src) && !src.includes('json') && !src.includes('body')) return 'none';
  return 'unknown';
}

function buildResponseSnippet(responseType: 'json' | 'text' | 'none' | 'unknown'): string {
  switch (responseType) {
    case 'json': return [
      `  // ━━━ 🔍 Response Parse ━━━`,
      `  const contentType = response.headers()['content-type'] || '';`,
      `  if (!contentType.includes('application/json')) throw new Error(\`Expected JSON but got: \${contentType}\`);`,
      `  const responseJson = await response.json();`,
    ].join('\n');
    case 'text': return `  const responseText = await response.text();`;
    case 'none': return `  // No response body parsing needed`;
    default: return [
      `  const _ct = response.headers()['content-type'] || '';`,
      `  const responseJson = _ct.includes('application/json') ? await response.json() : null;`,
      `  const responseText = !_ct.includes('application/json') ? await response.text() : null;`,
    ].join('\n');
  }
}

// ── SNIPPET GENERATOR ──
function generateSnippet(item: any, folderChain: any[] = []): string {
  if (!item.request) return '';
  totalRequests++;
  const itemVars = new Set<string>();
  const method = item.request.method || 'GET';
  const urlRaw = item.request.url?.raw || '';
  const headers: any[] = item.request.header || [];
  const auth = resolveAuth(item, folderChain);
  const bodyMode = item.request.body?.mode;
  const rawBody = bodyMode ? item.request.body?.[bodyMode] : undefined;

  extractVarsFromText(urlRaw, itemVars);
  if (bodyMode === 'raw' && typeof rawBody === 'string') extractVarsFromText(rawBody, itemVars);
  else if ((bodyMode === 'formdata' || bodyMode === 'urlencoded') && Array.isArray(rawBody)) rawBody.forEach((f: any) => extractVarsFromText(String(f.value || ''), itemVars));
  headers.forEach((h: any) => extractVarsFromText(String(h.value || ''), itemVars));
  if (auth?.bearer) auth.bearer.forEach((b: any) => extractVarsFromText(String(b.value || ''), itemVars));
  itemVars.forEach(v => globalEnvVarsUsed.add(v));

  const playwrightUrlBase = urlRaw.replace(/\{\{([^}]+)\}\}/g, (_m: string, k: string) => `\${process.env['${k}']}`);
  const preRequestExec: string[] = item.event?.find((ev: any) => ev.listen === 'prerequest')?.script?.exec || [];
  const testExec: string[] = item.event?.find((ev: any) => ev.listen === 'test')?.script?.exec || [];

  // detect xml2Json or special libraries
  const allScripts = [...preRequestExec, ...testExec].join('\n');
  if (allScripts.includes('xml2Json')) {
    importsNeeded.add('{ parseStringPromise } from "xml2js"');
    validationIssues.push(`#### ⚠️ [${method}] ${item.name}\n- **สาเหตุ:** มีการใช้ \`xml2Json\`\n- **วิธีแก้:** แปลงเป็น \`await parseStringPromise(xml)\` แทน`);
  }
  if (allScripts.includes('cheerio')) {
    importsNeeded.add('* as cheerio from "cheerio"');
    validationIssues.push(`#### ⚠️ [${method}] ${item.name}\n- **สาเหตุ:** มีการใช้ \`cheerio\`\n- **วิธีแก้:** \`npm install cheerio\` และใช้ \`cheerio.load(html)\``);
  }
  if (allScripts.includes('ajv') || allScripts.includes('tv4')) {
    importsNeeded.add('Ajv from "ajv"');
    validationIssues.push(`#### ⚠️ [${method}] ${item.name}\n- **สาเหตุ:** มีการใช้ \`ajv/tv4\` schema validation\n- **วิธีแก้:** ใช้ \`new Ajv().validate(schema, data)\``);
  }

  // ── Postman Dynamic Variables Helper ──
  const replaceInHelper = `  const replaceIn = (str: string) => str.replace(/\\{\\{\\$guid\\}\\}/g, crypto.randomUUID()).replace(/\\{\\{\\$timestamp\\}\\}/g, String(Math.floor(Date.now()/1000))).replace(/\\{\\{\\$randomInt\\}\\}/g, String(Math.floor(Math.random()*1000)));\n`;

  const node = requestGraph.get(item.name);
  const needsStateStore = node && (
    node.setsVars.some(v => stateDeps.find(d => d.variable === v && d.isParallelRisk)) ||
    node.getsVars.some(v => stateDeps.find(d => d.variable === v && d.isParallelRisk))
  );
  const stateStoreDecl = needsStateStore ? `  const stateStore = (global as any).__stateStore ??= {}; // ⚠️ PARALLEL RISK\n` : '';
  const flowWarning = node && node.setNextTargets.length > 0
    ? `  // ⚠️ [WORKFLOW] setNextRequest → [${node.setNextTargets.join(', ')}]\n` : '';

  if (node && node.setNextTargets.includes(item.name)) {
    validationIssues.push(`#### 🔄 POLLING DETECTED: ${item.name}\n- **สาเหตุ:** setNextRequest เรียกตัวเอง\n- **วิธีแก้:** ครอบ Action ด้วย \`await expect.poll(() => ...)\` หรือ \`do...while\``);
  }

  // ── Header & Body Setup ──
  const headerEntries: string[] = [];
  if (auth?.type === 'bearer') {
    const tokenVar = auth.bearer?.find((b: any) => b.key === 'token')?.value || '';
    headerEntries.push(`      'Authorization': \`Bearer ${tokenVar.replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => `\${process.env['${k}']}`)}\``);
  } else if (auth?.type === 'basic') {
    headerEntries.push(`      'Authorization': \`Basic \${Buffer.from(\`\${process.env['username']}:\${process.env['password']}\`).toString('base64')}\``);
  }
  headers.forEach((h: any) => {
    if (!h.key || IGNORED_HEADERS.includes(h.key.toLowerCase())) return;
    const val = String(h.value || '').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => `\${process.env['${k}']}`);
    headerEntries.push(`      '${h.key}': \`${val}\``);
  });

  let bodyData = 'undefined';
  let bodyTypeSnippet = '';
  if (bodyMode === 'raw' && typeof rawBody === 'string' && rawBody.trim()) {
    bodyData = `\`${rawBody.replace(/`/g, '\\`').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => `\${process.env['${k}']}`)}\``;
    bodyTypeSnippet = `data: requestBody,`;
  } else if (bodyMode === 'formdata' && Array.isArray(rawBody)) {
    const entries = rawBody.filter((f: any) => !f.disabled).map((f: any) =>
      f.type === 'file' ? `      '${f.key}': fs.createReadStream('test-data/${f.src || 'file'}'),` : `      '${f.key}': \`${String(f.value || '').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => `\${process.env['${k}']}`)}\`,`
    );
    bodyData = `{\n${entries.join('\n')}\n    }`;
    bodyTypeSnippet = `multipart: requestBody,`;
  } else if (bodyMode === 'urlencoded' && Array.isArray(rawBody)) {
    const entries = rawBody.filter((f: any) => !f.disabled).map((f: any) =>
      `      '${f.key}': \`${String(f.value || '').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => `\${process.env['${k}']}`)}\`,`
    );
    bodyData = `{\n${entries.join('\n')}\n    }`;
    bodyTypeSnippet = `form: requestBody,`;
  } else if (bodyMode === 'graphql' && item.request.body?.graphql) {
    const gql = item.request.body.graphql;
    const gqlQuery = String(gql.query || '').replace(/`/g, '\\`').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => { extractVarsFromText(`{{${k}}}`, itemVars); return `\${process.env['${k}']}`; });
    const gqlVars = String(gql.variables || '').replace(/`/g, '\\`').replace(/\{\{([^}]+)\}\}/g, (_: string, k: string) => { extractVarsFromText(`{{${k}}}`, itemVars); return `\${process.env['${k}']}`; });
    const varsParsed = gqlVars.trim() ? `JSON.parse(\`${gqlVars}\`)` : '{}';
    bodyData = `JSON.stringify({\n      query: \`${gqlQuery}\`,\n      variables: ${varsParsed},\n    })`;
    bodyTypeSnippet = `data: requestBody,`;
    if (!headerEntries.some(h => h.includes('Content-Type'))) {
      headerEntries.unshift(`      'Content-Type': 'application/json'`);
    }
    validationIssues.push(`#### ℹ️ [${method}] ${item.name}\n- **Body:** GraphQL mode\n- **วิธีใช้:** ส่ง query/variables ผ่าน JSON body (Content-Type: application/json)`);
  }

  const responseType = detectResponseType(testExec);
  const responseSnippet = buildResponseSnippet(responseType);
  const preRequestBlock = preRequestExec.length > 0 ? `  // ━━━ ⚡ Pre-Request ━━━\n${convertPreRequest(preRequestExec, method, item.name)}\n` : '';
  const testBlock = testExec.length > 0 ? `  // ━━━ ✅ Assertions ━━━\n${convertTestScript(testExec, method, item.name, itemVars)}` : '';

  const isPolling = node && node.setNextTargets.includes(item.name);
  let actionBlock = '';

  if (isPolling) {
    actionBlock = [
      `  // ━━━ 🎬 Action (Polling) ━━━`,
      `  // 💡 Postman setNextRequest to self detected. Playwright best practice uses expect.poll`,
      `  await expect.poll(async () => {`,
      `    const res = await request.${method.toLowerCase()}(url.toString(), { headers: dynamicHeaders, ${bodyTypeSnippet} });`,
      `    const json = await res.json();`,
      `    return json.status; // ⚠️ Update this to the field you are polling (e.g., json.payload.status)`,
      `  }, {`,
      `    message: 'Wait for ${item.name} status to be SUCCESS',`,
      `    intervals: [2000, 5000, 10000], // Backoff intervals`,
      `    timeout: 60000,`,
      `  }).toBe('SUCCESS'); // ⚠️ Update this to your expected completion value`,
      ``,
      `  // Perform one last fetch to get the final response object for the assertions below`,
      `  const _startTime = Date.now();`,
      `  const response = await request.${method.toLowerCase()}(url.toString(), { headers: dynamicHeaders, ${bodyTypeSnippet} });`
    ].join('\n');
  } else {
    actionBlock = [
      `  // ━━━ 🎬 Action ━━━`,
      `  const _startTime = Date.now();`,
      `  const response = await request.${method.toLowerCase()}(url.toString(), {`,
      `    headers: dynamicHeaders,`,
      `    ${bodyTypeSnippet}`,
      `  });`
    ].join('\n');
  }

  return [
    `test('${item.name}', async ({ request }) => {`,
    stateStoreDecl + flowWarning + replaceInHelper,
    `  let requestBody: any = ${bodyData};`,
    `  let dynamicHeaders = {\n${headerEntries.join(',\n')}\n    };`,
    `  const url = new URL(\`${playwrightUrlBase}\`);`,
    (preRequestBlock ? preRequestBlock : ''),
    actionBlock,
    responseSnippet,
    `  const responseHeaders = response.headers();`,
    testBlock,
    `});`,
  ].filter(s => s !== null && s !== undefined && s !== '').join('\n');
}

// ── NESTED DESCRIBE TREE ──
type TreeNode = { name: string; tests: string[]; children: Map<string, TreeNode> };
function makeNode(name: string): TreeNode { return { name, tests: [], children: new Map() }; }
const describeTree: TreeNode = makeNode('__root__');
function insertToTree(node: TreeNode, pathParts: string[], snippet: string) {
  if (pathParts.length === 0) { node.tests.push(snippet); return; }
  const [head, ...tail] = pathParts;
  if (!node.children.has(head)) node.children.set(head, makeNode(head));
  insertToTree(node.children.get(head)!, tail, snippet);
}
function renderTree(node: TreeNode, indent = ''): string {
  let out = '';
  node.tests.forEach(t => { out += `${indent}${t.split('\n').join('\n' + indent)}\n\n`; });
  node.children.forEach((child, name) => {
    out += `${indent}describe('${name}', () => {\n`;
    out += renderTree(child, indent + '  ');
    out += `${indent}});\n\n`;
  });
  return out;
}

// ── PARSE ITEMS (flat MD + build tree) ──
function parseItems(items: any[], level = 2, pathParts: string[] = [], folderChain: any[] = []): string {
  let content = '';
  items.forEach((item: any) => {
    const prefix = '#'.repeat(Math.min(level, 6));
    const currentPathParts = [...pathParts, item.name];
    if (item.item && Array.isArray(item.item)) {
      content += `\n${prefix} 📁 Folder: ${item.name}\n\n`;
      content += parseItems(item.item, level + 1, currentPathParts, [...folderChain, item]);
    } else if (item.request) {
      const method = item.request.method || '';
      const url = item.request.url?.raw || '';
      const resolvedAuth = resolveAuth(item, folderChain);
      const authType = resolvedAuth ? resolvedAuth.type : 'none';
      const snippet = generateSnippet(item, folderChain);
      if (url.startsWith('http:')) validationIssues.push(`#### ⚠️ [${method}] ${item.name}\n- **สาเหตุ:** URL ใช้ HTTP\n- **วิธีแก้:** เปลี่ยนเป็น HTTPS`);
      insertToTree(describeTree, pathParts, snippet);
      const topFolder = pathParts[0] || 'General';
      if (!testGroups.has(topFolder)) testGroups.set(topFolder, []);
      testGroups.get(topFolder)!.push(snippet);
      content += `\n### ${item.name}\n`;
      content += `**Endpoint:** \`${method} ${url}\`\n\n`;
      content += `> 🔐 **Auth:** ${authType}\n\n`;
      const prereqLines = item.event?.find((ev: any) => ev.listen === 'prerequest')?.script?.exec || [];
      if (prereqLines.length > 0) content += `**⚡ Pre-request Script (Original):**\n\`\`\`javascript\n${prereqLines.join('\n').replace(/\r/g, '')}\n\`\`\`\n\n`;
      content += `\`\`\`typescript\n${snippet}\n\`\`\`\n\n---\n`;
    }
  });
  return content;
}

// ── PASS 1 EXECUTION ──
buildExecutionGraph(data.item || []);
const stateDeps = analyzeStateDependencies();
const parallelRisks = stateDeps.filter(d => d.isParallelRisk);
if (parallelRisks.length > 0) {
  console.warn(`\n⚠️  Parallel Risk Variables (${parallelRisks.length}):`);
  parallelRisks.forEach(d => console.warn(`   • ${d.variable}: set by [${d.setBy.join(', ')}], used by [${d.usedBy.join(', ')}]`));
}

// ── RUN ──
async function run() {
  let rootItems = data.item || [];
  let finalFolderName = path.basename(filePath, '.postman_collection.json').replace(/\.json$/, '');

  let targetFolderList = rootItems;
  while (targetFolderList.length === 1 && targetFolderList[0].item && Array.isArray(targetFolderList[0].item)) {
    targetFolderList = targetFolderList[0].item;
  }

  if (targetFolder) {
    const filtered = targetFolderList.find((f: any) => f.name === targetFolder);
    if (!filtered) { console.error(`❌ Folder '${targetFolder}' not found!`); process.exit(1); }
    rootItems = [filtered];
    finalFolderName = targetFolder;
  } else {
    // Always process ALL folders → separate .md files per folder
    const resolvedOutput = await resolveOutputPath();
    let baseDir = resolvedOutput;
    if (resolvedOutput.toLowerCase().endsWith('.md')) baseDir = path.dirname(resolvedOutput);
    const collectionFolderName = toKebabCase(data.info?.name || 'Collection');
    const baseDirLeaf = path.basename(baseDir).toLowerCase();
    const outputDir = baseDirLeaf === collectionFolderName.toLowerCase()
      ? baseDir
      : path.join(baseDir, collectionFolderName);

    const foldersToProcess = targetFolderList.filter((i: any) => i.item);
    if (foldersToProcess.length > 0) {
      console.log(`\n✅ Processing ALL ${foldersToProcess.length} folders → separate .md files`);
      for (const folder of foldersToProcess) {
        await generateForFolder([folder], folder.name, outputDir);
      }
      console.log(`\n📊 ALL_FOLDERS Summary: ${foldersToProcess.length} folders processed`);
      return;
    }
    // No sub-folders — treat entire collection as single file
    rootItems = targetFolderList;
  }

  // Single folder mode
  const collectionFolderName = toKebabCase(data.info?.name || 'Collection');
  const resolvedOutput = await resolveOutputPath();
  let baseDir = resolvedOutput;
  if (resolvedOutput.toLowerCase().endsWith('.md')) baseDir = path.dirname(resolvedOutput);
  const baseDirLeaf = path.basename(baseDir).toLowerCase();
  const outputDir = baseDirLeaf === collectionFolderName.toLowerCase()
    ? baseDir
    : path.join(baseDir, collectionFolderName);

  await generateForFolder(rootItems, finalFolderName, outputDir);
}

/** Reset mutable global state before processing a new folder */
function resetGlobalState() {
  totalRequests = 0;
  validationIssues.length = 0;
  testGroups.clear();
  globalEnvVarsUsed.clear();
  importsNeeded.clear();
  importsNeeded.add('{ test, expect } from "@playwright/test"');
  describeTree.tests.length = 0;
  describeTree.children.clear();
}

/** Generate a single .md file for the given items (one folder) */
async function generateForFolder(items: any[], folderName: string, outputDir: string) {
  resetGlobalState();

  const fileName = toKebabCase(folderName);
  const finalOutputPath = path.join(outputDir, `${fileName}.md`);

  const endpointsContent = parseItems(items, 2, [], []);

  // Collection Variables section
  let collectionVarSection = `## 📦 Collection Variables\n\n`;
  if (collectionVars.length === 0) {
    collectionVarSection += `> No Collection Variables found\n\n`;
  } else {
    collectionVarSection += `| Key | Type | Notes |\n|-----|------|-------|\n`;
    collectionVars.forEach((v: any) => {
      const val = String(v.value || '');
      const isFn = val.trim().startsWith('(function') || (val.includes('=>') && val.length > 80);
      const type = isFn ? '🔧 Function' : '📝 Value';
      const note = isFn ? `Extract to \`CollectionHelpers.${v.key}()\`` : val.length > 60 ? val.substring(0, 60) + '...' : val;
      collectionVarSection += `| \`${v.key}\` | ${type} | ${note} |\n`;
    });
    if (functionVars.length > 0) {
      collectionVarSection += `\n### 🧰 Function Variables → Playwright Helpers\n\n`;
      collectionVars.forEach((v: any) => {
        const val = String(v.value || '');
        if (val.includes('function') || val.includes('=>')) {
          collectionVarSection += `#### 🔗 Helper: \`${v.key}\`\n\n**Raw Postman Logic:**\n\`\`\`javascript\n${val}\n\`\`\`\n\n**Proposed Playwright Structure:**\n\`\`\`typescript\n  static async ${v.key}(/* define params */) {\n    // TODO: Migrate logic above\n  }\n\`\`\`\n\n`;
        }
      });
    }
  }

  // Env Variables section
  let envVarSection = `## 🌍 Required Environment Variables\n\n`;
  if (globalEnvVarsUsed.size === 0) {
    envVarSection += `> No environment variables used\n\n`;
  } else {
    envVarSection += `> Create a \`.env\` file:\n\n\`\`\`properties\n`;
    Array.from(globalEnvVarsUsed).sort().forEach(v => { envVarSection += `${v}=\n`; });
    envVarSection += `\`\`\`\n\n**Playwright process.env declarations:**\n\n\`\`\`typescript\n`;
    Array.from(globalEnvVarsUsed).sort().forEach(v => { envVarSection += `const ${varRegistry.register(v)} = process.env['${v}'];\n`; });
    envVarSection += `\`\`\`\n\n`;
    envVarSection += `## 🔗 Used Variables (Machine-Readable)\n\n<!-- AUTO-GENERATED: pass to readPostmanEnv as --used-vars -->\n\`\`\`used-vars\n`;
    envVarSection += Array.from(globalEnvVarsUsed).sort().join(',') + '\n';
    envVarSection += `\`\`\`\n\n`;
  }

  // Nested describe section
  let groupedSection = `## 🎭 Full Playwright Test Suite (Nested describe)\n\n\`\`\`typescript\nimport { test, expect } from '@playwright/test';\nimport { CollectionHelpers } from './helpers/CollectionHelpers';\n\n`;
  groupedSection += renderTree(describeTree);
  groupedSection += `\`\`\`\n\n`;

  // Standard imports section
  const importsSection = `## 📦 Standard Imports\n\`\`\`typescript\n${Array.from(importsNeeded).map(i => `import ${i};`).join('\n')}\n\`\`\`\n\n---\n\n`;

  // Validation issues grouped
  varRegistry.getCollisions().forEach(c => { if (!validationIssues.includes(c)) validationIssues.push(c); });
  parallelRisks.forEach(d => {
    const msg = `#### 🔴 PARALLEL RISK: ${d.variable}\n- **set by:** [${d.setBy.join(', ')}]\n- **used by:** [${d.usedBy.join(', ')}]\n- **วิธีแก้:** ใช้ \`stateStore\` + \`test.describe.serial\``;
    if (!validationIssues.includes(msg)) validationIssues.push(msg);
  });

  // ── STRUCTURE SUMMARY (for AI to read without loading full MD) ──────────────
  function buildStructureSummary(): string {
    // Auth strategy
    const authTypes = new Set<string>();
    const collectAuth = (items: any[]) => {
      items.forEach((item: any) => {
        if (item.item) { collectAuth(item.item); return; }
        const auth = resolveAuth(item, []);
        if (auth?.type) authTypes.add(auth.type);
      });
    };
    collectAuth(data.item || []);
    const authStr = authTypes.size === 0 ? 'none' : [...authTypes].join(', ');
    const authStrategy = authTypes.has('basic')
      ? 'Basic Auth (hardcoded) — ใส่ใน fixture ครั้งเดียว ไม่ต้อง login'
      : authTypes.has('bearer')
        ? 'Bearer Token — login ครั้งเดียวใน globalSetup หรือ beforeAll แล้ว share token'
        : authTypes.has('oauth2')
          ? 'OAuth2 — fetch token ใน beforeAll แล้ว share ผ่าน stateStore'
          : `${authStr} — ตรวจสอบ auth strategy ด้วยมือ`;

    // Top-level folders
    let topFolderList = data.item || [];
    while (topFolderList.length === 1 && topFolderList[0].item) topFolderList = topFolderList[0].item;
    const topFolders = topFolderList.filter((i: any) => i.item).map((i: any) => i.name);

    // Shared patterns — find request names that appear in 2+ folders
    const requestNamesByFolder = new Map<string, Set<string>>();
    const collectRequestNames = (items: any[], folderName: string) => {
      items.forEach((item: any) => {
        if (item.item) { collectRequestNames(item.item, folderName); return; }
        if (!item.request) return;
        if (!requestNamesByFolder.has(folderName)) requestNamesByFolder.set(folderName, new Set());
        requestNamesByFolder.get(folderName)!.add(item.name);
      });
    };
    topFolderList.forEach((f: any) => { if (f.item) collectRequestNames(f.item, f.name); });

    const allRequestNames = new Map<string, string[]>();
    requestNamesByFolder.forEach((names, folder) => {
      names.forEach(name => {
        if (!allRequestNames.has(name)) allRequestNames.set(name, []);
        allRequestNames.get(name)!.push(folder);
      });
    });
    const sharedPatterns = [...allRequestNames.entries()]
      .filter(([, folders]) => folders.length >= 2)
      .map(([name, folders]) => `\`${name}\` (${folders.length} folders)`);

    // Cross-folder stateStore vars
    const crossFolderVars = stateDeps
      .filter(d => d.isParallelRisk)
      .map(d => `\`${d.variable}\` (set: ${d.setBy.slice(0, 2).join(', ')}${d.setBy.length > 2 ? '...' : ''} → used: ${d.usedBy.slice(0, 2).join(', ')}${d.usedBy.length > 2 ? '...' : ''})`);

    // Runtime-set vars (set by pm.environment.set)
    const runtimeSetVars = stateDeps.filter(d => d.setBy.length > 0).map(d => d.variable);

    let s = `## 🏗️ Structure Summary (AI reads this — not the full MD)\n\n`;
    s += `> **Purpose:** AI uses this section to design test structure before generating code.\n\n`;
    s += `### Auth Strategy\n`;
    s += `- **Type:** ${authStr}\n`;
    s += `- **Recommendation:** ${authStrategy}\n\n`;
    s += `### Top-Level Folders (${topFolders.length})\n`;
    topFolders.forEach((f: string) => { s += `- \`${f}\`\n`; });
    s += `\n`;
    if (sharedPatterns.length > 0) {
      s += `### Shared Patterns (reuse across folders)\n`;
      s += `> These request names appear in multiple folders — consider shared Service classes.\n\n`;
      sharedPatterns.slice(0, 10).forEach(p => { s += `- ${p}\n`; });
      if (sharedPatterns.length > 10) s += `- ... and ${sharedPatterns.length - 10} more\n`;
      s += `\n`;
    }
    if (crossFolderVars.length > 0) {
      s += `### Cross-Folder State Dependencies\n`;
      s += `> These vars are set in one folder and used in another — use global \`stateStore\`.\n\n`;
      crossFolderVars.forEach(v => { s += `- ${v}\n`; });
      s += `\n`;
    }
    if (runtimeSetVars.length > 0) {
      s += `### Runtime-Set Variables (use stateStore, NOT process.env)\n`;
      s += `\`\`\`\n${runtimeSetVars.join(', ')}\n\`\`\`\n\n`;
    }
    s += `### Recommended File Structure\n`;
    s += `\`\`\`\n`;
    s += `tests-api/${toKebabCase(data.info?.name || 'collection')}/\n`;
    topFolders.forEach((f: string) => { s += `├── ${toKebabCase(f)}/\n`; });
    s += `helpers/${toKebabCase(data.info?.name || 'collection')}/\n`;
    if (sharedPatterns.length > 0) s += `├── shared/          ← shared services (reused across folders)\n`;
    topFolders.forEach((f: string) => { s += `├── ${toKebabCase(f)}/\n`; });
    s += `fixtures/${toKebabCase(data.info?.name || 'collection')}/\n`;
    topFolders.forEach((f: string) => { s += `├── ${toKebabCase(f)}/\n`; });
    s += `\`\`\`\n\n`;
    s += `---\n\n`;
    return s;
  }

  const structureSummary = buildStructureSummary();

  let md = `# 📖 ${data.info?.name || 'Postman Collection'} — Migration Report (v6.0)\n\n`;
  md += `**Source:** \`${path.basename(filePath)}\`\n`;
  md += `**Total Requests:** ${totalRequests}\n`;
  md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n---\n\n`;
  md += structureSummary;
  md += importsSection;
  if (validationIssues.length > 0) md += `## 🚨 Validation Issues (${validationIssues.length})\n\n${validationIssues.join('\n\n')}\n\n---\n\n`;
  md += collectionVarSection + `---\n\n`;
  md += envVarSection + `---\n\n`;
  md += `## 📋 API Endpoints\n\n` + endpointsContent;
  md += groupedSection;

  function smartWrite(targetPath: string, mdContent: string) {
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(targetPath)) { fs.writeFileSync(targetPath, mdContent, 'utf-8'); console.log(`✅ Created: ${targetPath}`); return; }
    const existing = fs.readFileSync(targetPath, 'utf-8');
    const placeholder = '(Pending postmanSpecialist.md)';
    if (existing.includes(placeholder)) { fs.writeFileSync(targetPath, existing.replace(placeholder, mdContent), 'utf-8'); console.log(`✅ Replaced placeholder: ${targetPath}`); }
    else { fs.writeFileSync(targetPath, mdContent, 'utf-8'); console.log(`✅ Overwritten: ${targetPath}`); }
  }

  smartWrite(finalOutputPath, md);
  console.log(`\n📊 Summary [${folderName}]:`);
  console.log(`   Total Requests    : ${totalRequests}`);
  console.log(`   Collection Vars   : ${collectionVars.length} (${functionVars.length} functions)`);
  console.log(`   Env Vars Required : ${globalEnvVarsUsed.size}`);
  console.log(`   Validation Issues : ${validationIssues.length}`);
  console.log(`   Test Groups       : ${testGroups.size}`);
}

run().catch(console.error);
