/** 月ごとのノートデータ */
export type MonthlyNoteData = {
  /** 月ラベル（例: "2024/10"） */
  month: string;
  published: number;
  evaluating: number;
  unpublished: number;
  publicationRate: number;
};

/** ダミー期間オプション（モックデータの期間に対応） */
export const MOCK_PERIOD_OPTIONS = [
  { value: "2024/10-2025/09", label: "2024/10 〜 2025/09" },
  { value: "2023/10-2024/09", label: "2023/10 〜 2024/09" },
  { value: "2022/10-2023/09", label: "2022/10 〜 2023/09" },
];

/** 12ヶ月分のモックデータを生成 */
export const generateMockData = (): MonthlyNoteData[] => {
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

