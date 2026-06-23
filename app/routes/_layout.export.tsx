/* eslint-disable react-refresh/only-export-components */
import type { SubmissionResult } from "@conform-to/react";
import {
  getFormProps,
  getInputProps,
  useForm,
  useInputControl,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import {
  Button,
  Card,
  Container,
  Divider,
  Group,
  SegmentedControl,
  Stack,
  Text,
} from "@mantine/core";
import { hash } from "ohash";
import { useMemo, useState } from "react";
import { data, Form, redirect, useNavigation } from "react-router";
import { getQuery, withQuery } from "ufo";
import type { z } from "zod";

import { FormError } from "~/components/FormError";
import { DateRangePicker } from "~/components/input/DateRangePicker";
import { TextInput } from "~/components/mantine/TextInput";
import { Notes } from "~/components/note/Notes";
import { SubmitButton } from "~/components/SubmitButton";
import { WEB_PATHS } from "~/constants/paths";
import { checkBasicAuth } from "~/feature/export/auth";
import type { CsvExportParams } from "~/feature/export/validation";
import type { csvExportBaseSchema } from "~/feature/export/validation";
import {
  csvExportParamSchema,
  parseKeywords,
} from "~/feature/export/validation";
import { searchApiV1DataSearchGet } from "~/generated/api/client";
import type { SearchedNote } from "~/generated/api/schemas";
import { containsNonNullValues } from "~/utils/array";
import { dateStrFromUnixMs } from "~/utils/date";
import Fa6SolidFileArrowDown from "~icons/fa6-solid/file-arrow-down";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.export";

export const meta: Route.MetaFunction = () => [
  { title: "エクスポート - BirdXplorer" },
  { name: "robots", content: "noindex, nofollow" },
];

export const handle: LayoutHandle = {
  breadcrumb: [{ label: "TOP", href: WEB_PATHS.home }, { label: "Export" }],
  pageTitle: {
    icon: <Fa6SolidFileArrowDown className="size-full text-white" />,
    title: "Export",
    subtitle: "CSVエクスポート",
  },
};

export function headers({ errorHeaders }: Route.HeadersArgs) {
  const wwwAuth = errorHeaders?.get("WWW-Authenticate");
  if (wwwAuth) return { "WWW-Authenticate": wwwAuth };
  return {};
}

export const loader = async (args: Route.LoaderArgs) => {
  const authError = checkBasicAuth(args.request);
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  if (authError) throw authError;

  const rawSearchParams = getQuery(args.request.url);

  if (!rawSearchParams.keywords) {
    return { data: { exportQuery: null, previewNotes: [] }, error: null };
  }

  const exportQuery =
    await csvExportParamSchema.safeParseAsync(rawSearchParams);
  if (!exportQuery.success) {
    return data(
      {
        data: { exportQuery: null, previewNotes: [] },
        error: exportQuery.error.errors,
      },
      { status: 400 },
    );
  }

  const keywords = parseKeywords(exportQuery.data.keywords);
  const searchMode = exportQuery.data.search_mode ?? "or";
  const previewResult = await searchApiV1DataSearchGet({
    note_includes_text: keywords,
    note_search_mode: searchMode,
    note_created_at_from: exportQuery.data.note_created_at_from,
    note_created_at_to: exportQuery.data.note_created_at_to,
    limit: 25,
  }).catch(() => null);

  const previewNotes: SearchedNote[] =
    previewResult?.data && "data" in previewResult.data
      ? previewResult.data.data.slice(0, 25)
      : [];

  return {
    data: {
      exportQuery: exportQuery.data,
      previewNotes,
    },
    error: null,
  };
};

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: csvExportParamSchema });
  if (submission.status !== "success") return submission.reply();
  return redirect(withQuery("/export", submission.value));
};

type ExportFormProps = {
  defaultValue?: Partial<CsvExportParams>;
  lastResult?: SubmissionResult<string[]> | null;
};

function ExportForm({ defaultValue, lastResult }: ExportFormProps) {
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const formId = useMemo(() => hash(defaultValue ?? {}), [defaultValue]);

  const [form, fields] = useForm<z.infer<typeof csvExportBaseSchema>>({
    id: formId,
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: csvExportParamSchema });
    },
    defaultValue,
  });

  const searchModeControl = useInputControl(fields.search_mode);

  return (
    <Form method="POST" preventScrollReset {...getFormProps(form)}>
      <Stack>
        <TextInput
          autoComplete="off"
          c="white"
          classNames={{ input: "!bg-gray-1 !border-gray-5" }}
          description="カンマ区切りで複数キーワードを入力（例: 医療,政治）最大50個"
          disabled={isLoading}
          error={
            containsNonNullValues(fields.keywords.errors) && (
              <FormError errors={[fields.keywords.errors]} />
            )
          }
          label="キーワード（必須）"
          placeholder="例: 医療,政治,AI"
          styles={{ input: { color: "white" }, label: { marginBottom: "8px" } }}
          {...getInputProps(fields.keywords, { type: "text" })}
        />
        <div>
          <Text c="white" size="sm" style={{ marginBottom: "8px" }}>
            キーワードの結合方法
          </Text>
          {/* hidden input is required for form submission; useInputControl only manages Conform state */}
          <input
            name={fields.search_mode.name}
            type="hidden"
            value={searchModeControl.value ?? "or"}
          />
          <SegmentedControl
            data={[
              { label: "OR（いずれかを含む）", value: "or" },
              { label: "AND（すべてを含む）", value: "and" },
            ]}
            disabled={isLoading}
            onBlur={searchModeControl.blur}
            onChange={searchModeControl.change}
            onFocus={searchModeControl.focus}
            styles={{ root: { backgroundColor: "var(--color-gray-2)" } }}
            value={searchModeControl.value ?? "or"}
          />
        </div>
        <DateRangePicker
          convertFormValueToMantine={dateStrFromUnixMs}
          convertMantineValueToForm={(date) => date ? String(new Date(date).valueOf()) : undefined}
          disabled={isLoading}
          fromField={fields.note_created_at_from}
          label="ノート作成期間（必須・最大30日間）"
          toField={fields.note_created_at_to}
          valueFormat="YYYY.MM.DD (ddd)"
        />
        <div className="pt-4 md:pt-5" />
        <SubmitButton
          c="white"
          disabled={!form.valid || isLoading}
          loading={isLoading}
          styles={{
            root: {
              backgroundColor: "var(--color-primary)",
              borderRadius: "9999px",
            },
          }}
        >
          プレビューを表示
        </SubmitButton>
      </Stack>
    </Form>
  );
}

export default function Export({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { exportQuery, previewNotes } = loaderData.data as {
    exportQuery: CsvExportParams | null;
    previewNotes: SearchedNote[];
  };
  const [isDownloading, setIsDownloading] = useState(false);

  const csvUrl =
    exportQuery?.note_created_at_from != null &&
    exportQuery.note_created_at_to != null
      ? `/export/csv?${new URLSearchParams({
          keywords: exportQuery.keywords,
          note_created_at_from: String(exportQuery.note_created_at_from),
          note_created_at_to: String(exportQuery.note_created_at_to),
          ...(exportQuery.search_mode
            ? { search_mode: exportQuery.search_mode }
            : {}),
        }).toString()}`
      : null;

  const handleExport = async () => {
    if (!csvUrl || isDownloading) return;
    setIsDownloading(true);
    try {
      const res = await fetch(csvUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      const disposition = res.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(disposition);
      a.download = match?.[1] ?? "community_notes.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main>
      <Container className="!px-0" size="xl">
        <div className="grid grid-cols-1 gap-4 border-t border-gray-5 pt-5 md:grid-cols-3 md:items-start md:gap-8">
          <div className="md:col-span-1">
            <ExportForm
              defaultValue={exportQuery ?? undefined}
              lastResult={actionData}
            />
          </div>
          <Divider className="md:hidden" />
          <div className="size-full p-4 md:col-span-2">
            {exportQuery ? (
              <Stack>
                <Group align="center" justify="space-between">
                  <Text c="dimmed" size="sm">
                    プレビュー（
                    {exportQuery.search_mode === "and" ? "AND検索" : "OR検索"}
                    ・最大25件）
                  </Text>
                  <Button
                    disabled={!csvUrl || isDownloading}
                    loading={isDownloading}
                    onClick={() => void handleExport()}
                    styles={{
                      root: { backgroundColor: "var(--color-primary)" },
                    }}
                  >
                    Export CSV
                  </Button>
                </Group>
                {previewNotes.length > 0 ? (
                  <Group gap="lg">
                    <Notes notes={previewNotes} />
                  </Group>
                ) : (
                  <Card
                    bg="var(--color-twitter-dark-1)"
                    className="grid size-full place-content-center"
                    padding="lg"
                    radius="md"
                    w="100%"
                    withBorder
                  >
                    <Text
                      c="white"
                      className="text-center text-lg font-semibold text-balance"
                    >
                      検索結果がありません
                    </Text>
                  </Card>
                )}
              </Stack>
            ) : (
              <Card
                bg="var(--color-twitter-dark-1)"
                className="grid size-full place-content-center"
                padding="lg"
                radius="md"
                w="100%"
                withBorder
              >
                <Text
                  c="white"
                  className="text-center text-lg font-semibold text-balance"
                >
                  キーワードと期間を入力して
                  <br />
                  プレビューを表示してください
                </Text>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
