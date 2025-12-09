import React, { useState } from 'react';
import { EndingType } from '../../types/game';
import './EndingScreen.css';

interface EndingScreenProps {
  endingType: EndingType;
  onRestart: () => void;
}

const EndingScreen: React.FC<EndingScreenProps> = ({ endingType, onRestart }) => {
  const [showChoice, setShowChoice] = useState(endingType === 'good');
  const [finalEnding, setFinalEnding] = useState<'acceptance' | 'denial' | null>(null);

  const handleChoice = (choice: 'accept' | 'refuse') => {
    if (choice === 'accept') {
      setFinalEnding('acceptance');
    } else {
      setFinalEnding('denial');
    }
    setShowChoice(false);
  };

  const renderGoodEndingChoice = () => {
    return (
      <div className="ending-choice">
        <h1>The Door Opens...</h1>
        <p className="revelation">You see yourself lying on the therapy chair in the reflection.</p>
        <p className="revelation">Memories flood back. Patient #347. The experiments. The trauma.</p>
        <p className="revelation emphasis">This room is your mind's prison.</p>

        <div className="choice-buttons">
          <button className="choice-button accept" onClick={() => handleChoice('accept')}>
            Accept the Truth
          </button>
          <button className="choice-button refuse" onClick={() => handleChoice('refuse')}>
            Refuse to Believe
          </button>
        </div>
      </div>
    );
  };

  const renderAcceptanceEnding = () => {
    return (
      <div className="ending-sequence acceptance fade-in">
        <h1 className="ending-title">ACCEPTANCE</h1>
        <div className="ending-text">
          <p>You step toward the light.</p>
          <p>The weight lifts. The shadows fade.</p>
          <p>Dr. Volker wasn't your enemy. He tried to help.</p>
          <p>The real prison was never the room.</p>
          <p className="emphasis">It was always your refusal to face the truth.</p>
        </div>

        <div className="final-scene">
          <div className="white-light"></div>
          <p className="final-text">Patient #347</p>
          <p className="final-text">Status: Released</p>
        </div>

        <button className="restart-button" onClick={onRestart}>
          Return to Title
        </button>
      </div>
    );
  };

  const renderDenialEnding = () => {
    return (
      <div className="ending-sequence denial fade-in">
        <h1 className="ending-title blood-text">DENIAL</h1>
        <div className="ending-text">
          <p>You turn away from the truth.</p>
          <p>The mirror shatters.</p>
          <p>Laughter echoes through the room.</p>
          <p className="emphasis shake">The door SLAMS shut.</p>
        </div>

        <div className="final-scene dark">
          <div className="darkness-consuming"></div>
          <p className="final-text glitch">Try again, Patient 347</p>
          <p className="hint-text">The truth will set you free</p>
        </div>

        <button className="restart-button" onClick={onRestart}>
          Wake Up Again
        </button>
      </div>
    );
  };

  const renderTimeoutEnding = () => {
    return (
      <div className="ending-sequence timeout fade-in">
        <h1 className="ending-title">TIME'S UP</h1>
        <div className="ending-text">
          <p>The clock strikes.</p>
          <p>All lights extinguish.</p>
          <p>The door unlocks... from the outside.</p>
          <p className="emphasis">Heavy footsteps approach.</p>
        </div>

        <div className="final-scene dark">
          <div className="shadow-approaching"></div>
          <p className="final-text">Patient #347</p>
          <p className="final-text">Status: Missing</p>
          <p className="subtitle-text">"You are not the first. You will not be the last."</p>
        </div>

        <button className="restart-button" onClick={onRestart}>
          Try Again
        </button>
      </div>
    );
  };

  const renderBrokenEnding = () => {
    return (
      <div className="ending-sequence broken fade-in">
        <h1 className="ending-title glitch">BROKEN</h1>
        <div className="ending-text">
          <p className="distorted">Your mind... fractures.</p>
          <p className="distorted">The fear... overwhelming.</p>
          <p className="distorted">Voices speaking in unison:</p>
          <p className="emphasis blood-text">"ONE OF US"</p>
        </div>

        <div className="final-scene distorted">
          <div className="multiple-shadows"></div>
          <p className="final-text glitch">Patient #347</p>
          <p className="final-text glitch">Status: Unresponsive</p>
        </div>

        <button className="restart-button" onClick={onRestart}>
          Start Over
        </button>
      </div>
    );
  };

  if (showChoice) {
    return (
      <div className="ending-screen">
        {renderGoodEndingChoice()}
      </div>
    );
  }

  if (finalEnding === 'acceptance') {
    return (
      <div className="ending-screen light">
        {renderAcceptanceEnding()}
      </div>
    );
  }

  if (finalEnding === 'denial') {
    return (
      <div className="ending-screen dark">
        {renderDenialEnding()}
      </div>
    );
  }

  return (
    <div className="ending-screen dark">
      {endingType === 'bad_timeout' && renderTimeoutEnding()}
      {endingType === 'bad_broken' && renderBrokenEnding()}
      {endingType === 'bad_denial' && renderDenialEnding()}
    </div>
  );
};

export default EndingScreen;
