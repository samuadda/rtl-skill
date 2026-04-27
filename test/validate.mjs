/**
 * rtl-skill structure validator
 *
 * Fast, zero-dependency sanity check — runs in CI with no API key required.
 * Catches the kinds of regressions that silently break the skill: missing
 * files, broken internal links, drift between package.json and CHANGELOG,
 * frontmatter corruption on SKILL.md.
 *
 * Usage:  node test/validate.mjs
 * Exits 0 on success, 1 on any failure.
 */

import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const errors = [];
const checks = [];

function check(name, fn) {
  try {
    fn();
    checks.push({ name, ok: true });
  } catch (err) {
    checks.push({ name, ok: false, err: err.message });
    errors.push(`${name}: ${err.message}`);
  }
}

function mustExist(relPath) {
  const abs = join(root, relPath);
  if (!existsSync(abs)) throw new Error(`missing file: ${relPath}`);
  if (statSync(abs).size === 0) throw new Error(`empty file: ${relPath}`);
  return readFileSync(abs, 'utf8');
}

// --- 1. Required skill files exist ---

const REQUIRED_FILES = [
  'skills/rtl/SKILL.md',
  'skills/rtl/reference.md',
  'skills/rtl/workflows.md',
  'skills/rtl/anti-patterns.md',
  'skills/rtl/frameworks/tailwind.md',
  'skills/rtl/frameworks/css.md',
  'skills/rtl/frameworks/css-in-js.md',
  'skills/rtl/frameworks/react-native.md',
  'test/BadComponent.jsx',
  'test/ANSWER_KEY.md',
  'evals/queries.json',
  'evals/results.md',
  'tests/real-world-audit.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'README.md',
];

for (const f of REQUIRED_FILES) {
  check(`exists: ${f}`, () => mustExist(f));
}

// --- 2. SKILL.md has valid frontmatter ---

check('SKILL.md frontmatter', () => {
  const src = readFileSync(join(root, 'skills/rtl/SKILL.md'), 'utf8')
    .replace(/^\ufeff/, ''); // strip UTF-8 BOM if present
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error('no frontmatter block');
  const body = match[1];
  if (!/^name:\s*\S+/m.test(body)) throw new Error('missing `name:` field');
  if (!/^description:\s*\S+/m.test(body)) throw new Error('missing `description:` field');
});

// --- 3. Internal markdown links in SKILL.md resolve ---

check('SKILL.md internal links resolve', () => {
  const src = readFileSync(join(root, 'skills/rtl/SKILL.md'), 'utf8');
  const skillDir = join(root, 'skills/rtl');
  const linkRe = /\]\(([^)#]+?)(?:#[^)]*)?\)/g;
  const broken = [];
  let m;
  while ((m = linkRe.exec(src)) !== null) {
    const target = m[1];
    if (/^https?:\/\//.test(target)) continue;
    const absTarget = resolve(skillDir, target);
    if (!existsSync(absTarget)) broken.push(target);
  }
  if (broken.length) throw new Error(`broken links: ${broken.join(', ')}`);
});

// --- 4. CHANGELOG has Unreleased + at least one semver version ---

check('CHANGELOG structure', () => {
  const src = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
  if (!/##\s*\[Unreleased\]/i.test(src)) throw new Error('no [Unreleased] section');
  if (!/##\s*\[\d+\.\d+\.\d+\]/.test(src)) throw new Error('no versioned release section');
});

// --- 5. package.json version matches latest released CHANGELOG version ---

check('package.json version matches CHANGELOG', () => {
  const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
  const changelog = readFileSync(join(root, 'CHANGELOG.md'), 'utf8');
  const versionMatch = changelog.match(/##\s*\[(\d+\.\d+\.\d+)\]/);
  if (!versionMatch) throw new Error('no version found in CHANGELOG');
  const latestReleased = versionMatch[1];
  if (pkg.version !== latestReleased) {
    throw new Error(
      `package.json@${pkg.version} != CHANGELOG latest @${latestReleased}`
    );
  }
});

// --- 6. BadComponent.jsx looks like a non-trivial fixture ---

check('BadComponent.jsx is a real fixture', () => {
  const src = readFileSync(join(root, 'test/BadComponent.jsx'), 'utf8');
  if (src.length < 500) throw new Error(`too small (${src.length} bytes)`);
  if (!/export\s+(default|function|const|class)/.test(src))
    throw new Error('no export statement');
});

// --- 7. ANSWER_KEY mentions the expected issue counts ---

check('ANSWER_KEY has expected issue counts', () => {
  const src = readFileSync(join(root, 'test/ANSWER_KEY.md'), 'utf8');
  if (!/24/.test(src)) throw new Error('no reference to 24 total issues');
});

// --- Report ---

console.log('rtl-skill validator\n');
for (const c of checks) {
  console.log(`${c.ok ? 'ok  ' : 'FAIL'}  ${c.name}${c.ok ? '' : ` — ${c.err}`}`);
}
console.log(`\n${checks.filter(c => c.ok).length}/${checks.length} checks passed`);

if (errors.length) {
  console.error(`\n${errors.length} failure(s)`);
  process.exit(1);
}
