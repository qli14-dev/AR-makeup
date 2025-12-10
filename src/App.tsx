import { useState, useCallback, useRef } from 'react';
import ARMakeupCanvas from './components/ARMakeupCanvas';
import ControlPanel from './components/ControlPanel';
import HorrorGame from './components/HorrorGame';
import { useMakeup } from './hooks/useMakeup';
import { MakeupRenderer } from './utils/makeupRenderer';
import './App.css';

type AppMode = 'makeup' | 'horror';

function App() {
  const [mode, setMode] = useState<AppMode>('makeup');
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const rendererRef = useRef<MakeupRenderer | null>(null);

  const {
    brushSettings,
    updateBrushSettings,
    undo,
    redo,
    clear,
    canUndo,
    canRedo
  } = useMakeup();

  const handleRendererReady = useCallback((renderer: MakeupRenderer) => {
    rendererRef.current = renderer;
  }, []);

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

  // 恐怖游戏模式
  if (mode === 'horror') {
    return (
      <div className="app horror-mode">
        <button
          className="mode-switch-btn horror-exit"
          onClick={() => setMode('makeup')}
          aria-label="Exit Horror Mode"
        >
          退出恐怖模式
        </button>
        <HorrorGame />
      </div>
    );
  }

  // AR化妆模式
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✨ AR Makeup Studio</h1>
          <p className="app-subtitle">Real-time Face Tracking & Interactive Makeup</p>
        </div>
        <div className="header-actions">
          <button
            className="mode-switch-btn"
            onClick={() => setMode('horror')}
            aria-label="Switch to Horror Mode"
          >
            🎃 恐怖模式
          </button>
          <button
            className="toggle-panel-btn"
            onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
            aria-label="Toggle control panel"
          >
            {isControlPanelOpen ? '← Hide' : 'Show →'}
          </button>
        </div>
      </header>

      <div className="app-content">
        <div className="canvas-section">
          <ARMakeupCanvas onRendererReady={handleRendererReady} />
        </div>

        <aside className={`controls-section ${isControlPanelOpen ? 'open' : 'closed'}`}>
          <ControlPanel
            brushSettings={brushSettings}
            onBrushSettingsChange={updateBrushSettings}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </aside>
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <span>Powered by MediaPipe Face Mesh</span>
          <span className="separator">•</span>
          <span>468 Facial Landmarks</span>
          <span className="separator">•</span>
          <span>Real-time 30-60 FPS</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
