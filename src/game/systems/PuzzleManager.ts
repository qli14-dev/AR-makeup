/**
 * Puzzle Manager
 * Handles puzzle logic and validation
 */

import * as THREE from 'three';
import { GameState } from '../GameState';

export class PuzzleManager {
  private gameState: GameState;

  constructor(gameState: GameState) {
    this.gameState = gameState;
  }

  public update(delta: number): void {
    // Update time-based puzzles
    const shadowPuzzle = this.gameState.getPuzzleState('shadowScripture');
    if (shadowPuzzle && !shadowPuzzle.solved) {
      shadowPuzzle.timeInPosition += delta;

      // Trigger jumpscare if candelabra left too long (>60 sec)
      if (shadowPuzzle.timeInPosition > 60) {
        this.gameState.triggerJumpscare('patience');
        shadowPuzzle.timeInPosition = 0; // Reset
      }
    }
  }

  // PUZZLE 1: SAINT'S GAZE
  public checkSaintsGaze(rotations: number[]): boolean {
    const correctSequence = [1, 2, 3, 4, 5, 6]; // Whip, Crown, Nails, Spear, Cross, Shroud
    const isCorrect = rotations.every((rot, i) => rot === correctSequence[i]);

    const state = this.gameState.getPuzzleState('saintStatues');
    state.rotations = [...rotations];
    state.attempts++;

    if (isCorrect) {
      state.solved = true;
      this.gameState.saintsGazeSolved = true;
      this.gameState.unlockDoor('altarCompartment');
      return true;
    } else if (state.attempts >= 3) {
      // Trigger jumpscare on 3rd failed attempt
      this.gameState.triggerJumpscare('witness');
      state.attempts = 0; // Reset attempts after scare
    }

    return false;
  }

  // PUZZLE 2: REFLECTION OF SINS
  public checkConfessionBooth(boothNumber: number): 'correct' | 'wrong' | 'already_visited' {
    const state = this.gameState.getPuzzleState('confessionBooths');

    if (state.visited.has(boothNumber)) {
      return 'already_visited';
    }

    state.visited.add(boothNumber);

    if (boothNumber === 4) {
      // Correct booth
      state.solved = true;
      this.gameState.reflectionOfSinsSolved = true;
      return 'correct';
    } else {
      // Wrong booth - trigger jumpscare
      this.gameState.triggerJumpscare('confessor');
      return 'wrong';
    }
  }

  // PUZZLE 3: SHADOW SCRIPTURE
  public updateCandelabraPosition(_position: THREE.Vector3): void {
    const state = this.gameState.getPuzzleState('shadowScripture');
    state.timeInPosition = 0; // Reset timer when moved
  }

  public checkShadowSymbols(symbols: string[]): boolean {
    const correctSymbols = ['ankh', 'sword', 'skull']; // ☥ ⚔ ☠
    const isCorrect = symbols.every((sym, i) => sym === correctSymbols[i]);

    if (isCorrect) {
      const state = this.gameState.getPuzzleState('shadowScripture');
      state.solved = true;
      this.gameState.shadowScriptureSolved = true;
      this.gameState.unlockDoor('cryptGate');
      return true;
    }

    return false;
  }

  // PUZZLE 4: SKULL CALENDAR
  public checkSkullAlignment(alignments: number[]): boolean {
    // Skulls 3, 10, 1 must face the moon tomb
    const correctAlignments = new Array(12).fill(0);
    correctAlignments[2] = 1; // Skull 3 (index 2)
    correctAlignments[9] = 1; // Skull 10 (index 9)
    correctAlignments[0] = 1; // Skull 1 (index 0)

    const state = this.gameState.getPuzzleState('skullCalendar');
    state.skullRotations = [...alignments];
    state.attempts++;

    const isCorrect = alignments.every((align, i) => align === correctAlignments[i]);

    if (isCorrect) {
      state.solved = true;
      this.gameState.skullCalendarSolved = true;
      this.gameState.unlockDoor('moonTomb');
      return true;
    } else if (state.attempts >= 2) {
      // Trigger pit creature after 2nd failed attempt
      this.gameState.triggerJumpscare('depths');
      state.attempts = 0;
    }

    return false;
  }

  // PUZZLE 5: EIGHT CORRUPTIONS
  public checkBrazierSequence(litBraziers: string[]): 'correct' | 'wrong' | 'partial' {
    const correctSequence = ['bell', 'cross', 'host', 'icon', 'halo', 'chalice', 'rosary', 'candle'];
    const state = this.gameState.getPuzzleState('eightCorruptions');

    state.braziersLit = [...litBraziers];

    // Check if current sequence matches so far
    for (let i = 0; i < litBraziers.length; i++) {
      if (litBraziers[i] !== correctSequence[i]) {
        state.attempts++;

        if (state.attempts >= 2) {
          // Trigger heretic jumpscare on 2nd wrong brazier
          this.gameState.triggerJumpscare('heretic');
          state.attempts = 0;
          state.braziersLit = []; // Reset
        }

        return 'wrong';
      }
    }

    // Check if complete
    if (litBraziers.length === 8) {
      state.solved = true;
      this.gameState.eightCorruptionsSolved = true;
      this.gameState.unlockDoor('escapeDoor');
      return 'correct';
    }

    return 'partial';
  }

  // MASTER LOCK
  public checkMasterLock(keys: string[]): boolean {
    const correctOrder = ['brass', 'iron', 'ancient'];
    const isCorrect = keys.every((key, i) => key === correctOrder[i]);

    if (isCorrect && keys.length === 3) {
      this.gameState.escapeRouteUnlocked = true;
      return true;
    }

    return false;
  }

  // Optional: Pit dive puzzle
  public attemptPitDive(timeUnderwater: number): 'success' | 'drowned' | 'safe' {
    if (timeUnderwater > 8) {
      this.gameState.triggerJumpscare('drowned');
      return 'drowned';
    } else if (timeUnderwater >= 3) {
      // Successfully grabbed circlet
      this.gameState.hasIronCirclet = true;
      return 'success';
    }

    return 'safe';
  }
}
