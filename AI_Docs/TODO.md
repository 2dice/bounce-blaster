# TODOリスト

## Step8-2 StageGenerator 完全版

- [x] `src/utils/intersect.ts` で AABB vs Segment 交差判定ユーティリティ追加
- [x] `src/utils/stageGenerator.ts` でランダムステージ生成実装（解保証）
- [x] `src/hooks/useStageGenerator.ts` を stageGenerator 利用に書き換え
- [x] 旧 useStageGenerator テストを刷新し 100 回生成テスト & 3 s 制限を追加
- [x] `pnpm test` で全テストが pass することを確認
- [x] `src/utils/stageGenerator.ts` の `generateStage` 関数に `onProgress` コールバックを実装
  - 完了条件: `useStageGenerator.test.ts` で `onProgress` が適切なタイミングと値で呼び出されることを確認
- [x] `pnpm run dev` で生成→照準フェーズに移行し Canvas に砲台/ターゲットが描画されることを目視確認

## Step8-2 レビューコメント対応

- [x] `src/utils/stageGenerator.ts` の `pickBlockOnLine` 関数を修正
  - フォールバックロジックを削除し、直線上に適切な候補が見つからない場合はエラーをスローするように変更
  - 候補リストが空の場合のランタイムエラーを防止するチェックを追加
- [x] `src/utils/stageGenerator.ts` の `generateStage` 関数を修正
  - `pickBlockOnLine` がエラーをスローした場合にステージ生成全体をリトライするロジックを追加 (最大リトライ回数も設定)
  - 完了条件: `pnpm test` ですべてのテストがパスすることを確認
- [x] `generateStage` のリトライロジックを改善し、各リトライで異なる `seed` を使用するようにする (完了条件: テストが安定してパスすること)
- [x] `tests/useStageGenerator.test.ts` の `onProgress` のアサーションエラーを修正する (完了条件: `pnpm test` で `tests/useStageGenerator.test.ts` がパスすること)
- [x] ステージ生成の安定性とパフォーマンスを検証する (完了条件: 開発サーバーで複数回ステージを生成し、問題なく動作することを確認する)
- [x] `AI_Docs/stageGenerator_investigation.md` に調査結果と対応方針をまとめる (完了条件: ドキュメントが最新の状態に更新されていること)
- [x] CIの `useStageGenerator.test.ts` の `onProgress` 単調増加アサーションエラーを修正する (完了条件: `pnpm test` で `tests/useStageGenerator.test.ts` がパスし、CIでも同様のエラーが再発しないこと)
