/* eslint-disable react-refresh/only-export-components */
import { Container, Grid } from "@mantine/core";

import { AccountRankingSection } from "~/components/account-ranking";
import { BaseCard } from "~/components/BaseCard/BaseCard";
import { DailyNotesCreationChart } from "~/components/daily-notes-creation-chart";
import { DailyPostCountChart } from "~/components/daily-post-count-chart";
import { ReportSummaryCard } from "~/components/feature/report-summary-card";
import { FeatureIcon, PlayButtonIcon } from "~/components/icons";
import { NotesEvaluationStatusChart } from "~/components/notes-evaluation-status-chart";
import { PostInfluenceChart } from "~/components/post-influence-chart";
import { SectionTitle } from "~/components/SectionTitle";
import { FEATURES } from "~/constants/data";
import { WEB_PATHS } from "~/constants/paths";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.feature.$id";

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.feature) {
    return [{ title: "特集が見つかりません - BirdXplorer" }];
  }
  return [
    { title: `${data.feature.detail.title} - BirdXplorer` },
    {
      name: "description",
      content: `${data.feature.detail.title}の特集ページ`,
    },
    {
      name: "robots",
      content: "noindex, nofollow",
    },
  ];
};

export const handle: LayoutHandle = {
  breadcrumb: [
    { label: "TOP", href: WEB_PATHS.home },
    { label: "Feature", href: WEB_PATHS.feature.index },
  ],
  pageTitle: {
    icon: <FeatureIcon isActive />,
    title: "Feature",
    subtitle: "特集",
  },
};

type FeatureItem = {
  title: string;
  href: string;
};

type FeatureCategory = {
  id: number;
  category: string;
  color: string;
  detail: FeatureItem;
};

const REPORT_SUMMARY_CARD_DESCRIPTION =
  "奈良市の持続可能な発展を目指す意見が多岐にわたって集まっています。都市開発や交通インフラの革新、地域活性化、教育と地域社会の連携、観光振興、地域資源の活用、市民参加とAI活用による市政改革、高齢化社会への対応、防災力強化、環境保全、医療・教育の連携強化などが提案されています。これらの施策は、住民の生活の質向上と地域の持続可能な発展を目指。奈良市の持続可能な発展を目指す意見が多岐にわたって集まっています。都市開発や交通インフラの革新、地域活性化、教育と地域社会の連携、観光振興、地域資源の活用、市民参加とAI活用による市政改革、高齢化社会への対応、防災力強化、環境保全、医療・教育の連携強化などが提案されています。これらの施策は、住民の生活の質向上と地域の持続可能な発展を目指奈良市の持続可能な発展を目指す意見が多岐にわたって集まっています。都市開発や交通インフラの革新、地域活性化、教育と地域社会の連携、観光振興、地域資源の活用、市民参加とAI活用による市政改革、高齢化社会への対応、防災力強化、環境保全、医療・教育の連携強化などが提案されています。これらの施策は、住民の生活の質向上と地域の持続可能な発展を目指。奈良市の持続可能な発展を目指す意見。";

// 特集データ（実際の実装では、APIから取得するか、共有のデータファイルから取得）
const getAllFeatures = (): FeatureCategory[] => {
  return FEATURES;
};

export const loader = ({ params }: Route.LoaderArgs) => {
  const id = params.id;

  if (!id) {
    return {
      feature: null,
    };
  }

  const features = getAllFeatures();
  const feature = features.find((f) => f.detail.href === `/feature/${id}`);

  return {
    feature: feature ?? null,
  };
};

export default function FeatureDetail({ loaderData }: Route.ComponentProps) {
  const { feature } = loaderData;

  if (!feature) {
    return (
      <Container className="py-8" size="xl">
        <div className="text-center text-white">
          <h1 className="text-heading-xl mb-4">404</h1>
          <p className="text-body-l">特集が見つかりませんでした</p>
        </div>
      </Container>
    );
  }

  return (
    <Container px="0" size="xl">
      <h2 className="text-heading-xl-sp md:text-heading-xl mb-4 text-white">
        2025年 参議院選挙関連 コミュニティノート
      </h2>
      {/* ReportSummaryCardとグラフを2列に配置 */}
      <Grid align="stretch" gutter="xl" py="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ReportSummaryCard
            className="h-full"
            description={REPORT_SUMMARY_CARD_DESCRIPTION}
            href={`${WEB_PATHS.feature.index}/${feature.id}/report`}
            title="レポート"
            updatedAt="2025年1月15日更新"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AccountRankingSection />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DailyPostCountChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DailyNotesCreationChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PostInfluenceChart />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NotesEvaluationStatusChart />
        </Grid.Col>
      </Grid>

      {/* 他の特集へのリンクなど */}
      <section className="py-4">
        <div className="flex items-center justify-between gap-4">
          <SectionTitle title="その他の特集" />
          <a
            className="inline-flex items-center gap-2 text-primary hover:underline"
            href={WEB_PATHS.feature.index}
          >
            <span>View All</span>
          </a>
        </div>
        <div className="grid grid-cols-1 gap-8 py-4 md:grid-cols-2 md:py-6 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <BaseCard
              body={
                <ul className="space-y-2">
                  <li>
                    <a
                      className="text-heading-m-compact flex items-start gap-2 text-white hover:underline"
                      href={feature.detail.href}
                    >
                      <PlayButtonIcon className="shrink-0" isActive />
                      <span>{feature.detail.title}</span>
                    </a>
                  </li>
                </ul>
              }
              key={feature.id}
              title={<span className="text-white">{feature.category}</span>}
              titleBgColor={feature.color}
            />
          ))}
        </div>
      </section>
    </Container>
  );
}
