import { useRef, useEffect, useCallback, useState } from 'react';
import { MakeupRenderer } from '../utils/makeupRenderer';
import { useFaceTracking } from '../hooks/useFaceTracking';
import { useMakeup } from '../hooks/useMakeup';
import { getRegionPolygon, isPointInPolygon } from '../utils/facialRegions';
import { Point } from '../types';
import './ARMakeupCanvas.css';

interface ARMakeupCanvasProps {
  onRendererReady?: (renderer: MakeupRenderer) => void;
}

export const ARMakeupCanvas: React.FC<ARMakeupCanvasProps> = ({ onRendererReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MakeupRenderer | null>(null);
  const animationFrameRef = useRef<number>();

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  const { landmarks, isTracking, error, switchCamera } = useFaceTracking(
    isVideoReady ? videoRef.current : null
  );

  const {
    brushSettings,
    isDrawing,
    startStroke,
    addPointToStroke,
    endStroke,
    undo,
    redo,
    clear,
    canUndo,
    canRedo
  } = useMakeup();

  // Initialize video stream
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
          }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setIsVideoReady(true);
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    initCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  // Initialize renderer
  useEffect(() => {
    if (!canvasRef.current || !videoRef.current || !isVideoReady) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    const renderer = new MakeupRenderer(canvas);
    renderer.setVideoElement(video);
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

    rendererRef.current = renderer;

    if (onRendererReady) {
      onRendererReady(renderer);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoReady, onRendererReady]);

  // Update landmarks in renderer
  useEffect(() => {
    if (rendererRef.current && landmarks) {
      rendererRef.current.updateLandmarks(landmarks);
    }
  }, [landmarks]);

  // Render loop
  useEffect(() => {
    if (!rendererRef.current) return;

    const render = () => {
      rendererRef.current?.render();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isVideoReady]);

  // Handle mouse/touch interactions
  const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    if (!canvasRef.current) return { x: 0, y: 0 };

    const rect = canvasRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Mirror x coordinate to match video
    const x = canvasRef.current.width - (clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height);

    return { x, y };
  }, []);

  const isPointInActiveRegion = useCallback((point: Point): boolean => {
    if (!landmarks || landmarks.length === 0) return false;

    const pixelLandmarks = landmarks.map(lm => ({
      x: lm.x * (canvasRef.current?.width || 0),
      y: lm.y * (canvasRef.current?.height || 0),
      z: lm.z
    }));

    const regionPolygon = getRegionPolygon(brushSettings.activeRegion, pixelLandmarks);
    return isPointInPolygon(point, regionPolygon);
  }, [landmarks, brushSettings.activeRegion]);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);

    // Only start drawing if point is in the active region
    if (isPointInActiveRegion(point)) {
      startStroke(point);
    }
  }, [getCanvasPoint, isPointInActiveRegion, startStroke]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const point = getCanvasPoint(e);

    // Only add point if it's in the active region
    if (isPointInActiveRegion(point)) {
      addPointToStroke(point);
    }
  }, [isDrawing, getCanvasPoint, isPointInActiveRegion, addPointToStroke]);

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const stroke = endStroke();
    if (stroke && rendererRef.current) {
      rendererRef.current.addStroke(stroke);
    }
  }, [isDrawing, endStroke]);

  const handleUndo = useCallback(() => {
    undo();
    if (rendererRef.current) {
      rendererRef.current.undoStroke();
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const stroke = redo();
    if (stroke && rendererRef.current) {
      rendererRef.current.addStroke(stroke);
    }
  }, [redo]);

  const handleClear = useCallback(() => {
    clear();
    if (rendererRef.current) {
      rendererRef.current.clearAllMakeup();
    }
  }, [clear]);

  const handleSwitchCamera = useCallback(async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setIsVideoReady(false);
    try {
      await switchCamera(newMode);
    } catch (err) {
      console.error('Failed to switch camera:', err);
    }
  }, [facingMode, switchCamera]);

  return (
    <div className="ar-makeup-canvas-container">
      <video
        ref={videoRef}
        className="video-element"
        playsInline
        muted
        style={{ display: 'none' }}
      />

      <canvas
        ref={canvasRef}
        className="makeup-canvas"
        onMouseDown={handlePointerDown}
        onMouseMove={handlePointerMove}
        onMouseUp={handlePointerUp}
        onMouseLeave={handlePointerUp}
        onTouchStart={handlePointerDown}
        onTouchMove={handlePointerMove}
        onTouchEnd={handlePointerUp}
      />

      {/* Status overlay */}
      <div className="status-overlay">
        {!isVideoReady && <div className="status-message">Initializing camera...</div>}
        {isVideoReady && !isTracking && <div className="status-message">Detecting face...</div>}
        {error && <div className="status-error">Error: {error}</div>}
        {isTracking && landmarks && (
          <div className="status-success">Face tracked • {landmarks.length} landmarks</div>
        )}
      </div>

      {/* Quick controls overlay */}
      <div className="quick-controls">
        <button
          className="control-btn"
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo"
        >
          ↶
        </button>
        <button
          className="control-btn"
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo"
        >
          ↷
        </button>
        <button
          className="control-btn"
          onClick={handleClear}
          title="Clear All"
        >
          ✕
        </button>
        <button
          className="control-btn"
          onClick={handleSwitchCamera}
          title="Switch Camera"
        >
          ⟳
        </button>
      </div>
    </div>
  );
};

export default ARMakeupCanvas;
