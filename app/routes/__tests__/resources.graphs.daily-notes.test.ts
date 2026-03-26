import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";

import { graphCache } from "~/utils/graphCache";

import dailyNotesFixture from "../../../test/fixtures/graph/daily-notes.json";
import type { Route } from "../+types/resources.graphs.daily-notes";
import { loader } from "../resources.graphs.daily-notes";

const server = setupServer();

const createArgs = (url: string): Route.LoaderArgs =>
  ({ request: new Request(url) }) as Route.LoaderArgs;

describe("resources.graphs.daily-notes loader", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  let callCount = 0;

  beforeAll(() => {
    process.env.NODE_ENV = "production";
    server.listen({ onUnhandledRequest: "error" });
  });

  beforeEach(() => {
    callCount = 0;
    graphCache.clear();
    server.use(
      http.get("*/api/v1/graphs/daily-notes", () => {
        callCount += 1;
        return HttpResponse.json(dailyNotesFixture, { status: 200 });
      }),
    );
  });

  afterEach(() => {
    server.resetHandlers();
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
    server.close();
  });

  it("returns API data and caches responses", async () => {
    const url =
      "http://localhost/resources/graphs/daily-notes?period=1month&status=all";

    const first = await loader(createArgs(url));
    expect(first.ok).toBe(true);
    if (first.ok) {
      expect(first.data.length).toBe(1);
    }
    expect(callCount).toBe(1);

    const second = await loader(createArgs(url));
    expect(second.ok).toBe(true);
    expect(callCount).toBe(1);
  });

  it("returns server error when API returns 500", async () => {
    server.use(
      http.get("*/api/v1/graphs/daily-notes", () => {
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    const url =
      "http://localhost/resources/graphs/daily-notes?period=1month&status=all";
    const result = await loader(createArgs(url));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("server");
    }
  });

  it("returns validation error when API returns 422", async () => {
    server.use(
      http.get("*/api/v1/graphs/daily-notes", () => {
        return HttpResponse.json(
          {
            detail: [
              { msg: "Invalid period format" },
              { msg: "Status is required" },
            ],
          },
          { status: 422 },
        );
      }),
    );

    const url =
      "http://localhost/resources/graphs/daily-notes?period=invalid&status=all";
    const result = await loader(createArgs(url));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("validation");
      expect(result.error.issues).toContain("Invalid period format");
      expect(result.error.issues).toContain("Status is required");
    }
  });

  it("returns validation error when API returns 400", async () => {
    server.use(
      http.get("*/api/v1/graphs/daily-notes", () => {
        return HttpResponse.json({ detail: ["Bad request"] }, { status: 400 });
      }),
    );

    const url =
      "http://localhost/resources/graphs/daily-notes?period=1month&status=all";
    const result = await loader(createArgs(url));

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe("validation");
    }
  });

  it("does not cache error responses", async () => {
    server.use(
      http.get("*/api/v1/graphs/daily-notes", () => {
        callCount += 1;
        return HttpResponse.json(
          { message: "Internal Server Error" },
          { status: 500 },
        );
      }),
    );

    const url =
      "http://localhost/resources/graphs/daily-notes?period=1month&status=all";

    const first = await loader(createArgs(url));
    expect(first.ok).toBe(false);
    expect(callCount).toBe(1);

    // エラーはキャッシュされないので、再度APIが呼ばれる
    const second = await loader(createArgs(url));
    expect(second.ok).toBe(false);
    expect(callCount).toBe(2);
  });

  it("uses separate cache for different parameters", async () => {
    const url1 =
      "http://localhost/resources/graphs/daily-notes?period=1month&status=all";
    const url2 =
      "http://localhost/resources/graphs/daily-notes?period=3months&status=all";

    await loader(createArgs(url1));
    expect(callCount).toBe(1);

    // 異なるパラメータではキャッシュミス
    await loader(createArgs(url2));
    expect(callCount).toBe(2);

    // 同じパラメータではキャッシュヒット
    await loader(createArgs(url1));
    expect(callCount).toBe(2);
  });
});
