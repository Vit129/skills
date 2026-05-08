/**
 * @file readPostmanEnv.ts
 * @version 6.0 - dev.md format + v4 capabilities (9 types, --used-vars, machine-readable)
 */
import * as fs from 'fs';
import * as path from 'path';
import { select } from '@inquirer/prompts';

// ── VAR REGISTRY ──
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

function toLowerCamelCase(str: string): string {
  return str.replace(/[^a-zA-Z ]/g, ' ').trim().split(/\s+/)
    .map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function findProjectRoot(start: string): string | null {
  let dir = start;
  while (true) {
    if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

// ── ARG PARSING ──
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Usage: npx ts-node readPostmanEnv.ts <environment.json> --output <out_dir> [--used-vars <vars>]');
  process.exit(1);
}
const filePath = path.resolve(args[0]);
const outputIndex = args.indexOf('--output');
const outputArgPath = outputIndex !== -1 ? path.resolve(args[outputIndex + 1]) : null;
const collectionIndex = args.indexOf('--collection');
const collectionArg = collectionIndex !== -1 ? args[collectionIndex + 1] : null;
const usedVarsIndex = args.indexOf('--used-vars');
const usedVarsFilter: Set<string> | null = usedVarsIndex !== -1 && args[usedVarsIndex + 1]
  ? new Set(args[usedVarsIndex + 1].split(',').map(s => s.trim()).filter(Boolean))
  : null;

async function resolveOutputPath(): Promise<string> {
  if (outputArgPath) return outputArgPath;
  const isTestProject = (r: string) =>
    fs.existsSync(path.join(r, 'playwright.config.ts')) ||
    fs.existsSync(path.join(r, 'playwright.config.js')) ||
    fs.existsSync(path.join(r, 'tsconfig.json'));
  const allRoots = [process.cwd(), path.dirname(filePath)].map(findProjectRoot).filter((r): r is string => r !== null);
  const uniqueRoots = [...new Set(allRoots)].filter(isTestProject);
  let root: string;
  if (uniqueRoots.length > 1) {
    root = await select({
      message: '🔍 เลือก PROJECT_ROOT (Use Arrow Keys):',
      pageSize: 10,
      choices: uniqueRoots.map((r, i) => ({ name: `Option ${i + 1}: ${r}`, value: r }))
    });
  } else {
    root = uniqueRoots[0] ?? process.cwd();
  }
  const testsApiDir = path.join(root, 'tests-api');
  if (collectionArg) return path.join(testsApiDir, collectionArg);
  if (!fs.existsSync(testsApiDir) || fs.readdirSync(testsApiDir).filter(f => fs.statSync(path.join(testsApiDir, f)).isDirectory()).length === 0) {
    console.error('❌ ไม่พบ folder ใน tests-api/ กรุณารัน readPostmanCollection.ts ก่อน');
    console.error(`   Expected: ${testsApiDir}`);
    console.error('   Usage: npx ts-node readPostmanCollection.ts <collection.json> --output <out_dir>');
    process.exit(1);
  }
  const folders = fs.readdirSync(testsApiDir).filter(f => fs.statSync(path.join(testsApiDir, f)).isDirectory());
  const selected = await select({
    message: '📂 Select a collection folder (Use Arrow Keys):',
    pageSize: 15,
    choices: folders.map((f, i) => ({ name: `Option ${i + 1}: ${f}`, value: f }))
  });
  return path.join(testsApiDir, selected);
}

let data: any;
try { data = JSON.parse(fs.readFileSync(filePath, 'utf-8')); }
catch { console.error('❌ Error: Cannot read or parse JSON file'); process.exit(1); }

console.log(`\n🌍 Environment: ${data.name}`);
console.log(`📋 Total Variables: ${data.values?.length || 0}`);

// ── TYPE DETECTION (9 types) ──
type VarType = 'URL' | 'TOKEN' | 'OBJECT' | 'ARRAY' | 'NUMBER' | 'BOOLEAN' | 'DYNAMIC' | 'EMPTY' | 'TEXT';
const SENSITIVE_KEYWORDS = ['password','secret','token','key','auth','credential','cred','pwd','pin','pass'];
const DYNAMIC_TEMP_KEYWORDS = ['temp','tmp','cache','session','xsrf','csrf','created','result','random'];

function isSensitive(key: string): boolean { return SENSITIVE_KEYWORDS.some(k => key.toLowerCase().includes(k)); }
function isDynamicTemp(key: string): boolean { return DYNAMIC_TEMP_KEYWORDS.some(k => key.toLowerCase().includes(k)); }

function detectType(value: any): VarType {
  if (value === null || value === undefined) return 'EMPTY';
  if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
    try { JSON.parse(value); return value.startsWith('[') ? 'ARRAY' : 'OBJECT'; } catch {}
  }
  if (typeof value === 'object' && !Array.isArray(value)) return 'OBJECT';
  if (Array.isArray(value)) return 'ARRAY';
  if (typeof value === 'boolean') return 'BOOLEAN';
  const str = String(value);
  if (str.trim() === '') return 'EMPTY';
  if (str.startsWith('http://') || str.startsWith('https://')) return 'URL';
  if (!isNaN(Number(str)) && str.trim() !== '') return 'NUMBER';
  if (/^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(str)) return 'TOKEN';
  if (str.length > 30 && /^[a-z0-9_\-\.]+$/i.test(str)) return 'DYNAMIC';
  return 'TEXT';
}

interface VarAnalysis { type: VarType; sensitive: boolean; dynamic: boolean; playwrightNote: string; dotenvValue: string; }

function analyzeVar(key: string, rawValue: any, enabled: boolean): VarAnalysis {
  const type = detectType(rawValue);
  const sensitive = isSensitive(key);
  const dynamic = isDynamicTemp(key);
  let playwrightNote = '';
  let dotenvValue = '';

  const resolvedValue = String(rawValue || '').replace(/\{\{([^}]+)\}\}/g, (_, k) => {
    const found = data.values?.find((v: any) => v.key === k);
    return found ? String(found.value || '') : `\${process.env['${k}']}`;
  });

  switch (type) {
    case 'EMPTY':
      dotenvValue = '';
      playwrightNote = `const ${varRegistry.register(key)}: string = process.env['${key}'] || '';`;
      break;
    case 'URL':
      dotenvValue = resolvedValue;
      playwrightNote = `const ${varRegistry.register(key)}: string = process.env['${key}'] || '';`;
      break;
    case 'TOKEN':
      dotenvValue = rawValue;
      playwrightNote = `const ${varRegistry.register(key)}: string = process.env['${key}'] || ''; // inject via CI`;
      break;
    case 'OBJECT':
      dotenvValue = typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue);
      playwrightNote = `const ${varRegistry.register(key)}: any = JSON.parse(process.env['${key}'] || '{}');`;
      break;
    case 'ARRAY':
      dotenvValue = typeof rawValue === 'string' ? rawValue : JSON.stringify(rawValue);
      playwrightNote = `const ${varRegistry.register(key)}: any[] = JSON.parse(process.env['${key}'] || '[]');`;
      break;
    case 'BOOLEAN':
      dotenvValue = String(rawValue);
      playwrightNote = `const ${varRegistry.register(key)}: boolean = process.env['${key}'] === 'true';`;
      break;
    case 'NUMBER':
      dotenvValue = String(rawValue);
      playwrightNote = `const ${varRegistry.register(key)}: number = Number(process.env['${key}'] || 0);`;
      break;
    case 'DYNAMIC':
      dotenvValue = String(rawValue);
      playwrightNote = `const ${varRegistry.register(key)}: string = process.env['${key}'] || ''; // may be set at runtime`;
      break;
    default: // TEXT
      dotenvValue = resolvedValue;
      playwrightNote = `const ${varRegistry.register(key)}: string = process.env['${key}'] || '';`;
  }
  if (sensitive && type !== 'EMPTY' && type !== 'TOKEN') {
    playwrightNote = `const ${varRegistry.register(key)}: string = process.env['${key}'] || ''; // 🔐 SENSITIVE`;
  }
  return { type, sensitive, dynamic, playwrightNote, dotenvValue };
}

// ── PARSE VARS ──
type ParsedVar = { key: string; rawValue: any; enabled: boolean; analysis: VarAnalysis };
const parsedVars: ParsedVar[] = (data.values || [])
  .filter((v: any) => v.key)
  .map((v: any) => ({ key: v.key, rawValue: v.value, enabled: v.enabled !== false, analysis: analyzeVar(v.key, v.value, v.enabled !== false) }));

const filteredVars: ParsedVar[] = usedVarsFilter ? parsedVars.filter(p => usedVarsFilter.has(p.key)) : parsedVars;
const unusedVars: ParsedVar[] = usedVarsFilter ? parsedVars.filter(p => !usedVarsFilter.has(p.key)) : [];

// ── RUN ──
async function run() {
  const envName = data.name || 'environment';
  // ชื่อไฟล์: จาก .json filename → lowerCamelCase (ตัด .postman_environment*.json)
  const jsonBaseName = path.basename(filePath).replace(/\.postman_environment[^.]*\.json$/i, '').replace(/\.json$/i, '');
  const fileName = `${toLowerCamelCase(jsonBaseName)}.md`;
  const finalDir = await resolveOutputPath();
  if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });

  const secretKeys: string[] = filteredVars.filter(p => p.enabled && (p.analysis.sensitive || p.analysis.type === 'TOKEN')).map(p => p.key);

  // .env snippet
  let dotenvSnippet = `# Environment: ${envName}\n`;
  if (usedVarsFilter) dotenvSnippet += `# Filtered: only vars used by collection\n`;
  filteredVars.forEach(({ key, analysis, enabled }) => {
    if (!enabled) return;
    const isSecret = analysis.sensitive || analysis.type === 'TOKEN';
    dotenvSnippet += `${key}=${isSecret ? '# ⚠️ SECRET — fill manually' : (analysis.dotenvValue || '')}\n`;
  });
  if (secretKeys.length > 0) dotenvSnippet += `\n# ⚠️ Secret keys (Postman does not export values): ${secretKeys.join(', ')}\n`;

  // Playwright declarations
  let playwrightSnippet = '';
  filteredVars.forEach(({ enabled, analysis }) => {
    if (!enabled) return;
    playwrightSnippet += `${analysis.playwrightNote}\n`;
  });

  // Machine-readable section
  const machineReadable = filteredVars
    .filter(({ analysis }) => analysis.playwrightNote && analysis.playwrightNote.startsWith('const '))
    .map(({ key, analysis }) => {
      const declLine = analysis.playwrightNote.split('\n').find(l => l.trim().startsWith('const '));
      return declLine ? `${key}:::${declLine.trim()}` : null;
    }).filter(Boolean).join('\n');

  // Env Summary (for AI to read without loading full MD)
  const urlVars    = filteredVars.filter(p => p.enabled && p.analysis.type === 'URL').map(p => p.key);
  const secretVars = filteredVars.filter(p => p.enabled && (p.analysis.sensitive || p.analysis.type === 'TOKEN')).map(p => p.key);
  const emptyVars  = filteredVars.filter(p => p.enabled && p.analysis.type === 'EMPTY').map(p => p.key);
  const runtimeVars = filteredVars.filter(p => p.enabled && p.analysis.dynamic).map(p => p.key);

  let envSummary = `## 🏗️ Env Summary (AI reads this — not the full MD)\n\n`;
  envSummary += `> **Purpose:** AI uses this to understand env vars before generating code.\n\n`;
  envSummary += `| Category | Count | Keys |\n|----------|-------|------|\n`;
  envSummary += `| 🌐 Base URLs | ${urlVars.length} | ${urlVars.join(', ') || '—'} |\n`;
  envSummary += `| 🔐 Secrets (fill manually) | ${secretVars.length} | ${secretVars.join(', ') || '—'} |\n`;
  envSummary += `| ⚡ Runtime-set (stateStore) | ${runtimeVars.length} | ${runtimeVars.slice(0, 8).join(', ')}${runtimeVars.length > 8 ? '...' : ''} |\n`;
  envSummary += `| 📭 Empty (set at runtime) | ${emptyVars.length} | ${emptyVars.slice(0, 8).join(', ')}${emptyVars.length > 8 ? '...' : ''} |\n\n`;
  if (secretVars.length > 0) {
    envSummary += `> ⚠️ **Secrets not exported by Postman:** ${secretVars.join(', ')} — must be filled manually in \`.env\`\n\n`;
  }
  envSummary += `---\n\n`;

  // Assemble MD (dev.md format)
  let md = `# 🌍 Environment Analysis: ${envName} (v6.0)\n\n`;
  md += `**Source:** \`${path.basename(filePath)}\`\n\n`;
  if (unusedVars.length > 0) md += `> **Filtered:** ${filteredVars.length} used, ${unusedVars.length} unused\n\n`;
  md += envSummary;
  md += `## 📝 .env Snippet\n\`\`\`properties\n${dotenvSnippet}\`\`\`\n\n---\n\n`;
  md += `## 🎭 Playwright Declarations\n\`\`\`typescript\n${playwrightSnippet}\`\`\`\n`;
  if (machineReadable) {
    md += `\n## 🔌 Machine-Readable Declarations\n\n<!-- AUTO-GENERATED: used by AI during Step 3 generation -->\n\`\`\`env-declarations\n${machineReadable}\n\`\`\`\n`;
  }

  fs.writeFileSync(path.join(finalDir, fileName), md, 'utf-8');
  console.log(`✅ Complete: ${path.join(finalDir, fileName)}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total Variables   : ${parsedVars.length}`);
  if (usedVarsFilter) { console.log(`   Used by collection: ${filteredVars.length}`); console.log(`   Unused (skipped)  : ${unusedVars.length}`); }
  console.log(`   Secret Keys       : ${secretKeys.length}`);
}

run().catch(console.error);
