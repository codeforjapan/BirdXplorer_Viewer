import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import { FeatureSection } from "./FeatureSection";

describe("FeatureSection", () => {
  it("should render the section title", () => {
    const screen = render(<FeatureSection />);
    expect(screen.getByText("Feature｜特集")).toBeTruthy();
  });

  it("should render View All link", () => {
    const screen = render(<FeatureSection />);
    expect(screen.getByText("View All")).toBeTruthy();
    const viewAllLink = screen.container.querySelector('a[href="/feature"]');
    expect(viewAllLink).toBeTruthy();
  });

  it("should render all feature categories", () => {
    const screen = render(<FeatureSection />);
    expect(screen.getByText("選挙特集")).toBeTruthy();
    expect(screen.getByText("災害特集")).toBeTruthy();
    expect(screen.getByText("道路特集")).toBeTruthy();
    expect(screen.getByText("その他")).toBeTruthy();
  });

  it("should render feature items with links", () => {
    const screen = render(<FeatureSection />);
    expect(screen.getByText("2025年 参議院選挙")).toBeTruthy();
    const sangiinLink = screen.container.querySelector(
      'a[href="/feature/2025-sangiin"]',
    );
    expect(sangiinLink).toBeTruthy();

    expect(screen.getByText(/2024年 能登半島地震/)).toBeTruthy();
    const notoLink = screen.container.querySelector(
      'a[href="/feature/2024-noto-earthquake"]',
    );
    expect(notoLink).toBeTruthy();
  });

  it("should render BaseCards with correct colors", () => {
    const { container } = render(<FeatureSection />);
    const cards = container.querySelectorAll(
      ".rounded-lg.border.border-gray-2",
    );
    expect(cards.length).toBeGreaterThan(0);
  });

  it("should apply custom className when provided", () => {
    const { container } = render(<FeatureSection className="custom-class" />);
    const section = container.querySelector("section");
    expect(section?.classList.contains("custom-class")).toBe(true);
  });

  it("should render PlayButtonIcon for each feature item", () => {
    const { container } = render(<FeatureSection />);
    const playIcons = container.querySelectorAll("svg");
    // At least one icon per feature item plus the FeatureIcon in PageTitle
    expect(playIcons.length).toBeGreaterThan(4);
  });
});
