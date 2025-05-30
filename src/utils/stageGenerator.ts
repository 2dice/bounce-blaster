import { Point, Rect, Stage } from '../models/types';
import { mirrorSolve, Direction } from './geom';
import { segmentIntersectsRect } from './intersect';

export interface GenerateStageOptions {
  seed?: number;
  width?: number;
  height?: number;
  maxBounce?: 1 | 2 | 3;
  onProgress?: (_value: number) => void;
}

const CELL = 10; // 10x10 グリッド
const BLOCK_COUNT = 20;

function rng(seed: number) {
  let x = seed;
  return () => {
    // xorshift32
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return (x >>> 0) / 2 ** 32;
  };
}

function randomCellCenter(rnd: () => number, w: number, h: number): Point {
  const cx = Math.floor(rnd() * CELL);
  const cy = Math.floor(rnd() * CELL);
  const cellW = w / CELL;
  const cellH = h / CELL;
  return { x: cx * cellW + cellW / 2, y: cy * cellH + cellH / 2 };
}

function randomDirectionSeq(rnd: () => number, maxBounce: number): Direction[] {
  // 1 ~ maxBounce の範囲で長さを決定 (バウンド数0は禁止)
  const len = Math.floor(rnd() * maxBounce) + 1;
  const dirs: Direction[] = ['Left', 'Right', 'Top', 'Bottom'];
  const seq: Direction[] = [];
  for (let i = 0; i < len; i++) {
    let d: Direction;
    do {
      d = dirs[Math.floor(rnd() * 4)];
    } while (i > 0 && d === seq[i - 1]);
    seq.push(d);
  }
  return seq;
}

// randomBlocks は旧実装で使用していたが現仕様で不要となったため削除

// solution パスの各セグメントと wall が交差するか判定
function wallIntersectsSolution(wall: Rect, path: Point[]): boolean {
  for (let i = 0; i < path.length - 1; i += 1) {
    if (segmentIntersectsRect(path[i], path[i + 1], wall)) return true;
  }
  return false;
}

function cellRect(cx: number, cy: number, cellW: number, cellH: number): Rect {
  return { x: cx * cellW, y: cy * cellH, w: cellW, h: cellH };
}

/** 砲台とターゲットを結ぶ直線と交差し、かつ solution と交差しないセルを 1 つ返す */
function pickBlockOnLine(
  cannon: Point,
  target: Point,
  w: number,
  h: number,
  solution: Point[],
  rnd: () => number,
): Rect {
  const cellW = w / CELL;
  const cellH = h / CELL;
  const candidates: Rect[] = [];

  for (let cx = 0; cx < CELL; cx += 1) {
    for (let cy = 0; cy < CELL; cy += 1) {
      // 砲台・ターゲットセルは除外
      const centerX = cx * cellW + cellW / 2;
      const centerY = cy * cellH + cellH / 2;
      if (
        (Math.abs(centerX - cannon.x) < 1e-6 &&
          Math.abs(centerY - cannon.y) < 1e-6) ||
        (Math.abs(centerX - target.x) < 1e-6 &&
          Math.abs(centerY - target.y) < 1e-6)
      ) {
        continue;
      }

      const rect = cellRect(cx, cy, cellW, cellH);
      // 直線と交差する
      if (!segmentIntersectsRect(cannon, target, rect)) continue;
      // solution と交差しない
      if (wallIntersectsSolution(rect, solution)) continue;

      candidates.push(rect);
    }
  }

  // 候補が無い場合はエラーをスロー
  if (candidates.length === 0) {
    throw new Error(
      'pickBlockOnLine: No suitable block found on the line between cannon and target that does not intersect the solution path.',
    );
  }

  // 最終的に候補から 1 つ選択
  const idx = Math.floor(rnd() * candidates.length);
  return candidates[idx];
}

export function generateStage(options: GenerateStageOptions = {}): Stage {
  const {
    seed: initialSeed = Date.now(), // 元のシードを保持
    width = 960,
    height = 720,
    maxBounce = 3,
    onProgress,
  } = options;

  const MAX_STAGE_GENERATION_ATTEMPTS = 2000; // ステージ生成全体のリトライ上限

  for (let attempt = 0; attempt < MAX_STAGE_GENERATION_ATTEMPTS; attempt++) {
    // 各試行で元のシードを使って乱数生成器を初期化
    const currentAttemptSeed = initialSeed + attempt; // 試行ごとにseedを変える
    const rnd = rng(currentAttemptSeed); // このseedで乱数生成器を初期化

    onProgress?.(0); // この試行の初期進捗

    try {
      // 砲台・ターゲット配置 (1マス以上離す)
      let cannon: Point;
      let target: Point;
      do {
        cannon = randomCellCenter(rnd, width, height);
        target = randomCellCenter(rnd, width, height);
      } while (
        Math.abs(cannon.x - target.x) < width / CELL ||
        Math.abs(cannon.y - target.y) < height / CELL
      );
      const progressAfterCannonTarget = 10;
      onProgress?.(progressAfterCannonTarget);

      // mirrorSolve 試行
      let solution: Point[] | null = null;
      const maxMirrorTries = 40; // mirrorSolve内部のリトライ上限
      let progressAfterMirrorSolve = progressAfterCannonTarget;
      let mirrorSolveSuccess = false;

      for (let i = 0; i < maxMirrorTries; i++) {
        const seq = randomDirectionSeq(rnd, maxBounce);
        const currentSolution = mirrorSolve(cannon, target, seq, width, height);
        const currentMirrorAttemptProgress = Math.round(
          progressAfterCannonTarget + ((i + 1) * 40) / maxMirrorTries,
        );
        onProgress?.(currentMirrorAttemptProgress);
        if (currentSolution) {
          solution = currentSolution;
          progressAfterMirrorSolve = currentMirrorAttemptProgress;
          mirrorSolveSuccess = true;
          break;
        }
      }

      if (!mirrorSolveSuccess) {
        throw new Error(
          'MirrorSolveFailedThisAttempt: No solution found by mirrorSolve.',
        );
      }
      if (!solution) {
        // 論理的に到達しないはずだが、型安全のためにチェック
        throw new Error(
          'InternalError: Solution is null after mirrorSolve success.',
        );
      }

      // まず直線上のブロックを 1 つ決定 (エラーを投げる可能性あり)
      const mandatory = pickBlockOnLine(
        cannon,
        target,
        width,
        height,
        solution,
        rnd,
      );

      const walls: Rect[] = [mandatory];
      const cellW = width / CELL;
      const cellH = height / CELL;

      // 残りのブロックをランダム配置 (solution と交差しない)
      const progressBeforeRandomBlocks = progressAfterMirrorSolve;
      const targetProgressAfterAllBlocks = 95;
      const progressAllocatedForRandomBlocks =
        targetProgressAfterAllBlocks - progressBeforeRandomBlocks;
      const numRandomBlocksToPlaceInLoop = BLOCK_COUNT - 1; // mandatory が1つ配置済み

      let blocksInLoopSuccessfullyPlaced = 0;
      let randomBlockPlacementTries = 0;
      const MAX_RANDOM_BLOCK_PLACEMENT_TRIES = BLOCK_COUNT * 20; // ランダム配置の試行上限

      if (numRandomBlocksToPlaceInLoop > 0) {
        while (
          walls.length < BLOCK_COUNT &&
          randomBlockPlacementTries < MAX_RANDOM_BLOCK_PLACEMENT_TRIES
        ) {
          randomBlockPlacementTries++;
          const cx = Math.floor(rnd() * CELL);
          const cy = Math.floor(rnd() * CELL);
          const rect = cellRect(cx, cy, cellW, cellH);

          const cannonCellX = Math.floor(cannon.x / cellW);
          const cannonCellY = Math.floor(cannon.y / cellH);
          const targetCellX = Math.floor(target.x / cellW);
          const targetCellY = Math.floor(target.y / cellH);

          if (
            (cx === cannonCellX && cy === cannonCellY) || // 砲台セルを除外
            (cx === targetCellX && cy === targetCellY) || // ターゲットセルを除外
            wallIntersectsSolution(rect, solution) || // 解法経路と交差するものを除外
            walls.some(
              // 既に配置された壁と重複するものを除外
              w =>
                Math.abs(w.x - rect.x) < 1e-6 && Math.abs(w.y - rect.y) < 1e-6,
            )
          ) {
            continue;
          }

          walls.push(rect);
          blocksInLoopSuccessfullyPlaced++;
          if (numRandomBlocksToPlaceInLoop > 0) {
            // 0除算を避ける
            const incrementalProgress = Math.round(
              (blocksInLoopSuccessfullyPlaced *
                progressAllocatedForRandomBlocks) /
                numRandomBlocksToPlaceInLoop,
            );
            onProgress?.(progressBeforeRandomBlocks + incrementalProgress);
          }
        }
        if (walls.length < BLOCK_COUNT) {
          throw new Error(
            'RandomBlockPlacementFailedThisAttempt: Could not place all random blocks.',
          );
        }
      }

      // 全てのブロック配置後、確実に95%を報告
      onProgress?.(targetProgressAfterAllBlocks);
      onProgress?.(100); // 最終進捗

      return {
        width,
        height,
        maxBounce,
        cannon,
        target,
        walls,
        solution,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      // eslint-disable-next-line no-console
      console.warn(
        `generateStage attempt ${attempt + 1}/${MAX_STAGE_GENERATION_ATTEMPTS} (seed ${currentAttemptSeed}) failed: ${errorMessage}. Retrying...`,
      );
      if (attempt === MAX_STAGE_GENERATION_ATTEMPTS - 1) {
        // 全てのリトライ試行が失敗
        throw new Error(
          `generateStage: Failed to generate stage with initial seed ${initialSeed} after ${MAX_STAGE_GENERATION_ATTEMPTS} attempts (seeds ${initialSeed} to ${initialSeed + attempt}). Last error on seed ${currentAttemptSeed}: ${errorMessage}`,
        );
      }
      // 次の試行へ (ループの次のイテレーション)
    }
  }
  // MAX_STAGE_GENERATION_ATTEMPTS 回試行しても成功しなかった場合 (論理的に到達しないはず)
  throw new Error(
    `generateStage: Exhausted all attempts for initial seed ${initialSeed}. This indicates a problem in the retry logic. Please check for persistent failures with specific seed patterns.`,
  );
}
