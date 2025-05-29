# TODOリスト

- [x] Step8-1: mirrorSolve() の実装
  - [x] `src/utils/geom.ts` ファイルを作成
  - [x] 鏡像法で反射経路を計算する `mirrorSolve` 関数を実装
    - 引数: cannon: Point, target: Point, seq?: Direction[], width: number, height: number
    - 返却: Point[] | null
  - [x] 総当たりで最短経路を選ぶロジックの実装(seq未指定時)
  - [x] 進入角=反射角の鏡像法実装
  - [x] 無効なリフレクションシーケンスチェック(nullptr返却)
  - [x] 境界内チェック(0<=x<=width, 0<=y<=height)
  - [x] Vitest用の単体テスト作成: `tests/mirrorSolve.test.ts`
  - [x] `pnpm test`がグリーンとなること確認
