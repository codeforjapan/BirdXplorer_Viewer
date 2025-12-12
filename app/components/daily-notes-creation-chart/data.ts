import dayjs from "dayjs";

export type DailyNotesCreationDataItem = {
  /** 日付（YYYY-MM-DD） */
  date: string;
  /** 公開中のノート数 */
  published: number;
  /** 評価中のノート数 */
  evaluating: number;
  /** 非公開のノート数 */
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
 * 直近1ヶ月の期間内に2つのマーカーを配置
 */
export const getDefaultEventMarkers = (): EventMarker[] => {
  const end = dayjs().startOf("day");
  const marker1 = end.subtract(20, "day");
  const marker2 = end.subtract(7, "day");
  return [
    { date: marker1.format("YYYY-MM-DD"), label: `${marker1.format("M/D")} 公示` },
    { date: marker2.format("YYYY-MM-DD"), label: `${marker2.format("M/D")} 投開票` },
  ];
};

export const generateMockData = (): DailyNotesCreationDataItem[] => {
  const end = dayjs().startOf("day");
  const start = end.subtract(1, "month");

  const days: DailyNotesCreationDataItem[] = [];
  const totalDays = end.diff(start, "day") + 1;

  for (let d = 0; d < totalDays; d++) {
    const date = start.add(d, "day");
    const iso = date.format("YYYY-MM-DD");

    // モックデータ: 日ごとにランダムな変動
    const baseFactor = 1 + Math.random() * 0.5;

    const published = Math.max(
      0,
      Math.floor(baseFactor * 3 + Math.random() * 8 - 2)
    );
    const evaluating = Math.max(
      0,
      Math.floor(baseFactor * 8 + Math.random() * 15 - 3)
    );
    const unpublished = Math.max(
      0,
      Math.floor(baseFactor * 2 + Math.random() * 5 - 1)
    );

    days.push({ date: iso, published, evaluating, unpublished });
  }

  return days;
};
