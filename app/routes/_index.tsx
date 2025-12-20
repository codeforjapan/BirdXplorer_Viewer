import { Container, Grid, Stack } from "@mantine/core";

import { AboutSection } from "~/components/about-section";
import { AccountRankingSection } from "~/components/account-ranking";
import { FeatureSection } from "~/components/feature-section";
import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";
import { ReportCardSection } from "~/components/report-card-section/ReportCardSection";

import type { Route } from "./+types/_index";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader = (_args: Route.LoaderArgs) => {
  return {};
};

export default function Index({}: Route.ComponentProps) {
  return (
    <main>
      <Container className="py-8" size="xl">
        <Stack gap="xl">
          <AboutSection />
          <FeatureSection />
          <ReportCardSection />
          <NotesAnnualChartSection />
          <Grid align="stretch" gutter="xl">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <NotesEvaluationChartSection className="h-full" />
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
