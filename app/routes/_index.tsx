import { Container, Grid, Stack } from "@mantine/core";

import { AboutSection } from "~/components/about-section";
import { AccountRankingSection } from "~/components/account-ranking";
import { AutoResizeIframe } from "~/components/auto-resize-iframe/AutoResizeIframe";
import { FeatureSection } from "~/components/feature-section";
import { FeatureIcon } from "~/components/icons";
import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";
import { PageTitle } from "~/components/PageTitle";
import { ReportCardSection } from "~/components/report-card-section/ReportCardSection";

import type { Route } from "./+types/_index";

// グラフデータはクライアントサイドで useFetcher 経由で取得する。
// loader でブロッキング API 呼び出しを行うと画面遷移が止まるため削除。
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/require-await
export const loader = async (_args: Route.LoaderArgs) => {
  return {
    graphs: {
      notesAnnual: undefined,
      notesEvaluation: undefined,
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
