import { describe, expect, it } from "vitest";

import type { FeatureCategory } from "~/data/features";

import { render } from "../../../test/test-react";
import { FeatureCategoryCard } from "./FeatureCategoryCard";

const mockCategory: FeatureCategory = {
  title: "テストカテゴリ",
  color: "bg-green",
  items: [
    { title: "アイテム1", href: "/test/item1" },
    { title: "アイテム2", href: "/test/item2" },
    { title: "アイテム3", href: "/test/item3" },
  ],
};

describe("FeatureCategoryCard", () => {
  it("should render category title", () => {
    const screen = render(<FeatureCategoryCard category={mockCategory} />);
    expect(screen.getByText("テストカテゴリ")).toBeTruthy();
  });

  it("should render all items when maxItems is not specified", () => {
    const screen = render(<FeatureCategoryCard category={mockCategory} />);
    expect(screen.getByText("アイテム1")).toBeTruthy();
    expect(screen.getByText("アイテム2")).toBeTruthy();
    expect(screen.getByText("アイテム3")).toBeTruthy();
  });

  it("should render only first item when maxItems is 1", () => {
    const { container } = render(
      <FeatureCategoryCard category={mockCategory} maxItems={1} />,
    );
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(1);
    expect(links[0]?.textContent).toContain("アイテム1");
  });

  it("should render first two items when maxItems is 2", () => {
    const { container } = render(
      <FeatureCategoryCard category={mockCategory} maxItems={2} />,
    );
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(2);
    expect(links[0]?.textContent).toContain("アイテム1");
    expect(links[1]?.textContent).toContain("アイテム2");
  });

  it("should render items as links with correct href", () => {
    const { container } = render(
      <FeatureCategoryCard category={mockCategory} />,
    );
    const link1 = container.querySelector('a[href="/test/item1"]');
    const link2 = container.querySelector('a[href="/test/item2"]');
    const link3 = container.querySelector('a[href="/test/item3"]');

    expect(link1).not.toBeNull();
    expect(link2).not.toBeNull();
    expect(link3).not.toBeNull();
  });

  it("should apply category color to title", () => {
    const { container } = render(
      <FeatureCategoryCard category={mockCategory} />,
    );
    const titleWrapper = container.querySelector(".bg-green");
    expect(titleWrapper).not.toBeNull();
    expect(titleWrapper?.classList.contains("bg-green")).toBe(true);
  });

  it("should render PlayButtonIcon for each item", () => {
    const { container } = render(
      <FeatureCategoryCard category={mockCategory} />,
    );
    const playIcons = container.querySelectorAll("svg");
    // 3 items should have 3 icons
    expect(playIcons.length).toBe(3);
  });

  it("should handle category with single item", () => {
    const singleItemCategory: FeatureCategory = {
      title: "単一アイテム",
      color: "bg-blue",
      items: [{ title: "唯一のアイテム", href: "/test/single" }],
    };

    const screen = render(
      <FeatureCategoryCard category={singleItemCategory} />,
    );
    expect(screen.getByText("唯一のアイテム")).toBeTruthy();
    const { container } = render(
      <FeatureCategoryCard category={singleItemCategory} />,
    );
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(1);
  });

  it("should handle maxItems greater than items length", () => {
    const screen = render(
      <FeatureCategoryCard category={mockCategory} maxItems={10} />,
    );
    expect(screen.getByText("アイテム1")).toBeTruthy();
    expect(screen.getByText("アイテム2")).toBeTruthy();
    expect(screen.getByText("アイテム3")).toBeTruthy();
  });
});
