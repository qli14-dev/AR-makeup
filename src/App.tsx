import { useState, useCallback, useRef } from 'react';
import ARMakeupCanvas from './components/ARMakeupCanvas';
import ControlPanel from './components/ControlPanel';
import { useMakeup } from './hooks/useMakeup';
import { MakeupRenderer } from './utils/makeupRenderer';
import './App.css';

function App() {
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

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">✨ AR Makeup Studio</h1>
          <p className="app-subtitle">Real-time Face Tracking & Interactive Makeup</p>
        </div>
        <button
          className="toggle-panel-btn"
          onClick={() => setIsControlPanelOpen(!isControlPanelOpen)}
          aria-label="Toggle control panel"
        >
          {isControlPanelOpen ? '← Hide' : 'Show →'}
        </button>
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
