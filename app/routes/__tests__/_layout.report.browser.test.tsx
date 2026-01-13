import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Report from "~/routes/_layout.report";

import { render } from "../../../test/test-react";

describe("Report Page", () => {
  beforeEach(() => {
    // Mock the current date to 2025-09-30 so "1 year" filter shows Oct 2024 - Sep 2025
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-09-30T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders default period (1 year) report items", () => {
    const screen = render(<Report />, { initialEntries: ["/report"] });
    // デフォルトは1年分（12件）表示
    expect(screen.getByText("2025年 9月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 8月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 1月レポート")).toBeTruthy();
    expect(screen.getByText("2024年 12月レポート")).toBeTruthy();
    expect(screen.getByText("2024年 10月レポート")).toBeTruthy();
  });

  it("renders report descriptions", () => {
    const screen = render(<Report />, { initialEntries: ["/report"] });
    expect(screen.getByText(/奈良市の持続可能な発展を目指す意見/)).toBeTruthy();
    expect(
      screen.getByText(/奈良市の持続可能な発展を目指した様々な提案/),
    ).toBeTruthy();
  });

  it("renders period selector", () => {
    const { container } = render(<Report />, { initialEntries: ["/report"] });
    const selector = container.querySelector("input");
    expect(selector).not.toBeNull();
    expect(selector?.value).toBe("直近1年");
  });

  it("renders report items as links", () => {
    const { container } = render(<Report />, { initialEntries: ["/report"] });
    const links = Array.from(container.querySelectorAll("a"));
    expect(links.length).toBe(12); // デフォルト1年分のレポートアイテム

    // すべてのリンクが/report/で始まることを確認
    links.forEach((link) => {
      expect(link.href).toContain("/report/");
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
