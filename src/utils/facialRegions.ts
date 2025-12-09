import { FacialRegion, MakeupType } from '../types';

// MediaPipe Face Mesh provides 468 3D facial landmarks
// These indices define the regions for different makeup types

export const FACIAL_REGIONS: Record<MakeupType, FacialRegion> = {
  eyeshadow: {
    name: 'Eye Shadow',
    // Left eye region (upper eyelid and surrounding area)
    // Right eye region (upper eyelid and surrounding area)
    indices: [
      // Left eye
      33, 7, 163, 144, 145, 153, 154, 155, 133,
      246, 161, 160, 159, 158, 157, 173, 190, 56, 28, 27, 29, 30,
      // Right eye
      263, 249, 390, 373, 374, 380, 381, 382, 362,
      466, 388, 387, 386, 385, 384, 398, 414, 286, 258, 257, 259, 260,
      // Bridge area
      6, 168, 122, 351
    ]
  },
  lipstick: {
    name: 'Lipstick',
    // Upper and lower lip contours
    indices: [
      // Upper outer lip
      61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291,
      // Lower outer lip
      146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
      // Upper inner lip
      78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308,
      // Lower inner lip
      78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308,
      // Corners
      61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185
    ]
  },
  blush: {
    name: 'Blush',
    // Cheek areas
    indices: [
      // Left cheek
      116, 123, 147, 213, 192, 214, 212, 202, 211, 210, 169, 135, 138,
      // Right cheek
      345, 352, 376, 433, 416, 434, 432, 422, 431, 430, 394, 364, 367,
      // Upper cheek areas
      50, 101, 119, 118, 117, 118, 119, 101, 50,
      280, 330, 348, 347, 346, 347, 348, 330, 280
    ]
  },
  contour: {
    name: 'Contour',
    // Face contour and jawline
    indices: [
      // Jawline
      172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454, 356, 389,
      // Forehead sides
      21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251,
      // Temples
      127, 162, 21, 54, 103, 67, 109, 10, 338, 297, 332, 284, 251, 389, 356
    ]
  },
  eyeliner: {
    name: 'Eyeliner',
    // Eye contours for liner
    indices: [
      // Left eye outline
      33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7,
      // Right eye outline
      263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249
    ]
  },
  brows: {
    name: 'Eyebrows',
    // Eyebrow regions
    indices: [
      // Left eyebrow
      70, 63, 105, 66, 107, 55, 65, 52, 53, 46,
      // Right eyebrow
      300, 293, 334, 296, 336, 285, 295, 282, 283, 276
    ]
  }
};

// Helper function to get all landmarks for a specific region
export function getRegionLandmarks(region: MakeupType): number[] {
  return FACIAL_REGIONS[region].indices;
}

// Helper function to check if a landmark index belongs to a region
export function isLandmarkInRegion(landmarkIndex: number, region: MakeupType): boolean {
  return FACIAL_REGIONS[region].indices.includes(landmarkIndex);
}

// Get the polygon path for a region given landmarks
export function getRegionPolygon(region: MakeupType, landmarks: { x: number; y: number; z: number }[]): { x: number; y: number }[] {
  const indices = getRegionLandmarks(region);
  return indices.map(idx => ({
    x: landmarks[idx].x,
    y: landmarks[idx].y
  }));
}

// Check if a point is inside a polygon using ray casting algorithm
export function isPointInPolygon(point: { x: number; y: number }, polygon: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect = ((yi > point.y) !== (yj > point.y)) &&
      (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }
  return inside;
}

// Get the nearest landmark in a region to a given point
export function getNearestLandmarkInRegion(
  point: { x: number; y: number },
  region: MakeupType,
  landmarks: { x: number; y: number; z: number }[]
): number | null {
  const indices = getRegionLandmarks(region);
  let minDist = Infinity;
  let nearestIdx = null;

  for (const idx of indices) {
    const lm = landmarks[idx];
    const dist = Math.sqrt((lm.x - point.x) ** 2 + (lm.y - point.y) ** 2);
    if (dist < minDist) {
      minDist = dist;
      nearestIdx = idx;
    }
  }

  return nearestIdx;
}

// Create a smooth mask for a region with soft edges
export function createRegionMask(
  region: MakeupType,
  landmarks: { x: number; y: number; z: number }[],
  width: number,
  height: number,
  featherRadius: number = 10
): ImageData {
  const imageData = new ImageData(width, height);
  const polygon = getRegionPolygon(region, landmarks);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const point = { x, y };
      const idx = (y * width + x) * 4;

      if (isPointInPolygon(point, polygon)) {
        // Inside the region - calculate distance to edge for soft feathering
        const distToEdge = getDistanceToPolygonEdge(point, polygon);
        const alpha = Math.min(1, distToEdge / featherRadius);

        imageData.data[idx] = 255;     // R
        imageData.data[idx + 1] = 255; // G
        imageData.data[idx + 2] = 255; // B
        imageData.data[idx + 3] = Math.floor(alpha * 255); // A
      }
    }
  }

  return imageData;
}

// Helper to calculate distance from point to polygon edge
function getDistanceToPolygonEdge(point: { x: number; y: number }, polygon: { x: number; y: number }[]): number {
  let minDist = Infinity;

  for (let i = 0; i < polygon.length; i++) {
    const p1 = polygon[i];
    const p2 = polygon[(i + 1) % polygon.length];
    const dist = distanceToLineSegment(point, p1, p2);
    minDist = Math.min(minDist, dist);
  }

  return minDist;
}

// Calculate distance from point to line segment
function distanceToLineSegment(
  point: { x: number; y: number },
  lineStart: { x: number; y: number },
  lineEnd: { x: number; y: number }
): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const lengthSquared = dx * dx + dy * dy;

  if (lengthSquared === 0) {
    return Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2);
  }

  let t = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / lengthSquared;
  t = Math.max(0, Math.min(1, t));

  const projX = lineStart.x + t * dx;
  const projY = lineStart.y + t * dy;

  return Math.sqrt((point.x - projX) ** 2 + (point.y - projY) ** 2);
}
