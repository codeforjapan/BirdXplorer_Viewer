/**
 * unix timestamp らしき値から、安全な場合のみ Date オブジェクトを生成する
 * @param unixMs Unix timestamp らしき値
 * @returns 安全な値であれば Date オブジェクト、そうでなければ null
 */
export const safeDateFromUnixMs = (
  unixMs: string | number | null | undefined,
) =>
  unixMs && !Number.isNaN(Number(unixMs)) ? new Date(Number(unixMs)) : null;

const DEFAULT_DATE_LOCALE = "ja-JP";
const DEFAULT_DATE_TIME_ZONE = "Asia/Tokyo";

const parseIsoDateToUtcDate = (isoDate: string): Date | null => {
  const [yearString, monthString, dayString] = isoDate.split("-");
  if (!yearString || !monthString || !dayString) {
    return null;
  }

  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);
  if (![year, month, day].every(Number.isInteger)) {
    return null;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
};

/**
 * ISO形式の日付文字列（YYYY-MM-DD）を日本語の日付表示に変換する
 * @param isoDate ISO形式の日付文字列（例: "2025-01-15"）
 * @returns
 * 日本語の日付表示（例: "2025年1月15日"）
 * パースできない場合は元の文字列を返す
 * @example
 * formatDateJa("2025-01-15") // => "2025年1月15日"
 */
export const formatDateJa = (isoDate: string): string => {
  const date = parseIsoDateToUtcDate(isoDate);
  if (!date) {
    return isoDate;
  }
  return `${date.getUTCFullYear()}年${date.getUTCMonth() + 1}月${date.getUTCDate()}日`;
};

/**
 * ISO形式の日付文字列（YYYY-MM-DD）をロケールに応じた日付表示に変換する
 * @param isoDate ISO形式の日付文字列（例: "2025-01-15"）
 * @param options localeやtimeZoneを指定（未指定時はJST/ja-JP）
 * @returns
 * ロケールに応じた日付表示
 * パースできない場合は元の文字列を返す
 */
export const formatDateLocalized = (
  isoDate: string,
  options: { locale?: string; timeZone?: string } = {}
): string => {
  const date = parseIsoDateToUtcDate(isoDate);
  if (!date) {
    return isoDate;
  }

  const { locale = DEFAULT_DATE_LOCALE, timeZone = DEFAULT_DATE_TIME_ZONE } = options;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    timeZone,
  }).format(date);
};

/**
 * ISO形式の日付文字列（YYYY-MM-DD）を日本語の更新日の表示に変換する
 * @param isoDate ISO形式の日付文字列（例: "2025-01-15"）
 * @returns
 * 日本語の更新日表示（例: "2025年1月15日更新"）
 * @example
 * formatUpdatedAt("2025-01-15") // => "2025年1月15日更新"
 * formatUpdatedAt("2025-12-03") // => "2025年12月3日更新"
 */
export const formatUpdatedAt = (isoDate: string): string => {
  return `${formatDateJa(isoDate)}更新`;
};
