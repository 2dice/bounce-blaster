import { Point, Particle, ParticleType } from '../models/types';

/**
 * パーティクルエフェクトを管理するエンジンクラス
 * Canvas 2D APIで描画を行う
 * パーティクル数を制限してメモリ使用量を抑制
 */
export class ParticleEngine {
  private particles: Particle[] = [];
  private idCounter = 0;
  private readonly maxParticles = 200; // パーティクル数の上限

  /**
   * パーティクルを生成して追加
   * 最大数を超えた場合は古いパーティクルを削除
   */
  addParticle(
    position: Point,
    velocity: Point,
    type: ParticleType,
    options?: Partial<
      Pick<Particle, 'color' | 'radius' | 'alpha' | 'lifespan'>
    >,
  ): void {
    // 最大数チェック
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift(); // 最も古いパーティクルを削除
    }

    const defaults = this.getParticleDefaults(type);
    const particle: Particle = {
      id: `particle_${this.idCounter++}`,
      position,
      velocity,
      color: options?.color ?? defaults.color,
      radius: options?.radius ?? defaults.radius,
      alpha: options?.alpha ?? defaults.alpha,
      lifespan: options?.lifespan ?? defaults.lifespan,
      maxLifespan: options?.lifespan ?? defaults.lifespan,
    };
    this.particles.push(particle);
  }

  /**
   * 発射時フラッシュエフェクト生成
   * 砲台位置に白い光の拡散エフェクトを0.3秒間表示
   */
  createFlashEffect(position: Point): void {
    this.addParticle(position, { x: 0, y: 0 }, 'flash', {
      radius: 30,
      color: '#ffffff',
      alpha: 0.8,
      lifespan: 0.3,
    });
  }

  /**
   * 弾のトレイルエフェクト生成
   * 弾の軌跡に小さな赤い残像を生成（5フレームごとに呼び出し）
   */
  createTrailEffect(position: Point): void {
    // 小さなランダム速度でトレイルパーティクルを生成
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };

    this.addParticle(position, velocity, 'trail', {
      radius: 3,
      color: '#ff3333',
      alpha: 0.4,
      lifespan: 0.5,
    });
  }

  /**
   * ヒット時火花エフェクト生成
   * 指定位置から放射状に黄色い火花を拡散
   */
  createSparkEffect(position: Point, count = 20): void {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 50 + Math.random() * 100;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };

      this.addParticle(position, velocity, 'spark', {
        radius: 2,
        color: '#ffff00',
        alpha: 1.0,
        lifespan: 0.5,
      });
    }
  }

  /**
   * パーティクルシステムの更新（デルタタイム秒）
   */
  update(deltaTime: number): void {
    this.particles = this.particles
      .map(particle => ({
        ...particle,
        position: {
          x: particle.position.x + particle.velocity.x * deltaTime,
          y: particle.position.y + particle.velocity.y * deltaTime,
        },
        lifespan: particle.lifespan - deltaTime,
        alpha: Math.max(
          0,
          (particle.lifespan / particle.maxLifespan) * particle.alpha,
        ),
      }))
      .filter(particle => particle.lifespan > 0);
  }

  /**
   * パーティクルをCanvas 2Dコンテキストに描画
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.particles.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(
        particle.position.x,
        particle.position.y,
        particle.radius,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();
    });
  }

  /**
   * 全パーティクルをクリア
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * アクティブなパーティクル数を取得
   */
  getParticleCount(): number {
    return this.particles.length;
  }

  /**
   * パーティクルタイプ別のデフォルト値を取得
   */
  private getParticleDefaults(
    type: ParticleType,
  ): Pick<Particle, 'color' | 'radius' | 'alpha' | 'lifespan'> {
    switch (type) {
      case 'flash':
        return {
          color: '#ffffff',
          radius: 20,
          alpha: 0.8,
          lifespan: 0.2,
        };
      case 'trail':
        return {
          color: '#ff3333',
          radius: 3,
          alpha: 0.4,
          lifespan: 0.5,
        };
      case 'spark':
        return {
          color: '#ffff00',
          radius: 2,
          alpha: 1.0,
          lifespan: 0.5,
        };
      default:
        return {
          color: '#ffffff',
          radius: 1,
          alpha: 1.0,
          lifespan: 1.0,
        };
    }
  }
}
