# TODOリスト

## Step7-3 ターゲット Body & 衝突検知コールバック

- [x] 砲台を可視化し、砲台からマウスクリックの方向に弾が発射されるように修正
- [x] Target Body(sensor) を StageGenerator スタブの固定値で配置
- [x] useMatterEngine に collisionStart listener 追加
- [x] bullet × target で dispatch('SUCCESS')
  - 完了条件: ゲームフェーズ phase が success に更新され、console に表示される
- [x] テスト: 2 つの Bodies を衝突させ、collisionStart コールバックが 1 回発火 (Vitest)
- [x] 手動テスト: クリック方向を調整しヒット → success 文字 (console) を確認
