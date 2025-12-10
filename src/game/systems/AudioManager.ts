/**
 * Spatial Audio Manager
 * Handles 3D sound, ambient loops, jumpscares, and music
 */

import { Howl, Howler } from 'howler';
import * as THREE from 'three';

type BreathingIntensity = 'normal' | 'sprint' | 'fear' | 'panic';

export class AudioManager {
  private ambientSounds: Map<string, Howl> = new Map();
  private oneShotSounds: Map<string, Howl> = new Map();
  private spatialSounds: Map<string, { howl: Howl; position: THREE.Vector3 }> = new Map();

  private footstepTimer: number = 0;
  private breathingSound: Howl | null = null;
  private heartbeatSound: Howl | null = null;

  constructor() {
    // Set master volume
    Howler.volume(0.7);

    this.initializeSounds();
  }

  private initializeSounds(): void {
    // AMBIENT LOOPS
    this.ambientSounds.set('cathedral', new Howl({
      src: [this.generateAmbientTone('cathedral')],
      loop: true,
      volume: 0.3,
      onload: () => console.log('Cathedral ambient loaded')
    }));

    this.ambientSounds.set('wind', new Howl({
      src: [this.generateAmbientTone('wind')],
      loop: true,
      volume: 0.2
    }));

    this.ambientSounds.set('dripping', new Howl({
      src: [this.generateAmbientTone('drip')],
      loop: true,
      volume: 0.15
    }));

    this.ambientSounds.set('whispers', new Howl({
      src: [this.generateAmbientTone('whisper')],
      loop: true,
      volume: 0.1
    }));

    // BREATHING
    this.breathingSound = new Howl({
      src: [this.generateBreathingSound()],
      loop: true,
      volume: 0.2
    });

    // HEARTBEAT
    this.heartbeatSound = new Howl({
      src: [this.generateHeartbeatSound()],
      loop: true,
      volume: 0
    });

    // ONE-SHOT EFFECTS
    this.oneShotSounds.set('footstep_stone', new Howl({
      src: [this.generateFootstepSound('stone')],
      volume: 0.4
    }));

    this.oneShotSounds.set('footstep_water', new Howl({
      src: [this.generateFootstepSound('water')],
      volume: 0.3
    }));

    this.oneShotSounds.set('door_creak', new Howl({
      src: [this.generateDoorSound()],
      volume: 0.5
    }));

    this.oneShotSounds.set('chain_rattle', new Howl({
      src: [this.generateChainSound()],
      volume: 0.4
    }));

    // JUMPSCARE SOUNDS
    this.oneShotSounds.set('scare_witness', new Howl({
      src: [this.generateJumpscareSound('witness')],
      volume: 0.9
    }));

    this.oneShotSounds.set('scare_confessor', new Howl({
      src: [this.generateJumpscareSound('confessor')],
      volume: 0.85
    }));

    this.oneShotSounds.set('scare_depths', new Howl({
      src: [this.generateJumpscareSound('depths')],
      volume: 0.95
    }));
  }

  /**
   * Generate procedural ambient sounds using Web Audio API
   * In production, these would be actual audio files
   */
  private generateAmbientTone(_type: string): string {
    // Return placeholder data URI
    // In production: return actual file paths
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  private generateBreathingSound(): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  private generateHeartbeatSound(): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  private generateFootstepSound(_surface: string): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  private generateDoorSound(): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  private generateChainSound(): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  private generateJumpscareSound(_type: string): string {
    return 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  }

  // PUBLIC API

  public playAmbient(soundName: string): void {
    const sound = this.ambientSounds.get(soundName);
    if (sound && !sound.playing()) {
      sound.play();
    }
  }

  public stopAmbient(soundName: string, fadeOut: number = 1000): void {
    const sound = this.ambientSounds.get(soundName);
    if (sound) {
      sound.fade(sound.volume(), 0, fadeOut);
      setTimeout(() => sound.stop(), fadeOut);
    }
  }

  public playSound(soundName: string, volume: number = 1.0): void {
    const sound = this.oneShotSounds.get(soundName);
    if (sound) {
      sound.volume(volume);
      sound.play();
    }
  }

  public playFootstep(isSprinting: boolean): void {
    const now = Date.now() / 1000;
    const interval = isSprinting ? 0.3 : 0.5;

    if (now - this.footstepTimer > interval) {
      const sound = Math.random() > 0.7 ? 'footstep_water' : 'footstep_stone';
      this.playSound(sound, isSprinting ? 0.6 : 0.4);
      this.footstepTimer = now;
    }
  }

  public setBreathingIntensity(intensity: BreathingIntensity): void {
    if (!this.breathingSound) return;

    if (!this.breathingSound.playing()) {
      this.breathingSound.play();
    }

    let targetVolume = 0.2;
    let rate = 1.0;

    switch (intensity) {
      case 'normal':
        targetVolume = 0.15;
        rate = 1.0;
        break;
      case 'sprint':
        targetVolume = 0.4;
        rate = 1.5;
        break;
      case 'fear':
        targetVolume = 0.6;
        rate = 1.3;
        break;
      case 'panic':
        targetVolume = 0.8;
        rate = 1.8;
        break;
    }

    this.breathingSound.rate(rate);
    this.breathingSound.fade(this.breathingSound.volume(), targetVolume, 500);
  }

  public setHeartbeatVolume(volume: number): void {
    if (!this.heartbeatSound) return;

    if (volume > 0 && !this.heartbeatSound.playing()) {
      this.heartbeatSound.play();
    }

    this.heartbeatSound.fade(this.heartbeatSound.volume(), volume, 1000);

    if (volume === 0) {
      setTimeout(() => this.heartbeatSound?.stop(), 1000);
    }
  }

  public playJumpscare(type: string): void {
    const soundKey = `scare_${type}`;
    this.playSound(soundKey, 0.95);
  }

  public play3DSound(soundName: string, _position: THREE.Vector3, volume: number = 1.0): void {
    // Simplified 3D audio (in production, use Web Audio API spatial audio)
    this.playSound(soundName, volume);
  }

  public dispose(): void {
    this.ambientSounds.forEach(sound => sound.unload());
    this.oneShotSounds.forEach(sound => sound.unload());
    this.spatialSounds.forEach(({ howl }) => howl.unload());
    this.breathingSound?.unload();
    this.heartbeatSound?.unload();
  }
}
