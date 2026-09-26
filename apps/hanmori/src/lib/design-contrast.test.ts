import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
function token(name: string): string {
  const value = css.match(new RegExp(`--${name}:\\s*(#[\\da-f]{6})`, "i"))?.[1];
  if (!value) throw new Error(`Missing color token: ${name}`);
  return value;
}
function luminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/../g)!
    .map((channel) => {
      const value = parseInt(channel, 16) / 255;
      return value <= 0.04045
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
describe("small reading text contrast", () => {
  it.each([
    ["muted", "paper"],
    ["muted", "surface"],
    ["accent-text", "paper"],
    ["success", "success-surface"],
    ["error", "error-surface"],
    ["surface", "green"],
  ])("%s on %s meets 4.5:1", (foreground, background) => {
    const a = luminance(token(foreground)),
      b = luminance(token(background));
    expect(
      (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
    ).toBeGreaterThanOrEqual(4.5);
  });
  it.each(["#f3f3eb", "#edf0e9", "#e9eee7"])(
    "secondary copy remains readable on %s",
    (background) => {
      expect(
        (luminance(background) + 0.05) / (luminance(token("muted")) + 0.05),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});
