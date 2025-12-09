import React, { useEffect, useState } from 'react';
import './JumpscareOverlay.css';

interface JumpscareOverlayProps {
  type: string;
  onComplete: () => void;
}

const JumpscareOverlay: React.FC<JumpscareOverlayProps> = ({ type, onComplete }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const sequences: Record<string, number[]> = {
      cabinet_bang: [0, 1000, 2000, 4000],
      shadow_figure: [0, 1000, 3000, 5000, 8000],
      symbol_attack: [0, 2000, 4000, 6000],
      mirror_reflection: [0, 2000, 3000, 5000],
      window_visitor: [0, 2000, 4000, 7000],
    };

    const timings = sequences[type] || [0, 3000, 5000];
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    timings.forEach((timing, index) => {
      const timeout = setTimeout(() => {
        setPhase(index);
        if (index === timings.length - 1) {
          setTimeout(onComplete, 500);
        }
      }, timing);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [type, onComplete]);

  const renderJumpscare = () => {
    switch (type) {
      case 'cabinet_bang':
        return (
          <div className={`jumpscare cabinet-bang phase-${phase}`}>
            {phase === 0 && <div className="silence"></div>}
            {phase === 1 && (
              <>
                <div className="shake-screen"></div>
                <div className="bang-effect">BANG!</div>
                <audio src="/sounds/bang.mp3" autoPlay />
              </>
            )}
            {phase === 2 && <div className="bloody-handprint"></div>}
            {phase === 3 && <div className="scream-visual">
              <div className="distorted-face"></div>
              <audio src="/sounds/scream.mp3" autoPlay />
            </div>}
          </div>
        );

      case 'shadow_figure':
        return (
          <div className={`jumpscare shadow-figure phase-${phase}`}>
            {phase === 0 && <div className="lights-flicker"></div>}
            {phase === 1 && <div className="shadow-appears"></div>}
            {phase === 2 && <div className="shadow-closer"></div>}
            {phase === 3 && (
              <>
                <div className="static-noise"></div>
                <audio src="/sounds/static.mp3" autoPlay />
              </>
            )}
            {phase === 4 && <div className="shadow-rush">
              <div className="hollow-eyes"></div>
              <audio src="/sounds/rush.mp3" autoPlay />
            </div>}
          </div>
        );

      case 'symbol_attack':
        return (
          <div className={`jumpscare symbol-attack phase-${phase}`}>
            {phase === 0 && <div className="symbols-glow-red">△ ◐ ⚷ ☿ ⌛</div>}
            {phase === 1 && <div className="symbols-float">
              {['△', '◐', '⚷', '☿', '⌛'].map((symbol, i) => (
                <div key={i} className="floating-symbol" style={{ animationDelay: `${i * 0.1}s` }}>
                  {symbol}
                </div>
              ))}
            </div>}
            {phase === 2 && (
              <>
                <div className="symbol-rush"></div>
                <div className="whisper-text">YOU DON'T UNDERSTAND</div>
                <audio src="/sounds/whisper.mp3" autoPlay />
              </>
            )}
          </div>
        );

      case 'mirror_reflection':
        return (
          <div className={`jumpscare mirror-reflection phase-${phase}`}>
            {phase === 0 && <div className="mirror-view normal"></div>}
            {phase === 1 && <div className="reflection-blinks"></div>}
            {phase === 2 && (
              <>
                <div className="reflection-lunge"></div>
                <div className="crack-sound"></div>
                <audio src="/sounds/crack.mp3" autoPlay />
              </>
            )}
            {phase === 3 && <div className="distorted-face-mirror">
              <div className="screaming-reflection"></div>
            </div>}
          </div>
        );

      case 'window_visitor':
        return (
          <div className={`jumpscare window-visitor phase-${phase}`}>
            {phase === 0 && <div className="window-condensation">L E T  M E  I N</div>}
            {phase === 1 && <div className="shadow-outside"></div>}
            {phase === 2 && (
              <>
                <div className="window-bang"></div>
                <div className="face-on-glass"></div>
                <audio src="/sounds/bang-window.mp3" autoPlay />
              </>
            )}
            {phase === 3 && <div className="breathing-sound">
              <div className="pale-face"></div>
              <audio src="/sounds/breathing.mp3" autoPlay />
            </div>}
          </div>
        );

      default:
        return <div className="jumpscare generic">👻</div>;
    }
  };

  return (
    <div className="jumpscare-overlay">
      {renderJumpscare()}
      <div className="screen-effects">
        <div className="vignette-intense"></div>
        <div className="chromatic-aberration"></div>
      </div>
    </div>
  );
};

export default JumpscareOverlay;
