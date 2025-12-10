/**
 * 恐怖游戏主组件
 *
 * 集成所有系统：
 * - 游戏状态管理
 * - 实体AI
 * - 跳吓系统
 * - 恐怖渲染
 * - UI界面
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { GameStateManager } from '../game/GameStateManager';
import { HorrorRenderer } from '../game/HorrorRenderer';
import { HorrorGameState, RoomId } from '../types/horror';
import './HorrorGame.css';

export default function HorrorGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const gameManagerRef = useRef<GameStateManager | null>(null);
  const rendererRef = useRef<HorrorRenderer | null>(null);
  const animationFrameRef = useRef<number>(0);

  const [gameState, setGameState] = useState<HorrorGameState | null>(null);
  const [narrative, setNarrative] = useState<string[]>([]);
  const [showControls, setShowControls] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /**
   * 初始化游戏
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const manager = new GameStateManager();
    const renderer = new HorrorRenderer(canvas, {
      globalDarkness: 70,
      fogIntensity: 50,
      noiseLevel: 40,
      decayLevel: 80,
    });

    gameManagerRef.current = manager;
    rendererRef.current = renderer;

    // 初始化游戏管理器
    manager.initialize(canvas, {
      onStateChange: (state) => {
        setGameState(state);
      },
      onRoomChange: (roomId) => {
        addNarrative(`\n=== 进入房间：${roomId} ===\n`);
      },
      onPlayerDamage: (hp, heartRate) => {
        addNarrative(`【受到伤害！HP: ${hp}, 心率: ${heartRate}】`);
      },
      onGameEnd: (ending) => {
        addNarrative(`\n\n${ending.cinematicText}\n\n游戏结束。`);
      },
    });

    // 启动摄像头（可选）
    initCamera();

    // 启动渲染循环
    startRenderLoop();

    // 添加欢迎文本
    addNarrative(`
╔════════════════════════════════════════╗
║                                        ║
║      【 密 室 逃 脱 - 破 碎 者 】      ║
║                                        ║
║         极度压迫 · 黑暗写实             ║
║                                        ║
╚════════════════════════════════════════╝

按 [开始游戏] 进入...
    `);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      manager.destroy();
    };
  }, []);

  /**
   * 初始化摄像头
   */
  const initCamera = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });

      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (err) {
      console.error('Camera access failed:', err);
    }
  };

  /**
   * 渲染循环
   */
  const startRenderLoop = () => {
    const render = () => {
      if (!canvasRef.current || !rendererRef.current || !gameState) {
        animationFrameRef.current = requestAnimationFrame(render);
        return;
      }

      const canvas = canvasRef.current;
      const renderer = rendererRef.current;
      const room = gameState.rooms.get(gameState.currentRoom);

      // 渲染基础氛围
      renderer.render(undefined, room?.atmosphere.lightLevel || 25);

      // 渲染手电筒
      if (gameState.playerStats.hasFlashlight && gameState.playerStats.batteryLevel > 0) {
        renderer.renderFlashlight(
          mousePos.x,
          mousePos.y,
          gameState.playerStats.batteryLevel
        );
      }

      // 渲染实体眼光
      if (
        gameState.entity.state.currentRoom === gameState.currentRoom &&
        gameState.entity.state.isActive
      ) {
        const eyeX = canvas.width / 2 + (Math.random() - 0.5) * 100;
        const eyeY = canvas.height / 3;
        const intensity = Math.random() * 0.5 + 0.5;
        renderer.renderEntityEyes(eyeX, eyeY, intensity);
      }

      // 渲染低理智效果
      if (gameState.playerStats.sanity < 50) {
        renderer.renderInsanityEffects(gameState.playerStats.sanity);
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  /**
   * 添加叙述文本
   */
  const addNarrative = useCallback((text: string) => {
    setNarrative((prev) => [...prev, text]);
  }, []);

  /**
   * 开始游戏
   */
  const handleStartGame = () => {
    if (!gameManagerRef.current) return;

    gameManagerRef.current.startGame();
    const state = gameManagerRef.current.getState();
    setGameState(state);

    const room = state.rooms.get(state.currentRoom);
    if (room) {
      addNarrative(room.atmosphere.description);
    }
  };

  /**
   * 切换房间
   */
  const handleRoomChange = (direction: 'north' | 'south' | 'east' | 'west') => {
    if (!gameManagerRef.current || !gameState) return;

    const room = gameState.rooms.get(gameState.currentRoom);
    if (!room) return;

    const exit = room.exits.find((e) => e.direction === direction);
    if (!exit || !exit.targetRoom) {
      addNarrative(`${direction}方向没有出口。`);
      return;
    }

    gameManagerRef.current.changeRoom(exit.targetRoom);
  };

  /**
   * 解谜
   */
  const handleSolvePuzzle = () => {
    if (!gameManagerRef.current || !gameState) return;

    const room = gameState.rooms.get(gameState.currentRoom);
    if (!room || !room.puzzle) {
      addNarrative('这个房间没有谜题。');
      return;
    }

    // 简单演示 - 显示谜题信息
    addNarrative(`\n【谜题】\n${room.puzzle.description}\n`);
    room.puzzle.clues.forEach((clue) => {
      if (!clue.hidden) {
        addNarrative(`线索：${clue.content}\n`);
      }
    });

    // 提示玩家输入答案
    const answer = prompt(`请输入答案（谜题ID: ${room.puzzle.id}）:`);
    if (answer) {
      const success = gameManagerRef.current.solvePuzzle(room.puzzle.id, answer);
      if (success) {
        addNarrative('✓ 谜题解决！');
      } else {
        addNarrative('✗ 答案错误...');
      }
    }
  };

  /**
   * 拾取物品
   */
  const handlePickUpItem = (itemId: string) => {
    if (!gameManagerRef.current) return;
    gameManagerRef.current.pickUpItem(itemId);
  };

  /**
   * 使用物品
   */
  const handleUseItem = (itemId: string) => {
    if (!gameManagerRef.current) return;
    gameManagerRef.current.useItem(itemId);
  };

  /**
   * 鼠标移动 - 手电筒跟随
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="horror-game">
      {/* 隐藏的视频元素 */}
      <video ref={videoRef} style={{ display: 'none' }} />

      {/* 主画布 */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className="horror-canvas"
        onMouseMove={handleMouseMove}
      />

      {/* UI叠加层 */}
      <div className="horror-ui">
        {/* 状态栏 */}
        {gameState && (
          <div className="status-bar">
            <div className="stat">
              <span className="stat-label">HP</span>
              <div className="stat-bar">
                <div
                  className="stat-fill hp-fill"
                  style={{ width: `${gameState.playerStats.hp}%` }}
                />
              </div>
              <span className="stat-value">{gameState.playerStats.hp}</span>
            </div>

            <div className="stat">
              <span className="stat-label">心率</span>
              <div className="heartbeat">
                <span className="heartbeat-icon">♥</span>
                <span className="heartbeat-value">
                  {Math.floor(gameState.playerStats.heartRate)} BPM
                </span>
              </div>
            </div>

            <div className="stat">
              <span className="stat-label">理智</span>
              <div className="stat-bar">
                <div
                  className="stat-fill sanity-fill"
                  style={{ width: `${gameState.playerStats.sanity}%` }}
                />
              </div>
              <span className="stat-value">{gameState.playerStats.sanity}</span>
            </div>

            {gameState.playerStats.hasFlashlight && (
              <div className="stat">
                <span className="stat-label">电量</span>
                <div className="stat-bar">
                  <div
                    className="stat-fill battery-fill"
                    style={{ width: `${gameState.playerStats.batteryLevel}%` }}
                  />
                </div>
                <span className="stat-value">
                  {Math.floor(gameState.playerStats.batteryLevel)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* 叙述文本区域 */}
        <div className="narrative-panel">
          <div className="narrative-content">
            {narrative.map((text, index) => (
              <pre key={index} className="narrative-text">
                {text}
              </pre>
            ))}
          </div>
        </div>

        {/* 控制面板 */}
        {showControls && (
          <div className="controls-panel">
            <button className="control-toggle" onClick={() => setShowControls(false)}>
              隐藏控制
            </button>

            {!gameState || gameState.gameState === 'intro' ? (
              <button className="btn-primary" onClick={handleStartGame}>
                开始游戏
              </button>
            ) : (
              <>
                <div className="control-section">
                  <h3>移动</h3>
                  <div className="direction-buttons">
                    <button onClick={() => handleRoomChange('north')}>↑ 北</button>
                    <button onClick={() => handleRoomChange('south')}>↓ 南</button>
                    <button onClick={() => handleRoomChange('east')}>→ 东</button>
                    <button onClick={() => handleRoomChange('west')}>← 西</button>
                  </div>
                </div>

                <div className="control-section">
                  <h3>动作</h3>
                  <button onClick={handleSolvePuzzle}>解谜</button>
                  <button onClick={() => handlePickUpItem('flashlight')}>
                    拾取手电筒
                  </button>
                  <button onClick={() => handleUseItem('盐')}>使用盐</button>
                </div>

                {gameState && (
                  <div className="control-section">
                    <h3>物品栏</h3>
                    <div className="inventory">
                      {gameState.inventory.length === 0 ? (
                        <span className="empty-inventory">无物品</span>
                      ) : (
                        gameState.inventory.map((item) => (
                          <button
                            key={item}
                            className="inventory-item"
                            onClick={() => handleUseItem(item)}
                          >
                            {item}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!showControls && (
          <button
            className="control-toggle-minimized"
            onClick={() => setShowControls(true)}
          >
            显示控制
          </button>
        )}
      </div>
    </div>
  );
}
