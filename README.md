# milix-profile

Astro で構築したポートフォリオサイトです。プロフィール、経歴、技術スタック、記事一覧などを表示できる構成になっています。

- 公開サイト: [profile.milix-m.com](https://profile.milix-m.com/)
- リポジトリ: [Milix-M/milix-profile](https://github.com/Milix-M/milix-profile)


## 構成

このリポジトリは、ポートフォリオサイトを構築するための実用的なテンプレート兼実装例です。主な構成を表にまとめます。

| 項目 | 内容 |
| --- | --- |
| ページ構成 | `src/pages` にトップページなどの静的ページを配置。各ページは Astro コンポーネントで構成し、必要であれば部分的に React を組み合わせます。 |
| レイアウト | `src/layouts/Layout.astro` で共通ヘッダー／フッター／メタ情報（SEO）を管理。ページ間で一貫した UI を提供します。 |
| コンポーネント分割 | `src/components` を機能別に分割（プロフィール、記事一覧、職歴、技術スタックなど）。再利用性を優先した設計です。 |
| データ取得 | Astro のビルド時に Zenn の RSS から最新3記事を取得し、HTML に含めます。 |
| アナリティクス | `src/components/common/GoogleAnalytics.astro` で Partytown 経由の Google Analytics を設定し、メインスレッド負荷を低減します。 |
| スタイル | Tailwind CSS を採用。`src/styles/global.css` に基本設定を置き、ユーティリティクラスでレスポンシブ対応します。 |
| 画像・公開資産 | `public/images` にアセットを格納。CNAME 等のデプロイ関連ファイルも `public` 配下に配置。 |
| ビルドとデプロイ | GitHub Actions で Astro のビルド出力を GitHub Pages に公開します。 |


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
| デプロイ / CI | GitHub Actions / GitHub Pages | Astro の静的ファイルを公開 |

## GitHub Pages へのデプロイ

`main` への push と、毎日9時（日本時間）の定期実行で `profile.milix-m.com` を更新します。実際の開始時刻は GitHub Actions の混雑状況によって遅れることがあります。

すぐに反映したい場合は、GitHub の **Actions → Deploy to GitHub Pages → Run workflow** から `main` を選んで実行します。Zenn の RSS を取得できない場合はビルドが失敗し、公開済みのページが引き続き表示されます。
