import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  deleteChat,
  deriveTitleFromMessages,
  getChat,
  listChats,
  loadMessages,
  saveMessages,
  upsertChat,
} from "./storage";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe("listChats / upsertChat / deleteChat", () => {
  it("returns empty array initially", () => {
    expect(listChats()).toEqual([]);
  });

  it("inserts a chat and lists it", () => {
    upsertChat({
      id: "a",
      title: "テスト",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    });
    const chats = listChats();
    expect(chats).toHaveLength(1);
    expect(chats[0]?.id).toBe("a");
    expect(chats[0]?.title).toBe("テスト");
  });

  it("updates an existing chat by id", () => {
    const base = {
      id: "a",
      title: "old",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    };
    upsertChat(base);
    upsertChat({
      ...base,
      title: "new",
      updatedAt: "2025-01-02T00:00:00.000Z",
    });
    const chats = listChats();
    expect(chats).toHaveLength(1);
    expect(chats[0]?.title).toBe("new");
  });

  it("deletes a chat", () => {
    upsertChat({
      id: "a",
      title: "テスト",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    });
    deleteChat("a");
    expect(listChats()).toHaveLength(0);
  });

  it("getChat returns null for unknown id", () => {
    expect(getChat("unknown")).toBeNull();
  });
});

describe("loadMessages / saveMessages", () => {
  it("returns empty array for new chat", () => {
    expect(loadMessages("new-chat")).toEqual([]);
  });

  it("saves and loads messages", () => {
    const messages = [
      { id: "msg1", role: "user", parts: [{ type: "text", text: "hi" }] },
    ];
    saveMessages("chat1", messages);
    const loaded = loadMessages("chat1");
    expect(loaded).toHaveLength(1);
    expect((loaded[0] as { id: string }).id).toBe("msg1");
  });

  it("overwrites on repeated saves", () => {
    saveMessages("chat1", [
      { id: "msg1", role: "user", parts: [{ type: "text", text: "first" }] },
    ]);
    saveMessages("chat1", [
      { id: "msg1", role: "user", parts: [{ type: "text", text: "updated" }] },
      { id: "msg2", role: "assistant", parts: [{ type: "text", text: "ok" }] },
    ]);
    const loaded = loadMessages("chat1");
    expect(loaded).toHaveLength(2);
  });

  it("deleteChat also removes messages", () => {
    saveMessages("chat1", [
      { id: "msg1", role: "user", parts: [{ type: "text", text: "hi" }] },
    ]);
    upsertChat({
      id: "chat1",
      title: "t",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    });
    deleteChat("chat1");
    expect(loadMessages("chat1")).toEqual([]);
    expect(listChats()).toHaveLength(0);
  });
});

describe("deriveTitleFromMessages", () => {
  it("returns fallback for empty messages", () => {
    expect(deriveTitleFromMessages([])).toBe("新しいチャット");
  });

  it("extracts text part from user message", () => {
    const messages = [
      {
        id: "m1",
        role: "user",
        parts: [{ type: "text", text: "コミュニティノートについて教えて" }],
      },
    ];
    expect(deriveTitleFromMessages(messages)).toBe(
      "コミュニティノートについて教えて",
    );
  });

  it("truncates long titles", () => {
    const longText = "あ".repeat(100);
    const messages = [
      {
        id: "m1",
        role: "user",
        parts: [{ type: "text", text: longText }],
      },
    ];
    expect(deriveTitleFromMessages(messages).length).toBeLessThanOrEqual(50);
  });

  it("skips assistant messages", () => {
    const messages = [
      { id: "m1", role: "assistant", parts: [{ type: "text", text: "I'm the AI" }] },
      { id: "m2", role: "user", parts: [{ type: "text", text: "user first message" }] },
    ];
    expect(deriveTitleFromMessages(messages)).toBe("user first message");
  });
});
