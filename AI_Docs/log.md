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
