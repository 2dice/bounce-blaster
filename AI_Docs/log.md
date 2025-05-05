# ログ

## Step1: Vite + React + TS + Tailwind 雛形 & Canvas プレースホルダ配置

### うまくいった手法/手順

- Viteプロジェクトの作成は`pnpm create vite@latest`コマンドで簡単にセットアップできた
- TailwindCSSのセットアップ手順：
  1. `pnpm add -D tailwindcss@3.4.17 postcss autoprefixer`でパッケージのインストール
  2. `npx tailwindcss init -p`で初期設定ファイルを生成
  3. tailwind.config.jsのcontentに`'./index.html', './src/**/*.{js,ts,jsx,tsx}'`を指定
  4. CSSファイルに`@tailwind`ディレクティブを追加

### 汎用的なナレッジ

- プロジェクトを正しく拡張できるよう、最初にファイル構造と依存関係を全体像として把握することが重要
- TailwindCSSを使ったスタイル指定は、後からのスタイル変更が簡単で柔軟性が高いことを確認
- コード実装前に、基本的なUI部品のサイズや配置を設計書から把握することで、実装の効率が大幅に向上

### 具体的なナレッジ

- TailwindCSSのv3.4.17を指定してインストールすることで、v4による予期せぬ変更を避けられる
- Canvas要素のサイズ指定は、Tailwindの任意値指定(`w-[960px] h-[720px]`)を使うことで正確なピクセル指定が可能
- VSCodeではTailwindの`@tailwind`ディレクティブが警告として表示されることがあるが、実際のビルドや実行には影響しない

## Step2: GitHub Pages デプロイパイプライン

### うまくいった手法/手順

- ViteでGitHub Pagesデプロイ用の設定は`vite.config.ts`に`base: '/bounce-blaster/'`を追加するだけで簡単に実現できた
- GitHub Actionsのワークフローファイルは以下の手順で作成:
  1. `.github/workflows`ディレクトリを作成
  2. `deploy.yml`ファイルに必要な設定を記述
  3. 最新のActionsバージョンを使用して信頼性を確保
- GitHub CLIを使ってPR作成することで、より効率的にワークフローを進められた

### 汎用的なナレッジ

- 小さなPRを順番に出して機能単位でマージすると、問題発生時の切り分けが明確になる
- Gitのブランチ戦略を最初に決めておくことで、チーム開発での混乱を防げる
- デプロイパイプラインはプロジェクトの早い段階で整備しておくことで、開発とテストのサイクルがスムーズになる

### 具体的なナレッジ

- GitHub Actionsのバージョンは定期的に更新されるため、最新バージョンを確認して指定することが重要
  - 2025年1月から`actions/upload-artifact`と`actions/download-artifact`はv4以上が必要
  - 不明点があれば公式リポジトリやドキュメントを確認する習慣づけが大切
- pnpmをCI環境で使う場合、ロックファイルが存在しないと`--frozen-lockfile`オプションでエラーになる
  - ロックファイルをリポジトリに含めるか、`--no-frozen-lockfile`オプションを使う必要がある
- GitHub CLIで日本語メッセージを使うときは文字化けに注意
  - ファイルに書き出して`--body-file`オプションを使うと安全

## Step3: ESLint + Prettier + Husky + lint-staged

### うまくいった手法/手順

- ESLint v9に対応するための設定は以下の手順で行った:
  1. `eslint.config.js`を作成し、フラットな設定形式を使用
  2. ESLint v9では従来のAirBnB設定を直接扱えないため、必要なルールを個別に適用
  3. TypeScriptとReactの設定を適切に連携
- Prettier導入手順:
  1. `pnpm add -D prettier eslint-config-prettier`でパッケージをインストール
  2. `.prettierrc.json`に基本設定を記述
  3. package.jsonの`scripts`に`format`コマンドを追加
  4. eslintと連携するために`eslint-config-prettier`を設定に追加
- Husky + lint-stagedのセットアップ:
  1. `pnpm dlx husky init`でHuskyを初期化
  2. `.husky/pre-commit`ファイルにlint-stagedを実行するコマンドを追加
  3. 実行権限を`chmod +x`で付与
  4. `.lintstagedrc`ファイルで各ファイル種別ごとの処理を定義

### 汎用的なナレッジ

- コード品質を保つための仕組みは、プロジェクトの早い段階で導入すると後の手戻りが少なくなる
- 自動フォーマット・リントの仕組みを導入することで、チーム開発でのコードスタイルの統一が容易になる
- 問題が発生したらまず単純な形で再現し、段階的に修正することで解決が早くなる
- コミット前のフックで自動チェックをするとエラーコードの混入を防げる

### 具体的なナレッジ

- ESLint v9から設定形式が大きく変わり、フラットな構造になった
  - AirBnBやstandardといった既存の設定パッケージとの互換性に問題があるケースがある
  - 必要に応じて個別にルールを適用する方法が有効
- Huskyのpre-commitフックファイルには必ず実行権限の付与が必要
  - `chmod +x .husky/pre-commit`を忘れるとフックが動作しない
  - 同様にファイルの内容が正しく改行されていることも重要
- VSCodeの設定ファイル`.vscode/settings.json`は`.gitignore`で除外されていることが多いので注意
  - チーム内で共有したい場合は`.gitignore`の設定を変更する必要がある
- npm/pnpmコマンドを使うときは、package.jsonで定義されたスクリプト名をチェックすることが重要
  - `npm run`と`pnpm run`で実行できるコマンドは異なることがあるため注意

## Step4: Vitest + React Testing Library 導入

### うまくいった手法/手順

- VitestとReact Testing Libraryの導入手順：
  1. `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom happy-dom`でパッケージをインストール
  2. `vitest.config.ts`にテスト環境設定（environment：'jsdom', globals：trueなど）を記述
  3. `tests/setup.ts`ファイルでjest-domマッチャーとクリーンアップを設定
  4. package.jsonに`test`と`test:run`スクリプトを追加
- GitHub ActionsのCIワークフロー設定：
  1. `.github/workflows/ci.yml`ファイルを作成
  2. push/pull_request時に自動実行されるようにトリガー設定
  3. lint、formatチェック、テストの三つのステップを設定

### 汎用的なナレッジ

- テスト環境はなるべく早い段階で導入しておくことで、テスト駆動開発（TDD）を実践しやすくなる
- テストではユーザーの振る舞いをシミュレートすることで、コンポーネントの実際の動作を検証できる
- CIパイプラインで自動テストを実行することで、バグの早期発見とリグレッション防止が可能になる
- 小さなテストから始めて少しずつ複雑なテストに移行すると、弊害切り分けがしやすくなる

### 具体的なナレッジ

- @testing-library/jest-domの最新バージョン（v6以上）では、インポート方法が変更されている
  - 古いバージョン：`import matchers from '@testing-library/jest-dom/matchers'`
  - 最新バージョン：`import '@testing-library/jest-dom'`（自動拡張）
- VitestではReactコンポーネントのテストにブラウザ環境のエミュレーションが必要
  - jsdomまhappy-domのどちらかを選択する必要がある
  - テストとメインコードのパス解決を一致させるため、vite.config.tsと同様のalias設定が必要
- GitHub Actionsのワークフローファイルは既存のCI/CD設定とスタイルを合わせることが重要
  - 同じプロジェクト内で設定が不揃いだとメンテナンスが困難になる
  - 最適化のために、キャッシュの有効活用や必要なステップのみの実行が重要

## Step5-1: データモデル定義 & 型テスト

### うまくいった手法/手順

- データモデル型定義の作成手順：
  1. `src/models`ディレクトリを作成
  2. `src/models/types.ts`に基本的なデータ型（Point, Rect, Stage, GameState）を定義
  3. 将来の拡張性を考慮して`readonly`修飾子を適用
  4. 型エラーを明確にキャッチするために厳密な型（リテラル型や共用型）を使用
- Vitestを使った型テスト作成手順：
  1. `tests/types.test.ts`ファイルを作成
  2. 正常系テストケースとエラー系テストケースを両方実装
  3. `@ts-expect-error`コメントを使って型エラーのテストを実装
  4. テストファイルに`@ts-nocheck`ディレクティブを追加して意図的な型エラーを抑制

### 汎用的なナレッジ

- データモデル定義はプロジェクトの基盤となるため、設計書の内容を正確に反映することが重要
- TypeScriptの型定義は、コードの品質向上と自己文書化の効果が高い
- 型テストはビルド時のみ機能するものなので、実行時エラーとは分けて考える必要がある
- TODOリストで作業を細分化して進めると、複雑な作業も確実に進められる

### 具体的なナレッジ

- TypeScriptの型テストでは、以下の手法が有効：
  - `@ts-expect-error`コメントで意図的な型エラーをテスト
  - 存在してはいけないケースを記述して型システムが正しく働くか検証
  - リテラル型（例：`1|2|3|4|5`）による厳密な型チェック
- ESLintやTypeScriptの警告は、以下の対処が効果的：
  - テストファイルでは`// @ts-nocheck`ディレクティブを使う
  - 意図的なエラーは`/* eslint-disable */`コメントでESLint警告を抑制
  - コメントで理由を記述して、チーム内での理解を促進
- 物理エンジン（matter.js）のような外部ライブラリを使う場合：
  - 型定義（@types/xxx）パッケージも一緒にインストールが必要
  - 型定義が古い場合は、拡張・上書きする方法も検討する
