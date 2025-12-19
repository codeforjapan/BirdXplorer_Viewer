import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AboutSection } from "./AboutSection";

describe("AboutSection", () => {
  it("should render the section title", () => {
    render(<AboutSection />);
    expect(
      screen.getByText("About us｜バードエクスプローラについて")
    ).toBeInTheDocument();
  });

  it("should render service description text", () => {
    render(<AboutSection />);
    const description = screen.getByText(/サービスに関する説明/);
    expect(description).toBeInTheDocument();
  });

  it("should render Notion link", () => {
    render(<AboutSection />);
    const notionLink = screen.getByText("[ Notionで詳細をみる ]");
    expect(notionLink).toBeInTheDocument();
    expect(notionLink).toHaveAttribute("href", "#");
    expect(notionLink).toHaveAttribute("target", "_blank");
    expect(notionLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render community notes link", () => {
    render(<AboutSection />);
    const communityNotesLink = screen.getByText("コミュニティーノートとは？");
    expect(communityNotesLink).toBeInTheDocument();
    expect(communityNotesLink).toHaveAttribute(
      "href",
      "https://communitynotes.x.com/guide/ja/about/introduction"
    );
    expect(communityNotesLink).toHaveAttribute("target", "_blank");
    expect(communityNotesLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("should render community notes description", () => {
    render(<AboutSection />);
    const description = screen.getByText(/コミュニティノートの説明/);
    expect(description).toBeInTheDocument();
  });

  it("should apply custom className when provided", () => {
    const { container } = render(<AboutSection className="custom-class" />);
    const section = container.querySelector("section");
    expect(section).toHaveClass("custom-class");
  });

  it("should render two card-like containers", () => {
    const { container } = render(<AboutSection />);
    const cards = container.querySelectorAll(".rounded-lg.border.border-gray-2");
    expect(cards).toHaveLength(2);
  });
});

