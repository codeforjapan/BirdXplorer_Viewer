import dayjs from "dayjs";

/** ポスト日別投稿数データ */
export type DailyPostCountDataItem = {
  /** 日付（YYYY-MM-DD） */
  date: string;
  published: number;
  evaluating: number;
  unpublished: number;
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
