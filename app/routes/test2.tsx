import { Stack, Title } from "@mantine/core";

import { DailyNotesCreationChart } from "~/components/daily-notes-creation-chart";
import { DailyPostCountChart } from "~/components/daily-post-count-chart";
import { NotesAnnualChartSection } from "~/components/notes-annual-chart";
import { NotesEvaluationChartSection } from "~/components/notes-evaluation-chart";
import { NotesEvaluationStatusChart } from "~/components/notes-evaluation-status-chart";
import { PostInfluenceChart } from "~/components/post-influence-chart";

export default function Test2() {
  return (
    <Stack gap="xl" p="md">
      <Title order={2}>GraphWrapper デモ</Title>

      <PostInfluenceChart />
      <NotesEvaluationStatusChart />
      <DailyNotesCreationChart />
      <DailyPostCountChart />
      <NotesAnnualChartSection />
      <NotesEvaluationChartSection />
    </Stack>
  );
}
