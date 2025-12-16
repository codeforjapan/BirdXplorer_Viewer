/* eslint-disable react-refresh/only-export-components */
import { parseWithZod } from "@conform-to/zod";
import { Card, Container, Divider, Group, Stack } from "@mantine/core";
import { data, redirect } from "react-router";
import { getQuery, withQuery } from "ufo";

import { SearchIcon } from "~/components/icons";
import { Notes } from "~/components/note/Notes";
import { WEB_PATHS } from "~/constants/paths";
import { SearchForm } from "~/feature/search/components/SearchForm";
import { SearchPagination } from "~/feature/search/components/SearchPagination";
import { noteSearchParamSchema } from "~/feature/search/validation";
import {
  getTopicsApiV1DataTopicsGet,
  searchApiV1DataSearchGet,
} from "~/generated/api/client";
import type { SearchedNote, Topic } from "~/generated/api/schemas";
import { useNetworkBusy } from "~/hooks/useNetworkBusy";
import Fa6SolidMagnifyingGlass from "~icons/fa6-solid/magnifying-glass";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.search";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "検索 - BirdXplorer" },
    {
      name: "description",
      content: "BirdXplorerの検索ページ",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
};

export const handle: LayoutHandle = {
  breadcrumb: [{ label: "TOP", href: "/" }, { label: "Search" }],
  pageTitle: {
    icon: <SearchIcon isActive />,
    title: "Search",
    subtitle: "検索",
  },
};

export const loader = async (args: Route.LoaderArgs) => {
  const rawSearchParams = getQuery(args.request.url);
  const searchQuery =
    await noteSearchParamSchema.safeParseAsync(rawSearchParams);

  if (!searchQuery.success) {
    return data(
      {
        data: {
          searchQuery: null,
          searchResults: {
            data: [],
            meta: {
              next: null,
              prev: null,
            },
          },
          topics: [],
        },
        error: searchQuery.error.errors,
      },
      {
        status: 400,
        statusText: "Bad Request",
      },
    );
  }

  const [topics, response] = await Promise.all([
    // TODO: Topics を毎回 fetch するのは無駄なので、ハードナビゲーション時に fetch してブラウザ側で状態管理するように変更する
    getTopicsApiV1DataTopicsGet(),
    searchApiV1DataSearchGet(searchQuery.data),
  ]);

  return {
    data: {
      searchQuery: searchQuery.data,
      searchResults: response.data,
      topics: topics.data.data,
    },
    error: null,
  };
};

export default function Search({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const isNetworkBusy = useNetworkBusy();

  const {
    topics,
    searchQuery,
    searchResults: { data: notes, meta: paginationMeta },
  } = loaderData.data;

  return (
    <main>
      <Container className="!px-0" size="xl">
        <div className="grid grid-cols-1 gap-4 border-t border-gray-5 pt-5 md:grid-cols-3 md:items-start md:gap-8">
          <div className="md:col-span-1">
            <SearchForm
              defaultValue={searchQuery ?? undefined}
              lastResult={actionData}
              topics={
                // react-router の型がうまく機能せず topics が unknown になったため
                topics as Topic[]
              }
            />
          </div>
          <Divider className="md:hidden" />
          <div className="size-full p-4 md:col-span-2">
            {notes.length > 0 ? (
              <>
                <Stack className="size-full">
                  {searchQuery && (
                    <SearchPagination
                      className="ms-auto me-0"
                      currentQuery={searchQuery}
                      loading={isNetworkBusy}
                      meta={paginationMeta}
                      visibleItemCount={notes.length}
                    />
                  )}

                  <Group
                    className="max-h-[calc(100vh-10rem)] overflow-y-auto"
                    gap="lg"
                  >
                    <Notes
                      notes={
                        // react-router の型がうまく機能せず notes[number].topics が unknown になったため
                        notes as SearchedNote[]
                      }
                    />
                  </Group>
                </Stack>
              </>
            ) : (
              <Card
                className="grid size-full place-content-center"
                padding="lg"
                radius="md"
                w="100%"
                withBorder
              >
                <div className="flex flex-col items-center justify-center gap-4 text-white">
                  <Fa6SolidMagnifyingGlass className="text-4xl text-current" />
                  <span className="text-center text-lg font-semibold text-balance text-white">
                    コミュニティノートが見つかりませんでした
                  </span>
                </div>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: noteSearchParamSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const destination = withQuery(WEB_PATHS.search.index, submission.value);

  return redirect(destination);
};
