import React, { useState } from 'react';
import './IntroScreen.css';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [showStory, setShowStory] = useState(false);

  return (
    <div className="intro-screen">
      <div className="intro-content">
        <h1 className="game-title">THE FORGOTTEN PATIENT</h1>
        <p className="subtitle">A Horror Escape Room Experience</p>

        {!showStory ? (
          <div className="intro-menu">
            <button className="menu-button primary" onClick={() => setShowStory(true)}>
              Start Game
            </button>
            <button className="menu-button">Settings</button>
            <button className="menu-button">Credits</button>
          </div>
        ) : (
          <div className="story-text">
            <p>You wake up in a dimly lit therapy room.</p>
            <p>Your head throbs. Your memories... scattered.</p>
            <p>The year is unclear, but everything feels stuck in the 1970s.</p>
            <p>This was "Treatment Room 7" - an isolation chamber used for experimental therapy.</p>
            <p>The room was sealed after Patient #347 disappeared during treatment in 1978.</p>
            <p className="emphasis">You have 60 minutes to escape before "treatment time" ends.</p>
            <p className="warning">If you fail... you'll become part of the room forever.</p>

            <button className="menu-button primary continue-button" onClick={onStart}>
              Wake Up
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
