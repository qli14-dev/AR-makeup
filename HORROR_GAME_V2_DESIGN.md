# 破碎者 (The Broken One) - 完整设计文档
## 场景驱动恐怖密室逃脱游戏

---

## 一、核心架构：状态机系统

### 1.1 系统概述

```
游戏引擎架构
├── 场景系统 (Scene System)
│   ├── 场景定义 (Scene Definition)
│   ├── 视觉渲染 (Visual Renderer)
│   └── 音频管理 (Audio Manager)
├── 状态机 (State Machine)
│   ├── 全局状态 (Global State)
│   ├── 场景状态 (Scene State)
│   └── 触发器系统 (Trigger System)
├── 交互系统 (Interaction System)
│   ├── 选项生成 (Option Generator)
│   ├── 行为处理 (Action Handler)
│   └── 条件检查 (Condition Checker)
└── 资源系统 (Resource System)
    ├── 玩家状态 (Player Stats)
    ├── 物品管理 (Inventory)
    └── 标记系统 (Flags)
```

---

## 二、场景定义系统

### 2.1 场景数据结构

```javascript
const SceneDefinition = {
  // 基础信息
  id: "scene_id",
  name: "场景名称",
  type: "normal" | "puzzle" | "chase" | "encounter" | "finale",

  // 视觉描述
  visual: {
    background: {
      type: "dark_room" | "corridor" | "lab" | "industrial",
      elements: [
        { type: "wall", state: "moldy", color: "#2a2a2a" },
        { type: "floor", state: "wet", color: "#1a1a1a" },
        { type: "ceiling", state: "cracked", color: "#333" },
        { type: "light", state: "flickering", intensity: 0.3 }
      ],
      details: [
        "潮湿发霉的墙面，暗绿色霉斑",
        "地面有积水，反射微弱光芒",
        "天花板裂纹，露出生锈钢筋"
      ]
    },
    objects: [
      { id: "door", position: "north", state: "locked", visual: "生锈铁门" },
      { id: "table", position: "center", state: "broken", visual: "破损手术台" }
    ],
    atmosphere: {
      darkness: 0.8,      // 0-1，黑暗程度
      fog: 0.5,           // 0-1，雾气浓度
      decay: 0.7,         // 0-1，腐朽程度
      tension: 0.6        // 0-1，紧张度
    }
  },

  // 音频设计
  audio: {
    bgm: {
      track: "ambient_horror_01",
      volume: 0.3,
      loop: true,
      fadeIn: 2000
    },
    ambient: [
      { sound: "dripping_water", interval: [3000, 8000], volume: 0.4 },
      { sound: "creaking_floor", interval: [5000, 15000], volume: 0.3 },
      { sound: "distant_breathing", interval: [10000, 30000], volume: 0.2 }
    ],
    entity: {
      nearby: ["joint_cracking", "low_growl"],
      chasing: ["rapid_footsteps", "screech"]
    }
  },

  // 文本描述
  description: {
    initial: "详细的场景初始描述...",
    lookAround: "仔细观察后的额外细节...",
    atmosphere: "压迫感、气味、温度等感官描述..."
  },

  // 交互对象
  interactables: [
    {
      id: "bloodied_note",
      name: "血迹笔记",
      type: "item",
      visible: true,
      state: "available",
      actions: ["examine", "take"],
      examine: "笔记上写着...28号房间...第47次实验...",
      onTake: { addItem: "note_1", trigger: "note_found" }
    },
    {
      id: "door_lock",
      name: "密码锁",
      type: "puzzle",
      visible: true,
      state: "locked",
      actions: ["examine", "use"],
      puzzle: {
        type: "code",
        answer: "2847",
        attempts: 3,
        onSuccess: { unlock: "door", nextScene: "corridor" },
        onFailure: { damage: 10, trigger: "alarm" }
      }
    }
  ],

  // 出口定义
  exits: [
    {
      direction: "north",
      target: "corridor",
      locked: true,
      requirement: { flag: "door_unlocked" },
      description: "生锈的铁门，有密码锁"
    }
  ],

  // 触发器
  triggers: [
    {
      id: "first_enter",
      condition: { firstVisit: true },
      actions: [
        { type: "narrate", text: "你慢慢恢复意识..." },
        { type: "sound", sound: "heartbeat_slow" },
        { type: "updateStats", heartRate: 5 }
      ]
    },
    {
      id: "entity_approach",
      condition: { entityNearby: true, noise: ">50" },
      actions: [
        { type: "narrate", text: "远处传来关节摩擦的咔咔声..." },
        { type: "jumpscare", level: "light" },
        { type: "updateStats", heartRate: 20, sanity: -10 }
      ]
    }
  ],

  // 实体行为
  entity: {
    canEnter: false,      // 是否是安全区
    spawnChance: 0,       // 实体出现概率
    behavior: "patrol"    // patrol/hunt/stalk
  }
};
```

---

## 三、完整场景设计

### 场景1：觉醒室 (Awakening Room)

**场景ID**: `awakening_room`
**类型**: Normal (教学场景)
**目标**: 学习基础操作，解开第一个谜题

#### 视觉设计
```
背景：4x4米密闭房间
- 墙面：潮湿混凝土，暗绿黑色霉斑，多处水渍
- 地面：生锈铁板拼接，暗红色锈迹，碎玻璃
- 天花板：低矮（2.2米），剥落水泥，露出钢筋
- 光源：摇晃白炽灯（光强30%），2秒间隔闪烁

细节元素：
- 北墙：生锈铁门 + 四位数密码锁
- 东墙：破碎镜子（裂纹蛛网状）
- 角落：老旧手电筒（可拾取）
- 地面：血迹笔记（沾满暗红污渍）
- 墙角：拖拽痕迹（不规则，深色）
```

#### 音频设计
```javascript
audio: {
  bgm: "dark_ambient_drone",        // 低频嗡鸣，40Hz
  ambient: [
    { sound: "water_drip", interval: [2000, 5000], pitch: 0.8 },
    { sound: "light_flicker_buzz", interval: [2000, 2000], volume: 0.3 },
    { sound: "wind_hollow", interval: [8000, 15000], volume: 0.2 },
    { sound: "distant_metal_clang", interval: [15000, 40000], volume: 0.15 }
  ]
}
```

#### 交互选项
```
初始选项：
[1] 观察四周 (Look Around)
[2] 检查门锁 (Examine Door)
[3] 拾取手电筒 (Take Flashlight)
[4] 阅读笔记 (Read Note)
[5] 检查镜子 (Examine Mirror)
[6] 倾听 (Listen)

动态选项（基于状态）：
- 如果拾取手电筒 → [照亮角落] (Illuminate)
- 如果读过笔记 → [输入密码] (Enter Code)
- 如果多次失败 → [暴力破门] (Force Door - 高风险)
```

#### 谜题：密码锁
```javascript
puzzle: {
  id: "door_lock",
  type: "numerical_code",
  answer: "2847",
  clues: [
    {
      source: "bloodied_note",
      content: "28号房间...第47次实验...",
      hint: "组合实验编号：28 + 47"
    },
    {
      source: "wall_scratch",
      content: "墙面刮痕：2...8...4...7...",
      requiresFlashlight: true
    }
  ],
  attempts: 3,
  onSuccess: {
    narrate: "咔哒——门锁弹开。",
    unlock: "north_door",
    addFlag: "door_unlocked",
    nextScene: "corridor"
  },
  onFailure: {
    narrate: "密码错误！警报声响起——",
    sound: "alarm_brief",
    damage: 10,
    heartRate: 25,
    trigger: "entity_alerted"
  }
}
```

#### 触发事件
```javascript
triggers: [
  {
    id: "first_look_mirror",
    condition: { action: "examine", target: "mirror", firstTime: true },
    execute: [
      { narrate: "你看到镜中扭曲的自己...等等，镜子里有什么在动？" },
      { delay: 2000 },
      { jumpscare: "mirror_flash", intensity: "light" },
      { sound: "glass_crack" },
      { damage: 5, heartRate: 20, sanity: -15 }
    ]
  },
  {
    id: "take_flashlight",
    condition: { action: "take", target: "flashlight" },
    execute: [
      { narrate: "你拿起手电筒。打开开关——微弱的光照亮了周围。" },
      { addItem: "flashlight" },
      { updateVisual: { darkness: -0.3 } },
      { revealClue: "wall_scratch" }
    ]
  }
]
```

---

### 场景2：无尽回廊 (Endless Corridor)

**场景ID**: `corridor`
**类型**: Encounter (首次实体遭遇)
**目标**: 逃避实体，找到前进路径

#### 视觉设计
```
背景：15米长 x 1.2米宽狭窄走廊
- 墙面：剥落墙纸，霉菌侵蚀，露出腐烂墙板
- 地面：破碎木板，每步吱呀声，碎玻璃
- 天花板：管道外露，电线垂落，滴水
- 光源：壁灯（每5米一盏），50%已损坏，闪烁

动态元素：
- 走廊尽头：虚掩的门，内部漆黑
- 中段：倒地的担架（翻倒，有血迹）
- 墙上：扭曲的画像（眼睛似乎在看着你）
- 阴影：随灯光闪烁移动

实体行为：
- 30%概率：远处站立凝视
- 40%概率：爬行接近（声音先行）
- 30%概率：暂时安全
```

#### 音频设计
```javascript
audio: {
  bgm: "tension_strings",           // 弦乐，不和谐音
  ambient: [
    { sound: "creaking_wood", interval: [1000, 3000], volume: 0.5 },
    { sound: "light_buzz_flicker", interval: [2000, 4000], volume: 0.4 },
    { sound: "dripping_echo", interval: [3000, 7000], volume: 0.3 }
  ],
  entityNearby: [
    { sound: "joint_cracking", interval: [5000, 10000], volume: 0.6 },
    { sound: "breathing_wet", interval: [4000, 8000], volume: 0.5 },
    { sound: "wall_scraping", interval: [6000, 12000], volume: 0.4 }
  ]
}
```

#### 交互选项
```
标准选项：
[1] 慢慢前进 (Move Slowly) - 低噪音，慢速
[2] 快速冲刺 (Sprint) - 高噪音，快速，消耗体力
[3] 观察走廊 (Observe Corridor)
[4] 检查担架 (Check Stretcher)
[5] 倾听声音 (Listen Carefully)
[6] 躲藏等待 (Hide and Wait)

高风险选项：
[7] 呼喊求助 (Call Out) - 极高风险，吸引实体
[8] 使用手电筒 (Use Flashlight) - 照明但暴露位置

动态选项：
- 如果实体出现 → [逃跑] / [躲藏] / [使用盐]
- 如果发现门 → [进入下一房间]
```

#### 实体遭遇系统
```javascript
entityEncounter: {
  phases: [
    {
      phase: "distant_stare",
      condition: { playerEnter: true, noise: "<30" },
      visual: "走廊尽头，黑暗中有一个高大的轮廓。它一动不动。",
      audio: "silence_then_breathing",
      actions: [
        { narrate: "你的心跳骤停——走廊尽头有什么东西在看着你。" },
        { updateStats: { heartRate: 40, sanity: -20 } },
        { addOption: "slowly_back_away" }
      ],
      timeout: 5000,      // 5秒后进入下一阶段
      nextPhase: "approach"
    },
    {
      phase: "approach",
      condition: { noise: ">50" || playerMove: true },
      visual: "它开始移动。关节发出咔咔声。它在爬行——速度很快！",
      audio: "rapid_crawling_joint_cracking",
      actions: [
        { narrate: "【它发现你了！】" },
        { jumpscare: "entity_rush", intensity: "medium" },
        { updateStats: { heartRate: 70, hp: -15, sanity: -25 } },
        { startChase: true }
      ],
      nextPhase: "chase"
    },
    {
      phase: "chase",
      condition: { chasing: true },
      mechanics: {
        entitySpeed: 8.5,         // m/s
        playerSpeed: 6.0,         // 玩家速度
        catchupRate: 0.3,         // 每秒追上的距离
        escapeDistance: 15,       // 需要逃离的距离
        options: ["sprint", "hide", "use_salt", "throw_object"]
      },
      success: {
        narrate: "你冲进下一个房间，砰地关上门！",
        nextScene: "laboratory",
        updateStats: { heartRate: -30 }
      },
      failure: {
        narrate: "它抓住了你——",
        jumpscare: "entity_grab", intensity: "heavy",
        damage: 40,
        checkDeath: true
      }
    }
  ]
}
```

---

### 场景3：标本实验室 (Specimen Laboratory)

**场景ID**: `laboratory`
**类型**: Puzzle (核心谜题场景)
**目标**: 解开实验密码，获取关键物品

#### 视觉设计
```
背景：4x4米实验室
- 墙面：白色瓷砖（大部分碎裂脱落），深度抓痕
- 地面：白色瓷砖，福尔马林液体，碎玻璃
- 天花板：无影灯（绿色色调），吊顶部分坍塌
- 光强：50%

核心元素：
- 中央：金属手术台（生锈，暗褐色污渍）
  - 约束带断裂，金属扣环有抓痕
  - 台面散落手术器械（手术刀、镊子、锯子）
- 四周：玻璃陈列柜（破碎，内部空荡）
  - 一个柜子里还有一小袋盐
- 墙面：深度抓痕排列成图案
  - ○（圆形）→ △（三角）→ □（方形）→ ⬡（六边形）→ ★（星形）
- 东墙：带图案锁的铁门
```

#### 音频设计
```javascript
audio: {
  bgm: "industrial_horror",         // 工业音，金属撞击
  ambient: [
    { sound: "surgical_lamp_buzz", continuous: true, volume: 0.4 },
    { sound: "formaldehyde_drip", interval: [2000, 5000], volume: 0.3 },
    { sound: "glass_tinkle", interval: [10000, 25000], volume: 0.2 },
    { sound: "metal_scrape", interval: [8000, 20000], volume: 0.3 }
  ],
  interactive: {
    examineTable: "restraint_snap_echo",
    openCabinet: "glass_shatter_small",
    solvePattern: "mechanical_unlock"
  }
}
```

#### 交互系统
```javascript
interactables: [
  {
    id: "surgical_table",
    name: "手术台",
    actions: ["examine", "search"],
    states: {
      initial: {
        description: "生锈的手术台，表面有暗褐色污渍。约束带已断裂。",
        examine: "仔细观察：约束带从内部挣脱，金属扣环深深凹陷。",
        onExamine: { revealClue: "escape_marks", sanity: -5 }
      }
    }
  },
  {
    id: "wall_scratches",
    name: "墙面抓痕",
    actions: ["examine", "interpret"],
    requiresFlashlight: true,
    examine: {
      description: "抓痕深至墙体内部，排列成清晰的图案序列：",
      pattern: ["circle", "triangle", "square", "hexagon", "star"],
      additional: "每个图案下方有数字：1、2、3、4、5",
      onExamine: { addClue: "pattern_sequence", sanity: -10 }
    }
  },
  {
    id: "specimen_cabinet",
    name: "标本柜",
    actions: ["open", "search"],
    states: {
      locked: {
        description: "破碎的玻璃柜，门微微开着。",
        onOpen: {
          sound: "glass_creak",
          reveal: "salt_bag",
          narrate: "柜子里有一小袋盐。"
        }
      }
    }
  },
  {
    id: "experiment_log",
    name: "实验记录",
    actions: ["read"],
    content: `
【实验记录 - 第28批次】
日期：████年██月██日
标本编号：28-47
程序：
第一阶段：○ 注射血清A
第二阶段：△ 神经刺激
第三阶段：□ 骨骼重组
第四阶段：⬡ 意识抹除
第五阶段：★ 最终激活

结果：失败。标本突破约束，逃逸。
备注：它仍在设施内。保持警戒。
    `,
    onRead: { addClue: "experiment_procedure", sanity: -15 }
  },
  {
    id: "pattern_lock",
    name: "图案锁",
    type: "puzzle",
    puzzle: {
      type: "sequence",
      answer: ["circle", "triangle", "square", "hexagon", "star"],
      interface: "按顺序点击图案按钮",
      attempts: 3,
      onSuccess: {
        narrate: "咔哒——机械锁打开。门缓缓推开。",
        sound: "mechanical_unlock",
        unlock: "east_door",
        nextScene: "control_room"
      },
      onFailure: {
        narrate: "错误！电流冲击——",
        sound: "electric_shock",
        jumpscare: "electric_flash",
        damage: 15,
        heartRate: 30,
        attempts: -1
      },
      onFinalFailure: {
        narrate: "警报响起——它听到了。",
        sound: "alarm_loud",
        trigger: "entity_hunt",
        forced: true
      }
    }
  }
]
```

#### 动态事件
```javascript
dynamicEvents: [
  {
    id: "cabinet_fall",
    trigger: { action: "search", target: "specimen_cabinet" },
    chance: 0.4,
    execute: [
      { narrate: "柜子突然倒塌——玻璃碎裂声！" },
      { sound: "glass_shatter_loud" },
      { jumpscare: "environmental", intensity: "light" },
      { damage: 10, heartRate: 25 },
      { noise: 80 },      // 制造大噪音
      { trigger: "entity_investigate" }
    ]
  },
  {
    id: "table_shadow",
    trigger: { timeInRoom: ">60", examined: ["surgical_table"] },
    execute: [
      { narrate: "手术台下的阴影...好像动了一下。" },
      { cameraShake: "subtle" },
      { heartRate: 15, sanity: -10 },
      { addOption: "check_under_table" }
    ]
  }
]
```

---

### 场景4：控制室 (Control Room)

**场景ID**: `control_room`
**类型**: Chase Preparation (追逐前的紧张准备)
**目标**: 获取最终密码，准备逃离

#### 视觉设计
```
背景：5x4米控制中心
- 墙面：金属板，电缆外露，部分烧焦
- 地面：防静电地板，干燥
- 天花板：吊顶，红色应急灯闪烁
- 光强：60%

核心元素：
- 中央：U型控制台（大量按钮、开关、显示屏）
- 监控墙：12个屏幕（部分工作）
  - 屏幕3：走廊中的实体（正在爬行）
  - 屏幕7：实验室（刚离开的房间）
  - 屏幕11：门外（黑屏 → 突然扭曲的脸贴近镜头）
- 终端：绿色光标闪烁，等待输入
  - "紧急逃生系统 - 需要8位授权码"
```

#### 监控系统交互
```javascript
monitorSystem: {
  screens: [
    {
      id: "monitor_3",
      location: "corridor",
      content: {
        initial: "空荡的走廊",
        dynamic: {
          timer: 10000,   // 10秒后更新
          update: "实体出现：正在爬行，向控制室方向移动",
          onUpdate: {
            narrate: "【屏幕3】它在走廊里...正在接近！",
            heartRate: 30,
            addFlag: "entity_approaching"
          }
        }
      }
    },
    {
      id: "monitor_11",
      location: "door_outside",
      content: {
        initial: "门外黑暗",
        trigger: { timeInRoom: ">30" },
        jumpscare: {
          sequence: [
            { delay: 0, visual: "黑屏" },
            { delay: 2000, visual: "微弱轮廓逐渐靠近" },
            { delay: 4000, visual: "【突然】扭曲的脸贴近镜头" },
            { effect: "screen_static", sound: "screech_loud" },
            { damage: 20, heartRate: 50, sanity: -30 }
          ]
        }
      }
    }
  ]
}
```

#### 主谜题：逃生密码
```javascript
finalPuzzle: {
  id: "escape_code",
  type: "numerical_8digit",
  answer: "28471013",
  timeLimit: 120000,    // 120秒时间限制

  clues: [
    {
      source: "facility_blueprint",
      location: "control_desk_drawer",
      content: `
【设施蓝图标注】
建筑日期：2013年10月
主实验室编号：B-28
紧急通道编号：47
安全等级：Level-10

手写备注："密码 = 实验室 + 通道 + 安全 + 年份后两位"
→ 28 + 47 + 10 + 13 = ????????
      `
    },
    {
      source: "personnel_log",
      location: "terminal_attached",
      content: `
【最后的日志 - 操作员 Alex Chen】
"实验失败。标本28-47逃脱。
我是唯一幸存者。
逃生密码：28471013
快逃。它在门外——"
（键盘上有血迹）
      `
    }
  ],

  onSuccess: {
    narrate: "【系统】授权码正确。紧急出口已解锁。",
    sound: "system_unlock",
    unlockDoor: "north_emergency_exit",
    startSequence: "final_chase"
  },

  onTimeout: {
    narrate: "时间到——门外传来猛烈撞击声！",
    sound: "door_bang_heavy",
    forcedEvent: "entity_break_in"
  }
}
```

#### 时间压力系统
```javascript
timeEvents: [
  {
    time: 30000,    // 30秒
    event: {
      narrate: "【屏幕3】它已经进入走廊。",
      sound: "distant_footsteps",
      heartRate: 10
    }
  },
  {
    time: 60000,    // 60秒
    event: {
      narrate: "【屏幕7】它就在门外。你听到呼吸声。",
      sound: "heavy_breathing_close",
      heartRate: 20,
      sanity: -15
    }
  },
  {
    time: 90000,    // 90秒
    event: {
      narrate: "【门开始震动】——砰！砰！砰！",
      sound: "door_bang_rhythmic",
      cameraShake: "medium",
      heartRate: 30,
      addOption: "barricade_door"    // 紧急选项
    }
  },
  {
    time: 120000,   // 120秒
    event: {
      narrate: "【门破碎】它冲了进来——",
      forcedJumpscare: "entity_breakthrough",
      damage: 50,
      checkDeath: true
    }
  }
]
```

---

### 场景5：逃亡走廊 (Escape Corridor)

**场景ID**: `escape_corridor`
**类型**: Chase (强制追逐)
**目标**: 全速奔跑逃离

#### 视觉设计
```
背景：30米笔直走廊
- 墙面：混凝土，管道外露
- 地面：混凝土，无障碍
- 天花板：高天花板，红色警报灯闪烁
- 光强：40%（闪烁）

动态视角：
- 第一人称快速移动
- 画面剧烈晃动
- 边缘模糊（速度感）
- 后方：实体追逐（逐渐靠近）
```

#### 追逐机制
```javascript
chaseMechanics: {
  type: "scripted_sequence",
  duration: 15000,      // 15秒追逐

  playerActions: {
    sprint: {
      speed: 6.0,
      staminaDrain: 10,   // 每秒消耗
      mandatory: true
    },
    lookBack: {
      slowdown: 0.5,      // 减速50%
      visual: "实体距离5米，快速爬行",
      risk: "high"
    },
    stumble: {
      chance: 0.15,       // 15%概率绊倒
      onStumble: {
        narrate: "你绊倒了——！",
        delay: 1000,
        damage: 10,
        entityGain: 3       // 实体追上3米
      }
    }
  },

  entityBehavior: {
    speed: 8.5,
    catchupRate: 0.2,     // 每秒追上0.2米
    distance: {
      start: 15,          // 初始距离15米
      danger: 5,          // 5米内危险
      catch: 0            // 0米被抓
    }
  },

  audioDesign: {
    player: {
      breathing: "heavy_panting",
      heartbeat: "rapid_thumping",
      footsteps: "running_concrete"
    },
    entity: {
      crawling: "rapid_joint_cracking",
      screech: "pursuing_screech",
      impact: "wall_crash"      // 撞墙声
    },
    environment: {
      alarm: "emergency_siren",
      wind: "rushing_air"
    },
    mix: "all_sounds_layered",    // 所有声音叠加
    volume: "maximum_intensity"
  },

  visualEffects: {
    cameraShake: "extreme",
    motionBlur: "high",
    vignette: "pulsing_red",
    heartbeatOverlay: "visual_pulse"
  },

  checkpoints: [
    {
      distance: 10,
      event: {
        narrate: "还有20米——它在你身后5米！",
        heartRate: 150,
        sound: "entity_screech_close"
      }
    },
    {
      distance: 20,
      event: {
        narrate: "10米——快到了！",
        heartRate: 170,
        visual: "exit_light_visible"
      }
    },
    {
      distance: 30,
      success: true
    }
  ],

  success: {
    narrate: "你冲过出口——门自动关闭！",
    sound: "metal_door_slam",
    visual: "safe",
    nextScene: "finale_room",
    updateStats: { heartRate: -50 }
  },

  failure: {
    narrate: "它抓住了你的腿——",
    jumpscare: "entity_grab_leg",
    damage: 40,
    checkDeath: true,
    alternativeOutcome: "wounded_escape"  // 受伤逃脱
  }
}
```

---

### 场景6：终局抉择室 (Finale Chamber)

**场景ID**: `finale_room`
**类型**: Finale (结局选择)
**目标**: 做出最终选择

#### 视觉设计
```
背景：5x5米密封避难室
- 墙面：强化混凝土，无窗
- 地面：钢板地面
- 天花板：低矮，红色警报灯闪烁
- 光强：70%

核心元素：
- 三个控制面板（中央排列）
  - 绿色面板：紧急逃生按钮
  - 黄色面板：部分封锁按钮
  - 红色面板：完全销毁按钮
- 门（南侧）：
  - 厚重金属门，已锁定
  - 门板变形，裂纹出现
  - 实体在外猛烈撞击
```

#### 门外威胁
```javascript
doorThreat: {
  phases: [
    {
      time: 0,
      visual: "门完好",
      sound: "distant_banging",
      narrate: "你听到远处的撞击声..."
    },
    {
      time: 5000,
      visual: "门开始震动",
      sound: "heavy_impact",
      narrate: "【砰！】门剧烈震动！",
      cameraShake: "medium"
    },
    {
      time: 10000,
      visual: "门板凹陷",
      sound: "metal_dent",
      narrate: "门板开始变形——你看到凹痕！",
      heartRate: 20
    },
    {
      time: 15000,
      visual: "裂纹出现",
      sound: "metal_crack",
      narrate: "裂纹出现——它快要进来了！",
      heartRate: 30,
      sanity: -20
    },
    {
      time: 20000,
      visual: "手指伸入",
      sound: "screech_loud",
      narrate: "【它的手指从裂缝伸进来——细长、破碎、颤抖】",
      jumpscare: "fingers_through_door",
      damage: 15,
      urgent: true
    },
    {
      time: 30000,
      visual: "门即将破碎",
      narrate: "【时间到】门破碎——",
      forcedEnding: "bad_ending"
    }
  ]
}
```

#### 结局系统
```javascript
endings: [
  {
    id: "true_ending",
    name: "真·逃脱",
    button: "red",
    requirements: {
      minHP: 50,
      solvedPuzzles: ["door_lock", "pattern_lock", "escape_code"],
      hasItem: "flashlight"
    },
    sequence: [
      {
        action: "press_button",
        narrate: "你按下红色按钮——完全销毁。",
        sound: "button_press_heavy"
      },
      {
        delay: 1000,
        narrate: "【警告：设施自毁程序启动】\n【倒计时：60秒】",
        sound: "alarm_countdown",
        visual: "red_flashing"
      },
      {
        delay: 2000,
        narrate: "天花板开始坍塌。你转身狂奔！",
        startSequence: "escape_run"
      },
      {
        delay: 10000,
        narrate: "【30秒】爆炸声在身后响起——轰！",
        sound: "explosion_distant",
        cameraShake: "extreme"
      },
      {
        delay: 15000,
        narrate: "【15秒】你看到出口的灯光！",
        visual: "exit_light"
      },
      {
        delay: 20000,
        narrate: "你冲出设施——寒冷的夜风扑面而来。",
        visual: "outside_night",
        sound: "wind_cold"
      },
      {
        delay: 22000,
        narrate: "身后——【轰！！！】巨大的火球冲天而起。",
        sound: "explosion_massive",
        visual: "facility_explode"
      },
      {
        delay: 25000,
        narrate: `
你瘫倒在地上，大口呼吸着新鲜空气。

你活下来了。
它...已经被永远埋葬了。

╔════════════════════════════╗
║      【真·逃脱】           ║
║   你成功摧毁了实体和设施    ║
╚════════════════════════════╝
        `,
        visual: "ending_screen_true",
        sound: "ending_music_hopeful",
        unlocks: ["hardcore_mode", "entity_viewer"]
      }
    ]
  },

  {
    id: "cursed_ending",
    name: "诅咒·逃脱",
    button: "green",
    requirements: {
      minHP: 20
    },
    sequence: [
      {
        action: "press_button",
        narrate: "你按下绿色按钮——紧急逃生。",
        sound: "button_press"
      },
      {
        delay: 1000,
        narrate: "【紧急出口已开启】门打开了——你冲了出去！",
        sound: "door_unlock_fast"
      },
      {
        delay: 3000,
        narrate: "你逃进夜色中。城市的灯光在远处闪烁。",
        visual: "city_lights_distant"
      },
      {
        delay: 5000,
        narrate: "你活下来了。",
        sound: "relief_breath"
      },
      {
        delay: 7000,
        narrate: "但在你身后，设施的门仍然敞开着...",
        visual: "facility_door_open",
        sound: "wind_ominous"
      },
      {
        delay: 9000,
        narrate: "黑暗中，有什么正在爬出来...",
        visual: "entity_crawling_out"
      },
      {
        delay: 11000,
        narrate: "红色的光在黑暗中闪烁。",
        visual: "red_eyes_darkness"
      },
      {
        delay: 13000,
        narrate: "【嘎啦啦——】",
        sound: "entity_screech_distant"
      },
      {
        delay: 15000,
        narrate: `
它...自由了。

╔═══════════════════════════════╗
║       【诅咒·逃脱】           ║
║  你活了下来，但世界将付出代价  ║
╚═══════════════════════════════╝
        `,
        visual: "ending_screen_cursed",
        sound: "ending_music_ominous",
        unlocks: ["news_clippings"]
      }
    ]
  },

  {
    id: "neutral_ending",
    name: "部分封锁",
    button: "yellow",
    requirements: {},
    sequence: [
      {
        action: "press_button",
        narrate: "你按下黄色按钮——部分封锁。",
        sound: "button_press"
      },
      {
        delay: 1000,
        narrate: "【设施进入半锁定状态】\n【10小时后自动解除】",
        sound: "system_lockdown"
      },
      {
        delay: 3000,
        narrate: "你通过紧急通道逃脱了。",
        visual: "emergency_exit"
      },
      {
        delay: 5000,
        narrate: "它被困在里面...暂时的。",
        sound: "entity_distant_screech"
      },
      {
        delay: 7000,
        narrate: `
你只是争取了时间...

╔═══════════════════════════════╗
║       【部分逃脱】            ║
║    你逃脱了，但危机未解除     ║
╚═══════════════════════════════╝
        `,
        visual: "ending_screen_neutral",
        sound: "ending_music_uncertain"
      }
    ]
  },

  {
    id: "bad_ending",
    name: "死亡",
    trigger: { hp: 0 || timeout: true },
    sequence: [
      {
        narrate: "你倒在地上...太虚弱了...无法再移动...",
        visual: "player_collapsed",
        sound: "heavy_breathing_weak"
      },
      {
        delay: 2000,
        narrate: "黑暗中，爬行声越来越近...",
        sound: "crawling_approach"
      },
      {
        delay: 4000,
        narrate: "咔...咔...咔...",
        sound: "joint_cracking_close"
      },
      {
        delay: 6000,
        narrate: "它站在你面前。高大、扭曲、破碎。",
        visual: "entity_looming",
        sound: "breathing_wet_close"
      },
      {
        delay: 8000,
        narrate: "头部缓慢转向你。红色的光芒在眼眶中燃烧。",
        visual: "entity_eyes_glow"
      },
      {
        delay: 10000,
        narrate: "它伸出手...",
        visual: "entity_hand_reaching"
      },
      {
        delay: 12000,
        narrate: "【嘎啦啦——】",
        sound: "entity_screech_final",
        visual: "screen_to_black"
      },
      {
        delay: 15000,
        narrate: `
画面变黑。

╔═══════════════════════════════╗
║        【Bad Ending】         ║
║     你成为了第29号标本        ║
╚═══════════════════════════════╝
        `,
        visual: "ending_screen_bad",
        sound: "silence"
      }
    ]
  }
]
```

---

## 四、状态机核心逻辑

### 4.1 全局状态管理

```javascript
const GlobalState = {
  // 玩家状态
  player: {
    hp: 100,              // 生命值 0-100
    heartRate: 75,        // 心率 60-180 BPM
    sanity: 100,          // 理智值 0-100
    stamina: 100,         // 体力 0-100
    noise: 0              // 噪音等级 0-100
  },

  // 物品栏
  inventory: [],          // ["flashlight", "salt", "note_1"]

  // 标记系统
  flags: {
    door_unlocked: false,
    entity_alerted: false,
    note_found: false,
    saw_entity: false,
    // ... 更多标记
  },

  // 线索收集
  clues: [],             // ["pattern_sequence", "escape_code_hint"]

  // 场景历史
  visitedScenes: [],

  // 实体状态
  entity: {
    currentScene: "corridor",
    behavior: "patrol",   // patrol/hunt/stalk
    aggression: 30,       // 0-100
    knowsPlayerLocation: false
  },

  // 游戏时间
  gameTime: 0,           // 秒
  sceneTime: 0,          // 当前场景时间

  // 统计
  stats: {
    jumpscaresTriggered: 0,
    puzzlesSolved: 0,
    deaths: 0,
    itemsCollected: 0
  }
};
```

### 4.2 状态转换规则

```javascript
const StateTransitions = {
  // 场景转换
  sceneTransition: (currentScene, action, targetScene) => {
    // 检查条件
    if (!canEnterScene(targetScene)) {
      return {
        allowed: false,
        reason: "door_locked",
        narrate: "门被锁住了。"
      };
    }

    // 执行转换
    const transition = {
      from: currentScene,
      to: targetScene,
      actions: [
        { type: "leaveScene", scene: currentScene },
        { type: "enterScene", scene: targetScene },
        { type: "updateEntity", action: "react_to_movement" },
        { type: "updateStats", noise: 30, heartRate: 10 }
      ]
    };

    return executeTransition(transition);
  },

  // 实体行为转换
  entityBehaviorTransition: (currentBehavior, trigger) => {
    const behaviorTree = {
      patrol: {
        noise_high: "investigate",
        player_seen: "hunt",
        time_elapsed: "stalk"
      },
      investigate: {
        find_player: "hunt",
        no_player: "patrol",
        hear_loud_noise: "hunt"
      },
      stalk: {
        player_unaware: "approach",
        player_aware: "hunt",
        timeout: "patrol"
      },
      hunt: {
        player_escaped: "search",
        player_hidden: "search",
        player_caught: "attack"
      }
    };

    return behaviorTree[currentBehavior][trigger];
  },

  // 玩家状态更新
  playerStateUpdate: (statType, delta) => {
    const effects = {
      hp: (value) => {
        if (value <= 0) return { gameOver: true, ending: "bad" };
        if (value < 30) return { effect: "critical_warning" };
        return null;
      },
      heartRate: (value) => {
        if (value > 160) return { effect: "panic_mode", sanity: -5 };
        if (value < 70) return { effect: "calm" };
        return null;
      },
      sanity: (value) => {
        if (value < 20) return { effect: "hallucinations" };
        if (value < 50) return { effect: "vision_distortion" };
        return null;
      }
    };

    const newValue = GlobalState.player[statType] + delta;
    GlobalState.player[statType] = clamp(newValue, 0, 200);

    return effects[statType](GlobalState.player[statType]);
  }
};
```

### 4.3 触发器系统

```javascript
const TriggerSystem = {
  // 注册触发器
  triggers: new Map(),

  // 添加触发器
  register: (triggerId, condition, actions) => {
    TriggerSystem.triggers.set(triggerId, {
      id: triggerId,
      condition: condition,
      actions: actions,
      enabled: true,
      triggered: false,
      oneTime: false
    });
  },

  // 检查所有触发器
  checkTriggers: () => {
    for (const [id, trigger] of TriggerSystem.triggers) {
      if (!trigger.enabled) continue;
      if (trigger.oneTime && trigger.triggered) continue;

      if (evaluateCondition(trigger.condition)) {
        executeTrigger(trigger);
        trigger.triggered = true;

        if (trigger.oneTime) {
          trigger.enabled = false;
        }
      }
    }
  },

  // 条件评估
  evaluateCondition: (condition) => {
    // 支持多种条件类型
    if (condition.flag) {
      return GlobalState.flags[condition.flag] === condition.value;
    }
    if (condition.stat) {
      return checkStatCondition(condition.stat, condition.operator, condition.value);
    }
    if (condition.item) {
      return GlobalState.inventory.includes(condition.item);
    }
    if (condition.scene) {
      return GlobalState.currentScene === condition.scene;
    }
    if (condition.custom) {
      return condition.custom();
    }
  },

  // 执行触发器
  executeTrigger: (trigger) => {
    for (const action of trigger.actions) {
      executeAction(action);
    }
  }
};
```

---

## 五、示例游戏流程

### 完整通关流程（True Ending）

```
========== 游戏开始 ==========

[场景1：觉醒室]
时间: 0:00

> 玩家醒来
- 显示：黑暗房间，摇晃灯光
- 音效：低频嗡鸣，滴水声
- 状态：HP 100, 心率 75, 理智 100

> 选项：[观察四周]
- 叙述：详细环境描述
- 发现：门、镜子、手电筒、笔记

> 选项：[拾取手电筒]
- 获得：手电筒
- 效果：黑暗度 -30%
- 揭示：墙面刮痕（隐藏线索）

> 选项：[阅读笔记]
- 内容："28号房间...第47次实验..."
- 线索：密码提示

> 选项：[输入密码] → 2847
- 成功：门锁打开
- 音效：机械解锁声
- 转场：进入走廊

时间: 2:30

---

[场景2：无尽回廊]
时间: 2:30

> 进入走廊
- 显示：狭窄走廊，昏暗灯光闪烁
- 音效：木板吱呀，风声
- 心率：+10 (现在85 BPM)

> 选项：[观察走廊]
- 叙述：走廊尽头有虚掩的门
- 发现：倒地担架，墙上画像
- 触发：远处传来声音...

> [实体事件触发]
- 叙述："走廊尽头，黑暗中有一个高大的轮廓。它一动不动。"
- 显示：实体剪影（远处站立）
- 音效：沉默...然后是呼吸声
- 心率：+40 (现在125 BPM)
- 理智：-20 (现在80)

> 选项：[慢慢后退]
- 成功：实体未追击
- 效果：紧张度上升

> 选项：[快速前进]
- 风险：中等
- 结果：安全通过
- 噪音：+30

> 转场：进入标本室

时间: 4:00

---

[场景3：标本实验室]
时间: 4:00

> 进入实验室
- 显示：破损实验室，手术台，陈列柜
- 音效：无影灯嗡鸣，福尔马林滴落
- 心率：逐渐恢复至95 BPM

> 选项：[检查手术台]
- 叙述：约束带从内部挣脱
- 理智：-5 (现在75)

> 选项：[检查墙面抓痕]（需要手电筒）
- 发现：图案序列 ○△□⬡★
- 获得线索："pattern_sequence"

> 选项：[阅读实验记录]
- 内容：实验步骤与图案对应
- 理智：-15 (现在60)
- 完整理解谜题

> 选项：[打开标本柜]
- 获得：盐
- 音效：玻璃吱呀声
- 噪音：+20

> 选项：[解开图案锁] → ○△□⬡★
- 成功：门解锁
- 音效：机械解锁
- 转场：进入控制室

时间: 7:30

---

[场景4：控制室]
时间: 7:30

> 进入控制室
- 显示：监控墙，控制台，终端
- 音效：服务器嗡鸣，键盘光标闪烁
- 心率：105 BPM（紧张）

> 选项：[查看监控]
- 屏幕3：实体在走廊爬行
- 屏幕11：【跳吓】扭曲的脸贴近镜头
- 伤害：-20 HP (现在80)
- 心率：+50 (现在155 BPM)
- 理智：-30 (现在30)

> [时间压力开始] - 120秒倒计时

> 选项：[搜索蓝图]
- 发现：密码公式
- 线索："28 + 47 + 10 + 13"

> 选项：[阅读日志]
- 发现：完整密码 28471013
- 心率：+10 (紧张度)

> [30秒] 警告：实体已进入走廊
> [60秒] 警告：实体在门外

> 选项：[输入逃生码] → 28471013
- 成功：紧急出口解锁
- 音效：系统解锁
- 转场：开始追逐

时间: 10:00

---

[场景5：逃亡走廊]
时间: 10:00

> [强制追逐开始]
- 显示：第一人称快速移动
- 音效：心跳、呼吸、爬行声全部叠加
- 心率：飙升至180 BPM
- 视觉效果：剧烈晃动、边缘模糊

> [自动奔跑] - 无需选择
- 距离：30米
- 实体距离：15米
- 速度：玩家6.0 m/s, 实体8.5 m/s

> [10米] 叙述："还有20米——它在你身后5米！"
> [20米] 叙述："10米——快到了！"
> [30米] 成功逃脱！

- 冲过出口
- 门自动关闭
- 安全！
- 心率：降至130 BPM
- 转场：最终房间

时间: 10:15

---

[场景6：终局抉择室]
时间: 10:15

> 进入避难室
- 显示：三个控制面板
- 音效：门外撞击声
- 心率：120 BPM

> [门外威胁开始]
- 0秒：远处撞击
- 5秒：门震动
- 10秒：门板凹陷
- 15秒：裂纹出现
- 20秒：手指伸入（跳吓）

> 选项：[按红色按钮] - 完全销毁
- 条件检查：HP 80 >= 50 ✓
- 条件检查：已解决3个谜题 ✓

> [True Ending 序列开始]
- "设施自毁程序启动 - 60秒"
- 倒计时动画
- 逃跑场景
- 爆炸特效
- 成功逃脱画面

> 结局画面：
╔════════════════════════════╗
║      【真·逃脱】           ║
║   你成功摧毁了实体和设施    ║
╚════════════════════════════╝

解锁：硬核模式、实体查看器

游戏时间：10:45
死亡次数：0
跳吓次数：3
理智值：30
HP：80

========== 游戏结束 ==========
```

---

这是完整的设计文档。我现在将基于这个设计创建新的完整HTML实现。
