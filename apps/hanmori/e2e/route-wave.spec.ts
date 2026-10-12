import { expect, test, type Page } from "@playwright/test";

type WaveSample = { visibility: string; pageOpacity: number };

async function recordWave(page: Page) {
  await page.evaluate(() => {
    const view = window as Window & { waveSamples?: WaveSample[] };
    view.waveSamples = [];
    const timer = window.setInterval(() => {
      const wave = document.querySelector<HTMLElement>(".route-wave-panel");
      const content = document.querySelector<HTMLElement>(".route-transition-page");
      if (wave && content) {
        view.waveSamples?.push({
          visibility: getComputedStyle(wave).visibility,
          pageOpacity: Number(getComputedStyle(content).opacity),
        });
      }
      if ((view.waveSamples?.length ?? 0) > 100) window.clearInterval(timer);
    }, 16);
  });
}

test("route wave passes over a learning page and clears fully", async ({ page }) => {
  await page.goto("/dashboard");
  await recordWave(page);
  await page.locator('.desktop-sidebar a[href="/grammar"]').click();
  await expect(page).toHaveURL(/\/grammar$/);
  await expect(page.locator(".route-wave-panel")).toBeHidden();
  await page.waitForTimeout(900);

  const samples = await page.evaluate(
    () => (window as Window & { waveSamples?: WaveSample[] }).waveSamples ?? [],
  );
  expect(samples.some((sample) => sample.visibility === "visible")).toBe(true);
  expect(samples.some((sample) => sample.pageOpacity < 1)).toBe(true);
  await expect(page.locator(".route-wave-panel")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("reduced motion skips the wave and content fade", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dashboard");
  await recordWave(page);
  await page.locator('.desktop-sidebar a[href="/grammar"]').click();
  await expect(page).toHaveURL(/\/grammar$/);
  await page.waitForTimeout(300);

  const samples = await page.evaluate(
    () => (window as Window & { waveSamples?: WaveSample[] }).waveSamples ?? [],
  );
  expect(samples.length).toBeGreaterThan(0);
  expect(samples.every((sample) => sample.visibility === "hidden")).toBe(true);
  expect(samples.every((sample) => sample.pageOpacity === 1)).toBe(true);
});

test("mobile menu closes after navigation and leaves the page usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page.getByRole("dialog", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Học ngữ pháp" }).click();
  await expect(page).toHaveURL(/\/grammar$/);
  await expect(page.getByRole("dialog", { name: "Điều hướng chính" })).not.toBeVisible();
  await expect(page.locator(".route-wave-panel")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
