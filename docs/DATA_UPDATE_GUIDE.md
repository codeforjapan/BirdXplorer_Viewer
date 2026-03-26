# データ更新ガイド

このドキュメントでは、BirdXplorer Viewer のデータ更新方法について説明します。

## 目次

- [Feature（特集）データの更新](#feature特集データの更新)
- [Report（月次レポート）データの更新](#report月次レポートデータの更新)
- [広聴AIレポートの追加](#広聴aiレポートの追加)

---

## Feature（特集）データの更新

### ファイル場所

```
app/constants/data.ts
```

### データ構造

```typescript
type FeatureItem = {
  title: string; // 特集タイトル
  href: string; // 特集ページへのパス
};

type FeatureCategory = {
  id: number; // 一意のID
  category: string; // カテゴリ名（例: "選挙特集", "災害特集"）
  color: string; // 背景色クラス（例: "bg-green", "bg-blue"）
  detail: FeatureItem;
};
```

### 更新手順

1. `app/constants/data.ts` を開く
2. `FEATURES` 配列に新しい特集を追加

```typescript
// 追加例
export const FEATURES: FeatureCategory[] = [
  // 既存のデータ...
  {
    id: 5, // 既存の最大ID + 1
    category: "新カテゴリ",
    color: "bg-green", // bg-green, bg-blue, bg-gray-2 など
    detail: {
      title: "2025年 新しい特集タイトル",
      href: "/feature/2025/new-feature", // /feature/{year}/{slug} 形式
    },
  },
];
```

### 注意点

- `id` は一意である必要があります
- `href` は `/feature/{year}/{slug}` の形式で指定します（例: `/feature/2025/sangiin`）
- `color` は Tailwind CSS のクラス名を指定します

### URL形式

| 形式                     | 例                      |
| ------------------------ | ----------------------- |
| `/feature/{year}/{slug}` | `/feature/2025/sangiin` |

---

## Report（月次レポート）データの更新

### ファイル場所

```
app/data/reports.ts
```

### データ構造

```typescript
type ReportItem = {
  id: string; // 一意のID（文字列）
  title: string; // レポートタイトル
  description: string; // レポートの説明文
  href: string; // レポートページへのパス
  date: Date; // レポートの日付
  kouchouAiPath?: string; // 広聴AIレポートのパス（オプション）
};
```

### 更新手順

1. `app/data/reports.ts` を開く
2. `REPORT_ITEMS` 配列の先頭に新しいレポートを追加（新しい順に並べる）

```typescript
// 追加例
export const REPORT_ITEMS: ReportItem[] = [
  {
    id: "19", // 既存の最大ID + 1
    title: "2025年 10月レポート",
    description: "レポートの説明文をここに記載します。...",
    href: buildReportHref(2025, 10), // /report/2025/10 が生成される
    date: new Date("2025-10-01"),
    // kouchouAiPath: "/kouchou-ai/202510/{uuid}/index.html", // 広聴AIレポートがある場合
  },
  // 既存のデータ...
];
```

### 注意点

- レポートは新しい順（降順）で配列に追加してください
- `id` は文字列として指定します
- `href` は `buildReportHref(year, month)` 関数を使用して生成します
- `date` は `YYYY-MM-DD` 形式の文字列から Date オブジェクトを生成します

### URL形式

| 形式                     | 例                                     |
| ------------------------ | -------------------------------------- |
| `/report/{year}/{month}` | `/report/2025/09`（月は2桁でゼロ埋め） |

---

## 広聴AIレポートの追加

### ファイル構成

広聴AIの静的HTMLファイルは以下のディレクトリ構成で配置します：

```
public/
└── kouchou-ai/
    ├── 202506/                    # YYYYMM形式のディレクトリ
    │   ├── index.html
    │   ├── {uuid}/
    │   │   └── index.html
    │   └── ...
    ├── 202507/
    │   └── ...
    └── ...（共通アセット）
        ├── _next/
        ├── images/
        └── js/
```

### 新しい広聴AIレポートの追加手順

1. **静的ファイルを配置**

   広聴AIからエクスポートした静的HTMLファイルを `public/kouchou-ai/YYYYMM/` ディレクトリに配置します。

   ```bash
   # 例: 2025年6月のレポートを追加
   mkdir -p public/kouchou-ai/202506
   # 静的ファイルをコピー
   cp -r /path/to/exported-files/* public/kouchou-ai/202506/
   ```

2. **ReportItemに広聴AIパスを追加**

   `app/data/reports.ts` のレポートデータに `kouchouAiPath` を追加します：

   ```typescript
   {
     id: "15",
     title: "2025年 6月レポート",
     description: "...",
     href: buildReportHref(2025, 6), // /report/2025/06
     date: new Date("2025-06-01"),
     kouchouAiPath: "/kouchou-ai/202506/{uuid}/index.html", // 追加
   },
   ```

### ディレクトリ命名規則

- **年月形式**: `YYYYMM`（例: `202506` = 2025年6月）
- **UUID形式**: 広聴AIが生成したUUID（例: `52c5c1bc-fb89-4aa9-ab67-b35e2f663cf2`）

### 共通アセットについて

`_next/`, `images/`, `js/` などの共通アセットは `public/kouchou-ai/` 直下に配置し、各月のレポートから相対パスで参照します。

---

## 参考情報

### 関連ファイル一覧

| 用途                | ファイルパス                                 |
| ------------------- | -------------------------------------------- |
| Feature データ定義  | `app/constants/data.ts`                      |
| Feature 型定義      | `app/types/feature.ts`                       |
| Report データ定義   | `app/data/reports.ts`                        |
| Feature 詳細ページ  | `app/routes/_layout.feature.$year.$slug.tsx` |
| Report 詳細ページ   | `app/routes/_layout.report.$year.$month.tsx` |
| 広聴AI 静的ファイル | `public/kouchou-ai/`                         |

### パス定義

URL パスの定義は `app/constants/paths.ts` で管理されています。

```typescript
feature: {
  index: "/feature",
  show: "/feature/:year/:slug",  // 例: /feature/2025/sangiin
},
report: {
  index: "/report",
  show: "/report/:year/:month",  // 例: /report/2025/09
},
```
