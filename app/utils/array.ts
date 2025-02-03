export const arrayContainsNonNullItem = (
  ...errors: Array<string[] | string | null | undefined>
) => {
  const flattenArray = errors?.flat().filter((v) => v != null);

  return flattenArray != null && flattenArray.length > 0;
};

/**
 * Convert a value to an array.
 * @param value
 * array or value to convert to an array
 * @param splitter
 * function to split the value into an array
 * @default
 * ```ts
 * function splitter(value: T): T[] {
 *  return [value];
 * }
 * ```
 * @returns
 * an array
 */
export const transformToArray = <T>(
  value: T | T[],
  splitter: (value: T) => T[] = (value) => [value]
): T[] => {
  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return splitter(value);
};
