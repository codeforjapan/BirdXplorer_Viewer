import { Group, Text, UnstyledButton } from "@mantine/core";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";

import type { DateRange } from "~/components/date-range-selector";
import type { MonthlyNoteData } from "~/components/graph";
import {
  GraphContainer,
  type GraphFetchResult,
  GraphState,
  type GraphStateStatus,
  GraphWrapper,
  StackedBarLineChart,
  STATUS_COLORS,
} from "~/components/graph";
import {
  dateRangeToTimestamps,
  getDefault12MonthRange,
} from "~/utils/dateRange";

/** 公開率の色（オレンジ） */
const PUBLICATION_RATE_COLOR = "#ffa726";

/** 凡例アイテムのProps */
type LegendItemProps = {
  color: string;
  label: string;
  isVisible: boolean;
  onClick: () => void;
  isLine?: boolean;
};

/** 凡例アイテムコンポーネント */
const LegendItem = ({
  color,
  label,
  isVisible,
  onClick,
  isLine = false,
}: LegendItemProps) => (
  <UnstyledButton
    className="transition-opacity"
    onClick={onClick}
    style={{ opacity: isVisible ? 1 : 0.4 }}
  >
    <Group align="center" gap={6}>
      {isLine ? (
        <div className="h-0.5 w-4" style={{ backgroundColor: color }} />
      ) : (
        <div className="size-3" style={{ backgroundColor: color }} />
      )}
      <Text c="white" size="sm">
        {label}
      </Text>
    </Group>
  </UnstyledButton>
);

/** シリーズの表示状態 */
type SeriesVisibility = {
  published: boolean;
  evaluating: boolean;
  unpublished: boolean;
  temporarilyPublished: boolean;
  publicationRate: boolean;
};

type NotesAnnualChartSectionProps = {
  /** ヘルプテキスト（ツールチップで表示） */
  helpText?: string;
  initialResult?: GraphFetchResult<MonthlyNoteData[]>;
};

export const NotesAnnualChartSection = ({
  helpText = "このグラフは、過去1年間のコミュニティノートの数と公開率を月ごとに表示しています。",
  initialResult,
}: NotesAnnualChartSectionProps) => {
  // デフォルトの日付範囲を設定（今月を含む過去12ヶ月）
  const defaultTimestamps = useMemo(() => getDefault12MonthRange(), []);
  const [dateRange, setDateRange] = useState<DateRange>([
    new Date(defaultTimestamps.start_date),
    new Date(defaultTimestamps.end_date),
  ]);
  const fetcher = useFetcher<GraphFetchResult<MonthlyNoteData[]>>();
  const revalidator = useRevalidator();
  const hasFetcherLoaded = useRef(false);
  const hasMounted = useRef(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const currentResult = fetcher.data ?? initialResult;

  useEffect(() => {
    const timestamps = dateRangeToTimestamps(dateRange);
    if (!timestamps) return;

    const nextUrl = `/resources/graphs/notes-annual?start_date=${timestamps.start_date}&end_date=${timestamps.end_date}&status=all`;

    if (!hasMounted.current) {
      hasMounted.current = true;
      setLastUrl(nextUrl);
      if (!initialResult) {
        hasFetcherLoaded.current = true;
        void fetcher.load(nextUrl);
      }
      return;
    }

    if (nextUrl === lastUrl) return;
    setLastUrl(nextUrl);
    hasFetcherLoaded.current = true;
    void fetcher.load(nextUrl);
  }, [fetcher, initialResult, lastUrl, dateRange]);

  const graphStatus = useMemo<GraphStateStatus>(() => {
    if (fetcher.state !== "idle") return "loading";
    if (!currentResult) return "loading";
    if (!currentResult.ok) return "error";
    return currentResult.data.length === 0 ? "empty" : "success";
  }, [currentResult, fetcher.state]);

  const handleRetry = useCallback(() => {
    if (hasFetcherLoaded.current && lastUrl) {
      void fetcher.load(lastUrl);
      return;
    }
    void revalidator.revalidate();
  }, [fetcher, lastUrl, revalidator]);

  const chartData = useMemo(
    () => (currentResult?.ok ? currentResult.data : []),
    [currentResult],
  );

  const [visibility, setVisibility] = useState<SeriesVisibility>({
    published: true,
    evaluating: true,
    unpublished: true,
    temporarilyPublished: true,
    publicationRate: true,
  });

  const toggleSeries = (key: keyof SeriesVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // グラフデータを変換（YYYY-MM → YYYY/MM に変換して表示）
  const categories = useMemo(
    () => chartData.map((d) => d.month.replace("-", "/")),
    [chartData],
  );
  const barSeries = useMemo(
    () => [
      // 積み上げ順序: 下から「公開中→評価中→非公開→一時公開」（他のグラフと統一）
      {
        name: "公開中",
        data: chartData.map((d) => d.published),
        color: STATUS_COLORS.published,
        visible: visibility.published,
      },
      {
        name: "評価中",
        data: chartData.map((d) => d.evaluating),
        color: STATUS_COLORS.evaluating,
        visible: visibility.evaluating,
      },
      {
        name: "非公開",
        data: chartData.map((d) => d.unpublished),
        color: STATUS_COLORS.unpublished,
        visible: visibility.unpublished,
      },
      {
        name: "一時公開",
        data: chartData.map((d) => d.temporarilyPublished),
        color: STATUS_COLORS.temporarilyPublished,
        visible: visibility.temporarilyPublished,
      },
    ],
    [
      chartData,
      visibility.published,
      visibility.evaluating,
      visibility.unpublished,
      visibility.temporarilyPublished,
    ],
  );

  const lineSeries = useMemo(
    () => ({
      name: "公開率",
      data: chartData.map((d) => d.publicationRate * 100),
      color: PUBLICATION_RATE_COLOR,
      visible: visibility.publicationRate,
      unit: "%",
    }),
    [chartData, visibility.publicationRate],
  );

  const footer = (
    <Group gap="xl" wrap="wrap">
      <Group align="center" gap="xs">
        <Text c="white" fw={700} size="md">
          ステータス
        </Text>
      </Group>
      <Group gap="lg">
        <LegendItem
          color={STATUS_COLORS.published}
          isVisible={visibility.published}
          label="公開中"
          onClick={() => toggleSeries("published")}
        />
        <LegendItem
          color={STATUS_COLORS.evaluating}
          isVisible={visibility.evaluating}
          label="評価中"
          onClick={() => toggleSeries("evaluating")}
        />
        <LegendItem
          color={STATUS_COLORS.unpublished}
          isVisible={visibility.unpublished}
          label="非公開"
          onClick={() => toggleSeries("unpublished")}
        />
        <LegendItem
          color={STATUS_COLORS.temporarilyPublished}
          isVisible={visibility.temporarilyPublished}
          label="一時公開"
          onClick={() => toggleSeries("temporarilyPublished")}
        />
        <LegendItem
          color={PUBLICATION_RATE_COLOR}
          isLine
          isVisible={visibility.publicationRate}
          label="公開率"
          onClick={() => toggleSeries("publicationRate")}
        />
      </Group>
    </Group>
  );

  return (
    <GraphWrapper
      dateRange={dateRange}
      helpText={helpText}
      onDateRangeChange={setDateRange}
      title="1年間のコミュニティノート数と公開率"
      updatedAt={currentResult?.ok ? currentResult.updatedAt : undefined}
    >
      <GraphState
        error={currentResult?.ok ? undefined : currentResult?.error}
        loadingHeight={400}
        onRetry={handleRetry}
        status={graphStatus}
      >
        <GraphContainer footer={footer}>
          <StackedBarLineChart
            barSeries={barSeries}
            categories={categories}
            height="400px"
            leftYAxis={{ name: "コミュニティノート作成数" }}
            lineSeries={lineSeries}
            minHeight={350}
            rightYAxis={{ min: 0, max: 100 }}
          />
        </GraphContainer>
      </GraphState>
    </GraphWrapper>
  );
};
