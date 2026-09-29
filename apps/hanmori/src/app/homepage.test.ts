import { describe, expect, it } from "vitest";
import Home from "./page";
import DashboardPage from "./dashboard/page";
import { SeoulHome } from "@/components/SeoulHome";
import { Dashboard } from "@/components/Dashboard";

describe("Hanmori home routes", () => {
  it("uses the Seoul introduction at the public root", () => {
    expect(Home().type).toBe(SeoulHome);
  });

  it("keeps the personalized learning dashboard available", () => {
    expect(DashboardPage().type).toBe(Dashboard);
  });
});
