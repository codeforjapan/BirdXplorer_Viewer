import { frontendTools } from "@assistant-ui/react-ai-sdk";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  type ToolSet,
  toUIMessageStream,
} from "ai";
import { createWorkersAI } from "workers-ai-provider";

import { SYSTEM_PROMPT } from "~/feature/chat/prompt";
import { getChatTools } from "~/feature/chat/tools.server";

export async function action({ request }: { request: Request }) {
  const { messages, system, tools } = (await request.json()) as {
    messages: unknown[];
    system?: string;
    tools?: unknown;
  };

  const workersai = createWorkersAI({
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
    apiKey: process.env.CLOUDFLARE_API_TOKEN ?? "",
  });

  const model = workersai(
    process.env.CLOUDFLARE_WORKERS_AI_MODEL ?? "@cf/openai/gpt-oss-120b",
  );

  const { tools: chatTools, instructions: mcpInstructions } =
    await getChatTools();

  // Append MCP server instructions (pagination rules, search constraints, etc.)
  // after the base system prompt so the model is aware of data constraints.
  const baseSystem = system ?? SYSTEM_PROMPT;
  const effectiveSystem = mcpInstructions
    ? `${baseSystem}\n\n## MCP サーバーからの補足情報\n${mcpInstructions}`
    : baseSystem;

  const result = streamText({
    model,
    system: effectiveSystem,
    messages: await convertToModelMessages(
      messages as Parameters<typeof convertToModelMessages>[0],
    ),
    tools: {
      ...(tools
        ? frontendTools(tools as Parameters<typeof frontendTools>[0])
        : {}),
      ...(chatTools as ToolSet),
    },
    maxOutputTokens: Number(process.env.CLOUDFLARE_MAX_OUTPUT_TOKENS ?? 8192),
    stopWhen: stepCountIs(12),
    onError: ({ error }) => {
      console.error("[api/chat] streamText error:", error);
    },
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (e) => (e instanceof Error ? e.message : String(e)),
    }),
  });
}
