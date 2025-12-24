import dayjs from "dayjs";

import type { PostInfluenceData } from "~/components/graph";

export type PostInfluenceApiResponse = {
  data: PostInfluenceData[];
  updatedAt: string;
};

/**
 * ポストの影響力グラフ用モックデータを生成
 * 元デザイン参考:
 * - 公開中（紫）: 左下に密集、一部は評価中と重なるエリアに
 * - 評価中（水色）: 対角線状に広がる分布、公開中・非公開と一部重なる
 * - 非公開（青）: 中央〜右上に点在、評価中と重なるエリアにも配置
 * - 一時公開（ピンク）: 中央付近に点在
 */
export const generateMockData = (): PostInfluenceData[] => {
  const result: PostInfluenceData[] = [];

  // 公開中（紫）- 左下に集中、一部は評価中と重なるエリアに
  for (let i = 0; i < 12; i++) {
    result.push({
      postId: `published-${i + 1}`,
      name: `公開中ポスト${i + 1}`,
      reposts: Math.floor(Math.random() * 3000) + 500,
      likes: Math.floor(Math.random() * 20000) + 3000,
      impressions: Math.floor(Math.random() * 5000000) + 500000,
      status: "published",
    });
  }
  // 公開中 - 評価中と重なるエリア（少し右上に）
  for (let i = 0; i < 8; i++) {
    result.push({
      postId: `published-overlap-${i + 1}`,
      name: `公開中ポスト${13 + i}`,
      reposts: Math.floor(Math.random() * 5000) + 3000,
      likes: Math.floor(Math.random() * 30000) + 20000,
      impressions: Math.floor(Math.random() * 8000000) + 2000000,
      status: "published",
    });
  }

  // 評価中（水色）- 左下から対角線状に、公開中・非公開と一部重なる
  // 左下グループ（公開中と重なるエリア）
  for (let i = 0; i < 15; i++) {
    result.push({
      postId: `evaluating-left-${i + 1}`,
      name: `評価中ポスト${i + 1}`,
      reposts: Math.floor(Math.random() * 6000) + 2000,
      likes: Math.floor(Math.random() * 40000) + 15000,
      impressions: Math.floor(Math.random() * 25000000) + 10000000,
      status: "evaluating",
    });
  }
  // 中央グループ
  for (let i = 0; i < 25; i++) {
    result.push({
      postId: `evaluating-mid-${i + 1}`,
      name: `評価中ポスト${16 + i}`,
      reposts: Math.floor(Math.random() * 15000) + 8000,
      likes: Math.floor(Math.random() * 80000) + 40000,
      impressions: Math.floor(Math.random() * 45000000) + 20000000,
      status: "evaluating",
    });
  }
  // 右上グループ（非公開と重なるエリア）
  for (let i = 0; i < 15; i++) {
    result.push({
      postId: `evaluating-right-${i + 1}`,
      name: `評価中ポスト${41 + i}`,
      reposts: Math.floor(Math.random() * 20000) + 20000,
      likes: Math.floor(Math.random() * 80000) + 100000,
      impressions: Math.floor(Math.random() * 50000000) + 30000000,
      status: "evaluating",
    });
  }
  // 上部の大きめバブル
  for (let i = 0; i < 5; i++) {
    result.push({
      postId: `evaluating-top-${i + 1}`,
      name: `評価中ポスト${56 + i}`,
      reposts: Math.floor(Math.random() * 15000) + 15000,
      likes: Math.floor(Math.random() * 30000) + 180000,
      impressions: Math.floor(Math.random() * 40000000) + 40000000,
      status: "evaluating",
    });
  }

  // 非公開（青）- 評価中と重なるエリアにも配置
  // 中央〜右上（評価中と重なる）
  for (let i = 0; i < 6; i++) {
    result.push({
      postId: `unpublished-mid-${i + 1}`,
      name: `非公開ポスト${i + 1}`,
      reposts: Math.floor(Math.random() * 15000) + 15000,
      likes: Math.floor(Math.random() * 60000) + 80000,
      impressions: Math.floor(Math.random() * 35000000) + 20000000,
      status: "unpublished",
    });
  }
  // 右上
  for (let i = 0; i < 4; i++) {
    result.push({
      postId: `unpublished-right-${i + 1}`,
      name: `非公開ポスト${7 + i}`,
      reposts: Math.floor(Math.random() * 15000) + 30000,
      likes: Math.floor(Math.random() * 50000) + 150000,
      impressions: Math.floor(Math.random() * 30000000) + 30000000,
      status: "unpublished",
    });
  }

  // 一時公開（ピンク）- 中央付近に点在
  for (let i = 0; i < 10; i++) {
    result.push({
      postId: `temporarilyPublished-${i + 1}`,
      name: `一時公開ポスト${i + 1}`,
      reposts: Math.floor(Math.random() * 12000) + 8000,
      likes: Math.floor(Math.random() * 50000) + 50000,
      impressions: Math.floor(Math.random() * 30000000) + 15000000,
      status: "temporarilyPublished",
    });
  }

  return result;
};

export const createMockResponse = (): PostInfluenceApiResponse => {
  return {
    data: generateMockData(),
    updatedAt: dayjs().format("YYYY-MM-DD"),
  };
};
