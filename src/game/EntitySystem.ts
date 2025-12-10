/**
 * 实体系统 - "它"
 * 参考：《Outlast》的 Chris Walker、《P.T.》的 Lisa、《恶灵附身》的 The Keeper
 *
 * 特征：扭曲、破碎、不可名状、极度危险
 */

import { Entity, RoomId, JumpscareEvent } from '../types/horror';

/**
 * 创建主要实体 - "破碎者"
 *
 * 外形：
 * - 面部完全扭曲，皮肤像破碎的陶瓷，布满裂纹
 * - 眼眶深陷，内部漆黑但偶尔闪烁红光
 * - 身体瘦长，骨节突出，手指异常细长
 * - 移动时关节发出咔咔声，像骨头摩擦
 *
 * 行为：
 * - 依靠声音追踪（脚步声、呼吸声、物品掉落）
 * - 移动速度慢，但冲刺时极快
 * - 会在门缝窥视、倒挂在天花板、从墙缝挤出
 * - 听到玩家心跳声会停下"倾听"
 */
export function createMainEntity(): Entity {
  return {
    id: 'the_broken',
    name: '破碎者',
    description: '它曾经是人，但现在...不再是了。',

    appearance: {
      faceDescription: `
面部完全扭曲，皮肤如碎裂的瓷器，苍白且布满暗红色裂纹。
眼眶深陷至头骨内部，里面是完全的虚空黑暗，偶尔有微弱红光闪烁。
嘴巴撕裂至耳根，牙齿全部脱落，只剩黑色的牙龈和破碎的牙根。
颈部向左侧弯曲成不可能的角度，仿佛脖子已断裂但仍在活动。
      `.trim(),

      bodyType: `
身高约2.3米，极度消瘦，皮肤紧贴骨骼，可见肋骨轮廓。
脊椎向外突出，形成锯齿状的背部轮廓。
四肢细长，手指长达25厘米，指甲已脱落，露出血肉模糊的指尖。
关节处有明显的肿胀和畸形，移动时发出湿润的咔咔声。
身上披着破烂的、沾满暗色污渍的医院病号服。
      `.trim(),

      movement: `
静止时：身体轻微抽搐，头部缓慢左右摇摆，发出低沉的呼噜声
巡逻时：四肢爬行，脊椎不自然地起伏，像巨大的蜘蛛
警觉时：站立，头部180度旋转扫视，关节咔咔作响
追逐时：双足狂奔，身体前倾45度，手臂拖地，速度极快
      `.trim(),

      eyeDetail: `
眼眶深度约5厘米，完全漆黑，像虚空。
当它"看到"玩家时，眼眶深处会燃起微弱红光，逐渐变亮。
红光达到最亮时，它会发动冲击。
      `.trim(),
    },

    behavior: {
      trackingMethod: 'sound',
      detectionRadius: 15,        // 15米内能听到声音
      chaseSpeed: 8.5,            // 8.5 m/s，比人类快跑略快
      patrolPattern: 'hunting',   // 主动搜寻模式
      canOpenDoors: true,         // 能开门
      canBreakThrough: false,     // 不能破墙，但能从门缝挤进来
    },

    weaknesses: {
      item: '盐',                 // 盐能暂时驱赶它
      sound: '钟声',              // 特定钟声会让它暂时僵直
      lightSensitive: false,      // 不怕光，但强光会减缓速度
    },

    state: {
      currentRoom: 'corridor',
      isActive: true,
      isChasing: false,
      lastSeenPlayerTime: 0,
      aggression: 30,             // 初始攻击性
    },

    scareTactics: {
      distantStare: true,         // 远处凝视 - 玩家转身时看到它站在走廊尽头
      suddenRush: true,           // 突然冲近 - 极速冲向玩家
      ceilingHang: true,          // 倒挂天花板 - 抬头时看到它倒挂在头顶
      wallCrawl: true,            // 墙面爬行 - 沿着墙面快速爬行
      doorPeek: true,             // 门缝窥视 - 通过门缝看到它的红色眼光
      mirrorAppear: true,         // 镜子出现 - 镜子中看到它站在身后
    },
  };
}

/**
 * 实体 AI 行为系统
 */
export class EntityAI {
  private entity: Entity;
  private playerRoom: RoomId;
  private playerNoise: number = 0;      // 0-100，玩家制造的噪音
  private huntTimer: number = 0;
  private stalkMode: boolean = false;   // 潜行模式 - 不攻击但跟随

  constructor(entity: Entity) {
    this.entity = entity;
    this.playerRoom = 'initial_room';
  }

  /**
   * 更新实体行为 - 每帧调用
   */
  update(deltaTime: number, playerRoom: RoomId, playerHeartRate: number): EntityBehaviorResult {
    this.playerRoom = playerRoom;
    this.huntTimer += deltaTime;

    // 心跳越快，越容易被发现
    const heartRateMultiplier = playerHeartRate > 100 ? 1.5 : 1.0;
    const detectionChance = this.calculateDetectionChance() * heartRateMultiplier;

    // 决策树
    if (this.entity.state.isChasing) {
      return this.executeChase();
    } else if (this.stalkMode) {
      return this.executeStalk();
    } else if (Math.random() < detectionChance) {
      return this.beginHunt();
    } else {
      return this.patrol();
    }
  }

  /**
   * 玩家制造噪音
   */
  reportNoise(intensity: number, location: RoomId) {
    this.playerNoise = Math.min(100, this.playerNoise + intensity);

    // 高噪音立即吸引实体
    if (this.playerNoise > 70) {
      this.entity.state.currentRoom = location;
      this.entity.state.aggression = Math.min(100, this.entity.state.aggression + 20);

      return {
        entityRoom: location,
        isVisible: false,
        action: 'approaching',
        soundCue: '远处传来急促的爬行声和关节摩擦声...咔...咔咔...咔咔咔！',
        jumpscare: null,
      };
    }

    return null;
  }

  /**
   * 计算发现玩家的概率
   */
  private calculateDetectionChance(): number {
    const baseChance = 0.001;  // 每帧 0.1% 基础概率

    // 因素加成
    let multiplier = 1.0;

    // 噪音加成
    multiplier += this.playerNoise / 100;

    // 攻击性加成
    multiplier += this.entity.state.aggression / 200;

    // 时间加成 - 游戏时间越长，越危险
    multiplier += Math.min(this.huntTimer / 600, 2.0);  // 10分钟后达到最大

    return baseChance * multiplier;
  }

  /**
   * 巡逻模式
   */
  private patrol(): EntityBehaviorResult {
    // 随机移动
    const rooms: RoomId[] = ['corridor', 'second_room', 'puzzle_room', 'chase_hall'];
    const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
    this.entity.state.currentRoom = randomRoom;

    return {
      entityRoom: randomRoom,
      isVisible: false,
      action: 'patrolling',
      soundCue: Math.random() < 0.3 ? this.getAmbientSound() : null,
      jumpscare: null,
    };
  }

  /**
   * 开始狩猎
   */
  private beginHunt(): EntityBehaviorResult {
    this.entity.state.isChasing = true;
    this.entity.state.currentRoom = this.playerRoom;

    return {
      entityRoom: this.playerRoom,
      isVisible: true,
      action: 'hunting',
      soundCue: '嘎啦啦——！！！',
      jumpscare: this.createHuntJumpscare(),
    };
  }

  /**
   * 执行追逐
   */
  private executeChase(): EntityBehaviorResult {
    if (this.entity.state.currentRoom === this.playerRoom) {
      // 抓到玩家
      return {
        entityRoom: this.playerRoom,
        isVisible: true,
        action: 'attack',
        soundCue: '呜呀啊——！！！',
        jumpscare: this.createAttackJumpscare(),
      };
    } else {
      // 接近玩家
      this.entity.state.currentRoom = this.playerRoom;
      return {
        entityRoom: this.playerRoom,
        isVisible: false,
        action: 'chasing',
        soundCue: '急促的爬行声正在接近！咔咔咔咔咔！！',
        jumpscare: null,
      };
    }
  }

  /**
   * 潜行模式 - 跟随但不攻击
   */
  private executeStalk(): EntityBehaviorResult {
    // 随机出现在视野边缘
    const stalkTactics = [
      {
        location: '走廊尽头',
        desc: '你转身时，它正站在黑暗的走廊尽头，一动不动地盯着你。红色的眼光微弱地闪烁。',
      },
      {
        location: '门缝',
        desc: '门缝中透出暗红色的光...是它的眼睛。它在窥视你。',
      },
      {
        location: '天花板',
        desc: '你抬头时心脏骤停——它倒挂在天花板上，距离你只有三米，头部缓慢转向你。',
      },
    ];

    const tactic = stalkTactics[Math.floor(Math.random() * stalkTactics.length)];

    return {
      entityRoom: this.playerRoom,
      isVisible: true,
      action: 'stalking',
      soundCue: `【${tactic.location}】${tactic.desc}`,
      jumpscare: null,
    };
  }

  /**
   * 环境音
   */
  private getAmbientSound(): string {
    const sounds = [
      '远处传来关节摩擦的咔咔声...',
      '墙壁里传出低沉的呼噜声...',
      '天花板上有什么在爬行...刮擦声...刮擦声...',
      '隔壁房间传来破碎的呼吸声...呼...呼呼...',
    ];
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  /**
   * 创建狩猎跳吓
   */
  private createHuntJumpscare(): JumpscareEvent {
    return {
      id: 'hunt_begin',
      type: 'entity_appear',
      visual: {
        entityAnimation: 'crawl_from_wall',
        screenShake: 60,
        distortion: 40,
        flashIntensity: 30,
        duration: 800,
      },
      audio: {
        sound: '嘎啦啦——！！！',
        volume: 85,
        lowFrequency: true,
        hasBreathing: true,
        wallScratch: true,
      },
      effects: {
        hpDamage: 15,
        heartRateIncrease: 40,
        sanityDamage: 20,
        environmentChange: 'lights_out',
      },
    };
  }

  /**
   * 创建攻击跳吓 - 最强烈
   */
  private createAttackJumpscare(): JumpscareEvent {
    return {
      id: 'entity_attack',
      type: 'entity_rush',
      visual: {
        entityAnimation: 'rush_forward',
        screenShake: 100,
        distortion: 80,
        flashIntensity: 70,
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
    };
  }

  /**
   * 使用物品驱赶实体
   */
  useItem(item: string): boolean {
    if (item === this.entity.weaknesses.item) {
      this.entity.state.isChasing = false;
      this.entity.state.aggression = Math.max(0, this.entity.state.aggression - 30);
      this.playerNoise = 0;

      // 移动到远处房间
      this.entity.state.currentRoom = 'corridor';

      return true;
    }
    return false;
  }

  /**
   * 设置潜行模式
   */
  setStalkMode(enabled: boolean) {
    this.stalkMode = enabled;
    this.entity.state.isChasing = false;
  }
}

/**
 * 实体行为结果
 */
interface EntityBehaviorResult {
  entityRoom: RoomId;
  isVisible: boolean;
  action: 'patrolling' | 'hunting' | 'chasing' | 'stalking' | 'attacking' | 'approaching';
  soundCue: string | null;
  jumpscare: JumpscareEvent | null;
}
