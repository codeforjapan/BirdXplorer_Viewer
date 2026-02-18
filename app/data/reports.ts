export type ReportItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  date: Date;
  /** 広聴AIレポートのパス（例: /kouchou-ai/202506/{uuid}/index.html） */
  kouchouAiPath?: string;
};

/** デフォルトの広聴AIパス（個別設定がない場合に使用） */
export const DEFAULT_KOUCHOU_AI_PATH =
  "/kouchou-ai/202506/52c5c1bc-fb89-4aa9-ab67-b35e2f663cf2/index.html";

/**
 * 年と月からレポートのhrefを生成
 * @param year 年（例: 2025）
 * @param month 月（例: 9）
 * @returns href（例: /report/2025/09）
 */
const buildReportHref = (year: number, month: number): string => {
  const monthStr = month.toString().padStart(2, "0");
  return `/report/${year}/${monthStr}`;
};

export const REPORT_ITEMS: ReportItem[] = [
  {
    id: "1",
    title: "2026年 1月レポート",
    description:
      "奈良市の持続可能な発展を目指す意見が多岐にわたって集まっています。都市開発や交通インフラの革新、地域活性化、教育と地域社会の連携、観光振興、地域資源の活用、市民参加とAI活用による市政改革、高齢化社会への対応、防災力強化、環境保全、医療・教育の連携強化...",
    href: buildReportHref(2026, 1),
    date: new Date("2026-01-01"),
    kouchouAiPath: `/kouchou-ai/2026/01/d2ca1370-0e55-4e51-95e2-9dd3c105a202/index.html`,
  },
];