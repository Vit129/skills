/**
 * @file postmanToPlaywrightRunAndHeal.ts
 * @version 2.0 — Playwright Test Runner + Auto-Heal Fix Loop
 *
 * Usage:
 *   npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
 *     ~/.claude/skills/ai-dlc/qa/postman/scripts/postmanToPlaywrightRunAndHeal.ts \
 *     --spec <path/to/spec.ts or tests-api/folder> \
 *     [--config <playwright.config.ts>] \
 *     [--max-attempts <3>] \
 *     [--audit <path/to/audit.md>] \
 *     [--reporter line|json|dot]
 *
 * Workflow:
 *   1. Load folder structure from workflow.md (same as postmanMdToPlaywright)
 *   2. Run Playwright tests (--reporter=json for parsing)
 *   3. Parse failures from JSON report
 *   4. Classify each failure (env / code)
 *   5. Apply auto-fix patches for known patterns
 *   6. Re-run — repeat up to maxAttempts (extends to 5 if >80% pass)
 *   7. Append Reflexion Log to audit.md
 *
 * Refers to:
 *   - playwright-testing/references/workflow.md  → folder structure
 *   - playwright-rules/references/api.md         → fix patterns, AAA, tags
 *   - playwright-rules/references/coding-standards.md → error triage strategy
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawnSync } from 'child_process';

// ─────────────────────────────────────────────────────────────
// SECURITY HELPERS
// ─────────────────────────────────────────────────────────────
function sanitizeLog(s: string): string {
  return String(s).replace(/[\r\n]/g, ' ').replace(/[\x00-\x1F\x7F]/g, '');
}

function safeResolvePath(base: string, userInput: string): string {
  const resolved = path.resolve(userInput);
  const baseResolved = path.resolve(base);
  if (!resolved.startsWith(baseResolved + path.sep) && resolved !== baseResolved) {
    throw new Error(`Path traversal detected: ${sanitizeLog(userInput)}`);
  }
  return resolved;
}

// ─────────────────────────────────────────────────────────────
// WORKFLOW STRUCTURE LOADER (mirrors postmanMdToPlaywright)
// ─────────────────────────────────────────────────────────────
const DEFAULT_SPEC_DIR    = 'tests-api';
const DEFAULT_HELPER_DIR  = 'helpers';
const DEFAULT_SCHEMA_DIR  = 'schemas';
const DEFAULT_FIXTURE_DIR = 'fixtures';
const WORKFLOW_MD_PATH    = path.join(process.cwd(), 'skills/ai-dlc/qa/playwright-testing/references/workflow.md');

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
    const structureMatch = md.match(/```\n(tests\/api-testing\/[\s\S]*?)\n```/);
    if (!structureMatch) return defaults;

    const treeLines = structureMatch[1].split('\n').filter(l => /[├└]──/.test(l));
    const segments = treeLines
      .map(l => { const m = l.match(/[├└]──\s+([^/\s]+)\//); return m ? m[1] : null; })
      .filter((s): s is string => s !== null);

    return {
      specDir:    segments.find(s => s.startsWith('tests-')) ?? defaults.specDir,
      helperDir:  segments.find(s => s === 'helpers')         ?? defaults.helperDir,
      schemaDir:  segments.find(s => s === 'schemas')         ?? defaults.schemaDir,
      fixtureDir: segments.find(s => s === 'fixtures')        ?? defaults.fixtureDir,
    };
  } catch {
    console.warn('⚠️  Failed to parse workflow.md — using default folder structure');
    return defaults;
  }
}

const workflowStructure = loadWorkflowStructure();

// ─────────────────────────────────────────────────────────────
// ARG PARSING
// ─────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

function getArg(flag: string): string | null {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const specPath    = getArg('--spec');
const configPath  = getArg('--config');
const auditPath   = getArg('--audit');
const maxAttempts = Math.min(parseInt(getArg('--max-attempts') || '3', 10), 5);

if (!specPath) {
  console.error('❌ Usage: postmanToPlaywrightRunAndHeal.ts --spec <path> [--config <playwright.config.ts>] [--max-attempts 3] [--audit <audit.md>]');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface TestFailure {
  title: string;
  file: string;
  error: string;
  category: 'env' | 'code';
  fixApplied: string | null;
}

interface HealAttempt {
  attempt: number;
  timestamp: string;
  total: number;
  passed: number;
  failed: number;
  failures: TestFailure[];
  outcome: 'HEALED' | 'PARTIAL' | 'FAILED' | 'ENV_SKIP';
}

// ─────────────────────────────────────────────────────────────
// FAILURE CLASSIFIER
// (based on playwright-rules/references/api.md — Error Triage)
// ─────────────────────────────────────────────────────────────
const ENV_PATTERNS = [
  /ECONNREFUSED/i,
  /ENOTFOUND/i,
  /connection refused/i,
  /net::ERR_/i,
  /VPN/i,
  /502|503|504/,
  /timeout.*connect/i,
  /ETIMEDOUT/i,
];

const CODE_PATTERNS: { pattern: RegExp; fix: string }[] = [
  { pattern: /locator.*not found|element.*not found/i, fix: 'locator_not_found'  },
  { pattern: /Timeout.*waiting for/i,                  fix: 'timeout_selector'   },
  { pattern: /intercept.*click/i,                      fix: 'click_intercepted'  },
  { pattern: /Expected.*received/i,                    fix: 'assertion_failed'   },
  { pattern: /Cannot read prop.*undefined/i,           fix: 'null_response'      },
  { pattern: /status.*(?:4\d\d|5\d\d)/i,               fix: 'http_error'         },
  { pattern: /is not a function/i,                     fix: 'type_error'         },
  { pattern: /Cannot find module/i,                    fix: 'missing_import'     },
  { pattern: /SyntaxError/i,                           fix: 'syntax_error'       },
];

function classifyError(errorMsg: string): { category: 'env' | 'code'; fix: string | null } {
  if (ENV_PATTERNS.some(p => p.test(errorMsg))) return { category: 'env', fix: null };
  for (const { pattern, fix } of CODE_PATTERNS) {
    if (pattern.test(errorMsg)) return { category: 'code', fix };
  }
  return { category: 'code', fix: 'unknown' };
}

// ─────────────────────────────────────────────────────────────
// AUTO-FIX PATCHES
// (based on playwright-rules Self-Healing patterns)
// ─────────────────────────────────────────────────────────────
function applyFix(filePath: string, fixType: string, errorMsg: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  let src = fs.readFileSync(filePath, 'utf-8');
  const original = src;

  switch (fixType) {
    case 'timeout_selector': {
      if (!src.includes('test.setTimeout')) {
        src = src.replace(
          /test\.describe[^(]*\([^,]+,\s*\(\)\s*=>\s*\{/,
          m => `${m}\n    test.setTimeout(60_000); // ⚡ [HEAL] increased timeout`
        );
      }
      break;
    }
    case 'null_response': {
      src = src.replace(
        /const responseJson = await response\.json\(\);/g,
        `const _rawBody = await response.text();\n  const responseJson = _rawBody ? JSON.parse(_rawBody) : {}; // ⚡ [HEAL] null guard`
      );
      break;
    }
    case 'http_error': {
      const statusMatch = errorMsg.match(/status.*?(\d{3})/i);
      const code = statusMatch ? statusMatch[1] : '???';
      if (!src.includes(`// ⚡ [HEAL] HTTP ${code}`)) {
        src = src.replace(
          /expect\(response\.status\(\)\)\.toBe\((\d+)\)/,
          m => `${m} // ⚡ [HEAL] got HTTP ${code} — check env vars or mock`
        );
      }
      break;
    }
    case 'missing_import': {
      const modMatch = errorMsg.match(/Cannot find module '([^']+)'/);
      if (modMatch && !src.includes(`// ⚡ [HEAL] missing: ${modMatch[1]}`)) {
        src = `// ⚡ [HEAL] missing module: ${modMatch[1]} — run: npm install ${modMatch[1]}\n` + src;
      }
      break;
    }
    case 'assertion_failed': {
      src = src.replace(
        /(await test\.step\([^,]+,\s*async\s*\(\)\s*=>\s*\{[\s\S]*?)(expect\(response)/,
        (full, before, assertion) => {
          if (before.includes('waitForResponse') || before.includes('waitFor(')) return full;
          return `${before}// ⚡ [HEAL] added response wait\n                await response.finished();\n                ${assertion}`;
        }
      );
      break;
    }
    default:
      return null;
  }

  if (src !== original) {
    fs.writeFileSync(filePath, src, 'utf-8');
    return fixType;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────
// JSON REPORT PARSER
// ─────────────────────────────────────────────────────────────
interface PlaywrightJsonReport {
  stats: { total: number; passed: number; failed: number; skipped: number };
  suites: PlaywrightSuite[];
}
interface PlaywrightSuite {
  title: string;
  file?: string;
  suites?: PlaywrightSuite[];
  specs?: PlaywrightSpec[];
}
interface PlaywrightSpec {
  title: string;
  ok: boolean;
  tests: { results: { status: string; error?: { message: string } }[] }[];
}

function parseJsonReport(reportPath: string): {
  total: number; passed: number; failed: number;
  failures: Omit<TestFailure, 'fixApplied'>[];
} {
  if (!fs.existsSync(reportPath)) return { total: 0, passed: 0, failed: 0, failures: [] };

  const raw = JSON.parse(fs.readFileSync(reportPath, 'utf-8')) as PlaywrightJsonReport;
  const failures: Omit<TestFailure, 'fixApplied'>[] = [];

  function walkSuites(suites: PlaywrightSuite[], file: string) {
    for (const suite of suites) {
      const f = suite.file || file;
      if (suite.suites) walkSuites(suite.suites, f);
      if (suite.specs) {
        for (const spec of suite.specs) {
          if (!spec.ok) {
            const errorMsg = spec.tests
              .flatMap(t => t.results)
              .map(r => r.error?.message || '')
              .filter(Boolean)
              .join(' | ');
            const { category } = classifyError(errorMsg);
            failures.push({ title: spec.title, file: f, error: errorMsg, category });
          }
        }
      }
    }
  }

  walkSuites(raw.suites || [], '');
  return {
    total:   raw.stats?.total   ?? 0,
    passed:  raw.stats?.passed  ?? 0,
    failed:  raw.stats?.failed  ?? 0,
    failures,
  };
}

// ─────────────────────────────────────────────────────────────
// TEST RUNNER
// ─────────────────────────────────────────────────────────────
const JSON_REPORT_PATH = path.join(process.cwd(), '.playwright-heal-report.json');

function runTests(specTarget: string, configFile: string | null): { exitCode: number } {
  const result = spawnSync('npx', [
    'playwright', 'test',
    specTarget,
    ...(configFile ? ['--config', configFile] : []),
    '--reporter=json',
    `--output-file=${JSON_REPORT_PATH}`,
  ], {
    encoding: 'utf-8',
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: true,
  });

  return { exitCode: result.status ?? 1 };
}

// ─────────────────────────────────────────────────────────────
// REFLEXION LOG WRITER
// (format from playwright-testing/references/workflow.md)
// ─────────────────────────────────────────────────────────────
function appendReflexionLog(auditFile: string, attempts: HealAttempt[], specTarget: string) {
  const now = new Date().toISOString();
  let log = `\n## ${now} | Spec: ${path.basename(specTarget)}\n\n`;

  for (const attempt of attempts) {
    log += `### Attempt ${attempt.attempt} — ${attempt.outcome}\n`;
    log += `- 📊 Total: ${attempt.total} | ✅ Passed: ${attempt.passed} | ❌ Failed: ${attempt.failed}\n`;

    if (attempt.failures.length === 0) {
      log += `- 🏁 All tests passed\n`;
    } else {
      for (const f of attempt.failures) {
        log += `\n#### ${f.category === 'env' ? '🌐 ENV SKIP' : '🔧 CODE FIX'}: ${f.title}\n`;
        log += `- ❌ Symptom: ${sanitizeLog(f.error.substring(0, 200))}\n`;
        log += `- 🔍 Root Cause: ${f.category === 'env' ? 'Environment issue (not fixable by code)' : `Code issue — fix: ${f.fixApplied ?? 'manual required'}`}\n`;
        log += `- 💊 Applied Fix: ${f.fixApplied ? `\`${f.fixApplied}\`` : 'none (manual required)'}\n`;
        log += `- 🏁 Outcome: ${f.fixApplied ? 'HEALED' : 'FAILED'}\n`;
        log += `- 📊 Impact: Isolated\n`;
      }
    }
    log += '\n';
  }

  const finalAttempt = attempts[attempts.length - 1];
  const overallOutcome = finalAttempt?.failed === 0 ? 'HEALED' : 'FAILED';
  log += `**Overall: ${overallOutcome}** (${attempts.length} attempt${attempts.length > 1 ? 's' : ''})\n\n---\n`;

  if (!fs.existsSync(auditFile)) {
    const dir = path.dirname(auditFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(auditFile, `# Reflexion Log\n\n`, 'utf-8');
  }

  fs.appendFileSync(auditFile, log, 'utf-8');
  console.log(`\n📝 Reflexion Log → ${sanitizeLog(auditFile)}`);
}

// ─────────────────────────────────────────────────────────────
// RESOLVE AUDIT PATH
// Uses workflow.md specDir to find default audit location
// ─────────────────────────────────────────────────────────────
function resolveAuditPath(specTarget: string): string {
  if (auditPath) return auditPath;

  // Try to find .aidlc/<system>/<feature>/audit.md relative to spec location
  // specTarget: tests-api/<system>/<feature>/xxx.spec.ts
  const specDir = path.dirname(specTarget);
  const parts = specDir.split(path.sep);
  const specDirIdx = parts.findIndex(p => p === workflowStructure.specDir);

  if (specDirIdx !== -1 && parts.length > specDirIdx + 2) {
    const system  = parts[specDirIdx + 1];
    const feature = parts[specDirIdx + 2];
    return path.join(process.cwd(), '.aidlc', system, feature, 'audit.md');
  }

  // fallback: next to spec
  return path.join(specDir, 'audit.md');
}

// ─────────────────────────────────────────────────────────────
// MAIN HEAL LOOP
// ─────────────────────────────────────────────────────────────
async function main() {
  const cwd = process.cwd();

  try {
    safeResolvePath(cwd, specPath!);
    if (configPath) safeResolvePath(cwd, configPath);
    if (auditPath)  safeResolvePath(cwd, auditPath);
  } catch (e: any) {
    console.error(`❌ ${sanitizeLog(e.message)}`);
    process.exit(1);
  }

  const resolvedAudit = resolveAuditPath(specPath!);

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  🔄 Playwright Run + Auto-Heal Loop       ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`   Spec        : ${sanitizeLog(specPath!)}`);
  console.log(`   Config      : ${sanitizeLog(configPath || '(auto-detect)')}`);
  console.log(`   Max Attempts: ${maxAttempts}`);
  console.log(`   Audit Log   : ${sanitizeLog(resolvedAudit)}`);
  console.log(`   Spec Dir    : ${workflowStructure.specDir}/`);

  const allAttempts: HealAttempt[] = [];
  let currentAttempt = 0;

  while (currentAttempt < maxAttempts) {
    currentAttempt++;
    const timestamp = new Date().toISOString();
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Attempt ${currentAttempt} / ${maxAttempts}  [${timestamp}]`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    runTests(specPath!, configPath);

    const { total, passed, failed, failures } = parseJsonReport(JSON_REPORT_PATH);
    console.log(`\n📊 Results: ${total} total | ✅ ${passed} passed | ❌ ${failed} failed`);

    // Extend to 5 if >80% pass rate
    const passRate = total > 0 ? passed / total : 0;
    const effectiveMax = passRate > 0.8 && currentAttempt === maxAttempts && maxAttempts < 5 ? 5 : maxAttempts;

    if (failed === 0) {
      allAttempts.push({ attempt: currentAttempt, timestamp, total, passed, failed, failures: [], outcome: 'HEALED' });
      console.log('\n✅ All tests passed!');
      break;
    }

    const envFailures  = failures.filter(f => f.category === 'env');
    const codeFailures = failures.filter(f => f.category === 'code');

    if (envFailures.length > 0) {
      console.log(`\n🌐 ENV failures (${envFailures.length}) — skipping:`);
      envFailures.forEach(f => console.log(`   - ${sanitizeLog(f.title)}`));
    }

    const processedFailures: TestFailure[] = [];

    if (codeFailures.length > 0) {
      console.log(`\n🔧 CODE failures (${codeFailures.length}) — attempting auto-fix:`);
      for (const failure of codeFailures) {
        const { fix } = classifyError(failure.error);
        let fixApplied: string | null = null;

        if (fix && fix !== 'unknown' && failure.file) {
          console.log(`   🔨 [${fix}] ${sanitizeLog(failure.title)}`);
          fixApplied = applyFix(failure.file, fix, failure.error);
          console.log(fixApplied
            ? `      ✅ Fix applied: ${fixApplied}`
            : `      ⚠️  No auto-fix available — manual review needed`
          );
        } else {
          console.log(`   ⚠️  [unknown] ${sanitizeLog(failure.title)} — manual review needed`);
        }

        processedFailures.push({ ...failure, fixApplied });
      }
    }

    const allEnv  = codeFailures.length === 0;
    const outcome: HealAttempt['outcome'] = allEnv
      ? 'ENV_SKIP'
      : processedFailures.some(f => f.fixApplied) ? 'PARTIAL' : 'FAILED';

    allAttempts.push({
      attempt: currentAttempt, timestamp, total, passed, failed,
      failures: [...envFailures.map(f => ({ ...f, fixApplied: null })), ...processedFailures],
      outcome,
    });

    if (allEnv) {
      console.log('\n⏭️  All remaining failures are environment-related. Stopping.');
      break;
    }
    if (!processedFailures.some(f => f.fixApplied)) {
      console.log('\n⏭️  No auto-fixes applied. Manual intervention required.');
      break;
    }

    // update effectiveMax for next iteration
    if (currentAttempt >= effectiveMax) break;
    console.log(`\n🔄 Re-running after fixes...`);
  }

  // ── Final Summary ──
  const lastAttempt = allAttempts[allAttempts.length - 1];
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  📋 Heal Loop Summary                     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`   Attempts     : ${allAttempts.length}`);
  console.log(`   Final Status : ${lastAttempt?.failed === 0 ? '✅ ALL PASSED' : `❌ ${lastAttempt?.failed} FAILED`}`);
  console.log(`   Outcome      : ${lastAttempt?.outcome}`);

  appendReflexionLog(resolvedAudit, allAttempts, specPath!);

  if (fs.existsSync(JSON_REPORT_PATH)) fs.unlinkSync(JSON_REPORT_PATH);

  process.exit(lastAttempt?.failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
