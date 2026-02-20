# kintone Customization Template

## English

### Overview

This project provides a template for customizing kintone using [esbuild](https://esbuild.github.io/) and modern frontend tools.
You can easily build, bundle, and serve your JavaScript/CSS for kintone customization.

**Key tools & libraries included:**

- [esbuild](https://esbuild.github.io/) — fast JavaScript/CSS bundler
- [TypeScript](https://www.typescriptlang.org/) — type-safe development
- [ESLint](https://eslint.org/) (`@cybozu/eslint-config`) — linting
- [Prettier](https://prettier.io/) — code formatting
- [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client) — kintone REST API client
- [kintone-ui-component](https://kintone-ui-component.netlify.app/) — kintone UI components
- [axios](https://axios-http.com/), [dayjs](https://day.js.org/), [sweetalert2](https://sweetalert2.github.io/) — utility libraries

### Prerequisites

- Node.js v20, v22, or v24
- pnpm v10 or later
- **OpenSSL** (for generating a local development certificate)

### Initial Setup

Before starting development, generate a self-signed SSL certificate for local HTTPS:

```sh
mkdir .cert && openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1
```

This will create `.cert/private.key` and `.cert/private.cert` for local HTTPS.

### Installation

```sh
pnpm install
```

### Generating Type Definitions

Generate TypeScript type definitions for your kintone app fields:

```sh
pnpm dlx @kintone/dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/js/fields.d.ts"
```

### Usage

#### Development Mode (with local server & watch)

```sh
pnpm build:dev
```

or

```sh
node scripts/esbuild/build.mjs --mode=development
```

- Runs TypeScript type check (`tsc --noEmit`) before building
- Starts a local HTTPS server at [https://localhost:9000](https://localhost:9000)
- Watches for file changes and rebuilds automatically

#### Production Build

```sh
pnpm build:prod
```

or

```sh
node scripts/esbuild/build.mjs --mode=production
```

- Runs TypeScript type check (`tsc --noEmit`) before building
- Outputs minified, bundled files to the `dist` directory (no sourcemaps)

### Directory Structure

```text
src/
  js/
    index.ts          # Entry point
    fields.d.ts       # kintone app field types (generated)
    constant/
      config.ts       # App configuration constants
  style/
    style.css         # Entry point for CSS
dist/                 # Build output
scripts/
  esbuild/
    build.mjs         # esbuild build script
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
eslint.config.js      # ESLint configuration
prettier.config.ts    # Prettier configuration
tsconfig.json
```

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone カスタマイズ用のテンプレートです。
JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

**主なツール・ライブラリ：**

- [esbuild](https://esbuild.github.io/) — 高速な JavaScript/CSS バンドラー
- [TypeScript](https://www.typescriptlang.org/) — 型安全な開発
- [ESLint](https://eslint.org/)（`@cybozu/eslint-config`）— リント
- [Prettier](https://prettier.io/) — コードフォーマット
- [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client) — kintone REST API クライアント
- [kintone-ui-component](https://kintone-ui-component.netlify.app/) — kintone UI コンポーネント
- [axios](https://axios-http.com/)、[dayjs](https://day.js.org/)、[sweetalert2](https://sweetalert2.github.io/) — ユーティリティライブラリ

### 前提条件

- Node.js v20、v22、または v24
- pnpm v10以上
- **OpenSSL**（ローカル開発用証明書の作成に必要）

### 初期セットアップ

開発を始める前に、ローカルHTTPSサーバー用の自己署名証明書を作成してください：

```sh
mkdir .cert && openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1
```

これにより `.cert/private.key` と `.cert/private.cert` が作成されます。

### インストール

```sh
pnpm install
```

### 型定義の生成

kintone アプリのフィールド型定義ファイルを生成します：

```sh
pnpm dlx @kintone/dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/js/fields.d.ts"
```

### 使い方

#### 開発モード（ローカルサーバー＆ウォッチ付き）

```sh
pnpm build:dev
```

または

```sh
node scripts/esbuild/build.mjs --mode=development
```

- ビルド前に TypeScript 型チェック（`tsc --noEmit`）を実行します
- [https://localhost:9000](https://localhost:9000) でローカルHTTPSサーバーが起動します
- ファイル変更を監視し、自動で再ビルドします

#### 本番ビルド

```sh
pnpm build:prod
```

または

```sh
node scripts/esbuild/build.mjs --mode=production
```

- ビルド前に TypeScript 型チェック（`tsc --noEmit`）を実行します
- ソースマップなし・minify済みのファイルを `dist` ディレクトリへ出力します

### ディレクトリ構成

```text
src/
  js/
    index.ts          # エントリーポイント
    fields.d.ts       # kintone アプリフィールド型定義（生成ファイル）
    constant/
      config.ts       # アプリ設定定数
  style/
    style.css         # CSS エントリーポイント
dist/                 # ビルド出力先
scripts/
  esbuild/
    build.mjs         # esbuild ビルドスクリプト
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
eslint.config.js      # ESLint 設定
prettier.config.ts    # Prettier 設定
tsconfig.json
```
