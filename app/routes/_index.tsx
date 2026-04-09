import { Container, Grid, Stack } from "@mantine/core";

import { AboutSection } from "~/components/about-section";
import { AccountRankingSection } from "~/components/account-ranking";
import { AutoResizeIframe } from "~/components/auto-resize-iframe/AutoResizeIframe";
import { FeatureSection } from "~/components/feature-section";
import type { GraphFetchResult } from "~/components/graph";
import type {
  MonthlyNoteData,
  NoteEvaluationData,
  StatusValue,
} from "~/components/graph";
import {
  DEFAULT_GRAPH_LIMIT,
  fetchNotesAnnualGraph,
  fetchNotesEvaluationGraph,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { FeatureIcon } from "~/components/icons";
import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";
import { PageTitle } from "~/components/PageTitle";
import { ReportCardSection } from "~/components/report-card-section/ReportCardSection";
import {
  getDefault12MonthRange,
  getDefault14DayRange,
} from "~/utils/dateRange";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/_index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = async (_args: Route.LoaderArgs) => {
  const status: StatusValue = "all";

  // デフォルトの日付範囲を設定
  const defaultNotesAnnualTimestamps = getDefault12MonthRange();
  const defaultEvaluationTimestamps = getDefault14DayRange();

  // キャッシュキー構築
  const notesAnnualKey = buildGraphCacheKey("notes-annual", {
    start_date: defaultNotesAnnualTimestamps.start_date,
    end_date: defaultNotesAnnualTimestamps.end_date,
    status,
  });
  const notesEvaluationKey = buildGraphCacheKey("notes-evaluation", {
    start_date: defaultEvaluationTimestamps.start_date,
    end_date: defaultEvaluationTimestamps.end_date,
    status,
    limit: DEFAULT_GRAPH_LIMIT,
  });

  // キャッシュ確認
  const notesAnnualCached = graphCache.get(notesAnnualKey) as
    | GraphFetchResult<MonthlyNoteData[]>
    | undefined;
  const notesEvaluationCached = graphCache.get(notesEvaluationKey) as
    | GraphFetchResult<NoteEvaluationData[]>
    | undefined;

  const settled = await Promise.allSettled([
    notesAnnualCached
      ? Promise.resolve(notesAnnualCached)
      : safeGraphFetch(async () => {
          const result = await fetchNotesAnnualGraph({
            start_date: defaultNotesAnnualTimestamps.start_date,
            end_date: defaultNotesAnnualTimestamps.end_date,
            status,
          });
          if (result.ok) graphCache.set(notesAnnualKey, result);
          return result;
        }),
    notesEvaluationCached
      ? Promise.resolve(notesEvaluationCached)
      : safeGraphFetch(async () => {
          const result = await fetchNotesEvaluationGraph({
            start_date: defaultEvaluationTimestamps.start_date,
            end_date: defaultEvaluationTimestamps.end_date,
            status,
            limit: DEFAULT_GRAPH_LIMIT,
          });
          if (result.ok) graphCache.set(notesEvaluationKey, result);
          return result;
        }),
  ]);

  const notesAnnual =
    settled[0].status === "fulfilled"
      ? settled[0].value
      : ({
          ok: false,
          error: {
            kind: "network",
            message:
              "通信エラーが発生しました。時間をおいて再試行してください。",
          },
        } as GraphFetchResult<MonthlyNoteData[]>);
  const notesEvaluation =
    settled[1].status === "fulfilled"
      ? settled[1].value
      : ({
          ok: false,
          error: {
            kind: "network",
            message:
              "通信エラーが発生しました。時間をおいて再試行してください。",
          },
        } as GraphFetchResult<NoteEvaluationData[]>);

  return {
    graphs: {
      notesAnnual,
      notesEvaluation,
    },
  };
};

export default function Index({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <Container className="py-4 md:py-8" size="xl">
        <Stack gap="xl">
          <AboutSection />
          <FeatureSection />
          <ReportCardSection maxItems={4} />
          <NotesAnnualChartSection
            initialResult={loaderData.graphs.notesAnnual}
          />
          <Grid align="stretch" gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NotesEvaluationChartSection
                className="h-full"
                initialResult={loaderData.graphs.notesEvaluation}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <AccountRankingSection className="h-full" />
            </Grid.Col>
          </Grid>

          <PageTitle
            icon={<FeatureIcon isActive />}
            subtitle="広聴AIによる可視化"
            title="Overview"
          />
          <AutoResizeIframe
            sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
            src="/kouchou-ai/2026/03/c94584cc-aa7c-472c-95ee-17f4fe5e6493/index.html"
            title="広聴AI"
          />
        </Stack>
      </Container>
    </main>
  );
}
