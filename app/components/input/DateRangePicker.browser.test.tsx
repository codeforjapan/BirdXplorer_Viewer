import "~/app.css";

import { getFormProps, useForm } from "@conform-to/react";
import { userEvent } from "@vitest/browser/context";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { render } from "../../../test/test-react";
import { DateRangePicker } from "./DateRangePicker";

type Form = {
  /**
   * ISO String
   */
  start: string | null;
  /**
   * ISO String
   */
  end: string | null;
};

type PageProps = {
  defaultValue: Form;
};

const formatDateLabel = (isoString: string) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const weekday = date.toLocaleDateString("ja-JP", { weekday: "short" });
  return `${year}.${month}.${day} (${weekday})`;
};

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

const Page = ({ defaultValue }: PageProps) => {
  const [form, fields] = useForm<Form>({
    defaultValue,
  });

  return (
    <div>
      <form {...getFormProps(form)}>
        <DateRangePicker
          convertFormValueToMantine={(value) =>
            value ? new Date(value) : null
          }
          convertMantineValueToForm={(date) => date?.toISOString()}
          fromField={fields.start}
          label="Date Range"
          toField={fields.end}
        />
        <button type="submit">Submit</button>
      </form>
      <span aria-label="result">
        {fields.start.value} – {fields.end.value}
      </span>
    </div>
  );
};

describe("DateRangePicker", () => {
  test("convert で指定した処理を用いて UI の値をフォームに反映できる", async () => {
    // 確実に 2025 年 1 月のカレンダーを表示するため、システム時刻を固定する
    vi.setSystemTime(new Date("2025-01-15T00:00:00Z"));
    const screen = render(<Page defaultValue={{ start: null, end: null }} />);

    const button = screen.getByRole("button", { name: "Date Range" });
    await userEvent.click(button);

    // start: 2025-01-09T15:00:00.000Z
    const date1 = screen.getByRole("button", { name: "10 1月 2025" });
    await userEvent.click(date1);

    // end: 2025-01-14T15:00:00.000Z
    const date2 = screen.getByRole("button", { name: "15 1月 2025" });
    await userEvent.click(date2);

    const expectedStart = new Date(2025, 0, 10).toISOString();
    const expectedEnd = new Date(2025, 0, 15).toISOString();
    const span = screen.getByLabelText("result");
    expect(span).toHaveTextContent(`${expectedStart} – ${expectedEnd}`);
  });

  test("convert で指定した処理を用いてフォームの値を UI に反映できる", () => {
    const screen = render(
      <Page
        defaultValue={{
          start: "2025-01-09T15:00:00.000Z",
          end: "2025-01-14T15:00:00.000Z",
        }}
      />,
    );

    const button = screen.getByRole("button", { name: "Date Range" });
    expect(button).toHaveTextContent(
      `${formatDateLabel("2025-01-09T15:00:00.000Z")} – ${formatDateLabel("2025-01-14T15:00:00.000Z")}`,
    );
  });

  test("日付セルhover時に背景色がグレーになる", async () => {
    vi.setSystemTime(new Date("2025-01-15T00:00:00Z"));
    const screen = render(<Page defaultValue={{ start: null, end: null }} />);

    const button = screen.getByRole("button", { name: "Date Range" });
    await userEvent.click(button);

    const hoveredDate = screen.getByRole("button", { name: "10 1月 2025" });
    await userEvent.hover(hoveredDate);

    expect(window.getComputedStyle(hoveredDate.element()).backgroundColor).toBe(
      "rgb(85, 85, 85)",
    );
  });

  test("範囲内日付hover時にも背景色がグレーになる", async () => {
    vi.setSystemTime(new Date("2025-01-15T00:00:00Z"));
    const screen = render(<Page defaultValue={{ start: null, end: null }} />);

    const button = screen.getByRole("button", { name: "Date Range" });
    await userEvent.click(button);

    const startDate = screen.getByRole("button", { name: "10 1月 2025" });
    await userEvent.click(startDate);
    const endDate = screen.getByRole("button", { name: "15 1月 2025" });
    await userEvent.click(endDate);

    await userEvent.click(button);
    const inRangeDate = screen.getByRole("button", { name: "12 1月 2025" });
    await userEvent.hover(inRangeDate);

    expect(inRangeDate.element().getAttribute("data-in-range")).toBeTruthy();
    expect(window.getComputedStyle(inRangeDate.element()).backgroundColor).toBe(
      "rgb(85, 85, 85)",
    );
  });
});
