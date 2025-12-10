/**
 * 恐怖游戏核心类型定义
 * 极度压迫、黑暗、写实、危险的密室逃脱体验
 */

export type GameState = 'intro' | 'playing' | 'paused' | 'jumpscare' | 'dead' | 'ending';
export type EndingType = 'true_escape' | 'cursed_escape' | 'bad_death';
export type RoomId = 'initial_room' | 'corridor' | 'second_room' | 'puzzle_room' | 'chase_hall' | 'final_room';

/**
 * 玩家状态 - HP与心跳系统
 */
export interface PlayerStats {
  hp: number;              // 0-100，受跳吓影响
  heartRate: number;       // 60-180 BPM，高心率增加实体发现几率
  sanity: number;          // 0-100，影响视觉扭曲程度
  hasFlashlight: boolean;  // 手电筒状态
  batteryLevel: number;    // 0-100，手电筒电量
}

/**
 * 实体（怪物）系统
 */
export interface Entity {
  id: string;
  name: string;
  description: string;

  // 外形特征
  appearance: {
    faceDescription: string;      // "扭曲的面部、破碎的皮肤、空洞的眼睛"
    bodyType: string;              // "瘦长、骨节突出、不自然弯曲"
    movement: string;              // "诡异爬行、突然冲刺、倒挂移动"
    eyeDetail: string;             // "完全漆黑/血红发光/眼眶空洞"
  };

  // AI行为模式
  behavior: {
    trackingMethod: 'sound' | 'smell' | 'movement' | 'light';  // 追踪方式
    detectionRadius: number;       // 检测范围（米）
    chaseSpeed: number;            // 追逐速度
    patrolPattern: 'random' | 'fixed' | 'hunting';  // 巡逻模式
    canOpenDoors: boolean;
    canBreakThrough: boolean;
  };

  // 弱点与克制
  weaknesses: {
    item?: string;                 // 可克制的物品（如"盐"、"光"、"镜子"）
    sound?: string;                // 特定声音可驱赶
    lightSensitive: boolean;       // 是否怕光
  };

  // 当前状态
  state: {
    currentRoom: RoomId;
    isActive: boolean;
    isChasing: boolean;
    lastSeenPlayerTime: number;
    aggression: number;            // 0-100，越高越激进
  };

  // 惊吓方式
  scareTactics: {
    distantStare: boolean;         // 远处凝视
    suddenRush: boolean;           // 突然冲近
    ceilingHang: boolean;          // 倒挂天花板
    wallCrawl: boolean;            // 墙面爬行
    doorPeek: boolean;             // 门缝窥视
    mirrorAppear: boolean;         // 镜子中出现
  };
}

/**
 * 谜题系统
 */
export interface Puzzle {
  id: string;
  roomId: RoomId;
  type: 'combination_lock' | 'pattern_matching' | 'item_combination' | 'hidden_code' | 'sequence';
  difficulty: 1 | 2 | 3 | 4 | 5;

  // 谜题描述
  description: string;
  solution: string | number | string[];

  // 线索系统
  clues: Clue[];
  requiredItems?: string[];

  // 状态
  isCompleted: boolean;
  attempts: number;
  failurePenalty: 'entity_alert' | 'hp_loss' | 'door_lock' | 'light_out';
}

export interface Clue {
  id: string;
  location: string;           // 线索位置描述
  content: string;            // 线索内容
  isFound: boolean;
  requiresLight: boolean;     // 是否需要光源才能看到
  hidden: boolean;            // 是否需要特定动作才能发现
}

/**
 * 房间系统
 */
export interface Room {
  id: RoomId;
  name: string;

  // 视觉描述 - 照片级真实感
  atmosphere: {
    description: string;        // 详细的环境描述
    lightLevel: number;         // 0-100，光照等级
    wallCondition: string;      // "潮湿发霉/裂纹/血迹/腐蚀"
    floorType: string;          // "混凝土/生锈铁板/碎玻璃"
    ceiling: string;            // 天花板状态
    airQuality: string;         // "潮湿/霉味/血腥/腐臭"
  };

  // 声音设计
  ambientSounds: {
    base: string[];             // 基础环境音 ["滴水声", "金属摩擦", "低频嗡鸣"]
    random: string[];           // 随机事件音 ["墙体开裂", "门吱呀", "呼吸声"]
    entityNear: string[];       // 实体接近时的声音
  };

  // 互动对象
  interactables: Interactable[];

  // 谜题
  puzzle?: Puzzle;

  // 出口
  exits: {
    direction: 'north' | 'south' | 'east' | 'west';
    targetRoom: RoomId | null;
    isLocked: boolean;
    requiresKey?: string;
    requiresPuzzle?: string;
  }[];

  // 实体出现概率
  entitySpawnChance: number;  // 0-1
  isEntitySafeRoom: boolean;  // 安全房间，实体不会进入
}

export interface Interactable {
  id: string;
  name: string;
  description: string;
  type: 'item' | 'door' | 'note' | 'switch' | 'container' | 'corpse';
  canPickUp: boolean;
  triggers?: GameEvent[];
}

/**
 * 跳吓系统
 */
export interface JumpscareEvent {
  id: string;
  type: 'entity_rush' | 'entity_appear' | 'environmental' | 'audio_spike';

  // 视觉效果
  visual: {
    entityAnimation?: 'rush_forward' | 'drop_from_ceiling' | 'crawl_from_wall' | 'mirror_break';
    screenShake: number;        // 0-100，震动强度
    distortion: number;         // 0-100，画面扭曲程度
    flashIntensity: number;     // 0-100，闪光强度
    duration: number;           // 毫秒
  };

  // 听觉效果
  audio: {
    sound: string;              // 拟声词 "咔！！" "嘎啦啦——！！" "呜呀啊——！！"
    volume: number;             // 0-100，音量
    lowFrequency: boolean;      // 是否包含低频嗡鸣
    hasBreathing: boolean;      // 是否有呼吸声
    wallScratch: boolean;       // 墙体摩擦声
  };

  // 游戏影响
  effects: {
    hpDamage: number;           // HP损失
    heartRateIncrease: number;  // 心跳上升值
    sanityDamage: number;       // 理智损失
    environmentChange?: 'lights_out' | 'door_lock' | 'wall_crack' | 'entity_spawn';
  };
}

/**
 * 游戏事件系统
 */
export interface GameEvent {
  id: string;
  type: 'trigger' | 'timed' | 'conditional';
  condition?: () => boolean;
  action: () => void;
  oneTime: boolean;
  triggered: boolean;
}

/**
 * 故事节点
 */
export interface StoryNode {
  id: string;
  stage: 'intro' | 'early' | 'mid' | 'chase' | 'finale';
  narrative: string;
  choices?: StoryChoice[];
}

export interface StoryChoice {
  text: string;
  riskLevel: 'safe' | 'medium' | 'high_risk';  // 高风险选项触发跳吓
  consequence: 'progress' | 'jumpscare' | 'entity_alert' | 'item_gain' | 'hp_loss';
  nextNode?: string;
}

/**
 * 结局系统
 */
export interface GameEnding {
  type: EndingType;
  title: string;

  // True Ending - 完美逃脱
  requirements?: {
    allPuzzlesSolved?: boolean;
    minHp?: number;
    foundSecretItem?: boolean;
    entityDefeated?: boolean;
  };

  // 结局描述
  description: string;
  cinematicText: string;

  // 解锁奖励
  unlocks?: string[];
}

/**
 * 游戏配置
 */
export interface HorrorGameConfig {
  difficulty: 'normal' | 'hard' | 'nightmare';

  // 实体配置
  entitySettings: {
    detectionSensitivity: number;   // 检测灵敏度
    chaseIntensity: number;         // 追逐强度
    jumpscareFrequency: number;     // 跳吓频率
  };

  // 玩家配置
  playerSettings: {
    startingHp: number;
    startingSanity: number;
    flashlightDuration: number;     // 手电筒持续时间（秒）
  };

  // 氛围配置
  atmosphereSettings: {
    globalDarkness: number;         // 0-100，全局黑暗程度
    fogIntensity: number;           // 雾气强度
    noiseLevel: number;             // 画面噪点
    decayLevel: number;             // 环境腐朽程度
  };
}

/**
 * 完整游戏状态
 */
export interface HorrorGameState {
  gameState: GameState;
  currentRoom: RoomId;
  playerStats: PlayerStats;
  entity: Entity;
  rooms: Map<RoomId, Room>;
  puzzles: Map<string, Puzzle>;
  inventory: string[];
  cluesFound: string[];
  storyProgress: string[];
  currentStoryNode: StoryNode;
  endings: GameEnding[];
  config: HorrorGameConfig;

  // 时间追踪
  gameTime: number;               // 游戏总时间（秒）
  lastEntityEncounter: number;    // 上次遭遇实体的时间

  // 统计
  stats: {
    jumpscaresTriggered: number;
    puzzlesFailed: number;
    doorsOpened: number;
    itemsCollected: number;
    entityEvasions: number;
  };
}
