/**
 * 恐怖氛围渲染器
 *
 * 渲染效果：
 * - 极度黑暗（global darkness）
 * - 潮湿雾气（fog）
 * - 墙面腐朽（decay textures）
 * - 画面噪点（film grain）
 * - 晕影效果（vignette）
 * - 色调映射（color grading - 冷色调、去饱和）
 *
 * 参考照片级真实感的恐怖游戏视觉
 */

import { HorrorGameConfig } from '../types/horror';

export class HorrorRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: HorrorGameConfig['atmosphereSettings'];

  // 纹理缓存
  private noiseTexture: ImageData | null = null;
  private decayPattern: ImageData | null = null;

  constructor(canvas: HTMLCanvasElement, config: HorrorGameConfig['atmosphereSettings']) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    this.config = config;

    this.generateTextures();
  }

  /**
   * 生成纹理
   */
  private generateTextures() {
    // 生成噪点纹理
    this.noiseTexture = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    const noiseData = this.noiseTexture.data;

    for (let i = 0; i < noiseData.length; i += 4) {
      const noise = Math.random() * 255;
      noiseData[i] = noise;
      noiseData[i + 1] = noise;
      noiseData[i + 2] = noise;
      noiseData[i + 3] = this.config.noiseLevel * 2.55;  // 转换为0-255
    }

    // 生成腐朽图案
    this.decayPattern = this.generateDecayPattern();
  }

  /**
   * 生成腐朽图案（霉斑、水渍、裂纹）
   */
  private generateDecayPattern(): ImageData {
    const pattern = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    const data = pattern.data;

    // 使用Perlin噪声模拟霉斑分布
    for (let y = 0; y < this.canvas.height; y++) {
      for (let x = 0; x < this.canvas.width; x++) {
        const index = (y * this.canvas.width + x) * 4;

        // 简化的噪声函数
        const noise1 = this.simpleNoise(x * 0.01, y * 0.01);
        const noise2 = this.simpleNoise(x * 0.05, y * 0.05);

        // 霉斑颜色：暗绿色和黑色
        const decay = noise1 * noise2;

        if (decay > 0.6) {
          // 深色霉斑
          data[index] = 20 + Math.random() * 10;      // R
          data[index + 1] = 30 + Math.random() * 10;  // G
          data[index + 2] = 20 + Math.random() * 10;  // B
          data[index + 3] = (this.config.decayLevel / 100) * 128;  // Alpha
        } else if (decay > 0.4) {
          // 水渍
          data[index] = 40;
          data[index + 1] = 40;
          data[index + 2] = 45;
          data[index + 3] = (this.config.decayLevel / 100) * 64;
        } else {
          data[index + 3] = 0;  // 透明
        }
      }
    }

    return pattern;
  }

  /**
   * 简化的噪声函数
   */
  private simpleNoise(x: number, y: number): number {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  }

  /**
   * 渲染氛围层
   */
  render(videoCanvas?: HTMLCanvasElement, lightLevel: number = 25) {
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 保存状态
    this.ctx.save();

    // 1. 清空画布
    this.ctx.clearRect(0, 0, width, height);

    // 2. 如果有视频画布（AR摄像头），先绘制
    if (videoCanvas) {
      this.ctx.globalAlpha = 0.3;  // 半透明，营造混合效果
      this.ctx.drawImage(videoCanvas, 0, 0, width, height);
      this.ctx.globalAlpha = 1.0;
    }

    // 3. 应用全局黑暗
    this.applyGlobalDarkness(lightLevel);

    // 4. 渲染腐朽纹理
    if (this.decayPattern) {
      this.ctx.putImageData(this.decayPattern, 0, 0);
    }

    // 5. 渲染雾气
    this.renderFog();

    // 6. 应用晕影效果
    this.applyVignette();

    // 7. 应用噪点
    if (this.noiseTexture) {
      this.ctx.globalCompositeOperation = 'overlay';
      this.ctx.globalAlpha = 0.15;
      this.ctx.putImageData(this.noiseTexture, 0, 0);
      this.ctx.globalCompositeOperation = 'source-over';
      this.ctx.globalAlpha = 1.0;
    }

    // 8. 色调映射 - 冷色调、去饱和
    this.applyColorGrading();

    // 恢复状态
    this.ctx.restore();
  }

  /**
   * 应用全局黑暗
   */
  private applyGlobalDarkness(lightLevel: number) {
    const darkness = 1 - (lightLevel / 100);
    const globalDarkness = this.config.globalDarkness / 100;

    const combinedDarkness = Math.min(darkness * globalDarkness, 0.95);

    this.ctx.fillStyle = `rgba(0, 0, 0, ${combinedDarkness})`;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 渲染雾气效果
   */
  private renderFog() {
    const fogIntensity = this.config.fogIntensity / 100;

    // 多层雾气，模拟深度
    for (let i = 0; i < 3; i++) {
      const gradient = this.ctx.createRadialGradient(
        this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        this.canvas.height / 2 + (Math.random() - 0.5) * 200,
        0,
        this.canvas.width / 2,
        this.canvas.height / 2,
        this.canvas.width * 0.8
      );

      gradient.addColorStop(0, `rgba(60, 60, 65, ${fogIntensity * 0.2})`);
      gradient.addColorStop(0.5, `rgba(50, 50, 55, ${fogIntensity * 0.1})`);
      gradient.addColorStop(1, 'rgba(40, 40, 45, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * 应用晕影效果 - 边缘暗化
   */
  private applyVignette() {
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width * 0.3,
      this.canvas.width / 2,
      this.canvas.height / 2,
      this.canvas.width * 0.7
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * 应用色调映射 - 冷色调、去饱和
   */
  private applyColorGrading() {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // 去饱和
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      const desaturated_r = r * 0.3 + gray * 0.7;
      const desaturated_g = g * 0.3 + gray * 0.7;
      const desaturated_b = b * 0.3 + gray * 0.7;

      // 冷色调 - 增加蓝色，减少红色
      data[i] = Math.max(0, Math.min(255, desaturated_r * 0.9));      // R - 减少
      data[i + 1] = Math.max(0, Math.min(255, desaturated_g * 0.95)); // G
      data[i + 2] = Math.max(0, Math.min(255, desaturated_b * 1.1));  // B - 增加

      // 整体变暗
      data[i] *= 0.85;
      data[i + 1] *= 0.85;
      data[i + 2] *= 0.85;
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  /**
   * 渲染手电筒光照
   */
  renderFlashlight(x: number, y: number, batteryLevel: number) {
    const intensity = batteryLevel / 100;
    const radius = 150 * intensity;

    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);

    gradient.addColorStop(0, `rgba(255, 255, 200, ${intensity * 0.8})`);
    gradient.addColorStop(0.3, `rgba(255, 255, 180, ${intensity * 0.4})`);
    gradient.addColorStop(0.7, `rgba(200, 200, 150, ${intensity * 0.1})`);
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    this.ctx.globalCompositeOperation = 'lighten';
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalCompositeOperation = 'source-over';

    // 电量低时闪烁
    if (batteryLevel < 20 && Math.random() < 0.3) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * 渲染实体的红色眼光
   */
  renderEntityEyes(x: number, y: number, intensity: number = 1.0) {
    const eyeDistance = 40;

    // 左眼
    this.renderEye(x - eyeDistance, y, intensity);

    // 右眼
    this.renderEye(x + eyeDistance, y, intensity);
  }

  /**
   * 渲染单个眼睛
   */
  private renderEye(x: number, y: number, intensity: number) {
    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, 30);

    gradient.addColorStop(0, `rgba(255, 0, 0, ${intensity})`);
    gradient.addColorStop(0.3, `rgba(200, 0, 0, ${intensity * 0.6})`);
    gradient.addColorStop(0.7, `rgba(150, 0, 0, ${intensity * 0.3})`);
    gradient.addColorStop(1, 'rgba(100, 0, 0, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 30, 0, Math.PI * 2);
    this.ctx.fill();

    // 中心点 - 眼珠
    this.ctx.fillStyle = `rgba(255, 50, 50, ${intensity})`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, 5, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 渲染血迹效果
   */
  renderBloodSplatter(x: number, y: number, size: number) {
    const splatters = 8;

    for (let i = 0; i < splatters; i++) {
      const angle = (i / splatters) * Math.PI * 2 + Math.random();
      const distance = Math.random() * size;
      const splatX = x + Math.cos(angle) * distance;
      const splatY = y + Math.sin(angle) * distance;
      const splatSize = Math.random() * size * 0.3;

      const gradient = this.ctx.createRadialGradient(
        splatX,
        splatY,
        0,
        splatX,
        splatY,
        splatSize
      );

      gradient.addColorStop(0, 'rgba(80, 0, 0, 0.8)');
      gradient.addColorStop(0.5, 'rgba(60, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(40, 0, 0, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(splatX, splatY, splatSize, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * 渲染低理智视觉扭曲
   */
  renderInsanityEffects(sanity: number) {
    if (sanity >= 50) return;

    const distortion = (50 - sanity) / 50;  // 0-1

    // 画面扭曲
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;

    for (let y = 0; y < this.canvas.height; y++) {
      const wave = Math.sin(y * 0.1 + Date.now() * 0.001) * distortion * 10;

      for (let x = 0; x < this.canvas.width; x++) {
        const sourceX = Math.floor(x + wave);
        if (sourceX >= 0 && sourceX < this.canvas.width) {
          const targetIndex = (y * this.canvas.width + x) * 4;
          const sourceIndex = (y * this.canvas.width + sourceX) * 4;

          data[targetIndex] = data[sourceIndex];
          data[targetIndex + 1] = data[sourceIndex + 1];
          data[targetIndex + 2] = data[sourceIndex + 2];
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);

    // 幻觉 - 随机闪现阴影
    if (Math.random() < distortion * 0.1) {
      const shadowX = Math.random() * this.canvas.width;
      const shadowY = Math.random() * this.canvas.height;

      this.ctx.fillStyle = `rgba(0, 0, 0, ${distortion * 0.5})`;
      this.ctx.fillRect(shadowX - 50, shadowY - 100, 100, 200);
    }
  }

  /**
   * 更新配置
   */
  updateConfig(config: HorrorGameConfig['atmosphereSettings']) {
    this.config = config;
    this.generateTextures();  // 重新生成纹理
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
