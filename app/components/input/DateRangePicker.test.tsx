import { getFormProps, useForm } from "@conform-to/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { render, screen } from "../../../test/test-react";
import { userEvent } from "../../../test/vitest-setup";
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
    render(<Page defaultValue={{ start: null, end: null }} />);

    const button = screen.getByRole("button", { name: "Date Range" });
    await userEvent.click(button);

    // start: 2025-01-09T15:00:00.000Z
    const date1 = screen.getByRole("button", { name: "10 1月 2025" });
    await userEvent.click(date1);

    // end: 2025-01-14T15:00:00.000Z
    const date2 = screen.getByRole("button", { name: "15 1月 2025" });
    await userEvent.click(date2);

    const span = screen.getByLabelText("result");
    expect(span).toHaveTextContent(
      "2025-01-09T15:00:00.000Z – 2025-01-14T15:00:00.000Z",
    );
  });

  test("convert で指定した処理を用いてフォームの値を UI に反映できる", () => {
    render(
      <Page
        defaultValue={{
          start: "2025-01-09T15:00:00.000Z",
          end: "2025-01-14T15:00:00.000Z",
        }}
      />,
    );

    const button = screen.getByRole("button", { name: "Date Range" });
    expect(button).toHaveTextContent("2025.01.10 (金) – 2025.01.15 (水)");
  });
});
