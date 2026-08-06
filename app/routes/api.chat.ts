import { frontendTools } from "@assistant-ui/react-ai-sdk";
import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
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

  const chatTools = await getChatTools();

  const result = streamText({
    model,
    system: system ?? SYSTEM_PROMPT,
    messages: await convertToModelMessages(
      messages as Parameters<typeof convertToModelMessages>[0],
    ),
    tools: {
      ...(tools
        ? frontendTools(tools as Parameters<typeof frontendTools>[0])
        : {}),
      ...chatTools,
    },
    stopWhen: stepCountIs(6),
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
  });
}
