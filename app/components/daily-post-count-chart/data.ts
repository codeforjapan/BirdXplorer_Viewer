import dayjs from "dayjs";

/** モックデータのデフォルト最新日（現在月） */
export const MOCK_NEWEST_DATE = dayjs().format("YYYY-MM");

/** モックデータのデフォルト最古日（2年前 + 3ヶ月 = 1年9ヶ月前） */
export const MOCK_OLDEST_DATE = dayjs()
  .subtract(2, "year")
  .add(3, "month")
  .format("YYYY-MM");

/** ポスト日別投稿数データ */
export type DailyPostCountDataItem = {
  /** 日付（YYYY-MM-DD） */
  date: string;
  published: number;
  evaluating: number;
  unpublished: number;
};

/** グラフ上に表示するイベントマーカー */
export type EventMarker = {
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** 表示ラベル（例: "7/3 公示"） */
  label: string;
};

/**
 * @param period 期間文字列（例: "2024-12_2025-12"）
 * @throws 不正なフォーマットの場合
 */
const parsePeriod = (period: string): { start: dayjs.Dayjs; end: dayjs.Dayjs } => {
  const [startStr, endStr] = period.split("_");
  if (!startStr || !endStr) {
    throw new Error(`Invalid period format: ${period}`);
  }
  const start = dayjs(startStr, "YYYY-MM").startOf("month");
  const end = dayjs(endStr, "YYYY-MM").endOf("month");
  return { start, end };
};

/**
 * デモ用: 期間の40%/60%地点にマーカーを配置
 * @param period 期間文字列（例: "2024-12_2025-12"）
 */
export const generateDemoEventMarkers = (period: string): EventMarker[] => {
  const { start, end } = parsePeriod(period);
  const totalDays = end.diff(start, "day");
  const marker1 = start.add(Math.floor(totalDays * 0.4), "day");
  const marker2 = start.add(Math.floor(totalDays * 0.6), "day");
  return [
    { date: marker1.format("YYYY-MM-DD"), label: `${marker1.format("M/D")} 公示` },
    { date: marker2.format("YYYY-MM-DD"), label: `${marker2.format("M/D")} 投開票` },
  ];
};

/** @param period 期間文字列（例: "2024-12_2025-12"） */
export const generateMockData = (period: string): DailyPostCountDataItem[] => {
  const { start, end } = parsePeriod(period);

  const days: DailyPostCountDataItem[] = [];
  const totalDays = end.diff(start, "day") + 1;

  for (let d = 0; d < totalDays; d++) {
    const date = start.add(d, "day");
    const iso = date.format("YYYY-MM-DD");

    // モックデータ: 月ごとに変動させる
    const baseFactor = 1 + date.month() * 0.1;

    const published = Math.max(
      0,
      Math.floor(baseFactor * 5 + Math.random() * 10 - 3)
    );
    const evaluating = Math.max(
      0,
      Math.floor(baseFactor * 3 + Math.random() * 8 - 2)
    );
    const unpublished = Math.max(
      0,
      Math.floor(baseFactor * 2 + Math.random() * 5 - 1)
    );

    days.push({ date: iso, published, evaluating, unpublished });
  }

  return days;
};
