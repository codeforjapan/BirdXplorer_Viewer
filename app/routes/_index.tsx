import { parseWithZod } from "@conform-to/zod";
import { Anchor, Card, Container, Divider, Group, Stack } from "@mantine/core";
import { data, Link, redirect } from "react-router";
import { getQuery, withQuery } from "ufo";

import Fa6SolidMagnifyingGlass from "~icons/fa6-solid/magnifying-glass";

import { Notes } from "../components/note/Notes";
import { SearchForm } from "../feature/search/components/SearchForm";
import { SearchPagination } from "../feature/search/components/SearchPagination";
import { noteSearchParamSchema } from "../feature/search/validation";
import {
  getTopicsApiV1DataTopicsGet,
  searchApiV1DataSearchGet,
} from "../generated/api/client";
import type { SearchedNote, Topic } from "../generated/api/schemas";
import { useNetworkBusy } from "../hooks/useNetworkBusy";
import type { Route } from "./+types/_index";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "BirdXplorer" },
    {
      name: "description",
      content:
        "BirdXplorer is software that helps users explore community notes data on X (formerly known as Twitter).",
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
};

export const links: Route.LinksFunction = () => {
  return [
    {
      rel: "canonical",
      href: "https://birdxplorer.code4japan.org",
    },
  ];
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

export default function Index({
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
    <>
      <header className="border-b border-gray-300">
        <Container className="p-4" size="lg">
          <h1 className="text-2xl font-bold">BirdXplorer</h1>
        </Container>
      </header>
      <main>
        <Container className="p-4" size="md">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
            <div className="md:col-span-1">
              <h2 className="sr-only">コミュニティノートを検索する</h2>
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
            <div className="size-full md:col-span-2">
              <h2 className="sr-only">コミュニティノートの検索結果</h2>
              <Stack className="size-full">
                {notes.length > 0 ? (
                  <>
                    {searchQuery && (
                      <SearchPagination
                        className="ms-auto me-0"
                        currentQuery={searchQuery}
                        loading={isNetworkBusy}
                        meta={paginationMeta}
                        visibleItemCount={notes.length}
                      />
                    )}
                    <Group gap="lg">
                      <Notes
                        notes={
                          // react-router の型がうまく機能せず notes[number].topics が unknown になったため
                          notes as SearchedNote[]
                        }
                      />
                    </Group>
                    {searchQuery && (
                      <SearchPagination
                        className="ms-auto me-0"
                        currentQuery={searchQuery}
                        loading={isNetworkBusy}
                        meta={paginationMeta}
                        visibleItemCount={notes.length}
                      />
                    )}
                  </>
                ) : (
                  <Card
                    className="grid size-full place-content-center"
                    padding="lg"
                    radius="md"
                    w="100%"
                    withBorder
                  >
                    <div className="flex flex-col items-center justify-center gap-4 text-zinc-600">
                      <Fa6SolidMagnifyingGlass className="text-4xl text-current" />
                      <span className="text-center text-lg font-semibold text-balance">
                        コミュニティノートが見つかりませんでした
                      </span>
                    </div>
                  </Card>
                )}
              </Stack>
            </div>
          </div>
        </Container>
      </main>
      <footer className="sticky top-full border-t border-zinc-300">
        <Container className="flex justify-center p-4 md:justify-end" size="lg">
          <p className="inline-flex flex-col items-center justify-center gap-2 text-sm font-semibold text-zinc-700 md:flex-row md:gap-4">
            <span>© 2025 Code for Japan</span>
            <Anchor
              c="pink"
              component={Link}
              size="sm"
              target="_blank"
              to="https://www.code4japan.org/"
              underline="hover"
            >
              一般社団法人 コード・フォー・ジャパン
            </Anchor>
          </p>
        </Container>
      </footer>
    </>
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

  const destination = withQuery("/", submission.value);

  return redirect(destination);
};
