import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import type { GraphFetchResult } from "~/components/graph";
import type { TopNoteAccountDataItem } from "~/generated/api/schemas/topNoteAccountDataItem";
import { AccountRankingSection } from "./AccountRankingSection";

const mockResult: GraphFetchResult<TopNoteAccountDataItem[]> = {
  ok: true,
  updatedAt: "2024-01-01",
  data: [
    { rank: 1, username: "テストユーザー1", noteCount: 544, noteCountChange: 12 },
    { rank: 2, username: "テストユーザー2", noteCount: 521, noteCountChange: 6 },
    { rank: 3, username: "テストユーザー3", noteCount: 500, noteCountChange: -3 },
  ],
};

describe("AccountRankingSection", () => {
  it("should render the component with title", () => {
    const screen = render(<AccountRankingSection initialResult={mockResult} />);
    expect(screen.getByText("アカウントランキング")).toBeTruthy();
  });

  it("should display table headers correctly", () => {
    const screen = render(<AccountRankingSection initialResult={mockResult} />);
    expect(screen.getByText("順位")).toBeTruthy();
    expect(screen.getByText("ユーザー名")).toBeTruthy();
    expect(screen.getByText("付与数")).toBeTruthy();
    expect(screen.getByText("前回比")).toBeTruthy();
  });

  it("should display ranking data in table rows", () => {
    const screen = render(<AccountRankingSection initialResult={mockResult} />);
    expect(screen.getByText("テストユーザー1")).toBeTruthy();
    expect(screen.getByText("544")).toBeTruthy();
    expect(screen.getByText("+12")).toBeTruthy();
  });

  it("should display rank numbers from API data", () => {
    const screen = render(<AccountRankingSection initialResult={mockResult} />);
    const table = screen.getByRole("table");
    const rows = table.element().querySelectorAll("tbody tr");

    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows[0]?.textContent).toContain("1");
    expect(rows[1]?.textContent).toContain("2");
    expect(rows[2]?.textContent).toContain("3");
  });

  it("should handle period selection dropdown defaulting to 直近1週間", () => {
    const { container } = render(<AccountRankingSection initialResult={mockResult} />);
    const select = container.querySelector("input");
    expect(select?.getAttribute("value")).toBe("直近1週間");
  });

  it("should apply correct color to change values", () => {
    const screen = render(<AccountRankingSection initialResult={mockResult} />);

    // Positive change should be green
    const positiveChange = screen.getByText("+12");
    expect(positiveChange.element().classList.contains("text-green")).toBe(true);

    // Negative change should be red
    const negativeChange = screen.getByText("-3");
    expect(negativeChange.element().classList.contains("text-red")).toBe(true);
  });
});
