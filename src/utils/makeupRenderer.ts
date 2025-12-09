import { Point3D, MakeupLayer, MakeupStroke, MakeupType } from '../types';
import { getRegionPolygon } from './facialRegions';

export class MakeupRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private videoElement: HTMLVideoElement | null = null;
  private layers: MakeupLayer[] = [];
  private currentLandmarks: Point3D[] | null = null;
  private width: number = 0;
  private height: number = 0;

  // Separate canvas for makeup layer
  private makeupCanvas: HTMLCanvasElement;
  private makeupCtx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    // Create offscreen canvas for makeup
    this.makeupCanvas = document.createElement('canvas');
    const makeupCtx = this.makeupCanvas.getContext('2d', { willReadFrequently: true });
    if (!makeupCtx) throw new Error('Could not get makeup canvas context');
    this.makeupCtx = makeupCtx;
  }

  setVideoElement(video: HTMLVideoElement): void {
    this.videoElement = video;
  }

  setSize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.makeupCanvas.width = width;
    this.makeupCanvas.height = height;
  }

  updateLandmarks(landmarks: Point3D[] | null): void {
    this.currentLandmarks = landmarks;
  }

  render(): void {
    if (!this.videoElement) return;

    // Clear main canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw video feed
    this.ctx.save();
    this.ctx.scale(-1, 1); // Mirror the video
    this.ctx.drawImage(this.videoElement, -this.width, 0, this.width, this.height);
    this.ctx.restore();

    // Draw makeup layers if we have landmarks
    if (this.currentLandmarks && this.currentLandmarks.length > 0) {
      this.renderMakeupLayers();
    }
  }

  private renderMakeupLayers(): void {
    if (!this.currentLandmarks) return;

    // Clear makeup canvas
    this.makeupCtx.clearRect(0, 0, this.width, this.height);

    // Convert normalized landmarks to pixel coordinates
    const pixelLandmarks = this.currentLandmarks.map(lm => ({
      x: lm.x * this.width,
      y: lm.y * this.height,
      z: lm.z
    }));

    // Render each visible layer
    for (const layer of this.layers) {
      if (!layer.visible) continue;

      this.makeupCtx.save();
      this.makeupCtx.globalAlpha = layer.opacity;
      this.makeupCtx.globalCompositeOperation = layer.blendMode as GlobalCompositeOperation;

      // Render all strokes in this layer
      for (const stroke of layer.strokes) {
        this.renderStroke(stroke, pixelLandmarks);
      }

      this.makeupCtx.restore();
    }

    // Composite makeup onto main canvas
    this.ctx.save();
    this.ctx.scale(-1, 1); // Mirror to match video
    this.ctx.drawImage(this.makeupCanvas, -this.width, 0, this.width, this.height);
    this.ctx.restore();
  }

  private renderStroke(stroke: MakeupStroke, landmarks: Point3D[]): void {
    if (stroke.points.length === 0) return;

    // Create a clipping region for the stroke's makeup type
    const region = getRegionPolygon(stroke.region, landmarks);

    this.makeupCtx.save();

    // Set up clipping path
    this.makeupCtx.beginPath();
    region.forEach((point, idx) => {
      if (idx === 0) {
        this.makeupCtx.moveTo(point.x, point.y);
      } else {
        this.makeupCtx.lineTo(point.x, point.y);
      }
    });
    this.makeupCtx.closePath();
    this.makeupCtx.clip();

    // Set stroke style
    this.makeupCtx.globalAlpha = stroke.opacity;
    this.makeupCtx.strokeStyle = stroke.color;
    this.makeupCtx.lineWidth = stroke.size;
    this.makeupCtx.lineCap = 'round';
    this.makeupCtx.lineJoin = 'round';

    // Draw the stroke with soft edges
    for (let i = 0; i < stroke.points.length - 1; i++) {
      const p1 = stroke.points[i];

      // Create gradient for soft brush effect
      const gradient = this.makeupCtx.createRadialGradient(
        p1.x, p1.y, 0,
        p1.x, p1.y, stroke.size / 2
      );
      gradient.addColorStop(0, stroke.color);
      gradient.addColorStop(0.5, this.hexToRgba(stroke.color, stroke.opacity * 0.7));
      gradient.addColorStop(1, this.hexToRgba(stroke.color, 0));

      this.makeupCtx.fillStyle = gradient;
      this.makeupCtx.beginPath();
      this.makeupCtx.arc(p1.x, p1.y, stroke.size / 2, 0, Math.PI * 2);
      this.makeupCtx.fill();
    }

    // Connect points with smooth curves
    if (stroke.points.length > 1) {
      this.makeupCtx.beginPath();
      this.makeupCtx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length - 1; i++) {
        const xc = (stroke.points[i].x + stroke.points[i + 1].x) / 2;
        const yc = (stroke.points[i].y + stroke.points[i + 1].y) / 2;
        this.makeupCtx.quadraticCurveTo(stroke.points[i].x, stroke.points[i].y, xc, yc);
      }

      if (stroke.points.length > 1) {
        const last = stroke.points[stroke.points.length - 1];
        this.makeupCtx.lineTo(last.x, last.y);
      }

      this.makeupCtx.stroke();
    }

    this.makeupCtx.restore();
  }

  // Add a stroke to the current layer
  addStroke(stroke: MakeupStroke, layerId?: string): void {
    let layer = this.layers.find(l => l.type === stroke.region);

    if (!layer) {
      // Create new layer for this makeup type
      layer = {
        id: layerId || `layer_${Date.now()}`,
        type: stroke.region,
        strokes: [],
        opacity: 1.0,
        blendMode: 'multiply',
        visible: true
      };
      this.layers.push(layer);
    }

    layer.strokes.push(stroke);
  }

  // Remove the last stroke from a layer
  undoStroke(region?: MakeupType): boolean {
    if (region) {
      const layer = this.layers.find(l => l.type === region);
      if (layer && layer.strokes.length > 0) {
        layer.strokes.pop();
        return true;
      }
    } else {
      // Undo last stroke from any layer
      for (let i = this.layers.length - 1; i >= 0; i--) {
        if (this.layers[i].strokes.length > 0) {
          this.layers[i].strokes.pop();
          return true;
        }
      }
    }
    return false;
  }

  // Clear all makeup
  clearAllMakeup(): void {
    this.layers = [];
    this.makeupCtx.clearRect(0, 0, this.width, this.height);
  }

  // Clear makeup for a specific region
  clearRegion(region: MakeupType): void {
    const layerIndex = this.layers.findIndex(l => l.type === region);
    if (layerIndex !== -1) {
      this.layers.splice(layerIndex, 1);
    }
  }

  // Set layer opacity
  setLayerOpacity(region: MakeupType, opacity: number): void {
    const layer = this.layers.find(l => l.type === region);
    if (layer) {
      layer.opacity = Math.max(0, Math.min(1, opacity));
    }
  }

  // Toggle layer visibility
  toggleLayerVisibility(region: MakeupType): void {
    const layer = this.layers.find(l => l.type === region);
    if (layer) {
      layer.visible = !layer.visible;
    }
  }

  // Get all layers
  getLayers(): MakeupLayer[] {
    return this.layers;
  }

  // Helper to convert hex color to rgba
  private hexToRgba(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Draw debug landmarks (optional, for development)
  drawLandmarks(landmarks: Point3D[], color: string = '#00ff00'): void {
    const pixelLandmarks = landmarks.map(lm => ({
      x: lm.x * this.width,
      y: lm.y * this.height,
      z: lm.z
    }));

    this.ctx.save();
    this.ctx.scale(-1, 1);

    for (const lm of pixelLandmarks) {
      this.ctx.beginPath();
      this.ctx.arc(-lm.x, lm.y, 1, 0, Math.PI * 2);
      this.ctx.fillStyle = color;
      this.ctx.fill();
    }

    this.ctx.restore();
  }
}
