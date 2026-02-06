import type { ZodSchema } from "zod";

import { DEFAULT_GRAPH_ERROR_MESSAGES } from "./constants";
import type { EventMarker } from "./types";

export type GraphApiErrorKind = "network" | "validation" | "server" | "parse";

export type GraphApiError = {
  kind: GraphApiErrorKind;
  message: string;
  issues?: string[];
  status?: number;
};

export type GraphFetchResult<T> =
  | { ok: true; data: T; updatedAt: string }
  | { ok: false; error: GraphApiError };

export type GraphFetchResultWithMarkers<T> =
  | { ok: true; data: T; updatedAt: string; eventMarkers: EventMarker[] }
  | { ok: false; error: GraphApiError };

const buildGraphApiError = ({
  kind,
  message,
  issues,
  status,
}: {
  kind: GraphApiErrorKind;
  message?: string;
  issues?: string[];
  status?: number;
}): GraphApiError => {
  return {
    kind,
    message: message ?? DEFAULT_GRAPH_ERROR_MESSAGES[kind],
    issues,
    status,
  };
};

const extractValidationIssues = (data: unknown): string[] | undefined => {
  if (!data || typeof data !== "object") return undefined;
  if (!("detail" in data)) return undefined;

  const detail = (data as { detail?: unknown }).detail;
  if (!Array.isArray(detail)) return undefined;

  const issues = detail
    .map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object" && "msg" in item) {
        const message = (item as { msg?: unknown }).msg;
        return typeof message === "string" ? message : undefined;
      }
      return undefined;
    })
    .filter((item): item is string => Boolean(item));

  return issues.length ? issues : undefined;
};

export const toGraphApiErrorFromStatus = (
  status: number,
  data?: unknown
): GraphApiError => {
  if (status === 400 || status === 422) {
    return buildGraphApiError({
      kind: "validation",
      status,
      issues: extractValidationIssues(data),
    });
  }

  return buildGraphApiError({ kind: "server", status });
};

export const parseGraphListResponse = <T,>(
  response: { status: number; data: unknown },
  schema: ZodSchema<{ data: T[]; updatedAt: string }>
): GraphFetchResult<T[]> => {
  if (response.status >= 200 && response.status < 300) {
    const parsed = schema.safeParse(response.data);
    if (!parsed.success) {
      return {
        ok: false,
        error: buildGraphApiError({
          kind: "parse",
          issues: parsed.error.issues.map((issue) => issue.message),
        }),
      };
    }

    return {
      ok: true,
      data: parsed.data.data,
      updatedAt: parsed.data.updatedAt,
    };
  }

  return { ok: false, error: toGraphApiErrorFromStatus(response.status, response.data) };
};

export const fetchGraphList = async <T,>(
  fetcher: () => Promise<{ status: number; data: unknown }>,
  schema: ZodSchema<{ data: T[]; updatedAt: string }>
): Promise<GraphFetchResult<T[]>> => {
  try {
    const response = await fetcher();
    return parseGraphListResponse(response, schema);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return { ok: false, error: buildGraphApiError({ kind: "network", message }) };
  }
};
