import { describe, expect, it, vi } from "vitest";

import { render } from "../../../test/test-react";
import { PeriodSelector } from "./PeriodSelector";

describe("PeriodSelector", () => {
  it("should render with default value", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="1month" />,
    );
    const input = container.querySelector("input");
    expect(input?.value).toBe("直近1ヶ月");
  });

  it("should render calendar icon", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="1month" />,
    );
    const icon = container.querySelector("svg");
    expect(icon).not.toBeNull();
  });

  it("should render with custom period options", () => {
    const customOptions = [
      { value: "custom1", label: "カスタム期間1" },
      { value: "custom2", label: "カスタム期間2" },
    ];
    const { container } = render(
      <PeriodSelector
        onChange={vi.fn()}
        periodOptions={customOptions}
        value="custom1"
      />,
    );
    const input = container.querySelector("input");
    expect(input?.value).toBe("カスタム期間1");
  });

  it("should render with 1week value", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="1week" />,
    );
    const input = container.querySelector("input");
    expect(input?.value).toBe("直近1週間");
  });

  it("should render with 3months value", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="3months" />,
    );
    const input = container.querySelector("input");
    expect(input?.value).toBe("直近3ヶ月");
  });

  it("should render with 6months value", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="6months" />,
    );
    const input = container.querySelector("input");
    expect(input?.value).toBe("直近6ヶ月");
  });

  it("should render with 1year value", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="1year" />,
    );
    const input = container.querySelector("input");
    expect(input?.value).toBe("直近1年");
  });

  it("should apply correct styles", () => {
    const { container } = render(
      <PeriodSelector onChange={vi.fn()} value="1month" />,
    );
    const input = container.querySelector("input");
    expect(input?.style.backgroundColor).toBeTruthy();
    expect(input?.style.color).toBe("white");
  });
});
