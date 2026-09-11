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
  vi,
} from "vitest";

// Reset the module cache between tests so each test gets a fresh MCP client
vi.mock("@ai-sdk/mcp", () => {
  const tools: Record<string, { description: string }> = {
    bx_topics_list: { description: "トピック一覧" },
    bx_notes_list: { description: "ノート一覧" },
    bx_posts_list: { description: "ポスト一覧" },
    bx_search: { description: "検索" },
    bx_search_keyword: { description: "キーワード検索" },
    bx_semantic_search: { description: "セマンティック検索" },
    bx_similar_notes: { description: "類似ノート" },
    bx_count: { description: "件数" },
    bx_note_requests: { description: "ノートリクエスト" },
    bx_note_requests_count: { description: "ノートリクエスト件数" },
    // Excluded tools
    bx_system_ping: { description: "ヘルスチェック" },
    bx_user_enrollment_get: { description: "エンロールメント" },
    bx_export_csv: { description: "CSV エクスポート" },
  };

  return {
    createMCPClient: vi.fn().mockResolvedValue({
      instructions: "テスト用 MCP 補足情報",
      tools: vi.fn().mockResolvedValue(tools),
      close: vi.fn(),
    }),
  };
});

// Must import AFTER the vi.mock so the mock is applied
import { getChatTools } from "./tools.server";

const MCP_URL = "https://birdxplorer-mcp.code4japan.org/mcp";

const server = setupServer(
  // MCP initialize
  http.post(MCP_URL, async ({ request }) => {
    const body = (await request.json()) as { method?: string };
    if (body.method === "initialize") {
      return new HttpResponse(
        `event: message\ndata: ${JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          result: {
            protocolVersion: "2025-06-18",
            capabilities: { tools: {} },
            serverInfo: { name: "test-mcp", version: "1.0.0" },
          },
        })}\n\n`,
        { status: 200, headers: { "Content-Type": "text/event-stream" } },
      );
    }
    return HttpResponse.json({});
  }),
);

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
  // Reset module-level cache between tests
  vi.resetModules();
});

afterAll(() => {
  server.close();
});

describe("getChatTools", () => {
  beforeEach(() => {
    vi.stubEnv("BIRDXPLORER_MCP_URL", MCP_URL);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns only the allowed tools (excludes ping, enrollment, csv)", async () => {
    const { tools } = await getChatTools();
    const names = Object.keys(tools).sort();
    expect(names).toEqual([
      "bx_count",
      "bx_note_requests",
      "bx_note_requests_count",
      "bx_notes_list",
      "bx_posts_list",
      "bx_search",
      "bx_search_keyword",
      "bx_semantic_search",
      "bx_similar_notes",
      "bx_topics_list",
    ]);
  });

  it("excludes bx_system_ping, bx_user_enrollment_get, bx_export_csv", async () => {
    const { tools } = await getChatTools();
    expect(tools).not.toHaveProperty("bx_system_ping");
    expect(tools).not.toHaveProperty("bx_user_enrollment_get");
    expect(tools).not.toHaveProperty("bx_export_csv");
  });

  it("returns instructions from MCP server", async () => {
    const { instructions } = await getChatTools();
    expect(instructions).toBe("テスト用 MCP 補足情報");
  });
});
