/**
 * RTL Skill CI Test
 *
 * Loads the skill files, runs /rtl-audit on BadComponent.jsx via the Claude API,
 * and fails (exit 1) if the score drops below 22/24 issues caught.
 *
 * Usage:
 *   ANTHROPIC_API_KEY=sk-... node test/run-audit.mjs
 *   AUDIT_MODEL=claude-sonnet-4-6 node test/run-audit.mjs   # more reliable, higher cost
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// --- Load skill files into system prompt ---

const SKILL_FILES = [
  'skills/rtl/SKILL.md',
  'skills/rtl/reference.md',
  'skills/rtl/workflows.md',
  'skills/rtl/frameworks/css.md',
  'skills/rtl/frameworks/tailwind.md',
  'skills/rtl/frameworks/css-in-js.md',
  'skills/rtl/frameworks/react-native.md',
];

const skillContext = SKILL_FILES
  .map(f => `## ${f}\n\n${readFileSync(join(root, f), 'utf8')}`)
  .join('\n\n---\n\n');

const component = readFileSync(join(root, 'test/BadComponent.jsx'), 'utf8');

// --- Run audit ---

const model = process.env.AUDIT_MODEL ?? 'claude-haiku-4-5';
const client = new Anthropic();

console.log(`Model:     ${model}`);
console.log('Auditing:  test/BadComponent.jsx\n');

// Prompt cache the skill files — they're large and stable across CI runs.
// On the first run this writes the cache; subsequent runs read it at ~0.1x cost.
const stream = await client.messages.stream({
  model,
  max_tokens: 4096,
  system: [
    {
      type: 'text',
      text: `You are an RTL (right-to-left) UI expert. The rules below are your skill files — follow them exactly when auditing.\n\n${skillContext}`,
      cache_control: { type: 'ephemeral' },
    },
  ],
  messages: [
    {
      role: 'user',
      content: `Run /rtl-audit on this component. It contains exactly 24 intentional RTL bugs.\n\nProduce the full report in the exact format defined in workflows.md:\n- Summary block with 🔴 Breaking / 🟡 Degraded / 🟢 Cosmetic counts\n- Each issue with its severity emoji, location, problem, and fix\n\nAlso classify every icon as directional (must flip) or neutral (leave alone).\n\n\`\`\`jsx\n${component}\n\`\`\``,
    },
  ],
});

console.log('=== AUDIT OUTPUT ===\n');
for await (const chunk of stream.text_stream) {
  process.stdout.write(chunk);
}

const response = await stream.finalMessage();
const output = response.content
  .filter(b => b.type === 'text')
  .map(b => b.text)
  .join('');

// --- Cache stats ---
const cacheWrite = response.usage.cache_creation_input_tokens ?? 0;
const cacheRead  = response.usage.cache_read_input_tokens  ?? 0;
console.log(`\n\n=== CACHE STATS ===`);
console.log(`Cache write: ${cacheWrite.toLocaleString()} tokens`);
console.log(`Cache read:  ${cacheRead.toLocaleString()} tokens`);

// --- Score ---
console.log('\n=== SCORING ===\n');

const breakingMatch = output.match(/🔴[^:]*:\s*(\d+)/);
const degradedMatch = output.match(/🟡[^:]*:\s*(\d+)/);
const cosmeticMatch = output.match(/🟢[^:]*:\s*(\d+)/);

const breaking = breakingMatch ? parseInt(breakingMatch[1], 10) : 0;
const degraded  = degradedMatch  ? parseInt(degradedMatch[1],  10) : 0;
const cosmetic  = cosmeticMatch  ? parseInt(cosmeticMatch[1],  10) : 0;
const total     = breaking + degraded + cosmetic;

console.log(`🔴 Breaking:  ${breaking}  (expected ~16)`);
console.log(`🟡 Degraded:  ${degraded}  (expected ~5)`);
console.log(`🟢 Cosmetic:  ${cosmetic}  (expected ~3)`);
console.log(`Total:        ${total}/24  (threshold: 22)\n`);

// --- Icon classification check ---
// Neutral icons must NOT appear in flip/mirror/scale instructions.
const NEUTRAL_ICONS = ['Heart', 'Star', 'Search', 'Bell', 'Settings'];
const neutralFlipped = NEUTRAL_ICONS.filter(icon => {
  const pattern = new RegExp(`${icon}[^\\n]{0,80}(flip|mirror|scaleX|rotate|rtl)`, 'i');
  return pattern.test(output);
});

if (neutralFlipped.length > 0) {
  console.log(`❌ Neutral icons incorrectly flagged for flipping: ${neutralFlipped.join(', ')}`);
} else {
  console.log('✅ Neutral icons correctly left unflipped');
}

// --- LTR island check ---
// The audit must mention wrapping phone/email/URL in dir="ltr" or similar.
const ltrIslandCaught =
  /ltr[\s-]island|dir[=\s:]["']?ltr|direction\s*:\s*ltr/i.test(output) &&
  /(\+966|phone|رقم|email|url|https?:\/\/)/i.test(output);

if (ltrIslandCaught) {
  console.log('✅ LTR islands (phone / email / URL) caught');
} else {
  console.log('❌ LTR islands (phone / email / URL) NOT caught');
}

// --- Verdict ---
const passed = total >= 22 && neutralFlipped.length === 0 && ltrIslandCaught;
console.log(`\n${passed ? '✅ PASS' : '❌ FAIL'} — ${total}/24 issues caught`);

if (!passed) {
  if (total < 22)
    console.error(`\n  Score ${total} is below the threshold of 22.`);
  if (neutralFlipped.length > 0)
    console.error(`  Neutral icons incorrectly flagged: ${neutralFlipped.join(', ')}`);
  if (!ltrIslandCaught)
    console.error('  LTR islands for phone / email / URL were not caught.');
  process.exit(1);
}
