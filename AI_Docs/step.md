## 実装計画（git-commit 粒度）

# 凡例

- 参照 : 設計書の必要箇所を列挙（ステップごとにリセット）
- 目標 : そのステップ終了時に満たすべき状態
- タスク : 実装で行う細目
- テスト : Vitest または手動確認で実施する内容（日本語記述）
- 確認方法 : 実装が正しいことを誰でも再現確認できる手順
- 時系列 TODO : commit 内作業のラフ順序
- 補足 : 注意点、決定理由など

※ 「Vitest」導入後は全ステップで自動テストを書き足していく。  
※ GitHub Actions（CI）は Step2 でセットし、その後のテスト実行を自動化。

# Step1-1　Vite + React + TS + Tailwind 雛形 (done)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `7-1. 技術スタック`
  - `8. ディレクトリ構成`

目標 : pnpm install 後 `pnpm run dev` で最小ページ表示  
タスク :

1. `pnpm create vite@latest bounce-blaster --template react-ts`
2. TailwindCSS JIT 初期化 (tailwindCSSはv4が出ているため、v3.4.17を指定すること)
   https://qiita.com/kasoudomkun/items/66d0d9cdff8b1eb2515a
3. index.tsx → “Hello Bounce Blaster” 見出しを Tailwind で中央配置

テスト : 手動：`localhost:5173` にアクセスし、中央に文字列が表示される  
確認方法 : 画面目視確認
時系列 TODO : init → Tailwind 設定 → 起動 → commit  
補足 : `.editorconfig` を同時に追加してもよい

# Step1-2　Canvas プレースホルダ配置 (done)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `4. 画面／レイアウト仕様`
  - `7-1. 技術スタック`
  - `8. ディレクトリ構成`

目標 : Canvas(960×720) を中央に配置、リサイズはまだ不要  
タスク :

1. <App> に `<canvas id="game-canvas">` を追加
2. `className="bg-zinc-800 border"` で見た目確認

テスト : 手動：Canvas の DOM が存在し、幅高が 960×720 px である  
確認方法 : DevTools → Elements → サイズ確認  
時系列 TODO : DOM 追加 → スタイル → commit  
補足 : Tailwind で `w-[960px] h-[720px]` を暫定指定

# Step2　GitHub Pages デプロイパイプライン (done)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `9. ビルド & デプロイ`
- ./AI_Docs/github.md

目標 : `main` push で GitHub Pages に自動公開  
タスク :

1. `vite.config.ts` に `base:'/bounce-blaster/'` を設定
2. `.github/workflows/deploy.yml` 作成（actions-deploy-pages）
3. Pages ブランチを `gh-pages` に設定

テスト : 手動：`https://{username}.github.io/bounce-blaster/` で Hello ページ表示  
確認方法 : PR で workflow 実行ログ・公開 URL を明記  
時系列 TODO : base 設定 → workflow → push dummy →ページ確認 → commit  
補足 : キャッシュヒットのため `actions/cache@v3` も入れる

# Step3　ESLint + Prettier + Husky + lint-staged (done)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `7-1. 技術スタック`
  - `8. ディレクトリ構成`

目標 : `pnpm run lint` でエラー 0、コミット前に自動フォーマット  
タスク :

1. `pnpm add -D eslint @typescript-eslint/{eslint-plugin,parser}`
2. AirBnB + Tailwindcss plugin セット
3. Prettier + eslint-config-prettier
4. Husky pre-commit で `pnpm lint && pnpm prettier`

テスト : Vitest なし。`git commit` 時に Lint が走り失敗しない  
確認方法 : commit テスト用にわざとフォーマット崩し → fail → fix → pass  
時系列 TODO : eslintrc → prettier → husky install → commit  
補足 : VSCode 用 `.vscode/settings.json` 追加推奨

# Step4　Vitest + React Testing Library 導入 (done)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `7-1. 技術スタック`
  - `8. ディレクトリ構成`
- ./AI_Docs/github.md

目標 : `pnpm test` が通り、CI で実行される  
タスク :

1. `pnpm add -D vitest @testing-library/react @testing-library/jest-dom`
2. `vitest.config.ts` を ESBuild alias に合わせ設定
3. サンプルテスト：App に “Hello” を含むか検証
4. GitHub Actions に `pnpm test --run` を追加

テスト : Vitest：`expect(screen.getByText(/Hello/)).toBeInTheDocument()`  
確認方法 : ローカル & CI で緑  
時系列 TODO : install → config → test file → workflow update → commit  
補足 : 以降すべての機能テストを Vitest に追加していく

# Step5-1　データモデル定義 & 型テスト (done)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `5. データモデル`
  - `7-1. 技術スタック`
  - `8. ディレクトリ構成`

目標 : `models/` に Point, Rect, Stage 型を定義し、ビルド通過  
タスク :

1. `src/models/types.ts` 作成
2. 型を export し、Vitest 型テスト（ts-expect-error など）

テスト : 型検査：Stage に必須 key が無い場合に TypeScript エラーになる  
確認方法 : `pnpm tsc --noEmit` エラー 0  
時系列 TODO : type 定義 → tsc pass → vitest type test → commit  
補足 : 将来の拡張のため `readonly` 修飾

# Step5-2　GameState / Reducer の骨組み

参照 : 設計書 7-3 ステート管理  
参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : `useGameReducer` hook が phase だけ管理できる  
タスク :

1. enums: Phase 型定義
2. reducer.ts で `READY`, `FIRE` など 4 アクションを仮実装
3. App で Context.Provider 設置

テスト : Vitest：dispatch で適切に phase が遷移すること  
確認方法 : `expect(result.phase).toBe('firing')` 等  
時系列 TODO : enum → reducer → provider → tests → commit

# Step6　StageGenerator スタブ（固定ステージ）

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `6-4. ステージ生成アルゴリズム`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : `useStageGenerator` が固定 Stage を 10ms で返す  
タスク :

1. hooks/useStageGenerator.ts … Promise<Stage>
2. Phase generating → aiming へ遷移実装

テスト : Vitest：戻り値の cannon, target が定数である  
確認方法 : ログ & テスト pass  
時系列 TODO : hook → reducer tie-in → tests → commit

# Step7-1　matter.js World 初期化 & 外周壁

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `6-1. World 設定`
  - `6-2. Body 定義`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : `useMatterEngine` が Engine + 外周 4 壁を生成し、Canvas 内で壁座標が描画される  
タスク :

1. matter.js を依存追加 (`pnpm add matter-js`)
2. useMatterEngine 内で Engine.create, Runner.run
3. 外周壁 Static Body(4) を world に追加
4. GameCanvas の `requestAnimationFrame` で walls を矩形描画

テスト :

- Vitest：Engine.world.bodies.length === 4
- 手動：Canvas に 4 辺の白線が表示

確認方法 : DevTools → canvas snapshot / コンソール body カウント  
時系列 TODO : install → hook 改修 → canvas draw → tests → commit  
補足 : 描画はまだラフで OK

# Step7-2　弾 Body 生成 & 手動発射（クリック位置方向）

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `6-2. Body 定義`
  - `6-3. 衝突カテゴリ`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : クリックで弾が生成され壁に跳ね返る  
タスク :

1. GameCanvas onClick(evt) で狙いベクトル計算（砲台中央→evt）
2. Bullet Body を addBody、velocity を set
3. 衝突時の完全反射は restitution=1 で matter.js に任せる

テスト :

- Vitest (engine 静的 step)：壁衝突後速度の絶対値が等しい
- 手動：マウスクリックで弾が跳ね返る様子確認

確認方法 : コンソールに衝突ごとの speed 出力し変化なしを確認  
時系列 TODO : onClick 実装→速度設定→tests→commit  
補足 : まだ MaxBounce 制限なし、ターゲットなし

# Step7-3　ターゲット Body & 衝突検知コールバック

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `6-2. Body 定義`
  - `6-3. 衝突カテゴリ`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

参照 : 設計書 6-2 Target / 7-3 ステート管理  
目標 : 弾がターゲットに当たれば phase=success へ遷移  
タスク :

1. Target Body (sensor) を StageGenerator スタブの固定値で配置
2. useMatterEngine に collisionStart listener 追加
3. bullet × target で dispatch('SUCCESS')

テスト :

- Vitest：2 つの Bodies を衝突させ、コールバックが 1 回発火
- 手動：クリック方向を調整しヒット → success 文字 (console)

確認方法 : reducer phase が success に変わるか DevTools で確認  
時系列 TODO : body追加→listener→tests→commit  
補足 : 成功後のリセットはまだ行わない

# Step7-4　最大バウンド数ロジック実装

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `2-1. ゲームフロー`
  - `6. 物理エンジン仕様 (matter.js)`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

参照 : 設計書 2-1 / 6-4 / 7-3  
目標 : 弾が N 回以上壁衝突で phase=fail へ遷移  
タスク :

1. GameState に `bounceCount` を追加 (reducer)
2. collisionStart(wall) 毎に ++、N 超過で FAIL dispatch
3. N は Stage.maxBounce を利用（現在は定数 3）

テスト : Vitest：壁衝突を強制 step で 4 回 → phase が fail  
確認方法 : コンソールに回数を出しフェイル確認  
補足 : 次ステージ自動遷移は後段ステップで

# Step8-1　mirrorSolve() 実装（経路計算ユーティリティ）

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `5. データモデル`
  - `6. 物理エンジン仕様 (matter.js)`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : 任意 cannon,target,maxBounce でバウンド点列を返却できる  
タスク :

1. `utils/geom.ts` に mirrorSolve(fn) 作成
2. 単体テスト：

   - N=1, 右壁のみ → 点列長 2
   - 不可解ケースは `null` を返す

テスト : Vitest：期待パスと一致するか座標比較  
確認方法 : `pnpm test` が緑  
補足 : matter.js 非依存ロジック

# Step8-2　StageGenerator 完全版（解保証 & ランダム壁）

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `5. データモデル`
  - `6. 物理エンジン仕様 (matter.js)`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : ランダムシードで毎回違う Stage を 3 s 以内に返却  
タスク :

1. mirrorSolve を用いて while ループ生成
2. path 干渉しない矩形壁をランダム配置
3. Progress% 生成を Callback で emit

テスト :

- Vitest：100 回生成して mirrorSolve(path) ≠ null が保証
- console.time で 3 s 未満

確認方法 : テスト結果 & Node 計測  
補足 : randomRect の衝突判定は AABB vs segment 関数

# Step9　OverlayGenerating + ProgressBar

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `4. 画面／レイアウト仕様`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : ステージ生成中に黒半透明＋プログレスバーが表示  
タスク :

1. useStageGenerator が progress を状態で emit
2. <OverlayGenerating> 実装（Tailwind）

テスト : React Testing Library：progress が 0→100 へ変化する  
確認方法 : 手動で `maxBounce` 変更 → オーバーレイ表示確認  
時系列 TODO : hook変更→component→test→commit

# Step10　Next-Stage 自動遷移 & OverlayResult

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `4. 画面／レイアウト仕様`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`
  - `付録Ａ：画面遷移ステートチャート（簡易）`

目標 : success/fail → 1 s 表示 → generating へ戻る  
タスク :

1. <OverlayResult type> 実装（Tailwind）
2. useEffect(timer) で 1s 後 dispatch('NEXT_STAGE')
3. reducer で StageGenerator 再起動

テスト : Vitest：jest.useFakeTimers で 1000ms 経過後 phase == generating  
確認方法 : 手動：成功させてオーバーレイ→自動リセット確認

# Step11　ControlBar & MaxBounceSelect → StageGenerator 連携

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `2. 機能要件`
  - `4. 画面／レイアウト仕様`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : ドロップダウン変更で次ステージからバウンド数反映  
タスク :

1. <MaxBounceSelect> 実装 (1-5)
2. onChange dispatch('SET_MAX',value)
3. reducer で state.maxBounce 更新 → 次生成へ渡す

テスト : RTL：select change → state.maxBounce 反映  
確認方法 : 手動：2 回クリックで 2 バウンド成功できる Stage 生成

# Step12　AimGuide (予測反射ライン)

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `4. 画面／レイアウト仕様`
  - `6. 物理エンジン仕様 (matter.js)`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : ドラッグ中に「砲台→反射ライン→最終到達点」までを点線表示。最大バウンド数 N を超える部分は描かない。

タスク :

1. hooks/useDrag.ts を作成（pointerdown / move / up をラップ）
2. hooks/useAimGuide.ts
   - 砲台中心とマウス座標から角度を算出
   - mirrorSolve(cannon,target,maxBounce,walls,field) で Point[] 取得
   - Canvas overlay レイヤに点線描画
3. GameCanvas にドラッグ開始・終了を組み込み
4. phase==aiming のみ描画、firing で自動クリア

テスト :

- Vitest：
  - 与えた砲台座標(100,100)、マウス(200,100)、max=1 ⇒ Point[] 長さ 2
  - walls を含む場合 path が壁を貫かない
- RTL：pointerDown→move→点線 Canvas が存在

確認方法 :  
手動でドラッグし、壁に当たるたびに反射角が正しく変わるか視認。  
デバッグで solutionLine(生成時保存) と AimGuide を色違いで比較し一致を確認。

時系列 TODO :  
drag hook→aimGuide calc→canvas draw→phase 切替→tests→commit

補足 :  
点線描画は offscreenCanvas で毎 frame 消去→再描画。FPS 低下が見えた場合は requestAnimationFrame 内で redraw を 60fps から 30fps へ間引く。

# Step13　視覚エフェクト（フラッシュ・トレイル・火花）

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `2. 機能要件`
  - `4. 画面／レイアウト仕様`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : 爽快感を出す 3 種エフェクトを追加し 30fps を維持。

タスク :

1. assets/ に 8-frame png スプライト（火花）を追加
2. ParticleEngine util 実装（位置・速度・lifespan）
3. 発射時 : 砲台位置にフラッシュ(白丸 + α fade)
4. 飛行時 : 5f 毎に弾座標へ残像(赤円 α0.4, 5個キュー)
5. ヒット時 : target センサー衝突で火花パーティクル 20 個生成
6. renderDynamicLayer で bullets と particles を一括描画

テスト :

- Vitest：ParticleEngine.update(dt) で lifespan が 0 以下なら配列から除去
- 手動：
  - 発射時フラッシュ表示
  - 弾越しに赤い尾が 5 個以内で追従
  - ヒット時火花アニメ 0.5 s

確認方法 : DevTools Performance タブで fps ≧30 を確認、body 数急増がないこと。  
時系列 TODO : particle class→asset copy→render update→tests→commit  
補足 : matter.js Body ではなく描画のみのゴーストなのでパフォーマンスに大きく響かない。

# Step14　DebugPanel & FPS Counter

参照 :

- 設計書 4-2 パーツ寸法（DebugPanel）
- 設計書 7-2 ツリー

目標 : DEV ビルド時、右上に FPS・シード値・グリッド切替 UI を表示。  
タスク :

1. util/useFpsMeter.ts – requestAnimationFrame 毎に計測(平均 1s)
2. DebugPanel.tsx :
   - props {seed, toggleGrid}
   - ボタンで overlay grid canvas の表示ON/OFF
3. Vite define: **DEV** フラグで prod では tree-shake

テスト :

- Vitest：toggleGrid dispatch で state.grid==true
- 手動：FPS 数字がリアルタイム更新、ボタンでグリッド表示切替

確認方法 : 開発サーバで F12 → 数字が 55-60 付近で推移し Grid レイヤが表示。  
時系列 TODO : fps hook→panel ui→vite define→tests→commit  
補足 : グリッドは CanvasPattern 描画、dbg で aim 調整に便利。

# Step15　レスポンシブ対応 & リサイズハンドリング

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `3. 非機能要件`
  - `4. 画面／レイアウト仕様`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : iPad / PC いずれでもアスペクト 4:3 を維持し Letterbox。  
タスク :

1. util/calcViewport.ts – Window サイズから Canvas 実サイズ算出
2. GameCanvas useResizeObserver で Canvas 幅高を更新
3. matter.js ワールド座標 ≠ CSS ピクセル比を scaleFactor で吸収
4. Tailwind container mx-auto で中央寄せ、黒帯背景用の div 追加

テスト :

- Vitest：calcViewport(1280,720) → {w:960,h:720} を返す
- 手動：Chrome DevTools → iPad mini/desktop/窓リサイズ連続確認

確認方法 : リサイズ時に弾と壁の相対位置が崩れず、黒帯が上下左右に均等出る。

# Step16　パフォーマンス & GC リークチェック

参照(view_fileコマンド等で取得) :

- ./AI_Docs/design.mdの下記項(行数範囲はdesign_toc.mdを参照)
  - `3. 非機能要件`
  - `7. アプリケーションアーキテクチャ`
  - `8. ディレクトリ構成`

目標 : 長時間プレイ (5 分間) で FPS <30 にならず、メモリリークが無い。  
タスク :

1. Chrome Performance Profiler 計測、GC の retained size を確認
2. useMatterEngine – bullet 削除後 removeBody, World.clearBodies helper
3. ParticleEngine – 配列再利用 (object pool)
4. requestAnimationFrame loop を 1 つに統合し無駄な setState を削減

テスト : Vitest：ParticlePool.get/release で配列長が一定を保つ  
確認方法 : Performance→Memory snapshot 比較・FPS グラフ確認。

# Step17　README / Contributing / ライセンス整備

参照 :

- ./AI_Docs/design.mdの全項目

目標 : OSS 風 README を追加し、手順だけでビルド・デプロイ可能。  
タスク :

1. README.md – プロジェクト概要 / セットアップ / 開発 / デプロイ / 作者
2. LICENSE (MIT) 追加
3. CONTRIBUTING.md – PR ルール・コミット規約・テスト必須を明記

テスト : 手動：README 手順に沿って clone→pnpm i→pnpm dev で起動 OK  
確認方法 : 新人が手順を実施し成功したかレビュー。

# Step18　最終 QA & リリースタグ v1.0.0

参照 :

- ./AI_Docs/design.mdの全項目

目標 : 仕様フルカバレッジの E2E 手動テスト & Git タグ付与。  
タスク :

1. シナリオテスト：
   - MaxBounce=1〜5 ですべて成功ステージ確認
   - 連続 20 ステージでクラッシュなし
2. GitHub Releases に v1.0.0 タグ + リリースノート
3. gh-pages のリンクを README に追記

テスト : チェックリスト形式で手動 QA 結果を PR に添付  
確認方法 : release URL アクセス→ブラウザ別 (Safari/Chrome/Edge) で起動  
時系列 TODO : QA run→Fix if any→tag→release→commit  
補足 : 今後の機能拡張（重力・摩擦など）は v1.1 ブランチで管理。
