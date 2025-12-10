/**
 * Game Entry Point
 * Initializes and starts the horror game
 */

import { Game } from './game/Game';
import './game-styles.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-game');
  const menu = document.getElementById('menu');
  const hud = document.getElementById('hud');

  let gameInstance: Game | null = null;

  // Start game on button click
  if (startButton) {
    startButton.addEventListener('click', () => {
      const container = document.getElementById('game-container');
      if (container && !gameInstance) {
        gameInstance = new Game(container);
        menu?.classList.add('hidden');
        hud?.classList.add('active');
      }
    });
  }

  // Handle escape key for pause menu
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && gameInstance) {
      menu?.classList.remove('hidden');
    }
  });

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (gameInstance) {
      gameInstance.dispose();
    }
  });
});

// Global error handler
window.addEventListener('error', (e) => {
  console.error('Game Error:', e.error);
  alert('Game failed to load. Check console for details.');
});
