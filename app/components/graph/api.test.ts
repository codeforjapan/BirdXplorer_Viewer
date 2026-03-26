import { describe, expect, it } from "vitest";
import { z } from "zod";

import {
  fetchGraphList,
  parseGraphListResponse,
  toGraphApiErrorFromStatus,
} from "./api";

describe("parseGraphListResponse", () => {
  const schema = z.object({
    data: z.array(z.object({ value: z.number() })),
    updatedAt: z.string(),
  });

  it("returns ok on valid payload", () => {
    const result = parseGraphListResponse(
      {
        status: 200,
        data: { data: [{ value: 1 }], updatedAt: "2025-01-01" },
      },
      schema,
    );

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([{ value: 1 }]);
      expect(result.updatedAt).toBe("2025-01-01");
    }
  });

  it("returns parse error when schema fails", () => {
    const result = parseGraphListResponse(
      { status: 200, data: { data: [{ value: "bad" }], updatedAt: 123 } },
      schema,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("parse");
    }
  });

  it("returns validation error for 422 with issues", () => {
    const result = parseGraphListResponse(
      {
        status: 422,
        data: { detail: [{ msg: "Invalid period" }, "Missing status"] },
      },
      schema,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("validation");
      expect(result.error.issues).toEqual(["Invalid period", "Missing status"]);
    }
  });

  it("returns server error for non-2xx non-422", () => {
    const result = parseGraphListResponse(
      { status: 500, data: { message: "boom" } },
      schema,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("server");
    }
  });
});

describe("fetchGraphList", () => {
  const schema = z.object({
    data: z.array(z.object({ value: z.number() })),
    updatedAt: z.string(),
  });

  it("returns ok when fetcher succeeds with valid data", async () => {
    const fetcher = async () =>
      Promise.resolve({
        status: 200,
        data: { data: [{ value: 42 }], updatedAt: "2025-01-15" },
      });

    const result = await fetchGraphList(fetcher, schema);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual([{ value: 42 }]);
      expect(result.updatedAt).toBe("2025-01-15");
    }
  });

  it("returns network error when fetcher throws Error", async () => {
    const fetcher = async () => Promise.reject(new Error("Connection refused"));

    const result = await fetchGraphList(fetcher, schema);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("network");
      expect(result.error.message).toContain("Connection refused");
    }
  });

  it("returns network error with default message when fetcher throws non-Error", async () => {
    const nonError: Error = { name: "NonError", message: "unknown error" };
    const fetcher = async () => Promise.reject(nonError);

    const result = await fetchGraphList(fetcher, schema);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("network");
      // デフォルトメッセージが使われる
      expect(result.error.message).toBeTruthy();
    }
  });

  it("returns server error when fetcher returns 500", async () => {
    const fetcher = async () =>
      Promise.resolve({
        status: 500,
        data: { message: "Internal Server Error" },
      });

    const result = await fetchGraphList(fetcher, schema);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("server");
      expect(result.error.status).toBe(500);
    }
  });

  it("returns parse error when response data is invalid", async () => {
    const fetcher = async () =>
      Promise.resolve({
        status: 200,
        data: { data: "not an array", updatedAt: 12345 },
      });

    const result = await fetchGraphList(fetcher, schema);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("parse");
    }
  });
});

describe("toGraphApiErrorFromStatus", () => {
  it("returns validation error for status 400", () => {
    const error = toGraphApiErrorFromStatus(400, {
      detail: ["Bad request parameter"],
    });

    expect(error.kind).toBe("validation");
    expect(error.status).toBe(400);
    expect(error.issues).toContain("Bad request parameter");
  });

  it("returns validation error for status 422 with msg objects", () => {
    const error = toGraphApiErrorFromStatus(422, {
      detail: [{ msg: "Invalid period" }, { msg: "Missing status" }],
    });

    expect(error.kind).toBe("validation");
    expect(error.status).toBe(422);
    expect(error.issues).toEqual(["Invalid period", "Missing status"]);
  });

  it("returns validation error for status 422 with mixed detail types", () => {
    const error = toGraphApiErrorFromStatus(422, {
      detail: [{ msg: "Error 1" }, "Error 2", { other: "ignored" }],
    });

    expect(error.kind).toBe("validation");
    expect(error.issues).toEqual(["Error 1", "Error 2"]);
  });

  it("returns server error for status 500", () => {
    const error = toGraphApiErrorFromStatus(500);

    expect(error.kind).toBe("server");
    expect(error.status).toBe(500);
  });

  it("returns server error for status 503", () => {
    const error = toGraphApiErrorFromStatus(503);

    expect(error.kind).toBe("server");
    expect(error.status).toBe(503);
  });

  it("returns validation error without issues when detail is not array", () => {
    const error = toGraphApiErrorFromStatus(422, {
      detail: "Not an array",
    });

    expect(error.kind).toBe("validation");
    expect(error.issues).toBeUndefined();
  });

  it("returns validation error without issues when data is null", () => {
    const error = toGraphApiErrorFromStatus(422, null);

    expect(error.kind).toBe("validation");
    expect(error.issues).toBeUndefined();
  });
});
