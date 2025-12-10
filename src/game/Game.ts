/**
 * THE CATHEDRAL OF THE FORSAKEN
 * Main Game Engine
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { AudioManager } from './systems/AudioManager';
import { InteractionSystem } from './systems/InteractionSystem';
import { PuzzleManager } from './systems/PuzzleManager';
import { CreatureManager } from './systems/CreatureManager';
import { RoomManager } from './rooms/RoomManager';
import { GameState } from './GameState';

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: PointerLockControls;
  private clock: THREE.Clock;

  // Game Systems
  private audioManager: AudioManager;
  private interactionSystem: InteractionSystem;
  private puzzleManager: PuzzleManager;
  private creatureManager: CreatureManager;
  private roomManager: RoomManager;
  private gameState: GameState;

  // Player movement
  private moveForward = false;
  private moveBackward = false;
  private moveLeft = false;
  private moveRight = false;
  private canJump = false;
  private velocity = new THREE.Vector3();
  private direction = new THREE.Vector3();
  private playerSpeed = 2.5;
  private sprintSpeed = 5.0;
  private isSprinting = false;

  // Raycaster for interaction
  private raycaster: THREE.Raycaster;

  constructor(container: HTMLElement) {
    // Initialize core Three.js components
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.08);

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.7, 0); // Eye height

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.6; // Dark atmosphere
    container.appendChild(this.renderer.domElement);

    // Pointer lock controls for first-person
    this.controls = new PointerLockControls(this.camera, document.body);

    this.clock = new THREE.Clock();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = 3; // Interaction distance

    // Initialize game systems
    this.gameState = new GameState();
    this.audioManager = new AudioManager();
    this.interactionSystem = new InteractionSystem(this.scene, this.camera, this.raycaster);
    this.puzzleManager = new PuzzleManager(this.gameState);
    this.creatureManager = new CreatureManager(this.scene, this.camera, this.audioManager);
    this.roomManager = new RoomManager(this.scene, this.gameState);

    this.setupEventListeners();
    this.setupLighting();
    this.init();
  }

  private setupEventListeners(): void {
    // Click to start game (pointer lock)
    document.addEventListener('click', () => {
      if (!this.gameState.isPlaying) {
        this.controls.lock();
      }
    });

    this.controls.addEventListener('lock', () => {
      this.gameState.isPlaying = true;
      document.getElementById('menu')?.classList.add('hidden');
    });

    this.controls.addEventListener('unlock', () => {
      this.gameState.isPlaying = false;
      document.getElementById('menu')?.classList.remove('hidden');
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.addEventListener('keyup', (e) => this.onKeyUp(e));

    // Mouse click for interaction
    document.addEventListener('click', () => {
      if (this.controls.isLocked) {
        this.interactionSystem.interact();
      }
    });

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  private onKeyDown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = true;
        this.audioManager.setBreathingIntensity('sprint');
        break;
      case 'Space':
        if (this.canJump) this.velocity.y += 5;
        this.canJump = false;
        break;
    }
  }

  private onKeyUp(event: KeyboardEvent): void {
    switch (event.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.isSprinting = false;
        this.audioManager.setBreathingIntensity('normal');
        break;
    }
  }

  private setupLighting(): void {
    // Very dim ambient light (oppressive darkness)
    const ambientLight = new THREE.AmbientLight(0x2244aa, 0.1);
    this.scene.add(ambientLight);

    // Hemisphere light for subtle blue from above
    const hemiLight = new THREE.HemisphereLight(0x4466bb, 0x111122, 0.3);
    this.scene.add(hemiLight);
  }

  private async init(): Promise<void> {
    // Load initial room (Entry Hall)
    await this.roomManager.loadRoom('entryHall');

    // Start ambient audio
    this.audioManager.playAmbient('cathedral');

    // Begin game loop
    this.animate();
  }

  private updateMovement(delta: number): void {
    if (!this.controls.isLocked) return;

    const speed = this.isSprinting ? this.sprintSpeed : this.playerSpeed;

    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 9.8 * 10.0 * delta; // Gravity

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward) {
      this.velocity.z -= this.direction.z * speed * delta;
    }
    if (this.moveLeft || this.moveRight) {
      this.velocity.x -= this.direction.x * speed * delta;
    }

    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);

    // Ground collision (simple for now)
    if (this.camera.position.y < 1.7) {
      this.velocity.y = 0;
      this.camera.position.y = 1.7;
      this.canJump = true;
    }

    // Update footstep sounds based on movement
    if ((this.moveForward || this.moveBackward || this.moveLeft || this.moveRight) && this.canJump) {
      this.audioManager.playFootstep(this.isSprinting);
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();

    if (this.gameState.isPlaying) {
      this.updateMovement(delta);

      // Update game systems
      this.interactionSystem.update();
      this.creatureManager.update(delta, this.camera.position);
      this.puzzleManager.update(delta);
      this.roomManager.update(delta);

      // Check for jumpscare triggers
      if (this.gameState.shouldTriggerJumpscare()) {
        this.creatureManager.triggerJumpscare(this.gameState.getCurrentJumpscareType());
        this.gameState.clearJumpscareFlag();
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  public dispose(): void {
    this.controls.dispose();
    this.renderer.dispose();
    this.audioManager.dispose();
  }
}
