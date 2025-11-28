import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders children text correctly", () => {
    const screen = render(<SectionTitle>Feature</SectionTitle>);
    expect(screen.getByText("Feature")).toBeTruthy();
  });

  it("applies custom className", () => {
    const screen = render(
      <SectionTitle className="custom-class">Test Title</SectionTitle>,
    );
    expect(screen.getByText("Test Title")).toBeTruthy();
  });

  it("renders different section titles correctly", () => {
    const screen = render(<SectionTitle>Report</SectionTitle>);
    expect(screen.getByText("Report")).toBeTruthy();
  });
});

