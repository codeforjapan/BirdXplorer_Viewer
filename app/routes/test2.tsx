import { Stack, Title } from "@mantine/core";

import { DailyPostCountChart } from "~/components/daily-post-count-chart";
import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";

export default function Test2() {
  return (
    <Stack gap="xl" p="md">
      <Title order={2}>GraphWrapper デモ</Title>

      {/* DailyPostCountChart デモ */}
      <DailyPostCountChart />

      {/* NotesAnnualChartSection デモ */}
      <NotesAnnualChartSection />

      {/* NotesEvaluationChartSection デモ */}
      <NotesEvaluationChartSection />
    </Stack>
  );
}
