import { describe, expect, it } from "vitest";

import Feature from "~/routes/_layout.feature";

import { render } from "../../../test/test-react";

describe("Feature Page", () => {
  it("renders all feature categories", () => {
    const screen = render(<Feature />);
    expect(screen.getByText("選挙特集")).toBeTruthy();
    expect(screen.getByText("災害特集")).toBeTruthy();
    expect(screen.getByText("道路特集")).toBeTruthy();
    expect(screen.getByText("その他")).toBeTruthy();
  });

  it("renders feature items with links", () => {
    const screen = render(<Feature />);
    expect(screen.getByText("2025年 参議院選挙")).toBeTruthy();
    expect(
      screen.getByText("2024年 能登半島地震 能登半島地震 能登半島地震"),
    ).toBeTruthy();
    expect(screen.getByText("2024年 兵庫県知事選挙")).toBeTruthy();
    expect(screen.getByText("2024年 XXXXXXXXX")).toBeTruthy();
  });

  it("renders feature items as links", () => {
    const { container } = render(<Feature />);
    const links = Array.from(container.querySelectorAll("a"));
    expect(links.length).toBe(4); // 4つの特集アイテム

    // すべてのリンクが/feature/で始まることを確認
    links.forEach(link => {
      expect(link.href).toContain("/feature/");
    });
  });
});
