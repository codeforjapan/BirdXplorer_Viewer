/**
 * unix timestamp としてありえる値から、安全な場合のみ Date オブジェクトを生成する
 * @param unixMs
 * Unix timestamp らしき値
 * @returns
 * 安全な値であれば Date オブジェクト、そうでなければ null
 */
export const safeDateFromUnixMs = (
  unixMs: string | number | null | undefined
) =>
  unixMs && !Number.isNaN(Number(unixMs)) ? new Date(Number(unixMs)) : null;
