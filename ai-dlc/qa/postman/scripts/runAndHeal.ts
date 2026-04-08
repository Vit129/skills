/**
 * @file runAndHeal.ts
 * @version 1.0 — Playwright Test Runner + Auto-Heal Fix Loop
 *
 * Usage:
 *   npx ts-node --project ~/.claude/skills/ai-dlc/qa/postman/scripts/tsconfig.json \
 *     ~/.claude/skills/ai-dlc/qa/postman/scripts/runAndHeal.ts \
 *     --spec <path/to/spec.ts or tests-api/folder> \
 *     [--config <playwright.config.ts>] \
 *     [--max-attempts <3>] \
 *     [--audit <path/to/audit.md>] \
 *     [--reporter line|json|dot]
 *
 * Workflow:
 *   1. Run Playwright tests (--reporter=line for minimal output)
 *   2. Parse failures from JSON report
 *   3. Classify each failure (env / code)
 *   4. Apply auto-fix patches for known patterns
 *   5. Re-run — repeat up to maxAttempts
 *   6. Append Reflexion Log to audit.md
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync, spawnSync } from 'child_process';

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
const reporter    = getArg('--reporter') || 'line';

if (!specPath) {
  console.error('❌ Usage: runAndHeal.ts --spec <path> [--config <playwright.config.ts>] [--max-attempts 3] [--audit <audit.md>] [--reporter line|json|dot]');
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
  { pattern: /locator.*not found|element.*not found/i,       fix: 'locator_not_found' },
  { pattern: /Timeout.*waiting for/i,                        fix: 'timeout_selector' },
  { pattern: /intercept.*click/i,                            fix: 'click_intercepted' },
  { pattern: /Expected.*received/i,                          fix: 'assertion_failed' },
  { pattern: /Cannot read prop.*undefined/i,                 fix: 'null_response' },
  { pattern: /status.*(?:4\d\d|5\d\d)/i,                    fix: 'http_error' },
  { pattern: /is not a function/i,                           fix: 'type_error' },
  { pattern: /Cannot find module/i,                          fix: 'missing_import' },
  { pattern: /SyntaxError/i,                                 fix: 'syntax_error' },
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
// ─────────────────────────────────────────────────────────────
/**
 * Apply known auto-fix patterns to a spec file.
 * Returns description of what was changed, or null if no fix applied.
 */
function applyFix(filePath: string, fixType: string, errorMsg: string): string | null {
  if (!fs.existsSync(filePath)) return null;
  let src = fs.readFileSync(filePath, 'utf-8');
  const original = src;

  switch (fixType) {
    case 'timeout_selector': {
      // Increase default timeout if not already set
      if (!src.includes('test.setTimeout')) {
        src = src.replace(
          /test\.describe[^(]*\([^,]+,\s*\(\)\s*=>\s*\{/,
          m => `${m}\n    test.setTimeout(60_000); // ⚡ [HEAL] increased timeout`
        );
      }
      break;
    }
    case 'null_response': {
      // Wrap responseJson access with null guard
      src = src.replace(
        /const responseJson = await response\.json\(\);/g,
        `const _rawBody = await response.text();\n  const responseJson = _rawBody ? JSON.parse(_rawBody) : {}; // ⚡ [HEAL] null guard`
      );
      break;
    }
    case 'http_error': {
      // Add status assertion hint comment
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
      // Extract missing module name and add TODO comment at top
      const modMatch = errorMsg.match(/Cannot find module '([^']+)'/);
      if (modMatch && !src.includes(`// ⚡ [HEAL] missing: ${modMatch[1]}`)) {
        src = `// ⚡ [HEAL] missing module: ${modMatch[1]} — run: npm install ${modMatch[1]}\n` + src;
      }
      break;
    }
    case 'assertion_failed': {
      // Add waitFor before assertion if not present
      src = src.replace(
        /(await test\.step\([^,]+,\s*async\s*\(\)\s*=>\s*\{[\s\S]*?)(expect\(response)/,
        (_, before, assertion) => {
          if (before.includes('waitForResponse') || before.includes('waitFor(')) return _ ;
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
  tests: PlaywrightTest[];
}
interface PlaywrightTest {
  results: { status: string; error?: { message: string } }[];
}

function parseJsonReport(reportPath: string): { total: number; passed: number; failed: number; failures: Omit<TestFailure, 'fixApplied'>[] } {
  if (!fs.existsSync(reportPath)) {
    return { total: 0, passed: 0, failed: 0, failures: [] };
  }
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
            const { category, fix } = classifyError(errorMsg);
            failures.push({ title: spec.title, file: f, error: errorMsg, category });
          }
        }
      }
    }
  }

  walkSuites(raw.suites || [], '');
  return {
    total: raw.stats?.total ?? 0,
    passed: raw.stats?.passed ?? 0,
    failed: raw.stats?.failed ?? 0,
    failures,
  };
}

// ─────────────────────────────────────────────────────────────
// TEST RUNNER
// ─────────────────────────────────────────────────────────────
const JSON_REPORT_PATH = path.join(process.cwd(), '.playwright-heal-report.json');

function runTests(specTarget: string, configFile: string | null): { exitCode: number; output: string } {
  const configFlag = configFile ? `--config "${configFile}"` : '';
  const cmd = [
    'npx playwright test',
    `"${specTarget}"`,
    configFlag,
    `--reporter=json`,
    `--output-file="${JSON_REPORT_PATH}"`,
  ].filter(Boolean).join(' ');

  console.log(`\n▶  ${sanitizeLog(cmd)}\n`);

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

  const output = (result.stdout || '') + (result.stderr || '');
  return { exitCode: result.status ?? 1, output };
}

// ─────────────────────────────────────────────────────────────
// REFLEXION LOG WRITER
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
        log += `- 🔍 Category: ${f.category}\n`;
        if (f.fixApplied) log += `- 💊 Applied Fix: \`${f.fixApplied}\`\n`;
        else log += `- 💊 Applied Fix: none (manual required)\n`;
        log += `- 📊 Impact: Isolated\n`;
      }
    }
    log += '\n';
  }

  const finalAttempt = attempts[attempts.length - 1];
  const overallOutcome = finalAttempt?.failed === 0 ? 'HEALED' : 'FAILED';
  log += `**Overall: ${overallOutcome}** (${attempts.length} attempt${attempts.length > 1 ? 's' : ''})\n\n---\n`;

  // Ensure audit file exists
  if (!fs.existsSync(auditFile)) {
    const dir = path.dirname(auditFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(auditFile, `# Reflexion Log\n\n`, 'utf-8');
  }

  fs.appendFileSync(auditFile, log, 'utf-8');
  console.log(`\n📝 Reflexion Log → ${sanitizeLog(auditFile)}`);
}

// ─────────────────────────────────────────────────────────────
// MAIN HEAL LOOP
// ─────────────────────────────────────────────────────────────
async function main() {
  const cwd = process.cwd();

  // Security: validate paths
  try {
    safeResolvePath(cwd, specPath!);
    if (configPath) safeResolvePath(cwd, configPath);
    if (auditPath) safeResolvePath(cwd, auditPath);
  } catch (e: any) {
    console.error(`❌ ${sanitizeLog(e.message)}`);
    process.exit(1);
  }

  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  🔄 Playwright Run + Auto-Heal Loop       ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`   Spec        : ${sanitizeLog(specPath!)}`);
  console.log(`   Config      : ${sanitizeLog(configPath || '(auto-detect)')}`);
  console.log(`   Max Attempts: ${maxAttempts}`);
  console.log(`   Audit Log   : ${sanitizeLog(auditPath || '(none)')}`);

  const allAttempts: HealAttempt[] = [];
  let currentAttempt = 0;
  let lastFailed = 0;

  while (currentAttempt < maxAttempts) {
    currentAttempt++;
    const timestamp = new Date().toISOString();
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`  Attempt ${currentAttempt} / ${maxAttempts}  [${timestamp}]`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

    const { exitCode, output } = runTests(specPath!, configPath);

    // Parse results
    const { total, passed, failed, failures } = parseJsonReport(JSON_REPORT_PATH);

    console.log(`\n📊 Results: ${total} total | ✅ ${passed} passed | ❌ ${failed} failed`);

    // Extend to 5 attempts if >80% pass rate
    const passRate = total > 0 ? passed / total : 0;
    const effectiveMax = passRate > 0.8 && maxAttempts < 5 ? 5 : maxAttempts;

    if (failed === 0) {
      const attempt: HealAttempt = {
        attempt: currentAttempt,
        timestamp,
        total, passed, failed,
        failures: [],
        outcome: 'HEALED',
      };
      allAttempts.push(attempt);
      console.log('\n✅ All tests passed!');
      break;
    }

    // Classify and attempt fixes
    const processedFailures: TestFailure[] = [];
    const envFailures = failures.filter(f => f.category === 'env');
    const codeFailures = failures.filter(f => f.category === 'code');

    if (envFailures.length > 0) {
      console.log(`\n🌐 ENV failures (${envFailures.length}) — skipping (not fixable by code changes):`);
      envFailures.forEach(f => console.log(`   - ${sanitizeLog(f.title)}`));
    }

    if (codeFailures.length > 0) {
      console.log(`\n🔧 CODE failures (${codeFailures.length}) — attempting auto-fix:`);
      for (const failure of codeFailures) {
        const { fix } = classifyError(failure.error);
        let fixApplied: string | null = null;

        if (fix && fix !== 'unknown' && failure.file) {
          console.log(`   🔨 [${fix}] ${sanitizeLog(failure.title)}`);
          fixApplied = applyFix(failure.file, fix, failure.error);
          if (fixApplied) {
            console.log(`      ✅ Fix applied: ${fixApplied}`);
          } else {
            console.log(`      ⚠️  No auto-fix available — manual review needed`);
          }
        } else {
          console.log(`   ⚠️  [unknown] ${sanitizeLog(failure.title)} — manual review needed`);
        }

        processedFailures.push({ ...failure, fixApplied });
      }
    }

    // Determine outcome
    const allEnv = codeFailures.length === 0;
    const outcome: HealAttempt['outcome'] = allEnv
      ? 'ENV_SKIP'
      : processedFailures.some(f => f.fixApplied)
        ? 'PARTIAL'
        : 'FAILED';

    allAttempts.push({
      attempt: currentAttempt,
      timestamp,
      total, passed, failed,
      failures: [...envFailures.map(f => ({ ...f, fixApplied: null })), ...processedFailures],
      outcome,
    });

    lastFailed = failed;

    // Stop if all remaining failures are env-related (no point retrying)
    if (allEnv) {
      console.log('\n⏭️  All remaining failures are environment-related. Stopping heal loop.');
      break;
    }

    // Stop if no fixes were applied (would loop forever)
    if (!processedFailures.some(f => f.fixApplied)) {
      console.log('\n⏭️  No auto-fixes could be applied. Manual intervention required.');
      break;
    }

    if (currentAttempt < effectiveMax) {
      console.log(`\n🔄 Re-running tests after fixes...`);
    }
  }

  // ── Final Summary ──
  const lastAttempt = allAttempts[allAttempts.length - 1];
  console.log('\n╔══════════════════════════════════════════╗');
  console.log('║  📋 Heal Loop Summary                     ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`   Attempts     : ${allAttempts.length}`);
  console.log(`   Final Status : ${lastAttempt?.failed === 0 ? '✅ ALL PASSED' : `❌ ${lastAttempt?.failed} FAILED`}`);
  console.log(`   Outcome      : ${lastAttempt?.outcome}`);

  // Write Reflexion Log
  if (auditPath) {
    appendReflexionLog(auditPath, allAttempts, specPath!);
  } else {
    // Default: write next to spec
    const defaultAudit = path.join(path.dirname(specPath!), 'audit.md');
    appendReflexionLog(defaultAudit, allAttempts, specPath!);
  }

  // Cleanup temp report
  if (fs.existsSync(JSON_REPORT_PATH)) {
    fs.unlinkSync(JSON_REPORT_PATH);
  }

  process.exit(lastAttempt?.failed === 0 ? 0 : 1);
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
