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

import { getChatTools } from "./tools.server";

const API_BASE = "https://dev.api-birdxplorer.code4japan.org";

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

describe("getChatTools", () => {
  it("returns the four expected tools", async () => {
    const tools = await getChatTools();
    expect(Object.keys(tools).sort()).toEqual([
      "count_notes",
      "get_daily_notes_stats",
      "list_topics",
      "search_notes",
    ]);
  });
});

describe("list_topics tool", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE}/api/v1/data/topics`, () =>
        HttpResponse.json({
          data: [
            {
              topicId: 1,
              label: { ja: "政治", en: "Politics" },
              referenceCount: 100,
            },
            {
              topicId: 2,
              label: { ja: "科学", en: "Science" },
              referenceCount: 50,
            },
          ],
        }),
      ),
    );
  });

  it("returns mapped topic list", async () => {
    const tools = await getChatTools();
    const result = await (
      tools.list_topics as unknown as { execute: () => Promise<unknown> }
    ).execute();
    expect(result).toEqual([
      { id: 1, label_ja: "政治", label_en: "Politics", noteCount: 100 },
      { id: 2, label_ja: "科学", label_en: "Science", noteCount: 50 },
    ]);
  });
});

describe("count_notes tool", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE}/api/v1/data/search/count`, () =>
        HttpResponse.json({ total: 42 }),
      ),
    );
  });

  it("returns count", async () => {
    const tools = await getChatTools();
    const result = await (
      tools.count_notes as unknown as {
        execute: (args: Record<string, unknown>) => Promise<unknown>;
      }
    ).execute({});
    expect(result).toEqual({ total: 42 });
  });
});

describe("search_notes tool", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE}/api/v1/data/search`, () =>
        HttpResponse.json({
          data: [
            {
              noteId: "1234567890123456789",
              summary: "これはテストノートです",
              language: "ja",
              topics: [{ topicId: 1, label: { ja: "政治" } }],
              currentStatus: "CURRENTLY_RATED_HELPFUL",
              createdAt: 1700000000000,
              helpfulCount: 10,
              notHelpfulCount: 1,
              rateCount: 11,
              post: { text: "テストツイート" },
            },
          ],
          meta: { total: 1 },
        }),
      ),
    );
  });

  it("returns mapped notes", async () => {
    const tools = await getChatTools();
    const result = await (
      tools.search_notes as unknown as {
        execute: (
          args: Record<string, unknown>,
        ) => Promise<{ total?: number; notes: unknown[] }>;
      }
    ).execute({ limit: 10 });
    expect(result.total).toBe(1);
    expect(result.notes).toHaveLength(1);
    const note = result.notes[0] as {
      noteId: string;
      language: string;
      status: string;
    };
    expect(note.noteId).toBe("1234567890123456789");
    expect(note.language).toBe("ja");
    expect(note.status).toBe("CURRENTLY_RATED_HELPFUL");
  });
});

describe("get_daily_notes_stats tool", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE}/api/v1/graphs/daily-notes`, () =>
        HttpResponse.json({
          data: [
            {
              date: "2025-01-01",
              published: 5,
              evaluating: 3,
              unpublished: 1,
              temporarilyPublished: 0,
            },
          ],
          updatedAt: "2025-01-02",
        }),
      ),
    );
  });

  it("returns daily stats with total", async () => {
    const tools = await getChatTools();
    const result = await (
      tools.get_daily_notes_stats as unknown as {
        execute: (args: Record<string, unknown>) => Promise<{
          updatedAt: string;
          items: Array<{ date: string; total: number }>;
        }>;
      }
    ).execute({ start_date: 1700000000000, end_date: 1702592000000 });
    expect(result.updatedAt).toBe("2025-01-02");
    expect(result.items).toHaveLength(1);
    expect(result.items[0]?.total).toBe(9);
  });
});
