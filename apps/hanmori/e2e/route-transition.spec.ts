import { expect, test, type Page } from "@playwright/test";

type MotionSample = { visible: string[]; pageOpacity: number; sidebarOpacity: number };

async function recordMotion(page: Page) {
  await page.evaluate(() => {
    const view = window as Window & { motionSamples?: MotionSample[]; motionTimer?: number };
    if (view.motionTimer) window.clearInterval(view.motionTimer);
    view.motionSamples = [];
    view.motionTimer = window.setInterval(() => {
      const content = document.querySelector<HTMLElement>(".route-transition-page main");
      const sidebar = document.querySelector<HTMLElement>(".desktop-sidebar");
      const decorations = document.querySelectorAll<HTMLElement>(
        ".route-wave-panel, .route-breeze-ribbon, .route-ripple-ring",
      );
      if (content) {
        view.motionSamples?.push({
          visible: [...decorations]
            .filter((element) => getComputedStyle(element).visibility === "visible")
            .map((element) => element.className),
          pageOpacity: Number(getComputedStyle(content).opacity),
          sidebarOpacity: sidebar ? Number(getComputedStyle(sidebar).opacity) : 1,
        });
      }
      if ((view.motionSamples?.length ?? 0) > 100 && view.motionTimer) {
        window.clearInterval(view.motionTimer);
      }
    }, 16);
  });
}

async function samplesFrom(page: Page) {
  return page.evaluate(
    () => (window as Window & { motionSamples?: MotionSample[] }).motionSamples ?? [],
  );
}

for (const { destination, kind, decoration } of [
  { destination: "/grammar", kind: "wave", decoration: "route-wave-panel" },
  { destination: "/courses", kind: "breeze", decoration: "route-breeze-ribbon" },
  { destination: "/review", kind: "ripple", decoration: "route-ripple-ring" },
]) test(`${kind} transition appears and clears at ${destination}`, async ({ page }) => {
  await page.goto("/dashboard");
  await recordMotion(page);
  await page.locator(`.desktop-sidebar a[href="${destination}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${destination}$`));
  await expect(page.locator(".route-transition-root")).toHaveAttribute("data-transition", kind);
  await page.waitForTimeout(900);

  const samples = await samplesFrom(page);
  expect(samples.some((sample) => sample.visible.some((name) => name.includes(decoration)))).toBe(true);
  expect(samples.some((sample) => sample.pageOpacity < 1)).toBe(true);
  expect(samples.every((sample) => sample.sidebarOpacity === 1)).toBe(true);
  await expect(page.locator(".route-wave-panel:visible, .route-breeze-ribbon:visible, .route-ripple-ring:visible")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("reduced motion skips every decorative transition", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/dashboard");
  for (const destination of ["/grammar", "/courses", "/review"]) {
    await recordMotion(page);
    await page.locator(`.desktop-sidebar a[href="${destination}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await page.waitForTimeout(250);
    const samples = await samplesFrom(page);
    expect(samples.length).toBeGreaterThan(0);
    expect(samples.every((sample) => sample.visible.length === 0)).toBe(true);
    expect(samples.every((sample) => sample.pageOpacity === 1)).toBe(true);
  }
});

test("mobile menu closes after navigation and leaves the page usable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Mở menu" }).click();
  await page.getByRole("dialog", { name: "Điều hướng chính" })
    .getByRole("link", { name: "Học ngữ pháp" }).click();
  await expect(page).toHaveURL(/\/grammar$/);
  await expect(page.getByRole("dialog", { name: "Điều hướng chính" })).not.toBeVisible();
  await page.waitForTimeout(900);
  await expect(page.locator(".route-wave-panel:visible, .route-breeze-ribbon:visible, .route-ripple-ring:visible")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("quick consecutive navigation leaves no decorative layer behind", async ({ page }) => {
  await page.goto("/dashboard");
  await page.locator('.desktop-sidebar a[href="/grammar"]').click();
  await expect(page).toHaveURL(/\/grammar$/);
  await page.locator('.desktop-sidebar a[href="/courses"]').click();
  await expect(page).toHaveURL(/\/courses$/);
  await page.waitForTimeout(900);
  await expect(page.locator(".route-wave-panel:visible, .route-breeze-ribbon:visible, .route-ripple-ring:visible")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
