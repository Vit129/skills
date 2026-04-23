/**
 * @file postmanMigrate.ts
 * @version 3.0 — One-Shot Orchestrator (Step 1 + 2) — uses tsx
 * @description Runs readPostmanCollection → readPostmanEnv in sequence.
 *              After this, AI generates Playwright code from the produced .md files.
 *
 * Usage:
 *   npx tsx <skills>/postmanMigrate.ts \
 *     --collection "<collection.json>" \
 *     [--env "<environment.json>"] \
 *     [--folder "<folder-name>"] \
 *     [--output-dir "<project-root>"]
 *
 * Flags:
 *   --collection   Path to .postman_collection.json (required)
 *   --env          Path to .postman_environment.json (optional)
 *   --folder       Pass --folder to Step 1 (migrate one folder only)
 *   --output-dir   Override output root (default: cwd)
 */

import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// ── ARG PARSING ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);

function getArg(flag: string): string | null {
  const idx = args.indexOf(flag);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const collectionArg = getArg('--collection');
const envArg        = getArg('--env');
const outputDirArg  = getArg('--output-dir');
const folderArg     = getArg('--folder');

if (!collectionArg) {
  console.error('❌ --collection is required');
  console.error('   Usage: postmanMigrate.ts --collection "<collection.json>" [--env "<env.json>"]');
  process.exit(1);
}

// ── RESOLVE PATHS ────────────────────────────────────────────────────────────
const scriptsDir     = __dirname;
const script1        = path.join(scriptsDir, 'readPostmanCollection.ts');
const script2        = path.join(scriptsDir, 'readPostmanEnv.ts');
const cwd            = outputDirArg ? path.resolve(outputDirArg) : process.cwd();
const collectionPath = path.resolve(cwd, collectionArg);

if (!fs.existsSync(collectionPath)) {
  console.error(`❌ Collection file not found: ${collectionPath}`);
  process.exit(1);
}

if (envArg) {
  const envPath = path.resolve(cwd, envArg);
  if (!fs.existsSync(envPath)) {
    console.error(`❌ Environment file not found: ${envPath}`);
    process.exit(1);
  }
}

// ── RUNNER ───────────────────────────────────────────────────────────────────
function run(label: string, cmd: string) {
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`🚀 ${label}`);
  console.log(`   ${cmd}`);
  console.log('─'.repeat(60));
  try {
    execSync(cmd, { cwd, stdio: 'inherit' });
  } catch (e: any) {
    console.error(`\n❌ ${label} failed (exit ${e.status ?? '?'})`);
    process.exit(e.status ?? 1);
  }
}

const tsx = `npx tsx`;

// ── STEP 1: readPostmanCollection ────────────────────────────────────────────
let step1Cmd = `${tsx} "${script1}" "${collectionPath}"`;
if (folderArg) step1Cmd += ` --folder "${folderArg}"`;
if (outputDirArg) step1Cmd += ` --output-dir "${cwd}"`;
run('Step 1 — Analyze Collection → Markdown', step1Cmd);

// ── STEP 2: readPostmanEnv (optional) ────────────────────────────────────────
if (envArg) {
  const envPath = path.resolve(cwd, envArg);
  const step2Cmd = `${tsx} "${script2}" "${envPath}"`;
  run('Step 2 — Analyze Environment → Markdown', step2Cmd);
} else {
  console.log('\n⏭️  Step 2 skipped (no --env provided)');
}

// ── DONE ─────────────────────────────────────────────────────────────────────
console.log(`\n${'═'.repeat(60)}`);
console.log('✅ ANALYSIS COMPLETE');
console.log(`   Collection : ${collectionArg}`);
if (envArg) console.log(`   Environment: ${envArg}`);
console.log(`   Output     : ${cwd}/tests-api/`);
console.log('═'.repeat(60));
console.log('\n📋 Next Step:');
console.log('   Ask AI to generate Playwright from the .md files:');
console.log('   → "Generate Playwright from collection.md — folder by folder"');
