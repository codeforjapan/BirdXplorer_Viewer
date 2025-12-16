// TODO: テストのリント系は後で修正
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "dayjs/locale/ja";

import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { render } from "vitest-browser-react";

import { mantineTheme } from "~/config/mantine";
import type { SearchedNote, Topic } from "~/generated/api/schemas";
import Search from "~/routes/_layout.search";

dayjs.extend(customParseFormat);

// Mock hooks and API calls
vi.mock("~/hooks/useNetworkBusy", () => ({
  useNetworkBusy: vi.fn(() => false),
}));

vi.mock("~/generated/api/client", () => ({
  getTopicsApiV1DataTopicsGet: vi.fn(),
  searchApiV1DataSearchGet: vi.fn(),
}));

const mockTopics: Topic[] = [
  {
    topicId: 1,
    label: { ja: "テストトピック1", en: "Test Topic 1" },
    referenceCount: 10,
  },
  {
    topicId: 2,
    label: { ja: "テストトピック2", en: "Test Topic 2" },
    referenceCount: 5,
  },
];

const mockNote: SearchedNote = {
  noteId: "1234567890123456789",
  summary: "テストサマリー",
  language: "ja",
  currentStatus: "CURRENTLY_RATED_HELPFUL",
  topics: [],
  createdAt: 1704067200000,
  postId: "1234567890123456789",
  post: {
    postId: "1234567890123456789",
    text: "テストポスト",
    createdAt: 1704067200000,
    xUserId: "1234567890123456789",
    xUser: {
      userId: "1234567890123456789",
      name: "testuser",
      profileImage: "https://example.com/image.jpg",
      followersCount: 100,
      followingCount: 50,
    },
    mediaDetails: [],
    likeCount: 10,
    repostCount: 5,
    impressionCount: 100,
    link: "https://x.com/test/status/1234567890123456789",
  },
};

const renderWithRouter = (loaderData: any, actionData?: any) => {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: (
          <Search
            actionData={actionData}
            loaderData={loaderData}
            matches={[] as any}
            params={{}}
          />
        ),
        loader: () => loaderData,
      },
    ],
    {
      initialEntries: ["/"],
      initialIndex: 0,
    },
  );

  return render(
    <MantineProvider theme={mantineTheme}>
      <DatesProvider settings={{ locale: "ja", consistentWeeks: true }}>
        <RouterProvider router={router} />
      </DatesProvider>
    </MantineProvider>,
  );
};

describe("Search Page", () => {
  it("renders SearchForm", () => {
    const mockLoaderData = {
      data: {
        topics: mockTopics,
        searchQuery: {
          offset: 0,
          limit: 10,
        },
        searchResults: {
          data: [],
          meta: {
            next: null,
            prev: null,
          },
        },
      },
      error: null,
    };

    const screen = renderWithRouter(mockLoaderData);

    // SearchFormがレンダリングされることを確認
    expect(
      screen.getByText("コミュニティノートに含まれるテキスト"),
    ).toBeTruthy();
  });

  it("renders empty message when no search results", () => {
    const mockLoaderData = {
      data: {
        topics: mockTopics,
        searchQuery: {
          offset: 0,
          limit: 10,
        },
        searchResults: {
          data: [],
          meta: {
            next: null,
            prev: null,
          },
        },
      },
      error: null,
    };

    const screen = renderWithRouter(mockLoaderData);

    expect(
      screen.getByText("コミュニティノートが見つかりませんでした"),
    ).toBeTruthy();
  });

  it("renders Notes when search results exist", () => {
    const mockLoaderData = {
      data: {
        topics: mockTopics,
        searchQuery: {
          note_includes_text: "テスト",
          offset: 0,
          limit: 10,
        },
        searchResults: {
          data: [mockNote],
          meta: {
            next: null,
            prev: null,
          },
        },
      },
      error: null,
    };

    const screen = renderWithRouter(mockLoaderData);

    // 検索結果がレンダリングされることを確認
    expect(screen.getByText("テストサマリー")).toBeTruthy();
  });

  it("renders SearchPagination when search query exists", () => {
    const mockLoaderData = {
      data: {
        topics: mockTopics,
        searchQuery: {
          note_includes_text: "テスト",
          offset: 0,
          limit: 10,
        },
        searchResults: {
          data: [mockNote],
          meta: {
            next: "next-url",
            prev: null,
          },
        },
      },
      error: null,
    };

    const screen = renderWithRouter(mockLoaderData);

    // SearchPaginationがレンダリングされることを確認
    // "1 ～ 1 件目を表示中"というテキストが表示されていることを確認
    expect(screen.getByText("1 ～ 1 件目を表示中")).toBeTruthy();
    // 次のページへのボタンが存在することを確認
    expect(screen.getByLabelText("次のページへ移動する")).toBeTruthy();
  });
});
