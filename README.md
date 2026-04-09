# BirdXplorer Viewer

X（旧Twitter）の Community Notes データを可視化・検索するための Web アプリケーション。

## 技術スタック

- [React Router](https://reactrouter.com/) v7 (SSR)
- [Mantine UI](https://mantine.dev/) v7
- [Tailwind CSS](https://tailwindcss.com/) v4
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- デプロイ: [Vercel](https://vercel.com/)

## 開発

```bash
pnpm install
pnpm dev
```

## ビルド

```bash
pnpm build
pnpm start
```

## テスト

```bash
pnpm test          # Node テスト
pnpm test:browser  # ブラウザテスト (Playwright)
```

## Lint / Format

```bash
pnpm lint
pnpm format
```

## 全チェック

```bash
pnpm check   # typecheck + build + lint + format + test
```

## データ更新

Feature（特集）や Report（月次レポート）のデータ更新方法については、[データ更新ガイド](./docs/DATA_UPDATE_GUIDE.md)を参照してください。

## ドキュメント

- [データ更新ガイド](./docs/DATA_UPDATE_GUIDE.md)
- [Graph API 開発ガイド](./docs/GRAPH_API_DEVELOPER_GUIDE.md)
- [Graph API 実装パターン](./docs/GRAPH_API_IMPLEMENTATION_PATTERNS.md)
- [Graph API データ型](./docs/GRAPH_API_DATA_TYPES.md)
- [Graph API トラブルシューティング](./docs/GRAPH_API_TROUBLESHOOTING.md)
