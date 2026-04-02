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
    id: "2",
    title: "2026年 2月レポート",
    description:
      "社会的多様性や人権保障、感染症対策、情報の正確性、法的規制、経済政策、災害対策、食品安全、国際関係、医療情報、SNSの信頼性、外国人支援など多岐にわたるテーマが議論されています。特に、科学的根拠に基づく情報の重要性や、法的リスクへの警戒、地域振興に向けた制度改革の必要性が強調され、社会全体の透明性や公正性の確保が求められています。",
    href: buildReportHref(2026, 2),
    date: new Date("2026-02-01"),
    kouchouAiPath: `/kouchou-ai/2026/02/2641c07e-ffa8-4309-b53d-e2e4547b0fc5/index.html`,
  },
  {
    id: "1",
    title: "2026年 1月レポート",
    description:
      "日本の選挙戦略や政党の影響力、政治発言の透明性、地域交通と災害対策、SNS上の悪質行為、社会保障と移民政策、選挙の透明性確保、エネルギー政策の対立、情報の信頼性、AI技術と著作権、虚偽情報対策、医療情報の信頼性、コミュニティノートの運用、著作権保護、コロナウイルスに関する科学的根拠、デマの検証、動画情報の信頼性、aespaの健康問題など、多岐にわたるテーマが議論されており、透明性や信頼性の確保が強調されています。",
    href: buildReportHref(2026, 1),
    date: new Date("2026-01-01"),
    kouchouAiPath: `/kouchou-ai/2026/01/d2ca1370-0e55-4e51-95e2-9dd3c105a202/index.html`,
  },
];
