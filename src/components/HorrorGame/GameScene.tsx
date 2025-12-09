import React, { useEffect, useState } from 'react';
import { useGameState } from '../../hooks/useGameState';
import IntroScreen from './IntroScreen';
import RoomView from './RoomView';
import InventoryUI from './InventoryUI';
import PuzzleModal from './PuzzleModal';
import JumpscareOverlay from './JumpscareOverlay';
import EndingScreen from './EndingScreen';
import GameHUD from './GameHUD';
import './GameScene.css';

const GameScene: React.FC = () => {
  const {
    gameState,
    progress,
    config,
    ending,
    inventory,
    puzzles,
    startGame,
    pauseGame,
    addToInventory,
    updateProgress,
    solvePuzzle,
    triggerJumpscare,
    triggerEnding,
    addClue,
  } = useGameState();

  const [activePuzzle, setActivePuzzle] = useState<string | null>(null);
  const [jumpscareActive, setJumpscareActive] = useState(false);
  const [jumpscareType, setJumpscareType] = useState<string>('');
  const [closeUpObject, setCloseUpObject] = useState<string | null>(null);

  // Ambient sound management
  useEffect(() => {
    if (gameState === 'playing') {
      // Play ambient sounds
      playAmbientSounds();
    }

    return () => {
      // Cleanup sounds
      stopAllSounds();
    };
  }, [gameState]);

  const playAmbientSounds = () => {
    // TODO: Implement audio system
    console.log('Playing ambient sounds...');
  };

  const stopAllSounds = () => {
    // TODO: Implement audio cleanup
    console.log('Stopping all sounds...');
  };

  const handleObjectClick = (objectId: string) => {
    console.log('Clicked object:', objectId);

    // Handle different object interactions
    switch (objectId) {
      case 'desk_drawer_top':
        if (!progress.hasFlashlight) {
          addToInventory({
            id: 'flashlight',
            name: 'Flashlight',
            description: 'A heavy flashlight. Currently has no batteries.',
            icon: '🔦',
            isUsable: false,
          });
          updateProgress({ hasFlashlight: true });
        }
        break;

      case 'radiator':
        if (!progress.hasSmallKey) {
          addToInventory({
            id: 'small_key',
            name: 'Small Key',
            description: 'A small brass key. Could open a drawer or cabinet.',
            icon: '🔑',
            isUsable: true,
          });
          updateProgress({ hasSmallKey: true });
        }
        break;

      case 'medicine_cabinet':
        if (progress.hasSmallKey && !progress.medicinesCabinetOpened) {
          addToInventory({
            id: 'batteries',
            name: 'Batteries',
            description: 'Two D-cell batteries for the flashlight.',
            icon: '🔋',
            isUsable: true,
            canCombineWith: ['flashlight'],
          });
          updateProgress({ medicinesCabinetOpened: true, hasBatteries: true });
          addClue('patient_number');
        } else if (!progress.hasSmallKey) {
          // Try to force open - trigger jumpscare
          handleJumpscare('cabinet_bang');
        }
        break;

      case 'closet':
        setActivePuzzle('closet_code');
        break;

      case 'safe_box':
        if (progress.symbolsPuzzleSolved) {
          // Check if clock is set
          if (progress.clockSet && !progress.hasRustyKey) {
            addToInventory({
              id: 'rusty_key',
              name: 'Rusty Key',
              description: 'A large rusty key. This might open the exit door!',
              icon: '🗝️',
              isUsable: true,
            });
            updateProgress({ hasRustyKey: true });
          } else if (!progress.clockSet) {
            // Safe is empty - hint about time
            console.log('The safe is empty... Maybe time needs to be right?');
          }
        } else {
          setActivePuzzle('safe_symbols');
        }
        break;

      case 'clock':
        setActivePuzzle('clock_time');
        break;

      case 'window':
        addClue('window_numbers');
        if (progress.wrongCodeAttempts >= 3) {
          handleJumpscare('window_visitor');
        }
        break;

      case 'coffee_table':
        if (!inventory.find(i => i.id === 'photograph')) {
          addToInventory({
            id: 'photograph',
            name: 'Photograph',
            description: 'A faded photograph dated 3/47/1978.',
            icon: '📷',
            isUsable: false,
          });
          addClue('photo_date');
        }
        break;

      case 'bed':
        if (!inventory.find(i => i.id === 'journal')) {
          addToInventory({
            id: 'journal',
            name: "Patient's Journal",
            description: 'A journal with strange symbol drawings.',
            icon: '📔',
            isUsable: false,
          });
          addClue('symbol_meanings');
        }
        break;

      case 'rug':
        addClue('symbols_under_rug');
        break;

      case 'door':
        if (progress.hasRustyKey) {
          // Final door - trigger ending choice
          triggerEnding('good'); // Will show choice modal
        } else {
          console.log('The door is locked. You need a key.');
        }
        break;

      case 'mirror':
        // Start stare timer for jumpscare
        setTimeout(() => {
          if (closeUpObject === 'mirror') {
            handleJumpscare('mirror_reflection');
          }
        }, 10000);
        setCloseUpObject(objectId);
        break;

      default:
        setCloseUpObject(objectId);
    }
  };

  const handleJumpscare = (type: string) => {
    if (!config.jumpscaresEnabled) return;

    setJumpscareType(type);
    setJumpscareActive(true);
    triggerJumpscare();

    // Auto-close jumpscare after duration
    setTimeout(() => {
      setJumpscareActive(false);
    }, getDuration(type));
  };

  const getDuration = (type: string): number => {
    const durations: Record<string, number> = {
      cabinet_bang: 4000,
      shadow_figure: 8000,
      symbol_attack: 6000,
      mirror_reflection: 5000,
      window_visitor: 7000,
    };
    return durations[type] || 5000;
  };

  const handleCombineItems = (item1Id: string, item2Id: string) => {
    // Combine flashlight + batteries
    if (
      (item1Id === 'flashlight' && item2Id === 'batteries') ||
      (item1Id === 'batteries' && item2Id === 'flashlight')
    ) {
      addToInventory({
        id: 'flashlight_working',
        name: 'Flashlight (On)',
        description: 'A working flashlight. Illuminates dark areas.',
        icon: '🔦',
        isUsable: true,
      });
      updateProgress({ flashlightWorking: true });
    }
  };

  const handlePuzzleSolve = (puzzleId: string, answer: string) => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;

    // Check answer
    if (Array.isArray(puzzle.solution)) {
      // Symbol puzzle
      if (answer === puzzle.solution.join(',')) {
        solvePuzzle(puzzleId);
        if (puzzleId === 'closet_code') {
          // Add items from closet
          addToInventory({
            id: 'uv_flashlight',
            name: 'UV Flashlight',
            description: 'A UV flashlight that reveals hidden marks.',
            icon: '💡',
            isUsable: true,
          });
          addToInventory({
            id: 'tape_recorder',
            name: 'Tape Recorder',
            description: 'An old tape recorder with a tape inside.',
            icon: '📼',
            isUsable: true,
          });
          updateProgress({ closetUnlocked: true, hasUVLight: true, hasTapeRecorder: true });
        } else if (puzzleId === 'safe_symbols') {
          updateProgress({ symbolsPuzzleSolved: true, safeBoxOpened: true });
        }
        setActivePuzzle(null);
      } else {
        // Wrong answer
        handleWrongPuzzleAttempt(puzzleId);
      }
    } else {
      // String answer
      if (answer === puzzle.solution) {
        solvePuzzle(puzzleId);
        if (puzzleId === 'closet_code') {
          addToInventory({
            id: 'uv_flashlight',
            name: 'UV Flashlight',
            description: 'A UV flashlight that reveals hidden marks.',
            icon: '💡',
            isUsable: true,
          });
          addToInventory({
            id: 'tape_recorder',
            name: 'Tape Recorder',
            description: 'An old tape recorder with a tape inside.',
            icon: '📼',
            isUsable: true,
          });
          addToInventory({
            id: 'doctors_note',
            name: "Doctor's Note",
            description: 'A note about Patient 347.',
            icon: '📄',
            isUsable: false,
          });
          updateProgress({ closetUnlocked: true, hasUVLight: true, hasTapeRecorder: true });
        } else if (puzzleId === 'clock_time') {
          updateProgress({ clockSet: true });
        }
        setActivePuzzle(null);
      } else {
        handleWrongPuzzleAttempt(puzzleId);
      }
    }
  };

  const handleWrongPuzzleAttempt = (puzzleId: string) => {
    const puzzle = puzzles.find(p => p.id === puzzleId);
    if (!puzzle) return;

    const newAttempts = puzzle.attempts + 1;
    updateProgress({ wrongCodeAttempts: progress.wrongCodeAttempts + 1 });

    // Trigger jumpscares based on attempts
    if (puzzleId === 'closet_code' && newAttempts === 3) {
      handleJumpscare('shadow_figure');
    } else if (puzzleId === 'safe_symbols' && newAttempts === 3) {
      handleJumpscare('symbol_attack');
    }
  };

  // Render based on game state
  if (gameState === 'intro') {
    return <IntroScreen onStart={startGame} />;
  }

  if (gameState === 'ending') {
    return <EndingScreen endingType={ending} onRestart={startGame} />;
  }

  return (
    <div className="game-scene">
      <GameHUD
        elapsedTime={progress.elapsedTime}
        timeLimit={config.timeLimit}
        cluesFound={progress.cluesFound.length}
        onPause={pauseGame}
      />

      <RoomView
        objects={[]} // TODO: Add objects from gameObjects
        onObjectClick={handleObjectClick}
        flashlightActive={progress.flashlightWorking}
        uvLightActive={progress.hasUVLight}
      />

      <InventoryUI
        items={inventory}
        onUseItem={(itemId) => console.log('Use item:', itemId)}
        onCombineItems={handleCombineItems}
      />

      {activePuzzle && (
        <PuzzleModal
          puzzleId={activePuzzle}
          puzzle={puzzles.find(p => p.id === activePuzzle)!}
          onSolve={(answer) => handlePuzzleSolve(activePuzzle, answer)}
          onClose={() => setActivePuzzle(null)}
        />
      )}

      {jumpscareActive && (
        <JumpscareOverlay type={jumpscareType} onComplete={() => setJumpscareActive(false)} />
      )}

      {closeUpObject && (
        <div className="close-up-view">
          <div className="close-up-content">
            <h2>Examining: {closeUpObject}</h2>
            <button onClick={() => setCloseUpObject(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameScene;
