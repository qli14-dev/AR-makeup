import { FaceMesh, Results, NormalizedLandmarkList } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';
import { FaceLandmarks, Point3D } from '../types';

export class FaceTracker {
  private faceMesh: FaceMesh | null = null;
  private camera: Camera | null = null;
  private videoElement: HTMLVideoElement | null = null;
  private onResultsCallback: ((results: FaceLandmarks | null) => void) | null = null;
  private isInitialized = false;
  private isRunning = false;

  constructor() {}

  async initialize(videoElement: HTMLVideoElement, onResults: (results: FaceLandmarks | null) => void): Promise<void> {
    this.videoElement = videoElement;
    this.onResultsCallback = onResults;

    // Initialize MediaPipe Face Mesh
    this.faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      }
    });

    // Configure Face Mesh for high accuracy
    this.faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true, // Enables iris tracking and more detailed mesh
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Set up results handler
    this.faceMesh.onResults((results: Results) => {
      this.handleResults(results);
    });

    // Initialize camera
    this.camera = new Camera(videoElement, {
      onFrame: async () => {
        if (this.faceMesh && this.isRunning) {
          await this.faceMesh.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    this.isInitialized = true;
  }

  private handleResults(results: Results): void {
    if (!this.onResultsCallback) return;

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const landmarks = results.multiFaceLandmarks[0];
      const faceLandmarks: FaceLandmarks = {
        landmarks: this.normalizeLandmarks(landmarks),
        timestamp: Date.now()
      };
      this.onResultsCallback(faceLandmarks);
    } else {
      this.onResultsCallback(null);
    }
  }

  private normalizeLandmarks(landmarks: NormalizedLandmarkList): Point3D[] {
    return landmarks.map(lm => ({
      x: lm.x,
      y: lm.y,
      z: lm.z || 0
    }));
  }

  async start(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('FaceTracker not initialized. Call initialize() first.');
    }

    this.isRunning = true;
    if (this.camera) {
      await this.camera.start();
    }
  }

  stop(): void {
    this.isRunning = false;
    if (this.camera) {
      this.camera.stop();
    }
  }

  async switchCamera(facingMode: 'user' | 'environment'): Promise<void> {
    if (!this.videoElement) return;

    // Stop current camera
    this.stop();

    // Get new stream with different facing mode
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      this.videoElement.srcObject = stream;

      // Reinitialize camera
      if (this.videoElement && this.onResultsCallback) {
        await this.initialize(this.videoElement, this.onResultsCallback);
        await this.start();
      }
    } catch (error) {
      console.error('Error switching camera:', error);
      throw error;
    }
  }

  destroy(): void {
    this.stop();
    if (this.faceMesh) {
      this.faceMesh.close();
      this.faceMesh = null;
    }
    this.camera = null;
    this.videoElement = null;
    this.onResultsCallback = null;
    this.isInitialized = false;
  }
}

// Helper function to convert normalized coordinates to pixel coordinates
export function normalizedToPixelCoords(
  normalizedLandmarks: Point3D[],
  width: number,
  height: number
): Point3D[] {
  return normalizedLandmarks.map(lm => ({
    x: lm.x * width,
    y: lm.y * height,
    z: lm.z * width // Scale z by width for consistency
  }));
}

// Helper function to smooth landmarks over time (reduce jitter)
export class LandmarkSmoother {
  private history: Point3D[][] = [];
  private maxHistoryLength = 3;

  smooth(landmarks: Point3D[]): Point3D[] {
    this.history.push(landmarks);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    if (this.history.length === 1) {
      return landmarks;
    }

    // Average landmarks over history
    const smoothed: Point3D[] = [];
    for (let i = 0; i < landmarks.length; i++) {
      let sumX = 0, sumY = 0, sumZ = 0;
      for (const frame of this.history) {
        sumX += frame[i].x;
        sumY += frame[i].y;
        sumZ += frame[i].z;
      }
      smoothed.push({
        x: sumX / this.history.length,
        y: sumY / this.history.length,
        z: sumZ / this.history.length
      });
    }

    return smoothed;
  }

  reset(): void {
    this.history = [];
  }
}
