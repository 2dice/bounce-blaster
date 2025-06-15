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

## Step9: OverlayGenerating + ProgressBar

### うまくいった手法/手順

- **progress状態の統合実装**:
  - `GameState` に `progress: number` フィールドを追加
  - `ActionTypes` に `PROGRESS_UPDATE` を追加し、reducerでprogress値を0-100でクランプ
  - `useStageGenerator` と `stageGenerator` にprogress更新コールバック機能を追加
- **UIコンポーネントの実装**:
  - `ProgressBar.tsx`: 240×60px相当のプログレスバーをTailwind CSSで実装
  - `OverlayGenerating.tsx`: 黒半透明オーバーレイ + 中央プログレスバー配置
  - App.tsxでGeneratingフェーズ時の条件表示ロジック実装
- **包括的テスト実装**:
  - `tests/OverlayGenerating.test.tsx` でprogress変化、スタイル、フェーズ遷移をテスト
  - GameCanvasをモック化してCanvas関連エラーを回避
  - 既存の`useStageGenerator.test.ts`を修正してprogress機能に対応

### 汎用的なナレッジ

- **プログレス機能の段階的実装**: 状態管理→UIコンポーネント→統合→テストの順で進めることで、各段階での動作確認が容易になる
- **Tailwind CSSでの正確なサイズ指定**: `h-15`のような未定義クラスよりも`h-16`等の定義済みクラスを使うことでlint警告を回避
- **テストでのCanvas問題対策**: jsdom環境では`HTMLCanvasElement.getContext`が未実装のため、Canvas使用コンポーネントはモック化が必要
- **段階的なテスト修正**: DOMセレクタが複雑な場合は、より単純で確実な要素選択方法に変更することで安定性が向上

### 具体的なナレッジ

- **progress状態管理のベストプラクティス**:
  - progress値は`Math.max(0, Math.min(100, value))`でクランプして範囲外値を防ぐ
  - useStageGeneratorでは引数名を`_onProgress`にしてlint警告(no-unused-vars)を回避
  - stageGeneratorの`guardedOnProgress`で重複進捗報告を防止
- **Tailwind CSSのクラス順序**: `tailwindcss/classnames-order`警告を避けるため、プロパティ順序を統一（位置→サイズ→色→その他）
- **React Testing Libraryでのスタイルテスト**:
  - `document.querySelector('.class1.class2')`で複合クラスを検証
  - 複雑なDOM階層よりも確実に存在する要素での検証を優先
  - `render`と`rerender`でprops変化による表示更新をテスト
- **Arrow関数の書き方**: `arrow-body-style`警告を避けるため、単純な戻り値の場合は`() => expression`形式を使用
- **テストのモック化**: `vi.mock`で複雑な依存コンポーネントをモック化し、テスト対象を絞り込む

## Step 10: Next-Stage 自動遷移 & OverlayResult (2025/6/8)

### うまくいった手法・手順

- **TDDアプローチによる確実な実装**: テストファーストで OverlayResult → NEXT_STAGE アクション → 自動遷移タイマー の順で実装することで、各段階での動作保証ができた
- **タイマー機能の段階的テスト**: jest.useFakeTimers を使った段階的テスト（999ms後→SUCCESS維持、1000ms後→GENERATING遷移）により正確な動作検証が可能
- **UI改善の即座の反映**: ユーザーフィードバック（画面全体が色で染まる問題）を受けて即座にスタイル修正し、テストも併せて更新する迅速な対応
- **Reducer の状態管理設計**: NEXT_STAGE アクションで bullet/bounceCount/progress/error を一括リセットすることで次ステージへの確実な初期化

### 汎用的なナレッジ

- **自動遷移UIの実装パターン**: SUCCESS/FAIL → タイマー設定 → クリーンアップ付きuseEffect → 次状態への遷移という流れが再利用可能
- **オーバーレイUIの段階的デザイン**: 最初は機能実装優先、動作確認後にユーザビリティ向上のためのデザイン調整を行う段階的アプローチ
- **テストでの時間制御**: vi.useFakeTimers + act() の組み合わせでReactの非同期状態更新を正確にテスト可能
- **Enum拡張時のベストプラクティス**: ActionTypes 追加 → Reducer ケース追加 → テスト追加の順序で、型安全性を保ちながら機能拡張

### 具体的なナレッジ

- **Timer クリーンアップの重要性**: useEffect での setTimeout は必ず return () => clearTimeout(timer) でクリーンアップしないとメモリリーク発生
- **Fake Timers のテスト技法**:
  - `vi.useFakeTimers()` / `vi.useRealTimers()` を beforeEach/afterEach で設定
  - `act(() => { vi.advanceTimersByTime(ms) })` でReactの状態更新を同期的にテスト
  - タイマー境界値（999ms/1000ms）での状態確認で正確な動作検証
- **オーバーレイスタイルの調整テクニック**:
  - 変更前: `${bgColor} bg-opacity-90` (画面全体に色適用)
  - 変更後: `bg-black bg-opacity-60` (背景) + `${messageColor}` (メッセージボックスのみ)
  - テスト更新: `overlay.querySelector('div')` で内部要素の色をテスト
- **React Testing Library でのスタイル検証**: `toHaveClass('class1', 'class2')` で複数クラスを一度に検証可能
- **Reducer テストパターン**: 各アクションタイプごとに期待される状態変化を明示的にテスト（bullet/bounceCount/progress/error の各フィールド）

## Step11: ControlBar & MaxBounceSelect → StageGenerator 連携

### うまくいった手法/手順

- reducer パターンで状態管理を適切に設計することで、UIコンポーネントとゲーム状態の連携がスムーズに実現できた
- TDD（テスト駆動開発）の手順：
  1. まずテストを実装してfailすることを確認
  2. 最小限の実装でテストをpass
  3. リファクタリングでコードを改善
  4. 追加機能の要求（即座のステージ再生成）に対してもテストファースト
- 段階的な修正アプローチ：
  1. 基本機能の実装（プルダウンとreducer連携）
  2. UI配置の修正（左下→右上への移動）
  3. 永続化問題の解決（ステージ変更後の値保持）
  4. UX改善（即座のステージ再生成）

### 汎用的なナレッジ

- UIコンポーネントの配置変更は開発の初期段階で仕様を確定させるべきだが、ユーザビリティの観点から後から修正することも重要
- 状態管理で「いつ値がリセットされるか」を明確に設計することで、予期しない動作を防げる
- 「ユーザーが期待する動作」と「実装された動作」の違いを素早く発見して修正する姿勢が重要
- reducerでの状態遷移は、関連する全ての状態を同時に更新することで一貫性を保てる

### 具体的なナレッジ

- React useContextとuseReducerの組み合わせで、propsのdrill-downを避けながら型安全な状態管理ができる
- Tailwindの`justify-end`と`justify-between`を使い分けることで、レイアウトの意図を明確に表現できる
- reducerのREADYアクションで新しいデータを受け取る際、現在の設定値を保持したい場合はスプレッド演算子で明示的に上書きする
- useEffectの依存配列に状態の一部（`state.stage.maxBounce`）を含めることで、特定の値の変更に反応できる
- テストでESLintの`@typescript-eslint/no-explicit-any`警告が出る場合、コメントで明示的に無効化することで意図を明確にできる
- ユーザーのアクション（プルダウン変更）に対して即座にフィードバック（ステージ再生成）を提供することで、UXが大幅に向上する

## Step12: AimGuide (予測反射ライン)

### うまくいった手法/手順

- **TDD + 実装変更のサイクル**: 最初mirrorSolveベースでテストを作成 → 要件変更で物理計算ベースに実装変更 → テストを新実装に合わせて修正
- **段階的な機能拡張**:
  1. 基本的な外周壁のみでの反射計算
  2. ブロック反射の追加（ユーザー要望）
  3. 統合的な最近接障害物検出システム
- **物理計算の実装パターン**: 直線と矩形の交点計算 → 法線ベクトル計算 → 反射ベクトル計算の段階的実装
- **要件変更に対する柔軟な対応**:
  - 当初：マウス座標への到達経路計算
  - 変更後：マウス方向への予測線延長
  - 追加要求：ブロックでの反射対応

### 汎用的なナレッジ

- **ユーザー要望の実装優先度**: 見た目の改善（単なる直線 → 実際の物理反射）は、ユーザー体験に直結するため最優先で対応すべき
- **物理計算の段階的実装**: 複雑な物理演算は最初に単純なケース（外周壁のみ）で実装し、段階的に複雑化（ブロック追加）することで安全に拡張可能
- **テストの実装依存性**: モックベースのテストは実装変更時に大幅な修正が必要になるため、可能な限り実際の動作をテストする方が保守性が高い
- **useMemoの依存配列管理**: 複雑な計算を含むフックでは、配列やオブジェクトの依存関係を正確に管理することでパフォーマンスと正確性を両立できる

### 具体的なナレッジ

- **直線と矩形の交点計算**: パラメトリック方程式 `P = start + t * direction` を使い、各辺との交点を個別計算して最小tを選択
- **法線ベクトルの計算**:
  - 外周壁: 境界判定（tolerance使用）で上下左右を特定
  - ブロック: 交点がどの辺上にあるかで法線を決定
- **反射計算の公式**: `reflection = direction - 2 * (direction · normal) * normal`
- **Canvas座標系でのPointer Events**:
  - `getBoundingClientRect()` でCanvas座標系に変換
  - `setPointerCapture()` / `releasePointerCapture()` はJSDOM環境では未対応のため条件分岐が必要
- **TailwindCSS点線描画**: `ctx.setLineDash([5, 5])` で点線パターン設定、`ctx.setLineDash([])` でリセット
- **型安全な物理計算**: Point型とRect型を適切に使い分けることで、座標とサイズの混同を防止
- **デバッグのためのテスト戦略**: 期待値の厳密な一致テストよりも、方向性や大まかな値の検証の方が実装変更に強い

## Step13: 視覚エフェクト（フラッシュ・トレイル・火花）& 自滅判定

### うまくいった手法/手順

- **TDD でパーティクルシステム設計**: ParticleEngine クラスの型定義 → テスト作成 → 実装の順序で確実な動作を保証
- **Canvas パフォーマンス最適化の事前調査**: web 検索で最新のベストプラクティス（requestAnimationFrame、オフスクリーンCanvas、最小更新領域）を収集してから実装
- **段階的なエフェクト統合**:
  1. ParticleEngine クラス単体での動作確認
  2. GameCanvas への統合（描画ループ、deltaTime 計算）
  3. 各ゲームイベント（発射・トレイル・ヒット・自滅）でのエフェクト生成
- **自滅判定の問題解決アプローチ**:
  - 問題発生（即座 fail）→ 原因調査（弾と砲台の重複）→ 根本修正（発射位置調整）
  - エフェクト表示問題→ 原因特定（FAIL フェーズでのパーティクルクリア）→ ライフサイクル修正

### 汎用的なナレッジ

- **物理エンジンとエフェクトシステムの分離**: Matter.js の物理計算と Canvas 2D のエフェクト描画を独立させることで、パフォーマンスと保守性を両立
- **パーティクルシステムの設計パターン**: 位置・速度・寿命・透明度を管理し、update/render を分離したクラス設計により拡張性と再利用性を確保
- **衝突検知の優先度設計**: 複数の衝突イベント（バウンス・成功・自滅）が同時発生する可能性を考慮し、重要度順にハンドリング
- **エフェクトの視認性向上**: 色・サイズ・持続時間・パーティクル数を組み合わせて、ユーザーが確実に認識できるレベルまで調整

### 具体的なナレッジ

- **Canvas 2D のパフォーマンス技法**:
  - `requestAnimationFrame` での deltaTime 計算: `(currentTime - lastTime) / 1000`
  - `ctx.save()` / `ctx.restore()` でのコンテキスト状態管理
  - パーティクル描画での `globalAlpha` 設定による透明度制御
- **Matter.js Body の配置問題**:
  - センサーBody（isSensor: true）は物理的な反発は起こさないが衝突検知は機能する
  - Body 生成位置の重複問題: `launchDistance = cannonRadius + bulletRadius + 余裕` で確実に分離
- **パーティクルエフェクトの設計**:
  - フラッシュ: 静止・大きな半径・短時間で瞬間的なインパクト
  - トレイル: 小さな半径・中程度の寿命・5 フレーム間隔で軌跡表現
  - 火花: 放射状・高速度・中程度の寿命で爆発表現
- **React useEffect でのライフサイクル管理**:
  - FAIL フェーズ: パーティクルを残してエフェクト表示
  - GENERATING フェーズ: 新ステージ開始時にパーティクルクリア
  - クリーンアップの優先度を明確にすることで意図しない動作を防止
- **デバッグログの活用**: エフェクト生成時のパーティクル数ログにより、コールバック実行とエフェクト生成の確認が可能
- **色の使い分け**: 白い砲台に対して赤色（#ff0000）エフェクトで明確なコントラスト、黄色（#ffff00）火花で爆発感を演出

## Step14: DebugPanel & FPS Counter

### うまくいった手法/手順

- **段階的な機能実装アプローチ**:
  1. FPSメーター単体実装 → GameStateへのデバッグ状態追加 → UI統合 → 環境フラグ設定
  2. 各機能の独立テスト作成で確実な動作保証
- **環境分離設計**: `__DEV__`フラグでDEV環境のみ表示、プロダクションビルドでは自動tree-shake
- **型安全なステージシード管理**: Stage型にseedフィールド追加し、generateStage関数で確実にseed値を保存
- **Vite設定の段階的修正**: process.env問題 → defineConfig関数形式への変更で環境変数アクセス問題を解決

### 汎用的なナレッジ

- **デバッグツールの設計原則**: 本体機能に影響せず、開発時のみ表示し、プロダクション環境では完全除去される仕組み
- **FPS計測の標準パターン**: requestAnimationFrame + 1秒間隔でのフレームカウント平均化による安定した計測
- **React Context + useReducer パターンでの状態拡張**: 既存の状態管理に新機能（グリッド表示）を追加する際の最小影響実装
- **36進数表示の利点**: 大きな数値（タイムスタンプ）を短く読みやすい文字列で表現（デバッグ時のシード値共有に有効）

### 具体的なナレッジ

- **Vite環境変数とTypeScript対応**:
  - `defineConfig(({ mode }) => ({ define: { __DEV__: JSON.stringify(mode === 'development') } }))`
  - `declare const __DEV__: boolean;` をvite-env.d.tsに追加
- **Canvas上でのグリッド描画技法**:
  - セルサイズ計算: `CELL_SIZE = width / GRID_COUNT`（960px ÷ 10 = 96px）
  - `ctx.strokeStyle = '#444444'` + `ctx.lineWidth = 1` で目立ちすぎない補助線
- **useFpsMeter hookの実装パターン**:
  - `performance.now()` での高精度タイムスタンプ
  - `frameCountRef` + `lastTimeRef` でのフレーム数カウント
  - 1秒間隔での平均FPS計算とsetState更新
- **React useEffectの依存配列管理**: Canvas描画ループでstate.showGridの依存関係を明示的に追加してESLint警告解消
- **テスト環境でのDEVフラグ対応**: vitest.config.tsのdefineセクションで`__DEV__: true`設定によりテスト実行時エラー回避
- **DebugPanelのUI設計**: 固定位置（right-2 top-2）+ 半透明背景 + 最小幅設定で開発時の視認性と操作性を確保

## Step15: レスポンシブ対応 & リサイズハンドリング

### うまくいった手法/手順

- **TDD + 漸進的修正アプローチ**:
  1. calcViewport関数のテスト先行実装 → 基本機能実装 → useResizeObserver実装 → GameCanvas統合 → UI調整
  2. 各段階でテスト実行によりデグレを早期発見
- **スケール変換パターン**: matter.jsワールド座標（960x720固定）とCanvas表示座標の分離により、ゲームロジックを変更せずレスポンシブ対応
- **オーバーレイ配置の段階的修正**: fixed → absolute変更によりゲームエリア内配置を実現
- **グリッド精度問題の原因特定**: ユーザーフィードバックから具体的な問題（7.5分割）を特定し、CELL_WIDTH/CELL_HEIGHT分離で解決

### 汎用的なナレッジ

- **レスポンシブCanvas設計の基本原則**:
  - 論理サイズ（ワールド座標）と表示サイズ（Canvas座標）の明確な分離
  - アスペクト比維持とLetterbox対応による様々なデバイス対応
- **useResizeObserver + calcViewport パターン**: コンテナサイズ監視 → アスペクト比計算 → Canvas動的リサイズの安定した実装手法
- **Canvas座標変換の統一管理**: canvasToWorld/worldToCanvas関数によるマウスイベント処理の一元化
- **テスト環境でのCanvas対応**: ctx.save/restore関数存在チェックによりテスト環境での描画ループ安全実行
- **ビルドエラーとテストエラーの分離対応**: TypeScript未使用変数警告とVitest環境差異を個別に解決

### 具体的なナレッジ

- **4:3アスペクト比維持のcalcViewport実装**:
  - 左右32px余白考慮: `availableWidth = windowWidth - 64`
  - Letterbox対応: `Math.min(heightByWidth, widthByHeight)` で小さい方に制限
  - 最小幅保証: `Math.max(availableWidth, 320)` でモバイル対応
- **Canvas描画でのスケール変換技法**:
  - `ctx.scale(scaleFactor.x, scaleFactor.y)` でワールド座標系を一括変換
  - 線幅調整: `ctx.lineWidth = baseWidth / scaleFactor.x` でスケール対応
  - パーティクル描画はスケール変換内で実行してワールド座標系維持
- **useResizeObserver型安全実装**:
  - 戻り値型: `[React.RefObject<T | null>, { width: number; height: number }]`
  - ResizeObserver未対応ブラウザへの対応: `typeof ResizeObserver === 'undefined'` チェック
- **グリッド描画の正確な分割**:
  - 横線: `CELL_HEIGHT = worldSize.height / GRID_COUNT` (72px)
  - 縦線: `CELL_WIDTH = worldSize.width / GRID_COUNT` (96px)
  - ステージ生成アルゴリズムとの完全一致でデバッグ効率向上
- **オーバーレイのゲームエリア内配置**: `fixed inset-0` → `absolute inset-0` でrelative親要素内でのフルスクリーン表示
- **テスト修正パターン**: 描画ループ実行有無の条件分岐により環境差異を吸収（`mockClearRect.mock.calls.length > 0`）
