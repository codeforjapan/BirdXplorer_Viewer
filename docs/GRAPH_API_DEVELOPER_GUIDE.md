# Graph API 開発者ガイド

本ドキュメントは、Graph APIを使用したグラフの追加・修正・削除の手順を解説します。

## 1. このガイドの対象とゴール

### 対象作業

- **新規グラフ追加**: 新しい種類のグラフをAPIから取得して表示
- **既存グラフ修正**: パラメータ追加、データ構造変更、表示ロジック変更
- **グラフ削除**: 不要になったグラフの削除

### ゴール

- 統一パターンに沿った安全な変更
- レビューしやすいコード
- 将来の保守性確保

### 前提知識

- [GRAPH_API_IMPLEMENTATION_PATTERNS.md](./GRAPH_API_IMPLEMENTATION_PATTERNS.md) を読んでいること
- React Router (Remix) の Loader と useFetcher の基本を理解していること

---

## 2. 変更時の全体チェックリスト

### 新規グラフ追加

- [ ] API仕様と型を確認（Orval生成型）
- [ ] UI型定義を追加（`types.ts`）
- [ ] アダプタを追加（`adapters.ts`）
- [ ] graphFetcherを追加（`graphFetchers.ts`）
- [ ] Resource Routeを追加（`resources.graphs.*.ts`）
- [ ] コンポーネントを実装
- [ ] Loaderを更新（`_layout.feature.$id.tsx`または対象ページ）
- [ ] アダプタのユニットテストを追加
- [ ] 動作確認（Mock/API両方）

### 既存グラフ修正

- [ ] 影響範囲の確認（型、アダプタ、fetcher、コンポーネント）
- [ ] 必要なファイルを更新
- [ ] テストを更新
- [ ] 動作確認

### グラフ削除

- [ ] `GraphLoaderData`型から該当プロパティ削除
- [ ] import文から不要な型・fetcher削除
- [ ] キャッシュキー定義削除
- [ ] `Promise.allSettled`配列から削除、インデックス修正
- [ ] `graphs`オブジェクト構築のインデックス更新
- [ ] 他ページでの使用確認
- [ ] Resource Route削除
- [ ] コンポーネント削除（他で使われていなければ）

---

## 3. 新規グラフ追加手順（Step-by-step）

### Step 1: API仕様確認

1. **API仕様ドキュメントを確認**
   - バックエンドのOpenAPI仕様を確認
   - エンドポイント、パラメータ、レスポンス形式を把握

2. **Orval生成型を確認**

   ```
   app/generated/api/schemas/
   ```

   - 対応する型が生成されているか確認
   - 型が古い場合は `pnpm orval` で再生成

3. **Zodスキーマを確認**

   ```
   app/generated/api/zod/schema.ts
   ```

   - レスポンスのバリデーションスキーマが存在するか確認

### Step 2: UI型定義追加

`app/components/graph/types.ts` に新しい型を追加します。

```typescript
// 例: 新しい「ユーザーアクティビティ」グラフの型
export type UserActivityData = {
  userId: string;
  name: string;
  /** 投稿数 */
  posts: number;
  /** コメント数 */
  comments: number;
  /** いいね数 */
  likes: number;
};
```

**ポイント**:

- API型とは別に、UIで使いやすい型を定義
- JSDocコメントで各フィールドの意味を明記
- 必要に応じて `StatusCounts` などの既存型を継承

### Step 3: アダプタ追加

`app/components/graph/adapters.ts` に変換関数を追加します。

```typescript
import type { UserActivityDataItem as ApiUserActivityDataItem } from "~/generated/api/schemas";
import type { UserActivityData } from "./types";

export const toUserActivityData = (
  items: ApiUserActivityDataItem[],
): UserActivityData[] => {
  return items.map((item) => ({
    userId: item.userId,
    name: item.name,
    posts: item.postCount,
    comments: item.commentCount,
    likes: item.likeCount,
  }));
};
```

**ポイント**:

- API型からUI型への変換のみを担当
- 副作用なし（純粋関数）
- 不正な値のフォールバック処理をここで行う

### Step 4: graphFetcher追加

`app/components/graph/graphFetchers.ts` に fetch関数を追加します。

```typescript
import { getUserActivityApiV1GraphsUserActivityGet } from "~/generated/api/client";
import { getUserActivityApiV1GraphsUserActivityGetResponse } from "~/generated/api/zod/schema";
import { toUserActivityData } from "./adapters";
import type { UserActivityData } from "./types";

export const fetchUserActivityGraph = async ({
  period,
  status,
  limit,
}: {
  period: RelativePeriodValue;
  status: StatusValue;
  limit: number;
}): Promise<GraphFetchResult<UserActivityData[]>> => {
  // Mock分岐
  if (isGraphMockEnabled()) {
    const { createMockResponse } = await import("~/mocks/graph/user-activity");
    const mock = createMockResponse();
    return {
      ok: true,
      data: mock.data,
      updatedAt: mock.updatedAt,
    };
  }

  // API呼び出し
  const result = await fetchGraphList(
    async () =>
      getUserActivityApiV1GraphsUserActivityGet({ period, status, limit }),
    getUserActivityApiV1GraphsUserActivityGetResponse,
  );

  if (!result.ok) return result;

  return {
    ok: true,
    data: toUserActivityData(result.data),
    updatedAt: result.updatedAt,
  };
};
```

**ポイント**:

- Mock/API分岐を必ず実装
- `fetchGraphList`を使用してエラー正規化
- イベントマーカーが必要な場合は`GraphFetchResultWithMarkers`を返す

### Step 5: Resource Route追加

`app/routes/resources.graphs.user-activity.ts` を新規作成します。

```typescript
import type { UserActivityData, GraphFetchResult } from "~/components/graph";
import {
  fetchUserActivityGraph,
  resolveRelativePeriod,
  resolveStatus,
  resolveLimit,
  safeGraphFetch,
  DEFAULT_GRAPH_LIMIT,
} from "~/components/graph/graphFetchers";
import { buildGraphCacheKey, graphCache } from "~/utils/graphCache";

import type { Route } from "./+types/resources.graphs.user-activity";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(params.get("period"));
  const status = resolveStatus(params.get("status"));
  const limit = resolveLimit(params.get("limit"), DEFAULT_GRAPH_LIMIT);

  const cacheKey = buildGraphCacheKey("user-activity", {
    period,
    status,
    limit,
  });

  // キャッシュ確認
  const cached = graphCache.get(cacheKey) as
    | GraphFetchResult<UserActivityData[]>
    | undefined;
  if (cached) return cached;

  // データ取得
  const result = await safeGraphFetch(async () =>
    fetchUserActivityGraph({ period, status, limit }),
  );

  // 成功時のみキャッシュ保存
  if (result.ok) graphCache.set(cacheKey, result);

  return result;
};
```

**ポイント**:

- `resolve*`関数でパラメータを正規化
- キャッシュ確認 → 取得 → 保存の流れを守る
- 成功時のみキャッシュに保存

### Step 6: コンポーネント実装

新しいグラフコンポーネントを作成します。

```typescript
// app/components/user-activity-chart/UserActivityChart.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFetcher, useRevalidator } from "react-router";

import type { GraphFetchResult, UserActivityData } from "~/components/graph";
import {
  getDefaultPeriodValue,
  GraphContainer,
  GraphState,
  type GraphStateStatus,
  GraphWrapper,
} from "~/components/graph";
import { RELATIVE_PERIOD_OPTIONS } from "~/components/graph/constants";

export type UserActivityChartProps = {
  initialResult?: GraphFetchResult<UserActivityData[]>;
};

export const UserActivityChart = ({
  initialResult,
}: UserActivityChartProps) => {
  const defaultPeriod = getDefaultPeriodValue(RELATIVE_PERIOD_OPTIONS);
  const [period, setPeriod] = useState(defaultPeriod);
  const fetcher = useFetcher<GraphFetchResult<UserActivityData[]>>();
  const revalidator = useRevalidator();
  const hasFetcherLoaded = useRef(false);
  const hasMounted = useRef(false);
  const [lastUrl, setLastUrl] = useState<string | null>(null);

  const currentResult = fetcher.data ?? initialResult;

  // 期間変更時にfetch
  useEffect(() => {
    if (!period) return;
    const nextUrl = `/resources/graphs/user-activity?period=${period}`;

    if (!hasMounted.current) {
      hasMounted.current = true;
      setLastUrl(nextUrl);
      if (!initialResult) {
        hasFetcherLoaded.current = true;
        void fetcher.load(nextUrl);
      }
      return;
    }

    if (nextUrl === lastUrl) return;
    setLastUrl(nextUrl);
    hasFetcherLoaded.current = true;
    void fetcher.load(nextUrl);
  }, [fetcher, initialResult, lastUrl, period]);

  // 状態判定
  const graphStatus = useMemo<GraphStateStatus>(() => {
    if (fetcher.state !== "idle") return "loading";
    if (!currentResult) return "loading";
    if (!currentResult.ok) return "error";
    return currentResult.data.length === 0 ? "empty" : "success";
  }, [currentResult, fetcher.state]);

  // 再試行
  const handleRetry = useCallback(() => {
    if (hasFetcherLoaded.current && lastUrl) {
      void fetcher.load(lastUrl);
      return;
    }
    void revalidator.revalidate();
  }, [fetcher, lastUrl, revalidator]);

  const data = useMemo(
    () => (currentResult?.ok ? currentResult.data : []),
    [currentResult],
  );

  return (
    <GraphWrapper
      title="ユーザーアクティビティ"
      period={period}
      periodOptions={RELATIVE_PERIOD_OPTIONS}
      onPeriodChange={setPeriod}
      updatedAt={currentResult?.ok ? currentResult.updatedAt : undefined}
    >
      <GraphState
        error={currentResult?.ok ? undefined : currentResult?.error}
        onRetry={handleRetry}
        status={graphStatus}
      >
        <GraphContainer>{/* グラフ本体をここに実装 */}</GraphContainer>
      </GraphState>
    </GraphWrapper>
  );
};
```

**パターンのポイント**:

- `initialResult`でLoader結果を受け取る
- `useFetcher`でクライアント再取得
- `hasMounted`で初回マウント時の二重fetchを防止
- `GraphState`で状態（loading/error/empty/success）を管理

### Step 7: Loader更新

対象ページのLoaderに新しいグラフを追加します。

```typescript
// _layout.feature.$id.tsx

// 1. 型定義に追加
type GraphLoaderData = {
  dailyNotes: GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>;
  // ... 既存のグラフ
  userActivity: GraphFetchResult<UserActivityData[]>; // 追加
};

// 2. Loaderでキャッシュキー作成
const userActivityKey = buildGraphCacheKey("user-activity", {
  period: DEFAULT_EVALUATION_PERIOD,
  status,
  limit: DEFAULT_GRAPH_LIMIT,
});

// 3. キャッシュ確認
const userActivityCached = graphCache.get(userActivityKey) as
  | GraphFetchResult<UserActivityData[]>
  | undefined;

// 4. Promise.allSettledに追加
const settled = await Promise.allSettled([
  // ... 既存のfetch
  userActivityCached
    ? Promise.resolve(userActivityCached)
    : safeGraphFetch(async () => {
        const result = await fetchUserActivityGraph({
          period: DEFAULT_EVALUATION_PERIOD,
          status,
          limit: DEFAULT_GRAPH_LIMIT,
        });
        if (result.ok) graphCache.set(userActivityKey, result);
        return result;
      }),
]);

// 5. graphsオブジェクト構築時にインデックス追加
const graphs: GraphLoaderData = {
  // ... 既存
  userActivity:
    settled[4].status === "fulfilled"
      ? settled[4].value
      : createFallbackError(),
};
```

### Step 8: テスト追加

#### アダプタのユニットテスト

`app/components/graph/adapters.test.ts` にテストを追加します。

```typescript
it("toUserActivityData maps counts correctly", () => {
  const items = [
    {
      userId: "user-1",
      name: "Test User",
      postCount: 10,
      commentCount: 5,
      likeCount: 20,
    },
  ];

  expect(toUserActivityData(items)).toEqual([
    {
      userId: "user-1",
      name: "Test User",
      posts: 10,
      comments: 5,
      likes: 20,
    },
  ]);
});
```

#### 動作確認項目

- [ ] Mock有効時にグラフが表示される
- [ ] 期間切り替えでデータが更新される
- [ ] エラー時にエラー表示になる
- [ ] 再試行ボタンが機能する
- [ ] キャッシュが効いている（DevToolsで確認）

---

## 4. 既存グラフ修正手順

### パラメータ追加

1. `graphFetchers.ts`の該当関数にパラメータを追加
2. Resource Routeでパラメータを取得・正規化
3. コンポーネントでパラメータをUI制御
4. キャッシュキーにパラメータを含める

### データ構造変更

1. Orval再生成（`pnpm orval`）
2. `types.ts`のUI型を更新
3. `adapters.ts`の変換ロジックを更新
4. アダプタのテストを更新
5. コンポーネントの表示ロジックを更新

### 表示ロジック変更

1. コンポーネントの該当箇所を修正
2. 必要に応じてGraphWrapperやGraphContainerの使い方を調整

---

## 5. グラフ削除手順

グラフを削除する際は、以下の順序で作業します。

### Step 1: Loaderから削除

```typescript
// _layout.feature.$id.tsx

// 1. GraphLoaderDataから該当プロパティ削除
type GraphLoaderData = {
  dailyNotes: ...;
  dailyPosts: ...;
  // userActivity: ...; ← 削除
};

// 2. キャッシュキー定義削除
// const userActivityKey = ...; ← 削除

// 3. キャッシュ確認削除
// const userActivityCached = ...; ← 削除

// 4. Promise.allSettledから削除
const settled = await Promise.allSettled([
  /* index 0 */ dailyNotesCached ? ... : ...,
  /* index 1 */ dailyPostsCached ? ... : ...,
  // index 2以降を調整
]);

// 5. graphsオブジェクト構築のインデックス更新
const graphs: GraphLoaderData = {
  dailyNotes: settled[0].status === "fulfilled" ? ...,
  dailyPosts: settled[1].status === "fulfilled" ? ...,
  // インデックスを詰める
};
```

### Step 2: ページからコンポーネント削除

```typescript
// import文から削除
// import { UserActivityChart } from "~/components/user-activity-chart";

// JSXから削除
// <UserActivityChart initialResult={graphs?.userActivity} />
```

### Step 3: Resource Route削除

```bash
rm app/routes/resources.graphs.user-activity.ts
```

### Step 4: graphFetcherから削除

```typescript
// graphFetchers.ts
// export const fetchUserActivityGraph = ... ← 削除
```

### Step 5: アダプタから削除

```typescript
// adapters.ts
// export const toUserActivityData = ... ← 削除
```

### Step 6: 型定義から削除

```typescript
// types.ts
// export type UserActivityData = ... ← 削除
```

### Step 7: 他ページでの使用確認

```bash
# 使用箇所を検索
grep -r "UserActivity" app/
grep -r "user-activity" app/routes/
```

---

## 6. よく使う部品の早見表

| 用途           | ファイル              | 関数/型                                           |
| -------------- | --------------------- | ------------------------------------------------- |
| API呼び出し    | `api.ts`              | `fetchGraphList<T>()`                             |
| エラー正規化   | `api.ts`              | `parseGraphListResponse<T>()`                     |
| 型変換         | `adapters.ts`         | `to*Data()`                                       |
| キャッシュキー | `graphCache.ts`       | `buildGraphCacheKey()`                            |
| キャッシュ操作 | `graphCache.ts`       | `graphCache.get()`, `graphCache.set()`            |
| 相対期間解決   | `graphFetchers.ts`    | `resolveRelativePeriod()`                         |
| 範囲期間解決   | `graphFetchers.ts`    | `resolveRangePeriod()`                            |
| ステータス解決 | `graphFetchers.ts`    | `resolveStatus()`                                 |
| 安全なfetch    | `graphFetchers.ts`    | `safeGraphFetch()`, `safeGraphFetchWithMarkers()` |
| 状態表示       | `GraphState.tsx`      | `<GraphState status={...}>`                       |
| エラー表示     | `GraphErrorState.tsx` | `<GraphErrorState error={...}>`                   |
| タイトル+期間  | `GraphWrapper.tsx`    | `<GraphWrapper>`                                  |
| レイアウト     | `GraphContainer.tsx`  | `<GraphContainer>`                                |

---

## 7. テスト指針

### ユニットテスト

**テスト対象**:

- アダプタ変換の正確性
- エラー正規化ロジック

**テストファイル**:

- `app/components/graph/adapters.test.ts`
- `app/components/graph/api.test.ts`

**テストパターン**:

```typescript
describe("graph adapters", () => {
  it("to*Data returns expected structure", () => {
    const input = [...];
    expect(toSomeData(input)).toEqual([...]);
  });

  it("handles invalid status by falling back to published", () => {
    const input = [{ status: "invalid" as never }];
    expect(toSomeData(input)[0].status).toBe("published");
  });
});
```

### ブラウザテスト

**確認項目**:

- GraphState状態遷移（loading → success/error/empty）
- エラー表示とリトライ動作
- 期間切り替えによるデータ更新
- キャッシュ動作（同じ条件での再取得が高速か）

### 触ってはいけないもの

```
app/generated/api/*  # Orval生成物
```

これらのファイルは `pnpm orval` で自動生成されます。手動編集しても次の生成で上書きされます。

---

## 8. Mock追加手順

新しいグラフのMockを追加する場合:

### Step 1: Mockファイル作成

```typescript
// app/mocks/graph/user-activity.ts
import type { UserActivityData } from "~/components/graph";

const generateMockData = (): UserActivityData[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    userId: `user-${i + 1}`,
    name: `User ${i + 1}`,
    posts: Math.floor(Math.random() * 100),
    comments: Math.floor(Math.random() * 50),
    likes: Math.floor(Math.random() * 200),
  }));
};

export const createMockResponse = () => ({
  data: generateMockData(),
  updatedAt: new Date().toISOString().split("T")[0],
});
```

### Step 2: graphFetcherでインポート

```typescript
if (isGraphMockEnabled()) {
  const { createMockResponse } = await import("~/mocks/graph/user-activity");
  // ...
}
```

---

## 9. トラブルシューティングへのリンク

問題が発生した場合は [GRAPH_API_TROUBLESHOOTING.md](./GRAPH_API_TROUBLESHOOTING.md) を参照してください。
