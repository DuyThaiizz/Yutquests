// Exercise all published writing routes, reference responses and source assets.
// Submissions are stateless and use sanitized fixtures.
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const base = process.argv[2] || "http://127.0.0.1:3100";
const writing52 = JSON.parse(
  await readFile(
    new URL("../src/content/writing-52.json", import.meta.url),
    "utf8",
  ),
);
const ids = [
  ...Array.from({ length: 50 }, (_, i) => `51-${i + 1}`),
  ...writing52.map((item) => item.id),
];
const assets = [
  ...Array.from(
    { length: 50 },
    (_, i) => `51-${String(i + 1).padStart(2, "0")}.webp`,
  ),
  ...Array.from(
    { length: 7 },
    (_, i) => `52-page-${String(i + 1).padStart(2, "0")}.webp`,
  ),
  ...Array.from(
    { length: 6 },
    (_, i) => `52-key-${String(i + 1).padStart(2, "0")}.webp`,
  ),
];
const checks = [];
const failures = [];
let passed = 0;
const request = async (path, init, status = 200) => {
  const response = await fetch(new URL(path, base), {
    ...init,
    signal: AbortSignal.timeout(30_000),
  });
  if (response.status !== status)
    throw new Error(`${path}: HTTP ${response.status}, expected ${status}`);
  return response;
};
checks.push(async () => {
  const html = await (await request("/topik/writing")).text();
  if (!html.includes("writing-library"))
    throw new Error("writing library is absent");
});
for (const id of ids) {
  checks.push(async () => {
    const html = await (await request(`/topik/writing/${id}`)).text();
    if (!html.includes("writing-studio"))
      throw new Error(`${id}: writing workspace is absent`);
    if (id === "51-1" && html.includes("새 회원을 모집합니다"))
      throw new Error(`${id}: reference leaked before submission`);
    if (id === "52-70" && html.includes("깬다고 한다"))
      throw new Error(`${id}: reference leaked before submission`);
  });
  checks.push(async () => {
    const response = await request("/api/writing/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        answers: { ㄱ: "연습 답안", ㄴ: "다른 연습 답안" },
      }),
    });
    const result = await response.json();
    if (
      response.headers.get("cache-control") !== "no-store" ||
      result.id !== id ||
      !result.answers?.ㄱ ||
      !result.answers?.ㄴ ||
      !result.explanations?.ㄱ ||
      !result.explanations?.ㄴ ||
      "correct" in result
    ) {
      throw new Error(
        `${id}: missing or incorrectly graded reference response`,
      );
    }
  });
}
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const asset of assets)
  checks.push(async () => {
    const response = await request(`/writing/${asset}`);
    const remote = Buffer.from(await response.arrayBuffer());
    const local = await readFile(
      new URL(`../public/writing/${asset}`, import.meta.url),
    );
    if (sha(remote) !== sha(local))
      throw new Error(`${asset}: checksum mismatch`);
  });
for (const [body, status] of [
  [{ id: "51-1", answers: { ㄱ: "", ㄴ: "답" } }, 400],
  [{ id: "51-999", answers: { ㄱ: "답", ㄴ: "답" } }, 404],
])
  checks.push(async () => {
    await request(
      "/api/writing/submit",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      status,
    );
  });
checks.push(async () => {
  await request("/topik/writing/51-999", undefined, 404);
});

let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < checks.length) {
      const check = checks[cursor++];
      try {
        await check();
        passed++;
      } catch (error) {
        failures.push(String(error));
      }
    }
  }),
);
console.log(
  JSON.stringify(
    { base, passed, failed: failures.length, skipped: 0, failures },
    null,
    2,
  ),
);
process.exitCode = failures.length ? 1 : 0;
