# kintone Customization Template

## English

### Overview

This project provides a template for customizing kintone using [esbuild](https://esbuild.github.io/) and modern frontend tools.  
You can easily build, bundle, and serve your JavaScript/CSS for kintone customization.

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- **OpenSSL** (for generating a local development certificate)

### Initial Setup

Before starting development, you need to generate a self-signed SSL certificate for local HTTPS server:

```sh
mkdir .cert && openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1
```

This will create `.cert/private.key` and `.cert/private.cert` for local HTTPS.

### Installation

```sh
npm install

npx kintone-dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/js/fields.d.ts"
```

### Usage

#### Development Mode (with local server & watch)

```sh
npm run build:dev
```

or

```sh
node scripts/esbuild/build.mjs --mode=development
```

- Starts a local HTTPS server at [https://localhost:9000](https://localhost:9000)
- Watches for file changes and rebuilds automatically

#### Production Build

```sh
npm run build:prod
```

or

```sh
node scripts/esbuild/build.mjs --mode=production
```

- Outputs bundled files to the `dist` directory

### Directory Structure

```
src/
  js/
    index.js
  scss/
    style.scss
dist/
scripts/
  esbuild/
    build.mjs
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
```

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone カスタマイズ用のテンプレートです。  
JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

### 前提条件

- Node.js（推奨: v18以上）
- npm または yarn
- **OpenSSL**（ローカル開発用証明書の作成に必要）

### 初期セットアップ

開発を始める前に、ローカルHTTPSサーバー用の自己署名証明書を作成してください：

```sh
mkdir .cert && openssl req -x509 -newkey rsa:4096 -keyout .cert/private.key -out .cert/private.cert -days 9999 -nodes -subj /CN=127.0.0.1
```

これにより `.cert/private.key` と `.cert/private.cert` が作成されます。

### インストール

```sh
npm install

npx kintone-dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/js/fields.d.ts"
```

### 使い方

#### 開発モード（ローカルサーバー＆ウォッチ付き）

```sh
npm build:dev
```

または

```sh
node scripts/esbuild/build.mjs --mode=development
```

- [https://localhost:9000](https://localhost:9000) でローカルHTTPSサーバーが起動します
- ファイル変更を監視し、自動で再ビルドします

#### 本番ビルド

```sh
npm build:prod
```

または

```sh
node scripts/esbuild/build.mjs --mode=production
```

- `dist` ディレクトリにバンドル済みファイルが出力されます

### ディレクトリ構成

```
src/
  js/
    index.js
  scss/
    style.scss
dist/
scripts/
  esbuild/
    build.mjs
    plugins/
      serve-mode-plugin.mjs
.cert/
  private.key
  private.cert
```
