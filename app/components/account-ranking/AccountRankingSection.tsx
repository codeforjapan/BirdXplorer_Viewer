import { Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import * as React from "react";
import { useFetcher, useRevalidator } from "react-router";

import type { GraphFetchResult, GraphStateStatus } from "~/components/graph";
import { GraphContainer, GraphState, GraphWrapper } from "~/components/graph";
import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import type { TopNoteAccountDataItem } from "~/generated/api/schemas/topNoteAccountDataItem";
import type { AccountRankingPeriod } from "~/utils/dateRange";
import { rankingPeriodToTimestamps } from "~/utils/dateRange";

export type AccountRankingSectionProps = {
  /** コンテナのクラス名 */
  className?: string;
  initialResult?: GraphFetchResult<TopNoteAccountDataItem[]>;
  initialPeriod?: AccountRankingPeriod;
  /** 固定の日付範囲（指定時は期間セレクターを非表示にしてこの期間を使用） */
  fixedTimestamps?: { start_date: number; end_date: number };
};

const PERIOD_OPTIONS: Array<{ value: AccountRankingPeriod; label: string }> = [
  { value: "1week", label: "直近1週間" },
  { value: "2weeks", label: "直近2週間" },
  { value: "1month", label: "直近1ヶ月" },
];

const formatChange = (
  change: number
): { text: string; direction: "up" | "down" | "neutral" } => {
  if (change > 0) return { text: `+${change}`, direction: "up" };
  if (change < 0) return { text: String(change), direction: "down" };
  return { text: "→", direction: "neutral" };
};

/**
 * アカウントランキングセクション
 * - ユーザー名、付与数、前回比を表形式で表示
 * - 期間は1週間／2週間／1ヶ月から選択（2日前を終端とする）
 */
export const AccountRankingSection = ({
  className,
  initialResult,
  initialPeriod = "1week",
  fixedTimestamps,
}: AccountRankingSectionProps) => {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;
  const [period, setPeriod] = React.useState<AccountRankingPeriod>(initialPeriod);
  const fetcher = useFetcher<GraphFetchResult<TopNoteAccountDataItem[]>>();
  const revalidator = useRevalidator();
  const hasFetcherLoaded = React.useRef(false);
  const hasMounted = React.useRef(false);
  const [lastUrl, setLastUrl] = React.useState<string | null>(null);

  const currentResult = fetcher.data ?? initialResult;

  React.useEffect(() => {
    const { start_date, end_date } = fixedTimestamps ?? rankingPeriodToTimestamps(period);
    const nextUrl = `/resources/graphs/top-note-accounts?start_date=${start_date}&end_date=${end_date}`;

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
  }, [fetcher, fixedTimestamps, initialResult, lastUrl, period]);

  const graphStatus = React.useMemo<GraphStateStatus>(() => {
    if (fetcher.state !== "idle") return "loading";
    if (!currentResult) return "loading";
    if (!currentResult.ok) return "error";
    return currentResult.data.length === 0 ? "empty" : "success";
  }, [currentResult, fetcher.state]);

  const handleRetry = React.useCallback(() => {
    if (hasFetcherLoaded.current && lastUrl) {
      void fetcher.load(lastUrl);
      return;
    }
    void revalidator.revalidate();
  }, [fetcher, lastUrl, revalidator]);

  const rows = React.useMemo(() => {
    if (!currentResult?.ok) return [];
    return currentResult.data.map((item) => {
      const { text, direction } = formatChange(item.noteCountChange);
      return (
        <Table.Tr key={item.rank}>
          <Table.Td className="text-center text-white">{item.rank}</Table.Td>
          <Table.Td className="text-white">{item.username}</Table.Td>
          <Table.Td className="text-center text-white">
            {item.noteCount.toLocaleString()}
          </Table.Td>
          <Table.Td className="text-center">
            <span
              className={
                direction === "up"
                  ? "text-green"
                  : direction === "down"
                    ? "text-red"
                    : "text-white"
              }
            >
              {text}
            </span>
          </Table.Td>
        </Table.Tr>
      );
    });
  }, [currentResult]);

  return (
    <GraphWrapper
      className={className}
      onPeriodChange={fixedTimestamps ? undefined : setPeriod}
      period={fixedTimestamps ? undefined : period}
      periodOptions={fixedTimestamps ? undefined : PERIOD_OPTIONS}
      title="アカウントランキング"
      updatedAt={currentResult?.ok ? currentResult.updatedAt : undefined}
    >
      <GraphState
        error={currentResult?.ok ? undefined : currentResult?.error}
        onRetry={handleRetry}
        status={graphStatus}
      >
        <GraphContainer>
          <div className="w-full overflow-x-auto">
            <Table
              highlightOnHover
              horizontalSpacing={isMobile ? "xs" : "md"}
              striped="even"
              stripedColor="var(--color-gray-1)"
              styles={{
                table: {
                  backgroundColor: "var(--color-black)",
                },
                th: {
                  backgroundColor: "var(--color-gray-1)",
                  borderBottom: "1px solid var(--color-gray-1)",
                  color: "white",
                  fontSize: isMobile ? "12px" : "14px",
                  fontWeight: 600,
                  textAlign: "center",
                },
                td: {
                  borderBottom: "1px solid var(--color-gray-1)",
                  color: "white",
                  fontSize: isMobile ? "12px" : "14px",
                },
              }}
              verticalSpacing={isMobile ? "xs" : "sm"}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: "10%" }}>順位</Table.Th>
                  <Table.Th style={{ textAlign: "left", width: "40%" }}>
                    ユーザー名
                  </Table.Th>
                  <Table.Th style={{ width: "25%" }}>付与数</Table.Th>
                  <Table.Th style={{ width: "25%" }}>前回比</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </div>
        </GraphContainer>
      </GraphState>
    </GraphWrapper>
  );
};
