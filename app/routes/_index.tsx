import { parseWithZod } from "@conform-to/zod";
import { Container, Group, Stack, Title } from "@mantine/core";
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { data, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { getQuery, withQuery } from "ufo";

import { Notes } from "../components/note/Notes";
import { SearchForm } from "../feature/search/components/SearchForm";
import { noteSearchParamSchema } from "../feature/search/validation";
import {
  getTopicsApiV1DataTopicsGet,
  searchApiV1DataSearchGet,
} from "../generated/api/client";
import type { SearchApiV1DataSearchGetParams } from "../generated/api/schemas";
import { searchApiV1DataSearchGetQueryParams } from "../generated/api/zod/schema";

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
  const searchQuery = await noteSearchParamSchema.safeParseAsync(
    rawSearchParams
  );

  if (!searchQuery.success) {
    return data(
      {
        data: {
          searchQuery: null,
          notes: {
            data: [],
            meta: {},
          },
          topics: [],
        },
        error: searchQuery.error.errors,
      },
      {
        status: 400,
        statusText: "Bad Request",
      }
    );
  }

  const query = {
    ...searchQuery.data,
    post_includes_text: searchQuery.data.post_includes_text ?? "biden",
  } satisfies SearchApiV1DataSearchGetParams;

  const [topics, response] = await Promise.all([
    getTopicsApiV1DataTopicsGet(),
    searchApiV1DataSearchGet(query),
  ]);

  return {
    data: {
      searchQuery: searchQuery.data,
      notes: response.data,
      topics: topics.data.data,
    },
    error: null,
  };
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  const lastResult = useActionData<typeof action>();

  const { topics, searchQuery, notes } = data;

  return (
    <Container size="sm">
      <Title>BirdXPlorer Viewer</Title>
      <Stack gap="xl">
        <SearchForm
          defaultValue={searchQuery ?? undefined}
          lastResult={lastResult}
          topics={topics}
        />
        <Group gap="lg">
          <Notes notes={notes.data} />
        </Group>
      </Stack>
    </Container>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema: searchApiV1DataSearchGetQueryParams,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const destination = withQuery("/", submission.value);

  return redirect(destination);
};
