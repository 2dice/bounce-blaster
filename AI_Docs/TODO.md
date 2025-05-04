# TODOリスト - Step 4: Vitest + React Testing Library 導入

## 概要

このステップでは、Vitestと@testing-library/reactを導入して、テスト環境を整備します。

## タスク

- [x] 現在の環境状態確認
  - [x] プロジェクト構造確認
  - [x] 既存のpackage.jsonの依存関係確認
  - [x] 完了条件: プロジェクトの現状を正確に把握している
- [x] Vitestと関連パッケージのインストール

  - [x] `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom happy-dom`のコマンド実行
  - [x] インストール成功確認
  - [x] 完了条件: すべてのパッケージが正常にインストールされている

- [x] Vitestの設定ファイル作成

  - [x] `vitest.config.ts`ファイルの作成
  - [x] ESBuild aliasやその他の必要な設定を構成
  - [x] 完了条件: 設定ファイルが問題なく動作することを確認

- [x] テスト用のセットアップファイル作成

  - [x] `tests/setup.ts`ファイルの作成
  - [x] Testing Libraryの拡張マッチャーをインポート
  - [x] 完了条件: セットアップファイルがテスト実行時に問題なく読み込まれる

- [x] サンプルテストの作成

  - [x] App.tsxのテストファイルを作成
  - [x] Appコンポーネントが「Hello」テキストを含むかのテスト実装
  - [x] 完了条件: `pnpm test`でテストが成功すること

- [x] GitHub Actionsへのテスト実行追加

  - [x] `.github/workflows/ci.yml`の更新
  - [x] `pnpm test --run`のコマンド追加
  - [x] 完了条件: CIワークフローでテストが正常に実行されることを確認

- [x] コミットとPRの作成
  - [x] 変更内容をgitにコミット
  - [x] GitHub CLIを使用してPRを作成
  - [x] 完了条件: CIがパスし、デプロイが成功していること

## 備考

- Vitestはブラウザのような環境をエミュレートするためにjsdomかhappy-domが必要
- 以降のすべての機能開発でテストを追加していく基盤になる重要な作業
