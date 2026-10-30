const { chromium } = require("playwright-core");

const baseUrl = process.env.BASE_URL || "http://127.0.0.1:3010";
const chromePath =
  process.env.CHROME_PATH ||
  "C:/Program Files/Google/Chrome/Application/chrome.exe";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromePath,
  });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  for (const route of ["/", "/guide", "/cards", "/game"]) {
    const response = await page.goto(`${baseUrl}${route}`, {
      waitUntil: "networkidle",
    });
    assert(
      response && response.status() === 200,
      `${route} did not return 200`,
    );
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    assert(overflow <= 1, `${route} has horizontal overflow (${overflow}px)`);
  }

  await page.goto(`${baseUrl}/cards`, { waitUntil: "networkidle" });
  assert(
    (
      await page.locator('.desktop-nav a[aria-current="page"]').innerText()
    ).includes("Thẻ thành ngữ"),
    "Current route is not exposed in desktop navigation",
  );
  await page.getByRole("tab", { name: /Luyện câu hỏi/ }).click();
  assert(
    (await page.locator("#library-title").innerText()).includes("210"),
    "Question bank does not expose 210 cards",
  );
  await page
    .getByRole("group", { name: "Lọc thẻ theo nhóm biểu đạt" })
    .getByRole("button", { name: "Hán–Hàn" })
    .click();
  assert(
    (await page.locator("#library-title").innerText()).includes("070"),
    "Hán–Hàn filter count changed",
  );
  await page.getByLabel("Tìm biểu đạt").fill("일석이조");
  assert(
    (await page.locator("#library-title").innerText()).includes("004"),
    "Search result count changed",
  );

  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Thành ngữ Hán–Hàn" }).click();
  assert(
    (await page.locator(".bilingual-count").innerText()).includes("20"),
    "Bilingual branch count changed",
  );
  const flip = page.locator(".bilingual-card button").first();
  assert(
    (await flip.getAttribute("aria-label")).includes("Lật thẻ"),
    "Flashcard does not describe its closed state",
  );
  await flip.click();
  assert(
    (await flip.getAttribute("aria-expanded")) === "true",
    "Flashcard did not flip",
  );
  assert(
    (await flip.getAttribute("aria-label")).includes("Quay lại"),
    "Flashcard does not describe its open state",
  );

  await page.goto(`${baseUrl}/game`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Tung bốn thanh Yut/ }).click();
  assert(
    (await page.locator(".yut-throw-stage.is-throwing").count()) === 1,
    "Throw animation did not start",
  );
  await page.waitForTimeout(1500);
  assert(
    (await page.getByText("Thành ngữ này có nghĩa là gì?").count()) === 1,
    "Game did not advance to question",
  );
  await page.getByRole("button", { name: "Rất dễ dàng" }).click();
  const progress = await page.evaluate(() =>
    JSON.parse(
      window.localStorage.getItem("yutquest.learner-progress.v1") || "null",
    ),
  );
  assert(
    progress && progress.totalAnswered === 1,
    "Learner answer was not persisted",
  );
  assert(progress.totalCorrect === 1, "Correct answer was not recorded");
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  assert(
    (await page.getByText("1 / 5").count()) === 1,
    "Daily journey did not reflect persisted progress",
  );
  assert(
    (await page.locator(".home-hero h1").innerText()).includes("Tung Yut"),
    "Vietnamese-first hero copy is missing",
  );
  assert(
    (await page.locator("canvas.starlight-field").count()) === 1,
    "Starlight WebGL field is missing",
  );

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${baseUrl}/game`, { waitUntil: "networkidle" });
  assert(
    await page.locator(".mobile-match-summary").isVisible(),
    "Compact mobile match summary is hidden",
  );
  assert(
    !(await page.locator(".game-board-panel").isVisible()),
    "Full board should start collapsed on mobile",
  );
  await page.getByRole("button", { name: "Xem bàn cờ chi tiết" }).click();
  assert(
    await page.locator(".game-board-panel").isVisible(),
    "Full board did not expand on mobile",
  );

  assert(errors.length === 0, `Browser errors: ${errors.join(" | ")}`);
  await browser.close();
  console.log("smoke: 4 routes + 17 interaction checks passed");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
