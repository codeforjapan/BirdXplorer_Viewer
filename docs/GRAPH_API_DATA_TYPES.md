# グラフ関連コンポーネント データ型仕様書

バックエンドAPI開発者向けのドキュメントです。  
各グラフコンポーネントに渡すデータの型定義を記載しています。

> 📁 **フロントエンド型定義ファイル**: `app/components/graph/types.ts`

---

## 目次

1. [コミュニティノートの日別作成数](#1-コミュニティノートの日別作成数)
2. [ポストの日別投稿数](#2-ポストの日別投稿数)
3. [1年間のコミュニティノート数と公開率](#3-1年間のコミュニティノート数と公開率)
4. [コミュニティノート評価分布図](#4-コミュニティノート評価分布図)
5. [コミュニティノートの評価状況](#5-コミュニティノートの評価状況)
6. [ポストの影響力](#6-ポストの影響力)
7. [共通型定義](#共通型定義)
8. [APIリクエストパラメータ](#apiリクエストパラメータ)

---

## 1. コミュニティノートの日別作成数

> コンポーネント名: `DailyNotesCreationChart`

### 概要
日別のコミュニティノート作成数をステータス別に表示する積み上げ棒グラフ

### データ型

```typescript
type DailyNotesCreationDataItem = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 公開中のノート数 */
  published: number;
  /** 評価中のノート数 */
  evaluating: number;
  /** 非公開のノート数 */
  unpublished: number;
  /** 一時公開のノート数 */
  temporarilyPublished: number;
};
```

### イベントマーカー（オプション）
グラフ上に縦線でイベントを表示する場合に使用

```typescript
type EventMarker = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 表示ラベル（例: "7/3 公示"） */
  label: string;
};
```

> 💡 **補足**: 選挙の公示日・投開票日など固定のイベントは、フロントエンド側で定数管理することも可能です。動的に変更が必要なイベントのみAPIから取得することを想定しています。

### レスポンス例

```json
{
  "data": [
    { "date": "2025-01-01", "published": 5, "evaluating": 12, "unpublished": 3, "temporarilyPublished": 2 },
    { "date": "2025-01-02", "published": 8, "evaluating": 15, "unpublished": 2, "temporarilyPublished": 3 },
    { "date": "2025-01-03", "published": 3, "evaluating": 9, "unpublished": 4, "temporarilyPublished": 1 }
  ],
  "eventMarkers": [
    { "date": "2025-01-02", "label": "1/2 イベント発生" }
  ],
  "updatedAt": "2025-01-03"
}
```

---

## 2. ポストの日別投稿数

> コンポーネント名: `DailyPostCountChart`

### 概要
期間単位でポストの日別投稿数をステータス別に表示する積み上げ棒グラフ

### データ型

```typescript
type DailyPostCountDataItem = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 公開中のポスト数 */
  published: number;
  /** 評価中のポスト数 */
  evaluating: number;
  /** 非公開のポスト数 */
  unpublished: number;
  /** 一時公開のポスト数 */
  temporarilyPublished: number;
};
```

### イベントマーカー（オプション）

```typescript
type EventMarker = {
  /** 日付（YYYY-MM-DD形式） */
  date: string;
  /** 表示ラベル */
  label: string;
};
```

> 💡 **補足**: 選挙の公示日・投開票日など固定のイベントは、フロントエンド側で定数管理することも可能です。

### レスポンス例

```json
{
  "data": [
    { "date": "2024-12-01", "published": 10, "evaluating": 5, "unpublished": 2, "temporarilyPublished": 1 },
    { "date": "2024-12-02", "published": 12, "evaluating": 8, "unpublished": 3, "temporarilyPublished": 2 }
  ],
  "eventMarkers": [
    { "date": "2024-12-01", "label": "12/1 キャンペーン開始" }
  ],
  "updatedAt": "2024-12-02"
}
```

---

## 3. 1年間のコミュニティノート数と公開率

> コンポーネント名: `NotesAnnualChartSection`

### 概要
月別のコミュニティノート数と公開率を表示する積み上げ棒グラフ＋折れ線グラフ

### データ型

```typescript
type MonthlyNoteData = {
  /** 月（YYYY-MM形式） */
  month: string;
  /** 公開中のノート数 */
  published: number;
  /** 評価中のノート数 */
  evaluating: number;
  /** 非公開のノート数 */
  unpublished: number;
  /** 一時公開のノート数 */
  temporarilyPublished: number;
  /** 公開率（0〜100のパーセンテージ） */
  publicationRate: number;
};
```

> ⚠️ **注意**: `month`フィールドは`YYYY-MM`形式（ハイフン区切り）で指定してください。フロントエンドで表示用に`YYYY/MM`形式に変換します。

### 公開率の計算式

```
publicationRate = (published / (published + evaluating + unpublished + temporarilyPublished)) × 100
```

### レスポンス例

```json
{
  "data": [
    { "month": "2024-10", "published": 650, "evaluating": 350, "unpublished": 200, "temporarilyPublished": 100, "publicationRate": 50 },
    { "month": "2024-11", "published": 720, "evaluating": 400, "unpublished": 180, "temporarilyPublished": 120, "publicationRate": 51 },
    { "month": "2024-12", "published": 800, "evaluating": 420, "unpublished": 220, "temporarilyPublished": 110, "publicationRate": 52 }
  ],
  "updatedAt": "2024-12-31"
}
```

---

## 4. コミュニティノート評価分布図

> コンポーネント名: `NotesEvaluationChartSection`

### 概要
コミュニティノートの評価分布をバブルチャートで表示  
- X軸: 「役に立たなかった」の評価数
- Y軸: 「役に立った」の評価数
- バブルサイズ: インプレッション数

### データ型

```typescript
type NoteEvaluationData = {
  /** ノートの一意識別子 */
  noteId: string;
  /** ノートの表示名 */
  name: string;
  /** 「役に立った」の評価数 */
  helpful: number;
  /** 「役に立たなかった」の評価数 */
  notHelpful: number;
  /** インプレッション数 */
  impressions: number;
  /** ステータス */
  status: NoteStatus;
};
```

### ステータス値

| 値 | 意味 |
|----|------|
| `"published"` | 公開中 |
| `"evaluating"` | 評価中 |
| `"unpublished"` | 非公開 |
| `"temporarilyPublished"` | 一時公開 |

### レスポンス例

```json
{
  "data": [
    {
      "noteId": "note-001",
      "name": "公開中ノート1",
      "helpful": 1200,
      "notHelpful": 50,
      "impressions": 10000000,
      "status": "published"
    },
    {
      "noteId": "note-002",
      "name": "評価中ノート1",
      "helpful": 200,
      "notHelpful": 100,
      "impressions": 5000000,
      "status": "evaluating"
    }
  ],
  "updatedAt": "2025-01-15"
}
```

---

## 5. コミュニティノートの評価状況

> コンポーネント名: `NotesEvaluationStatusChart`

### 概要
コミュニティノートの評価状況をバブルチャートで表示  
- X軸: 「役に立たなかった」の評価数
- Y軸: 「役に立った」の評価数
- バブルサイズ: インプレッション数

### データ型

> 📝 **Note**: このコンポーネントは「コミュニティノート評価分布図」と同じ`NoteEvaluationData`型を使用します。

```typescript
type NoteEvaluationData = {
  /** ノートの一意識別子 */
  noteId: string;
  /** ノートの表示名 */
  name: string;
  /** 「役に立った」の評価数 */
  helpful: number;
  /** 「役に立たなかった」の評価数 */
  notHelpful: number;
  /** インプレッション数 */
  impressions: number;
  /** ステータス */
  status: NoteStatus;
};
```

### ステータス値

| 値 | 意味 |
|----|------|
| `"published"` | 公開中 |
| `"evaluating"` | 評価中 |
| `"unpublished"` | 非公開 |
| `"temporarilyPublished"` | 一時公開 |

### レスポンス例

```json
{
  "data": [
    {
      "noteId": "note-001",
      "name": "公開中ノート1",
      "helpful": 1200,
      "notHelpful": 30,
      "impressions": 35000000,
      "status": "published"
    },
    {
      "noteId": "note-002",
      "name": "評価中ノート1",
      "helpful": 400,
      "notHelpful": 80,
      "impressions": 15000000,
      "status": "evaluating"
    },
    {
      "noteId": "note-003",
      "name": "一時公開ノート1",
      "helpful": 800,
      "notHelpful": 100,
      "impressions": 20000000,
      "status": "temporarilyPublished"
    }
  ],
  "updatedAt": "2025-01-15"
}
```

---

## 6. ポストの影響力

> コンポーネント名: `PostInfluenceChart`

### 概要
ポストの影響力をバブルチャートで表示  
- X軸: リポスト数
- Y軸: いいね数
- バブルサイズ: インプレッション数

### データ型

```typescript
type PostInfluenceData = {
  /** ポストの一意識別子 */
  postId: string;
  /** ポストの表示名 */
  name: string;
  /** リポスト数 */
  reposts: number;
  /** いいね数 */
  likes: number;
  /** インプレッション数 */
  impressions: number;
  /** ステータス（ついているコミュニティノートのステータス） */
  status: NoteStatus;
};
```

### ステータス値

| 値 | 意味 |
|----|------|
| `"published"` | 公開中 |
| `"evaluating"` | 評価中 |
| `"unpublished"` | 非公開 |
| `"temporarilyPublished"` | 一時公開 |

> 💡 **補足**: このステータスは、ポストについているコミュニティノートのステータスを表します

### レスポンス例

```json
{
  "data": [
    {
      "postId": "post-001",
      "name": "ポスト1",
      "reposts": 5000,
      "likes": 25000,
      "impressions": 8000000,
      "status": "published"
    },
    {
      "postId": "post-002",
      "name": "ポスト2",
      "reposts": 15000,
      "likes": 80000,
      "impressions": 40000000,
      "status": "evaluating"
    },
    {
      "postId": "post-003",
      "name": "ポスト3",
      "reposts": 10000,
      "likes": 60000,
      "impressions": 25000000,
      "status": "temporarilyPublished"
    }
  ],
  "updatedAt": "2025-01-15"
}
```

---

## 共通型定義

### ステータス型（NoteStatus）

**すべてのグラフで共通して使用される**ステータス型です。  
バックエンドでも共通のenumとして定義することを推奨します。

```typescript
type NoteStatus = "published" | "evaluating" | "unpublished" | "temporarilyPublished";
```

| 値 | 意味 | 説明 |
|----|------|------|
| `"published"` | 公開中 | ノートが公開されている状態 |
| `"evaluating"` | 評価中 | ノートが評価プロセス中の状態 |
| `"unpublished"` | 非公開 | ノートが非公開の状態 |
| `"temporarilyPublished"` | 一時公開 | ノートが一時的に公開されている状態 |

### ステータス件数型（StatusCounts）

公開ステータスごとの件数を共通化した型です。  
日別・月別の件数データで共通して使用します。

```typescript
type StatusCounts = {
  /** 公開中の件数 */
  published: number;
  /** 評価中の件数 */
  evaluating: number;
  /** 非公開の件数 */
  unpublished: number;
  /** 一時公開の件数 */
  temporarilyPublished: number;
};
```

### 期間選択オプション型（PeriodOption）

期間選択のUIに渡すオプション型です。  
フロントエンド側で期間切り替え可能なグラフに使用します。

```typescript
type PeriodOption = { value: string; label: string };
```

> 💡 **補足**: 期間オプションはフロントエンドで定数管理します（APIレスポンスには含めません）。

### updatedAt
全てのグラフで共通して使用される更新日

```typescript
/** 更新日（YYYY-MM-DD形式） */
updatedAt: string;
```

> 💡 **補足**: フロントエンドで「2025年1月15日更新」のような表示形式に変換します。

### ステータスの色分け（参考）

フロントエンドでは以下の色でステータスを表示しています：

| ステータス | 色 | カラーコード |
|-----------|-----|-------------|
| 公開中（published） | 紫 | `#ab47bc` |
| 評価中（evaluating） | 水色 | `#42a5f5` |
| 非公開（unpublished） | 青 | `#2979ff` |
| 一時公開（temporarilyPublished） | ピンク | `#ec407a` |

---

## APIリクエストパラメータ

一部のグラフでは、期間やフィルター条件をAPIリクエストパラメータとして受け取ることが想定されています。

> 💡 **補足**: `period` の値はフロントエンドで定義する期間オプションから選択してください。

### 期間パラメータ（period）

以下のグラフでは期間選択が可能です：

| グラフ | パラメータ形式 | 説明 |
|--------|---------------|------|
| DailyNotesCreationChart | `"1week"`, `"1month"`, `"3months"`, `"6months"`, `"1year"` | 相対期間指定 |
| NotesEvaluationChartSection | `"1week"`, `"1month"`, `"3months"`, `"6months"`, `"1year"` | 相対期間指定 |
| DailyPostCountChart | `"YYYY-MM_YYYY-MM"` (例: `"2024-12_2025-12"`) | 期間範囲指定 |
| NotesAnnualChartSection | `"YYYY-MM_YYYY-MM"` (例: `"2024-10_2025-09"`) | 期間範囲指定 |

> 💡 **補足**: `"YYYY-MM_YYYY-MM"` のレンジ指定は開始月・終了月の両方を含む（inclusive）想定です。月次集計は開始月〜終了月の全月、日次集計は開始月初日〜終了月末日までを対象にしてください。

### 相対期間オプション（フロントエンド定数）

| 値 | ラベル |
|----|--------|
| `"1week"` | 直近1週間 |
| `"1month"` | 直近1ヶ月 |
| `"3months"` | 直近3ヶ月 |
| `"6months"` | 直近6ヶ月 |
| `"1year"` | 直近1年 |

### ステータスフィルター（status）

すべてのグラフで使用可能なフィルターパラメータ:

| 値 | 意味 |
|----|------|
| `"all"` | 全て（フィルターなし） |
| `"published"` | 公開中のみ |
| `"evaluating"` | 評価中のみ |
| `"unpublished"` | 非公開のみ |
| `"temporarilyPublished"` | 一時公開のみ |

> 💡 **補足**: フィルタリングはフロントエンド側で行うこともできますが、データ量が多い場合はバックエンドでフィルタリングすることを推奨します。

---

## 型定義まとめ表

| グラフ | メインデータ型 | 配列 | 備考 |
|--------|---------------|------|------|
| DailyNotesCreationChart | `DailyNotesCreationDataItem` | ✅ | EventMarkerオプション、4種類ステータス |
| DailyPostCountChart | `DailyPostCountDataItem` | ✅ | EventMarkerオプション、4種類ステータス |
| NotesAnnualChartSection | `MonthlyNoteData` | ✅ | 公開率含む、monthはYYYY-MM形式、4種類ステータス |
| NotesEvaluationChartSection | `NoteEvaluationData` | ✅ | 4種類ステータス |
| NotesEvaluationStatusChart | `NoteEvaluationData` | ✅ | 評価分布図と同じ型を使用、4種類ステータス |
| PostInfluenceChart | `PostInfluenceData` | ✅ | 4種類ステータス |

---

## 日付フォーマット統一

すべての日付フィールドはハイフン区切りで統一されています：

| 形式 | 使用箇所 | 例 |
|------|---------|-----|
| `YYYY-MM-DD` | 日付フィールド（date） | `"2025-01-15"` |
| `YYYY-MM` | 月フィールド（month）、期間メタデータ | `"2025-01"` |

---

## 備考

- すべてのデータは配列形式で渡してください
- `impressions`（インプレッション数）は大きな数値になることが想定されます（数百万〜数千万）
- ステータス型はすべて文字列型に統一されています（`NoteStatus`型）
- **すべてのグラフで4種類のステータス（公開中、評価中、非公開、一時公開）を使用します**
- PostInfluenceChartのステータスは、ポストについているコミュニティノートのステータスを表します
- **フロントエンドの型定義は `app/components/graph/types.ts` を参照してください**
