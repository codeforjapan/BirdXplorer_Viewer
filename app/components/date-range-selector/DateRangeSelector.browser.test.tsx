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

  test("maxRangeDays指定時、開始日から制限日数を超える日付が選択不可になる", async () => {
    vi.setSystemTime(new Date("2025-01-15T00:00:00Z"));

    const onChange = vi.fn();
    // 開始日が1/5に選択済み、終了日は未選択
    const screen = render(
      <DateRangeSelector
        maxRangeDays={7}
        onChange={onChange}
        value={[new Date("2025-01-05T00:00:00Z"), null]}
      />,
    );

    // カレンダーを開く（value設定時は日付テキストが表示される）
    const button = screen.getByRole("button", { name: /2025\/01\/05/ });
    await userEvent.click(button);

    // カレンダーが表示されるまで待機
    const withinRange = screen.getByRole("button", { name: "12 1月 2025" });
    await expect.element(withinRange).toBeVisible();

    // 1/12 (開始日+7日) は選択可能
    expect(withinRange.element().hasAttribute("data-disabled")).toBe(false);

    // 1/13 (開始日+8日) は選択不可
    const outsideRange = screen.getByRole("button", { name: "13 1月 2025" });
    expect(outsideRange.element().hasAttribute("data-disabled")).toBe(true);
  });

  test("maxRangeDays未指定時、日付制限がかからない", async () => {
    vi.setSystemTime(new Date("2025-01-15T00:00:00Z"));

    const onChange = vi.fn();
    const screen = render(
      <DateRangeSelector
        onChange={onChange}
        value={[new Date("2025-01-05T00:00:00Z"), null]}
      />,
    );

    const button = screen.getByRole("button", { name: /2025\/01\/05/ });
    await userEvent.click(button);

    // カレンダーが表示されるまで待機
    const date = screen.getByRole("button", { name: "13 1月 2025" });
    await expect.element(date).toBeVisible();

    // 1/13 が選択可能なまま
    expect(date.element().hasAttribute("data-disabled")).toBe(false);
  });
});
