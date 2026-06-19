import { describe, expect, it } from "vitest";

import { REPORT_ITEMS } from "~/data/reports";

import { render } from "../../../test/test-react";
import { OtherReportCardSection } from "./OtherReportCardSection";

describe("OtherReportCardSection", () => {
  it("should render the section title", async () => {
    const screen = await render(<OtherReportCardSection />);
    expect(screen.getByText("その他のレポート")).toBeTruthy();
  });

  it("should render all report items when maxItems is not specified", async () => {
    const screen = await render(<OtherReportCardSection />);
    for (const item of REPORT_ITEMS) {
      expect(screen.getByText(item.title)).toBeTruthy();
    }
  });

  it("should render only specified number of items when maxItems is set", async () => {
    const maxItems = Math.min(2, REPORT_ITEMS.length);
    const { container } = await render(
      <OtherReportCardSection maxItems={maxItems} />,
    );
    const links = container.querySelectorAll('a[href^="/report/"]');
    expect(links.length).toBe(maxItems);
  });

  it("should render report items with links", async () => {
    const screen = await render(<OtherReportCardSection />);
    const firstItem = REPORT_ITEMS[0];
    if (firstItem) {
      expect(screen.getByText(firstItem.title)).toBeTruthy();
      const reportLink = screen.container.querySelector(
        `a[href="${firstItem.href}"]`,
      );
      expect(reportLink).toBeTruthy();
    }
  });

  it("should apply custom className when provided", async () => {
    const { container } = await render(
      <OtherReportCardSection className="custom-class" />,
    );
    const section = container.querySelector("section");
    expect(section?.classList.contains("custom-class")).toBe(true);
  });

  it("should render PlayButtonIcon for each report item", async () => {
    const maxItems = Math.min(2, REPORT_ITEMS.length);
    const { container } = await render(
      <OtherReportCardSection maxItems={maxItems} />,
    );
    const playIcons = container.querySelectorAll("svg");
    // At least one icon per report item
    expect(playIcons.length).toBeGreaterThanOrEqual(maxItems);
  });

  it("should render descriptions with line-clamp", async () => {
    const { container } = await render(<OtherReportCardSection maxItems={1} />);
    const description = container.querySelector(".line-clamp-6");
    expect(description).not.toBeNull();
  });
});
