export interface Point {
  x: number;
  y: number;
}

export interface Point3D extends Point {
  z: number;
}

export interface FaceLandmarks {
  landmarks: Point3D[];
  timestamp: number;
}

export interface FacialRegion {
  name: string;
  indices: number[];
  color?: string;
}

export type MakeupType = 'eyeshadow' | 'lipstick' | 'blush' | 'contour' | 'eyeliner' | 'brows';

export interface MakeupLayer {
  id: string;
  type: MakeupType;
  strokes: MakeupStroke[];
  opacity: number;
  blendMode: string;
  visible: boolean;
}

export interface MakeupStroke {
  points: Point[];
  color: string;
  size: number;
  opacity: number;
  timestamp: number;
  region: MakeupType;
}

export interface BrushSettings {
  size: number;
  color: string;
  opacity: number;
  activeRegion: MakeupType;
  blendMode: 'normal' | 'multiply' | 'overlay' | 'screen';
}

export interface CameraSettings {
  facingMode: 'user' | 'environment';
  width: number;
  height: number;
}
