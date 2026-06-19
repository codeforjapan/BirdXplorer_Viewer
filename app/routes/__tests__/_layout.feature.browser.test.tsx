import { describe, expect, it } from "vitest";

import { FEATURES } from "~/data/features";
import Feature from "~/routes/_layout.feature";

import { render } from "../../../test/test-react";

describe("Feature Page", () => {
  it("renders all feature categories", async () => {
    const screen = await render(<Feature />, { initialEntries: ["/feature"] });
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.category)).toBeTruthy();
    }
  });

  it("renders feature items with titles", async () => {
    const screen = await render(<Feature />, { initialEntries: ["/feature"] });
    for (const feature of FEATURES) {
      expect(screen.getByText(feature.detail.title)).toBeTruthy();
    }
  });

  it("renders feature items as links", async () => {
    const { container } = await render(<Feature />, {
      initialEntries: ["/feature"],
    });
    // Each feature has an <a> tag inside the BaseCard body
    const links = container.querySelectorAll('a[href^="/feature/"]');
    expect(links.length).toBe(FEATURES.length);
  });
});
