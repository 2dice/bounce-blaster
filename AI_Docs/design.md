設計書「Bounce Blaster」

# 0. ドキュメント構造

1. 目的・スコープ
2. 機能要件
3. 非機能要件
4. 画面／レイアウト仕様
5. データモデル
6. 物理エンジン仕様 (matter.js)
7. アプリケーションアーキテクチャ
8. ディレクトリ構成
9. ビルド & デプロイ
10. 実装フェーズ (スモールステップ計画)

# 1. 目的・スコープ

- ブラウザ（iPad 横持ち / PC）で動作する 2D 反射シューティングゲーム。
- 常に“ユーザ指定のバウンド数(≤5)以内”でクリア可能なステージを自動生成。
- 将来の機能拡張（重力・摩擦）を考慮し、物理エンジンに matter.js を採用。

スコープ外：マルチプレイ、サウンド、キーボード対応、サーバ連携。

# 2. 機能要件

## 2-1. ゲームフロー

1. ステージ自動生成 (≤3 s)
2. 照準ドラッグ → 発射
3. 弾がターゲット命中＝成功／規定反射数超え＝失敗
4. 1 秒後に自動リセット → 次ステージ 1. へ

## 2-2. ステージ自動生成

- 入力：maxBounce(1-5)・表示領域寸法
- 出力：Stage オブジェクト（§5）
- アルゴリズム：逆算生成（詳細 §6-4）

## 2-3. ユーザインタラクション

- タップ／クリック＆ドラッグ：照準線表示
- ドラッグリリース：発射
- SelectBox：maxBounce 変更で次ステージから反映

## 2-4. 視覚エフェクト

- 発射フラッシュ、トレイル残像、ヒット火花
- FPS30 を割らない範囲でパーティクル 30 個／弾上限 1 発

## 2-5. 失敗・再挑戦

- 反射上限超過 or ターゲット外周退出で弾を消去し「失敗」ラベル点滅 0.5 s

# 3. 非機能要件

- FPS　　　 ：最低 30、目標 60
- 生成時間 ：3 s 以内（オーバーレイ進捗表示）
- 対応端末 ：iPadOS16+ Safari / Chrome 115+ / Edge 115+
- レスポンシブ：横 100 %、縦アスペクト 4:3 → 黒帯処理
- デプロイ　：GitHub Pages 静的ホスティング
- アクセシビリティ：タッチ／マウスのみ

# 4. 画面／レイアウト仕様

## 4-1. ベースビューポート

iPad 横：1024 × 768 (4:3) を論理基準とし、任意解像度へスケール。

## 4-2. パーツ寸法（基準値）

Canvas　　　 : 960 × 720（左右 32 px 余白）  
ControlBar : 高さ 48 px (Canvas 下部に固定)  
┣ SelectBox : 幅 120 px  
┣ FPSCounter※ : 幅 80 px (DEVのみ)  
Overlay (生成) : 全面 α0.6 黒 + 中央 240 × 60 px プログレスバー

## 4-3. UI レイアウト図（テキスト簡易）

┌──────────────────────────────┐  
│ Canvas (960×720) │  
└──────────────────────────────┘  
┌───────────────┬───────────┐  
│ Max Bounce ▼ │ FPS: 58 │ ← DEV時のみ│  
└───────────────┴───────────┘

## 4-4. 表示例

- MaxBounce=3、砲台(150,650)、ターゲット(700,120)、壁４枚。
- 照準ドラッグ中は黄ライン→白反射線（点線）。
- 発射後は弾に赤トレイル、小火花エフェクト gif 8 frames。

# 5. データモデル

```
type Point = { x:number; y:number }
type Rect  = { x:number; y:number; w:number; h:number }

interface Stage {           // 生成結果
  width: number; height: number;
  maxBounce: 1|2|3|4|5;
  cannon:  Point;           // 砲台中心
  target:  Point;           // ターゲット中心
  walls:   Rect[];          // Static blocks
  solution: Point[];        // バウンド点列 (内部デバッグ用)
}

interface GameState {       // React useReducer 予定
  phase: 'generating'|'aiming'|'firing'|'success'|'fail';
  stage : Stage;
  bullet?: Matter.Body;
}
```

# 6. 物理エンジン仕様 (matter.js)

## 6-1. World 設定

gravity : { x:0, y:0 } // 重力オフ  
timing.timeScale: 1 // デフォルト  
broadphase : grid (幅 100 px cell) // パフォーマンス向上

## 6-2. Body 定義

Wall : Bodies.rectangle(...) static:true, restitution:1, friction:0  
Target : Bodies.circle( r=18 ) isSensor:true (衝突検出のみ)  
Cannon : 座標記録のみ（描画専用、Body 不要）  
Bullet : Bodies.circle( r=12 ) restitution:1, friction:0, label:'bullet'

## 6-3. 衝突カテゴリ

0x0001 = walls  
0x0002 = bullet  
0x0004 = target  
Bullet.collidesWith = walls | target

## 6-4. ステージ生成アルゴリズム

1. 砲台とターゲットをランダム配置(1マス以上開ける)
   - 配置は縦横各10等分した格子状の配置
2. mirrorSolveのseqで渡す数を0～最大バウンド数の間でランダムに決定し、その渡す数をさらにランダムでバウンド壁指定(RLTBがランダムに最大バウンド数分セットされる)に渡す
   - 最大バウンド数3ならseqに0～3個の値がセットされる。
   - 3だったらTop→Bottom→Leftなどがランダムで選定されてセットされる
   - nullならseqの個数は固定で壁の指定を再試行
3. ブロックをランダム配置し、その経路が塞がれたら再試行
   - ブロックの配置は縦横各10等分した格子状の配置(砲台とターゲットの位置は除く)
   - 配置ブロック数は20個(10x10=100ブロックの20%)

- mirrorSolve(): 鏡像法。外周壁のみを考慮してバウンド点列を計算。
- バウンド点が 0≤x≤W, 0≤y≤H 内になるかチェック。

# 7. アプリケーションアーキテクチャ

## 7-1. 技術スタック

- Front : Vite + React + TypeScript
- Style : Tailwind CSS (JIT)
- Engine : matter.js
- Build : pnpm / esbuild (Vite 内)
- CI/CD : GitHub Actions → Pages

開発支援

- ESLint + Prettier + Husky + lint-staged
- Vitest + React Testing Library
- GitHub Actions：CI → GitHub Pages deploy

## 7-2. React コンポーネントツリー

```
<App>                         // 全体の状態管理、ゲームフェーズ制御、useStageGenerator hook を利用
 ├─ <GameCanvas>                // Canvas & matter.js World
 │    ├ useMatterEngine() hook  // Engine init / step loop
 │    └ useAimGuide() hook      // 反射予測線描画
 ├─ <ControlBar>
 │    └ <MaxBounceSelect>
 ├─ <OverlayGenerating/>
 ├─ <OverlayResult type=success|fail/>
 └─ <DebugPanel/> (DEV)
```

## 7-3. ステート管理

- `useReducer(gameReducer, initialState) in <App>  `
- Context.Provider で下位へ配布 (read-only)
- 生成完了/衝突検出で dispatch → phase 遷移

## 7-4. 描画レイヤー

1. BG (塗りつぶし)
2. Static walls / cannon / target
3. Bullet & パーティクルトレイル
4. AimGuide (ドラッグ中のみ)
5. Overlay (生成/結果/DEV)

# 8. ディレクトリ構成 (予定)

```
.github/
└─ workflows/
   ├─ ci.yml               # CI: Lint と Vitest を実行して PASS/FAIL を判定
   └─ deploy.yml           # gh-pages へ静的ファイルをデプロイする GitHub Actions

.husky/
├─ pre-commit              # コミット前フック: lint・prettier・test を自動実行
└─ _                       # Husky ランタイム共通スクリプト（自動生成）

.vscode/
└─ settings.json           # VSCode 用の自動フォーマット & Lint 拡張設定

public/
└─ favicon.svg             # ブラウザタブに表示されるアイコン

dist/                       # Vite build 出力（git に含めない）

src/
├─ App.tsx                 # ルートコンポーネント
├─ main.tsx                # ReactDOM.createRoot → <App/> をマウント
├─ index.css               # Tailwind の base/components/utilities インポート
├─ components/
│  ├─ GameCanvas.tsx       # Canvas 要素・描画・入力をまとめる
│  ├─ ControlBar.tsx       # 画面下部 UI コンテナ
│  ├─ MaxBounceSelect.tsx  # 最大バウンド数を選択するセレクトボックス
│  ├─ DebugPanel.tsx       # DEV 用デバッグ情報まとめ表示（FPS・シード・グリッド切替）
│  ├─ OverlayGenerating.tsx# ステージ生成中の黒半透明オーバーレイ
│  ├─ OverlayError.tsx     # エラー時のオーバーレイ
│  ├─ ProgressBar.tsx      # 進捗バー UI
│  └─ OverlayResult.tsx    # 成功／失敗結果を 1 秒表示するオーバーレイ
│
├─ contexts/
│  ├─ GameContext.ts       # ゲーム状態管理用のContext定義
│  └─ GameProvider.tsx     # ゲーム状態管理用のProviderコンポーネント
│
├─ hooks/
│  ├─ useGameReducer.tsx   # ゲーム状態管理用のカスタムフック
│  ├─ useMatterEngine.ts   # matter.js Engine を生成しアプリと同期
│  ├─ useStageGenerator.ts # ステージを自動生成し progress を emit
│  ├─ useAimGuide.ts       # 砲台→マウス角度で反射ラインを計算
│  ├─ useDrag.ts           # pointerdown / move / up を抽象化したフック
│  └─ useFpsMeter.ts       # requestAnimationFrame から FPS を算出
│
├─ utils/
│  ├─ ParticleEngine.ts    # パーティクル生成・更新・描画を統括
│  ├─ geom.ts              # 鏡像法・線分×矩形交差など幾何ヘルパ
│  ├─ intersect.ts         # 交差判定ユーティリティ
│  └─ stageGenerator.ts    # ステージ自動生成ロジック
│
├─ models/
│  ├─ types.ts             # Point / Rect / Stage / GameState の型宣言
│  ├─ enums.ts             # Phase や ActionTypes の列挙型
│  └─ reducer.ts           # useReducer 用の gameReducer 実装
│
└─ assets/
    └─ react.svg            # React アイコン

tests/
├─ App.test.tsx            # ルートコンポーネントの単体テスト
├─ bulletBounce.test.ts    # バウンド検出の妥当性テスト
├─ bulletCannonCollision.test.ts # 弾と砲台の衝突検出テスト
├─ bulletTargetCollision.test.ts  # 衝突検出の妥当性テスト
├─ reducer.test.ts         # gameReducer のフェーズ遷移テスト
├─ reducerBounceCount.test.ts # 最大バウンド数ロジックの単体テスト
├─ types.test.ts           # 型定義の妥当性テスト
├─ useMatterEngine.test.tsx  # useMatterEngine の妥当性テスト
├─ useStageGenerator.test.ts  # useStageGenerator の妥当性テスト
├─ aimGuide.test.ts        # useAimGuide 出力の妥当性テスト
├─ ParticleEngine.test.ts  # パーティクル生成と寿命ロジックのテスト
├─ mirrorSolve.test.ts     # 鏡像法計算ユーティリティの単体テスト
├─ debugPanel.test.ts      # デバッグパネルのグリッド切り替え機能テスト
├─ autoStageTransition.test.tsx # ステージ自動遷移テスト
├─ gameCanvasAimGuide.test.tsx # GameCanvasとAimGuideの統合テスト
├─ maxBounceSelect.test.tsx # MaxBounceSelectコンポーネントテスト
├─ OverlayError.test.tsx   # OverlayErrorコンポーネントテスト
├─ OverlayGenerating.test.tsx # OverlayGeneratingコンポーネントテスト
├─ OverlayResult.test.tsx  # OverlayResultコンポーネントテスト
└─ setup.ts                # Vitest グローバルセットアップ

.lintstagedrc               # lint-staged 設定
.prettierignore             # prettier 除外ファイル
.prettierrc.json            # Prettier 設定
.eslint.config.js           # ESLint 設定
prettier.config.cjs         # Prettier のフォーマットルール
package.json                # 依存パッケージおよび npm スクリプト
pnpm-lock.yaml              # pnpm 用ロックファイル
postcss.config.js          # PostCSS 設定
tailwind.config.js          # Tailwind カスタム設定
tsconfig.app.json           # React アプリケーション用 TypeScript コンパイラオプション
tsconfig.json               # TypeScript コンパイラオプション
tsconfig.node.json          # Node.js 用 TypeScript コンパイラオプション
vite.config.ts              # Vite ビルド/サーバ設定
vitest.config.ts            # Vitest ＋ React Testing Library 設定
README.md                   # プロジェクト概要と利用手順
CONTRIBUTING.md             # コントリビュート規約・PR ガイド
LICENSE                     # MIT ライセンス本文
```

# 9. ビルド & デプロイ

- pnpm install
- pnpm run dev → ローカル確認
- pnpm run build → dist/
- GitHub Actions:  
   on push main → pnpm i → pnpm build → actions-deploy-pages

# 付録Ａ：画面遷移ステートチャート（簡易）

generating ─┐  
 ▼  
 aiming → firing → success  
 ▲ │ │  
 └── fail ◀─────────┘ (1 s 後 generating)
