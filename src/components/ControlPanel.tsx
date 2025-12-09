import React from 'react';
import { BrushSettings, MakeupType } from '../types';
import './ControlPanel.css';

interface ControlPanelProps {
  brushSettings: BrushSettings;
  onBrushSettingsChange: (settings: Partial<BrushSettings>) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onClear?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

const MAKEUP_TYPES: { type: MakeupType; label: string; icon: string; defaultColor: string }[] = [
  { type: 'lipstick', label: 'Lipstick', icon: '💄', defaultColor: '#ff6b9d' },
  { type: 'eyeshadow', label: 'Eyeshadow', icon: '👁️', defaultColor: '#c8a2c8' },
  { type: 'blush', label: 'Blush', icon: '🌸', defaultColor: '#ffb3ba' },
  { type: 'contour', label: 'Contour', icon: '✨', defaultColor: '#d4a574' },
  { type: 'eyeliner', label: 'Eyeliner', icon: '✏️', defaultColor: '#2c2c2c' },
  { type: 'brows', label: 'Brows', icon: '👁️', defaultColor: '#5c4033' }
];

const BLEND_MODES = [
  { value: 'normal', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'screen', label: 'Screen' }
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  brushSettings,
  onBrushSettingsChange,
  onUndo,
  onRedo,
  onClear,
  canUndo = false,
  canRedo = false
}) => {
  const handleMakeupTypeChange = (type: MakeupType) => {
    const makeupConfig = MAKEUP_TYPES.find(m => m.type === type);
    onBrushSettingsChange({
      activeRegion: type,
      color: makeupConfig?.defaultColor || brushSettings.color
    });
  };

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3 className="section-title">Makeup Type</h3>
        <div className="makeup-type-grid">
          {MAKEUP_TYPES.map(makeup => (
            <button
              key={makeup.type}
              className={`makeup-type-btn ${brushSettings.activeRegion === makeup.type ? 'active' : ''}`}
              onClick={() => handleMakeupTypeChange(makeup.type)}
              title={makeup.label}
            >
              <span className="makeup-icon">{makeup.icon}</span>
              <span className="makeup-label">{makeup.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3 className="section-title">Brush Settings</h3>

        <div className="control-group">
          <label htmlFor="brush-size">
            Size: <span className="value-display">{brushSettings.size}px</span>
          </label>
          <input
            id="brush-size"
            type="range"
            min="5"
            max="80"
            value={brushSettings.size}
            onChange={(e) => onBrushSettingsChange({ size: Number(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label htmlFor="brush-opacity">
            Opacity: <span className="value-display">{Math.round(brushSettings.opacity * 100)}%</span>
          </label>
          <input
            id="brush-opacity"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={brushSettings.opacity}
            onChange={(e) => onBrushSettingsChange({ opacity: Number(e.target.value) })}
            className="slider"
          />
        </div>

        <div className="control-group">
          <label htmlFor="brush-color">Color</label>
          <div className="color-picker-wrapper">
            <input
              id="brush-color"
              type="color"
              value={brushSettings.color}
              onChange={(e) => onBrushSettingsChange({ color: e.target.value })}
              className="color-picker"
            />
            <span className="color-value">{brushSettings.color}</span>
          </div>
        </div>

        <div className="control-group">
          <label htmlFor="blend-mode">Blend Mode</label>
          <select
            id="blend-mode"
            value={brushSettings.blendMode}
            onChange={(e) => onBrushSettingsChange({ blendMode: e.target.value as any })}
            className="select-dropdown"
          >
            {BLEND_MODES.map(mode => (
              <option key={mode.value} value={mode.value}>
                {mode.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-section">
        <h3 className="section-title">Actions</h3>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↶ Undo
          </button>
          <button
            className="action-btn"
            onClick={onRedo}
            disabled={!canRedo}
          >
            ↷ Redo
          </button>
          <button
            className="action-btn danger"
            onClick={onClear}
          >
            ✕ Clear All
          </button>
        </div>
      </div>

      <div className="panel-section tips">
        <h3 className="section-title">Tips</h3>
        <ul className="tips-list">
          <li>🎯 Select a makeup type before drawing</li>
          <li>🖌️ Makeup automatically stays within boundaries</li>
          <li>👤 Move your face - makeup follows naturally</li>
          <li>📱 Adjust brush size and opacity for best results</li>
        </ul>
      </div>
    </div>
  );
};

export default ControlPanel;
