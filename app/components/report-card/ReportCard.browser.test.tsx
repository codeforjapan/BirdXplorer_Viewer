import { describe, expect, it } from "vitest";

import type { ReportItem } from "~/data/reports";

import { render } from "../../../test/test-react";
import { ReportCard } from "./ReportCard";

const mockReportItem: ReportItem = {
  id: "test-1",
  title: "テストレポート",
  description: "これはテスト用のレポートです。内容は省略されます。",
  href: "/report/test-1",
};

describe("ReportCard", () => {
  it("should render report title", () => {
    const screen = render(<ReportCard item={mockReportItem} />);
    expect(screen.getByText("テストレポート")).toBeTruthy();
  });

  it("should render report description", () => {
    const screen = render(<ReportCard item={mockReportItem} />);
    expect(
      screen.getByText("これはテスト用のレポートです。内容は省略されます。"),
    ).toBeTruthy();
  });

  it("should render description as a link", () => {
    const { container } = render(<ReportCard item={mockReportItem} />);
    const link = container.querySelector('a[href="/report/test-1"]');
    expect(link).not.toBeNull();
  });

  it("should render PlayButtonIcon", () => {
    const { container } = render(<ReportCard item={mockReportItem} />);
    const playIcon = container.querySelector("svg");
    expect(playIcon).not.toBeNull();
  });

  it("should apply line-clamp-6 to description", () => {
    const { container } = render(<ReportCard item={mockReportItem} />);
    const description = container.querySelector(".line-clamp-6");
    expect(description).not.toBeNull();
    expect(description?.textContent).toContain(
      "これはテスト用のレポートです",
    );
  });
});
