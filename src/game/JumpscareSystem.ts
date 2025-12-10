/**
 * 跳吓系统 - 强力视听冲击
 *
 * 参考：
 * - Outlast 的突然出现
 * - P.T. 的环境恐怖
 * - 恐怖密室的实体冲脸感
 *
 * 特性：
 * - 视觉：贴脸冲击、画面震动、扭曲效果
 * - 听觉：大音量拟声、低频嗡鸣、突发音效
 * - 效果：HP降低、心跳飙升、环境变化
 */

import { JumpscareEvent } from '../types/horror';

/**
 * 跳吓管理器
 */
export class JumpscareManager {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private isPlaying: boolean = false;
  private currentEvent: JumpscareEvent | null = null;
  private animationFrame: number = 0;
  private startTime: number = 0;

  // 音频上下文
  private audioContext: AudioContext | null = null;

  /**
   * 初始化跳吓系统
   */
  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  /**
   * 触发跳吓事件
   */
  trigger(event: JumpscareEvent, onComplete: (effects: JumpscareEvent['effects']) => void) {
    if (this.isPlaying) return;  // 防止跳吓重叠

    this.isPlaying = true;
    this.currentEvent = event;
    this.startTime = performance.now();

    // 播放音效
    this.playJumpscareSound(event.audio);

    // 启动视觉动画
    this.animate(onComplete);
  }

  /**
   * 动画循环
   */
  private animate(onComplete: (effects: JumpscareEvent['effects']) => void) {
    if (!this.isPlaying || !this.currentEvent || !this.ctx || !this.canvas) return;

    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(elapsed / this.currentEvent.visual.duration, 1);

    // 清空画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 保存画布状态
    this.ctx.save();

    // 应用视觉效果
    this.applyScreenShake(progress);
    this.applyDistortion(progress);
    this.applyFlash(progress);
    this.renderEntity(progress);

    // 恢复画布状态
    this.ctx.restore();

    // 继续动画或结束
    if (progress < 1) {
      this.animationFrame = requestAnimationFrame(() => this.animate(onComplete));
    } else {
      this.stop();
      onComplete(this.currentEvent.effects);
    }
  }

  /**
   * 画面震动效果
   */
  private applyScreenShake(progress: number) {
    if (!this.currentEvent || !this.ctx) return;

    const intensity = this.currentEvent.visual.screenShake;
    const shake = intensity * (1 - progress) * 0.5;  // 震动强度随时间减弱

    const offsetX = (Math.random() - 0.5) * shake;
    const offsetY = (Math.random() - 0.5) * shake;

    this.ctx.translate(offsetX, offsetY);
  }

  /**
   * 画面扭曲效果
   */
  private applyDistortion(progress: number) {
    if (!this.currentEvent || !this.ctx || !this.canvas) return;

    const distortion = this.currentEvent.visual.distortion / 100;
    const wave = Math.sin(progress * Math.PI * 4) * distortion * 50;

    // 波形扭曲
    this.ctx.translate(wave, 0);
  }

  /**
   * 闪光效果
   */
  private applyFlash(progress: number) {
    if (!this.currentEvent || !this.ctx || !this.canvas) return;

    const flashIntensity = this.currentEvent.visual.flashIntensity / 100;

    // 初期强闪光，然后快速衰减
    const flash = flashIntensity * (1 - progress * 2);

    if (flash > 0) {
      this.ctx.fillStyle = `rgba(255, 255, 255, ${flash})`;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * 渲染实体动画
   */
  private renderEntity(progress: number) {
    if (!this.currentEvent || !this.ctx || !this.canvas) return;

    const animation = this.currentEvent.visual.entityAnimation;
    if (!animation) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    switch (animation) {
      case 'rush_forward':
        this.renderRushForward(progress, width, height);
        break;
      case 'drop_from_ceiling':
        this.renderDropFromCeiling(progress, width, height);
        break;
      case 'crawl_from_wall':
        this.renderCrawlFromWall(progress, width, height);
        break;
      case 'mirror_break':
        this.renderMirrorBreak(progress, width, height);
        break;
    }
  }

  /**
   * 冲向前方动画
   */
  private renderRushForward(progress: number, width: number, height: number) {
    if (!this.ctx) return;

    // 实体从远处快速冲向镜头
    const scale = 0.1 + progress * 5;  // 从小到极大
    const entitySize = Math.min(width, height) * scale;

    // 绘制实体（简化为恐怖的剪影）
    this.ctx.save();
    this.ctx.translate(width / 2, height / 2);

    // 扭曲的人形剪影
    this.ctx.fillStyle = `rgba(20, 0, 0, ${0.8 + progress * 0.2})`;
    this.ctx.beginPath();

    // 身体
    this.ctx.ellipse(0, 0, entitySize * 0.3, entitySize * 0.5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 头部（扭曲）
    this.ctx.save();
    this.ctx.translate(0, -entitySize * 0.6);
    this.ctx.rotate(Math.sin(progress * Math.PI * 8) * 0.3);  // 扭曲抖动
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, entitySize * 0.25, entitySize * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 眼睛红光
    if (progress > 0.3) {
      const glowIntensity = (progress - 0.3) / 0.7;
      this.ctx.fillStyle = `rgba(255, 0, 0, ${glowIntensity})`;
      this.ctx.beginPath();
      this.ctx.arc(-entitySize * 0.1, -entitySize * 0.05, entitySize * 0.05, 0, Math.PI * 2);
      this.ctx.arc(entitySize * 0.1, -entitySize * 0.05, entitySize * 0.05, 0, Math.PI * 2);
      this.ctx.fill();

      // 眼睛光晕
      const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, entitySize * 0.4);
      gradient.addColorStop(0, `rgba(255, 0, 0, ${glowIntensity * 0.5})`);
      gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(-entitySize * 0.4, -entitySize * 0.4, entitySize * 0.8, entitySize * 0.8);
    }

    this.ctx.restore();

    // 细长的手臂
    this.ctx.strokeStyle = `rgba(20, 0, 0, ${0.7 + progress * 0.3})`;
    this.ctx.lineWidth = entitySize * 0.05;
    this.ctx.lineCap = 'round';

    // 左手
    this.ctx.beginPath();
    this.ctx.moveTo(-entitySize * 0.3, 0);
    this.ctx.lineTo(-entitySize * 0.6, entitySize * 0.3);
    this.ctx.stroke();

    // 右手
    this.ctx.beginPath();
    this.ctx.moveTo(entitySize * 0.3, 0);
    this.ctx.lineTo(entitySize * 0.6, entitySize * 0.3);
    this.ctx.stroke();

    this.ctx.restore();

    // 暗化背景
    this.ctx.fillStyle = `rgba(0, 0, 0, ${progress * 0.7})`;
    this.ctx.fillRect(0, 0, width, height);
  }

  /**
   * 从天花板掉落动画
   */
  private renderDropFromCeiling(progress: number, width: number, height: number) {
    if (!this.ctx) return;

    const dropY = -height * 0.5 + progress * height * 1.2;  // 从上方掉落

    this.ctx.save();
    this.ctx.translate(width / 2, dropY);

    // 倒挂的实体
    this.ctx.scale(1, -1);  // 垂直翻转

    const size = Math.min(width, height) * 0.4;

    // 身体
    this.ctx.fillStyle = 'rgba(30, 20, 20, 0.9)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.3, size * 0.5, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 头部
    this.ctx.beginPath();
    this.ctx.ellipse(0, -size * 0.6, size * 0.25, size * 0.3, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // 红色眼光
    this.ctx.fillStyle = `rgba(255, 0, 0, ${progress})`;
    this.ctx.beginPath();
    this.ctx.arc(-size * 0.1, -size * 0.65, size * 0.04, 0, Math.PI * 2);
    this.ctx.arc(size * 0.1, -size * 0.65, size * 0.04, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * 从墙面爬出动画
   */
  private renderCrawlFromWall(progress: number, width: number, height: number) {
    if (!this.ctx) return;

    const crawlX = -width * 0.5 + progress * width;  // 从左侧爬入

    this.ctx.save();
    this.ctx.translate(crawlX, height / 2);
    this.ctx.rotate(-Math.PI / 2);  // 侧向爬行

    const size = Math.min(width, height) * 0.3;

    // 爬行姿态
    this.ctx.fillStyle = 'rgba(25, 15, 15, 0.85)';
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, size * 0.6, size * 0.25, 0, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  /**
   * 镜子破碎动画
   */
  private renderMirrorBreak(progress: number, width: number, height: number) {
    if (!this.ctx) return;

    // 裂纹效果
    const crackCount = 20;
    this.ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 + progress * 0.7})`;
    this.ctx.lineWidth = 2;

    for (let i = 0; i < crackCount; i++) {
      const angle = (i / crackCount) * Math.PI * 2;
      const length = progress * Math.min(width, height) * 0.7;

      this.ctx.beginPath();
      this.ctx.moveTo(width / 2, height / 2);
      this.ctx.lineTo(
        width / 2 + Math.cos(angle) * length,
        height / 2 + Math.sin(angle) * length
      );
      this.ctx.stroke();
    }

    // 镜子后的实体若隐若现
    if (progress > 0.5) {
      const alpha = (progress - 0.5) * 2;
      this.ctx.fillStyle = `rgba(20, 0, 0, ${alpha * 0.7})`;
      this.ctx.fillRect(0, 0, width, height);

      // 红色眼光
      this.ctx.fillStyle = `rgba(255, 0, 0, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(width / 2 - 50, height / 2 - 50, 20, 0, Math.PI * 2);
      this.ctx.arc(width / 2 + 50, height / 2 - 50, 20, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * 播放跳吓音效
   */
  private playJumpscareSound(audio: JumpscareEvent['audio']) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const duration = 0.8;  // 音效持续时间

    // 创建音频节点
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    // 低频嗡鸣
    if (audio.lowFrequency) {
      const lowFreqOsc = ctx.createOscillator();
      const lowFreqGain = ctx.createGain();

      lowFreqOsc.type = 'sine';
      lowFreqOsc.frequency.setValueAtTime(60, ctx.currentTime);  // 60 Hz 低频
      lowFreqGain.gain.setValueAtTime(0.3, ctx.currentTime);
      lowFreqGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      lowFreqOsc.connect(lowFreqGain);
      lowFreqGain.connect(ctx.destination);

      lowFreqOsc.start(ctx.currentTime);
      lowFreqOsc.stop(ctx.currentTime + duration);
    }

    // 主音效 - 噪音冲击
    const noiseBuffer = this.createNoiseBuffer();
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();

    noiseSource.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(audio.volume / 100, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration * 0.5);

    noiseSource.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseSource.start(ctx.currentTime);
    noiseSource.stop(ctx.currentTime + duration * 0.5);

    // 墙体摩擦声
    if (audio.wallScratch) {
      const scratchOsc = ctx.createOscillator();
      const scratchGain = ctx.createGain();
      const scratchFilter = ctx.createBiquadFilter();

      scratchOsc.type = 'sawtooth';
      scratchOsc.frequency.setValueAtTime(200, ctx.currentTime);
      scratchOsc.frequency.linearRampToValueAtTime(80, ctx.currentTime + duration);

      scratchFilter.type = 'bandpass';
      scratchFilter.frequency.setValueAtTime(400, ctx.currentTime);

      scratchGain.gain.setValueAtTime(0.2, ctx.currentTime);
      scratchGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

      scratchOsc.connect(scratchFilter);
      scratchFilter.connect(scratchGain);
      scratchGain.connect(ctx.destination);

      scratchOsc.start(ctx.currentTime);
      scratchOsc.stop(ctx.currentTime + duration);
    }

    // 呼吸声
    if (audio.hasBreathing) {
      this.playBreathingSound(duration);
    }

    // 在控制台输出拟声词
    console.log(`%c${audio.sound}`, 'font-size: 48px; font-weight: bold; color: red;');
  }

  /**
   * 创建噪音缓冲
   */
  private createNoiseBuffer(): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized');

    const sampleRate = this.audioContext.sampleRate;
    const buffer = this.audioContext.createBuffer(1, sampleRate * 0.5, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    return buffer;
  }

  /**
   * 播放呼吸声
   */
  private playBreathingSound(duration: number) {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const breathCycles = 3;

    for (let i = 0; i < breathCycles; i++) {
      const startTime = ctx.currentTime + (i * duration / breathCycles);
      const breathDuration = duration / breathCycles;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, startTime);
      osc.frequency.linearRampToValueAtTime(180, startTime + breathDuration / 2);
      osc.frequency.linearRampToValueAtTime(120, startTime + breathDuration);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.linearRampToValueAtTime(0.25, startTime + breathDuration / 2);
      gain.gain.linearRampToValueAtTime(0.15, startTime + breathDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + breathDuration);
    }
  }

  /**
   * 停止跳吓
   */
  stop() {
    this.isPlaying = false;
    this.currentEvent = null;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = 0;
    }
  }

  /**
   * 销毁系统
   */
  destroy() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

/**
 * 预定义跳吓事件库
 */
export const JUMPSCARE_PRESETS = {
  /**
   * 轻度惊吓 - 环境音突变
   */
  AMBIENT_SCARE: {
    id: 'ambient_scare',
    type: 'audio_spike' as const,
    visual: {
      screenShake: 20,
      distortion: 10,
      flashIntensity: 15,
      duration: 400,
    },
    audio: {
      sound: '咔！',
      volume: 60,
      lowFrequency: false,
      hasBreathing: false,
      wallScratch: true,
    },
    effects: {
      hpDamage: 5,
      heartRateIncrease: 15,
      sanityDamage: 5,
    },
  },

  /**
   * 中度惊吓 - 实体出现
   */
  ENTITY_APPEAR: {
    id: 'entity_appear',
    type: 'entity_appear' as const,
    visual: {
      entityAnimation: 'crawl_from_wall' as const,
      screenShake: 50,
      distortion: 30,
      flashIntensity: 40,
      duration: 700,
    },
    audio: {
      sound: '嘎啦啦——！！',
      volume: 80,
      lowFrequency: true,
      hasBreathing: true,
      wallScratch: true,
    },
    effects: {
      hpDamage: 15,
      heartRateIncrease: 35,
      sanityDamage: 20,
      environmentChange: 'lights_out' as const,
    },
  },

  /**
   * 重度惊吓 - 实体冲击
   */
  ENTITY_RUSH: {
    id: 'entity_rush',
    type: 'entity_rush' as const,
    visual: {
      entityAnimation: 'rush_forward' as const,
      screenShake: 100,
      distortion: 70,
      flashIntensity: 80,
      duration: 1200,
    },
    audio: {
      sound: '呜呀啊——！！！咔！！',
      volume: 100,
      lowFrequency: true,
      hasBreathing: true,
      wallScratch: false,
    },
    effects: {
      hpDamage: 35,
      heartRateIncrease: 60,
      sanityDamage: 40,
    },
  },

  /**
   * 天花板掉落
   */
  CEILING_DROP: {
    id: 'ceiling_drop',
    type: 'entity_appear' as const,
    visual: {
      entityAnimation: 'drop_from_ceiling' as const,
      screenShake: 80,
      distortion: 50,
      flashIntensity: 60,
      duration: 900,
    },
    audio: {
      sound: '砰——！！嘎啦！！',
      volume: 90,
      lowFrequency: true,
      hasBreathing: true,
      wallScratch: false,
    },
    effects: {
      hpDamage: 25,
      heartRateIncrease: 50,
      sanityDamage: 30,
      environmentChange: 'door_lock' as const,
    },
  },

  /**
   * 镜子惊吓
   */
  MIRROR_SCARE: {
    id: 'mirror_scare',
    type: 'environmental' as const,
    visual: {
      entityAnimation: 'mirror_break' as const,
      screenShake: 60,
      distortion: 40,
      flashIntensity: 70,
      duration: 800,
    },
    audio: {
      sound: '咔啦——！！（玻璃碎裂声）',
      volume: 85,
      lowFrequency: false,
      hasBreathing: false,
      wallScratch: false,
    },
    effects: {
      hpDamage: 20,
      heartRateIncrease: 40,
      sanityDamage: 25,
      environmentChange: 'wall_crack' as const,
    },
  },
};
