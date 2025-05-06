# TODOリスト

## Step 5-2　GameState / Reducer の骨組み

- [x] models/enums.ts ファイルを作成

  - [x] Phase enumを定義する（generating, aiming, firing, success, fail）
  - [x] ActionTypes enumを定義する（GENERATING, READY, FIRE, SUCCESS, FAIL）
  - 完了条件：enumが正しく定義され、TypeScriptエラーが発生しないこと

- [x] models/reducer.ts ファイルを作成

  - [x] 初期状態（initialState）を定義する
  - [x] gameReducerを実装する
  - [x] 4つのアクション（READY, FIRE, SUCCESS, FAIL）の処理を実装する
  - 完了条件：reducerが正しく実装され、状態遷移が適切に行われること

- [x] hooks/useGameReducer.ts ファイルを作成

  - [x] useGameReducerカスタムフックを実装する
  - [x] GameContextを作成する
  - [x] GameProvider Componentを実装する
  - 完了条件：カスタムフックが正しく実装され、コンテキストが作成されること

- [x] App.tsxにGameProviderを組み込む

  - [x] GameProviderでAppコンポーネントをラップする
  - 完了条件：エラーなく正常にビルドが通ること

- [x] テストの作成

  - [x] tests/reducer.test.tsを作成する
  - [x] phase遷移のテストケースを実装する
  - 完了条件：`expect(result.phase).toBe('firing')`などのテストが成功すること

- [x] 動作確認

  - [x] `pnpm tsc --noEmit`でTypeScriptエラーがないことを確認
  - [x] `pnpm test`でテストが通ることを確認
  - 完了条件：すべてのテストがpassすること

- [x] ドキュメント整理
  - [x] design.mdのディレクトリ構造を今回の実装に合わせて修正する。
