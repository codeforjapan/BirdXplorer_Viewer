export const getArrayMax = (values: number[], fallback = 0): number => {
  return values.length ? Math.max(...values) : fallback;
};

export const getArrayMin = (values: number[], fallback = 0): number => {
  return values.length ? Math.min(...values) : fallback;
};

export const getArrayMinMax = (
  values: number[],
  fallback = 0
): { min: number; max: number } => {
  if (!values.length) {
    return { min: fallback, max: fallback };
  }
  return { min: Math.min(...values), max: Math.max(...values) };
};
