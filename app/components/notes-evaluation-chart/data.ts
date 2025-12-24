import dayjs from "dayjs";

import type { NoteEvaluationData, RelativePeriodValue } from "~/components/graph";
import { RELATIVE_PERIOD_OPTIONS } from "~/components/graph";
import type { PeriodOption } from "~/components/graph/types";

export type NotesEvaluationApiResponse = {
  data: NoteEvaluationData[];
  updatedAt: string;
};

/**
 * モックデータを生成
 * 軸の配置: X軸=notHelpful（役に立たなかった）, Y軸=helpful（役に立った）
 * → 左上が「良い評価」、右下が「悪い評価」
 */
const getPeriodScale = (period?: RelativePeriodValue): number => {
  switch (period) {
    case "1week":
      return 0.4;
    case "1month":
      return 0.7;
    case "6months":
      return 1.2;
    case "1year":
      return 1.5;
    case "3months":
    default:
      return 1;
  }
};

const resolvePeriod = (
  period: RelativePeriodValue | undefined,
  periodOptions: Array<PeriodOption<RelativePeriodValue>>,
  defaultPeriod?: RelativePeriodValue
): RelativePeriodValue => {
  if (period && periodOptions.some((option) => option.value === period)) {
    return period;
  }
  if (
    defaultPeriod &&
    periodOptions.some((option) => option.value === defaultPeriod)
  ) {
    return defaultPeriod;
  }
  return (
    periodOptions[0]?.value ??
    defaultPeriod ??
    RELATIVE_PERIOD_OPTIONS[0]!.value
  );
};

export const generateMockData = (
  period?: RelativePeriodValue
): NoteEvaluationData[] => {
  const result: NoteEvaluationData[] = [];
  const scale = getPeriodScale(period);
  const scaledCount = (base: number) => Math.max(1, Math.round(base * scale));

  // 公開中（紫）- 左上に集中（helpfulが高く、notHelpfulが低い）
  for (let i = 0; i < scaledCount(30); i++) {
    result.push({
      noteId: `published-${i + 1}`,
      name: `公開中ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 800) + 800,
      notHelpful: Math.floor(Math.random() * 100) + 20,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: "published",
    });
  }

  // 評価中（水色）- 左下〜中央に広く散らばる
  for (let i = 0; i < scaledCount(50); i++) {
    result.push({
      noteId: `evaluating-${i + 1}`,
      name: `評価中ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 400) + 50,
      notHelpful: Math.floor(Math.random() * 150) + 10,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: "evaluating",
    });
  }
  // 中央に散らばる
  for (let i = 0; i < scaledCount(30); i++) {
    result.push({
      noteId: `evaluating-${51 + i}`,
      name: `評価中ノート${51 + i}`,
      helpful: Math.floor(Math.random() * 500) + 300,
      notHelpful: Math.floor(Math.random() * 200) + 100,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: "evaluating",
    });
  }

  // 非公開（青）- 右側（notHelpfulが高い）
  for (let i = 0; i < scaledCount(10); i++) {
    result.push({
      noteId: `unpublished-${i + 1}`,
      name: `非公開ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 300) + 50,
      notHelpful: Math.floor(Math.random() * 200) + 250,
      impressions: Math.floor(Math.random() * 4000000) + 1000000,
      status: "unpublished",
    });
  }

  // 一時公開（ピンク）- 中央付近に点在
  for (let i = 0; i < scaledCount(20); i++) {
    result.push({
      noteId: `temporarilyPublished-${i + 1}`,
      name: `一時公開ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 600) + 400,
      notHelpful: Math.floor(Math.random() * 150) + 50,
      impressions: Math.floor(Math.random() * 30000000) + 20000000,
      status: "temporarilyPublished",
    });
  }

  return result;
};

export const createMockResponse = (
  period?: RelativePeriodValue
): NotesEvaluationApiResponse => {
  const defaultPeriod = RELATIVE_PERIOD_OPTIONS[0]!.value;
  const resolvedPeriod = resolvePeriod(
    period,
    RELATIVE_PERIOD_OPTIONS,
    defaultPeriod
  );

  return {
    data: generateMockData(resolvedPeriod),
    updatedAt: dayjs().format("YYYY-MM-DD"),
  };
};
