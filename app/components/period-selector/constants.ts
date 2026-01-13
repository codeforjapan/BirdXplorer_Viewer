export type PeriodValue = "1week" | "1month" | "3months" | "6months" | "1year";

export const PERIOD_OPTIONS: Array<{ value: PeriodValue; label: string }> = [
  { value: "1week", label: "直近1週間" },
  { value: "1month", label: "直近1ヶ月" },
  { value: "3months", label: "直近3ヶ月" },
  { value: "6months", label: "直近6ヶ月" },
  { value: "1year", label: "直近1年" },
];
