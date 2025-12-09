export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_clue',
    name: 'Detective',
    description: 'Find your first clue',
    icon: '🔍',
    unlocked: false,
  },
  {
    id: 'flashlight_powered',
    name: 'Let There Be Light',
    description: 'Get the flashlight working',
    icon: '🔦',
    unlocked: false,
  },
  {
    id: 'closet_opened',
    name: 'Code Breaker',
    description: 'Unlock the supply closet',
    icon: '🔓',
    unlocked: false,
  },
  {
    id: 'symbols_decoded',
    name: 'Cryptographer',
    description: 'Solve the symbol puzzle',
    icon: '△',
    unlocked: false,
  },
  {
    id: 'time_master',
    name: 'Clockwork',
    description: 'Set the clock to the correct time',
    icon: '⏰',
    unlocked: false,
  },
  {
    id: 'speed_run',
    name: 'Speed Runner',
    description: 'Escape in under 15 minutes',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'no_mistakes',
    name: 'Perfect Memory',
    description: 'Solve all puzzles without wrong attempts',
    icon: '🧠',
    unlocked: false,
  },
  {
    id: 'brave_soul',
    name: 'Fearless',
    description: 'Survive 5 jumpscares',
    icon: '💪',
    unlocked: false,
  },
  {
    id: 'good_ending',
    name: 'Acceptance',
    description: 'Face the truth and escape',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'all_clues',
    name: 'Investigator',
    description: 'Find all 7 clues',
    icon: '📋',
    unlocked: false,
  },
  {
    id: 'survivor',
    name: 'Survivor',
    description: 'Complete the game on Hard difficulty',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'nightmare_victor',
    name: 'Nightmare Victor',
    description: 'Complete the game on Nightmare difficulty',
    icon: '👑',
    unlocked: false,
  },
];

export interface GameStats {
  totalGamesPlayed: number;
  totalEscapes: number;
  fastestTime: number | null;
  totalJumpscares: number;
  achievements: Achievement[];
  lastPlayed: number | null;
}

export const getInitialStats = (): GameStats => ({
  totalGamesPlayed: 0,
  totalEscapes: 0,
  fastestTime: null,
  totalJumpscares: 0,
  achievements: [...ACHIEVEMENTS],
  lastPlayed: null,
});

export const saveStats = (stats: GameStats) => {
  try {
    localStorage.setItem('horror_game_stats', JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats:', e);
  }
};

export const loadStats = (): GameStats => {
  try {
    const saved = localStorage.getItem('horror_game_stats');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load stats:', e);
  }
  return getInitialStats();
};

export const unlockAchievement = (stats: GameStats, achievementId: string): GameStats => {
  const newStats = { ...stats };
  const achievement = newStats.achievements.find(a => a.id === achievementId);

  if (achievement && !achievement.unlocked) {
    achievement.unlocked = true;
    achievement.unlockedAt = Date.now();
    saveStats(newStats);
    console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
  }

  return newStats;
};
