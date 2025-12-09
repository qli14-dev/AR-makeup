import { useState, useEffect, useCallback } from 'react';
import { GameState, GameProgress, EndingType, GameConfig, Puzzle, InventoryItem } from '../types/game';

const INITIAL_PROGRESS: GameProgress = {
  hasFlashlight: false,
  hasBatteries: false,
  flashlightWorking: false,
  closetUnlocked: false,
  hasUVLight: false,
  hasTapeRecorder: false,
  tapeRecorderPlayed: false,
  symbolsPuzzleSolved: false,
  safeBoxOpened: false,
  clockSet: false,
  hasRustyKey: false,
  doorUnlocked: false,
  hasSmallKey: false,
  medicinesCabinetOpened: false,
  wrongCodeAttempts: 0,
  totalJumpscares: 0,
  hintsUsed: 0,
  startTime: 0,
  elapsedTime: 0,
  cluesFound: [],
};

const INITIAL_CONFIG: GameConfig = {
  difficulty: 'normal',
  timeLimit: 3600, // 60 minutes
  jumpscaresEnabled: true,
  hintsEnabled: true,
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [progress, setProgress] = useState<GameProgress>(INITIAL_PROGRESS);
  const [config, setConfig] = useState<GameConfig>(INITIAL_CONFIG);
  const [ending, setEnding] = useState<EndingType>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [puzzles, setPuzzles] = useState<Puzzle[]>([
    { id: 'closet_code', name: 'Closet Lock', isSolved: false, attempts: 0, maxAttempts: 7, type: 'code_4digit', solution: '3478' },
    { id: 'safe_symbols', name: 'Safe Box Symbols', isSolved: false, attempts: 0, maxAttempts: 5, type: 'symbols', solution: ['triangle', 'half_moon', 'prison', 'cure', 'hourglass'] },
    { id: 'clock_time', name: 'Clock Setting', isSolved: false, attempts: 0, type: 'clock_time', solution: '10:15' },
  ]);

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setProgress(prev => {
        const newElapsed = prev.elapsedTime + 1;

        // Check timeout condition
        if (newElapsed >= config.timeLimit && config.timeLimit > 0) {
          setEnding('bad_timeout');
          setGameState('ending');
          return prev;
        }

        return {
          ...prev,
          elapsedTime: newElapsed,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, config.timeLimit]);

  // Check for broken mind ending (too many jumpscares)
  useEffect(() => {
    if (progress.totalJumpscares >= 7 && gameState === 'playing') {
      setEnding('bad_broken');
      setGameState('ending');
    }
  }, [progress.totalJumpscares, gameState]);

  const startGame = useCallback(() => {
    setProgress({ ...INITIAL_PROGRESS, startTime: Date.now() });
    setGameState('playing');
    setEnding(null);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState('paused');
  }, []);

  const resumeGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const addToInventory = useCallback((item: InventoryItem) => {
    setInventory(prev => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromInventory = useCallback((itemId: string) => {
    setInventory(prev => prev.filter(i => i.id !== itemId));
  }, []);

  const updateProgress = useCallback((updates: Partial<GameProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  }, []);

  const solvePuzzle = useCallback((puzzleId: string) => {
    setPuzzles(prev => prev.map(p =>
      p.id === puzzleId ? { ...p, isSolved: true } : p
    ));
  }, []);

  const incrementPuzzleAttempt = useCallback((puzzleId: string) => {
    setPuzzles(prev => prev.map(p =>
      p.id === puzzleId ? { ...p, attempts: p.attempts + 1 } : p
    ));
  }, []);

  const addClue = useCallback((clueId: string) => {
    setProgress(prev => ({
      ...prev,
      cluesFound: prev.cluesFound.includes(clueId)
        ? prev.cluesFound
        : [...prev.cluesFound, clueId],
    }));
  }, []);

  const triggerJumpscare = useCallback(() => {
    setProgress(prev => ({
      ...prev,
      totalJumpscares: prev.totalJumpscares + 1,
    }));
  }, []);

  const triggerEnding = useCallback((endingType: EndingType) => {
    setEnding(endingType);
    setGameState('ending');
  }, []);

  return {
    gameState,
    progress,
    config,
    ending,
    inventory,
    puzzles,
    startGame,
    pauseGame,
    resumeGame,
    addToInventory,
    removeFromInventory,
    updateProgress,
    solvePuzzle,
    incrementPuzzleAttempt,
    addClue,
    triggerJumpscare,
    triggerEnding,
    setConfig,
  };
};
