# Graph API トラブルシューティング

本ドキュメントは、Graph API連携で発生しうる問題と解決策をまとめています。

## 概要

### エラー調査の基本アプローチ

1. **症状を特定**: どのような表示になっているか（loading/error/empty）
2. **レイヤーを特定**: どこで問題が発生しているか
3. **原因を特定**: ログやDevToolsで詳細を確認
4. **解決策を適用**: 本ドキュメントの該当セクションを参照

### 調査対象レイヤー

```
ブラウザ ← UI(GraphState) ← キャッシュ ← fetcher ← API/Mock
```

問題が発生した場合、右側（API/Mock）から順に確認していくと効率的です。

---

## 症状別ガイド

### 1. ずっとloadingのまま

グラフがローディング表示から変わらない場合。

#### まず確認

```typescript
// DevTools Console で確認
console.log("fetcher.state:", fetcher.state);
console.log("initialResult:", initialResult);
console.log("currentResult:", currentResult);
```

#### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| Resource Routeが応答しない | DevTools Network タブ | Resource Routeのloaderが正しく定義されているか確認 |
| `Promise.allSettled`が解決しない | Loaderにログを追加 | 各fetchがrejectしていないか確認、タイムアウト設定 |
| `fetcher.load()`が呼ばれていない | useEffectにログを追加 | 条件分岐（`hasMounted`等）を確認 |
| 無限ループ | React DevTools | useEffectの依存配列を確認 |

#### 参照コード

- コンポーネントの状態判定: 各チャートコンポーネントの`graphStatus`計算
- GraphStateの表示: `app/components/graph/GraphState.tsx`

#### 解決例

```typescript
// fetcher.load()が呼ばれているか確認
useEffect(() => {
  console.log("useEffect triggered, period:", period);
  if (!period) return;
  const nextUrl = `/resources/graphs/daily-notes?period=${period}`;
  console.log("Loading:", nextUrl);
  void fetcher.load(nextUrl);
}, [period]);
```

---

### 2. error表示になる

グラフがエラー表示になる場合。エラーの種類（kind）によって対処が異なります。

#### 2.1 network エラー

> "通信エラーが発生しました。時間をおいて再試行してください。"

##### まず確認

- DevTools → Network タブ
- リクエストが送信されているか
- レスポンスのステータスコード

##### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| API未起動 | `curl` でエンドポイント確認 | バックエンド起動 |
| CORS設定 | Consoleのエラーメッセージ | バックエンドのCORS設定確認 |
| タイムアウト | Network タブの時間 | タイムアウト値調整またはバックエンド最適化 |
| 環境変数未設定 | `.env`確認 | `API_BASE_URL`等を設定 |

##### 参照コード

- エラー生成: `app/components/graph/api.ts:111-114`

```typescript
// api.ts
catch (error) {
  const message = error instanceof Error ? error.message : undefined;
  return { ok: false, error: buildGraphApiError({ kind: "network", message }) };
}
```

#### 2.2 validation エラー

> "パラメータが不正です。期間やフィルターを確認してください。"

##### まず確認

```typescript
// error.issuesを確認
console.log("Validation issues:", error.issues);
```

##### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| 不正なperiod値 | リクエストパラメータ確認 | `resolveRelativePeriod()`のバリデーション確認 |
| 不正なstatus値 | リクエストパラメータ確認 | `resolveStatus()`のバリデーション確認 |
| 不正なrange形式 | リクエストパラメータ確認 | `YYYY-MM_YYYY-MM`形式か確認 |
| limit範囲外 | リクエストパラメータ確認 | `resolveLimit()`のデフォルト値確認 |

##### 参照コード

- パラメータ解決: `app/components/graph/graphFetchers.ts:69-104`

```typescript
// graphFetchers.ts
export const resolveRelativePeriod = (
  value?: string | null,
  fallback?: RelativePeriodValue
): RelativePeriodValue => {
  if (value && RELATIVE_PERIOD_VALUES.includes(value as RelativePeriodValue)) {
    return value as RelativePeriodValue;
  }
  // ...
};
```

#### 2.3 server エラー

> "サーバー側でエラーが発生しました。"

##### まず確認

```typescript
// error.statusを確認
console.log("Server error status:", error.status);
```

##### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| バックエンド内部エラー | バックエンドログ | バックエンドを修正 |
| データベース接続エラー | バックエンドログ | DB接続設定確認 |
| 依存サービス障害 | バックエンドログ | 依存サービス復旧待ち |

##### 参照コード

- ステータスコード判定: `app/components/graph/api.ts:63-76`

#### 2.4 parse エラー

> "取得したデータ形式が期待と異なります。"

##### まず確認

```typescript
// error.issuesを確認（Zodエラーメッセージ）
console.log("Parse issues:", error.issues);
```

##### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| APIレスポンス構造変更 | 実際のレスポンスをログ | Orval再生成（`pnpm orval`） |
| Zodスキーマ古い | `generated/api/zod/schema.ts`確認 | Orval再生成 |
| 必須フィールド欠落 | Zodエラーメッセージ | バックエンドまたはスキーマ修正 |

##### 参照コード

- Zodパース: `app/components/graph/api.ts:82-92`

```typescript
// api.ts
const parsed = schema.safeParse(response.data);
if (!parsed.success) {
  return {
    ok: false,
    error: buildGraphApiError({
      kind: "parse",
      issues: parsed.error.issues.map((issue) => issue.message),
    }),
  };
}
```

---

### 3. データが更新されない・古い

期間やフィルターを変更してもデータが変わらない場合。

#### まず確認

- キャッシュTTL（30秒）を確認
- DevTools Network でリクエストが発生しているか

#### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| キャッシュが有効 | 30秒未満の再アクセス | 30秒待つ |
| `shouldRevalidate`がfalse | Loaderが呼ばれない | クエリパラメータに変更を含める |
| `lastUrl`が同じ | fetcherが発火しない | パラメータ変更がURLに反映されているか確認 |

#### 解決策

**開発時のキャッシュクリア**:
```typescript
// DevTools Console で実行
import { graphCache } from "~/utils/graphCache";
graphCache.clear();
```

**shouldRevalidateの確認**:
```typescript
// _layout.feature.$id.tsx:218-232
export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentUrl,
  nextUrl,
}) => {
  const graphKeys = ["period", "status", "range", "limit"];
  const hasGraphChange = graphKeys.some(
    (key) => currentUrl.searchParams.get(key) !== nextUrl.searchParams.get(key)
  );
  return hasGraphChange;
};
```

#### 参照コード

- キャッシュ設定: `app/utils/graphCache.ts:5-6`

---

### 4. eventMarkersが出ない

日別グラフにイベントマーカー（公示、投開票など）が表示されない場合。

#### まず確認

```typescript
// currentResultにeventMarkersがあるか
console.log("eventMarkers:", currentResult?.ok ? currentResult.eventMarkers : "N/A");
```

#### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| `safeGraphFetch`使用 | fetcher関数確認 | `safeGraphFetchWithMarkers`に変更 |
| `getEventMarkersFor*Period`未呼び出し | fetcher関数確認 | マーカー生成関数を呼び出し |
| マーカーが期間外 | データの日付範囲確認 | マーカー日付が範囲内か確認 |
| 定数が空配列 | `constants.ts`確認 | `API_EVENT_MARKERS_*`にデータを設定 |

#### 参照コード

- マーカー付きfetch: `app/components/graph/graphFetchers.ts:341-355`
- マーカー生成: `app/components/graph/eventMarkers.ts`

```typescript
// graphFetchers.ts
export const safeGraphFetchWithMarkers = async <T,>(
  action: () => Promise<GraphFetchResultWithMarkers<T>>
): Promise<GraphFetchResultWithMarkers<T>> => {
  // ...
};
```

---

### 5. mockのつもりがAPIを叩く（またはその逆）

Mock/API切り替えが意図通り動作しない場合。

#### まず確認

```typescript
import { GRAPH_DATA_SOURCE, isGraphMockEnabled } from "~/config/graphDataSource";
console.log("GRAPH_DATA_SOURCE:", GRAPH_DATA_SOURCE);
console.log("isGraphMockEnabled():", isGraphMockEnabled());
```

#### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| production環境判定 | `NODE_ENV`確認 | 開発環境で実行 |
| `GRAPH_DATA_SOURCE`設定 | `graphDataSource.ts`確認 | `"mock"`または`"api"`に変更 |
| Vite環境変数 | `import.meta.env.PROD`確認 | ビルド設定確認 |

#### 参照コード

- 設定ファイル: `app/config/graphDataSource.ts`

```typescript
// graphDataSource.ts
const isProductionEnv = (): boolean => {
  if (typeof import.meta !== "undefined") {
    const viteProd = import.meta.env?.PROD;
    if (viteProd === true) return true;
  }
  if (typeof process !== "undefined" && process.env) {
    if (process.env.NODE_ENV === "production") return true;
  }
  return false;
};

export const isGraphMockEnabled = (): boolean =>
  GRAPH_DATA_SOURCE === "mock" && !isProductionEnv();
```

---

### 6. ページ間でキャッシュが共有されない

同じパラメータなのに、ページ遷移後にデータを再取得している場合。

#### まず確認

```typescript
// キャッシュキーを確認
import { buildGraphCacheKey } from "~/utils/graphCache";
console.log("Cache key:", buildGraphCacheKey("daily-notes", { period, status }));
```

#### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| パラメータの差異 | キャッシュキー比較 | 両ページで同じデフォルト値を使用 |
| 型アサーションの不一致 | `graphCache.get()`の型 | 正しい型でアサーション |
| インスタンスが別 | importパス確認 | 同じ`graphCache`をimport |

#### 解決策

```typescript
// キャッシュキー生成を統一
// 悪い例: パラメータ順序が異なる
buildGraphCacheKey("daily-notes", { status, period });  // status=all&period=1month
buildGraphCacheKey("daily-notes", { period, status });  // period=1month&status=all

// URLSearchParamsはアルファベット順にならないので注意
```

#### 参照コード

- キャッシュキー生成: `app/utils/graphCache.ts:17-29`

---

### 7. グラフ削除後に型エラー・ランタイムエラー

グラフを削除した後にエラーが発生する場合。

#### まず確認

- TypeScriptエラーメッセージ
- ランタイムエラーのスタックトレース

#### よくある原因

| 原因 | 確認方法 | 解決策 |
|------|---------|--------|
| `GraphLoaderData`型に残骸 | 型定義確認 | プロパティを削除 |
| `Promise.allSettled`インデックス不整合 | インデックス確認 | インデックスを詰める |
| import文の残骸 | import確認 | 不要なimportを削除 |
| 他ページでの参照 | grep検索 | 参照箇所を修正または削除 |

#### 解決策

グラフ削除時のチェックリスト:

```bash
# 削除対象の参照を検索
grep -r "UserActivity" app/
grep -r "user-activity" app/routes/
grep -r "fetchUserActivityGraph" app/
```

#### 参照

- 削除手順: [GRAPH_API_DEVELOPER_GUIDE.md](./GRAPH_API_DEVELOPER_GUIDE.md#5-グラフ削除手順)

---

## デバッグTips

### キャッシュ確認

```typescript
// DevTools Console
import { graphCache } from "~/utils/graphCache";

// 全キャッシュキー一覧
console.log("Cache keys:", [...graphCache.keys()]);

// 特定キーの値
console.log("Cached value:", graphCache.get("daily-notes?period=1month&status=all"));

// キャッシュクリア
graphCache.clear();
```

### fetcherの状態確認

```typescript
// コンポーネント内
useEffect(() => {
  console.log("fetcher.state:", fetcher.state);
  console.log("fetcher.data:", fetcher.data);
}, [fetcher.state, fetcher.data]);
```

### Network確認

DevTools → Network → Fetch/XHR

- リクエストURL確認
- レスポンスステータス確認
- レスポンスボディ確認

### ログ追加パターン

```typescript
// graphFetchers.ts にログ追加
export const fetchDailyNotesGraph = async (params) => {
  console.log("[fetchDailyNotesGraph] params:", params);
  console.log("[fetchDailyNotesGraph] isGraphMockEnabled:", isGraphMockEnabled());

  // ...

  console.log("[fetchDailyNotesGraph] result:", result);
  return result;
};
```

### React DevTools

- Components タブでprops/state確認
- Profiler タブでレンダリング確認

---

## 関連ドキュメント

- [GRAPH_API_IMPLEMENTATION_PATTERNS.md](./GRAPH_API_IMPLEMENTATION_PATTERNS.md) - 実装パターンの全体像
- [GRAPH_API_DEVELOPER_GUIDE.md](./GRAPH_API_DEVELOPER_GUIDE.md) - 追加・修正・削除の手順
- [GRAPH_API_DATA_TYPES.md](./GRAPH_API_DATA_TYPES.md) - データ型の詳細仕様
