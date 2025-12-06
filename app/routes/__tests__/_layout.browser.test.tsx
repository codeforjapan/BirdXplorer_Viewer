import { describe, expect, it, vi } from "vitest";

import { InfoIcon } from "~/components/icons";
import Layout, { type LayoutHandle } from "~/routes/_layout";

import { render } from "../../../test/test-react";

// Mock useMatches to return test data
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useMatches: vi.fn(),
  };
});

describe("Layout", () => {
  it("renders breadcrumb and page title from handle", async () => {
    const { useMatches } = await import("react-router");
    const mockHandle: LayoutHandle = {
      breadcrumb: [
        { label: "TOP", href: "/" },
        { label: "Test Page" },
      ],
      pageTitle: {
        icon: <InfoIcon isActive />,
        title: "Test Title",
        subtitle: "テストサブタイトル",
      },
    };

    vi.mocked(useMatches).mockReturnValue([
      {
        id: "test",
        pathname: "/test",
        params: {},
        data: undefined,
        handle: mockHandle,
      },
    ]);

    const screen = render(<Layout />);

    expect(screen.getByText("TOP")).toBeTruthy();
    expect(screen.getByText("Test Page")).toBeTruthy();
    expect(screen.getByText("Test Title")).toBeTruthy();
    expect(screen.getByText("テストサブタイトル")).toBeTruthy();
  });

  it("renders only Outlet when handle is undefined", async () => {
    const { useMatches } = await import("react-router");

    vi.mocked(useMatches).mockReturnValue([
      {
        id: "test",
        pathname: "/test",
        params: {},
        data: undefined,
        handle: undefined,
      },
    ]);

    const { container } = render(<Layout />);

    // BreadCrumbとPageTitleがレンダリングされないことを確認
    expect(container.querySelector("[data-testid='breadcrumb-card']")).toBeNull();
  });
});
