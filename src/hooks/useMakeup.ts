import { useState, useCallback, useRef } from 'react';
import { MakeupStroke, BrushSettings, Point } from '../types';

export function useMakeup() {
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    size: 20,
    color: '#ff6b9d',
    opacity: 0.7,
    activeRegion: 'lipstick',
    blendMode: 'multiply'
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<Point[]>([]);
  const historyRef = useRef<MakeupStroke[]>([]);
  const redoStackRef = useRef<MakeupStroke[]>([]);

  const updateBrushSettings = useCallback((updates: Partial<BrushSettings>) => {
    setBrushSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const startStroke = useCallback((point: Point) => {
    setIsDrawing(true);
    currentStrokeRef.current = [point];
    redoStackRef.current = []; // Clear redo stack on new action
  }, []);

  const addPointToStroke = useCallback((point: Point) => {
    if (isDrawing) {
      currentStrokeRef.current.push(point);
    }
  }, [isDrawing]);

  const endStroke = useCallback((): MakeupStroke | null => {
    if (!isDrawing || currentStrokeRef.current.length === 0) {
      setIsDrawing(false);
      return null;
    }

    const stroke: MakeupStroke = {
      points: [...currentStrokeRef.current],
      color: brushSettings.color,
      size: brushSettings.size,
      opacity: brushSettings.opacity,
      timestamp: Date.now(),
      region: brushSettings.activeRegion
    };

    historyRef.current.push(stroke);
    currentStrokeRef.current = [];
    setIsDrawing(false);

    return stroke;
  }, [isDrawing, brushSettings]);

  const undo = useCallback((): MakeupStroke | null => {
    const lastStroke = historyRef.current.pop();
    if (lastStroke) {
      redoStackRef.current.push(lastStroke);
      return lastStroke;
    }
    return null;
  }, []);

  const redo = useCallback((): MakeupStroke | null => {
    const stroke = redoStackRef.current.pop();
    if (stroke) {
      historyRef.current.push(stroke);
      return stroke;
    }
    return null;
  }, []);

  const clear = useCallback(() => {
    historyRef.current = [];
    redoStackRef.current = [];
    currentStrokeRef.current = [];
    setIsDrawing(false);
  }, []);

  const canUndo = historyRef.current.length > 0;
  const canRedo = redoStackRef.current.length > 0;

  return {
    brushSettings,
    updateBrushSettings,
    isDrawing,
    currentStroke: currentStrokeRef.current,
    startStroke,
    addPointToStroke,
    endStroke,
    undo,
    redo,
    clear,
    canUndo,
    canRedo,
    history: historyRef.current
  };
}
