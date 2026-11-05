import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export const JST_TZ = "Asia/Tokyo";

const YMD_FORMAT = "YYYY-MM-DD";

/**
 * JST のその日の 00:00:00.000 をUNIXミリ秒で返す
 */
export const jstStartOfDayMs = (ymd: string): number =>
  dayjs.tz(ymd, JST_TZ).valueOf();

/**
 * JST のその日の 23:59:59.999 をUNIXミリ秒で返す
 */
export const jstEndOfDayMs = (ymd: string): number =>
  dayjs.tz(ymd, JST_TZ).endOf("day").valueOf();

/**
 * 実行環境のローカルの年月日を "YYYY-MM-DD" にする（日付選択の Date を「選んだ日」として読む）
 */
export const dateToYmd = (date: Date): string =>
  dayjs
    .utc(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    .format(YMD_FORMAT);

/**
 * "YYYY-MM-DD" をローカルの 0 時の Date にする（日付選択の表示用）
 */
export const jstYmdToLocalDate = (ymd: string): Date => {
  const d = dayjs.utc(ymd);
  return new Date(d.year(), d.month(), d.date());
};

/**
 * UNIXミリ秒を JST の "YYYY-MM-DD" にする
 */
export const msToJstYmd = (ms: number): string =>
  dayjs(ms).tz(JST_TZ).format(YMD_FORMAT);

/**
 * JST の今日を "YYYY-MM-DD" で返す
 */
export const jstTodayYmd = (now: number = Date.now()): string =>
  msToJstYmd(now);

export const addDaysYmd = (ymd: string, n: number): string =>
  dayjs.utc(ymd).add(n, "day").format(YMD_FORMAT);

export const startOfMonthYmd = (ymd: string): string =>
  dayjs.utc(ymd).startOf("month").format(YMD_FORMAT);

export const endOfMonthYmd = (ymd: string): string =>
  dayjs.utc(ymd).endOf("month").format(YMD_FORMAT);

export const addMonthsYmd = (ymd: string, n: number): string =>
  dayjs.utc(ymd).add(n, "month").format(YMD_FORMAT);
