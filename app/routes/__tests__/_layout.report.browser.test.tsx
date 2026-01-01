import { describe, expect, it } from "vitest";

import Report from "~/routes/_layout.report";

import { render } from "../../../test/test-react";

describe("Report Page", () => {
  it("renders all report items", () => {
    const screen = render(<Report />);
    expect(screen.getByText("2025年 9月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 8月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 7月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 6月レポート")).toBeTruthy();
  });

  it("renders report descriptions", () => {
    const screen = render(<Report />);
    expect(screen.getByText(/奈良市の持続可能な発展を目指す意見/)).toBeTruthy();
    expect(
      screen.getByText(/奈良市の持続可能な発展を目指した様々な提案/),
    ).toBeTruthy();
  });

  it("renders report items as links", () => {
    const { container } = render(<Report />);
    const links = Array.from(container.querySelectorAll("a"));
    expect(links.length).toBe(4); // 4つのレポートアイテム

    // すべてのリンクが/report/で始まることを確認
    links.forEach((link) => {
      expect(link.href).toContain("/report/");
    });
  });

  it("renders ReportCards in grid layout", () => {
    const { container } = render(<Report />);
    const grid = container.querySelector(
      ".grid.grid-cols-1.gap-8.md\\:grid-cols-2.lg\\:grid-cols-4",
    );
    expect(grid).not.toBeNull();
  });
});
