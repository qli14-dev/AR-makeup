// Simple audio manager for horror game sounds
// In a real implementation, you'd load actual audio files

export type SoundEffect =
  | 'ambient_drip'
  | 'ambient_wind'
  | 'ambient_hum'
  | 'door_creak'
  | 'drawer_open'
  | 'key_pickup'
  | 'code_beep'
  | 'code_error'
  | 'code_success'
  | 'footsteps'
  | 'heartbeat'
  | 'jumpscare_scream'
  | 'jumpscare_bang'
  | 'jumpscare_static'
  | 'whisper'
  | 'clock_tick'
  | 'unlock'
  | 'puzzle_solve';

export type MusicTrack =
  | 'ambient'
  | 'tension'
  | 'ending_good'
  | 'ending_bad';

class AudioManager {
  private enabled: boolean = true;
  private volume: number = 0.7;
  private currentMusic: MusicTrack | null = null;

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  playSound(sound: SoundEffect, volume: number = 1.0) {
    if (!this.enabled) return;

    // In a real implementation, play the actual audio file
    console.log(`[AUDIO] Playing sound: ${sound} at volume ${volume * this.volume}`);

    // Simulate different sound types
    this.simulateSound(sound, volume);
  }

  playMusic(track: MusicTrack, loop: boolean = true) {
    if (!this.enabled) return;

    this.currentMusic = track;
    console.log(`[AUDIO] Playing music: ${track} (loop: ${loop})`);

    // In a real implementation, play the actual music file
  }

  stopMusic() {
    if (this.currentMusic) {
      console.log(`[AUDIO] Stopping music: ${this.currentMusic}`);
      this.currentMusic = null;
    }
  }

  playAmbient() {
    if (!this.enabled) return;

    console.log('[AUDIO] Starting ambient sound loop');
    // In a real implementation, play ambient sounds
  }

  stopAmbient() {
    console.log('[AUDIO] Stopping ambient sounds');
  }

  stopAll() {
    this.stopMusic();
    this.stopAmbient();
    console.log('[AUDIO] All sounds stopped');
  }

  private simulateSound(sound: SoundEffect, _volume: number) {
    // This is just for demonstration - in a real game, you'd play actual audio files
    const soundDescriptions: Record<SoundEffect, string> = {
      ambient_drip: '💧 drip... drip...',
      ambient_wind: '🌬️ whoosh...',
      ambient_hum: '〰️ hummmm...',
      door_creak: '🚪 creeeeak...',
      drawer_open: '📦 slide...',
      key_pickup: '🔑 *clink*',
      code_beep: '🔊 beep',
      code_error: '❌ buzzzz',
      code_success: '✅ *ding*',
      footsteps: '👣 step... step...',
      heartbeat: '💓 thump-thump',
      jumpscare_scream: '😱 AAAHHHHH!',
      jumpscare_bang: '💥 BANG!',
      jumpscare_static: '📻 KSSSHHHH',
      whisper: '👻 ...help me...',
      clock_tick: '🕐 tick... tock...',
      unlock: '🔓 *click*',
      puzzle_solve: '🎯 *success chime*',
    };

    // Log the sound effect to console
    console.log(`  ${soundDescriptions[sound]}`);
  }
}

export const audioManager = new AudioManager();
