import { Group, Text, UnstyledButton } from "@mantine/core";
import { useEffect,useMemo, useState } from "react";

import type { MonthlyNoteData, PeriodRangeValue } from "~/components/graph";
import {
  GraphContainer,
  GraphWrapper,
  StackedBarLineChart,
  STATUS_COLORS,
} from "~/components/graph";

import type { NotesAnnualApiResponse } from "./data";
import { createMockResponse } from "./data";
import { NOTES_ANNUAL_PERIOD_OPTIONS } from "./periodOptions";

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
  /** グラフデータ */
  data?: MonthlyNoteData[];
  /** ヘルプテキスト（ツールチップで表示） */
  helpText?: string;
  /** 更新日（YYYY-MM-DD形式） */
  updatedAt?: string;
};

export const NotesAnnualChartSection = ({
  data,
  helpText = "このグラフは、過去1年間のコミュニティノートの数と公開率を月ごとに表示しています。",
  updatedAt,
}: NotesAnnualChartSectionProps) => {
  const options = useMemo(() => NOTES_ANNUAL_PERIOD_OPTIONS, []);
  const defaultPeriod = options[0]?.value ?? NOTES_ANNUAL_PERIOD_OPTIONS[0]!.value;
  const [period, setPeriod] = useState<PeriodRangeValue>(defaultPeriod);

  const mockResponse = useMemo<NotesAnnualApiResponse>(
    () => createMockResponse(period),
    [period]
  );

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  // 現在はモックデータを使用（periodに応じて生成）
  const chartData = useMemo(
    () => data ?? mockResponse.data,
    [data, mockResponse.data]
  );

  useEffect(() => {
    if (!options.length) return;
    if (period && options.some((option) => option.value === period)) return;
    const fallback =
      options.find((option) => option.value === defaultPeriod)?.value ??
      options[0]?.value ??
      defaultPeriod;
    setPeriod(fallback);
  }, [options, defaultPeriod, period]);

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
  const categories = chartData.map((d) => d.month.replace("-", "/"));
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
    [chartData, visibility.published, visibility.evaluating, visibility.unpublished, visibility.temporarilyPublished]
  );

  const lineSeries = useMemo(
    () => ({
      name: "公開率",
      data: chartData.map((d) => d.publicationRate),
      color: PUBLICATION_RATE_COLOR,
      visible: visibility.publicationRate,
      unit: "%",
    }),
    [chartData, visibility.publicationRate]
  );

  const footer = (
    <Group gap="xl">
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
      helpText={helpText}
      onPeriodChange={setPeriod}
      period={period}
      periodOptions={options}
      title="1年間のコミュニティノート数と公開率"
      updatedAt={updatedAt ?? mockResponse.updatedAt}
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
    </GraphWrapper>
  );
};
