import { Stack, Title } from "@mantine/core";

import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";

export default function Test2() {
  return (
    <Stack gap="xl" p="md">
      <Title order={2}>GraphWrapper デモ</Title>

      {/* NotesAnnualChartSection デモ */}
      <NotesAnnualChartSection />

      {/* NotesEvaluationChartSection デモ */}
      <NotesEvaluationChartSection />
    </Stack>
  );
}
