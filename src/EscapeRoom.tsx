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
    { id: 'safe', name: 'Safe Password', solved: false, required: true },
    { id: 'clock', name: 'Clock Puzzle', solved: false, required: true },
    { id: 'painting', name: 'Painting Mystery', solved: false, required: true },
    { id: 'door', name: 'Final Password Door', solved: false, required: true },
  ]);

  const [objects, setObjects] = useState<GameObject[]>([
    {
      id: 'desk',
      name: 'Desk',
      x: 15,
      y: 60,
      width: 20,
      height: 25,
      examined: false,
      clue: 'You found a drawer containing a key and a note: "Time will reveal everything"',
      givesItem: { id: 'key1', name: 'Bronze Key', description: 'An ancient bronze key', icon: '🔑' }
    },
    {
      id: 'safe',
      name: 'Safe',
      x: 70,
      y: 40,
      width: 15,
      height: 20,
      examined: false,
      puzzle: 'safe',
      clue: 'The safe requires a 4-digit password. The clock on the wall seems unusual...'
    },
    {
      id: 'clock',
      name: 'Old Clock',
      x: 45,
      y: 15,
      width: 10,
      height: 15,
      examined: false,
      clue: 'The clock stopped at 3:27. Strangely, the hour and minute hands seem to be swapped...',
      puzzle: 'clock'
    },
    {
      id: 'painting',
      name: 'Mysterious Painting',
      x: 20,
      y: 20,
      width: 15,
      height: 20,
      examined: false,
      requiresItem: 'key1',
      clue: 'A mechanism is hidden behind the painting! You discovered a sequence of numbers: 7-3-9-1',
      givesItem: { id: 'code', name: 'Code Note', description: 'Written: 7391', icon: '📄' }
    },
    {
      id: 'bookshelf',
      name: 'Bookshelf',
      x: 5,
      y: 30,
      width: 12,
      height: 40,
      examined: false,
      clue: 'You browsed through the books and found a diary. The last page reads: "The door password is the sum of all puzzle answers"'
    },
    {
      id: 'door',
      name: 'Exit Door',
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
        setExamineText(obj.clue || `You carefully examined the ${obj.name}.`);

        if (obj.givesItem && !inventory.find(item => item.id === obj.givesItem!.id)) {
          setInventory([...inventory, obj.givesItem]);
          showMessage(`Item obtained: ${obj.givesItem.name}`);
        }
        setSelectedItem(null);
      } else {
        showMessage('This item cannot be used here');
        setSelectedItem(null);
      }
      return;
    }

    // Normal object interaction
    if (obj.requiresItem && !inventory.find(item => item.id === obj.requiresItem)) {
      const requiredItem = inventory.find(i => i.id === obj.requiresItem);
      showMessage(`You need the ${requiredItem?.name || 'an item'} to examine this. Try selecting an item first.`);
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

    setExamineText(obj.clue || `You carefully examined the ${obj.name}, but found nothing special.`);

    if (obj.givesItem && !inventory.find(item => item.id === obj.givesItem!.id)) {
      setInventory([...inventory, obj.givesItem]);
      showMessage(`Item obtained: ${obj.givesItem.name}`);
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
      showMessage('✓ Puzzle solved!');
      setShowPuzzle(null);
      setPuzzleInput('');

      // Special handling for safe
      if (puzzleId === 'safe') {
        const flashlight: Item = {
          id: 'flashlight',
          name: 'Flashlight',
          description: 'Can illuminate dark corners',
          icon: '🔦'
        };
        setInventory([...inventory, flashlight]);
      }
    } else {
      showMessage('✗ Wrong password!');
      setPuzzleInput('');
    }
  };

  const useHint = () => {
    if (hints <= 0) {
      showMessage('No hints left!');
      return;
    }

    setHints(hints - 1);
    const unsolvedPuzzle = puzzles.find(p => !p.solved);

    const hintMessages: { [key: string]: string } = {
      'safe': 'Hint: Check behind the painting...',
      'clock': 'Hint: The time shown on the clock is the answer',
      'painting': 'Hint: The bronze key might be useful',
      'door': 'Hint: The diary on the bookshelf gives a clue'
    };

    if (unsolvedPuzzle) {
      showMessage(hintMessages[unsolvedPuzzle.id] || 'Carefully observe every detail in the room');
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
        title: 'Safe',
        description: 'Enter 4-digit password',
        placeholder: '____'
      },
      'clock': {
        title: 'Clock Puzzle',
        description: 'What secret does the clock hide? Enter the number you found',
        placeholder: '___'
      },
      'door': {
        title: 'Exit Door',
        description: 'The final password door. Enter the sum of all answers',
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
              Confirm
            </button>
            <button onClick={() => {
              setShowPuzzle(null);
              setPuzzleInput('');
            }}>
              Cancel
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
          <h1 className="glitch" data-text="ESCAPE ROOM">ESCAPE ROOM</h1>
          <p className="intro-text">
            You wake up to find yourself trapped in a strange room...<br />
            The room is filled with puzzles and clues<br />
            You only have 60 minutes to escape<br />
            <br />
            Time is ticking...<br />
            Can you escape?
          </p>
          <button className="start-button" onClick={startGame}>
            START GAME
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'won') {
    return (
      <div className="escape-room game-over won">
        <div className="game-over-content">
          <h1>🎉 Congratulations!</h1>
          <p>You successfully escaped the room!</p>
          <p>Time: {formatTime(3600 - timeLeft)}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      </div>
    );
  }

  if (gameState === 'lost') {
    return (
      <div className="escape-room game-over lost">
        <div className="game-over-content">
          <h1>⏰ Time's Up!</h1>
          <p>You failed to escape in time...</p>
          <button onClick={startGame}>Retry</button>
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
          💡 Hints: {hints}
          <button onClick={useHint} disabled={hints === 0}>Use Hint</button>
        </div>
        <div className="progress">
          Progress: {puzzles.filter(p => p.solved).length}/{puzzles.length}
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
            <button onClick={() => setExamineText('')}>Close</button>
          </div>
        )}
      </div>

      {/* Inventory */}
      <div className="inventory">
        <h3>Inventory</h3>
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
            <p className="empty-inventory">Empty</p>
          )}
        </div>
        {selectedItem && (
          <p className="use-hint">Click an object to use this item</p>
        )}
      </div>

      {renderPuzzleModal()}
    </div>
  );
};

export default EscapeRoom;
