import { LanguageIdentifier } from "../../generated/api/schemas";

export type LanguageIdentifierLiteral =
  (typeof LanguageIdentifier)[keyof typeof LanguageIdentifier];

/**
 * identifier が LanguageIdentifier かどうかを判定する
 * @param identifier
 */
export const isLanguageIdentifierLiteral = (
  identifier: string,
): identifier is LanguageIdentifierLiteral => {
  return Object.values(LanguageIdentifier).includes(
    identifier as LanguageIdentifierLiteral,
  );
};

export const LANGUAGE_ID_TO_LABEL = {
  // 言語
  ar: "アラビア語",
  ca: "カタロニア語",
  da: "デンマーク語",
  de: "ドイツ語",
  el: "ギリシャ語",
  en: "英語",
  es: "スペイン語",
  fa: "ペルシア語",
  fi: "フィンランド語",
  fr: "フランス語",
  he: "ヘブライ語",
  it: "イタリア語",
  ja: "日本語",
  nl: "オランダ語",
  pl: "ポーランド語",
  pt: "ポルトガル語",
  ru: "ロシア語",
  sv: "スウェーデン語",
  tr: "トルコ語",

  // その他
  other: "その他",
} as const satisfies Record<LanguageIdentifierLiteral, string>;
