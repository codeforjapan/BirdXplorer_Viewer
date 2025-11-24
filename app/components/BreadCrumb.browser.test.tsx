import { describe, expect, test } from "vitest";

import { render } from "../../test/test-react";
import { BreadCrumb } from "./BreadCrumb";

describe("BreadCrumb", () => {
  test("2階層のパンくずリスト", () => {
    const screen = render(
      <div style={{ padding: "16px", backgroundColor: "#808080" }}>
        <BreadCrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "現在のページ" },
          ]}
        />
      </div>,
    );

    const card = screen.getByTestId("breadcrumb-card");
    expect(card.element().outerHTML).toMatchSnapshot();
  });

  test("3階層のパンくずリスト", () => {
    const screen = render(
      <div style={{ padding: "16px", backgroundColor: "#808080" }}>
        <BreadCrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "検索", href: "/search" },
            { label: "検索結果" },
          ]}
        />
      </div>,
    );

    const card = screen.getByTestId("breadcrumb-card");
    expect(card.element().outerHTML).toMatchSnapshot();
  });

  test("4階層のパンくずリスト", () => {
    const screen = render(
      <div style={{ padding: "16px", backgroundColor: "#808080" }}>
        <BreadCrumb
          items={[
            { label: "ホーム", href: "/" },
            { label: "検索", href: "/search" },
            { label: "検索結果", href: "/search/results" },
            { label: "詳細" },
          ]}
        />
      </div>,
    );

    const card = screen.getByTestId("breadcrumb-card");
    expect(card.element().outerHTML).toMatchSnapshot();
  });

  test("長いテキストを含むパンくずリスト", () => {
    const screen = render(
      <div style={{ padding: "16px", backgroundColor: "#808080" }}>
        <BreadCrumb
          items={[
            { label: "ホーム", href: "/" },
            {
              label: "とても長いカテゴリー名が入っている場合のテスト",
              href: "/category",
            },
            { label: "現在のページ" },
          ]}
        />
      </div>,
    );

    const card = screen.getByTestId("breadcrumb-card");
    expect(card.element().outerHTML).toMatchSnapshot();
  });

  test("リンクが正しく機能する", () => {
    const screen = render(
      <BreadCrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "検索", href: "/search" },
          { label: "現在のページ" },
        ]}
      />,
    );

    const homeLink = screen.getByRole("link", { name: "ホーム" });
    expect(homeLink.element().getAttribute("href")).toBe("/");

    const searchLink = screen.getByRole("link", { name: "検索" });
    expect(searchLink.element().getAttribute("href")).toBe("/search");

    // 最後のアイテムはリンクではない
    const currentPage = screen.getByText("現在のページ");
    expect(currentPage.element().tagName).toBe("SPAN");
    expect(currentPage.element().getAttribute("aria-current")).toBe("page");
  });
});
