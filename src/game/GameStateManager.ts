/**
 * 游戏状态管理器
 *
 * 管理：
 * - 玩家状态（HP、心跳、理智）
 * - 游戏进度
 * - 房间切换
 * - 实体行为
 * - 事件触发
 * - 结局判定
 */

import {
  HorrorGameState,
  GameState,
  PlayerStats,
  RoomId,
  StoryNode,
  StoryChoice,
  GameEnding,
  EndingType,
} from '../types/horror';
import { createMainEntity, EntityAI } from './EntitySystem';
import { getAllRooms } from './RoomDefinitions';
import { JumpscareManager, JUMPSCARE_PRESETS } from './JumpscareSystem';

export class GameStateManager {
  private state: HorrorGameState;
  private entityAI: EntityAI;
  private jumpscareManager: JumpscareManager;
  private heartbeatInterval: number | null = null;
  private gameLoopInterval: number | null = null;

  // 回调函数
  private onStateChange?: (state: HorrorGameState) => void;
  private onRoomChange?: (roomId: RoomId) => void;
  private onPlayerDamage?: (hp: number, heartRate: number) => void;
  private onGameEnd?: (ending: GameEnding) => void;

  constructor() {
    this.state = this.createInitialState();
    this.entityAI = new EntityAI(this.state.entity);
    this.jumpscareManager = new JumpscareManager();
  }

  /**
   * 创建初始游戏状态
   */
  private createInitialState(): HorrorGameState {
    return {
      gameState: 'intro',
      currentRoom: 'initial_room',

      playerStats: {
        hp: 100,
        heartRate: 75,
        sanity: 100,
        hasFlashlight: false,
        batteryLevel: 0,
      },

      entity: createMainEntity(),
      rooms: getAllRooms(),
      puzzles: new Map(),
      inventory: [],
      cluesFound: [],
      storyProgress: [],
      currentStoryNode: this.getIntroNode(),
      endings: this.defineEndings(),

      config: {
        difficulty: 'normal',
        entitySettings: {
          detectionSensitivity: 1.0,
          chaseIntensity: 1.0,
          jumpscareFrequency: 1.0,
        },
        playerSettings: {
          startingHp: 100,
          startingSanity: 100,
          flashlightDuration: 300,  // 5分钟
        },
        atmosphereSettings: {
          globalDarkness: 70,
          fogIntensity: 50,
          noiseLevel: 40,
          decayLevel: 80,
        },
      },

      gameTime: 0,
      lastEntityEncounter: 0,

      stats: {
        jumpscaresTriggered: 0,
        puzzlesFailed: 0,
        doorsOpened: 0,
        itemsCollected: 0,
        entityEvasions: 0,
      },
    };
  }

  /**
   * 初始化游戏
   */
  initialize(canvas: HTMLCanvasElement, callbacks: {
    onStateChange?: (state: HorrorGameState) => void;
    onRoomChange?: (roomId: RoomId) => void;
    onPlayerDamage?: (hp: number, heartRate: number) => void;
    onGameEnd?: (ending: GameEnding) => void;
  }) {
    this.onStateChange = callbacks.onStateChange;
    this.onRoomChange = callbacks.onRoomChange;
    this.onPlayerDamage = callbacks.onPlayerDamage;
    this.onGameEnd = callbacks.onGameEnd;

    this.jumpscareManager.initialize(canvas);
  }

  /**
   * 开始游戏
   */
  startGame() {
    this.state.gameState = 'playing';
    this.startGameLoop();
    this.startHeartbeatSystem();
    this.notifyStateChange();
  }

  /**
   * 游戏主循环
   */
  private startGameLoop() {
    this.gameLoopInterval = window.setInterval(() => {
      this.update(1 / 60);  // 假设60 FPS
    }, 1000 / 60);
  }

  /**
   * 心跳系统
   */
  private startHeartbeatSystem() {
    this.heartbeatInterval = window.setInterval(() => {
      this.updateHeartRate();
    }, 1000);
  }

  /**
   * 更新游戏状态
   */
  private update(deltaTime: number) {
    if (this.state.gameState !== 'playing') return;

    this.state.gameTime += deltaTime;

    // 更新实体AI
    const entityBehavior = this.entityAI.update(
      deltaTime,
      this.state.currentRoom,
      this.state.playerStats.heartRate
    );

    // 处理实体行为结果
    if (entityBehavior.jumpscare) {
      this.triggerJumpscare(entityBehavior.jumpscare);
    }

    if (entityBehavior.soundCue) {
      this.displayNarrative(entityBehavior.soundCue);
    }

    // 检查死亡条件
    if (this.state.playerStats.hp <= 0) {
      this.triggerEnding('bad_death');
    }

    // 检查理智值
    if (this.state.playerStats.sanity <= 0) {
      this.state.playerStats.sanity = 0;
      // 低理智会增加幻觉和实体遭遇
    }

    // 手电筒电量消耗
    if (this.state.playerStats.hasFlashlight && this.state.playerStats.batteryLevel > 0) {
      this.state.playerStats.batteryLevel = Math.max(
        0,
        this.state.playerStats.batteryLevel - deltaTime * 0.33  // 5分钟耗尽
      );
    }

    this.notifyStateChange();
  }

  /**
   * 更新心率
   */
  private updateHeartRate() {
    const stats = this.state.playerStats;

    // 基础心率恢复
    if (stats.heartRate > 75) {
      stats.heartRate = Math.max(75, stats.heartRate - 2);  // 每秒降低2 BPM
    }

    // 低HP会增加心率
    if (stats.hp < 50) {
      stats.heartRate += 0.5;
    }

    // 实体接近会增加心率
    if (this.state.entity.state.currentRoom === this.state.currentRoom) {
      stats.heartRate = Math.min(180, stats.heartRate + 3);
    }

    // 低理智会增加心率波动
    if (stats.sanity < 30) {
      stats.heartRate += Math.random() * 5 - 2;  // 随机波动
    }

    // 限制范围
    stats.heartRate = Math.max(60, Math.min(180, stats.heartRate));
  }

  /**
   * 切换房间
   */
  changeRoom(roomId: RoomId) {
    const currentRoom = this.state.rooms.get(this.state.currentRoom);
    if (!currentRoom) return;

    // 检查出口是否可用
    const exit = currentRoom.exits.find(e => e.targetRoom === roomId);
    if (!exit) {
      this.displayNarrative('这个方向没有出口。');
      return;
    }

    if (exit.isLocked) {
      this.displayNarrative('门被锁住了。');
      if (exit.requiresPuzzle) {
        this.displayNarrative(`需要解决谜题：${exit.requiresPuzzle}`);
      }
      return;
    }

    // 切换房间
    this.state.currentRoom = roomId;
    this.state.stats.doorsOpened++;

    // 制造噪音
    this.makeNoise(30, roomId);

    // 触发房间描述
    const newRoom = this.state.rooms.get(roomId);
    if (newRoom) {
      this.displayNarrative(`\n【进入：${newRoom.name}】\n\n${newRoom.atmosphere.description}`);

      // 随机环境音
      if (Math.random() < 0.4 && newRoom.ambientSounds.random.length > 0) {
        const randomSound = newRoom.ambientSounds.random[
          Math.floor(Math.random() * newRoom.ambientSounds.random.length)
        ];
        setTimeout(() => this.displayNarrative(randomSound), 2000);
      }

      // 实体出现检查
      if (!newRoom.isEntitySafeRoom && Math.random() < newRoom.entitySpawnChance) {
        this.entityAI.setStalkMode(true);
        setTimeout(() => {
          this.triggerJumpscare(JUMPSCARE_PRESETS.ENTITY_APPEAR);
        }, 3000);
      }
    }

    if (this.onRoomChange) {
      this.onRoomChange(roomId);
    }

    this.notifyStateChange();
  }

  /**
   * 尝试解谜
   */
  solvePuzzle(puzzleId: string, solution: string | number | string[]) {
    const room = this.state.rooms.get(this.state.currentRoom);
    if (!room || !room.puzzle || room.puzzle.id !== puzzleId) {
      this.displayNarrative('这里没有这个谜题。');
      return false;
    }

    const puzzle = room.puzzle;
    puzzle.attempts++;

    // 检查答案
    const isCorrect = JSON.stringify(puzzle.solution) === JSON.stringify(solution);

    if (isCorrect) {
      puzzle.isCompleted = true;
      this.displayNarrative('\n✓ 谜题已解决！\n');

      // 解锁相关出口
      room.exits.forEach(exit => {
        if (exit.requiresPuzzle === puzzleId) {
          exit.isLocked = false;
          this.displayNarrative(`【${exit.direction}】方向的门已解锁。`);
        }
      });

      this.state.storyProgress.push(puzzleId);
      return true;
    } else {
      this.state.stats.puzzlesFailed++;
      this.displayNarrative('\n✗ 错误的答案...\n');

      // 失败惩罚
      this.applyPuzzleFailurePenalty(puzzle.failurePenalty);

      return false;
    }
  }

  /**
   * 应用谜题失败惩罚
   */
  private applyPuzzleFailurePenalty(penalty: string) {
    switch (penalty) {
      case 'entity_alert':
        this.displayNarrative('\n远处传来响动...它注意到了你。\n');
        this.makeNoise(80, this.state.currentRoom);
        this.state.playerStats.heartRate += 20;
        break;

      case 'hp_loss':
        this.takeDamage(10);
        this.displayNarrative('\n突然的电击让你痛苦不堪！\n');
        break;

      case 'door_lock':
        this.displayNarrative('\n门突然上锁了！\n');
        this.triggerJumpscare(JUMPSCARE_PRESETS.AMBIENT_SCARE);
        break;

      case 'light_out':
        this.displayNarrative('\n所有的灯都熄灭了...黑暗吞没了一切...\n');
        this.triggerJumpscare(JUMPSCARE_PRESETS.AMBIENT_SCARE);
        break;
    }
  }

  /**
   * 拾取物品
   */
  pickUpItem(itemId: string) {
    const room = this.state.rooms.get(this.state.currentRoom);
    if (!room) return;

    const item = room.interactables.find(i => i.id === itemId);
    if (!item) {
      this.displayNarrative('这里没有这个物品。');
      return;
    }

    if (!item.canPickUp) {
      this.displayNarrative(`${item.name}无法拾取。`);
      return;
    }

    this.state.inventory.push(itemId);
    this.state.stats.itemsCollected++;
    this.displayNarrative(`\n获得物品：${item.name}\n${item.description}\n`);

    // 特殊物品效果
    if (itemId === 'flashlight') {
      this.state.playerStats.hasFlashlight = true;
      this.state.playerStats.batteryLevel = 100;
      this.displayNarrative('手电筒仍有电量。你打开了它。');
    }

    this.notifyStateChange();
  }

  /**
   * 使用物品
   */
  useItem(itemId: string) {
    if (!this.state.inventory.includes(itemId)) {
      this.displayNarrative('你没有这个物品。');
      return;
    }

    // 特殊物品效果
    if (itemId === '盐' || itemId === 'salt') {
      const success = this.entityAI.useItem('盐');
      if (success) {
        this.displayNarrative('\n你撒出盐...实体发出刺耳的尖叫，退却了！\n');
        this.state.inventory = this.state.inventory.filter(i => i !== itemId);
        this.state.stats.entityEvasions++;
      } else {
        this.displayNarrative('盐在这里没有效果...');
      }
    }

    this.notifyStateChange();
  }

  /**
   * 制造噪音
   */
  makeNoise(intensity: number, location: RoomId) {
    const result = this.entityAI.reportNoise(intensity, location);
    if (result) {
      this.displayNarrative(result.soundCue);
    }
  }

  /**
   * 触发跳吓
   */
  triggerJumpscare(event: typeof JUMPSCARE_PRESETS[keyof typeof JUMPSCARE_PRESETS]) {
    this.state.gameState = 'jumpscare';
    this.state.stats.jumpscaresTriggered++;

    this.jumpscareManager.trigger(event, (effects) => {
      // 应用效果
      this.takeDamage(effects.hpDamage);
      this.state.playerStats.heartRate = Math.min(
        180,
        this.state.playerStats.heartRate + effects.heartRateIncrease
      );
      this.state.playerStats.sanity = Math.max(
        0,
        this.state.playerStats.sanity - effects.sanityDamage
      );

      // 环境变化
      if (effects.environmentChange) {
        this.applyEnvironmentChange(effects.environmentChange);
      }

      // 恢复游戏状态
      setTimeout(() => {
        if (this.state.playerStats.hp > 0) {
          this.state.gameState = 'playing';
          this.notifyStateChange();
        }
      }, 500);
    });

    this.notifyStateChange();
  }

  /**
   * 应用环境变化
   */
  private applyEnvironmentChange(change: string) {
    switch (change) {
      case 'lights_out':
        this.displayNarrative('\n所有的灯都熄灭了...\n');
        break;
      case 'door_lock':
        this.displayNarrative('\n身后的门砰地锁上了！\n');
        break;
      case 'wall_crack':
        this.displayNarrative('\n墙壁裂开了...裂缝中传来呼吸声...\n');
        break;
      case 'entity_spawn':
        this.state.entity.state.currentRoom = this.state.currentRoom;
        this.displayNarrative('\n它...就在这个房间里...\n');
        break;
    }
  }

  /**
   * 受到伤害
   */
  takeDamage(amount: number) {
    this.state.playerStats.hp = Math.max(0, this.state.playerStats.hp - amount);

    if (this.onPlayerDamage) {
      this.onPlayerDamage(this.state.playerStats.hp, this.state.playerStats.heartRate);
    }

    this.notifyStateChange();
  }

  /**
   * 做出故事选择
   */
  makeChoice(choice: StoryChoice) {
    this.displayNarrative(`\n> ${choice.text}\n`);

    // 根据风险等级触发效果
    if (choice.riskLevel === 'high_risk') {
      // 高风险选项必定触发强力跳吓
      setTimeout(() => {
        this.triggerJumpscare(JUMPSCARE_PRESETS.ENTITY_RUSH);
      }, 1000);
    } else if (choice.riskLevel === 'medium' && Math.random() < 0.5) {
      setTimeout(() => {
        this.triggerJumpscare(JUMPSCARE_PRESETS.AMBIENT_SCARE);
      }, 1000);
    }

    // 应用后果
    switch (choice.consequence) {
      case 'progress':
        this.state.storyProgress.push(choice.text);
        break;
      case 'jumpscare':
        this.triggerJumpscare(JUMPSCARE_PRESETS.ENTITY_APPEAR);
        break;
      case 'entity_alert':
        this.makeNoise(70, this.state.currentRoom);
        break;
      case 'item_gain':
        // 在选择中定义具体物品
        break;
      case 'hp_loss':
        this.takeDamage(15);
        break;
    }
  }

  /**
   * 触发结局
   */
  triggerEnding(endingType: EndingType) {
    const ending = this.state.endings.find(e => e.type === endingType);
    if (!ending) return;

    this.state.gameState = 'ending';

    if (this.onGameEnd) {
      this.onGameEnd(ending);
    }

    this.displayNarrative(`\n\n【${ending.title}】\n\n${ending.cinematicText}\n`);
    this.stopGame();
  }

  /**
   * 停止游戏
   */
  stopGame() {
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  /**
   * 显示叙述文本
   */
  private displayNarrative(text: string) {
    console.log(text);
    // TODO: 在UI中显示
  }

  /**
   * 通知状态变化
   */
  private notifyStateChange() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  /**
   * 获取当前状态
   */
  getState(): HorrorGameState {
    return { ...this.state };
  }

  /**
   * 获取介绍节点
   */
  private getIntroNode(): StoryNode {
    return {
      id: 'intro',
      stage: 'intro',
      narrative: `
你慢慢恢复意识...

头很痛。
身体很冷。
你躺在冰冷的混凝土地面上。

【你在哪里？】
【为什么在这里？】
【怎么离开？】

记忆模糊...最后的印象是...
...一间实验室...
...刺眼的白光...
...然后是黑暗...

你挣扎着站起来，环顾四周。
这是一个狭小的房间，墙壁潮湿发霉，空气中弥漫着腐臭。

远处...传来奇怪的声音...
...滴水声...
...金属摩擦声...
...还有...呼吸声？

不，那不可能是呼吸声...

【你必须逃出去】
      `.trim(),
      choices: [],
    };
  }

  /**
   * 定义所有结局
   */
  private defineEndings(): GameEnding[] {
    return [
      {
        type: 'true_escape',
        title: '真·逃脱',
        requirements: {
          allPuzzlesSolved: true,
          minHp: 50,
          entityDefeated: false,
          foundSecretItem: true,
        },
        description: '你成功逃离了设施，并永久封锁了它。',
        cinematicText: `
你按下红色按钮——完全销毁。

【警告：设施自毁程序启动】
【倒计时：60秒】

你转身狂奔，身后传来爆炸声。
天花板开始坍塌。
墙壁开裂。

它的尖叫声回荡在走廊里...
"嘎啦啦——！！！"

30秒...

你冲过走廊，推开紧急出口。
寒冷的夜风扑面而来。

15秒...

你看到远处的灯光——城市、人类、安全。
你狂奔向前。

5...4...3...2...1...

【轰！！！】

巨大的火球从地下设施喷涌而出。
整座建筑坍塌成废墟。

你瘫倒在地上，大口呼吸着新鲜空气。

你活下来了。
它...已经被永远埋葬了。

【真·结局：逃脱】
【你成功摧毁了实体和设施】
        `.trim(),
        unlocks: ['hardcore_mode', 'entity_viewer'],
      },
      {
        type: 'cursed_escape',
        title: '诅咒·逃脱',
        requirements: {
          minHp: 20,
        },
        description: '你逃脱了，但...它也自由了。',
        cinematicText: `
你按下绿色按钮——紧急逃生。

【紧急出口已开启】

门打开了。
你冲了出去。

但你忘记了一件事——
你关闭了设施的封锁系统。

你逃进夜色中。
城市的灯光在远处闪烁。

你活下来了。

但在你身后，设施的门仍然敞开着。
黑暗中，有什么正在爬出来...

红色的光在黑暗中闪烁。

【嘎啦啦——】

它...自由了。

【诅咒结局：你活了下来，但世界将为此付出代价】
        `.trim(),
        unlocks: ['news_clippings'],
      },
      {
        type: 'bad_death',
        title: 'Bad Ending',
        requirements: {},
        description: '它抓到了你。',
        cinematicText: `
你倒在地上，HP归零。

你太虚弱了...无法再逃跑...

黑暗中，爬行声越来越近...
咔...咔...咔...

你看到它...
高大、扭曲、破碎...

它缓慢地爬向你。
头部向左侧倾斜，发出湿润的咔咔声。

红色的光芒在眼眶中燃烧。

它张开嘴...
露出黑色的、腐烂的口腔...

【嘎啦啦——】

一只细长的手伸向你...

画面变黑。

【Bad Ending】
【你成为了第29号标本】
        `.trim(),
        unlocks: [],
      },
    ];
  }

  /**
   * 检查结局条件
   */
  checkEndingConditions(): GameEnding | null {
    // 死亡结局
    if (this.state.playerStats.hp <= 0) {
      return this.state.endings.find(e => e.type === 'bad_death') || null;
    }

    // 在最终房间才能触发其他结局
    if (this.state.currentRoom === 'final_room') {
      // 检查真结局条件
      const trueEnding = this.state.endings.find(e => e.type === 'true_escape');
      if (trueEnding && trueEnding.requirements) {
        const allPuzzles = Array.from(this.state.rooms.values())
          .filter(r => r.puzzle)
          .every(r => r.puzzle!.isCompleted);

        if (
          allPuzzles &&
          this.state.playerStats.hp >= (trueEnding.requirements.minHp || 0)
        ) {
          return trueEnding;
        }
      }
    }

    return null;
  }

  /**
   * 销毁游戏
   */
  destroy() {
    this.stopGame();
    this.jumpscareManager.destroy();
  }
}
