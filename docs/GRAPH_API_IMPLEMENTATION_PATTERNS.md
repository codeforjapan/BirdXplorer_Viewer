# Graph API 実装パターン

本ドキュメントでは、Graph API連携の標準的な実装パターンを解説します。

## 1. 全体アーキテクチャ

### 1.1 登場人物と責務のマトリックス

| レイヤー | ファイル | 責務 |
|---------|---------|------|
| **API型** | `app/generated/api/schemas/` | Orval生成のAPIレスポンス型 |
| **UI型** | `app/components/graph/types.ts` | フロントエンドで使用するデータ型 |
| **API呼び出し** | `app/components/graph/api.ts` | fetch実行、エラー正規化、Zodパース |
| **アダプタ** | `app/components/graph/adapters.ts` | API型→UI型変換 |
| **データ取得** | `app/components/graph/graphFetchers.ts` | Mock/API切り替え、fetch*Graph関数群 |
| **キャッシュ** | `app/utils/graphCache.ts` | メモリキャッシュ管理 |
| **Resource Route** | `app/routes/resources.graphs.*.ts` | クライアント再取得用エンドポイント |
| **Loader** | `app/routes/_layout.feature.$id.tsx` | 初期データ取得、SSR |
| **UI状態管理** | `app/components/graph/GraphState.tsx` | loading/error/empty/success状態 |
| **UIコンポーネント** | `app/components/*/` | 個別グラフの表示ロジック |

### 1.2 ファイル構成図

```
app/
├── components/
│   └── graph/
│       ├── api.ts              # API呼び出し共通処理
│       ├── adapters.ts         # 型変換アダプタ
│       ├── graphFetchers.ts    # fetch*Graph関数群
│       ├── constants.ts        # 定数定義
│       ├── types.ts            # UI型定義
│       ├── GraphState.tsx      # 状態表示コンポーネント
│       ├── GraphWrapper.tsx    # タイトル+期間選択
│       ├── GraphContainer.tsx  # レイアウト+フッター
│       ├── GraphErrorState.tsx # エラー表示
│       └── index.ts            # 再エクスポート
├── config/
│   └── graphDataSource.ts      # Mock/API切り替え設定
├── routes/
│   ├── _layout.feature.$id.tsx # Loader（初期表示）
│   └── resources.graphs.*.ts   # Resource Route（再取得）
├── utils/
│   └── graphCache.ts           # キャッシュユーティリティ
└── generated/
    └── api/                    # Orval生成物（触らない）
```

---

## 2. 標準のデータ取得フロー

### 2.1 初期表示フロー（Loader）

ページの初回アクセス時、Loaderがサーバーサイドでデータを取得します。

```
ブラウザ → Loader → キャッシュ確認 → (Hit) → UI返却
                  ↓ (Miss)
             graphFetcher → api.ts → APIまたはMock → UI返却
```

**コードパス**:
1. `app/routes/_layout.feature.$id.tsx:102` - Loader関数
2. `app/utils/graphCache.ts:17` - `buildGraphCacheKey()`でキャッシュキー生成
3. `app/components/graph/graphFetchers.ts` - `fetch*Graph()`でデータ取得
4. `app/components/graph/api.ts:104` - `fetchGraphList()`でAPI呼び出し

**Loaderの実装例** (`_layout.feature.$id.tsx:156-199`):

```typescript
const settled = await Promise.allSettled([
  dailyNotesCached
    ? Promise.resolve(dailyNotesCached)
    : safeGraphFetchWithMarkers(async () => {
        const result = await fetchDailyNotesGraph({
          period: defaultRelativePeriod,
          status,
        });
        if (result.ok) graphCache.set(dailyNotesKey, result);
        return result;
      }),
  // ... 他のグラフも同様
]);
```

### 2.2 クライアント再取得フロー（Fetcher）

ユーザーが期間やフィルターを変更した場合、クライアントサイドでResource Routeを呼び出します。

```
コンポーネント → useFetcher.load() → Resource Route → キャッシュ確認 → データ返却
                                                    ↓ (Miss)
                                               graphFetcher → API
```

**コードパス**:
1. `app/components/daily-notes-creation-chart/DailyNotesCreationChart.tsx:77` - `fetcher.load()`
2. `app/routes/resources.graphs.daily-notes.ts:15` - Resource Route Loader
3. `app/components/graph/graphFetchers.ts:114` - `fetchDailyNotesGraph()`

**Resource Routeの実装例** (`resources.graphs.daily-notes.ts`):

```typescript
export const loader = async ({ request }: Route.LoaderArgs) => {
  const params = new URL(request.url).searchParams;
  const period = resolveRelativePeriod(params.get("period"));
  const status = resolveStatus(params.get("status"));
  const cacheKey = buildGraphCacheKey("daily-notes", { period, status });

  const cached = graphCache.get(cacheKey) as
    | GraphFetchResultWithMarkers<DailyNotesCreationDataItem[]>
    | undefined;
  if (cached) return cached;

  const result = await safeGraphFetchWithMarkers(async () =>
    fetchDailyNotesGraph({ period, status })
  );
  if (result.ok) graphCache.set(cacheKey, result);
  return result;
};
```

---

## 3. 共通ユーティリティと共通UIの役割

### 3.1 データ取得層

#### `api.ts`: API呼び出しとエラー正規化

| 関数 | 責務 |
|------|------|
| `fetchGraphList<T>()` | fetch実行、例外キャッチ、Zodパース |
| `parseGraphListResponse<T>()` | HTTPステータス判定、Zodパース結果返却 |
| `toGraphApiErrorFromStatus()` | HTTPステータスからエラー種別を判定 |

```typescript
// api.ts:104-115
export const fetchGraphList = async <T,>(
  fetcher: () => Promise<{ status: number; data: unknown }>,
  schema: ZodSchema<{ data: T[]; updatedAt: string }>
): Promise<GraphFetchResult<T[]>> => {
  try {
    const response = await fetcher();
    return parseGraphListResponse(response, schema);
  } catch (error) {
    const message = error instanceof Error ? error.message : undefined;
    return { ok: false, error: buildGraphApiError({ kind: "network", message }) };
  }
};
```

#### `graphFetchers.ts`: fetch*Graph関数群

各グラフ用のfetch関数を提供します。Mock/API切り替えはここで行われます。

| 関数 | 対象グラフ |
|------|----------|
| `fetchDailyNotesGraph()` | 日別ノート作成数 |
| `fetchDailyPostsGraph()` | 日別ポスト数 |
| `fetchNotesAnnualGraph()` | 年間ノート統計 |
| `fetchNotesEvaluationGraph()` | ノート評価 |
| `fetchNotesEvaluationStatusGraph()` | ノート評価ステータス |
| `fetchPostInfluenceGraph()` | ポスト影響力 |

**共通ヘルパー**:
- `resolveRelativePeriod()`: 相対期間パラメータの検証
- `resolveRangePeriod()`: 範囲期間パラメータの検証
- `resolveStatus()`: ステータスパラメータの検証
- `safeGraphFetch()`: 例外をネットワークエラーに変換（マーカーなし）
- `safeGraphFetchWithMarkers()`: 例外をネットワークエラーに変換（マーカーあり）

#### `adapters.ts`: API型→UI型変換

API型からUI型への変換を担当します。

| 関数 | 変換内容 |
|------|---------|
| `toDailyNotesCreationData()` | パススルー（変換不要） |
| `toDailyPostCountData()` | 日付でグループ化、ステータス別に集計 |
| `toMonthlyNoteData()` | パススルー |
| `toNoteEvaluationData()` | フィールド名変換（helpfulCount→helpful等） |
| `toPostInfluenceData()` | フィールド名変換（repostCount→reposts等） |

### 3.2 UI層

#### `GraphState`: 状態管理

4つの状態（loading/error/empty/success）を管理し、適切なUIを表示します。

```typescript
// GraphState.tsx
export type GraphStateStatus = "loading" | "error" | "empty" | "success";

export const GraphState = ({
  status,
  error,
  onRetry,
  emptyMessage,
  children,
}: GraphStateProps) => {
  if (status === "loading") return <GraphLoading />;
  if (status === "error") return <GraphErrorState error={error} onRetry={onRetry} />;
  if (status === "empty") return <EmptyState message={emptyMessage} />;
  return <>{children}</>;
};
```

#### `GraphWrapper`: タイトル+期間選択

グラフのタイトルと期間選択ドロップダウンを提供します。

```typescript
<GraphWrapper
  title="コミュニティノートの日別作成数"
  period={period}
  periodOptions={options}
  onPeriodChange={setPeriod}
  updatedAt={currentResult?.updatedAt}
>
  {/* グラフ本体 */}
</GraphWrapper>
```

#### `GraphContainer`: レイアウト+フッター

グラフのボーダーと下部フィルターエリアを提供します。

```typescript
<GraphContainer footer={<GraphStatusFilter ... />}>
  <StackedBarLineChart ... />
</GraphContainer>
```

#### `GraphStatusFilter`: ステータスフィルター

all/published/evaluating/unpublished/temporarilyPublishedのフィルターUI。

---

## 4. エラー正規化と表示

### 4.1 GraphApiError型

```typescript
// api.ts:6-13
export type GraphApiErrorKind = "network" | "validation" | "server" | "parse";

export type GraphApiError = {
  kind: GraphApiErrorKind;
  message: string;
  issues?: string[];  // バリデーションエラーの詳細
  status?: number;    // HTTPステータスコード
};
```

### 4.2 エラー分類ルール

| 条件 | kind | 説明 |
|------|------|------|
| fetch例外 | `network` | ネットワーク障害、タイムアウト |
| HTTP 400/422 | `validation` | パラメータ不正（issuesにdetail配列を格納） |
| HTTP 5xx | `server` | サーバー内部エラー |
| Zod parse失敗 | `parse` | レスポンス形式が期待と異なる |

**エラー分類の実装** (`api.ts:63-76`):

```typescript
export const toGraphApiErrorFromStatus = (
  status: number,
  data?: unknown
): GraphApiError => {
  if (status === 400 || status === 422) {
    return buildGraphApiError({
      kind: "validation",
      status,
      issues: extractValidationIssues(data),
    });
  }
  return buildGraphApiError({ kind: "server", status });
};
```

### 4.3 UIでの表示

**デフォルトエラーメッセージ** (`constants.ts:154-159`):

```typescript
export const DEFAULT_GRAPH_ERROR_MESSAGES: Record<GraphApiErrorKind, string> = {
  network: "通信エラーが発生しました。時間をおいて再試行してください。",
  validation: "パラメータが不正です。期間やフィルターを確認してください。",
  server: "サーバー側でエラーが発生しました。",
  parse: "取得したデータ形式が期待と異なります。",
};
```

**GraphErrorStateコンポーネント** (`GraphErrorState.tsx`):
- `error.message`を表示
- `error.issues`がある場合は最大3件表示
- `onRetry`が渡された場合は再試行ボタンを表示

---

## 5. キャッシュと再取得制御

### 5.1 キャッシュ設定

```typescript
// graphCache.ts:5-6
export const GRAPH_CACHE_TTL_MS = 30_000;  // 30秒
const GRAPH_CACHE_MAX_ENTRIES = 100;
```

- **TTL**: 30秒（30,000ms）
- **最大エントリ数**: 100件
- **保存条件**: 成功時（`result.ok === true`）のみ

### 5.2 キャッシュキー

`buildGraphCacheKey()`でキャッシュキーを生成します。

```typescript
// graphCache.ts:17-29
export const buildGraphCacheKey = (
  graphType: string,
  params: Record<string, string | number | undefined>
): string => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined) return;
    search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `${graphType}?${query}` : graphType;
};
```

**キャッシュキーの例**:
- `"daily-notes?period=1month&status=all"`
- `"daily-posts?range=2025-02_2026-01&status=all"`
- `"notes-evaluation-status?period=6months&status=all&limit=200"`

### 5.3 ページ間キャッシュ共有

- 同一の`graphCache`インスタンスを全ページで使用
- `shouldRevalidate()`で不要な再取得を防止

```typescript
// _layout.feature.$id.tsx:218-232
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  currentUrl,
  nextUrl,
}) => {
  if (currentParams.id !== nextParams.id) return true;

  const graphKeys = ["period", "status", "range", "limit"];
  const hasGraphChange = graphKeys.some(
    (key) => currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key)
  );
  return hasGraphChange;
};
```

---

## 6. Mock運用ルール

### 6.1 切り替え設定

```typescript
// graphDataSource.ts
export type GraphDataSource = "api" | "mock";

const getGraphDataSource = (): GraphDataSource => {
  return "mock";  // 現在はmockに固定
};

export const GRAPH_DATA_SOURCE: GraphDataSource = getGraphDataSource();

export const isGraphMockEnabled = (): boolean =>
  GRAPH_DATA_SOURCE === "mock" && !isProductionEnv();
```

- `GRAPH_DATA_SOURCE`: `"api"` または `"mock"`
- `isGraphMockEnabled()`: production環境では常に`false`

### 6.2 Mock使用時の差異

graphFetcher内でMock/API分岐:

```typescript
// graphFetchers.ts:121-132
if (isGraphMockEnabled()) {
  const { createMockResponse } = await import("~/mocks/graph/daily-notes");
  const mock = createMockResponse(period);
  const markers = mock.eventMarkers ?? getEventMarkersForRelativePeriod(period);
  return {
    ok: true,
    data: mock.data,
    updatedAt: mock.updatedAt,
    eventMarkers: markers,
  };
}
```

- 期間オプションが動的生成される場合がある
- イベントマーカーがMock側で計算生成される

---

## 7. 実コード参照マップ

### 読む順番ガイド（依存関係順）

1. **型定義を理解する**
   - `app/generated/api/schemas/` - API型（Orval生成）
   - `app/components/graph/types.ts` - UI型

2. **データ変換を理解する**
   - `app/components/graph/adapters.ts` - API型→UI型

3. **API呼び出しを理解する**
   - `app/components/graph/api.ts` - fetch、エラー正規化
   - `app/components/graph/graphFetchers.ts` - 各グラフ用fetch関数

4. **キャッシュを理解する**
   - `app/utils/graphCache.ts` - キャッシュ管理

5. **ルーティングを理解する**
   - `app/routes/_layout.feature.$id.tsx` - Loader（初期表示）
   - `app/routes/resources.graphs.daily-notes.ts` - Resource Route（テンプレート）

6. **UIを理解する**
   - `app/components/graph/GraphState.tsx` - 状態管理
   - `app/components/daily-notes-creation-chart/` - コンポーネント例

### クイックリファレンス

| 目的 | 参照ファイル |
|------|------------|
| 新しいグラフ型を追加したい | `types.ts` → `adapters.ts` → `graphFetchers.ts` |
| エラー表示をカスタマイズしたい | `constants.ts` (`DEFAULT_GRAPH_ERROR_MESSAGES`) |
| キャッシュ動作を変更したい | `graphCache.ts` |
| Mock/API切り替えを変更したい | `graphDataSource.ts` |
| 期間オプションを変更したい | `periodOptions.ts`, `constants.ts` |
