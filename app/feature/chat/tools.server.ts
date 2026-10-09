import { createMCPClient } from "@ai-sdk/mcp";

const MCP_URL =
  process.env.BIRDXPLORER_MCP_URL ??
  "https://birdxplorer-mcp.code4japan.org/mcp";

/**
 * Tools exposed to the LLM. Excludes:
 *   bx_system_ping        - health-check only, not useful in conversation
 *   bx_user_enrollment_get - reveals personal participant data
 *   bx_export_csv          - generates large file downloads
 */
const ALLOWED_TOOLS = new Set([
  "bx_topics_list",
  "bx_notes_list",
  "bx_posts_list",
  "bx_search",
  "bx_search_keyword",
  "bx_semantic_search",
  "bx_similar_notes",
  "bx_count",
  "bx_note_requests",
  "bx_note_requests_count",
]);

// Module-level cache so that warm invocations on the same server process
// skip the initialize + tools/list round-trips.
let cachedTools: Record<string, unknown> | null = null;
let cachedInstructions: string | undefined;
let mcpClient: Awaited<ReturnType<typeof createMCPClient>> | null = null;

export async function getChatTools(): Promise<{
  tools: Record<string, unknown>;
  instructions: string | undefined;
}> {
  if (cachedTools) {
    return { tools: cachedTools, instructions: cachedInstructions };
  }

  try {
    mcpClient = await createMCPClient({
      transport: {
        type: "http",
        url: MCP_URL,
      },
    });

    cachedInstructions = mcpClient.instructions ?? undefined;

    const allTools = (await mcpClient.tools()) as Record<string, unknown>;

    // Filter to allow-list only
    cachedTools = Object.fromEntries(
      Object.entries(allTools).filter(([name]) => ALLOWED_TOOLS.has(name)),
    );

    return { tools: cachedTools, instructions: cachedInstructions };
  } catch (err) {
    console.error("[tools.server] Failed to initialize MCP client:", err);
    // Return empty tools on failure rather than crashing the request
    return { tools: {}, instructions: undefined };
  }
}
