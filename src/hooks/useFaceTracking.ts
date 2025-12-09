import { useEffect, useRef, useState, useCallback } from 'react';
import { FaceTracker, LandmarkSmoother } from '../utils/faceTracking';
import { FaceLandmarks, Point3D } from '../types';

export function useFaceTracking(videoElement: HTMLVideoElement | null) {
  const [landmarks, setLandmarks] = useState<Point3D[] | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const trackerRef = useRef<FaceTracker | null>(null);
  const smootherRef = useRef<LandmarkSmoother>(new LandmarkSmoother());

  const handleResults = useCallback((results: FaceLandmarks | null) => {
    if (results && results.landmarks.length > 0) {
      // Smooth landmarks to reduce jitter
      const smoothed = smootherRef.current.smooth(results.landmarks);
      setLandmarks(smoothed);
    } else {
      setLandmarks(null);
    }
  }, []);

  useEffect(() => {
    if (!videoElement) return;

    const tracker = new FaceTracker();
    trackerRef.current = tracker;

    const initTracker = async () => {
      try {
        await tracker.initialize(videoElement, handleResults);
        await tracker.start();
        setIsTracking(true);
        setError(null);
      } catch (err) {
        console.error('Face tracking error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsTracking(false);
      }
    };

    initTracker();

    return () => {
      tracker.destroy();
      trackerRef.current = null;
      setIsTracking(false);
      smootherRef.current.reset();
    };
  }, [videoElement, handleResults]);

  const switchCamera = useCallback(async (facingMode: 'user' | 'environment') => {
    if (trackerRef.current) {
      try {
        await trackerRef.current.switchCamera(facingMode);
        smootherRef.current.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to switch camera');
      }
    }
  }, []);

  return {
    landmarks,
    isTracking,
    error,
    switchCamera
  };
}
