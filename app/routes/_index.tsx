import { parseWithZod } from "@conform-to/zod";
import {
  Card,
  Container,
  Divider,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { data, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { getQuery, withQuery } from "ufo";
import type { z } from "zod";

import { Notes } from "../components/note/Notes";
import { SearchForm } from "../feature/search/components/SearchForm";
import { SearchPagination } from "../feature/search/components/SearchPagination";
import { noteSearchParamSchema } from "../feature/search/validation";
import {
  getTopicsApiV1DataTopicsGet,
  searchApiV1DataSearchGet,
} from "../generated/api/client";

export const meta: MetaFunction = () => {
  return [
    { title: "BirdXPlorer Viewer" },
    {
      name: "description",
      content:
        "BirdXPlorer Viewer is a X community note viewer with search functionality.",
    },
  ];
};

export const links: LinksFunction = () => {
  return [
    {
      rel: "canonical",
      // TODO: change before production
      href: "https://birdxplorer.code4japan.org",
    },
  ];
};

export const loader = async (args: LoaderFunctionArgs) => {
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

  const query: z.infer<typeof noteSearchParamSchema> = {
    ...searchQuery.data,
    post_includes_text: searchQuery.data.post_includes_text ?? "biden",
  };

  const [topics, response] = await Promise.all([
    getTopicsApiV1DataTopicsGet(),
    searchApiV1DataSearchGet(query),
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

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const {
    topics,
    searchQuery,
    searchResults: { data: notes, meta: paginationMeta },
  } = data;

  return (
    <Container size="lg">
      <Title>BirdXPlorer Viewer</Title>
      <Space h="2rem" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
        <div className="md:col-span-1">
          <SearchForm
            defaultValue={searchQuery ?? undefined}
            lastResult={lastResult}
            topics={topics}
          />
        </div>
        <Divider className="md:hidden" />
        <Stack className="md:col-span-3 size-full">
          {notes.length > 0 ? (
            <>
              {searchQuery && (
                <SearchPagination
                  className="me-0 ms-auto"
                  currentQuery={searchQuery}
                  meta={paginationMeta}
                  visibleItemCount={notes.length}
                />
              )}
              <Group gap="lg">
                <Notes notes={notes} />
              </Group>
              {searchQuery && (
                <SearchPagination
                  className="me-0 ms-auto"
                  currentQuery={searchQuery}
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
              <Text c="gray" className="text-center text-balance" size="lg">
                コミュニティノートが見つかりませんでした
              </Text>
            </Card>
          )}
        </Stack>
      </div>
      <Space h="5rem" />
    </Container>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
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
