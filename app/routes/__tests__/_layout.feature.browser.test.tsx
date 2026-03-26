import { describe, expect, it } from "vitest";

import { FEATURES } from "~/data/features";
import Feature from "~/routes/_layout.feature";

import { render } from "../../../test/test-react";

describe("Feature Page", () => {
  it("renders all feature categories", () => {
    const screen = render(<Feature />, { initialEntries: ["/feature"] });
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.category)).toBeTruthy();
    }
  });

  it("renders feature items with titles", () => {
    const screen = render(<Feature />, { initialEntries: ["/feature"] });
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.detail.title)).toBeTruthy();
    }
  });

  it("renders feature items as links", () => {
    const { container } = render(<Feature />, {
      initialEntries: ["/feature"],
    });
    // Each feature has an <a> tag inside the BaseCard body
    const links = container.querySelectorAll('a[href^="/feature/"]');
    expect(links.length).toBe(FEATURES.length);
  });
});
