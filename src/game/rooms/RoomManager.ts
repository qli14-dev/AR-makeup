/**
 * Room Manager
 * Handles room loading, transitions, and environment updates
 */

import * as THREE from 'three';
import { GameState } from '../GameState';
import { EntryHall } from './EntryHall';
import { Nave } from './Nave';

export class RoomManager {
  private scene: THREE.Scene;
  private gameState: GameState;
  private currentRoom: any = null;

  constructor(scene: THREE.Scene, gameState: GameState) {
    this.scene = scene;
    this.gameState = gameState;
  }

  public async loadRoom(roomName: string): Promise<void> {
    console.log(`Loading room: ${roomName}`);

    // Unload current room
    if (this.currentRoom) {
      this.currentRoom.dispose();
    }

    // Clear scene (keep lights)
    const objectsToRemove: THREE.Object3D[] = [];
    this.scene.traverse((obj) => {
      if (obj.type === 'Mesh' || obj.type === 'Group') {
        objectsToRemove.push(obj);
      }
    });
    objectsToRemove.forEach(obj => this.scene.remove(obj));

    // Load new room
    switch (roomName) {
      case 'entryHall':
        this.currentRoom = new EntryHall(this.scene, this.gameState);
        break;
      case 'nave':
        this.currentRoom = new Nave(this.scene, this.gameState);
        break;
      case 'crypt':
        // TODO: Create Crypt room
        console.log('Crypt room not yet implemented');
        break;
      case 'ossuary':
        // TODO: Create Ossuary room
        console.log('Ossuary room not yet implemented');
        break;
      case 'sanctum':
        // TODO: Create Sanctum room
        console.log('Sanctum room not yet implemented');
        break;
      default:
        console.error(`Unknown room: ${roomName}`);
        return;
    }

    await this.currentRoom.load();
    this.gameState.changeRoom(roomName);
  }

  public update(delta: number): void {
    if (this.currentRoom && this.currentRoom.update) {
      this.currentRoom.update(delta);
    }
  }

  public getCurrentRoom(): any {
    return this.currentRoom;
  }
}
