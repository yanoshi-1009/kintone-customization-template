# kintone Customization Template

## English

### Overview

This project provides a template for customizing kintone using [esbuild](https://esbuild.github.io/) and modern frontend tools.
You can easily build, bundle, and serve your JavaScript/CSS for kintone customization.

**Key tools & libraries included:**

- [esbuild](https://esbuild.github.io/) — fast JavaScript/CSS bundler
- [TypeScript](https://www.typescriptlang.org/) v7 (native compiler) — type-safe development
- [ESLint](https://eslint.org/) (`@cybozu/eslint-config`) — linting
- [Prettier](https://prettier.io/) — code formatting
- [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client) — kintone REST API client
- [kintone-ui-component](https://kintone-ui-component.netlify.app/) — kintone UI components
- [dayjs](https://day.js.org/) — date utility library
- [Chart.js](https://www.chartjs.org/) — canvas-based charting library

### Prerequisites

- Node.js (v26 or later) — the init and build scripts are `.ts` files executed directly by Node, relying on its native TypeScript type stripping (there is no separate transpile step for them)
- pnpm (v11 or later)
- [mise](https://mise.jdx.dev/) — recommended for managing Node.js and pnpm versions
- [mkcert](https://github.com/FiloSottile/mkcert) — for generating a locally-trusted development certificate

These versions are declared in `engines` / `devEngines` in `package.json`.
`devEngines` is configured with `onFail: "error"`, so pnpm aborts with an error instead of a warning when the active Node.js or pnpm version does not satisfy the requirement.

#### Managing Node.js and pnpm with mise

This project pins Node.js and pnpm versions via [`mise.toml`](./mise.toml):
After cloning the repository, activate the pinned tools from the project root:

```bash
mise install   # installs the versions declared in mise.toml
```

Once mise is active in your shell, `node` and `pnpm` will resolve to the versions declared in `mise.toml` whenever you are inside this project directory.

#### Install mkcert (one-time setup per machine)

```bash
# macOS
brew install mkcert
mkcert -install

# Windows (Chocolatey)
choco install mkcert
mkcert -install

# Windows (Scoop)
scoop bucket add extras
scoop install mkcert
mkcert -install
```

### Initial Setup

```bash
pnpm run init
```

This script (`scripts/init.ts`):

- Creates the `.cert` directory and a locally-trusted certificate via `mkcert`
- Installs dependencies with `pnpm install`
- Removes the template-only file (`renovate.json`) if present

### TypeScript Setup (v7 native)

Type checking runs on **TypeScript v7**, the native (Go) compiler, which is dramatically faster than the JavaScript implementation.

Because of this, the two TypeScript entries in `package.json` are aliased and look inverted at first glance:

```json
"@typescript/native": "npm:typescript@7.0.2",
"typescript": "npm:@typescript/typescript6@6.0.2"
```

| Command | Actual package                  | Purpose                                                             |
| ------- | ------------------------------- | ------------------------------------------------------------------- |
| `tsc`   | `typescript@7.0.2` (native)     | Type check in `build:dev` / `build:prod`                            |
| `tsc6`  | `@typescript/typescript6@6.0.2` | Tooling that needs the TypeScript JavaScript API, and as a fallback |

The `typescript` **package name** is deliberately mapped to the v6 (JavaScript) implementation. The reasons:

- Tools such as typescript-eslint (used internally by `@cybozu/eslint-config`) do not invoke `tsc` as a command. They `import` the `typescript` package and drive the compiler through its **JavaScript API** — `ts.createProgram()`, the AST types, and so on.
- What the v7 native package ships is a Go binary. Its root entry point only returns a version string, and the sole programmatic surface it offers is a new API under `@typescript/native/unstable/*` — explicitly marked unstable and shaped differently from the classic one. The traditional `typescript` API is not included.
- Pointing the `typescript` package name at v7 would therefore break every tool that relies on that API.

In short: **the CLI type check runs on the fast v7, while the API that tools import stays on v6.** The two are kept side by side on purpose.

> **Future cleanup:** once v7 offers a stable compiler API and typescript-eslint and friends support it, this split becomes unnecessary. At that point the setup can be tidied up as follows:
>
> - Collapse the two `package.json` entries back into a single `"typescript": "7.x.x"`
> - Remove `@typescript/native` and the `tsc6` fallback described below
> - Revisit `js/ts.experimental.useTsgo` in `.vscode/settings.json` (the `experimental` prefix is expected to be dropped)

If you run into a v7-specific problem, you can type check with the v6 compiler instead:

```bash
pnpm exec tsc6 --noEmit
```

#### Editor (VS Code)

[`.vscode/settings.json`](./.vscode/settings.json) enables the native language server so the editor matches the CLI:

```json
{
  "js/ts.experimental.useTsgo": true
}
```

This requires a VS Code version that supports the native TypeScript language server. Older versions simply ignore the setting and fall back to the JavaScript-based server.

### Generating Type Definitions

Generate TypeScript type definitions for your kintone app fields:

```bash
pnpm exec kintone-dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/types/fields.d.ts"
```

### Usage

#### Development Mode (with local server & watch)

```bash
pnpm build:dev
```

- Runs TypeScript type check (`tsc --noEmit`) before building
- Starts a local HTTPS server at [https://localhost:9000](https://localhost:9000)
- Watches for file changes and rebuilds automatically
- Outputs bundled files with inline source maps to the `dist` directory

#### Production Build

```bash
pnpm build:prod
```

- Runs TypeScript type check (`tsc --noEmit`) before building
- Outputs minified, bundled files to the `dist` directory (no source maps)

#### Lint & Format

```bash
pnpm lint        # Check with ESLint
pnpm lint:fix    # Check with ESLint and auto-fix
pnpm format      # Format with Prettier
pnpm typecheck   # Type check both src/ and scripts/
```

Paths excluded from formatting are listed in [`.prettierignore`](./.prettierignore).

### Directory Structure

```text
src/
  eslint.config.js      # ESLint config scoped to src/ (kintone global)
  index.ts              # Entry point (desktop)
  mobile.ts             # Entry point (mobile)
  api/                  # Wrappers for @kintone/rest-api-client (.gitkeep keeps the empty dir tracked)
  components/           # UI parts built with kintone-ui-component (.gitkeep keeps the empty dir tracked)
  constants/
    config.ts           # App configuration constants
  i18n/
    index.ts            # i18next init, language resolution, and type augmentation
    locales/
      en.ts             # Source of truth for translation keys and interpolation types
      ja.ts             # Japanese translations (structurally constrained by en's type)
  styles/
    style.css           # Entry point for CSS (desktop)
    mobile.css          # Entry point for CSS (mobile)
    common.css          # Shared styles
  types/
    fields.d.ts         # kintone app field types (generated by @kintone/dts-gen)
  utils/                # Pure utility functions (e.g. dayjs wrappers) (.gitkeep keeps the empty dir tracked)
dist/                   # Build output
scripts/
  init.ts               # Initialization script
  tsconfig.json         # Type check config for scripts/
  esbuild/
    build.ts            # esbuild build script
    plugins/
      build-log-plugin.ts
.cert/                  # Locally-trusted certificate (generated)
  private.key
  private.cert
.vscode/
  settings.json         # Enables the native TypeScript language server (useTsgo)
eslint.config.js        # ESLint configuration (project root)
prettier.config.ts      # Prettier configuration
.prettierignore         # Paths excluded from Prettier
tsconfig.json
mise.toml               # Node.js / pnpm version pinning for mise
pnpm-workspace.yaml     # pnpm workspace settings (allowBuilds, etc.)
```

> **Scaling tip:** For small-to-medium customizations, writing event handlers directly in `index.ts` is recommended.
> If the file grows large, split handlers into an `events/` directory (e.g. `events/index-show.ts`, `events/record-create.ts`) and re-export them from `index.ts`.
>
> **CSS handling:** CSS is intentionally kept as a separate entry point rather than imported from `index.ts`.
> kintone loads CSS in `<head>` before scripts run, which prevents the Flash of Unstyled Content (FOUC) that would occur with JavaScript-based style injection at runtime.

---

## 日本語

### 概要

このプロジェクトは、[esbuild](https://esbuild.github.io/) とモダンなフロントエンドツールを使った kintone カスタマイズ用のテンプレートです。
JavaScript/CSS のビルド・バンドル・サーブを簡単に行えます。

**主なツール・ライブラリ：**

- [esbuild](https://esbuild.github.io/) — 高速な JavaScript/CSS バンドラー
- [TypeScript](https://www.typescriptlang.org/) v7（native コンパイラ）— 型安全な開発
- [ESLint](https://eslint.org/)（`@cybozu/eslint-config`）— リント
- [Prettier](https://prettier.io/) — コードフォーマット
- [@kintone/rest-api-client](https://github.com/kintone/js-sdk/tree/main/packages/rest-api-client) — kintone REST API クライアント
- [kintone-ui-component](https://kintone-ui-component.netlify.app/) — kintone UI コンポーネント
- [dayjs](https://day.js.org/) — 日付ユーティリティライブラリ
- [Chart.js](https://www.chartjs.org/) — canvas ベースのグラフ描画ライブラリ

### 前提条件

- Node.js（v26 以上）— 初期化スクリプトとビルドスクリプトは `.ts` ファイルを Node が直接実行しており、Node のネイティブ TypeScript 型ストリッピングに依存しています（これらに個別のトランスパイル手順はありません）
- pnpm（v11 以上）
- [mise](https://mise.jdx.dev/) — Node.js と pnpm のバージョン管理（推奨）
- [mkcert](https://github.com/FiloSottile/mkcert) — ブラウザに信頼されたローカル開発用証明書を生成するために必要

これらのバージョンは `package.json` の `engines` / `devEngines` で宣言しています。
`devEngines` は `onFail: "error"` を設定しているため、実行中の Node.js / pnpm のバージョンが要件を満たさない場合、警告ではなくエラーで停止します。

#### mise による Node.js / pnpm のバージョン管理

このプロジェクトでは、[`mise.toml`](./mise.toml) で Node.js と pnpm のバージョンを固定しています：
リポジトリをクローン後、プロジェクトルートで `mise.toml` に書かれたツールをアクティブにします：

```bash
mise install   # mise.toml に書かれたバージョンをインストール
```

シェルで mise がアクティブになっていれば、このプロジェクト内では `mise.toml` で固定されたバージョンの `node` と `pnpm` が自動的に使われます。

#### mkcert のインストール（マシンごとに 1 回だけ実行）

```bash
# macOS
brew install mkcert
mkcert -install

# Windows (Chocolatey)
choco install mkcert
mkcert -install

# Windows (Scoop)
scoop bucket add extras
scoop install mkcert
mkcert -install
```

### 初期セットアップ

```bash
pnpm run init
```

このスクリプト（`scripts/init.ts`）は以下を行います：

- `.cert` ディレクトリと `mkcert` によるローカル信頼済み証明書を作成
- `pnpm install` で依存パッケージをインストール
- テンプレート専用ファイル（`renovate.json`）が残っていれば削除

### TypeScript の構成（v7 native）

型チェックには **TypeScript v7**（Go 製の native コンパイラ）を使用しています。JavaScript 実装に比べて型チェックが大幅に高速です。

そのため、`package.json` の TypeScript 関連の 2 行は一見すると逆に見えるエイリアス指定になっています：

```json
"@typescript/native": "npm:typescript@7.0.2",
"typescript": "npm:@typescript/typescript6@6.0.2"
```

| コマンド | 実体のパッケージ                | 用途                                                                      |
| -------- | ------------------------------- | ------------------------------------------------------------------------- |
| `tsc`    | `typescript@7.0.2`（native）    | `build:dev` / `build:prod` の型チェック                                   |
| `tsc6`   | `@typescript/typescript6@6.0.2` | TypeScript の JavaScript API を必要とするツール向け、およびフォールバック |

`typescript` という**パッケージ名**を v6（JavaScript 実装）に割り当てているのは意図的です。理由は次のとおりです。

- typescript-eslint（`@cybozu/eslint-config` が内部で利用）などのツールは、`tsc` をコマンドとして実行するのではなく、`typescript` パッケージを `import` して **JavaScript API**（`ts.createProgram()` や AST の型など）経由でコンパイラを操作します。
- 一方 v7 の native パッケージが同梱しているのは Go 製のバイナリです。ルートのエントリポイントはバージョン文字列を返すだけで、プログラムから利用できるのは `@typescript/native/unstable/*` 配下の新しい API のみ（名前のとおり unstable と明示されており、従来とは形も異なります）。従来の `typescript` の API は含まれていません。
- そのため `typescript` というパッケージ名を v7 に向けると、この API に依存するツールがすべて動かなくなります。

つまり、**CLI の型チェックは高速な v7、ツールが import する API は従来どおり v6** という住み分けを意図的に行っています。

> **将来的な整理：** v7 が安定したコンパイラ API を提供し、typescript-eslint などが対応した時点で、この使い分けは不要になります。そのときは以下のように整理できます。
>
> - `package.json` の 2 行を `"typescript": "7.x.x"` の 1 行にまとめる
> - `@typescript/native` と、後述の `tsc6` によるフォールバックを削除する
> - `.vscode/settings.json` の `js/ts.experimental.useTsgo` を見直す（`experimental` が外れる見込み）

v7 固有の問題に遭遇した場合は、v6 のコンパイラで型チェックできます：

```bash
pnpm exec tsc6 --noEmit
```

#### エディタ（VS Code）

[`.vscode/settings.json`](./.vscode/settings.json) で native な言語サーバーを有効化し、CLI と挙動を揃えています：

```json
{
  "js/ts.experimental.useTsgo": true
}
```

この設定には native TypeScript 言語サーバーに対応した VS Code が必要です。対応していないバージョンでは設定が無視され、従来の JavaScript ベースのサーバーが使われます。

### 型定義の生成

kintone アプリのフィールド型定義ファイルを生成します：

```bash
pnpm exec kintone-dts-gen --base-url https://***.cybozu.com -u <username> -p <password> --app-id <appId> --type-name <appName> -o "./src/types/fields.d.ts"
```

### 使い方

#### 開発モード（ローカルサーバー＆ウォッチ付き）

```bash
pnpm build:dev
```

- ビルド前に TypeScript 型チェック（`tsc --noEmit`）を実行
- [https://localhost:9000](https://localhost:9000) でローカル HTTPS サーバーを起動
- ファイル変更を監視し、自動で再ビルド
- インラインソースマップ付きで `dist` ディレクトリへ出力

#### 本番ビルド

```bash
pnpm build:prod
```

- ビルド前に TypeScript 型チェック（`tsc --noEmit`）を実行
- ソースマップなし・minify 済みのファイルを `dist` ディレクトリへ出力

#### リント & フォーマット

```bash
pnpm lint        # ESLint によるチェック
pnpm lint:fix    # ESLint によるチェックと自動修正
pnpm format      # Prettier によるフォーマット
pnpm typecheck   # src/ と scripts/ の両方を型チェック
```

フォーマット対象から除外するパスは [`.prettierignore`](./.prettierignore) に記載しています。

### ディレクトリ構成

```text
src/
  eslint.config.js      # src/ 用 ESLint 設定（kintone グローバルを定義）
  index.ts              # エントリーポイント（PC）
  mobile.ts             # エントリーポイント（モバイル）
  api/                  # @kintone/rest-api-client のラッパー（.gitkeep で空ディレクトリを git 管理下に維持）
  components/           # kintone-ui-component を使った UI 部品（.gitkeep で空ディレクトリを git 管理下に維持）
  constants/
    config.ts           # アプリ設定定数
  i18n/
    index.ts            # i18next 初期化・言語判定・型拡張
    locales/
      en.ts             # 翻訳キーと補間変数の「正」となるロケール
      ja.ts             # 日本語訳（en の構造に型で拘束される）
  styles/
    style.css           # CSS エントリーポイント（PC）
    mobile.css          # CSS エントリーポイント（モバイル）
    common.css          # 共通スタイル
  types/
    fields.d.ts         # kintone アプリフィールド型定義（@kintone/dts-gen による生成ファイル）
  utils/                # 純粋なユーティリティ関数（dayjs ラッパー等）（.gitkeep で空ディレクトリを git 管理下に維持）
dist/                   # ビルド出力先
scripts/
  init.ts               # 初期化スクリプト
  tsconfig.json         # scripts/ 用の型チェック設定
  esbuild/
    build.ts            # esbuild ビルドスクリプト
    plugins/
      build-log-plugin.ts
.cert/                  # ローカル信頼済み証明書（生成物）
  private.key
  private.cert
.vscode/
  settings.json         # native TypeScript 言語サーバーを有効化（useTsgo）
eslint.config.js        # ESLint 設定（プロジェクトルート）
prettier.config.ts      # Prettier 設定
.prettierignore         # Prettier の対象外パス
tsconfig.json
mise.toml               # mise による Node.js / pnpm バージョン固定
pnpm-workspace.yaml     # pnpm ワークスペース設定（allowBuilds 等）
```

> **規模拡大時の指針：** 小〜中規模のカスタマイズでは、イベントハンドラを `index.ts` に直接記述することを推奨します。
> ファイルが大きくなってきたら、`events/` ディレクトリに分割（例：`events/index-show.ts`、`events/record-create.ts`）し、`index.ts` から re-export する構成に移行できます。
>
> **CSS の扱い：** CSS はあえて独立したエントリポイントとして分離しています。
> kintone は CSS を `<head>` でスクリプトより先に読み込むため、JS から実行時に注入する方式で起きうるスタイル未適用の一瞬の表示崩れを防げます。
