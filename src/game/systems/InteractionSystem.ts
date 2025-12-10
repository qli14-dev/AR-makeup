/**
 * Interaction System
 * Handles object highlighting, examination, and interaction
 */

import * as THREE from 'three';

export interface InteractableObject {
  mesh: THREE.Object3D;
  id: string;
  type: 'pickup' | 'examine' | 'activate' | 'door' | 'puzzle';
  onInteract: () => void;
  name: string;
  description?: string;
}

export class InteractionSystem {
  private camera: THREE.Camera;
  private raycaster: THREE.Raycaster;
  private interactables: InteractableObject[] = [];
  private currentTarget: InteractableObject | null = null;

  constructor(_scene: THREE.Scene, camera: THREE.Camera, raycaster: THREE.Raycaster) {
    this.camera = camera;
    this.raycaster = raycaster;
  }

  public registerInteractable(obj: InteractableObject): void {
    this.interactables.push(obj);
  }

  public unregisterInteractable(id: string): void {
    this.interactables = this.interactables.filter(obj => obj.id !== id);
  }

  public update(): void {
    // Cast ray from center of screen
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

    const meshes = this.interactables.map(obj => obj.mesh);
    const intersects = this.raycaster.intersectObjects(meshes, true);

    // Clear previous highlight
    if (this.currentTarget) {
      this.unhighlightObject(this.currentTarget);
      this.currentTarget = null;
      this.hideInteractionPrompt();
    }

    // Check for new target
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const interactable = this.interactables.find(obj =>
        obj.mesh === hitMesh || obj.mesh.children.includes(hitMesh)
      );

      if (interactable) {
        this.currentTarget = interactable;
        this.highlightObject(interactable);
        this.showInteractionPrompt(interactable.name, interactable.type);
      }
    }
  }

  private highlightObject(obj: InteractableObject): void {
    // Add subtle glow effect
    obj.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (!child.userData.originalEmissive) {
          child.userData.originalEmissive = child.material.emissive ? child.material.emissive.clone() : new THREE.Color(0x000000);
        }
        if (child.material.emissive) {
          child.material.emissive.setHex(0x443311);
        }
      }
    });
  }

  private unhighlightObject(obj: InteractableObject): void {
    obj.mesh.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData.originalEmissive) {
        if (child.material.emissive) {
          child.material.emissive.copy(child.userData.originalEmissive);
        }
      }
    });
  }

  private showInteractionPrompt(name: string, type: string): void {
    const prompt = document.getElementById('interaction-prompt');
    if (prompt) {
      let action = 'Interact';
      switch (type) {
        case 'pickup':
          action = 'Pick up';
          break;
        case 'examine':
          action = 'Examine';
          break;
        case 'activate':
          action = 'Activate';
          break;
        case 'door':
          action = 'Open';
          break;
        case 'puzzle':
          action = 'Interact';
          break;
      }
      prompt.textContent = `[E] ${action}: ${name}`;
      prompt.style.display = 'block';
    }
  }

  private hideInteractionPrompt(): void {
    const prompt = document.getElementById('interaction-prompt');
    if (prompt) {
      prompt.style.display = 'none';
    }
  }

  public interact(): void {
    if (this.currentTarget) {
      this.currentTarget.onInteract();
      console.log(`Interacted with: ${this.currentTarget.name}`);
    }
  }

  public getTargetedObject(): InteractableObject | null {
    return this.currentTarget;
  }
}
