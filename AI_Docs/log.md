# ログ

## Step1: Vite + React + TS + Tailwind 雛形 & Canvas プレースホルダ配置

### うまくいった手法/手順

- Viteプロジェクトの作成は`pnpm create vite@latest`コマンドで簡単にセットアップできた
- TailwindCSSのセットアップ手順：
  1. `pnpm add -D tailwindcss@3.4.17 postcss autoprefixer`でパッケージのインストール
  2. `npx tailwindcss init -p`で初期設定ファイルを生成
  3. tailwind.config.jsのcontentに`'./index.html', './src/**/*.{js,ts,jsx,tsx}'`を指定
  4. CSSファイルに`@tailwind`ディレクティブを追加

### 汎用的なナレッジ

- プロジェクトを正しく拡張できるよう、最初にファイル構造と依存関係を全体像として把握することが重要
- TailwindCSSを使ったスタイル指定は、後からのスタイル変更が簡単で柔軟性が高いことを確認
- コード実装前に、基本的なUI部品のサイズや配置を設計書から把握することで、実装の効率が大幅に向上

### 具体的なナレッジ

- TailwindCSSのv3.4.17を指定してインストールすることで、v4による予期せぬ変更を避けられる
- Canvas要素のサイズ指定は、Tailwindの任意値指定(`w-[960px] h-[720px]`)を使うことで正確なピクセル指定が可能
- VSCodeではTailwindの`@tailwind`ディレクティブが警告として表示されることがあるが、実際のビルドや実行には影響しない

## Step2: GitHub Pages デプロイパイプライン

### うまくいった手法/手順

- ViteでGitHub Pagesデプロイ用の設定は`vite.config.ts`に`base: '/bounce-blaster/'`を追加するだけで簡単に実現できた
- GitHub Actionsのワークフローファイルは以下の手順で作成:
  1. `.github/workflows`ディレクトリを作成
  2. `deploy.yml`ファイルに必要な設定を記述
  3. 最新のActionsバージョンを使用して信頼性を確保
- GitHub CLIを使ってPR作成することで、より効率的にワークフローを進められた

### 汎用的なナレッジ

- 小さなPRを順番に出して機能単位でマージすると、問題発生時の切り分けが明確になる
- Gitのブランチ戦略を最初に決めておくことで、チーム開発での混乱を防げる
- デプロイパイプラインはプロジェクトの早い段階で整備しておくことで、開発とテストのサイクルがスムーズになる

### 具体的なナレッジ

- GitHub Actionsのバージョンは定期的に更新されるため、最新バージョンを確認して指定することが重要
  - 2025年1月から`actions/upload-artifact`と`actions/download-artifact`はv4以上が必要
  - 不明点があれば公式リポジトリやドキュメントを確認する習慣づけが大切
- pnpmをCI環境で使う場合、ロックファイルが存在しないと`--frozen-lockfile`オプションでエラーになる
  - ロックファイルをリポジトリに含めるか、`--no-frozen-lockfile`オプションを使う必要がある
- GitHub CLIで日本語メッセージを使うときは文字化けに注意
  - ファイルに書き出して`--body-file`オプションを使うと安全

## Step3: ESLint + Prettier + Husky + lint-staged

### うまくいった手法/手順

- ESLint v9に対応するための設定は以下の手順で行った:
  1. `eslint.config.js`を作成し、フラットな設定形式を使用
  2. ESLint v9では従来のAirBnB設定を直接扱えないため、必要なルールを個別に適用
  3. TypeScriptとReactの設定を適切に連携
- Prettier導入手順:
  1. `pnpm add -D prettier eslint-config-prettier`でパッケージをインストール
  2. `.prettierrc.json`に基本設定を記述
  3. package.jsonの`scripts`に`format`コマンドを追加
  4. eslintと連携するために`eslint-config-prettier`を設定に追加
- Husky + lint-stagedのセットアップ:
  1. `pnpm dlx husky init`でHuskyを初期化
  2. `.husky/pre-commit`ファイルにlint-stagedを実行するコマンドを追加
  3. 実行権限を`chmod +x`で付与
  4. `.lintstagedrc`ファイルで各ファイル種別ごとの処理を定義

### 汎用的なナレッジ

- コード品質を保つための仕組みは、プロジェクトの早い段階で導入すると後の手戻りが少なくなる
- 自動フォーマット・リントの仕組みを導入することで、チーム開発でのコードスタイルの統一が容易になる
- 問題が発生したらまず単純な形で再現し、段階的に修正することで解決が早くなる
- コミット前のフックで自動チェックをするとエラーコードの混入を防げる

### 具体的なナレッジ

- ESLint v9から設定形式が大きく変わり、フラットな構造になった
  - AirBnBやstandardといった既存の設定パッケージとの互換性に問題があるケースがある
  - 必要に応じて個別にルールを適用する方法が有効
- Huskyのpre-commitフックファイルには必ず実行権限の付与が必要
  - `chmod +x .husky/pre-commit`を忘れるとフックが動作しない
  - 同様にファイルの内容が正しく改行されていることも重要
- VSCodeの設定ファイル`.vscode/settings.json`は`.gitignore`で除外されていることが多いので注意
  - チーム内で共有したい場合は`.gitignore`の設定を変更する必要がある
- npm/pnpmコマンドを使うときは、package.jsonで定義されたスクリプト名をチェックすることが重要
  - `npm run`と`pnpm run`で実行できるコマンドは異なることがあるため注意

## Step4: Vitest + React Testing Library 導入

### うまくいった手法/手順

- VitestとReact Testing Libraryの導入手順：
  1. `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom happy-dom`でパッケージをインストール
  2. `vitest.config.ts`にテスト環境設定（environment：'jsdom', globals：trueなど）を記述
  3. `tests/setup.ts`ファイルでjest-domマッチャーとクリーンアップを設定
  4. package.jsonに`test`と`test:run`スクリプトを追加
- GitHub ActionsのCIワークフロー設定：
  1. `.github/workflows/ci.yml`ファイルを作成
  2. push/pull_request時に自動実行されるようにトリガー設定
  3. lint、formatチェック、テストの三つのステップを設定

### 汎用的なナレッジ

- テスト環境はなるべく早い段階で導入しておくことで、テスト駆動開発（TDD）を実践しやすくなる
- テストではユーザーの振る舞いをシミュレートすることで、コンポーネントの実際の動作を検証できる
- CIパイプラインで自動テストを実行することで、バグの早期発見とリグレッション防止が可能になる
- 小さなテストから始めて少しずつ複雑なテストに移行すると、弊害切り分けがしやすくなる

### 具体的なナレッジ

- @testing-library/jest-domの最新バージョン（v6以上）では、インポート方法が変更されている
  - 古いバージョン：`import matchers from '@testing-library/jest-dom/matchers'`
  - 最新バージョン：`import '@testing-library/jest-dom'`（自動拡張）
- VitestではReactコンポーネントのテストにブラウザ環境のエミュレーションが必要
  - jsdomまhappy-domのどちらかを選択する必要がある
  - テストとメインコードのパス解決を一致させるため、vite.config.tsと同様のalias設定が必要
- GitHub Actionsのワークフローファイルは既存のCI/CD設定とスタイルを合わせることが重要
  - 同じプロジェクト内で設定が不揃いだとメンテナンスが困難になる
  - 最適化のために、キャッシュの有効活用や必要なステップのみの実行が重要

## Step5-1: データモデル定義 & 型テスト

### うまくいった手法/手順

- データモデル型定義の作成手順：
  1. `src/models`ディレクトリを作成
  2. `src/models/types.ts`に基本的なデータ型（Point, Rect, Stage, GameState）を定義
  3. 将来の拡張性を考慮して`readonly`修飾子を適用
  4. 型エラーを明確にキャッチするために厳密な型（リテラル型や共用型）を使用
- Vitestを使った型テスト作成手順：
  1. `tests/types.test.ts`ファイルを作成
  2. 正常系テストケースとエラー系テストケースを両方実装
  3. `@ts-expect-error`コメントを使って型エラーのテストを実装
  4. テストファイルに`@ts-nocheck`ディレクティブを追加して意図的な型エラーを抑制

### 汎用的なナレッジ

- データモデル定義はプロジェクトの基盤となるため、設計書の内容を正確に反映することが重要
- TypeScriptの型定義は、コードの品質向上と自己文書化の効果が高い
- 型テストはビルド時のみ機能するものなので、実行時エラーとは分けて考える必要がある
- TODOリストで作業を細分化して進めると、複雑な作業も確実に進められる

### 具体的なナレッジ

- TypeScriptの型テストでは、以下の手法が有効：
  - `@ts-expect-error`コメントで意図的な型エラーをテスト
  - 存在してはいけないケースを記述して型システムが正しく働くか検証
  - リテラル型（例：`1|2|3|4|5`）による厳密な型チェック
- ESLintやTypeScriptの警告は、以下の対処が効果的：
  - テストファイルでは`// @ts-nocheck`ディレクティブを使う
  - 意図的なエラーは`/* eslint-disable */`コメントでESLint警告を抑制
  - コメントで理由を記述して、チーム内での理解を促進
- 物理エンジン（matter.js）のような外部ライブラリを使う場合：
  - 型定義（@types/xxx）パッケージも一緒にインストールが必要
  - 型定義が古い場合は、拡張・上書きする方法も検討する

## Step5-2: GameState / Reducer の骨組み

### うまくいった手法/手順

- Reduxパターンをシンプルに実装する手順：
  1. `models/enums.ts`にPhaseとActionTypesの列挙型を定義
  2. `models/reducer.ts`にアクション型、初期状態、reducer関数を実装
  3. `contexts/GameContext.ts`と`contexts/GameProvider.tsx`でコンテキストとプロバイダーを分離
  4. `hooks/useGameReducer.tsx`でカスタムフックを実装
- Vitestを使ったreducerテスト作成手順：
  1. `tests/reducer.test.ts`ファイルを作成
  2. 各アクションに対するテストケースを作成
  3. 初期状態、フェーズ遷移、payloadの受け渡しを確認

### 汎用的なナレッジ

- Reactのコンポーネントと非コンポーネントのコードを分離することで、Hot Module Replacementやパフォーマンスが向上する
- 単一責任の原則を適用して、コンテキスト、プロバイダー、カスタムフックを分離するとコードの保守性が高まる
- TypeScriptの列挙型を使用することで、タイプセーフな状態管理を実現できる
- ユニットテストはコードの仕様と動作を探索・検証する手段として有効

### 具体的なナレッジ

- ESLintの警告を適切に対処する方法：
  - React Fast Refreshのreact-refresh/only-export-components警告はファイル分割で解決できる
  - 列挙型のno-unused-vars警告は`/* eslint-disable no-unused-vars */`で無効化
  - 無効化する場合は必ずコメントで理由を明確に記述する
- TypeScriptの型エラー対処：
  - ユニオン型(`1 | 2 | 3 | 4 | 5`)の値を代入する場合は`as`キャストで型安全性を確保
  - mockオブジェクトには`eslint-disable-next-line`コメントで警告を個別に無効化
- React Context APIのベストプラクティス：
  - コンテキスト定義とプロバイダーの分離
  - カスタムフックで利用を簡素化
  - コンテキストが存在しない場合のエラーハンドリング

## Step6: StageGenerator スタブ実装と App 初期化フェーズ (GENERATING) の検証

### うまくいった手法・手順

- **`useStageGenerator` スタブの実装**:
  - `src/hooks/useStageGenerator.ts` に、固定のステージデータ (`STUB_STAGE_DATA`) を `setTimeout` で意図的に遅延させて返すスタブフックを実装しました。
  - このフックは、初期状態では `null` (またはステージ生成関数がまだ準備できていないことを示す値) を返し、指定時間経過後に実際のステージデータを生成する関数を提供するように設計しました。これにより、`App`コンポーネント側での非同期処理のハンドリングをテストできるようにしました。
- **`App` コンポーネントへの統合と初期フェーズ処理**:
  - `App.tsx` の `useEffect` 内で `useStageGenerator` を呼び出し、ステージデータが生成されたら `dispatch({ type: ActionTypes.STAGE_GENERATED, payload: generatedStage })` を実行するようにしました。
  - これにより、アプリケーション起動時に `phase` が `Phase.GENERATING` となり、`useStageGenerator` からステージデータが提供された後に `Phase.AIMING` に遷移する、という期待通りの初期化シーケンスを実現しました。
- **初期化フェーズのテストとリファクタリング**:
  - 上記の非同期な初期化フローと状態遷移を検証するため、`App.test.tsx` にテストケースを追加しました。
    - 当初、`Phase.GENERATING` 中にのみ表示される一時的なUIインジケータ (`data-testid="generating-indicator"`) を `App.tsx` に追加し、テストでその表示・非表示を確認しました。これは、非同期処理の途中経過を視覚的にもテストコード的にも捉えやすくするためです。
    - `vi.useFakeTimers()` と `act(() => vi.advanceTimersByTime(...))` を活用して `useStageGenerator` 内の `setTimeout` を正確に制御し、`@testing-library/react` の `screen.findByTestId` や `waitForElementToBeRemoved` を用いてUIの動的な変化をアサートしました。
  - テストによる動作検証後、プロダクションコードのクリーンさを保つため、一時的なUIインジケータとそれに関連するテストケースは `App.tsx` および `App.test.tsx` から削除しました。
  - 最終的に `eslint` を実行し、`App.test.tsx` 内に残っていた未使用のimport文 (テストケース削除に伴うもの) を整理・削除しました。

### 汎用的なナレッジ

- **スタブ/モックの戦略的活用**: 開発初期や依存機能が未実装の段階でも、スタブやモック（今回でいう `useStageGenerator` の固定データと遅延動作）を効果的に使うことで、主要なロジックフローやコンポーネント間の連携を先行して実装・テストできます。これは、早期に設計上の問題を発見したり、並行開発を促進したりする上で有効です。
- **Reactコンポーネントの非同期初期化とテスト**: `useEffect` 内で非同期処理（データフェッチ、タイマー処理など）を行い、その結果に基づいて状態を更新するようなコンポーネントは一般的です。これらのテストには、`@testing-library/react` の非同期ユーティリティ (`findBy*`, `waitFor*`) と、必要に応じてタイマーモック (`vi.useFakeTimers` など) を組み合わせることが不可欠です。
- **テスト容易性を考慮した一時コードとクリーンアップの重要性**:
  - 特定の状態や遷移をテストしやすくするために、一時的なUI要素やデバッグログをコードに挿入することは有効な手段です。
  - ただし、これらの「テストのための一時コード」は、その役割を終えたら速やかに削除することが、コードの可読性、保守性、そしてプロダクションビルドの品質を維持する上で非常に重要です。テストコード自体も、プロダクションコードの変更に追従して適切にリファクタリングする必要があります。
- **lintツールの積極的な活用**: ESLintなどのlintツールは、コード品質を一貫して保つための強力なサポーターです。特にリファクタリング後や大規模なコード変更後は、未使用の変数やインポートが残りやすいため、lintの警告には注意深く対応しましょう。

### 具体的なナレッジ (ツールの使い方やハマりやすいポイントなど)

- **`useStageGenerator.ts` (スタブ実装のポイント)**:
  - 今回は、フックが「ステージデータを返す非同期関数」を返すようにし、その関数を `useEffect` の依存配列に含めることで、意図したタイミングでステージ生成処理を実行させました。
- **`@testing-library/react` と `vitest` (非同期テストの組み合わせ)**:
  - `screen.findByTestId('...')`: 要素が非同期的にDOMに出現することを期待する場合に便利です。Promiseを返します。
  - `waitForElementToBeRemoved(() => screen.queryByTestId('...'))`: 要素がDOMから削除されるのを待つ場合に使用します。コールバック関数で監視対象の要素（または `null` を期待するクエリ）を指定します。
  - `act(() => { vi.advanceTimersByTime(ms); })`: Reactのコンポーネント内で状態更新を引き起こすタイマー操作は、`act` でラップすることで、Reactの更新がテスト内で適切に処理・反映されることを保証しやすくなります。
- **コードのクリーンアップ習慣**:
  - テストのための一時的なUI要素や、それ専用のテストケースは、役割を終えたら忘れずに削除する。
  - `import` 文は、関連コードの変更（特に削除）時に未使用のものが残らないよう常に注意する。ESLintの警告が役立ちます。

## Step7-1: matter.js World 初期化 & 外周壁

### うまくいった手法/手順

- matter.js Engine を `useMatterEngine` フックでカプセル化し、`useEffect` で Runner の開始/停止を管理した
- `useMemo` で Engine と外周壁(`Bodies.rectangle`)の生成を 1 回に抑制
- 描画は `GameCanvas` 内で `requestAnimationFrame` を使い、Engine 更新と分離
- Vitest で `engine.world.bodies.length` をアサートし、自動テストで壁生成を検証

### 汎用的なナレッジ

- 物理エンジンを React に組み込む際は「Engine/Runners と描画」の責務を分離するとリファクタしやすい
- `JSDOM` では `canvas.getContext` が未実装 → テストでは呼ばない設計にするかモックを検討
- `useMemo` を使うことで costly な Engine 作成を防ぎ、パフォーマンスを確保

### 具体的なナレッジ

- 壁は `restitution:1, friction:0, isStatic:true` で完全反射＆停止しない特性を実現
- `Composite.clear(world, false, true)` で World をリセットすると参照が変わるので返り値(walls)とズレに注意
- `cancelAnimationFrame` で描画ループをクリーンアップしないとテスト環境(jsdom)でリーク警告が出る

## Step7-2: 弾 Body 生成 & 手動発射（クリック位置方向）

### うまくいった手法/手順

- Canvas の `onClick` イベントで砲台→クリック位置のベクトルを計算し、方向を正規化
- Bullet Body を `Bodies.circle` で生成し、`Body.setVelocity` で初速設定
- 物理エンジンの精度向上のため `positionIterations=20`, `velocityIterations=20`, `constraintIterations=4` に設定
- 弾の物性値 `restitution=1, friction=0, frictionAir=0` で減速を最小化
- 物理テストでは「7%以内の速度誤差」を許容し、実測値に基づいた現実的なテスト基準を設定

### 汎用的なナレッジ

- 物理エンジンの数値積分では完全なエネルギー保存は難しいため、許容誤差を設けるべき
- テストの許容値は「理想値」ではなく「実測値」に基づいて決めると堅牢になる
- Canvas 上のクリック座標は `getBoundingClientRect()` で Canvas 座標系に変換する必要がある
- 物理シミュレーションのパラメータ調整は「見た目」と「テスト」の両方で検証すると良い

### 具体的なナレッジ

- matter.js では Body に `frictionAir` プロパティを設定することで空気抵抗を制御できる
- 壁の `frictionStatic` を 0 にすることで、衝突時の回転エネルギーロスを軽減できる
- `Math.hypot(dx, dy)` でベクトルの長さを計算し、`(dx/len, dy/len)` で単位ベクトル化できる
- matter.js の Body 型定義では `circleRadius` プロパティが明示されていないため、`as Body & { circleRadius?: number }` のような型アサーションが必要
- テスト環境では `console.log` でデバッグ出力を残しておくと、失敗時の原因特定が容易になる

## Step7-3: ターゲット衝突検知 & 弾消去

### うまくいった手法/手順

- `useMatterEngine` に `collisionStart` リスナーを追加し、`bullet` と `target` ラベルの組み合わせのみ検出する実装にした。
- 成功コールバック `onBulletTargetCollision` を最優先で呼び出し、ゲームフェーズを更新してから弾 Body を `Composite.remove` で即座に World から除去した。

### 汎用的なナレッジ

- **Body 削除タイミング**: 衝突リスナー内で `Composite.remove` を呼んでもシミュレーションが安定して継続することを確認。`Composite.contains` は v0.20 には存在しないため不要。
- **イベントリスナーのクリーンアップ**: `Events.on` で登録したリスナーは `useEffect` のクリーンアップで必ず `Events.off` する。

### 具体的なナレッジ (ツールの使い方やハマりやすいポイントなど)

- TypeScript 型定義では `IPair` ではなく `Pair`。名前空間 import (`import * as Matter from 'matter-js'`) で `Matter.Pair` を参照すると解決。
- 弾を削除後も Engine ランナーは停止せず次の弾発射を処理できることを確認。

## Step7-4　最大バウンド数ロジック実装

### うまくいった手法/手順

- GameStateに`bounceCount`を追加し、初期Stateで0に設定
- ActionTypesに`BOUNCE`を追加
- reducerで`READY`時のリセット、`BOUNCE`時のインクリメント＆超過フェイル処理を実装
- GameCanvasでMatter.jsのcollisionStartをリスンし、壁反射時に`BOUNCE`ディスパッチ
- フェイルフェーズ検知用useEffect追加：CONSOLE出力と弾BodyをWorldから除去

### 汎用的なナレッジ

- caseブロック内で定数宣言を行うとESLintに抵触するため、ブロックスコープ`{}`で囲む
- jsdomでcanvas操作が必要な場合、`canvas`パッケージをインストールするとテストが通るが、今回は

### 具体的なナレッジ

- GameStateの`bounceCount`を`useEffect`で監視し、最大バウンド数を超えたらフェイルフェーズに遷移
- `useEffect`の依存配列に`GameState.bounceCount`を追加し、バウンド数が変化したときにのみ実行
- `CONSOLE.log`でデバッグ出力を残し、テスト環境では`console.log`を無視するように設定
- `GameCanvas`で`collisionStart`イベントをリスンし、壁反射時に`BOUNCE`アクションをディスパッチ
- `reducer`で`BOUNCE`アクションを処理し、バウンド数をインクリメント
- `reducer`で最大バウンド数を超えた場合、フェイルフェーズに遷移
- `useEffect`でフェイルフェーズを検知し、CONSOLE出力と弾BodyをWorldから除去
- `GameCanvas`で`collisionStart`イベントをリスンし、壁反射時に`BOUNCE`アクションをディスパッチ
- `reducer`で`BOUNCE`アクションを処理し、バウンド数をインクリメント
- `reducer`で最大バウンド数を超えた場合、フェイルフェーズに遷移
- `useEffect`でフェイルフェーズを検知し、CONSOLE出力と弾BodyをWorldから除去

## Step8-1: mirrorSolve() 実装（経路計算ユーティリティ）

### うまくいった手法/手順

- `src/utils/geom.ts` に鏡像法で経路計算を行う `mirrorSolve` 関数を実装 😊
- seq未指定時は総当たりで最短経路を選択
- 無効な反射シーケンス検出と境界チェックを実装 (不可能な場合は null)
- Vitestで `tests/mirrorSolve.test.ts` を作成し、0〜5バウンド、特定seq、エラーパターンを検証 🎉

### 汎用的なナレッジ

- 鏡像法により入射角=反射角を数式的に表現可能
- 組合せ数が指数的に増えるため maxBounce 制限が重要
- TypeScriptとVitestで null 返却ロジックを厳密にテストするとバグを防止

## Step8-2: StageGenerator 実装 (ランダムステージ生成)

### うまくいった手法/手順

- `src/utils/stageGenerator.ts` にランダムなステージを生成する `generateStage` 関数を実装。
- バウンド数は1から最大バウンド数の間でランダムに決定するように変更。
- 砲台とターゲットを結ぶ直線上に必ず1つブロックを配置し、直接クリアを防ぐようにした。
- 残りのブロックは、解法経路と交差しないようにランダムに配置。
- lint警告 `no-use-before-define` は、関数の定義順序を変更することで解消。

### 汎用的なナレッジ

- 複雑なロジックを実装する際は、小さな関数に分割すると見通しが良くなり、テストもしやすくなる。
- lint警告は早期に解消することで、コードの品質を保ちやすくなる。

### 具体的なナレッジ

- `no-use-before-define` は、関数や変数が定義される前に使用されると発生する。JavaScript/TypeScriptでは関数宣言は巻き上げられるが、ESLintのルールで警告されることがあるため、定義順を意識する。
