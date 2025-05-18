# TODOリスト

# Step6　StageGenerator スタブ（固定ステージ）

## 完了条件

- `useStageGenerator` フックが呼び出されたら、10ms 以内に固定のステージデータを返すこと。
- ステージ生成後、ゲームのフェーズが `generating` から `aiming` に遷移すること。
- Vitest による単体テストが全てパスすること。

## タスク

- [x] `src/hooks/useStageGenerator.ts` ファイルを作成する
  - 完了条件: ファイルが指定のパスに作成されていること。
- [x] `useStageGenerator` フックを実装する
  - [x] `Stage` 型をインポートする (まだ存在しない場合は仮の型定義を `src/models/types.ts` に作成する)
  - [x] 固定の `Stage` オブジェクトを返すようにする
    - `cannon` の位置 (例: `{ x: 50, y: 500 }`)
    - `target` の位置 (例: `{ x: 750, y: 100 }`)
    - `walls` は空配列 `[]` でOK
  - [x] `Promise<Stage>` を返すようにする
  - [x] 10ms の遅延を `setTimeout` で擬似的に再現する
  - 完了条件: フックが上記仕様通りに実装されていること。
- [x] `useGameReducer` フックでステージ生成中の状態と、生成完了後の状態遷移を実装する
  - [x] `gameReducer` に `GENERATE_STAGE_REQUEST` アクションを追加し、`phase` を `generating` に設定する (既存の `ActionTypes.GENERATING` を利用)
  - [x] `gameReducer` に `GENERATE_STAGE_SUCCESS` アクションを追加し、`phase` を `aiming` に、`stage` をペイロードの値に設定する (既存の `ActionTypes.READY` を利用)
  - [x] `App.tsx` (または適切な場所) で `useStageGenerator` を呼び出し、ステージ生成をトリガーする
    - [x] `useEffect` を使って、適切なタイミング（例えば `phase` が `ready` の時など）でステージ生成を開始する
    - [x] ステージ生成開始時に `GENERATE_STAGE_REQUEST` (`ActionTypes.GENERATING`) を dispatch する
    - [x] `useStageGenerator` からステージデータが返ってきたら `GENERATE_STAGE_SUCCESS` (`ActionTypes.READY`) を dispatch する
  - 完了条件: `dispatch` により `phase` が期待通りに遷移し、`stage` データが更新されること。
- [x] `useStageGenerator.test.ts` を作成し、単体テストを記述する
  - [x] `useStageGenerator.test.ts` ファイルを作成し、テストの骨組みとヘルパー（比較用定数など）を準備する
  - [x] `useStageGenerator` が固定の `cannon` と `target` の座標を返すことを確認するテスト
  - [x] 10ms 以上の時間が経過した後に `Stage` オブジェクトが返されることを確認するテスト (Vitest の `fakeTimers` を使用)
  - 完了条件: 全てのテストがパスすること。

1.  **開発サーバー起動時に画面が真っ白になる問題を解決する** 🕵️‍♀️

    - 完了条件: アプリが以前のように正常に表示されること。
    - サブタスク:
      - [ ] `pnpm run dev` を実行する。
      - [ ] ブラウザの開発者コンソールを開いて、エラーメッセージや [App.tsx] に仕込んだ `console.log` の出力を確認する。
      - [ ] ログを分析して、`generateStage` が期待通りに動作していない原因を特定する。
      - [ ] 原因を特定したら、コードを修正する。
      - [ ] 修正後、再度 `pnpm run dev` で表示を確認する。

2.  **`useStageGenerator.test.ts` のテスト内容を確認・修正する。** 🧪

    - 完了条件: `useStageGenerator` フックの最近の変更（`useState` と `useEffect` を使った初期化方法の変更）を考慮しても、テストが依然として正しく機能の検証を行っていることを確認・保証すること。必要であればテストケースを修正する。
    - サブタスク:
      - [ ] `useStageGenerator.ts` の変更点を再確認する。
      - [ ] `useStageGenerator.test.ts` のテストが、変更後のロジックを正しくカバーできているか確認する。
      - [ ] 必要であれば、テストのアサーションやセットアップを修正する。
      - [ ] `pnpm run test` を実行して、テストがパスすることを確認する。

3.  **デバッグ用の `console.log` を削除する。** 🧹

    - 完了条件: 問題解決後、不要になったデバッグ用 `console.log` がコードから削除されていること。
    - 対象ファイル: [src/App.tsx] など。

4.  最終確認

- [ ] Formatter (`pnpm run format`) を実行する
- [ ] Linter (`pnpm run lint`) を実行して問題を修正する
- [ ] TypeScript の型エラー (`tsc --noEmit`) を確認、修正する
- [ ] `pnpm run dev` で開発サーバーを起動する

* [ ] 動作確認

- 完了条件: ブラウザでゲームを起動し、コンソールログや React DevTools で `phase` が `generating` → `aiming` に遷移し、`stage` データが設定されていることを確認する。\* [x] `App.test.tsx` に初期 `generating` フェーズのUI（一時的なインジケータ）表示と非表示を確認するテストを追加する。
  - [ ] 一時的なテスト用インジケータを削除する。
    - 完了条件: `App.tsx` からテスト用の `generating-indicator` が削除されていること。

## 時系列 TODO

1.  `src/models/types.ts` に (必要であれば) `Stage` 型を仮定義
2.  `src/hooks/useStageGenerator.ts` 作成 & 実装
3.  `src/models/reducer.ts` と `src/hooks/useGameReducer.tsx` (または関連ファイル) を修正して、ステージ生成アクションと状態遷移を実装
4.  `App.tsx` (または適切な場所) で `useStageGenerator` を呼び出す処理を追加
5.  `src/hooks/useStageGenerator.test.ts` 作成 & テスト記述
6.  `pnpm run test` でテスト実行 & パス確認
7.  ブラウザで動作確認
8.  `git add . && git commit -m "feat: implement stub StageGenerator and phase transition"`
9.  `git add . && git commit -m "feat: implement stub StageGenerator and phase transition"`

- [x] lint の警告・エラーを修正する。
- [x] `useStageGenerator.test.ts` を `src/hooks` から `tests` ディレクトリに移動する。
- [x] `reducer.test.ts`と`types.test.ts`のeslint無視設定が、今回変更した`eslint.config.js`での設定変更に合っているかを確認する。
  - 完了条件: 確認が完了し、必要な修正があれば対応されること。
  - サブタスク:
    - [x] `eslint.config.js` の内容を再確認する。
    - [x] `tests/reducer.test.ts` の内容を確認し、eslint無視設定を評価する。
    - [x] `tests/types.test.ts` の内容を確認し、eslint無視設定を評価する。
    - [x] `tests/useStageGenerator.test.ts` の内容を確認し、eslint無視設定を評価する (該当なし)。
- [x] `reducer.test.ts`と`types.test.ts`のeslint無視設定が、今回変更した`eslint.config.js`での設定変更に合っているかを確認する。
- [ ] `vitest` を実行してテスト全体が通るか確認する。
  - 完了条件: すべてのテストがパスすること。
- [ ] `useStageGenerator.test.ts` のテスト内容を確認・修正する。
  - 完了条件: `useStageGenerator` の変更点がテストでカバーされていることを確認し、必要であればテストを修正・追加する。
- [x] デバッグ用に追加した `console.log` を削除する。
  - 完了条件: `src/App.tsx` からデバッグ用の `console.log` が削除されていること。
  - [x] lint の警告・エラーを修正する。(このタスク内で対応済み)
- [ ] アプリケーションが正常に動作し、すべてのテストがパスすることを確認する。

## 機能追加フェーズ

{{ ... }}
