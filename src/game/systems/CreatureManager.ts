/**
 * Creature Manager
 * Handles creature AI, proximity detection, and jumpscares
 */

import * as THREE from 'three';
import { AudioManager } from './AudioManager';
import { JumpscareType } from '../GameState';

interface Creature {
  mesh: THREE.Group;
  position: THREE.Vector3;
  targetPosition: THREE.Vector3;
  speed: number;
  active: boolean;
  type: string;
}

export class CreatureManager {
  private scene: THREE.Scene;
  private audioManager: AudioManager;

  private creatures: Map<string, Creature> = new Map();
  private watcherPosition: THREE.Vector3 = new THREE.Vector3();
  private watcherDistance: number = 20;
  private watcherVisible: boolean = false;

  private jumpscareActive: boolean = false;
  private jumpscareElement: HTMLElement | null = null;

  constructor(scene: THREE.Scene, _camera: THREE.Camera, audioManager: AudioManager) {
    this.scene = scene;
    this.audioManager = audioManager;

    this.createJumpscareOverlay();
  }

  private createJumpscareOverlay(): void {
    this.jumpscareElement = document.getElementById('jumpscare-overlay');
    if (!this.jumpscareElement) {
      this.jumpscareElement = document.createElement('div');
      this.jumpscareElement.id = 'jumpscare-overlay';
      this.jumpscareElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: black;
        display: none;
        z-index: 9999;
        pointer-events: none;
      `;
      document.body.appendChild(this.jumpscareElement);
    }
  }

  public update(delta: number, cameraPosition: THREE.Vector3): void {
    // Update ambient watcher
    if (this.watcherVisible) {
      this.updateWatcher(delta, cameraPosition);
    }

    // Update active creatures
    this.creatures.forEach(creature => {
      if (creature.active) {
        this.updateCreature(creature, delta, cameraPosition);
      }
    });

    // Update proximity effects
    this.updateProximityEffects(cameraPosition);
  }

  private updateWatcher(delta: number, cameraPosition: THREE.Vector3): void {
    // Watcher appears at random positions, watching from distance

    // Gradually gets closer over time
    if (this.watcherDistance > 5) {
      this.watcherDistance -= delta * 0.5;
    }

    // Reposition watcher outside player's view
    const randomAngle = Math.random() * Math.PI * 2;
    this.watcherPosition.x = cameraPosition.x + Math.cos(randomAngle) * this.watcherDistance;
    this.watcherPosition.z = cameraPosition.z + Math.sin(randomAngle) * this.watcherDistance;
  }

  private updateCreature(creature: Creature, delta: number, cameraPosition: THREE.Vector3): void {
    // Simple AI: move toward target
    const direction = new THREE.Vector3()
      .subVectors(creature.targetPosition, creature.position)
      .normalize();

    creature.position.add(direction.multiplyScalar(creature.speed * delta));
    creature.mesh.position.copy(creature.position);

    // Face player
    creature.mesh.lookAt(cameraPosition);

    // Play footstep sounds
    const distance = creature.position.distanceTo(cameraPosition);
    if (distance < 15) {
      // Audible range
      this.audioManager.play3DSound('creature_step', creature.position, 1.0 - distance / 15);
    }
  }

  private updateProximityEffects(cameraPosition: THREE.Vector3): void {
    let closestDistance = Infinity;

    this.creatures.forEach(creature => {
      if (creature.active) {
        const distance = creature.position.distanceTo(cameraPosition);
        if (distance < closestDistance) {
          closestDistance = distance;
        }
      }
    });

    // Update audio based on proximity
    if (closestDistance < 20) {
      const heartbeatIntensity = Math.max(0, 1 - closestDistance / 20);
      this.audioManager.setHeartbeatVolume(heartbeatIntensity * 0.7);

      if (closestDistance < 10) {
        this.audioManager.setBreathingIntensity('fear');
      } else if (closestDistance < 15) {
        this.audioManager.setBreathingIntensity('normal');
      }
    } else {
      this.audioManager.setHeartbeatVolume(0);
    }
  }

  // JUMPSCARE SYSTEM
  public triggerJumpscare(type: JumpscareType): void {
    if (!type || this.jumpscareActive) return;

    this.jumpscareActive = true;
    console.log(`JUMPSCARE: ${type}`);

    switch (type) {
      case 'witness':
        this.playWitnessJumpscare();
        break;
      case 'confessor':
        this.playConfessorJumpscare();
        break;
      case 'patience':
        this.playPatienceJumpscare();
        break;
      case 'depths':
        this.playDepthsJumpscare();
        break;
      case 'heretic':
        this.playHereticJumpscare();
        break;
      case 'drowned':
        this.playDrownedJumpscare();
        break;
      case 'penitent':
        this.playPenitentJumpscare();
        break;
    }
  }

  private playWitnessJumpscare(): void {
    // THE WITNESS - statue creature
    this.showJumpscareImage('witness', 0.8);
    this.audioManager.playJumpscare('witness');

    setTimeout(() => {
      this.endJumpscare();
      this.flickerLights();
    }, 800);
  }

  private playConfessorJumpscare(): void {
    // THE CONFESSOR - rotted priest
    this.showJumpscareImage('confessor', 1.2);
    this.audioManager.playJumpscare('confessor');

    setTimeout(() => {
      this.endJumpscare();
    }, 1200);
  }

  private playPatienceJumpscare(): void {
    // THE PATIENCE - shrouded figure
    this.showJumpscareImage('patience', 2.0);
    this.audioManager.playJumpscare('witness'); // Reuse sound

    setTimeout(() => {
      this.endJumpscare();
      this.applyFogEffect();
    }, 2000);
  }

  private playDepthsJumpscare(): void {
    // THE DEPTHS - pit creature
    this.showJumpscareImage('depths', 1.5);
    this.audioManager.playJumpscare('depths');

    setTimeout(() => {
      this.endJumpscare();
      this.teleportPlayerBack();
    }, 1500);
  }

  private playHereticJumpscare(): void {
    // THE HERETIC - bishop creature
    this.showJumpscareImage('heretic', 1.8);
    this.audioManager.playJumpscare('witness'); // Reuse

    setTimeout(() => {
      this.endJumpscare();
    }, 1800);
  }

  private playDrownedJumpscare(): void {
    // THE DROWNED - waterlogged corpse
    this.showJumpscareImage('drowned', 1.0);
    this.audioManager.playJumpscare('confessor'); // Reuse

    setTimeout(() => {
      this.endJumpscare();
    }, 1000);
  }

  private playPenitentJumpscare(): void {
    // THE PENITENT - kneeling corpse
    this.showJumpscareImage('penitent', 1.1);
    this.audioManager.playJumpscare('witness');

    setTimeout(() => {
      this.endJumpscare();
    }, 1100);
  }

  private showJumpscareImage(type: string, _duration: number): void {
    if (!this.jumpscareElement) return;

    // In production: load actual horror images
    // For now: use black screen with text
    this.jumpscareElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
        color: #800;
        font-size: 120px;
        font-family: 'Times New Roman', serif;
        text-shadow: 0 0 20px #f00;
        animation: glitch 0.1s infinite;
      ">
        ${type.toUpperCase()}
      </div>
      <style>
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
      </style>
    `;

    this.jumpscareElement.style.display = 'flex';

    // Screen shake effect
    document.body.style.animation = 'shake 0.5s infinite';
  }

  private endJumpscare(): void {
    if (this.jumpscareElement) {
      this.jumpscareElement.style.display = 'none';
      this.jumpscareElement.innerHTML = '';
    }

    document.body.style.animation = '';
    this.jumpscareActive = false;
  }

  private flickerLights(): void {
    // Trigger light flicker in scene
    console.log('Lights flickering...');
  }

  private applyFogEffect(): void {
    // Increase fog density
    if (this.scene.fog instanceof THREE.FogExp2) {
      this.scene.fog.density = 0.15;
      setTimeout(() => {
        if (this.scene.fog instanceof THREE.FogExp2) {
          this.scene.fog.density = 0.08;
        }
      }, 30000);
    }
  }

  private teleportPlayerBack(): void {
    // Move player back slightly (avoid pit)
    console.log('Player pushed back from pit');
  }

  // Spawn watcher
  public activateWatcher(initialDistance: number = 20): void {
    this.watcherVisible = true;
    this.watcherDistance = initialDistance;
  }

  public deactivateWatcher(): void {
    this.watcherVisible = false;
  }

  // Spawn creature for chase
  public spawnChaseCreature(position: THREE.Vector3): void {
    const creatureGroup = this.createCreatureMesh('heretic');
    this.scene.add(creatureGroup);

    const creature: Creature = {
      mesh: creatureGroup,
      position: position.clone(),
      targetPosition: new THREE.Vector3(),
      speed: 3.5,
      active: true,
      type: 'chaser'
    };

    this.creatures.set('chaser', creature);
  }

  private createCreatureMesh(_type: string): THREE.Group {
    const group = new THREE.Group();

    // Placeholder creature (in production: load 3D models)
    const geometry = new THREE.BoxGeometry(1, 3, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x331111,
      emissive: 0x220000,
      roughness: 0.9
    });

    const body = new THREE.Mesh(geometry, material);
    body.position.y = 1.5;
    body.castShadow = true;

    group.add(body);

    return group;
  }

  public setCreatureTarget(creatureId: string, target: THREE.Vector3): void {
    const creature = this.creatures.get(creatureId);
    if (creature) {
      creature.targetPosition.copy(target);
    }
  }
}
