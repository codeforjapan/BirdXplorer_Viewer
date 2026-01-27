import dayjs from "dayjs";

import type { NoteEvaluationData } from "~/components/graph";

export type NotesEvaluationStatusApiResponse = {
  data: NoteEvaluationData[];
  updatedAt: string;
};

export const generateMockData = (): NoteEvaluationData[] => {
  const result: NoteEvaluationData[] = [];

  for (let i = 0; i < 16; i++) {
    result.push({
      noteId: `published-${i + 1}`,
      name: `公開中ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 800) + 800,
      notHelpful: Math.floor(Math.random() * 100) + 20,
      impressions: Math.floor(Math.random() * 15000000) + 5000000,
      status: "published",
    });
  }

  for (let i = 0; i < 10; i++) {
    result.push({
      noteId: `evaluating-${i + 1}`,
      name: `評価中ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 500) + 150,
      notHelpful: Math.floor(Math.random() * 300) + 80,
      impressions: Math.floor(Math.random() * 13000000) + 7000000,
      status: "evaluating",
    });
  }

  for (let i = 0; i < 4; i++) {
    result.push({
      noteId: `unpublished-${i + 1}`,
      name: `非公開ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 200) + 40,
      notHelpful: Math.floor(Math.random() * 300) + 200,
      impressions: Math.floor(Math.random() * 4000000) + 1000000,
      status: "unpublished",
    });
  }

  for (let i = 0; i < 6; i++) {
    result.push({
      noteId: `temporarilyPublished-${i + 1}`,
      name: `一時公開ノート${i + 1}`,
      helpful: Math.floor(Math.random() * 450) + 200,
      notHelpful: Math.floor(Math.random() * 200) + 100,
      impressions: Math.floor(Math.random() * 16000000) + 10000000,
      status: "temporarilyPublished",
    });
  }

  return result;
};

export const createMockResponse = (): NotesEvaluationStatusApiResponse => {
  return {
    data: generateMockData(),
    updatedAt: dayjs().format("YYYY-MM-DD"),
  };
};
