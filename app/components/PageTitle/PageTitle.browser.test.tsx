import { describe, expect, it } from "vitest";

import { InfoIcon } from "~/components/icons";

import { render } from "../../../test/test-react";
import { PageTitle } from "./PageTitle";

describe("PageTitle", () => {
  it("renders icon, title and subtitle correctly", () => {
    const screen = render(
      <PageTitle
        icon={<InfoIcon isActive />}
        subtitle="|　バードエクスプローラについて"
        title="About us"
      />,
    );

    expect(screen.getByText("About us")).toBeDefined();
    expect(screen.getByText("|　バードエクスプローラについて")).toBeDefined();
  });

  it("applies custom className", () => {
    const screen = render(
      <PageTitle
        className="custom-class"
        icon={<InfoIcon isActive />}
        subtitle="Test Subtitle"
        title="Test Title"
      />,
    );

    const pageTitle = screen.container.querySelector(".page-title");
    expect(pageTitle?.classList.contains("custom-class")).toBe(true);
  });

  it("renders different titles correctly", () => {
    const screen = render(
      <PageTitle
        icon={<InfoIcon isActive />}
        subtitle="特集"
        title="Feature"
      />,
    );

    expect(screen.getByText("Feature")).toBeDefined();
    expect(screen.getByText("特集")).toBeDefined();
  });
});
