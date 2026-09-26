// Run against a built local server or an explicit deployment URL.
// Grading is stateless; this check does not create accounts or saved progress.
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const base = process.argv[2] || "http://127.0.0.1:3100";
const catalog = JSON.parse(await readFile(new URL("../src/content/reading-catalog.json", import.meta.url), "utf8"));
const checks = [];
let passed = 0;
const failures = [];
async function request(path, options, expected = 200) {
  const response = await fetch(new URL(path, base), { ...options, signal: AbortSignal.timeout(30_000) });
  if (response.status !== expected) throw new Error(`${path}: HTTP ${response.status}, expected ${expected}`);
  return response;
}
for (const set of catalog.sets.filter((set) => set.numbers.length)) {
  checks.push(async () => {
    const response = await request(`/topik/reading/${set.id}`);
    if (!(await response.text()).includes("reading-workspace")) throw new Error(`${set.id}: missing exercise`);
  });
  checks.push(async () => {
    const response = await request("/api/reading/submit", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setId: set.id, answers: Object.fromEntries(Object.entries(set.answers).map(([number, answer]) => [number, answer.answer])) }),
    });
    const result = await response.json();
    if (response.headers.get("cache-control") !== "no-store" || result.correct !== set.numbers.length || result.total !== set.numbers.length || !result.rows.every((row) => row.explanation?.reason && row.explanation?.elimination)) {
      throw new Error(`${set.id}: incorrect score, missing explanation, or unsafe caching`);
    }
  });
}
const images = new Set(catalog.sets.flatMap((set) => set.pages.map((page) => page.id)));
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const image of images) {
  checks.push(async () => {
    const response = await request(`/reading/${image}.webp`);
    const actual = Buffer.from(await response.arrayBuffer());
    const expected = await readFile(new URL(`../public/reading/${image}.webp`, import.meta.url));
    if (sha(actual) !== sha(expected)) throw new Error(`${image}: image checksum mismatch`);
  });
}
for (const [path, status] of [
  ["/", 200], ["/library", 200], ["/topik", 200], ["/notebook/unknown", 200],
  ["/review?deck=missing", 200], ["/topik/reading/missing", 404], ["/topik/reading/reading-16-41", 404],
]) checks.push(async () => {
  const response = await request(path, undefined, status);
  if (!(await response.text()).length) throw new Error(`${path}: empty response`);
});
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < checks.length) {
    const check = checks[cursor++];
    try { await check(); passed++; }
    catch (error) { failures.push(String(error)); }
  }
}));
console.log(JSON.stringify({ base, passed, failed: failures.length, skipped: 0, failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;
