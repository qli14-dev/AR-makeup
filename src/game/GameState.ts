/**
 * Game State Management
 * Tracks player progress, puzzle states, inventory, and triggers
 */

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  canExamine: boolean;
}

export type JumpscareType = 'witness' | 'confessor' | 'patience' | 'depths' | 'heretic' | 'drowned' | 'penitent' | null;

export class GameState {
  // Game flow
  public isPlaying: boolean = false;
  public currentRoom: string = 'entryHall';
  public gameTime: number = 0;

  // Player state
  public health: number = 100;
  public stamina: number = 100;
  public fear: number = 0; // 0-100, affects vision/audio

  // Inventory
  public inventory: InventoryItem[] = [];
  public maxInventorySize: number = 8;

  // Puzzle progress
  public puzzleStates: Map<string, any> = new Map();
  public unlockedDoors: Set<string> = new Set();
  public ritualObjectsPlaced: number = 0;

  // Jumpscare system
  private jumpscareFlag: boolean = false;
  private currentJumpscareType: JumpscareType = null;

  // Creature tracking
  public creatureActive: boolean = false;
  public creatureProximity: number = 0; // 0-1, 1 being very close

  // Keys and important items
  public hasIronKey: boolean = false;
  public hasAncientKey: boolean = false;
  public hasBrassKey: boolean = false;
  public hasIronCirclet: boolean = false;
  public hasObsidianDagger: boolean = false;
  public hasSilverChalice: boolean = false;

  // Progression flags
  public saintsGazeSolved: boolean = false;
  public reflectionOfSinsSolved: boolean = false;
  public shadowScriptureSolved: boolean = false;
  public skullCalendarSolved: boolean = false;
  public eightCorruptionsSolved: boolean = false;

  // Ending tracking
  public escapeRouteUnlocked: boolean = false;
  public achievedSecretEnding: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    // Initialize puzzle states
    this.puzzleStates.set('saintStatues', {
      rotations: [0, 0, 0, 0, 0, 0], // Six statues
      attempts: 0,
      solved: false
    });

    this.puzzleStates.set('confessionBooths', {
      visited: new Set<number>(),
      solved: false
    });

    this.puzzleStates.set('shadowScripture', {
      candelabraPositions: [],
      symbolsRevealed: [],
      timeInPosition: 0,
      solved: false
    });

    this.puzzleStates.set('skullCalendar', {
      skullRotations: new Array(12).fill(0),
      attempts: 0,
      solved: false
    });

    this.puzzleStates.set('eightCorruptions', {
      braziersLit: [],
      attempts: 0,
      solved: false
    });
  }

  // Inventory management
  public addItem(item: InventoryItem): boolean {
    if (this.inventory.length >= this.maxInventorySize) {
      return false;
    }
    this.inventory.push(item);
    return true;
  }

  public removeItem(itemId: string): boolean {
    const index = this.inventory.findIndex(item => item.id === itemId);
    if (index !== -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  public hasItem(itemId: string): boolean {
    return this.inventory.some(item => item.id === itemId);
  }

  // Puzzle state management
  public setPuzzleState(puzzleName: string, state: any): void {
    this.puzzleStates.set(puzzleName, state);
  }

  public getPuzzleState(puzzleName: string): any {
    return this.puzzleStates.get(puzzleName);
  }

  public markPuzzleSolved(puzzleName: string): void {
    const state = this.puzzleStates.get(puzzleName);
    if (state) {
      state.solved = true;
    }
  }

  // Jumpscare triggers
  public triggerJumpscare(type: JumpscareType): void {
    this.jumpscareFlag = true;
    this.currentJumpscareType = type;
    this.fear = Math.min(100, this.fear + 30);
  }

  public shouldTriggerJumpscare(): boolean {
    return this.jumpscareFlag;
  }

  public getCurrentJumpscareType(): JumpscareType {
    return this.currentJumpscareType;
  }

  public clearJumpscareFlag(): void {
    this.jumpscareFlag = false;
    this.currentJumpscareType = null;
  }

  // Room transitions
  public unlockDoor(doorId: string): void {
    this.unlockedDoors.add(doorId);
  }

  public isDoorUnlocked(doorId: string): boolean {
    return this.unlockedDoors.has(doorId);
  }

  public changeRoom(roomName: string): void {
    this.currentRoom = roomName;
  }

  // Fear/stress management
  public updateFear(delta: number): void {
    // Fear naturally decays over time
    this.fear = Math.max(0, this.fear - delta * 2);
  }

  public increaseFear(amount: number): void {
    this.fear = Math.min(100, this.fear + amount);
  }

  // Ritual objects tracking
  public placeRitualObject(objectType: string): void {
    switch (objectType) {
      case 'obsidianDagger':
        this.hasObsidianDagger = false; // Removed from inventory
        this.ritualObjectsPlaced++;
        break;
      case 'silverChalice':
        this.hasSilverChalice = false;
        this.ritualObjectsPlaced++;
        break;
      case 'ironCirclet':
        this.hasIronCirclet = false;
        this.ritualObjectsPlaced++;
        break;
    }
  }

  public areAllRitualObjectsPlaced(): boolean {
    return this.ritualObjectsPlaced >= 3;
  }

  // Save/Load (for checkpoints)
  public save(): string {
    return JSON.stringify({
      currentRoom: this.currentRoom,
      gameTime: this.gameTime,
      inventory: this.inventory,
      puzzleStates: Array.from(this.puzzleStates.entries()),
      unlockedDoors: Array.from(this.unlockedDoors),
      keys: {
        iron: this.hasIronKey,
        ancient: this.hasAncientKey,
        brass: this.hasBrassKey
      },
      ritualObjects: {
        circlet: this.hasIronCirclet,
        dagger: this.hasObsidianDagger,
        chalice: this.hasSilverChalice
      },
      progression: {
        saintsGaze: this.saintsGazeSolved,
        reflection: this.reflectionOfSinsSolved,
        shadow: this.shadowScriptureSolved,
        skull: this.skullCalendarSolved,
        corruptions: this.eightCorruptionsSolved
      }
    });
  }

  public load(saveData: string): void {
    try {
      const data = JSON.parse(saveData);
      this.currentRoom = data.currentRoom;
      this.gameTime = data.gameTime;
      this.inventory = data.inventory;
      this.puzzleStates = new Map(data.puzzleStates);
      this.unlockedDoors = new Set(data.unlockedDoors);

      this.hasIronKey = data.keys.iron;
      this.hasAncientKey = data.keys.ancient;
      this.hasBrassKey = data.keys.brass;

      this.hasIronCirclet = data.ritualObjects.circlet;
      this.hasObsidianDagger = data.ritualObjects.dagger;
      this.hasSilverChalice = data.ritualObjects.chalice;

      this.saintsGazeSolved = data.progression.saintsGaze;
      this.reflectionOfSinsSolved = data.progression.reflection;
      this.shadowScriptureSolved = data.progression.shadow;
      this.skullCalendarSolved = data.progression.skull;
      this.eightCorruptionsSolved = data.progression.corruptions;
    } catch (error) {
      console.error('Failed to load save data:', error);
    }
  }
}
