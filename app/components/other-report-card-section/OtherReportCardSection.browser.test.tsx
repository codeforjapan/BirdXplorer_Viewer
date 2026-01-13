import { describe, expect, it } from "vitest";

import { REPORT_ITEMS } from "~/data/reports";

import { render } from "../../../test/test-react";
import { ReportCardSection } from "./OtherReportCardSection";

describe("ReportCardSection", () => {
  it("should render the section title", () => {
    const screen = render(<ReportCardSection />);
    expect(screen.getByText("その他の特集")).toBeTruthy();
  });

  it("should render all report items when maxItems is not specified", () => {
    const screen = render(<ReportCardSection />);
    expect(screen.getByText("2025年 9月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 8月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 7月レポート")).toBeTruthy();
    expect(screen.getByText("2025年 6月レポート")).toBeTruthy();
  });

  it("should render only specified number of items when maxItems is set", () => {
    const { container } = render(<ReportCardSection maxItems={2} />);
    const links = container.querySelectorAll('a[href^="/report/"]');
    expect(links.length).toBe(2);
  });

  it("should render report items with links", () => {
    const screen = render(<ReportCardSection />);
    expect(screen.getByText("2025年 9月レポート")).toBeTruthy();
    const reportLink = screen.container.querySelector(
      `a[href="${REPORT_ITEMS[0]?.href}"]`,
    );
    expect(reportLink).toBeTruthy();
  });

  it("should apply custom className when provided", () => {
    const { container } = render(
      <ReportCardSection className="custom-class" />,
    );
    const section = container.querySelector("section");
    expect(section?.classList.contains("custom-class")).toBe(true);
  });

  it("should render PlayButtonIcon for each report item", () => {
    const { container } = render(<ReportCardSection maxItems={2} />);
    const playIcons = container.querySelectorAll("svg");
    // At least one icon per report item plus the ReportIcon in PageTitle
    expect(playIcons.length).toBeGreaterThanOrEqual(2);
  });

  it("should render descriptions with line-clamp", () => {
    const { container } = render(<ReportCardSection maxItems={1} />);
    const description = container.querySelector(".line-clamp-6");
    expect(description).not.toBeNull();
  });
});
