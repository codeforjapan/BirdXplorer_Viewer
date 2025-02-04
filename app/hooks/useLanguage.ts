import { useSyncExternalStore } from "react";

export function useLanguage(defaultLanguage: string): string;
export function useLanguage(): string | undefined;

export function useLanguage(defaultLanguage?: string): string | undefined {
  return useSyncExternalStore(
    (doRender) => {
      window.addEventListener("languagechange", () => {
        doRender();
      });

      return () => {
        window.removeEventListener("languagechange", () => {
          doRender();
        });
      };
    },
    () => navigator.language,
    () => defaultLanguage
  );
}
