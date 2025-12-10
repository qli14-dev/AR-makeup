import React, { useState, useEffect } from 'react';
import './EscapeRoom.css';

interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Puzzle {
  id: string;
  name: string;
  solved: boolean;
  required: boolean;
}

interface GameObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  examined: boolean;
  clue?: string;
  requiresItem?: string;
  givesItem?: Item;
  puzzle?: string;
}

const EscapeRoom: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'won' | 'lost'>('intro');
  const [inventory, setInventory] = useState<Item[]>([]);
  const [hints, setHints] = useState(3);
  const [message, setMessage] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [examineText, setExamineText] = useState('');
  const [showPuzzle, setShowPuzzle] = useState<string | null>(null);
  const [puzzleInput, setPuzzleInput] = useState('');

  const [puzzles, setPuzzles] = useState<Puzzle[]>([
    { id: 'safe', name: '保险箱密码', solved: false, required: true },
    { id: 'clock', name: '时钟谜题', solved: false, required: true },
    { id: 'painting', name: '画作之谜', solved: false, required: true },
    { id: 'door', name: '最终密码门', solved: false, required: true },
  ]);

  const [objects, setObjects] = useState<GameObject[]>([
    {
      id: 'desk',
      name: '书桌',
      x: 15,
      y: 60,
      width: 20,
      height: 25,
      examined: false,
      clue: '你发现了一个抽屉，里面有一把钥匙和一张纸条："时间会揭示一切"',
      givesItem: { id: 'key1', name: '铜钥匙', description: '一把古老的铜钥匙', icon: '🔑' }
    },
    {
      id: 'safe',
      name: '保险箱',
      x: 70,
      y: 40,
      width: 15,
      height: 20,
      examined: false,
      puzzle: 'safe',
      clue: '保险箱需要4位数字密码。墙上的时钟似乎有些异常...'
    },
    {
      id: 'clock',
      name: '古老的挂钟',
      x: 45,
      y: 15,
      width: 10,
      height: 15,
      examined: false,
      clue: '时钟停在了3:27。奇怪的是，时针和分针的位置似乎被人调换了...',
      puzzle: 'clock'
    },
    {
      id: 'painting',
      name: '神秘画作',
      x: 20,
      y: 20,
      width: 15,
      height: 20,
      examined: false,
      requiresItem: 'key1',
      clue: '画作背后藏着一个机关！你发现了一串数字：7-3-9-1',
      givesItem: { id: 'code', name: '密码纸条', description: '写着：7391', icon: '📄' }
    },
    {
      id: 'bookshelf',
      name: '书架',
      x: 5,
      y: 30,
      width: 12,
      height: 40,
      examined: false,
      clue: '你翻阅了书架上的书籍，发现一本日记本。最后一页写着："门的密码是所有谜题答案之和"'
    },
    {
      id: 'door',
      name: '出口大门',
      x: 85,
      y: 55,
      width: 12,
      height: 30,
      examined: false,
      puzzle: 'door'
    }
  ]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState('lost');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Check win condition
  useEffect(() => {
    if (gameState === 'playing' && puzzles.every(p => p.solved)) {
      setGameState('won');
    }
  }, [puzzles, gameState]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleObjectClick = (obj: GameObject) => {
    // If an item is selected, try to use it on this object
    if (selectedItem) {
      const objToUse = objects.find(o => o.id === obj.id);
      if (objToUse?.requiresItem === selectedItem) {
        // Item can be used on this object
        const updatedObjects = objects.map(o =>
          o.id === obj.id ? { ...o, examined: true } : o
        );
        setObjects(updatedObjects);
        setExamineText(obj.clue || `你仔细检查了${obj.name}。`);

        if (obj.givesItem && !inventory.find(item => item.id === obj.givesItem!.id)) {
          setInventory([...inventory, obj.givesItem]);
          showMessage(`获得物品: ${obj.givesItem.name}`);
        }
        setSelectedItem(null);
      } else {
        showMessage('这个物品无法在这里使用');
        setSelectedItem(null);
      }
      return;
    }

    // Normal object interaction
    if (obj.requiresItem && !inventory.find(item => item.id === obj.requiresItem)) {
      const requiredItem = inventory.find(i => i.id === obj.requiresItem);
      showMessage(`你需要${requiredItem?.name || '某个物品'}才能检查这个物品。尝试选中物品后再点击。`);
      return;
    }

    if (obj.puzzle) {
      setShowPuzzle(obj.puzzle);
      return;
    }

    const updatedObjects = objects.map(o =>
      o.id === obj.id ? { ...o, examined: true } : o
    );
    setObjects(updatedObjects);

    setExamineText(obj.clue || `你仔细检查了${obj.name}，但没有发现特别之处。`);

    if (obj.givesItem && !inventory.find(item => item.id === obj.givesItem!.id)) {
      setInventory([...inventory, obj.givesItem]);
      showMessage(`获得物品: ${obj.givesItem.name}`);
    }
  };

  const handlePuzzleSubmit = (puzzleId: string, answer: string) => {
    const puzzleAnswers: { [key: string]: string } = {
      'safe': '7391', // From painting
      'clock': '327', // Clock time
      'door': '8045' // Sum: 7391 + 327 + 327 = 8045 (creative answer)
    };

    if (answer === puzzleAnswers[puzzleId]) {
      setPuzzles(puzzles.map(p =>
        p.id === puzzleId ? { ...p, solved: true } : p
      ));
      showMessage('✓ 谜题解开了！');
      setShowPuzzle(null);
      setPuzzleInput('');

      // Special handling for safe
      if (puzzleId === 'safe') {
        const flashlight: Item = {
          id: 'flashlight',
          name: '手电筒',
          description: '可以照亮黑暗的角落',
          icon: '🔦'
        };
        setInventory([...inventory, flashlight]);
      }
    } else {
      showMessage('✗ 密码错误！');
      setPuzzleInput('');
    }
  };

  const useHint = () => {
    if (hints <= 0) {
      showMessage('没有提示次数了！');
      return;
    }

    setHints(hints - 1);
    const unsolvedPuzzle = puzzles.find(p => !p.solved);

    const hintMessages: { [key: string]: string } = {
      'safe': '提示：仔细检查画作背后...',
      'clock': '提示：时钟显示的时间就是答案',
      'painting': '提示：用铜钥匙可能有用',
      'door': '提示：书架上的日记给出了线索'
    };

    if (unsolvedPuzzle) {
      showMessage(hintMessages[unsolvedPuzzle.id] || '仔细观察房间里的每一个细节');
    }
  };

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(3600);
    setInventory([]);
    setHints(3);
    setPuzzles(puzzles.map(p => ({ ...p, solved: false })));
    setObjects(objects.map(o => ({ ...o, examined: false })));
  };

  const renderPuzzleModal = () => {
    if (!showPuzzle) return null;

    const puzzleContent: { [key: string]: { title: string; description: string; placeholder: string } } = {
      'safe': {
        title: '保险箱',
        description: '请输入4位数字密码',
        placeholder: '____'
      },
      'clock': {
        title: '时钟谜题',
        description: '时钟隐藏着什么秘密？输入你发现的数字',
        placeholder: '___'
      },
      'door': {
        title: '出口大门',
        description: '最终的密码门。输入所有答案之和',
        placeholder: '____'
      }
    };

    const content = puzzleContent[showPuzzle];

    return (
      <div className="puzzle-modal">
        <div className="puzzle-content">
          <h2>{content.title}</h2>
          <p>{content.description}</p>
          <input
            type="text"
            value={puzzleInput}
            onChange={(e) => setPuzzleInput(e.target.value)}
            placeholder={content.placeholder}
            maxLength={4}
            autoFocus
          />
          <div className="puzzle-buttons">
            <button onClick={() => handlePuzzleSubmit(showPuzzle, puzzleInput)}>
              确认
            </button>
            <button onClick={() => {
              setShowPuzzle(null);
              setPuzzleInput('');
            }}>
              取消
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (gameState === 'intro') {
    return (
      <div className="escape-room intro">
        <div className="intro-content">
          <h1 className="glitch" data-text="密室逃脱">密室逃脱</h1>
          <p className="intro-text">
            你醒来发现自己被困在一个陌生的房间里...<br />
            房间里充满了谜题和线索<br />
            你只有60分钟的时间逃出去<br />
            <br />
            时间在流逝...<br />
            你能逃出去吗？
          </p>
          <button className="start-button" onClick={startGame}>
            开始游戏
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="escape-room game-over won">
        <div className="game-over-content">
          <h1>🎉 恭喜逃脱！</h1>
          <p>你成功逃出了密室！</p>
          <p>用时: {formatTime(3600 - timeLeft)}</p>
          <button onClick={startGame}>再玩一次</button>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="escape-room game-over lost">
        <div className="game-over-content">
          <h1>⏰ 时间到！</h1>
          <p>你未能在规定时间内逃出...</p>
          <button onClick={startGame}>重新开始</button>
        </div>
      </div>
    );
  }

  return (
    <div className="escape-room playing">
      {/* Status Bar */}
      <div className="status-bar">
        <div className={`timer ${timeLeft < 300 ? 'warning' : ''} ${timeLeft < 60 ? 'critical' : ''}`}>
          ⏱️ {formatTime(timeLeft)}
        </div>
        <div className="hints">
          💡 提示: {hints}
          <button onClick={useHint} disabled={hints === 0}>使用提示</button>
        </div>
        <div className="progress">
          进度: {puzzles.filter(p => p.solved).length}/{puzzles.length}
        </div>
      </div>

      {/* Message Display */}
      {message && <div className="message-display">{message}</div>}

      {/* Room View */}
      <div className="room-container">
        <svg className="room-view" viewBox="0 0 100 100">
          {/* Room background */}
          <rect x="0" y="0" width="100" height="100" fill="#1a1a1a" />

          {/* Floor */}
          <rect x="0" y="85" width="100" height="15" fill="#0d0d0d" />

          {/* Objects */}
          {objects.map(obj => (
            <g
              key={obj.id}
              onClick={() => handleObjectClick(obj)}
              className={`game-object ${obj.examined ? 'examined' : ''} ${selectedItem ? 'use-mode' : ''}`}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={obj.x}
                y={obj.y}
                width={obj.width}
                height={obj.height}
                fill={obj.examined ? '#444' : '#333'}
                stroke={obj.examined ? '#666' : '#555'}
                strokeWidth="0.5"
              />
              <text
                x={obj.x + obj.width / 2}
                y={obj.y + obj.height / 2}
                fontSize="2"
                fill="#aaa"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {obj.name}
              </text>
              {puzzles.find(p => p.id === obj.id)?.solved && (
                <text
                  x={obj.x + obj.width / 2}
                  y={obj.y - 2}
                  fontSize="4"
                  textAnchor="middle"
                >
                  ✓
                </text>
              )}
            </g>
          ))}
        </svg>

        {examineText && (
          <div className="examine-panel">
            <p>{examineText}</p>
            <button onClick={() => setExamineText('')}>关闭</button>
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="inventory">
        <h3>物品栏</h3>
        <div className="inventory-items">
          {inventory.map(item => (
            <div
              key={item.id}
              className={`inventory-item ${selectedItem === item.id ? 'selected' : ''}`}
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
              title={item.description}
            >
              <span className="item-icon">{item.icon}</span>
              <span className="item-name">{item.name}</span>
            </div>
          ))}
          {inventory.length === 0 && (
            <p className="empty-inventory">空</p>
          )}
        </div>
        {selectedItem && (
          <p className="use-hint">点击物品使用它</p>
        )}
      </div>

      {renderPuzzleModal()}
    </div>
  );
};

export default EscapeRoom;
