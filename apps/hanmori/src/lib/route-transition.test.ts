import { describe, expect, it } from "vitest";
import { routeTransitionFor } from "./route-transition";

describe("route transition rhythm", () => {
  it.each([
    ["/", "ripple"],
    ["/review", "ripple"],
    ["/notebook/unknown", "ripple"],
    ["/grammar", "wave"],
    ["/topik/reading/35-01", "wave"],
    ["/library", "wave"],
    ["/courses", "breeze"],
    ["/courses/greetings", "breeze"],
    ["/dashboard", "breeze"],
    ["/topikish", "breeze"],
  ] as const)("uses %s as %s", (path, transition) => {
    expect(routeTransitionFor(path)).toBe(transition);
  });
});
