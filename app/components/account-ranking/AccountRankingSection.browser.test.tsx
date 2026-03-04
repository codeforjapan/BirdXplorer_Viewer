import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { render } from "vitest-browser-react";

import type { GraphFetchResult } from "~/components/graph";
import { mantineTheme } from "~/config/mantine";
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

const renderWithDataRouter = () => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <AccountRankingSection initialResult={mockResult} />,
      },
    ],
    {
      initialEntries: ["/"],
      initialIndex: 0,
    },
  );

  return render(
    <MantineProvider theme={mantineTheme}>
      <DatesProvider settings={{ locale: "ja", consistentWeeks: true }}>
        <RouterProvider router={router} />
      </DatesProvider>
    </MantineProvider>,
  );
};

describe("AccountRankingSection", () => {
  it("should render the component with title", () => {
    const screen = renderWithDataRouter();
    expect(screen.getByText("アカウントランキング")).toBeTruthy();
  });

  it("should display table headers correctly", () => {
    const screen = renderWithDataRouter();
    expect(screen.getByText("順位")).toBeTruthy();
    expect(screen.getByText("ユーザー名")).toBeTruthy();
    expect(screen.getByText("付与数")).toBeTruthy();
    expect(screen.getByText("前回比")).toBeTruthy();
  });

  it("should display ranking data in table rows", () => {
    const screen = renderWithDataRouter();
    expect(screen.getByText("テストユーザー1")).toBeTruthy();
    expect(screen.getByText("544")).toBeTruthy();
    expect(screen.getByText("+12")).toBeTruthy();
  });

  it("should display rank numbers from API data", () => {
    const screen = renderWithDataRouter();
    const table = screen.getByRole("table");
    const rows = table.element().querySelectorAll("tbody tr");

    expect(rows.length).toBeGreaterThanOrEqual(3);
    expect(rows[0]?.textContent).toContain("1");
    expect(rows[1]?.textContent).toContain("2");
    expect(rows[2]?.textContent).toContain("3");
  });

  it("should handle period selection dropdown defaulting to 直近1週間", () => {
    const { container } = renderWithDataRouter();
    const select = container.querySelector("input");
    expect(select?.getAttribute("value")).toBe("直近1週間");
  });

  it("should apply correct color to change values", () => {
    const screen = renderWithDataRouter();

    // Positive change should be green
    const positiveChange = screen.getByText("+12");
    expect(positiveChange.element().classList.contains("text-green")).toBe(true);

    // Negative change should be red
    const negativeChange = screen.getByText("-3");
    expect(negativeChange.element().classList.contains("text-red")).toBe(true);
  });

  it("should not set data-hover attribute on table rows", () => {
    const screen = renderWithDataRouter();
    const rows = screen.getByRole("table").element().querySelectorAll("tbody tr");

    rows.forEach((row) => {
      expect(row.getAttribute("data-hover")).toBeNull();
    });
  });
});
