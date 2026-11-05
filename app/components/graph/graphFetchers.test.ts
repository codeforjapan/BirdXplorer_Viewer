import { describe, expect, it, vi } from "vitest";

import { safeGraphFetch, safeGraphFetchWithMarkers } from "./graphFetchers";

const failure = (
  kind: "network" | "validation" | "server" | "parse",
  status?: number,
) => ({
  ok: false as const,
  error: { kind, message: "x", status },
});
const success = { ok: true as const, data: [], updatedAt: "2026-11-05" };

describe("safeGraphFetch", () => {
  it("server エラーの後に成功したら成功を返す", async () => {
    const action = vi
      .fn()
      .mockResolvedValueOnce(failure("server", 503))
      .mockResolvedValueOnce(success);
    await expect(safeGraphFetch(action)).resolves.toMatchObject({ ok: true });
    expect(action).toHaveBeenCalledTimes(2);
  });

  it("2回とも server エラーなら2回目の結果を返し、3回目は呼ばない", async () => {
    const second = { ok: false, error: { kind: "server", message: "second" } };
    const action = vi
      .fn()
      .mockResolvedValueOnce(failure("server", 503))
      .mockResolvedValue(second);
    await expect(safeGraphFetch(action)).resolves.toEqual(second);
    expect(action).toHaveBeenCalledTimes(2);
  });

  it.each([404, 401, 403, 429])(
    "server エラーでも %i は再試行しない",
    async (status) => {
      const action = vi.fn().mockResolvedValue(failure("server", status));
      await expect(safeGraphFetch(action)).resolves.toMatchObject({
        ok: false,
      });
      expect(action).toHaveBeenCalledTimes(1);
    },
  );

  it("status が不明な server エラーは再試行しない", async () => {
    const action = vi.fn().mockResolvedValue(failure("server"));
    await safeGraphFetch(action);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("network エラーは1回再試行する", async () => {
    const action = vi
      .fn()
      .mockResolvedValueOnce(failure("network"))
      .mockResolvedValueOnce(success);
    await expect(safeGraphFetch(action)).resolves.toMatchObject({ ok: true });
    expect(action).toHaveBeenCalledTimes(2);
  });

  it.each(["validation", "parse"] as const)(
    "%s エラーは再試行しない",
    async (kind) => {
      const action = vi.fn().mockResolvedValue(failure(kind));
      await expect(safeGraphFetch(action)).resolves.toMatchObject({
        ok: false,
      });
      expect(action).toHaveBeenCalledTimes(1);
    },
  );

  it("例外の後に成功したら成功を返す", async () => {
    const action = vi
      .fn()
      .mockRejectedValueOnce(new Error("boom"))
      .mockResolvedValueOnce(success);
    await expect(safeGraphFetch(action)).resolves.toMatchObject({ ok: true });
    expect(action).toHaveBeenCalledTimes(2);
  });

  it("例外が2回続いたら network エラーを返し、3回目は呼ばない", async () => {
    const action = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(safeGraphFetch(action)).resolves.toMatchObject({
      ok: false,
      error: { kind: "network" },
    });
    expect(action).toHaveBeenCalledTimes(2);
  });
});

describe("safeGraphFetchWithMarkers", () => {
  it("server エラーを1回再試行する", async () => {
    const action = vi
      .fn()
      .mockResolvedValueOnce(failure("server", 503))
      .mockResolvedValueOnce({ ...success, eventMarkers: [] });
    await expect(safeGraphFetchWithMarkers(action)).resolves.toMatchObject({
      ok: true,
    });
    expect(action).toHaveBeenCalledTimes(2);
  });

  it("404 は再試行しない", async () => {
    const action = vi.fn().mockResolvedValue(failure("server", 404));
    await safeGraphFetchWithMarkers(action);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("validation エラーは再試行しない", async () => {
    const action = vi.fn().mockResolvedValue(failure("validation"));
    await safeGraphFetchWithMarkers(action);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("例外が2回続いたら network エラーを返す", async () => {
    const action = vi.fn().mockRejectedValue(new Error("boom"));
    await expect(safeGraphFetchWithMarkers(action)).resolves.toMatchObject({
      ok: false,
      error: { kind: "network" },
    });
    expect(action).toHaveBeenCalledTimes(2);
  });
});
