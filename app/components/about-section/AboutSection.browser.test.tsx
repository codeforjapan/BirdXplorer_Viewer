import { describe, expect, it } from "vitest";

import { render } from "../../../test/test-react";
import { AboutSection } from "./AboutSection";

describe("AboutSection", () => {
  it("should render the section title", () => {
    const screen = render(<AboutSection />);
    expect(
      screen.getByText("About us｜バードエクスプローラについて"),
    ).toBeTruthy();
  });

  it("should render service description text", () => {
    const screen = render(<AboutSection />);
    const description = screen.getByText(/サービスに関する説明/);
    expect(description).toBeTruthy();
  });

  it("should render Notion link", () => {
    const screen = render(<AboutSection />);
    const notionLink = screen.getByText("Notionで詳細をみる");
    expect(notionLink).toBeTruthy();
    expect(notionLink.element().closest("a")?.getAttribute("href")).toBe(
      "https://www.disinformation.code4japan.org/?source=copy_link",
    );
    expect(notionLink.element().closest("a")?.getAttribute("target")).toBe(
      "_blank",
    );
    expect(notionLink.element().closest("a")?.getAttribute("rel")).toBe(
      "noopener noreferrer",
    );
  });

  it("should render community notes link", () => {
    const screen = render(<AboutSection />);
    const communityNotesLink = screen.getByText("コミュニティーノートとは？");
    expect(communityNotesLink).toBeTruthy();
    expect(
      communityNotesLink.element().closest("a")?.getAttribute("href"),
    ).toBe("https://help.x.com/ja/using-x/community-notes");
    expect(
      communityNotesLink.element().closest("a")?.getAttribute("target"),
    ).toBe("_blank");
    expect(communityNotesLink.element().closest("a")?.getAttribute("rel")).toBe(
      "noopener noreferrer",
    );
  });

  it("should apply custom className when provided", () => {
    const { container } = render(<AboutSection className="custom-class" />);
    const section = container.querySelector("section");
    expect(section?.classList.contains("custom-class")).toBe(true);
  });
});
