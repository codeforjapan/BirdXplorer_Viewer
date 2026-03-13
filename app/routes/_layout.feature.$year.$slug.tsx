/* eslint-disable react-refresh/only-export-components */
import { Box, Container, Grid } from "@mantine/core";
import type { ShouldRevalidateFunction } from "react-router";

import { AccountRankingSection } from "~/components/account-ranking";
import { AutoResizeIframe } from "~/components/auto-resize-iframe/AutoResizeIframe";
import { BaseCard } from "~/components/BaseCard/BaseCard";
import { DailyNotesCreationChart } from "~/components/daily-notes-creation-chart";
import { DailyPostCountChart } from "~/components/daily-post-count-chart";
import { ReportSummaryCard } from "~/components/feature/report-summary-card";
import type {
  GraphFetchResult,
  GraphFetchResultWithMarkers,
} from "~/components/graph";
import type {
  DailyNotesCreationDataItem,
  DailyPostCountDataItem,
  NoteEvaluationData,
  PostInfluenceData,
  StatusValue,
} from "~/components/graph";
import {
  DEFAULT_GRAPH_LIMIT,
  fetchDailyNotesGraph,
  fetchDailyPostsGraph,
  fetchNotesEvaluationStatusGraph,
  fetchPostInfluenceGraph,
  safeGraphFetch,
  safeGraphFetchWithMarkers,
} from "~/components/graph/graphFetchers";
import { FeatureIcon, PlayButtonIcon } from "~/components/icons";
import { NotesEvaluationStatusChart } from "~/components/notes-evaluation-status-chart";
import { PostInfluenceChart } from "~/components/post-influence-chart";
import { SectionTitle } from "~/components/SectionTitle";
import { FEATURES } from "~/data/features";
import type { Feature } from "~/data/features";
import { WEB_PATHS } from "~/constants/paths";
import {
  relativePeriodToTimestamps,
  timestampsToDateRange,
} from "~/utils/dateRange";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { LayoutHandle } from "./_layout";
import type { Route } from "./+types/_layout.feature.$year.$slug";
import { DEFAULT_KOUCHOU_AI_PATH } from "~/data/reports";

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

// 特集データ（実際の実装では、APIから取得するか、共有のデータファイルから取得）
const getAllFeatures = (): Feature[] => {
  return FEATURES;
};

type GraphLoaderData = {
  dailyNotes: GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>;
  dailyPosts: GraphFetchResultWithMarkers<DailyPostCountDataItem[]>;
  notesEvaluationStatus: GraphFetchResult<NoteEvaluationData[]>;
  postInfluence: GraphFetchResult<PostInfluenceData[]>;
};

const createFallbackError = <T,>(): GraphFetchResultWithMarkers<T> => ({
  ok: false,
  error: {
    kind: "network",
    message: "通信エラーが発生しました。時間をおいて再試行してください。",
  },
});

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { year, slug } = params;

  if (!year || !slug) {
    return {
      feature: null,
      graphs: null,
      graphTimestamps: relativePeriodToTimestamps("6months"),
    };
  }

  const features = getAllFeatures();
  const feature = features.find(
    (f) => f.detail.href === `/feature/${year}/${slug}`,
  );

  const status: StatusValue = "all";
  const language = feature?.language;
  const keywords = feature?.keywords;

  const defaultTimestamps = relativePeriodToTimestamps("6months");
  const graphTimestamps =
    feature?.startDate && feature?.endDate
      ? {
          start_date: new Date(feature.startDate).getTime(),
          end_date: new Date(feature.endDate).getTime(),
        }
      : defaultTimestamps;

  const { start_date, end_date } = graphTimestamps;

  const dailyNotesKey = buildGraphCacheKey("daily-notes", {
    start_date,
    end_date,
    status,
    language,
    keywords,
  });
  const dailyPostsKey = buildGraphCacheKey("daily-posts", {
    start_date,
    end_date,
    status,
    language,
    keywords,
  });
  const notesEvaluationStatusKey = buildGraphCacheKey(
    "notes-evaluation-status",
    {
      start_date,
      end_date,
      status,
      limit: DEFAULT_GRAPH_LIMIT,
      language,
      keywords,
    },
  );
  const postInfluenceKey = buildGraphCacheKey("post-influence", {
    start_date,
    end_date,
    status,
    limit: DEFAULT_GRAPH_LIMIT,
    language,
    keywords,
  });

  const dailyNotesCached = graphCache.get(dailyNotesKey) as
    | GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>
    | undefined;
  const dailyPostsCached = graphCache.get(dailyPostsKey) as
    | GraphFetchResultWithMarkers<DailyPostCountDataItem[]>
    | undefined;
  const notesEvaluationStatusCached = graphCache.get(
    notesEvaluationStatusKey,
  ) as GraphFetchResult<NoteEvaluationData[]> | undefined;
  const postInfluenceCached = graphCache.get(postInfluenceKey) as
    | GraphFetchResult<PostInfluenceData[]>
    | undefined;

  const settled = await Promise.allSettled([
    dailyNotesCached
      ? Promise.resolve(dailyNotesCached)
      : safeGraphFetchWithMarkers(async () => {
          const result = await fetchDailyNotesGraph({
            start_date,
            end_date,
            status,
            language,
            keywords,
          });
          if (result.ok) graphCache.set(dailyNotesKey, result);
          return result;
        }),
    dailyPostsCached
      ? Promise.resolve(dailyPostsCached)
      : safeGraphFetchWithMarkers(async () => {
          const result = await fetchDailyPostsGraph({
            start_date,
            end_date,
            status,
            language,
            keywords,
          });
          if (result.ok) graphCache.set(dailyPostsKey, result);
          return result;
        }),
    notesEvaluationStatusCached
      ? Promise.resolve(notesEvaluationStatusCached)
      : safeGraphFetch(async () => {
          const result = await fetchNotesEvaluationStatusGraph({
            start_date,
            end_date,
            status,
            limit: DEFAULT_GRAPH_LIMIT,
            language,
            keywords,
          });
          if (result.ok) graphCache.set(notesEvaluationStatusKey, result);
          return result;
        }),
    postInfluenceCached
      ? Promise.resolve(postInfluenceCached)
      : safeGraphFetch(async () => {
          const result = await fetchPostInfluenceGraph({
            start_date,
            end_date,
            status,
            limit: DEFAULT_GRAPH_LIMIT,
            language,
            keywords,
          });
          if (result.ok) graphCache.set(postInfluenceKey, result);
          return result;
        }),
  ]);

  const graphs: GraphLoaderData = {
    dailyNotes:
      settled[0].status === "fulfilled"
        ? settled[0].value
        : createFallbackError(),
    dailyPosts:
      settled[1].status === "fulfilled"
        ? settled[1].value
        : createFallbackError(),
    notesEvaluationStatus:
      settled[2].status === "fulfilled"
        ? settled[2].value
        : createFallbackError(),
    postInfluence:
      settled[3].status === "fulfilled"
        ? settled[3].value
        : createFallbackError(),
  };

  return {
    feature: feature ?? null,
    graphs,
    graphTimestamps,
  };
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  currentUrl,
  nextUrl,
}) => {
  if (
    currentParams.year !== nextParams.year ||
    currentParams.slug !== nextParams.slug
  )
    return true;

  const graphKeys = ["period", "status", "range", "limit"];
  const hasGraphChange = graphKeys.some(
    (key) => currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key),
  );
  return hasGraphChange;
};

export default function FeatureDetail({ loaderData }: Route.ComponentProps) {
  const { feature, graphs, graphTimestamps } = loaderData;
  const initialDateRange = timestampsToDateRange(graphTimestamps);

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
        {feature.detail.title}
      </h2>
      {/* ReportSummaryCardとグラフを2列に配置 */}
      <Grid align="stretch" gutter={{ base: "md", md: "xl" }} py="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <ReportSummaryCard
            className="h-full"
            description={feature.detail.description ?? ""}
            href={`${WEB_PATHS.feature.index}/${feature.id}/report`}
            title="レポート"
            updatedAt="2025年1月15日更新"
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <AccountRankingSection fixedTimestamps={graphTimestamps} />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DailyPostCountChart
            initialDateRange={initialDateRange}
            initialResult={graphs?.dailyPosts}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DailyNotesCreationChart
            initialDateRange={initialDateRange}
            initialResult={graphs?.dailyNotes}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <PostInfluenceChart
            initialDateRange={initialDateRange}
            initialResult={graphs?.postInfluence}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <NotesEvaluationStatusChart
            initialDateRange={initialDateRange}
            initialResult={graphs?.notesEvaluationStatus}
          />
        </Grid.Col>
      </Grid>

      {feature.kouchouAiPath && (
        <Box my="xl">
          <AutoResizeIframe
            sandbox="allow-scripts allow-popups allow-forms allow-same-origin"
            src={String(feature.kouchouAiPath)}
            title="広聴AI"
          />
        </Box>
      )}

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
