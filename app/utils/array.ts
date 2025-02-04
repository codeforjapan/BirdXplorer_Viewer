/**
 * Check if the array contains non-null values.
 * @param values
 * values to check
 * @returns
 * `true` if the array contains non-null values, otherwise `false`
 */
export const containsNonNullValues = <T>(
  ...values: Array<T[] | T | null | undefined>
): boolean => {
  const nonNullValues = values?.flat().filter((v) => v != null);

  return nonNullValues != null && nonNullValues.length > 0;
};
