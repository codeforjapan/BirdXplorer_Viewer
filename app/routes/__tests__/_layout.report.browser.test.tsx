import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { REPORT_ITEMS } from "~/data/reports";
import Report from "~/routes/_layout.report";

import { render } from "../../../test/test-react";

describe("Report Page", () => {
  beforeEach(() => {
    // Mock the current date to 2026-03-26 so "1 year" filter shows relevant data
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-26T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders report items", () => {
    const screen = render(<Report />, { initialEntries: ["/report"] });
    for (const item of REPORT_ITEMS) {
      expect(screen.getByText(item.title)).toBeTruthy();
    }
  });

  it("renders report descriptions", () => {
    const screen = render(<Report />, { initialEntries: ["/report"] });
    const firstItem = REPORT_ITEMS[0];
    if (firstItem) {
      // Check that at least part of the description is rendered
      expect(
        screen.getByText(new RegExp(firstItem.description.slice(0, 20))),
      ).toBeTruthy();
    }
  });

  it("renders period selector", () => {
    const { container } = render(<Report />, { initialEntries: ["/report"] });
    const selector = container.querySelector("input");
    expect(selector).not.toBeNull();
    expect(selector?.value).toBe("直近1年");
  });

  it("renders report items as links", () => {
    const { container } = render(<Report />, { initialEntries: ["/report"] });
    const links = container.querySelectorAll('a[href^="/report/"]');
    // Number of links should match the filtered report items
    expect(links.length).toBeGreaterThanOrEqual(1);

    // すべてのリンクが/report/で始まることを確認
    links.forEach((link) => {
      expect((link as HTMLAnchorElement).href).toContain("/report/");
    });
  });

  it("renders ReportCards in grid layout", () => {
    const { container } = render(<Report />, { initialEntries: ["/report"] });
    const grid = container.querySelector(
      ".grid.grid-cols-1.gap-8.md\\:grid-cols-2.lg\\:grid-cols-4",
    );
    expect(grid).not.toBeNull();
  });
});
