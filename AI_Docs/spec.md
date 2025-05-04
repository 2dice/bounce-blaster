要件定義書
Web ミニゲーム「Bounce Blaster」

---

# 0. 目的

ブラウザ（iPad 横持ち／PC）で遊べる 2D ビリヤードライクの反射シューティングを制作する。

- Vite + React + TypeScript + Tailwind CSS を主軸とし、物理演算に matter.js を使用
- ステージは自動生成。ユーザが選んだ最大 1〜5 バウンド以内で必ずクリア可能

# 1. ゲームプレイ仕様

1-1. 画面構成（トップビュー 2D）

1. プレイフィールド：横長長方形（外周は壁）
2. キャノン：ステージ開始時にランダム座標（外周から一定マージン内）
3. ターゲット：1 個。ヒットでクリア
4. 矩形ブロック：軸平行のみ。反射対象

1-2. 入力

- タップ／クリック＆ドラッグで照準角を決定（パワー調整なし）
- ドラッグ中はリアルタイムで弾道ガイド（最大 5 反射まで予測線）

1-3. 弾丸挙動（matter.js）

- 初速：固定値（毎ステージ同一）
- 反射：完全鏡面（反発係数 = 1.0）
- 最大バウンド：ユーザ選択（1-5）を超えたら弾消滅 → 失敗
- エフェクト：
  - 発射時：マズルフラッシュ風の短アニメ
  - 飛行時：半透明な残像／パーティクルトレイル
  - ヒット時：火花スプライト＋ターゲット点滅  
    （いずれも Canvas 2D で簡易実装、FPS30 を維持できる粒度）

1-4. ゲームフロー

- ステージ生成(≤3s) → 照準 → 発射 → 成功／失敗 → 自動で次ステージ

# 2. ステージ自動生成

2-1. 入力パラメータ  
　N：最大バウンド数（1〜5）  
2-2. 逆算アルゴリズム（matter.js 非依存部分は幾何計算で自前実装）  
　step1. フィールドサイズ決定（表示幅に応じてスケール）  
　step2. キャノン座標 C を乱数配置  
　step3. ターゲット座標 T を乱数配置  
　step4. ランダム反射シーケンス S (長さ N 以下) を生成  
　step5. 鏡写し法で C→T を逆射して正当な発射角 θ を算出  
　step6. 角度が実現不可能／外周をはみ出す場合は step2 からリトライ  
　step7. 弾道を遮らない位置に矩形ブロックをランダム配置  
　step8. 完成データを返却（C, T, walls, solutionPath）  
　※ タイムアウト：2.5 s／試行上限 200 回

# 3. UI／UX

3-1. レイアウト

- iPad 横 4:3 を基準。Viewport に合わせ Canvas を scaleFit

3-2. 画面要素

1. Canvas（プレイ領域）
2. Select-Box：最大バウンド数 (1-5)
3. 生成中：半透明オーバーレイ＋プログレスバー
4. DEV-Overlay：FPS/Debug toggle (開発時のみ)

3-3. レスポンシブ

- PC では横幅 100 %、縦は比率固定し letter-box

# 4. 技術スタック

4-1. フレームワーク

- Vite + React 18 + TypeScript
- Tailwind CSS（プリセット utility のみ。カスタム最小限）

4-2. 物理エンジン

- matter.js
  - 壁・ブロック：Static Body
  - 弾丸：Circle Body, restitution = 1, friction = 0

4-3. 描画

- Canvas 2D（matter.js の render は使わず独自描画で軽量化）
- パーティクル：light-weight 自前クラス or ts-particulate など

4-4. 開発支援

- ESLint + Prettier + Husky + lint-staged
- Vitest + React Testing Library
- GitHub Actions：CI → GitHub Pages deploy

# 5. 非機能要件

- FPS：target 30、可能なら 60
- ステージ生成：≤3 s。経過をプログレスバーに 100 ms 毎反映
- 対応ブラウザ：Safari(iPadOS16+), Chrome/Edge 最新版
- アクセシビリティ：タッチ／マウスのみ。キーボード非対応
- サウンド：無し

# 6. データモデル（概略）

```
interface Stage {
  w: number; h: number;
  cannon:   Point;
  target:   Point;
  walls:    Rect[];
  solution: Vector[]; // バウンド点列（内部用）
  maxBounce: 1|2|3|4|5;
}
```

# 7. 今後の検討／未確定

1. ブロックのサイズ・個数レンジ調整（難易度バリエーション）
2. ゲームオーバー演出（ステージ失敗時の視覚効果）
3. ステージシード保存・共有機能（再現性テスト用）
4. 将来拡張：重力／弾速減衰 ON/OFF、複数ターゲットなど
