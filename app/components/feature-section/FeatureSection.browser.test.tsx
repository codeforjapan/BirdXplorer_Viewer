import { describe, expect, it } from "vitest";

import { FEATURES } from "~/data/features";

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
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.category)).toBeTruthy();
    }
  });

  it("should render feature items with links", () => {
    const screen = render(<FeatureSection />);
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.detail.title)).toBeTruthy();
      const link = screen.container.querySelector(
        `a[href="${feature.detail.href}"]`,
      );
      expect(link).toBeTruthy();
    }
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
    expect(playIcons.length).toBeGreaterThanOrEqual(FEATURES.length + 1);
  });
});
