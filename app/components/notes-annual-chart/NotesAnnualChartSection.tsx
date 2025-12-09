import { Group, Text, UnstyledButton } from "@mantine/core";
import * as React from "react";

import {
  GraphContainer,
  GraphWrapper,
  StackedBarLineChart,
  STATUS_COLORS,
} from "~/components/graph";

/** 公開率の色（オレンジ） */
const PUBLICATION_RATE_COLOR = "#ffa726";

/** ダミー期間オプション（モックデータの期間に対応） */
const MOCK_PERIOD_OPTIONS = [
  { value: "2024/10-2025/09", label: "2024/10 〜 2025/09" },
  { value: "2023/10-2024/09", label: "2023/10 〜 2024/09" },
  { value: "2022/10-2023/09", label: "2022/10 〜 2023/09" },
];

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
  publicationRate: boolean;
};

/** 月ごとのノートデータ */
type MonthlyNoteData = {
  /** 月ラベル（例: "2024/10"） */
  month: string;
  published: number;
  evaluating: number;
  unpublished: number;
  publicationRate: number;
};

/** 12ヶ月分のモックデータを生成 */
const generateMockData = (): MonthlyNoteData[] => {
  const months = [
    "2024/10",
    "2024/11",
    "2024/12",
    "2025/01",
    "2025/02",
    "2025/03",
    "2025/04",
    "2025/05",
    "2025/06",
    "2025/07",
    "2025/08",
    "2025/09",
  ];

  return months.map((month) => {
    const published = Math.floor(Math.random() * 800) + 600;
    const evaluating = Math.floor(Math.random() * 500) + 300;
    const unpublished = Math.floor(Math.random() * 400) + 200;
    const total = published + evaluating + unpublished;
    const publicationRate = Math.round((published / total) * 100);

    return {
      month,
      published,
      evaluating,
      unpublished,
      publicationRate,
    };
  });
};

type NotesAnnualChartSectionProps = {
  /** グラフデータ */
  data?: MonthlyNoteData[];
  /** ヘルプテキスト（ツールチップで表示） */
  helpText?: string;
  /** 更新日（例: "2025年10月13日更新"） */
  updatedAt?: string;
};

export const NotesAnnualChartSection = ({
  data,
  helpText = "このグラフは、過去1年間のコミュニティノートの数と公開率を月ごとに表示しています。",
  updatedAt = "2025年10月13日更新",
}: NotesAnnualChartSectionProps) => {
  const [period, setPeriod] = React.useState(MOCK_PERIOD_OPTIONS[0]?.value ?? "");

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  // 現在はモックデータを使用しており、periodの変更には対応していない
  const chartData = React.useMemo(() => data ?? generateMockData(), [data]);

  const [visibility, setVisibility] = React.useState<SeriesVisibility>({
    published: true,
    evaluating: true,
    unpublished: true,
    publicationRate: true,
  });

  const toggleSeries = (key: keyof SeriesVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // グラフデータを変換
  const categories = chartData.map((d) => d.month);
  const barSeries = React.useMemo(
    () => [
      // 積み上げ順序: 下から「非公開→評価中→公開中」（公開中が最上部に表示される）
      {
        name: "非公開",
        data: chartData.map((d) => d.unpublished),
        color: STATUS_COLORS.unpublished,
        visible: visibility.unpublished,
      },
      {
        name: "評価中",
        data: chartData.map((d) => d.evaluating),
        color: STATUS_COLORS.evaluating,
        visible: visibility.evaluating,
      },
      {
        name: "公開中",
        data: chartData.map((d) => d.published),
        color: STATUS_COLORS.published,
        visible: visibility.published,
      },
    ],
    [chartData, visibility.unpublished, visibility.evaluating, visibility.published]
  );

  const lineSeries = React.useMemo(
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
      periodOptions={MOCK_PERIOD_OPTIONS}
      title="1年間のコミュニティノート数と公開率"
      updatedAt={updatedAt}
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
