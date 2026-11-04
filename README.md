# Portfolio Site

Astro で構築したポートフォリオサイトです。プロフィール、経歴、技術スタック、記事一覧などを表示できる構成になっています。


## 構成

このリポジトリは、ポートフォリオサイトを構築するための実用的なテンプレート兼実装例です。主な構成を表にまとめます。

| 項目 | 内容 |
| --- | --- |
| ページ構成 | `src/pages` にトップページなどの静的ページを配置。各ページは Astro コンポーネントで構成し、必要であれば部分的に React を組み合わせます。 |
| レイアウト | `src/layouts/Layout.astro` で共通ヘッダー／フッター／メタ情報（SEO）を管理。ページ間で一貫した UI を提供します。 |
| コンポーネント分割 | `src/components` を機能別に分割（プロフィール、記事一覧、職歴、技術スタックなど）。再利用性を優先した設計です。 |
| データ取得 | Astro のビルド時に Zenn の記事一覧を HTML に含めます。公開後は Worker が RSS を定期取得し、ページを開くと最新の一覧を表示します。 |
| アナリティクス | `src/components/common/GoogleAnalytics.astro` で Partytown 経由の Google Analytics を設定し、メインスレッド負荷を低減します。 |
| スタイル | Tailwind CSS を採用。`src/styles/global.css` に基本設定を置き、ユーティリティクラスでレスポンシブ対応します。 |
| 画像・公開資産 | `public/images` にアセットを格納。CNAME 等のデプロイ関連ファイルも `public` 配下に配置。 |
| ビルドとデプロイ | Astro のビルド出力を静的ホスティング（Vercel / Netlify / GitHub Pages 等）へデプロイする想定。`package.json` にスクリプトあり。 |


## プロジェクト構成

```text
/
├── public/
│   ├── CNAME
│   └── images/
├── src/
│   ├── components/
│   │   ├── Profile.astro
│   │   ├── articles/
│   │   ├── careers/
│   │   ├── common/
│   │   └── profile/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── lib/
│   │   └── zenn.ts
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 開発コマンド

ルートディレクトリで以下のコマンドを実行します。

```bash
npm install
npm run dev
```

### その他

```bash
npm run build
npm run preview
npm run astro -- --help
```


## 技術スタック

以下は本プロジェクトで採用している主要な技術を表でまとめたものです。

| 技術 | 役割 | 備考 |
| --- | --- | --- |
| Astro | 静的サイト生成（SSG）と部分的なクライアントレンダリング（Islands Architecture） | Vite ベースの開発環境／ビルドを提供 |
| React | インタラクティブな UI 部分で使用（必要箇所のみ） | Astro と組み合わせて部分的にクライアントサイドレンダリングを行う |
| Tailwind CSS | ユーティリティファーストのスタイリング | `src/styles/global.css` に基本設定とカスタムユーティリティを配置 |
| Partytown + Google Analytics | サードパーティスクリプトをワーカーへ移動し、メインスレッド負荷を低減 | `src/components/common/GoogleAnalytics.astro` で設定 |
| Day.js | 日付のフォーマット・表示 | 軽量でシンプルな日付処理ライブラリ |
| RSS Parser / Zenn API ラッパー | Zenn の記事や RSS を取得して静的ページに組み込む | 実装は `src/lib/zenn.ts` に集約 |
| TypeScript | 型安全性の確保、開発時の信頼性向上 | `tsconfig.json` を利用 |
| Vite（Astro ビルド） | 開発サーバーと高速ビルド／バンドリング | 最適化された静的出力を生成 |
| SEO / アクセシビリティ | メタタグ／構造化データ／アクセシビリティ配慮 | 各ページで実装、クローラビリティ向上を目的 |
| デプロイ / CI | Cloudflare Workers | Astro の静的ファイルと記事 API を同じドメインで配信 |

## Cloudflare Workers への移行

1. Workers Builds で `Milix-M/new_portfolio` を接続します。Worker 名は `new-portfolio`、ブランチは `main`、ビルドは `npm run build`、デプロイは `npx wrangler deploy`、ビルド変数 `NODE_VERSION` は `24` に設定します。初回デプロイで `ZENN_ARTICLES` の KV 名前空間が作成されます。
2. `workers.dev` でトップページを開き、定期実行後に `/api/zenn/articles` が最新3件を返すことを確認します。取得に失敗した場合は Workers のログを確認してください。
3. `profile.milix-m.com` の既存 DNS レコードを控えてから、Worker に同名のカスタムドメインを設定します。本番のトップページと記事 API を確認した後、GitHub Pages の定期デプロイを無効化します。切り替えに失敗した場合は Worker のカスタムドメインを外し、控えた DNS レコードを復元します。

ローカルでは、ビルド後に次のコマンドで定期処理を試せます。

```bash
npm run build
npx wrangler dev --test-scheduled
curl 'http://localhost:8787/cdn-cgi/handler/scheduled'
curl 'http://localhost:8787/api/zenn/articles'
```
