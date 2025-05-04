# TODOリスト

## Step3: ESLint + Prettier + Husky + lint-staged 設定

- [x] 現状の確認とインストール済みパッケージの確認

  - 完了条件: 既存のESLint設定とインストールされているパッケージの状態を把握

- [x] 必要なパッケージのインストール

  - [x] Prettierのインストール
  - [x] AirBnB設定のインストール
  - [x] Tailwind CSS用プラグインのインストール
  - [x] Husky + lint-stagedのインストール
  - 完了条件: すべての必要なパッケージがpackage.jsonに含まれている

- [x] ESLint設定ファイルの作成・設定

  - [x] AirBnB設定の適用
  - [x] TypeScript設定の適用
  - [x] React関連の設定
  - [x] Tailwind CSS用設定
  - 完了条件: `pnpm run lint`でエラーが0となる

- [x] Prettier設定ファイルの作成

  - [x] ESLintとの連携設定（eslint-config-prettier）
  - 完了条件: `pnpm run format`コマンドが動作する

- [x] Husky + lint-stagedの設定

  - [x] pre-commitフックの設定
  - 完了条件: コミット前に自動的にlintとフォーマットが実行される

- [x] VSCode用設定ファイルの追加

  - 完了条件: `.vscode/settings.json`が適切に設定されている

- [ ] 動作確認

  - [x] ESLintの動作確認済み（警告修正完了）
  - [x] Prettierの動作確認済み（フォーマット完了）
  - [ ] コードを意図的に崩してcommitテスト（失敗確認）
  - [ ] 修正してcommitテスト（成功確認）
  - 完了条件: コミット前のフックが正しく動作する

- [ ] AI_Docs/step.mdの更新

  - 完了条件: Step3に(done)が追記されている

- [ ] GitHub PRの作成
  - 完了条件: PRが正しく作成され、CIが成功する
