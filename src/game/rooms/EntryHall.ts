/**
 * ENTRY HALL - "The Threshold"
 * First room - establishes atmosphere and teaches basic mechanics
 */

import * as THREE from 'three';
import { GameState } from '../GameState';

export class EntryHall {
  private scene: THREE.Scene;
  private room: THREE.Group;
  private candles: THREE.PointLight[] = [];
  private candleFlickerTimer: number = 0;

  constructor(scene: THREE.Scene, _gameState: GameState) {
    this.scene = scene;
    this.room = new THREE.Group();
    this.room.name = 'EntryHall';
  }

  public async load(): Promise<void> {
    this.buildGeometry();
    this.setupLighting();
    this.addInteractables();
    this.scene.add(this.room);
  }

  private buildGeometry(): void {
    // FLOOR - wet flagstones with reflections
    const floorGeometry = new THREE.PlaneGeometry(15, 8);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2f,
      roughness: 0.3,
      metalness: 0.7, // Wet reflection
      envMapIntensity: 0.5
    });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.room.add(floor);

    // Add puddles (darker spots)
    for (let i = 0; i < 8; i++) {
      const puddleGeometry = new THREE.CircleGeometry(0.3 + Math.random() * 0.5, 16);
      const puddleMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a0a0f,
        roughness: 0.1,
        metalness: 0.9
      });
      const puddle = new THREE.Mesh(puddleGeometry, puddleMaterial);
      puddle.rotation.x = -Math.PI / 2;
      puddle.position.set(
        (Math.random() - 0.5) * 14,
        0.01,
        (Math.random() - 0.5) * 7
      );
      puddle.receiveShadow = true;
      this.room.add(puddle);
    }

    // WALLS - stone with gothic arches
    this.buildWalls();

    // CEILING - ribbed vaults
    this.buildCeiling();

    // PILLARS - two flanking pillars
    this.buildPillars();

    // LOCKED DOOR at far end
    this.buildDoor();

    // ALCOVES with broken objects
    this.buildAlcoves();

    // DEBRIS and atmosphere
    this.addDebris();
  }

  private buildWalls(): void {
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3f,
      roughness: 0.9,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Front wall
    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 6),
      wallMaterial
    );
    frontWall.position.set(0, 3, -4);
    frontWall.receiveShadow = true;
    frontWall.castShadow = true;
    this.room.add(frontWall);

    // Back wall (with door)
    const backWallLeft = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 6),
      wallMaterial
    );
    backWallLeft.position.set(-5, 3, 4);
    backWallLeft.rotation.y = Math.PI;
    backWallLeft.receiveShadow = true;
    this.room.add(backWallLeft);

    const backWallRight = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 6),
      wallMaterial
    );
    backWallRight.position.set(5, 3, 4);
    backWallRight.rotation.y = Math.PI;
    backWallRight.receiveShadow = true;
    this.room.add(backWallRight);

    // Side walls
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 6),
      wallMaterial
    );
    leftWall.position.set(-7.5, 3, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    this.room.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 6),
      wallMaterial
    );
    rightWall.position.set(7.5, 3, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    this.room.add(rightWall);
  }

  private buildCeiling(): void {
    const ceilingGeometry = new THREE.PlaneGeometry(15, 8);
    const ceilingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1f,
      roughness: 1.0,
      side: THREE.DoubleSide
    });

    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 6;
    ceiling.receiveShadow = true;
    this.room.add(ceiling);

    // Ribbed vault details (arches)
    const ribMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2f,
      roughness: 0.95
    });

    for (let i = 0; i < 3; i++) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 15),
        ribMaterial
      );
      rib.position.set((i - 1) * 3, 5.85, 0);
      rib.castShadow = true;
      this.room.add(rib);
    }
  }

  private buildPillars(): void {
    const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.6, 6, 8);
    const pillarMaterial = new THREE.MeshStandardMaterial({
      color: 0x404045,
      roughness: 0.85
    });

    // Left pillar
    const leftPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    leftPillar.position.set(-3, 3, 0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    this.room.add(leftPillar);

    // Right pillar
    const rightPillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
    rightPillar.position.set(3, 3, 0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    this.room.add(rightPillar);

    // Carved saint faces on pillars (simple boxes for now)
    const faceMaterial = new THREE.MeshStandardMaterial({
      color: 0x555555,
      roughness: 0.9
    });

    const leftFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.2),
      faceMaterial
    );
    leftFace.position.set(-3, 3.5, 0.4);
    leftFace.castShadow = true;
    this.room.add(leftFace);

    const rightFace = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.5, 0.2),
      faceMaterial
    );
    rightFace.position.set(3, 3.5, 0.4);
    rightFace.castShadow = true;
    this.room.add(rightFace);
  }

  private buildDoor(): void {
    const doorGroup = new THREE.Group();
    doorGroup.position.set(0, 0, 4);

    // Door frame (stone arch)
    const frameMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a3a3f,
      roughness: 0.9
    });

    const leftFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4.5, 0.5),
      frameMaterial
    );
    leftFrame.position.set(-1.5, 2.25, 0);
    leftFrame.castShadow = true;
    doorGroup.add(leftFrame);

    const rightFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 4.5, 0.5),
      frameMaterial
    );
    rightFrame.position.set(1.5, 2.25, 0);
    rightFrame.castShadow = true;
    doorGroup.add(rightFrame);

    // Arch top
    const archGeometry = new THREE.TorusGeometry(1.5, 0.2, 8, 32, Math.PI);
    const arch = new THREE.Mesh(archGeometry, frameMaterial);
    arch.position.set(0, 4.5, 0);
    arch.rotation.x = -Math.PI / 2;
    arch.castShadow = true;
    doorGroup.add(arch);

    // Door itself (oak with iron reinforcement)
    const doorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a1a0f,
      roughness: 0.95,
      metalness: 0.1
    });

    const doorPanel = new THREE.Mesh(
      new THREE.BoxGeometry(3, 4.5, 0.2),
      doorMaterial
    );
    doorPanel.position.y = 2.25;
    doorPanel.castShadow = true;
    doorPanel.receiveShadow = true;
    doorGroup.add(doorPanel);

    // Iron bands
    const ironMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.7,
      metalness: 0.8
    });

    for (let i = 0; i < 3; i++) {
      const band = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.15, 0.1),
        ironMaterial
      );
      band.position.set(0, 1 + i * 1.5, 0.15);
      band.castShadow = true;
      doorGroup.add(band);
    }

    this.room.add(doorGroup);
  }

  private buildAlcoves(): void {
    // Left alcove
    const leftAlcove = new THREE.Group();
    leftAlcove.position.set(-6, 0, -2);

    const alcoveBack = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2f, roughness: 1 })
    );
    alcoveBack.position.set(0, 1.5, -0.9);
    alcoveBack.receiveShadow = true;
    leftAlcove.add(alcoveBack);

    this.room.add(leftAlcove);

    // Right alcove
    const rightAlcove = new THREE.Group();
    rightAlcove.position.set(6, 0, -2);

    const rightBack = new THREE.Mesh(
      new THREE.BoxGeometry(2, 3, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x2a2a2f, roughness: 1 })
    );
    rightBack.position.set(0, 1.5, -0.9);
    rightBack.receiveShadow = true;
    rightAlcove.add(rightBack);

    this.room.add(rightAlcove);
  }

  private addDebris(): void {
    // Broken censer on floor
    const censerGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const censerMaterial = new THREE.MeshStandardMaterial({
      color: 0xaa8844,
      roughness: 0.4,
      metalness: 0.8
    });

    const censer = new THREE.Mesh(censerGeometry, censerMaterial);
    censer.position.set(-2, 0.2, 1);
    censer.castShadow = true;
    this.room.add(censer);

    // Stone basin (for reflection puzzle)
    const basinGeometry = new THREE.CylinderGeometry(0.6, 0.5, 0.8, 16);
    const basinMaterial = new THREE.MeshStandardMaterial({
      color: 0x404045,
      roughness: 0.8
    });

    const basin = new THREE.Mesh(basinGeometry, basinMaterial);
    basin.position.set(5, 0.4, -1);
    basin.castShadow = true;
    basin.receiveShadow = true;
    this.room.add(basin);

    // Water in basin (dark, reflective)
    const waterGeometry = new THREE.CircleGeometry(0.55, 32);
    const waterMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0a0f,
      roughness: 0.1,
      metalness: 0.95
    });

    const water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2;
    water.position.set(5, 0.81, -1);
    this.room.add(water);
  }

  private setupLighting(): void {
    // Cold blue moonlight from high window (simulated)
    const moonlight = new THREE.DirectionalLight(0x4466bb, 0.3);
    moonlight.position.set(2, 10, -3);
    moonlight.castShadow = true;
    moonlight.shadow.mapSize.width = 2048;
    moonlight.shadow.mapSize.height = 2048;
    this.room.add(moonlight);

    // Four wall sconces with warm candles
    const candlePositions = [
      new THREE.Vector3(-6, 2.5, -3),
      new THREE.Vector3(6, 2.5, -3),
      new THREE.Vector3(-6, 2.5, 3),
      new THREE.Vector3(6, 2.5, 3)
    ];

    candlePositions.forEach((pos) => {
      const candleLight = new THREE.PointLight(0xffaa44, 1.5, 8, 2);
      candleLight.position.copy(pos);
      candleLight.castShadow = true;
      this.room.add(candleLight);
      this.candles.push(candleLight);

      // Visual candle flame (small glowing sphere)
      const flameGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const flameMaterial = new THREE.MeshBasicMaterial({
        color: 0xffaa44,
        transparent: true,
        opacity: 0.8
      });
      const flame = new THREE.Mesh(flameGeometry, flameMaterial);
      flame.position.copy(pos);
      this.room.add(flame);
    });
  }

  private addInteractables(): void {
    // TODO: Add interactable objects with InteractionSystem
    // - Loose flagstone (reveals clue)
    // - Stone basin (reflection puzzle)
    // - Confession booth
    // - Locked door (requires progression)
  }

  public update(delta: number): void {
    // Candle flickering
    this.candleFlickerTimer += delta;

    if (this.candleFlickerTimer > 0.05) {
      this.candles.forEach(candle => {
        const flicker = 1.3 + Math.random() * 0.4;
        candle.intensity = flicker;
      });
      this.candleFlickerTimer = 0;
    }
  }

  public dispose(): void {
    // Clean up resources
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
