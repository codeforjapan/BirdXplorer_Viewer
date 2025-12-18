import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { AccountRankingSection } from "./AccountRankingSection";
import type { AccountRankingData } from "./AccountRankingSection";

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
    render(<AccountRankingSection data={mockData} />);
    expect(screen.getByText("アカウントランキング")).toBeInTheDocument();
  });

  it("should display table headers correctly", () => {
    render(<AccountRankingSection data={mockData} />);
    expect(screen.getByText("順位")).toBeInTheDocument();
    expect(screen.getByText("ユーザー名")).toBeInTheDocument();
    expect(screen.getByText("付与数")).toBeInTheDocument();
    expect(screen.getByText("前回比")).toBeInTheDocument();
    expect(screen.getByText("世界ランキング")).toBeInTheDocument();
  });

  it("should display ranking data in table rows", () => {
    render(<AccountRankingSection data={mockData} />);
    expect(screen.getByText("テストユーザー1")).toBeInTheDocument();
    expect(screen.getByText("544")).toBeInTheDocument();
    expect(screen.getByText("+12")).toBeInTheDocument();
  });

  it("should display rank numbers starting from 1", () => {
    render(<AccountRankingSection data={mockData} />);
    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    
    // Check first row has rank 1
    expect(rows[0]).toHaveTextContent("1");
    // Check second row has rank 2
    expect(rows[1]).toHaveTextContent("2");
    // Check third row has rank 3
    expect(rows[2]).toHaveTextContent("3");
  });

  it("should render username as clickable link to Twitter", () => {
    render(<AccountRankingSection data={mockData} />);
    const link = screen.getByText("テストユーザー1");
    expect(link).toHaveAttribute("href", "https://x.com/test_user1");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should display updated date when provided", () => {
    render(
      <AccountRankingSection data={mockData} updatedAt="2025年10月13日更新" />
    );
    expect(screen.getByText("2025年10月13日更新")).toBeInTheDocument();
  });

  it("should handle period selection dropdown", async () => {
    const user = userEvent.setup();
    render(<AccountRankingSection data={mockData} />);
    
    // デフォルト値は「直近1ヶ月」
    expect(screen.getByDisplayValue("直近1ヶ月")).toBeInTheDocument();
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
      })
    );

    render(<AccountRankingSection data={largeData} />);
    const table = screen.getByRole("table");
    const rows = table.querySelectorAll("tbody tr");
    
    // Should only display first 10 rows
    expect(rows).toHaveLength(10);
  });

  it("should apply correct color to change values", () => {
    render(<AccountRankingSection data={mockData} />);
    
    // Positive change should be green
    const positiveChange = screen.getByText("+12");
    expect(positiveChange).toHaveClass("text-green");
    
    // Negative change should be red
    const negativeChange = screen.getByText("-3");
    expect(negativeChange).toHaveClass("text-red");
  });
});

