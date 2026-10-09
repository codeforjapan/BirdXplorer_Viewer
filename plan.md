## 概要

MCPをつなげる独自のチャットアシスタントウェブアプリの開を行う。まず始めにこのリポジトリ内にBirdXplorer MCPを繋いだチャット機能を作る

## 仕様など

- path
  - "/chats"でチャット一覧
  - "/chats/[id]"でチャット詳
- chat ui
  - このライブラ使って。https://www.assistant-ui.com/
- APIは "/Users/kur0/Developments/works/BirdXplorer"のリポジトリ
- LLMはCloudflareを想定。keyなどは環境変数で入れ込む
