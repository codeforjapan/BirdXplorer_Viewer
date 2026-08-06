# BirdXplorer Viewer

X（旧Twitter）の Community Notes データを可視化・検索するための Web アプリケーション。

## 技術スタック

- [React Router](https://reactrouter.com/) v7 (SSR)
- [Mantine UI](https://mantine.dev/) v8
- [Tailwind CSS](https://tailwindcss.com/) v4
- [assistant-ui](https://www.assistant-ui.com/) + [Vercel AI SDK](https://sdk.vercel.ai/) v7
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Vite](https://vite.dev/)
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/)
- デプロイ: [Vercel](https://vercel.com/)

## 環境変数の設定

```bash
cp .env.example .env
```

`.env` を開き、以下を設定してください。

| 変数名                        | 必須           | 説明                                               |
| ----------------------------- | -------------- | -------------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`       | チャット使用時 | Cloudflare アカウント ID                           |
| `CLOUDFLARE_API_TOKEN`        | チャット使用時 | Cloudflare API トークン（Workers AI 権限必要）     |
| `CLOUDFLARE_WORKERS_AI_MODEL` | -              | 使用モデル (デフォルト: `@cf/openai/gpt-oss-120b`) |
| `BIRDXPLORER_API_URL`         | -              | BirdXplorer API のベース URL                       |

Cloudflare API トークンは https://dash.cloudflare.com/ → My Profile → API Tokens から発行してください。

## チャット機能 (`/chats`)

`/chats` でチャット一覧、`/chats/:id` で会話画面が表示されます。  
LLM は Cloudflare Workers AI を使用し、BirdXplorer の REST API をツールとして呼び出します。  
チャット履歴はブラウザの localStorage に保存されます（端末間で共有されません）。

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
