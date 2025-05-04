GitHub 運用ガイド

# 1. ブランチ戦略

main … 常に動く / deploy 可能な状態  
feat/stepX-YYY … 実装ステップごとに分岐  
gh-pages … GitHub Pages が自動生成する静的ブランチ（直接触れない）

1. `git switch -c feat/step1-init`
2. 実装 → commit（Husky が Lint/Prettier を自動実行）
3. `git push -u origin feat/step1-init`
4. GitHub CLIで Pull Request を作成
5. CI (lint + test) が PASS → ユーザーが “Squash and merge”  
   → main に取り込まれた瞬間、Deploy ワークフローが dist を gh-pages へ push  
   (レビューの結果、変更が必要なら修正)
6. PR を閉じる → mainブランチでpullし、次のステップ用 feat ブランチを切る

# 2. GitHub Actions 構成イメージ

```
📁 .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm test --run
```

```
📁 .github/workflows/deploy.yml
name: Deploy Pages
on:
  push:
    branches: [main]        # main に入ったときだけ
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions: { pages: write, id-token: write }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build       # Vite → dist/
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - uses: actions/deploy-pages@v4
```

リポジトリ設定  
Settings → Pages → “Deploy from GitHub Actions” を選択（URL は変わらない）。

# 3. ローカル作業フロー

1. `pnpm i`
2. `pnpm dev` で確認
3. `pnpm lint` / `pnpm test` ← Husky pre-commit でも走る
4. featブランチにcommit → push → PR
5. CI が通過 → 自動デプロイ
6. 公開 URL で動作確認（キャッシュ対策に ?v=xxxx を付けると確実）

# 4. コミット & PR 規約

- コミットメッセージ：  
  feat(step12): AimGuide (予測反射ライン) 実装  
  fix(step7-2): 弾 Body 生成 & 手動発射（クリック位置方向）レビューコメントの内容を修正

- PR テンプレ：

```
  ### 目的 / 関連ステップ
  ### 実装内容
  ### 動作確認方法
  ### 備考
```
