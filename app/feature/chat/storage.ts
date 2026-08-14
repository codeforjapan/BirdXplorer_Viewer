export interface ChatMeta {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

const INDEX_KEY = "bx.chats.index";

function messagesKey(chatId: string): string {
  return `bx.chats.${chatId}`;
}

export function listChats(): ChatMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ChatMeta[];
  } catch {
    return [];
  }
}

export function getChat(id: string): ChatMeta | null {
  return listChats().find((c) => c.id === id) ?? null;
}

function saveIndex(chats: ChatMeta[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(chats));
}

export function upsertChat(meta: ChatMeta): void {
  const chats = listChats();
  const idx = chats.findIndex((c) => c.id === meta.id);
  if (idx >= 0) {
    chats[idx] = meta;
  } else {
    chats.unshift(meta);
  }
  saveIndex(chats);
}

export function deleteChat(id: string): void {
  const chats = listChats().filter((c) => c.id !== id);
  saveIndex(chats);
  localStorage.removeItem(messagesKey(id));
}

export function loadMessages(chatId: string): unknown[] {
  try {
    const raw = localStorage.getItem(messagesKey(chatId));
    if (!raw) return [];
    return JSON.parse(raw) as unknown[];
  } catch {
    return [];
  }
}

export function saveMessages(chatId: string, messages: unknown[]): void {
  localStorage.setItem(messagesKey(chatId), JSON.stringify(messages));
}

export function deriveTitleFromMessages(messages: unknown[]): string {
  for (const msg of messages) {
    const m = msg as Record<string, unknown> | null | undefined;
    if (m?.role !== "user") continue;
    const parts = m.parts;
    if (Array.isArray(parts)) {
      for (const part of parts as Array<{ type?: string; text?: string }>) {
        if (part.type === "text" && typeof part.text === "string" && part.text.trim()) {
          return part.text.slice(0, 50);
        }
      }
    }
    if (typeof m.content === "string" && m.content.trim()) {
      return m.content.slice(0, 50);
    }
  }
  return "新しいチャット";
}
