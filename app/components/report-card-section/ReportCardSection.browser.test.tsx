import { describe, expect, it } from "vitest";

import { REPORT_ITEMS } from "~/data/reports";

import { render } from "../../../test/test-react";
import { ReportCardSection } from "./ReportCardSection";

describe("ReportCardSection", () => {
  it("should render the section title", () => {
    const screen = render(<ReportCardSection />);
    expect(screen.getByText("Report｜月次レポート")).toBeTruthy();
  });

  it("should render View All link", () => {
    const screen = render(<ReportCardSection />);
    expect(screen.getByText("View All")).toBeTruthy();
    const viewAllLink = screen.container.querySelector('a[href="/report"]');
    expect(viewAllLink).toBeTruthy();
  });

  it("should render all report items when maxItems is not specified", () => {
    const screen = render(<ReportCardSection />);
    for (const item of REPORT_ITEMS) {
      expect(screen.getByText(item.title)).toBeTruthy();
    }
  });

  it("should render only specified number of items when maxItems is set", () => {
    const maxItems = Math.min(2, REPORT_ITEMS.length);
    const { container } = render(<ReportCardSection maxItems={maxItems} />);
    const links = container.querySelectorAll('a[href^="/report/"]');
    expect(links.length).toBe(maxItems);
  });

  it("should render report items with links", () => {
    const screen = render(<ReportCardSection />);
    const firstItem = REPORT_ITEMS[0];
    if (firstItem) {
      expect(screen.getByText(firstItem.title)).toBeTruthy();
      const reportLink = screen.container.querySelector(
        `a[href="${firstItem.href}"]`,
      );
      expect(reportLink).toBeTruthy();
    }
  });

  it("should apply custom className when provided", () => {
    const { container } = render(
      <ReportCardSection className="custom-class" />,
    );
    const section = container.querySelector("section");
    expect(section?.classList.contains("custom-class")).toBe(true);
  });

  it("should render PlayButtonIcon for each report item", () => {
    const maxItems = Math.min(2, REPORT_ITEMS.length);
    const { container } = render(<ReportCardSection maxItems={maxItems} />);
    const playIcons = container.querySelectorAll("svg");
    // At least one icon per report item plus the ReportIcon in PageTitle
    expect(playIcons.length).toBeGreaterThanOrEqual(maxItems);
  });

  it("should render descriptions with line-clamp", () => {
    const { container } = render(<ReportCardSection maxItems={1} />);
    const description = container.querySelector(".line-clamp-6");
    expect(description).not.toBeNull();
  });
});
