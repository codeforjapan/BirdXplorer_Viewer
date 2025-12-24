import { Stack, Title } from "@mantine/core";

import { AccountRankingSection } from "~/components/account-ranking";
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

      <AccountRankingSection />
      <PostInfluenceChart />
      <NotesEvaluationStatusChart />
      <DailyNotesCreationChart />
      <DailyPostCountChart />
      <NotesAnnualChartSection />
      <NotesEvaluationChartSection />
      
      {/* 広聴AI埋め込みテスト */}
      <iframe 
        height="2330px"
        sandbox="allow-scripts allow-popups allow-forms"
        src="/kouchou-ai/52c5c1bc-fb89-4aa9-ab67-b35e2f663cf2/index.html"
        title="広聴AI"
        width="100%"
      />
    </Stack>
  );
}
