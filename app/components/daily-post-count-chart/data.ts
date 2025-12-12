import dayjs from "dayjs";

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
 * デフォルトのイベントマーカーを生成（デモ用）
 * 指定した年の中間あたりに2つのマーカーを配置
 */
export const getDefaultEventMarkers = (year: string): EventMarker[] => {
  const startOfYear = dayjs(year, "YYYY").startOf("year");
  const marker1 = startOfYear.add(6, "month").add(3, "day"); // 7/4
  const marker2 = startOfYear.add(6, "month").add(20, "day"); // 7/21
  return [
    { date: marker1.format("YYYY-MM-DD"), label: `${marker1.format("M/D")} 公示` },
    { date: marker2.format("YYYY-MM-DD"), label: `${marker2.format("M/D")} 投開票` },
  ];
};

/**
 * 指定した年の1年分のモックデータを生成
 * @param year 年（例: "2024"）
 */
export const generateMockData = (year: string): DailyPostCountDataItem[] => {
  const startOfYear = dayjs(year, "YYYY").startOf("year");
  const endOfYear = dayjs(year, "YYYY").endOf("year");

  const days: DailyPostCountDataItem[] = [];
  const totalDays = endOfYear.diff(startOfYear, "day") + 1;

  for (let d = 0; d < totalDays; d++) {
    const date = startOfYear.add(d, "day");
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
