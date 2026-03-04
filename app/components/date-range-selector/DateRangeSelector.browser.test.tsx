import "~/app.css";

import { userEvent } from "@vitest/browser/context";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { render } from "../../../test/test-react";
import { DateRangeSelector } from "./DateRangeSelector";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("DateRangeSelector", () => {
  test("日付セルhover時に背景色がグレーになる", async () => {
    vi.setSystemTime(new Date("2025-01-15T00:00:00Z"));

    const screen = render(<DateRangeSelector onChange={vi.fn()} />);
    const button = screen.getByRole("button", { name: "期間を選択" });
    await userEvent.click(button);

    const hoveredDate = screen.getByRole("button", { name: "10 1月 2025" });
    await userEvent.hover(hoveredDate);

    expect(window.getComputedStyle(hoveredDate.element()).backgroundColor).toBe(
      "rgb(85, 85, 85)",
    );
  });
});
