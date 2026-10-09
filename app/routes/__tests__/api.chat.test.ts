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

import { action } from "../api.chat";

// Mock the MCP tools so we don't hit the real MCP server in unit tests
vi.mock("~/feature/chat/tools.server", () => ({
  getChatTools: vi.fn().mockResolvedValue({
    tools: {},
    instructions: undefined,
  }),
}));

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });
});

afterEach(() => {
  server.resetHandlers();
  vi.clearAllMocks();
});

afterAll(() => {
  server.close();
});

describe("action /api/chat", () => {
  beforeEach(() => {
    vi.stubEnv("CLOUDFLARE_ACCOUNT_ID", "test-account");
    vi.stubEnv("CLOUDFLARE_API_TOKEN", "test-token");
    vi.stubEnv("CLOUDFLARE_WORKERS_AI_MODEL", "@cf/openai/gpt-oss-120b");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 200 streaming response for valid messages", async () => {
    const workersMock = http.post(
      "https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/*",
      () =>
        new HttpResponse(
          new ReadableStream({
            start(controller) {
              const encoder = new TextEncoder();
              controller.enqueue(
                encoder.encode(
                  'data: {"type":"text-delta","textDelta":"Hello!"}\n\n',
                ),
              );
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            },
          }),
          {
            status: 200,
            headers: { "Content-Type": "text/event-stream" },
          },
        ),
    );
    server.use(workersMock);

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            id: "msg1",
            role: "user",
            parts: [{ type: "text", text: "Hello" }],
          },
        ],
      }),
    });

    const response = await action({ request: req });
    expect(response.status).toBe(200);
  });

  it("returns a streaming response even when messages is empty array", async () => {
    const workersMock = http.post(
      "https://api.cloudflare.com/client/v4/accounts/test-account/ai/run/*",
      () =>
        new HttpResponse(
          new ReadableStream({
            start(controller) {
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              controller.close();
            },
          }),
          { status: 200, headers: { "Content-Type": "text/event-stream" } },
        ),
    );
    server.use(workersMock);

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });

    const response = await action({ request: req });
    expect(response.status).toBe(200);
  });
});
