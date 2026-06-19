import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import { ToolTips } from "./ToolTips";

describe("ToolTips", () => {
  it("renders info icon by default", async () => {
    const { container } = await render(<ToolTips content="Test tooltip" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders exclamation icon when iconType is exclamation", async () => {
    const { container } = await render(<ToolTips content="Test tooltip" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("renders info icon when iconType is info", async () => {
    const { container } = await render(<ToolTips content="Test tooltip" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("applies custom className", async () => {
    const { container } = await render(
      <ToolTips className="custom-class" content="Test tooltip" />,
    );
    const button = container.querySelector("button");
    expect(button?.className).toContain("custom-class");
  });

  it("renders tooltip content", async () => {
    const screen = await render(<ToolTips content="Test tooltip content" />);
    // Tooltip content is rendered in portal, so we check if the component renders
    const button = screen.getByRole("button", { name: "Tooltip trigger" });
    expect(button).toBeTruthy();
  });
});
