/* eslint-disable react-refresh/only-export-components */
import { MessageSquareIcon, PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";

import { WEB_PATHS } from "~/constants/paths";
import { type ChatMeta, deleteChat, listChats } from "~/feature/chat/storage";

export function clientLoader() {
  const chats = listChats();
  return { chats };
}

export function HydrateFallback() {
  return (
    <div className="flex h-dvh items-center justify-center bg-black">
      <span className="text-body-l text-white/50">読み込み中...</span>
    </div>
  );
}

export default function ChatsIndexPage({
  loaderData,
}: {
  loaderData: { chats: ChatMeta[] };
}) {
  const navigate = useNavigate();
  const { chats } = loaderData;

  function handleNewChat() {
    const id = crypto.randomUUID();
    void navigate(WEB_PATHS.chats.show.replace(":id", id));
  }

  function handleDelete(e: React.MouseEvent, id: string) {
    e.preventDefault();
    e.stopPropagation();
    deleteChat(id);
    window.location.reload();
  }

  return (
    <div className="flex h-dvh flex-col bg-black text-white">
      <header className="flex items-center justify-between border-b border-gray-2 px-6 py-4">
        <div className="flex items-center gap-3">
          <MessageSquareIcon className="text-primary" size={20} />
          <h1 className="text-heading-m text-white">偽情報検索</h1>
        </div>
        <button
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-80"
          onClick={handleNewChat}
          type="button"
        >
          <PlusIcon size={16} />
          新しいチャット
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-body-l text-white/70">
            {chats.length > 0
              ? `${String(chats.length)} 件のチャット`
              : "チャット履歴はありません"}
          </p>

          {chats.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-2 bg-gray-1 py-16">
              <MessageSquareIcon className="text-white/30" size={48} />
              <p className="text-body-l text-white/50">
                「新しいチャット」ボタンを押して開始してください
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <a
                    className="group flex items-center justify-between rounded-lg border border-gray-2 bg-gray-1 px-4 py-3 transition-colors hover:border-gray-3"
                    href={WEB_PATHS.chats.show.replace(":id", chat.id)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-body-l-bold truncate text-white">
                        {chat.title}
                      </p>
                      <p className="text-body-m mt-0.5 text-white/50">
                        {new Date(chat.updatedAt).toLocaleString("ja-JP")}
                      </p>
                    </div>
                    <button
                      aria-label="チャットを削除"
                      className="ml-3 shrink-0 rounded p-1 text-white/30 opacity-0 transition-all group-hover:opacity-100 hover:text-red"
                      onClick={(e) => {
                        handleDelete(e, chat.id);
                      }}
                      type="button"
                    >
                      ✕
                    </button>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
