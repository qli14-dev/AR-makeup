import React, { useState } from 'react';
import { Puzzle } from '../../types/game';
import './PuzzleModal.css';

interface PuzzleModalProps {
  puzzleId: string;
  puzzle: Puzzle;
  onSolve: (answer: string) => void;
  onClose: () => void;
}

const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzle, onSolve, onClose }) => {
  const [input, setInput] = useState('');
  const [symbolSequence, setSymbolSequence] = useState<string[]>([]);

  const handleSubmit = () => {
    if (puzzle.type === 'symbols') {
      onSolve(symbolSequence.join(','));
    } else if (puzzle.type === 'clock_time') {
      onSolve(input);
    } else {
      onSolve(input);
    }
  };

  const renderCodePuzzle = () => {
    return (
      <div className="puzzle-content code-puzzle">
        <h2>4-Digit Combination Lock</h2>
        <p className="puzzle-description">Enter the 4-digit code to unlock the closet.</p>

        <div className="code-display">
          {input.split('').map((digit, i) => (
            <div key={i} className="code-digit">{digit || '_'}</div>
          ))}
          {[...Array(Math.max(0, 4 - input.length))].map((_, i) => (
            <div key={`empty-${i}`} className="code-digit">_</div>
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((num) => (
            <button
              key={num}
              className="keypad-button"
              onClick={() => {
                if (input.length < 4) {
                  setInput(input + num);
                }
              }}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="puzzle-actions">
          <button className="puzzle-button clear" onClick={() => setInput('')}>Clear</button>
          <button className="puzzle-button submit" onClick={handleSubmit} disabled={input.length !== 4}>
            Enter
          </button>
        </div>

        <div className="attempt-counter">
          Attempts: {puzzle.attempts} / {puzzle.maxAttempts || '∞'}
        </div>
      </div>
    );
  };

  const renderSymbolPuzzle = () => {
    const symbols = [
      { id: 'triangle', icon: '△', name: 'Triangle' },
      { id: 'half_moon', icon: '◐', name: 'Half Moon' },
      { id: 'prison', icon: '⚷', name: 'Prison' },
      { id: 'cure', icon: '☿', name: 'Cure' },
      { id: 'hourglass', icon: '⌛', name: 'Hourglass' },
    ];

    return (
      <div className="puzzle-content symbol-puzzle">
        <h2>Symbol Lock</h2>
        <p className="puzzle-description">Enter the correct sequence of 5 symbols.</p>

        <div className="symbol-sequence-display">
          {symbolSequence.map((symbolId, i) => {
            const symbol = symbols.find(s => s.id === symbolId);
            return (
              <div key={i} className="symbol-slot filled">
                {symbol?.icon}
              </div>
            );
          })}
          {[...Array(Math.max(0, 5 - symbolSequence.length))].map((_, i) => (
            <div key={`empty-${i}`} className="symbol-slot empty">?</div>
          ))}
        </div>

        <div className="symbol-buttons">
          {symbols.map((symbol) => (
            <button
              key={symbol.id}
              className="symbol-button"
              onClick={() => {
                if (symbolSequence.length < 5) {
                  setSymbolSequence([...symbolSequence, symbol.id]);
                }
              }}
              title={symbol.name}
            >
              {symbol.icon}
            </button>
          ))}
        </div>

        <div className="puzzle-actions">
          <button className="puzzle-button clear" onClick={() => setSymbolSequence([])}>
            Clear
          </button>
          <button className="puzzle-button submit" onClick={handleSubmit} disabled={symbolSequence.length !== 5}>
            Submit
          </button>
        </div>

        <div className="attempt-counter">
          Attempts: {puzzle.attempts} / {puzzle.maxAttempts || '∞'}
        </div>
      </div>
    );
  };

  const renderClockPuzzle = () => {
    const [hours, setHours] = useState(3);
    const [minutes, setMinutes] = useState(47);

    return (
      <div className="puzzle-content clock-puzzle">
        <h2>Clock Adjustment</h2>
        <p className="puzzle-description">Set the clock to the correct time.</p>

        <div className="clock-display">
          <div className="clock-face">
            <div className="clock-hand hour-hand" style={{ transform: `rotate(${(hours % 12) * 30 + minutes * 0.5}deg)` }}></div>
            <div className="clock-hand minute-hand" style={{ transform: `rotate(${minutes * 6}deg)` }}></div>
            <div className="clock-center"></div>
          </div>

          <div className="time-display">
            {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
          </div>
        </div>

        <div className="time-controls">
          <div className="time-control">
            <label>Hours:</label>
            <button onClick={() => setHours((hours - 1 + 24) % 24)}>−</button>
            <span>{String(hours).padStart(2, '0')}</span>
            <button onClick={() => setHours((hours + 1) % 24)}>+</button>
          </div>
          <div className="time-control">
            <label>Minutes:</label>
            <button onClick={() => setMinutes((minutes - 1 + 60) % 60)}>−</button>
            <span>{String(minutes).padStart(2, '0')}</span>
            <button onClick={() => setMinutes((minutes + 1) % 60)}>+</button>
          </div>
        </div>

        <div className="puzzle-actions">
          <button className="puzzle-button submit" onClick={() => onSolve(`${hours}:${minutes < 10 ? '0' : ''}${minutes}`)}>
            Set Time
          </button>
        </div>
      </div>
    );
  };

  const renderPuzzleContent = () => {
    switch (puzzle.type) {
      case 'code_4digit':
        return renderCodePuzzle();
      case 'symbols':
        return renderSymbolPuzzle();
      case 'clock_time':
        return renderClockPuzzle();
      default:
        return <div>Unknown puzzle type</div>;
    }
  };

  return (
    <div className="puzzle-modal-overlay" onClick={onClose}>
      <div className="puzzle-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>
        {renderPuzzleContent()}
      </div>
    </div>
  );
};

export default PuzzleModal;
