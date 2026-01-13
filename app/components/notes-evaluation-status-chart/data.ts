import dayjs from "dayjs";

import type { NoteEvaluationData } from "~/components/graph";

export type NotesEvaluationStatusApiResponse = {
  data: NoteEvaluationData[];
  updatedAt: string;
};

/**
 * コミュニティーノートの評価状況グラフ用モックデータを生成
 * 元デザイン参考:
 * - 公開中（紫）: 左上に集中（helpfulが高く、notHelpfulが低い）
 * - 評価中（水色）: 左下〜中央に広く散らばる
 * - 非公開（青）: 右下付近（notHelpfulが高い）
 * - 一時公開（ピンク）: 中央付近に点在
 */
export const generateMockData = (): NoteEvaluationData[] => {
  const result: NoteEvaluationData[] = [];

  // 公開中（紫）- 左上に集中、helpfulが高くnotHelpfulが低い
  for (let i = 0; i < 25; i++) {
    result.push({
      noteId: `published-${i + 1}`,
      name: `公開中ノート${i + 1}`,
      notHelpful: Math.floor(Math.random() * 120) + 20,
      helpful: Math.floor(Math.random() * 800) + 1000,
      impressions: Math.floor(Math.random() * 50000000) + 20000000,
      status: "published",
    });
  }
  // 公開中で特に上部にあるもの
  for (let i = 0; i < 8; i++) {
    result.push({
      noteId: `published-top-${i + 1}`,
      name: `公開中ノート${26 + i}`,
      notHelpful: Math.floor(Math.random() * 80) + 30,
      helpful: Math.floor(Math.random() * 300) + 1700,
      impressions: Math.floor(Math.random() * 40000000) + 30000000,
      status: "published",
    });
  }

  // 評価中（水色）- 左下〜中央に広く散らばる
  // 左下に密集するグループ
  for (let i = 0; i < 40; i++) {
    result.push({
      noteId: `evaluating-dense-${i + 1}`,
      name: `評価中ノート${i + 1}`,
      notHelpful: Math.floor(Math.random() * 150) + 20,
      helpful: Math.floor(Math.random() * 600) + 100,
      impressions: Math.floor(Math.random() * 40000000) + 5000000,
      status: "evaluating",
    });
  }
  // 中央に散らばるグループ
  for (let i = 0; i < 20; i++) {
    result.push({
      noteId: `evaluating-mid-${i + 1}`,
      name: `評価中ノート${41 + i}`,
      notHelpful: Math.floor(Math.random() * 100) + 80,
      helpful: Math.floor(Math.random() * 500) + 800,
      impressions: Math.floor(Math.random() * 50000000) + 10000000,
      status: "evaluating",
    });
  }

  // 非公開（青）- 右側、notHelpfulが高い
  for (let i = 0; i < 12; i++) {
    result.push({
      noteId: `unpublished-${i + 1}`,
      name: `非公開ノート${i + 1}`,
      notHelpful: Math.floor(Math.random() * 200) + 250,
      helpful: Math.floor(Math.random() * 500) + 100,
      impressions: Math.floor(Math.random() * 40000000) + 10000000,
      status: "unpublished",
    });
  }
  // 非公開で右下にあるもの
  for (let i = 0; i < 5; i++) {
    result.push({
      noteId: `unpublished-right-${i + 1}`,
      name: `非公開ノート${13 + i}`,
      notHelpful: Math.floor(Math.random() * 100) + 400,
      helpful: Math.floor(Math.random() * 300) + 50,
      impressions: Math.floor(Math.random() * 30000000) + 15000000,
      status: "unpublished",
    });
  }

  // 一時公開（ピンク）- 中央付近に点在
  for (let i = 0; i < 15; i++) {
    result.push({
      noteId: `temporarilyPublished-${i + 1}`,
      name: `一時公開ノート${i + 1}`,
      notHelpful: Math.floor(Math.random() * 150) + 100,
      helpful: Math.floor(Math.random() * 600) + 600,
      impressions: Math.floor(Math.random() * 35000000) + 15000000,
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
