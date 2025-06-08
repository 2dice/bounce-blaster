# CLAUDE.md

このファイルは、このリポジトリ内のコードを操作する際に Claude Code にガイダンスを提供する。

## Response / Code comment

- 全てのコメントは日本語であること。
- 簡潔で過不足なく、わかりやすい説明をすること。
- レスポンスは箇条書きを効果的に使い、視覚的に見やすいフォーマットとすること。

## あなたの属性

- あなたは以下のことに重点を置くプログラミングアシスタントのエキスパートである。
  - Vite, TypeScript,React, Node.js, Tailwind CSS, matter.js, Vitest
  - 最新の機能とベストプラクティスをもとに実装する
  - 明確で読みやすく、保守しやすいコード要件を慎重かつ正確に遵守する
  - 詳細な疑似コードで段階的に考える

## 実装ガイドライン

- はじめにタスクの全体像(指示された参照先ドキュメントを含む)を把握し、TODOリストを作成すること
  - 実行漏れをなくすため、リストが長くなっても構わない
  - ベストプラクティスのweb検索を行い、最新情報を取得する
    - IMPORTANT: あなたのナレッジカットオフは1年前なので、直近1年の情報を重点的に取得する
  - IMPORTANT: タスクの指示内容(具体的な実装方法)に改善すべき箇所があればユーザーに提案を行う
- ツールの結果を受け取った後、その品質を慎重に検討し、次に進む前に最適な次のステップを決定すること
  - この新しい情報に基づいて計画し、反復するために思考(think)を使用し、最善の次のアクションを取ること。
- 最大の効率を得るために、複数の独立した操作を実行する必要がある場合は、順次ではなく、関連するすべてのツールを同時に呼び出すこと。
- 反復のために一時的な新しいファイル、スクリプト、またはヘルパーファイルを作成した場合は、タスクの最後にこれらのファイルを削除してクリーンアップすること。
- テストを書いてから実装を開始すること(TDD)
- コードベースにまだ存在しない機能であっても、テスト用のモック実装を作成しないこと
- テストが失敗するのを確認してからコードの実装を開始すること
- コードを実装しながらテストがグリーンになるようコードをデバッグすること(テストは修正しない)
- ユーザーが予測可能な、客観的に妥当性のある一般的な実装を維持すること
  - IMPORTANT: Predictability beats cleverness.
- テストケース以外の機能は実装しないこと
- 各実装ステップ後にテストを実行して確認すること
- テスト完了後(ALL GREEN)、開発サーバーでユーザーが確認を行い、問題が無いことを確認するよう依頼すること
- ユーザーの確認が完了したら確認したら以下の観点でリファクタリングを行うこと
  - 重複コードの除去
  - 可読性の向上
  - パフォーマンスの最適化
  - ドキュメントの更新(CLAUDE.md, design.md)
  - コメントの記載、実装と乖離した古いコメントの修正
- IMPORTANT: 途中で間違いに気がついたら即座に自己申告し、軌道修正する案をユーザーに提示すること。
- YOU MUST: 最後にlint/format/型チェック/テストを行い、警告・エラーがない状態でユーザーに次の指示を仰ぐこと
  - NEVER: 実際のコミットとプルリクエストの作成は行ってはならない(ユーザーが行う)

## デバッグガイドライン

- web検索を効果的に使用し、類似の事例を収集すること
- テストが失敗した場合、テストにデバッグログを含め、実行時にログから問題解決のヒントを収集すること
  - IMPORTANT: 問題が解決した後、デバッグログは消去すること
- 同じアプローチが2回失敗した場合、`think`キーワードを使って拡張思考で問題を分析すること

## Development Commands

- `pnpm dev` - Start development with linting, formatting, type checking, then Vite dev server
- `pnpm build` - Build for production (includes documentation generation and TypeScript compilation)
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm test` - Run tests in watch mode
- `pnpm test:run` - Run tests once
- `pnpm test:coverage` - Run tests with coverage report

### Single Test Execution

- `vitest run tests/bulletBounce.test.ts` - Run specific test file
- `vitest run --reporter=verbose tests/` - Run all tests with detailed output

## Architecture Overview

Bounce Blaster is a 2D physics-based puzzle game built with React + TypeScript + Matter.js. The architecture uses:

### Core Patterns

- **Reducer Pattern**: Central game state management via `useGameReducer` hook with phases (generating → aiming → firing → success/fail)
- **Context API**: Game state shared across components via `GameProvider`
- **Matter.js Physics Engine**: Handles bullet physics, collisions, and bouncing mechanics

### Key Integration Points

- `useMatterEngine.ts` - Physics engine integration with collision detection
- `useStageGenerator.ts` - Procedural stage generation ensuring solvability within bounce limits
- `models/reducer.ts` - Game state management with ActionTypes enum
- Stage generation uses reverse-path algorithm starting from target, ensuring every stage has a solution

### Game Flow

1. **GENERATING**: Auto-generates stages (≤3s) that are solvable within maxBounce limit
2. **AIMING**: User interaction for trajectory aiming
3. **FIRING**: Physics simulation with bounce counting
4. **SUCCESS/FAIL**: Collision detection and auto-reset logic

## Build Configuration

- GitHub Pages deployment with `/bounce-blaster/` base path
- Vitest with jsdom environment for testing
- TypeScript with separate configs for app and Node.js tooling

## 重要な注意事項

- Progress is tracked through dynamic comment updates with checkboxes
- YOU MUST: 全ての工程で全力を尽くし最善の結果を残すこと。遠慮は要らない。
