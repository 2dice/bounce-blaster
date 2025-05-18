# TODOリスト

## Step7-1 matter.js World 初期化 & 外周壁

- [x] matter-js を依存追加 (`pnpm add matter-js`)
- [x] `useMatterEngine` フックを実装して Engine と外周壁 4 枚を生成する
- [x] `GameCanvas` (仮) で `useMatterEngine` を呼び出し、壁を Canvas に描画する
- [x] Vitest：`Engine.world.bodies.length === 4` をテストする
- [x] 手動：ブラウザで Canvas に 4 辺の白線が表示されることを確認
- [x] `npm run dev` でエラーがないことを確認
