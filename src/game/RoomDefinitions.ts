/**
 * 房间定义 - 极致压迫的密室环境
 * 参考：《P.T.》的走廊、《Outlast》的精神病院、恐怖密室实景
 *
 * 每个房间都具有：
 * - 照片级真实感的视觉描述
 * - 潮湿、发霉、腐朽的环境细节
 * - 逻辑谜题与线索散布
 * - 恐怖事件触发点
 */

import { Room, RoomId, Puzzle, Clue, Interactable } from '../types/horror';

/**
 * 初始房间 - "觉醒室"
 *
 * 玩家在此苏醒，弱光、压迫、未知声音
 * 教学关卡，学习基础操作
 */
export function createInitialRoom(): Room {
  return {
    id: 'initial_room',
    name: '觉醒室',

    atmosphere: {
      description: `
你躺在冰冷的混凝土地面上，慢慢恢复意识。

【墙面】
四周是斑驳的混凝土墙，表面潮湿，长满暗绿色和黑色的霉斑。
墙角处有明显的水渍痕迹，从天花板一直流淌到地面，形成黑色的积水。
多处墙面开裂，裂缝深度不明，里面偶尔传出...滴水声？还是别的什么...

【地面】
生锈的铁板拼接地面，接缝处有暗红色的锈迹和不明的棕色污渍。
角落里散落着破碎的玻璃碎片，反射着微弱的光芒。
你注意到地面上有拖拽痕迹——长长的、不规则的...像是什么重物被拖走了。

【天花板】
低矮的水泥天花板，距离你只有2.2米。
多处剥落，露出生锈的钢筋骨架。
一盏老旧的白炽灯摇晃着，发出不稳定的嗡嗡声，光线忽明忽暗。
每次灯光闪烁时，阴影在墙上扭曲成奇怪的形状。

【气味】
潮湿的霉味混合着铁锈的腥味，还有一股说不清的...腐臭？
空气沉重，每次呼吸都像在吸入湿漉漉的海绵。
      `.trim(),

      lightLevel: 25,  // 非常昏暗，只有一盏摇晃的灯
      wallCondition: '潮湿发霉，多处开裂，有水渍和不明污渍',
      floorType: '生锈铁板，接缝处有暗红色锈迹和碎玻璃',
      ceiling: '低矮水泥，剥落露出钢筋，一盏不稳定的白炽灯',
      airQuality: '潮湿霉味 + 铁锈腥味 + 轻微腐臭',
    },

    ambientSounds: {
      base: [
        '滴答...滴答...滴答...（水滴声，节奏诡异地不规律）',
        '嗡嗡嗡...（老旧灯泡的电流声）',
        '呼...呼...呼...（通风管道的气流声，像沉重的呼吸）',
      ],
      random: [
        '咔——（灯光突然闪烁）',
        '嘎吱...（金属管道膨胀收缩的声音）',
        '刮擦...刮擦...（墙壁内部传来的声音）',
        '碎裂的玻璃被踩碎的声音...但你没有动...',
      ],
      entityNear: [
        '墙壁里传来低沉的呼噜声...',
        '天花板上方有什么在缓慢移动...金属被压迫的吱呀声...',
      ],
    },

    interactables: [
      {
        id: 'rusted_door',
        name: '生锈的铁门',
        description: '房间唯一的出口，厚重的铁门，表面锈迹斑斑，有四位数密码锁',
        type: 'door',
        canPickUp: false,
        triggers: [],
      },
      {
        id: 'broken_mirror',
        name: '破碎的镜子',
        description: '墙上挂着一面布满裂纹的镜子，你能看到自己扭曲的倒影',
        type: 'item',
        canPickUp: false,
        triggers: [
          {
            id: 'mirror_scare',
            type: 'trigger',
            action: () => console.log('镜子跳吓触发'),
            oneTime: true,
            triggered: false,
          },
        ],
      },
      {
        id: 'bloodied_note',
        name: '血迹笔记',
        description: '地上有一张沾满暗红色污渍的纸条',
        type: 'note',
        canPickUp: true,
        triggers: [],
      },
      {
        id: 'flashlight',
        name: '手电筒',
        description: '角落里有一个老旧的手电筒，电量未知',
        type: 'item',
        canPickUp: true,
        triggers: [],
      },
    ],

    puzzle: createInitialRoomPuzzle(),

    exits: [
      {
        direction: 'north',
        targetRoom: 'corridor',
        isLocked: true,
        requiresPuzzle: 'initial_door_code',
      },
    ],

    entitySpawnChance: 0,  // 安全房间
    isEntitySafeRoom: true,
  };
}

function createInitialRoomPuzzle(): Puzzle {
  return {
    id: 'initial_door_code',
    roomId: 'initial_room',
    type: 'combination_lock',
    difficulty: 1,

    description: `
铁门上的四位数密码锁。
数字盘已经生锈，但仍然可以转动。
你需要找到正确的四位数字。
    `.trim(),

    solution: '2847',  // 答案

    clues: [
      {
        id: 'note_clue',
        location: '血迹笔记上',
        content: `
【血迹笔记内容】

"...28号房间...第47次实验...
...他们说这是最后一次...
...我不相信...
...如果你看到这张纸条，说明我失败了...
...密码是...日期和编号...记住...
...28...47..."

（笔记到此突然中断，后面是大片血迹）
        `.trim(),
        isFound: false,
        requiresLight: false,
        hidden: false,
      },
      {
        id: 'wall_scratch',
        location: '墙面刮痕',
        content: `
【墙面刮痕】（需要手电筒照明才能看清）

在门旁边的墙上，用指甲刮出的数字：
"2...8...4...7..."

下面还有一行血字：
"不要开门"
        `.trim(),
        isFound: false,
        requiresLight: true,  // 需要手电筒
        hidden: true,
      },
    ],

    isCompleted: false,
    attempts: 0,
    failurePenalty: 'entity_alert',  // 失败会吸引实体注意
  };
}

/**
 * 走廊 - "无尽回廊"
 *
 * 参考 P.T. 的 L型走廊
 * 玩家第一次遭遇实体
 */
export function createCorridor(): Room {
  return {
    id: 'corridor',
    name: '无尽回廊',

    atmosphere: {
      description: `
你推开铁门，进入一条狭窄的走廊。

【走廊结构】
长约15米，宽度仅1.2米，极度压迫。
墙面是剥落的墙纸，露出下面腐烂的墙板和生锈的铁丝网。
墙纸上原本的花纹已经看不清，被霉菌和潮湿侵蚀成扭曲的暗色斑块。

【照明】
每隔5米有一盏老式壁灯，但只有一半在工作。
灯光昏黄且不稳定，每隔几秒就闪烁一次。
当灯光熄灭时，黑暗是完全的、吞噬一切的黑暗。

【地面】
破碎的木质地板，每走一步都发出吱呀的声响。
地板上散落着碎玻璃、生锈的钉子和不明的黑色污渍。
你注意到地上有新鲜的...脚印？不，那不是人类的脚印...

【尽头】
走廊尽头有一扇门，但门是虚掩的，里面一片漆黑。
黑暗中...好像有什么在移动...

【感觉】
一种强烈的被注视感。
你的后颈发凉，本能告诉你——你不是一个人。
      `.trim(),

      lightLevel: 20,
      wallCondition: '剥落墙纸，霉菌，腐烂墙板，铁丝网',
      floorType: '破碎木板，吱呀作响，碎玻璃和生锈钉子',
      ceiling: '低矮，水管和电线外露，滴水',
      airQuality: '霉菌 + 木材腐烂味 + 金属锈味 + 强烈的不安感',
    },

    ambientSounds: {
      base: [
        '吱呀...吱呀...（木板声，但你没有动）',
        '滴答...滴答...（水滴声，回音悠长）',
        '嗡...嗡...嗡...（电流的低频嗡鸣）',
      ],
      random: [
        '咔——（灯光熄灭）...等待3秒...咔——（灯光重新亮起，但位置好像变了？）',
        '刮擦...刮擦...（墙壁内部传来的声音，正在靠近）',
        '呼...呼...呼...（沉重的呼吸声，来自走廊尽头）',
        '关节摩擦的咔咔声...正在接近...',
      ],
      entityNear: [
        '嘎啦...嘎啦...（关节声，它在爬行）',
        '咔咔咔咔咔...（骨骼摩擦声，越来越快）',
        '一阵急促的爬行声从身后传来！',
      ],
    },

    interactables: [
      {
        id: 'corridor_painting',
        name: '扭曲的画像',
        description: '墙上挂着一幅画，画中人的眼睛...好像在盯着你',
        type: 'item',
        canPickUp: false,
        triggers: [
          {
            id: 'painting_eyes',
            type: 'trigger',
            action: () => console.log('画像眼睛跳吓'),
            oneTime: true,
            triggered: false,
          },
        ],
      },
    ],

    puzzle: undefined,  // 此房间无谜题，但有实体遭遇

    exits: [
      {
        direction: 'south',
        targetRoom: 'initial_room',
        isLocked: false,
      },
      {
        direction: 'north',
        targetRoom: 'second_room',
        isLocked: false,
      },
    ],

    entitySpawnChance: 0.7,  // 70% 概率遭遇实体
    isEntitySafeRoom: false,
  };
}

/**
 * 第二房间 - "标本室"
 *
 * 开始遭遇实体的痕迹
 * 中等难度谜题
 */
export function createSecondRoom(): Room {
  return {
    id: 'second_room',
    name: '标本室',

    atmosphere: {
      description: `
你进入一个约4x4米的房间。这里曾经是某种...实验室？

【陈列柜】
房间四周摆放着玻璃陈列柜，但大部分已经破碎。
柜子里原本陈列的东西已经不见了...或者说，逃走了。
残留的福尔马林散发着刺鼻的化学气味，混合着腐败的臭味。

【手术台】
房间中央有一张生锈的金属手术台，表面布满暗褐色的污渍。
台面上散落着生锈的手术器械——手术刀、镊子、锯子。
台边的约束带已经断裂，金属扣环上有深深的抓痕，像是...从内部挣脱的。

【墙面】
白色瓷砖墙面，但大部分瓷砖已经脱落或碎裂。
墙上有大量抓痕，深至墙体内部，排列成奇怪的图案。
在手电筒照射下，你发现这些抓痕形成了数字和符号。

【照明】
天花板上的无影灯仍在工作，但灯光带着诡异的绿色色调。
灯光照在手术台上，形成清晰的阴影——但阴影的形状...不对劲。

【气味】
福尔马林 + 血腥味 + 腐败臭味 + 化学药品的混合气味
令人作呕，头晕目眩。
      `.trim(),

      lightLevel: 35,
      wallCondition: '白色瓷砖，碎裂脱落，深度抓痕',
      floorType: '白色瓷砖地面，污渍，碎玻璃，福尔马林液体',
      ceiling: '无影灯，绿色色调，吊顶部分坍塌',
      airQuality: '福尔马林 + 血腥 + 腐败 + 化学品，极度刺鼻',
    },

    ambientSounds: {
      base: [
        '嗡嗡嗡...（无影灯的电流声）',
        '滴...滴...（福尔马林滴落声）',
        '嘎吱...嘎吱...（金属手术台被风吹动的声音，但这里没有风）',
      ],
      random: [
        '玻璃碎裂的脆响——但你没有碰到任何东西',
        '金属器械掉落的声音...叮当...叮当...',
        '约束带突然收紧的声音——咔嚓！',
        '墙壁里传出刮擦声...像指甲在抓墙...',
      ],
      entityNear: [
        '手术台下传来呼吸声...',
        '柜子后面有什么在移动...',
        '天花板的坍塌处...有红光闪烁...',
      ],
    },

    interactables: [
      {
        id: 'surgical_tools',
        name: '手术器械',
        description: '生锈的手术刀，但仍然锋利，可以作为防身武器',
        type: 'item',
        canPickUp: true,
        triggers: [],
      },
      {
        id: 'experiment_log',
        name: '实验记录',
        description: '一本沾满血迹的实验记录本',
        type: 'note',
        canPickUp: true,
        triggers: [],
      },
      {
        id: 'broken_cabinet',
        name: '破碎陈列柜',
        description: '玻璃碎裂的陈列柜，里面空荡荡的...不，还有一小袋盐',
        type: 'container',
        canPickUp: false,
        triggers: [],
      },
    ],

    puzzle: createSecondRoomPuzzle(),

    exits: [
      {
        direction: 'south',
        targetRoom: 'corridor',
        isLocked: false,
      },
      {
        direction: 'east',
        targetRoom: 'puzzle_room',
        isLocked: true,
        requiresPuzzle: 'specimen_pattern',
      },
    ],

    entitySpawnChance: 0.5,
    isEntitySafeRoom: false,
  };
}

function createSecondRoomPuzzle(): Puzzle {
  return {
    id: 'specimen_pattern',
    roomId: 'second_room',
    type: 'pattern_matching',
    difficulty: 3,

    description: `
东侧的铁门上有一个图案锁。
你需要按照正确的顺序按下五个符号按钮。
    `.trim(),

    solution: ['circle', 'triangle', 'square', 'hexagon', 'star'],

    clues: [
      {
        id: 'wall_scratches',
        location: '墙面抓痕',
        content: `
墙面的抓痕排列成图案：
○（圆形）→ △（三角）→ □（方形）→ ⬡（六边形）→ ★（星形）

每个图案下方都有数字：1、2、3、4、5
        `.trim(),
        isFound: false,
        requiresLight: true,
        hidden: false,
      },
      {
        id: 'experiment_log_entry',
        location: '实验记录本',
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
        `.trim(),
        isFound: false,
        requiresLight: false,
        hidden: false,
      },
    ],

    isCompleted: false,
    attempts: 0,
    failurePenalty: 'entity_alert',
  };
}

/**
 * 主谜题房 - "控制室"
 *
 * 解锁逃脱密码的核心房间
 * 高难度谜题
 */
export function createPuzzleRoom(): Room {
  return {
    id: 'puzzle_room',
    name: '控制室',

    atmosphere: {
      description: `
你进入了设施的控制中心。

【控制台】
房间中央是一个巨大的U型控制台，布满按钮、开关和显示屏。
大部分设备已经损坏，屏幕闪烁着白噪声和扭曲的画面。
但有一台终端仍在运行，显示着绿色的光标，等待输入。

【监控屏幕】
墙上挂着12个监控屏幕，大部分已经黑屏。
但有几个还在工作，显示着设施的不同区域。
你看到走廊、房间、楼梯...还有...
屏幕3号：它正在走廊里爬行...
屏幕7号：它站在某个房间的角落，头部缓慢转动...
屏幕11号：画面扭曲，但你看到一个巨大的阴影正在接近摄像头...
画面突然黑屏。

【环境】
房间保存相对完好，但空气中弥漫着电子设备过热的焦味。
墙面是金属板，隔音良好——这意味着外面的声音传不进来。
但也意味着...你听不到它是否正在接近。

【逃生终端】
控制台中央的终端显示：
"紧急逃生系统 - 需要8位授权码"
"授权码存储于设施档案系统"
"请查阅实验记录、人员日志和设施蓝图"
      `.trim(),

      lightLevel: 50,
      wallCondition: '金属板墙面，电缆外露，部分烧焦',
      floorType: '防静电地板，干燥清洁',
      ceiling: '吊顶，通风管道，红色应急灯',
      airQuality: '电子设备焦味 + 金属味 + 干燥空气',
    },

    ambientSounds: {
      base: [
        '嗡嗡嗡...（服务器运行声）',
        '哔...哔...哔...（终端光标闪烁声）',
        '呼...呼...（通风系统运行声）',
      ],
      random: [
        '监控屏幕突然闪烁——你看到它正在盯着摄像头',
        '终端发出警报音：嘟！嘟！嘟！',
        '通风管道里传来爬行声...',
        '监控屏幕全部黑屏...然后同时亮起——每个屏幕都显示同一个画面：它正在看着你',
      ],
      entityNear: [
        '通风口传来金属被压迫的声音...它在管道里...',
        '门外传来关节摩擦声...咔...咔...咔...',
        '监控显示：它就在门外',
      ],
    },

    interactables: [
      {
        id: 'terminal',
        name: '逃生终端',
        description: '需要输入8位授权码才能激活紧急逃生系统',
        type: 'item',
        canPickUp: false,
        triggers: [],
      },
      {
        id: 'facility_blueprint',
        name: '设施蓝图',
        description: '控制台抽屉里的蓝图，标注了设施结构和安全系统',
        type: 'note',
        canPickUp: true,
        triggers: [],
      },
      {
        id: 'personnel_log',
        name: '人员日志',
        description: '最后一位操作员留下的日志',
        type: 'note',
        canPickUp: true,
        triggers: [],
      },
    ],

    puzzle: createMainPuzzle(),

    exits: [
      {
        direction: 'west',
        targetRoom: 'second_room',
        isLocked: false,
      },
      {
        direction: 'north',
        targetRoom: 'chase_hall',
        isLocked: true,
        requiresPuzzle: 'escape_code',
      },
    ],

    entitySpawnChance: 0.3,  // 较低概率，给玩家时间解谜
    isEntitySafeRoom: false,
  };
}

function createMainPuzzle(): Puzzle {
  return {
    id: 'escape_code',
    roomId: 'puzzle_room',
    type: 'hidden_code',
    difficulty: 5,

    description: `
你需要找到8位数字授权码。
线索分散在设施的各个文件中。
    `.trim(),

    solution: '28471013',

    clues: [
      {
        id: 'blueprint_clue',
        location: '设施蓝图',
        content: `
【设施蓝图标注】

建筑日期：2013年10月
主实验室编号：B-28
紧急通道编号：47
安全等级：Level-10

蓝图上有手写备注：
"密码 = 实验室编号 + 紧急通道 + 安全等级 + 建筑年份后两位"
"28 + 47 + 10 + 13 = ????????"
        `.trim(),
        isFound: false,
        requiresLight: false,
        hidden: false,
      },
      {
        id: 'personnel_log_clue',
        location: '人员日志',
        content: `
【最后的日志 - 操作员 Alex Chen】

"...实验失败了。标本28-47已经逃脱约束。
它杀死了Dr. Morrison，Dr. Lee，还有保安队。
我是唯一幸存者。

我设置了紧急逃生系统，密码是设施的核心信息组合：
建筑编号(28) + 通道编号(47) + 安全级别(10) + 年份(13)

如果你看到这条消息，输入：28471013

快逃。它在寻找我...
我听到它在门外...
关节的咔咔声...
它知道我在这里...

天啊，它在看我——"

（日志到此结束，键盘上有血迹）
        `.trim(),
        isFound: false,
        requiresLight: false,
        hidden: false,
      },
    ],

    isCompleted: false,
    attempts: 0,
    failurePenalty: 'entity_alert',
  };
}

/**
 * 追逐走廊 - "逃亡之路"
 *
 * 强制追逐段落
 * 心跳系统快速上升
 */
export function createChaseHall(): Room {
  return {
    id: 'chase_hall',
    name: '逃亡之路',

    atmosphere: {
      description: `
你输入密码后，北侧的门猛然打开。

这是一条笔直的长走廊，长达30米，尽头是紧急出口的绿色指示灯。

但当你踏入走廊的瞬间——
身后传来震耳欲聋的金属撞击声！！

【咔！！！】

你回头——
它正站在控制室门口。
身高超过两米，脊椎弯曲成不自然的弓形。
头部缓慢转向你。
眼眶深处，红光开始燃烧。

它发出声音：
"嘎啦啦——！！！"

【它开始冲刺】

【跑！！！】
      `.trim(),

      lightLevel: 40,
      wallCondition: '混凝土墙面，管道外露，沿途有紧急照明',
      floorType: '混凝土地面，笔直，无障碍',
      ceiling: '高天花板，管道和电缆，红色警报灯闪烁',
      airQuality: '肾上腺素飙升，你只能听到自己的心跳和它的脚步声',
    },

    ambientSounds: {
      base: [
        '你的心跳声：咚！咚！咚！咚！',
        '你的呼吸声：呼！呼！呼！',
        '你的脚步声：啪！啪！啪！啪！',
      ],
      random: [],
      entityNear: [
        '咔咔咔咔咔！！！（它的关节声，极度快速）',
        '嘎啦啦——！！！（它的嘶吼声，正在接近）',
        '重物撞击地面的声音——砰！砰！砰！——它的脚步！',
        '刮擦声——它的指甲刮过墙面！',
      ],
    },

    interactables: [],

    puzzle: undefined,

    exits: [
      {
        direction: 'south',
        targetRoom: 'puzzle_room',
        isLocked: true,  // 无法回头
      },
      {
        direction: 'north',
        targetRoom: 'final_room',
        isLocked: false,
      },
    ],

    entitySpawnChance: 1.0,  // 100% 实体追逐
    isEntitySafeRoom: false,
  };
}

/**
 * 最终房间 - "抉择室"
 *
 * 终局选择，决定结局
 */
export function createFinalRoom(): Room {
  return {
    id: 'final_room',
    name: '抉择室',

    atmosphere: {
      description: `
你冲进最后的房间，身后的门自动关闭并上锁。

【咔嚓！】

门外传来猛烈的撞击声——砰！砰！砰！
它在试图破门而入。
门板开始变形，裂纹出现。

你环视房间：

【房间布局】
这是紧急避难室，约5x5米，水泥墙面，厚重的金属门。
房间中央有三个控制面板，每个面板上都有一个按钮。

【面板1 - 绿色按钮】
标签：紧急逃生
说明：立即开启外部出口，你可以逃离这里。
警告：此操作会关闭设施封锁系统。

【面板2 - 黄色按钮】
标签：部分封锁
说明：你可以逃脱，但实体会被困在设施内部。
警告：设施将进入半锁定状态，10小时后自动解除。

【面板3 - 红色按钮】
标签：完全销毁
说明：启动设施自毁系统，彻底摧毁实体和整个设施。
警告：你有60秒时间逃离，失败则与设施一同毁灭。

【身后的门】
砰！！！
裂纹扩大。
你看到它的手指从裂缝中伸进来，细长、破碎、颤抖。

【你必须选择】
      `.trim(),

      lightLevel: 60,
      wallCondition: '强化混凝土，无窗，密封',
      floorType: '钢板地面，防震设计',
      ceiling: '低矮，红色警报灯不停闪烁',
      airQuality: '循环空气，金属味，你的汗水和恐惧',
    },

    ambientSounds: {
      base: [
        '你的心跳：咚！咚！咚！（极度快速）',
        '警报声：嘟——嘟——嘟——',
        '门外的撞击声：砰！砰！砰！',
      ],
      random: [
        '门板开裂的声音——咔！',
        '它的嘶吼声从门缝传来——嘎啦啦！！',
        '金属扭曲变形的声音——嘎吱！',
      ],
      entityNear: [
        '它在门外，疯狂攻击！',
        '它的手指伸进来，在空中摸索！',
        '门快要破了！！',
      ],
    },

    interactables: [
      {
        id: 'panel_green',
        name: '绿色面板 - 紧急逃生',
        description: '立即逃脱，但实体可能会逃出设施',
        type: 'switch',
        canPickUp: false,
        triggers: [],
      },
      {
        id: 'panel_yellow',
        name: '黄色面板 - 部分封锁',
        description: '逃脱并困住实体，但不是永久的',
        type: 'switch',
        canPickUp: false,
        triggers: [],
      },
      {
        id: 'panel_red',
        name: '红色面板 - 完全销毁',
        description: '彻底摧毁一切，但你必须在60秒内逃离',
        type: 'switch',
        canPickUp: false,
        triggers: [],
      },
    ],

    puzzle: undefined,

    exits: [
      {
        direction: 'south',
        targetRoom: 'chase_hall',
        isLocked: true,
      },
    ],

    entitySpawnChance: 1.0,
    isEntitySafeRoom: false,
  };
}

/**
 * 获取所有房间
 */
export function getAllRooms(): Map<RoomId, Room> {
  const rooms = new Map<RoomId, Room>();

  rooms.set('initial_room', createInitialRoom());
  rooms.set('corridor', createCorridor());
  rooms.set('second_room', createSecondRoom());
  rooms.set('puzzle_room', createPuzzleRoom());
  rooms.set('chase_hall', createChaseHall());
  rooms.set('final_room', createFinalRoom());

  return rooms;
}
