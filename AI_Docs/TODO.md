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
