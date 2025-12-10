/**
 * NAVE - "The Corrupted Sanctuary"
 * Main worship hall with multiple puzzles and threats
 */

import * as THREE from 'three';
import { GameState } from '../GameState';

export class Nave {
  private scene: THREE.Scene;
  private room: THREE.Group;
  private candles: THREE.PointLight[] = [];
  private statues: THREE.Group[] = [];
  private candleFlickerTimer: number = 0;

  constructor(scene: THREE.Scene, _gameState: GameState) {
    this.scene = scene;
    this.room = new THREE.Group();
    this.room.name = 'Nave';
  }

  public async load(): Promise<void> {
    this.buildGeometry();
    this.setupLighting();
    this.buildPuzzleElements();
    this.scene.add(this.room);
  }

  private buildGeometry(): void {
    // FLOOR - 25m x 12m
    const floorGeometry = new THREE.PlaneGeometry(25, 12);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2f,
      roughness: 0.4,
      metalness: 0.6
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.room.add(floor);

    // WALLS with gothic arches
    this.buildWalls();

    // CEILING - vaulted
    this.buildCeiling();

    // GOTHIC ARCHES along sides
    this.buildArchways();

    // RAISED ALTAR platform
    this.buildAltar();

    // ROSE WINDOW above altar
    this.buildRoseWindow();

    // OVERTURNED PEWS
    this.buildPews();

    // SIDE CHAPELS
    this.buildChapels();
  }

  private buildWalls(): void {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3f,
      roughness: 0.9,
      side: THREE.DoubleSide
    });

    // Back wall (behind altar)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8),
      wallMaterial
    );
    backWall.position.set(0, 4, -12.5);
    backWall.receiveShadow = true;
    backWall.castShadow = true;
    this.room.add(backWall);

    // Front wall (entrance)
    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 8),
      wallMaterial
    );
    frontWall.position.set(0, 4, 12.5);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    this.room.add(frontWall);

    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(25, 8),
      wallMaterial
    );
    leftWall.position.set(-6, 4, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.room.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(25, 8),
      wallMaterial
    );
    rightWall.position.set(6, 4, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.room.add(rightWall);
  }

  private buildCeiling(): void {
    const ceilingGeometry = new THREE.PlaneGeometry(25, 12);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1f,
      roughness: 1.0,
      side: THREE.DoubleSide
    });

    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 8;
    ceiling.receiveShadow = true;
    this.room.add(ceiling);
  }

  private buildArchways(): void {
    const archMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2f,
      roughness: 0.95
    });

    // 5 arches per side
    for (let i = 0; i < 5; i++) {
      const zPos = -10 + i * 5;

      // Left arch
      const leftPillar1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 8, 8),
        archMaterial
      );
      leftPillar1.position.set(-5.5, 4, zPos);
      leftPillar1.castShadow = true;
      this.room.add(leftPillar1);

      // Right arch
      const rightPillar1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 8, 8),
        archMaterial
      );
      rightPillar1.position.set(5.5, 4, zPos);
      rightPillar1.castShadow = true;
      this.room.add(rightPillar1);
    }
  }

  private buildAltar(): void {
    const altarGroup = new THREE.Group();
    altarGroup.position.set(0, 0, -10);

    // Platform (3 steps)
    for (let i = 0; i < 3; i++) {
      const stepGeometry = new THREE.BoxGeometry(8 - i * 0.5, 0.3, 4 - i * 0.3);
      const stepMaterial = new THREE.MeshStandardMaterial({
        color: 0x404045,
        roughness: 0.85
      });

      const step = new THREE.Mesh(stepGeometry, stepMaterial);
      step.position.y = i * 0.3;
      step.position.z = i * 0.2;
      step.castShadow = true;
      step.receiveShadow = true;
      altarGroup.add(step);
    }

    // Altar table
    const altarTableGeometry = new THREE.BoxGeometry(6, 1.2, 2);
    const altarTableMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a1a0f,
      roughness: 0.9
    });

    const altarTable = new THREE.Mesh(altarTableGeometry, altarTableMaterial);
    altarTable.position.y = 1.5;
    altarTable.castShadow = true;
    altarTable.receiveShadow = true;
    altarGroup.add(altarTable);

    // Three ritual object indentations
    const indentMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0f,
      roughness: 0.7,
      metalness: 0.3,
      emissive: 0x001100,
      emissiveIntensity: 0.2
    });

    for (let i = 0; i < 3; i++) {
      const indent = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.25, 0.2, 16),
        indentMaterial
      );
      indent.position.set((i - 1) * 1.5, 2.05, 0);
      altarGroup.add(indent);
    }

    // Candles on altar
    const candlePositions = [
      new THREE.Vector3(-2.5, 2.1, 0.5),
      new THREE.Vector3(-1.5, 2.1, 0.5),
      new THREE.Vector3(1.5, 2.1, 0.5),
      new THREE.Vector3(2.5, 2.1, 0.5)
    ];

    candlePositions.forEach(pos => {
      const candleLight = new THREE.PointLight(0xffaa33, 2.0, 6, 2);
      candleLight.position.copy(pos);
      candleLight.castShadow = true;
      altarGroup.add(candleLight);
      this.candles.push(candleLight);

      // Visual candle
      const candleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.06, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0xeeddcc, roughness: 0.8 })
      );
      candleBody.position.copy(pos);
      candleBody.position.y -= 0.2;
      altarGroup.add(candleBody);

      // Flame
      const flame = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xffaa44, transparent: true, opacity: 0.8 })
      );
      flame.position.copy(pos);
      flame.scale.y = 1.5;
      altarGroup.add(flame);
    });

    this.room.add(altarGroup);
  }

  private buildRoseWindow(): void {
    // Circular stained glass window above altar
    const windowGeometry = new THREE.CircleGeometry(2, 32);
    const windowMaterial = new THREE.MeshBasicMaterial({
      color: 0x4466bb,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });

    const roseWindow = new THREE.Mesh(windowGeometry, windowMaterial);
    roseWindow.position.set(0, 7, -12.4);
    this.room.add(roseWindow);

    // Cracks in glass
    for (let i = 0; i < 8; i++) {
      const crackGeometry = new THREE.PlaneGeometry(0.05, 1 + Math.random());
      const crackMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.6
      });

      const crack = new THREE.Mesh(crackGeometry, crackMaterial);
      crack.position.set(
        Math.random() * 2 - 1,
        7 + Math.random() * 2 - 1,
        -12.35
      );
      crack.rotation.z = Math.random() * Math.PI;
      this.room.add(crack);
    }
  }

  private buildPews(): void {
    const pewMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a1a0f,
      roughness: 0.95
    });

    // 8 pews per side, some overturned
    for (let row = 0; row < 4; row++) {
      for (let side = 0; side < 2; side++) {
        const x = (side === 0 ? -2.5 : 2.5);
        const z = 8 - row * 4;

        const pew = new THREE.Group();

        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(3, 0.3, 1.5),
          pewMaterial
        );
        const back = new THREE.Mesh(
          new THREE.BoxGeometry(3, 1.2, 0.2),
          pewMaterial
        );
        back.position.set(0, 0.6, -0.65);

        pew.add(seat);
        pew.add(back);

        // Randomly overturn some pews
        if (Math.random() > 0.6) {
          pew.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.3;
          pew.position.y = 0.8;
        } else {
          pew.position.y = 0.45;
        }

        pew.position.x = x;
        pew.position.z = z;

        pew.castShadow = true;
        pew.receiveShadow = true;
        this.room.add(pew);
      }
    }
  }

  private buildChapels(): void {
    // Small side chapels behind arches
    const chapelMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2f,
      roughness: 1.0
    });

    // Left chapel
    const leftChapel = new THREE.Mesh(
      new THREE.BoxGeometry(2, 4, 3),
      chapelMaterial
    );
    leftChapel.position.set(-5.5, 2, -5);
    leftChapel.castShadow = true;
    leftChapel.receiveShadow = true;
    this.room.add(leftChapel);

    // Right chapel
    const rightChapel = new THREE.Mesh(
      new THREE.BoxGeometry(2, 4, 3),
      chapelMaterial
    );
    rightChapel.position.set(5.5, 2, -5);
    rightChapel.castShadow = true;
    rightChapel.receiveShadow = true;
    this.room.add(rightChapel);
  }

  private buildPuzzleElements(): void {
    // SIX STATUES (Saint's Gaze Puzzle)
    this.buildSaintStatues();

    // CONFESSION BOOTHS (Reflection of Sins Puzzle)
    this.buildConfessionBooths();

    // MOVEABLE CANDELABRA (Shadow Scripture Puzzle)
    this.buildCandelabra();

    // LECTERN with book
    this.buildLectern();
  }

  private buildSaintStatues(): void {
    const statuePositions = [
      { x: -5, z: -8, name: 'Whip' },
      { x: -3, z: -9, name: 'Crown' },
      { x: -1, z: -9.5, name: 'Nails' },
      { x: 1, z: -9.5, name: 'Spear' },
      { x: 3, z: -9, name: 'Cross' },
      { x: 5, z: -8, name: 'Shroud' }
    ];

    const statueMaterial = new THREE.MeshStandardMaterial({
      color: 0x555566,
      roughness: 0.85
    });

    statuePositions.forEach((pos, index) => {
      const statueGroup = new THREE.Group();

      // Pedestal
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 1.2, 8),
        statueMaterial
      );
      pedestal.castShadow = true;
      statueGroup.add(pedestal);

      // Statue body (simplified)
      const body = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.35, 1.8, 8),
        statueMaterial
      );
      body.position.y = 1.8;
      body.castShadow = true;
      statueGroup.add(body);

      // Head (rotatable part)
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 8, 8),
        statueMaterial
      );
      head.position.y = 2.9;
      head.castShadow = true;
      statueGroup.add(head);

      // Instrument symbol (on pedestal)
      const symbolGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
      const symbolMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        roughness: 0.7
      });
      const symbol = new THREE.Mesh(symbolGeometry, symbolMaterial);
      symbol.position.y = 0.6;
      symbol.position.z = 0.45;
      statueGroup.add(symbol);

      statueGroup.position.set(pos.x, 0, pos.z);
      statueGroup.userData = { puzzleIndex: index, rotation: 0, name: pos.name };

      this.room.add(statueGroup);
      this.statues.push(statueGroup);
    });
  }

  private buildConfessionBooths(): void {
    const boothMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a0a05,
      roughness: 0.95
    });

    // 5 confession booths along right wall
    for (let i = 0; i < 5; i++) {
      const booth = new THREE.Group();

      // Booth structure
      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 2.5, 1.5),
        boothMaterial
      );
      frame.castShadow = true;
      frame.receiveShadow = true;
      booth.add(frame);

      // Door
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2.2, 0.1),
        boothMaterial
      );
      door.position.z = 0.8;
      door.position.y = 0.1;
      door.castShadow = true;
      booth.add(door);

      // Roman numeral above door
      const numeral = new THREE.Mesh(
        new THREE.PlaneGeometry(0.3, 0.4),
        new THREE.MeshBasicMaterial({ color: 0x888888 })
      );
      numeral.position.set(0, 1.5, 0.81);
      booth.add(numeral);

      booth.position.set(4.5, 1.25, 8 - i * 3.5);
      booth.userData = { boothNumber: i + 1 };

      this.room.add(booth);
    }
  }

  private buildCandelabra(): void {
    const candelabraGroup = new THREE.Group();

    // Base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16),
      new THREE.MeshStandardMaterial({ color: 0xaa8844, roughness: 0.3, metalness: 0.8 })
    );
    candelabraGroup.add(base);

    // Stem
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8),
      new THREE.MeshStandardMaterial({ color: 0xaa8844, roughness: 0.3, metalness: 0.8 })
    );
    stem.position.y = 0.75;
    candelabraGroup.add(stem);

    // Three branches with candles
    for (let i = 0; i < 3; i++) {
      const angle = (i - 1) * 0.5;
      const branch = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.6, 8),
        new THREE.MeshStandardMaterial({ color: 0xaa8844, roughness: 0.3, metalness: 0.8 })
      );
      branch.position.set(Math.sin(angle) * 0.3, 1.3, Math.cos(angle) * 0.3);
      branch.rotation.z = angle;
      candelabraGroup.add(branch);

      // Candle on branch
      const candle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.05, 0.3, 8),
        new THREE.MeshStandardMaterial({ color: 0xeeddcc })
      );
      candle.position.set(Math.sin(angle) * 0.5, 1.5, Math.cos(angle) * 0.5);
      candelabraGroup.add(candle);

      // Flame
      const flame = new THREE.PointLight(0xffaa44, 1.0, 4);
      flame.position.set(Math.sin(angle) * 0.5, 1.65, Math.cos(angle) * 0.5);
      candelabraGroup.add(flame);
      this.candles.push(flame);
    }

    candelabraGroup.position.set(2, 0, -8);
    candelabraGroup.castShadow = true;
    candelabraGroup.userData = { moveable: true };

    this.room.add(candelabraGroup);
  }

  private buildLectern(): void {
    const lecternGroup = new THREE.Group();

    // Stand
    const stand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.3, 1.2, 8),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 0.9 })
    );
    lecternGroup.add(stand);

    // Book surface
    const surface = new THREE.Mesh(
      new THREE.BoxGeometry(0.8, 0.1, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x2a1a0f, roughness: 0.9 })
    );
    surface.position.y = 0.7;
    surface.rotation.x = -0.3;
    lecternGroup.add(surface);

    // Book
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.05, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x4a3a2f, roughness: 0.7 })
    );
    book.position.y = 0.75;
    book.rotation.x = -0.3;
    lecternGroup.add(book);

    lecternGroup.position.set(-3, 0, -7);
    lecternGroup.userData = { interactable: true, type: 'examine' };

    this.room.add(lecternGroup);
  }

  private setupLighting(): void {
    // Rose window light (cold blue)
    const windowLight = new THREE.PointLight(0x4466bb, 3.0, 20, 2);
    windowLight.position.set(0, 7, -12);
    windowLight.castShadow = true;
    this.room.add(windowLight);

    // Additional atmospheric lighting is handled by candles array
  }

  public update(delta: number): void {
    // Candle flickering
    this.candleFlickerTimer += delta;

    if (this.candleFlickerTimer > 0.05) {
      this.candles.forEach(candle => {
        const flicker = 1.8 + Math.random() * 0.5;
        candle.intensity = flicker;
      });
      this.candleFlickerTimer = 0;
    }
  }

  public dispose(): void {
    this.room.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach(mat => mat.dispose());
        } else {
          obj.material.dispose();
        }
      }
    });

    this.scene.remove(this.room);
  }
}
