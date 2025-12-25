import type { PeriodOption } from "./types";

export const getDefaultPeriodValue = <T extends string>(
  options: Array<PeriodOption<T>>
): T => {
  const value = options[0]?.value;
  if (!value) {
    throw new Error("Period options must not be empty.");
  }
  return value;
};
