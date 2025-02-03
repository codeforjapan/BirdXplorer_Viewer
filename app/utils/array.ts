export const arrayContainsNonNullItem = (
  ...errors: Array<string[] | string | null | undefined>
) => {
  const flattenArray = errors?.flat().filter((v) => v != null);

  return flattenArray != null && flattenArray.length > 0;
};

type TransformToArray<T, SPLITTER extends (value: T) => unknown[]> = T extends
  | null
  | undefined
  ? []
  : T extends unknown[]
  ? T
  : SPLITTER extends (value: T) => infer U
  ? U extends Array<infer V>
    ? V[]
    : never
  : never;

/**
 * Convert a value to an array.
 * @param value
 * array or value to convert to an array
 * @param splitter
 * function to split the value into an array
 * @returns
 * an array
 */
export function transformToArray<T, U>(
  value: T,
  splitter: (value: T) => U[]
): TransformToArray<T, typeof splitter> {
  if (value == null) {
    // @ts-expect-error TypeScript は理解できていない
    return [];
  }

  if (Array.isArray(value)) {
    // @ts-expect-error TypeScript は理解できていない
    return value;
  }

  // @ts-expect-error TypeScript は理解できていない
  return splitter(value);
}
