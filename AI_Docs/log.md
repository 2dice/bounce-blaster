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
