import { useMemo } from "react";

import { useLanguage } from "~/hooks/useLanguage";

import {
  isLanguageIdentifierLiteral,
  type LanguageIdentifierLiteral,
} from "./language";

export const useLanguageLiteral = (
  defaultLanguage: LanguageIdentifierLiteral | undefined,
  fallback: LanguageIdentifierLiteral = "en",
): LanguageIdentifierLiteral => {
  const language = useLanguage(defaultLanguage);

  const shortLanguage = language?.slice(0, 2);

  const validShortLanguage = useMemo(() => {
    if (shortLanguage == null) {
      return "en";
    }
    return isLanguageIdentifierLiteral(shortLanguage)
      ? shortLanguage
      : fallback;
  }, [shortLanguage]);

  return validShortLanguage;
};
