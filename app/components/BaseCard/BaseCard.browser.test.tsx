import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import { BaseCard } from "./BaseCard";

describe("BaseCard", () => {
  it("renders title and body correctly", () => {
    const screen = render(
      <BaseCard body={<div>Body Content</div>} title="Card Title" />,
    );
    expect(screen.getByText("Card Title")).toBeTruthy();
    expect(screen.getByText("Body Content")).toBeTruthy();
  });

  it("applies default black background color to title", () => {
    const { container } = render(
      <BaseCard body={<div>Body</div>} title="Title" />,
    );
    const titleWrapper = container.querySelector(".bg-black");
    expect(titleWrapper).not.toBeNull();
    expect(titleWrapper?.classList.contains("bg-black")).toBe(true);
  });

  it("applies custom background color to title", () => {
    const { container } = render(
      <BaseCard
        body={<div>Body</div>}
        title="Title"
        titleBgColor="bg-primary"
      />,
    );
    const titleWrapper = container.querySelector(".bg-primary");
    expect(titleWrapper).not.toBeNull();
    expect(titleWrapper?.classList.contains("bg-primary")).toBe(true);
  });

  it("applies custom className to container", () => {
    const { container } = render(
      <BaseCard
        body={<div>Body</div>}
        className="custom-class"
        title="Title"
      />,
    );
    expect(container.firstChild).toBeTruthy();
    const element = container.firstChild as HTMLElement;
    expect(element.className).toContain("custom-class");
  });

  it("renders complex ReactNode as title and body", () => {
    const screen = render(
      <BaseCard
        body={
          <div>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </div>
        }
        title={
          <div>
            <span>Complex</span> <span>Title</span>
          </div>
        }
      />,
    );
    expect(screen.getByText("Complex")).toBeTruthy();
    expect(screen.getByText("Title")).toBeTruthy();
    expect(screen.getByText("Paragraph 1")).toBeTruthy();
    expect(screen.getByText("Paragraph 2")).toBeTruthy();
  });
});
