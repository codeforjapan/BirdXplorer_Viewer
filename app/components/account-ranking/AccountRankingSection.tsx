import { Anchor, Table } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import * as React from "react";

import { GraphContainer } from "~/components/graph/GraphContainer";
import { GraphWrapper } from "~/components/graph/GraphWrapper";
import { MOBILE_BREAKPOINT } from "~/constants/breakpoints";
import { buildTwitterProfileUrl } from "~/feature/twitter/link-builder";

import { generateMockData } from "./data";

/** アカウントランキングデータの型 */
export type AccountRankingData = {
  username: string;
  displayName: string;
  noteCount: number;
  change: string;
  worldRank: number;
  /** 前回比の変動（増加、減少、変化なし） */
  changeDirection: "up" | "down" | "neutral";
};

export type AccountRankingSectionProps = {
  data?: AccountRankingData[];
  updatedAt?: string;
  periodOptions?: Array<{ value: string; label: string }>;
  initialPeriod?: string;
};

/**
 * アカウントランキングセクション
 * - ユーザー名、付与数、前回比、世界ランキングを表形式で表示
 * - 名前をクリックでTwitterへ遷移
 */
export const AccountRankingSection = ({
  data,
  updatedAt = "2025年10月13日更新",
  periodOptions,
  initialPeriod = "1month",
}: AccountRankingSectionProps) => {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT) ?? false;
  const [period, setPeriod] = React.useState(initialPeriod);

  // TODO: 期間変更時にAPIからデータを取得するロジックを実装する
  const rankingData = React.useMemo(
    () => (data ?? generateMockData()).slice(0, 10),
    [data],
  );

  const defaultPeriodOptions = React.useMemo(
    () => [
      { value: "1month", label: "直近1ヶ月" },
      { value: "3months", label: "直近3ヶ月" },
      { value: "6months", label: "直近6ヶ月" },
      { value: "1year", label: "直近1年" },
    ],
    [],
  );

  const rows = rankingData.map((item, index) => (
    <Table.Tr key={item.username}>
      <Table.Td className="text-center text-white">{index + 1}</Table.Td>
      <Table.Td>
        <Anchor
          className="!text-white !underline"
          href={buildTwitterProfileUrl(item.username)}
          rel="noopener noreferrer"
          target="_blank"
        >
          {item.displayName}
        </Anchor>
      </Table.Td>
      <Table.Td className="text-center text-white">
        {item.noteCount.toLocaleString()}
      </Table.Td>
      <Table.Td className="text-center">
        <span
          className={
            item.changeDirection === "up"
              ? "text-green"
              : item.changeDirection === "down"
                ? "text-red"
                : "text-white"
          }
        >
          {item.change}
        </span>
      </Table.Td>
      <Table.Td className="text-center text-white">{item.worldRank}</Table.Td>
    </Table.Tr>
  ));

  return (
    <GraphWrapper
      onPeriodChange={setPeriod}
      period={period}
      periodOptions={periodOptions ?? defaultPeriodOptions}
      title="アカウントランキング"
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
                <Table.Th style={{ textAlign: "left", width: "30%" }}>
                  ユーザー名
                </Table.Th>
                <Table.Th style={{ width: "20%" }}>付与数</Table.Th>
                <Table.Th style={{ width: "20%" }}>前回比</Table.Th>
                <Table.Th style={{ width: "20%" }}>世界ランキング</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      </GraphContainer>
    </GraphWrapper>
  );
};
