## 概要

ReportおよびFeature詳細ページのパンくずナビゲーションを修正し、現在のページタイトルを末尾に追加しました。

Closes #304

## 変更内容

### 1. Reportページのパンくず修正

`TOP > Report > [レポートタイトル]` の形式に修正しました。

- `app/routes/_layout.report.$year.$month.tsx`: `breadcrumb` の第2項目を固定の `"Report"（/report へのリンク）` に変更し、第3項目としてローダーデータから取得したレポートタイトル（リンクなし）を追加

### 2. Featureページのパンくず修正

`TOP > Feature > [特集タイトル]` の形式に修正しました。

- `app/routes/_layout.feature.$year.$slug.tsx`: `handle.breadcrumb` を静的配列から動的関数に変更し、ローダーデータから取得した特集タイトルを第3項目として追加

## 補足

- `BreadCrumb` コンポーネントは末尾アイテムを自動的に非リンクテキストとして描画するため、最後の項目に `href` は不要です
- Feature ページの `handle` 型を `LayoutHandle` から `LayoutHandle<{ feature: Feature | null }>` に変更し、ローダーデータの型安全性を確保しました

## 効果

- レポート・特集の詳細ページから一覧ページへ戻る導線が生まれ、ナビゲーション性が向上する（Issue #304 解消）

## テスト結果

- [ ] `pnpm run lint` が成功すること
- [ ] `pnpm run typecheck` が成功すること
- [ ] `pnpm run test` が成功すること（該当する場合）
- [ ] `pnpm run build` が成功すること
