export const arrayContainsNonNullItem = (
  ...errors: Array<string[] | string | null | undefined>
) => {
  const flattenArray = errors?.flat().filter((v) => v != null);

  return flattenArray != null && flattenArray.length > 0;
};
