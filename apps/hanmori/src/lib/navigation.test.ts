import { describe, expect, it } from "vitest";
import { isNavigationActive } from "./navigation";

describe("current learning section", () => {
  it.each([
    ["/", "/"],
    ["/library", "/library"],
    ["/topik", "/library"],
    ["/topik/reading/35-01", "/library"],
    ["/notebook/unknown", "/notebook"],
    ["/courses/lesson", "/courses"],
  ])("keeps %s in %s", (path, section) => {
    expect(isNavigationActive(path, section)).toBe(true);
  });
  it.each([
    ["/topik", "/"],
    ["/notebook-other", "/notebook"],
    ["/topikish", "/library"],
  ])("does not mark unrelated %s as %s", (path, section) => {
    expect(isNavigationActive(path, section)).toBe(false);
  });
});
