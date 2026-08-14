/* eslint-disable react-refresh/only-export-components */
import { type UIMessage, useChat } from "@ai-sdk/react";
import {
  ArrowLeftIcon,
  MessageSquareIcon,
  SendIcon,
  SquareIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";

import { WEB_PATHS } from "~/constants/paths";
import {
  deriveTitleFromMessages,
  getChat,
  loadMessages,
  saveMessages,
  upsertChat,
} from "~/feature/chat/storage";

export function clientLoader({ params }: { params: { id?: string } }) {
  return { id: params.id ?? "" };
}

export function HydrateFallback() {
  return (
    <div className="flex h-dvh items-center justify-center bg-black">
      <span className="text-sm text-white/50">読み込み中...</span>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .filter((p) => p.type === "text")
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  if (!text) return null;

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "rounded-tr-sm bg-blue-600 text-white"
            : "rounded-tl-sm bg-gray-800 text-gray-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

function WelcomeScreen() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <MessageSquareIcon className="text-blue-500/60" size={48} />
      <h2 className="text-2xl font-semibold text-white">何かお困りですか？</h2>
      <p className="max-w-sm text-sm text-gray-400">
        コミュニティノートの検索や統計情報をお手伝いします
      </p>
    </div>
  );
}

function ChatSession({ id }: { id: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    id,
    api: "/api/chat",
    initialMessages: loadMessages(id) as UIMessage[],
  });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (status !== "ready" && status !== "error") return;
    if (messages.length === 0) return;
    saveMessages(id, messages);
    const existing = getChat(id);
    const title =
      existing?.title && existing.title !== "新しいチャット"
        ? existing.title
        : deriveTitleFromMessages(messages);
    upsertChat({
      id,
      title,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [id, messages, status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;
    setInput("");
    void sendMessage({ text });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <WelcomeScreen />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isStreaming && (
              <div className="mb-4 flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-gray-800 px-4 py-3">
                  <div className="flex gap-1">
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-gray-800 p-4">
        <div className="flex items-end gap-2">
          <textarea
            className="flex-1 resize-none rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            disabled={isStreaming}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="メッセージを入力…（Shift+Enterで改行）"
            rows={1}
            style={{ maxHeight: "120px", overflowY: "auto" }}
            value={input}
          />
          {isStreaming ? (
            <button
              aria-label="生成を停止"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition-colors hover:bg-red-500"
              onClick={stop}
              type="button"
            >
              <SquareIcon size={16} />
            </button>
          ) : (
            <button
              aria-label="送信"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-colors hover:bg-blue-500 disabled:opacity-40"
              disabled={!input.trim()}
              onClick={handleSend}
              type="button"
            >
              <SendIcon size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ChatsDetailPage({
  loaderData,
}: {
  loaderData: { id: string };
}) {
  const params = useParams();
  const id = params.id ?? loaderData.id;

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black text-white">
      <header className="flex shrink-0 items-center gap-3 border-b border-gray-800 px-4 py-3">
        <Link
          aria-label="チャット一覧に戻る"
          className="rounded p-1 text-white/50 transition-colors hover:text-white"
          to={WEB_PATHS.chats.index}
        >
          <ArrowLeftIcon size={18} />
        </Link>
        <div className="flex items-center gap-2">
          <MessageSquareIcon className="text-blue-500" size={16} />
          <span className="text-sm font-semibold text-white">偽情報検索</span>
        </div>
      </header>

      <ChatSession id={id} key={id} />
    </div>
  );
}
