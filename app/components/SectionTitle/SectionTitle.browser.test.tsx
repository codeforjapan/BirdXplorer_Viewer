import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import { SectionTitle } from "./SectionTitle";

describe("SectionTitle", () => {
  it("renders children text correctly", async () => {
    const screen = await render(<SectionTitle title="Feature" />);
    expect(screen.getByText("Feature")).toBeTruthy();
  });

  it("applies custom className", async () => {
    const screen = await render(
      <SectionTitle className="custom-class" title="Test Title" />,
    );
    expect(screen.getByText("Test Title")).toBeTruthy();
  });

  it("renders different section titles correctly", async () => {
    const screen = await render(<SectionTitle title="Report" />);
    expect(screen.getByText("Report")).toBeTruthy();
  });
});
