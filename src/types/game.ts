// Core game types for "The Forgotten Patient" horror escape room

export type GameState = 'intro' | 'playing' | 'paused' | 'ending';
export type EndingType = 'good' | 'bad_denial' | 'bad_timeout' | 'bad_broken' | null;
export type DifficultyLevel = 'easy' | 'normal' | 'hard' | 'nightmare';

export interface GameConfig {
  difficulty: DifficultyLevel;
  timeLimit: number; // in seconds (3600 = 60 min)
  jumpscaresEnabled: boolean;
  hintsEnabled: boolean;
}

export interface Vector2D {
  x: number;
  y: number;
}

export interface InteractiveObject {
  id: string;
  name: string;
  position: Vector2D;
  type: ObjectType;
  isInteractable: boolean;
  isExamined: boolean;
  requiresItem?: string; // item id needed to interact
  onInteract?: () => void;
  description: string;
  closeUpImage?: string;
}

export type ObjectType =
  | 'desk'
  | 'drawer'
  | 'bookshelf'
  | 'painting'
  | 'bed'
  | 'mirror'
  | 'clock'
  | 'window'
  | 'closet'
  | 'safe'
  | 'cabinet'
  | 'table'
  | 'chair'
  | 'radiator'
  | 'door'
  | 'rug'
  | 'phone'
  | 'grate';

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  isUsable: boolean;
  canCombineWith?: string[]; // item ids
}

export interface Puzzle {
  id: string;
  name: string;
  isSolved: boolean;
  attempts: number;
  maxAttempts?: number;
  type: PuzzleType;
  solution: string | string[];
}

export type PuzzleType =
  | 'code_4digit'
  | 'symbols'
  | 'clock_time'
  | 'key_lock'
  | 'search';

export interface JumpscareEvent {
  id: string;
  name: string;
  triggered: boolean;
  triggerCondition: string;
  duration: number; // in milliseconds
  intensity: 'low' | 'medium' | 'high';
}

export interface GameProgress {
  // Puzzles
  hasFlashlight: boolean;
  hasBatteries: boolean;
  flashlightWorking: boolean;

  closetUnlocked: boolean;
  hasUVLight: boolean;
  hasTapeRecorder: boolean;
  tapeRecorderPlayed: boolean;

  symbolsPuzzleSolved: boolean;
  safeBoxOpened: boolean;

  clockSet: boolean;
  hasRustyKey: boolean;

  doorUnlocked: boolean;

  // Keys and items
  hasSmallKey: boolean;
  medicinesCabinetOpened: boolean;

  // Tracking
  wrongCodeAttempts: number;
  totalJumpscares: number;
  hintsUsed: number;

  // Time
  startTime: number;
  elapsedTime: number;

  // Clues found
  cluesFound: string[];
}

export interface CloseUpView {
  isActive: boolean;
  objectId: string | null;
  canRotate: boolean;
  rotation: number;
  zoom: number;
}

export interface AudioTrack {
  id: string;
  src: string;
  loop: boolean;
  volume: number;
  type: 'ambient' | 'effect' | 'music' | 'jumpscare' | 'voice';
}

export interface CameraView {
  rotation: Vector2D; // pitch and yaw
  position: Vector2D; // x, y position in room
  fov: number;
}
