import { Container, Grid, Stack } from "@mantine/core";

import { AboutSection } from "~/components/about-section";
import { AccountRankingSection } from "~/components/account-ranking";
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
  getDefaultNotesAnnualRange,
  getDefaultRelativePeriod,
  safeGraphFetch,
} from "~/components/graph/graphFetchers";
import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";
import { ReportCardSection } from "~/components/report-card-section/ReportCardSection";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/_index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = async (_args: Route.LoaderArgs) => {
  const status: StatusValue = "all";
  const defaultRelativePeriod = getDefaultRelativePeriod();
  const defaultNotesAnnualRange = getDefaultNotesAnnualRange();

  // キャッシュキー構築
  const notesAnnualKey = buildGraphCacheKey("notes-annual", {
    range: defaultNotesAnnualRange,
    status,
  });
  const notesEvaluationKey = buildGraphCacheKey("notes-evaluation", {
    period: defaultRelativePeriod,
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
            range: defaultNotesAnnualRange,
            status,
          });
          if (result.ok) graphCache.set(notesAnnualKey, result);
          return result;
        }),
    notesEvaluationCached
      ? Promise.resolve(notesEvaluationCached)
      : safeGraphFetch(async () => {
          const result = await fetchNotesEvaluationGraph({
            period: defaultRelativePeriod,
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
            message: "通信エラーが発生しました。時間をおいて再試行してください。",
          },
        } as GraphFetchResult<MonthlyNoteData[]>);
  const notesEvaluation =
    settled[1].status === "fulfilled"
      ? settled[1].value
      : ({
          ok: false,
          error: {
            kind: "network",
            message: "通信エラーが発生しました。時間をおいて再試行してください。",
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
      <Container className="py-8" size="xl">
        <Stack gap="xl">
          <AboutSection />
          <FeatureSection />
          <ReportCardSection maxItems={4} />
          <NotesAnnualChartSection initialResult={loaderData.graphs.notesAnnual} />
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

          <iframe
            height="2330px"
            sandbox="allow-scripts allow-popups allow-forms"
            src="/kouchou-ai/52c5c1bc-fb89-4aa9-ab67-b35e2f663cf2/index.html"
            title="広聴AI"
            width="100%"
          />
        </Stack>
      </Container>
    </main>
  );
}
