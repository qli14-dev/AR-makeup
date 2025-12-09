import React from 'react';
import './GameHUD.css';

interface GameHUDProps {
  elapsedTime: number;
  timeLimit: number;
  cluesFound: number;
  onPause: () => void;
}

const GameHUD: React.FC<GameHUDProps> = ({ elapsedTime, timeLimit, cluesFound, onPause }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const timeRemaining = timeLimit > 0 ? timeLimit - elapsedTime : 0;
  const isLowTime = timeRemaining < 300 && timeRemaining > 0; // Less than 5 minutes
  const isCriticalTime = timeRemaining < 60 && timeRemaining > 0; // Less than 1 minute

  return (
    <div className="game-hud">
      <div className="hud-left">
        <div className="objective-hint">
          <span className="hint-label">Objective:</span>
          <span className="hint-text">Escape before time runs out</span>
        </div>
        <div className="clues-counter">
          <span className="clues-icon">🔍</span>
          <span className="clues-text">Clues: {cluesFound}</span>
        </div>
      </div>

      <div className="hud-right">
        {timeLimit > 0 && (
          <div className={`timer ${isLowTime ? 'warning' : ''} ${isCriticalTime ? 'critical' : ''}`}>
            <span className="timer-icon">⏱</span>
            <span className="timer-text">{formatTime(timeRemaining)}</span>
            {isCriticalTime && <span className="timer-flash"></span>}
          </div>
        )}

        <button className="pause-button" onClick={onPause}>
          ⏸
        </button>
      </div>

      {isCriticalTime && (
        <div className="critical-warning">
          <span className="warning-text pulse">⚠ CRITICAL: Less than 1 minute remaining! ⚠</span>
        </div>
      )}
    </div>
  );
};

export default GameHUD;
