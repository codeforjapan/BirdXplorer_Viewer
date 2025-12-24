import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import type { AccountRankingData } from "./AccountRankingSection";
import { AccountRankingSection } from "./AccountRankingSection";

const mockData: AccountRankingData[] = [
  {
    username: "test_user1",
    displayName: "テストユーザー1",
    noteCount: 544,
    change: "+12",
    worldRank: 4,
    changeDirection: "up",
  },
  {
    username: "test_user2",
    displayName: "テストユーザー2",
    noteCount: 521,
    change: "+6",
    worldRank: 5,
    changeDirection: "up",
  },
  {
    username: "test_user3",
    displayName: "テストユーザー3",
    noteCount: 500,
    change: "-3",
    worldRank: 6,
    changeDirection: "down",
  },
];

describe("AccountRankingSection", () => {
  it("should render the component with title", () => {
    const screen = render(<AccountRankingSection data={mockData} />);
    expect(screen.getByText("アカウントランキング")).toBeTruthy();
  });

  it("should display table headers correctly", () => {
    const screen = render(<AccountRankingSection data={mockData} />);
    expect(screen.getByText("順位")).toBeTruthy();
    expect(screen.getByText("ユーザー名")).toBeTruthy();
    expect(screen.getByText("付与数")).toBeTruthy();
    expect(screen.getByText("前回比")).toBeTruthy();
    expect(screen.getByText("世界ランキング")).toBeTruthy();
  });

  it("should display ranking data in table rows", () => {
    const screen = render(<AccountRankingSection data={mockData} />);
    expect(screen.getByText("テストユーザー1")).toBeTruthy();
    expect(screen.getByText("544")).toBeTruthy();
    expect(screen.getByText("+12")).toBeTruthy();
  });

  it("should display rank numbers starting from 1", () => {
    const screen = render(<AccountRankingSection data={mockData} />);
    const table = screen.getByRole("table");
    const rows = table.element().querySelectorAll("tbody tr");

    // Check first row has rank 1
    expect(rows[0].textContent).toContain("1");
    // Check second row has rank 2
    expect(rows[1].textContent).toContain("2");
    // Check third row has rank 3
    expect(rows[2].textContent).toContain("3");
  });

  it("should render username as clickable link to Twitter", () => {
    const screen = render(<AccountRankingSection data={mockData} />);
    const link = screen.getByText("テストユーザー1");
    expect(link.element().closest("a")?.getAttribute("href")).toBe(
      "https://x.com/test_user1",
    );
    expect(link.element().closest("a")?.getAttribute("target")).toBe("_blank");
    expect(link.element().closest("a")?.getAttribute("rel")).toBe(
      "noopener noreferrer",
    );
  });

  it("should handle period selection dropdown", () => {
    const { container } = render(<AccountRankingSection data={mockData} />);

    // デフォルト値は「直近1ヶ月」
    const select = container.querySelector("input");
    expect(select?.getAttribute("value")).toBe("直近1ヶ月");
  });

  it("should limit display to 10 records", () => {
    const largeData: AccountRankingData[] = Array.from(
      { length: 20 },
      (_, i) => ({
        username: `user${i}`,
        displayName: `ユーザー${i}`,
        noteCount: 500 - i * 10,
        change: "+5",
        worldRank: i + 1,
        changeDirection: "up" as const,
      }),
    );

    const screen = render(<AccountRankingSection data={largeData} />);
    const table = screen.getByRole("table");
    const rows = table.element().querySelectorAll("tbody tr");

    // Should only display first 10 rows
    expect(rows.length).toBe(10);
  });

  it("should apply correct color to change values", () => {
    const screen = render(<AccountRankingSection data={mockData} />);

    // Positive change should be green
    const positiveChange = screen.getByText("+12");
    expect(positiveChange.element().classList.contains("text-green")).toBe(
      true,
    );

    // Negative change should be red
    const negativeChange = screen.getByText("-3");
    expect(negativeChange.element().classList.contains("text-red")).toBe(true);
  });
});
