export type GraphDataSource = "api" | "mock";

const getGraphDataSource = (): GraphDataSource => {
  return "mock";
};

export const GRAPH_DATA_SOURCE: GraphDataSource = getGraphDataSource();

const isProductionEnv = (): boolean => {
  if (typeof import.meta !== "undefined") {
    const viteProd = import.meta.env?.PROD;
    if (viteProd === true) return true;
  }
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NODE_ENV === "production") return true;
  }
  return false;
};

export const isGraphMockEnabled = (): boolean =>
  GRAPH_DATA_SOURCE === "mock" && !isProductionEnv();
