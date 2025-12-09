import React, { useState, useEffect } from 'react';
import { DifficultyLevel } from '../../types/game';
import { loadStats } from '../../types/achievements';
import './IntroScreen.css';

interface IntroScreenProps {
  onStart: (difficulty: DifficultyLevel) => void;
}

type Screen = 'menu' | 'difficulty' | 'story' | 'settings' | 'achievements' | 'credits';

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>('normal');
  const [stats, setStats] = useState(loadStats());

  useEffect(() => {
    setStats(loadStats());
  }, []);

  const handleStartGame = () => {
    onStart(selectedDifficulty);
  };

  const renderDifficultySelection = () => (
    <div className="difficulty-selection">
      <h2>Select Difficulty</h2>
      <div className="difficulty-options">
        <div
          className={`difficulty-card easy ${selectedDifficulty === 'easy' ? 'selected' : ''}`}
          onClick={() => setSelectedDifficulty('easy')}
        >
          <div className="difficulty-icon">😊</div>
          <h3>Easy</h3>
          <ul>
            <li>90-minute timer</li>
            <li>Hints available</li>
            <li>Reduced jumpscares</li>
            <li>Perfect for beginners</li>
          </ul>
        </div>

        <div
          className={`difficulty-card normal ${selectedDifficulty === 'normal' ? 'selected' : ''}`}
          onClick={() => setSelectedDifficulty('normal')}
        >
          <div className="difficulty-icon">😐</div>
          <h3>Normal</h3>
          <ul>
            <li>60-minute timer</li>
            <li>Subtle hints</li>
            <li>Standard jumpscares</li>
            <li>Balanced experience</li>
          </ul>
        </div>

        <div
          className={`difficulty-card hard ${selectedDifficulty === 'hard' ? 'selected' : ''}`}
          onClick={() => setSelectedDifficulty('hard')}
        >
          <div className="difficulty-icon">😰</div>
          <h3>Hard</h3>
          <ul>
            <li>45-minute timer</li>
            <li>No hints</li>
            <li>Frequent horror events</li>
            <li>True challenge</li>
          </ul>
        </div>

        <div
          className={`difficulty-card nightmare ${selectedDifficulty === 'nightmare' ? 'selected' : ''}`}
          onClick={() => setSelectedDifficulty('nightmare')}
        >
          <div className="difficulty-icon">💀</div>
          <h3>Nightmare</h3>
          <ul>
            <li>30-minute timer</li>
            <li>No mercy</li>
            <li>Permadeath</li>
            <li>Only for the brave</li>
          </ul>
        </div>
      </div>

      <div className="difficulty-actions">
        <button className="menu-button" onClick={() => setCurrentScreen('menu')}>
          Back
        </button>
        <button className="menu-button primary" onClick={() => setCurrentScreen('story')}>
          Continue
        </button>
      </div>
    </div>
  );

  const renderAchievements = () => {
    const unlockedCount = stats.achievements.filter(a => a.unlocked).length;
    const totalCount = stats.achievements.length;

    return (
      <div className="achievements-screen">
        <h2>Achievements</h2>
        <p className="achievement-progress">
          {unlockedCount} / {totalCount} Unlocked
        </p>

        <div className="achievements-grid">
          {stats.achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <h4>{achievement.name}</h4>
                <p>{achievement.description}</p>
                {achievement.unlocked && achievement.unlockedAt && (
                  <span className="unlock-date">
                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="stats-summary">
          <div className="stat">
            <span className="stat-label">Games Played:</span>
            <span className="stat-value">{stats.totalGamesPlayed}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Successful Escapes:</span>
            <span className="stat-value">{stats.totalEscapes}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Fastest Time:</span>
            <span className="stat-value">
              {stats.fastestTime ? `${Math.floor(stats.fastestTime / 60)}:${(stats.fastestTime % 60).toString().padStart(2, '0')}` : 'N/A'}
            </span>
          </div>
        </div>

        <button className="menu-button" onClick={() => setCurrentScreen('menu')}>
          Back
        </button>
      </div>
    );
  };

  const renderMenu = () => (
    <div className="intro-menu">
      <button className="menu-button primary" onClick={() => setCurrentScreen('difficulty')}>
        ▶ Start New Game
      </button>
      <button className="menu-button" onClick={() => setCurrentScreen('achievements')}>
        🏆 Achievements
      </button>
      <button className="menu-button" onClick={() => setCurrentScreen('settings')}>
        ⚙️ Settings
      </button>
      <button className="menu-button" onClick={() => setCurrentScreen('credits')}>
        ℹ️ Credits
      </button>
    </div>
  );

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <h1 className="game-title">THE FORGOTTEN PATIENT</h1>
        <p className="subtitle">A Horror Escape Room Experience</p>

        {currentScreen === 'menu' && renderMenu()}
        {currentScreen === 'difficulty' && renderDifficultySelection()}
        {currentScreen === 'achievements' && renderAchievements()}

        {currentScreen === 'settings' && (
          <div className="settings-screen">
            <h2>Settings</h2>
            <p>Audio and accessibility settings coming soon...</p>
            <button className="menu-button" onClick={() => setCurrentScreen('menu')}>
              Back
            </button>
          </div>
        )}

        {currentScreen === 'credits' && (
          <div className="credits-screen">
            <h2>Credits</h2>
            <p><strong>Game Design & Development:</strong> Claude AI</p>
            <p><strong>Genre:</strong> Psychological Horror / Escape Room</p>
            <p><strong>Technologies:</strong> React + TypeScript + Vite</p>
            <p><strong>Inspiration:</strong> Layers of Fear, Silent Hill, The Room</p>
            <button className="menu-button" onClick={() => setCurrentScreen('menu')}>
              Back
            </button>
          </div>
        )}

        {currentScreen === 'story' && (
          <div className="story-text">
            <p>You wake up in a dimly lit therapy room.</p>
            <p>Your head throbs. Your memories... scattered.</p>
            <p>The year is unclear, but everything feels stuck in the 1970s.</p>
            <p>This was "Treatment Room 7" - an isolation chamber used for experimental therapy.</p>
            <p>The room was sealed after Patient #347 disappeared during treatment in 1978.</p>
            <p className="emphasis">You have 60 minutes to escape before "treatment time" ends.</p>
            <p className="warning">If you fail... you'll become part of the room forever.</p>

            <button className="menu-button primary continue-button" onClick={handleStartGame}>
              Wake Up ⏰
            </button>
          </div>
        )}

        <div className="intro-footer">
          <p className="warning-text">⚠️ Contains horror elements, jumpscares, and disturbing themes</p>
          <p className="tip-text">🎧 Headphones recommended for best experience</p>
        </div>
      </div>
    </div>
  );
};

export default IntroScreen;
