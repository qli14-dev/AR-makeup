import React, { useState, useRef } from 'react';
import { InteractiveObject } from '../../types/game';
import { ROOM_OBJECTS } from '../../data/gameObjects';
import './RoomView.css';

interface RoomViewProps {
  objects: InteractiveObject[];
  onObjectClick: (objectId: string) => void;
  flashlightActive: boolean;
  uvLightActive: boolean;
}

const RoomView: React.FC<RoomViewProps> = ({
  onObjectClick,
  flashlightActive,
  uvLightActive,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [hoveredObject, setHoveredObject] = useState<string | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (roomRef.current) {
      const rect = roomRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const isNearObject = (obj: InteractiveObject, mouseX: number, mouseY: number) => {
    const distance = Math.sqrt(
      Math.pow((obj.position.x * 100) - mouseX, 2) +
      Math.pow((obj.position.y * 100) - mouseY, 2)
    );
    return distance < 10;
  };

  const getObjectEmoji = (type: string): string => {
    const emojiMap: Record<string, string> = {
      desk: '🗄️',
      drawer: '📦',
      bookshelf: '📚',
      painting: '🖼️',
      bed: '🛏️',
      mirror: '🪞',
      clock: '🕐',
      window: '🪟',
      closet: '🚪',
      safe: '🔒',
      cabinet: '💊',
      table: '🪑',
      chair: '🪑',
      radiator: '♨️',
      door: '🚪',
      rug: '🧶',
    };
    return emojiMap[type] || '❓';
  };

  return (
    <div
      ref={roomRef}
      className={`room-view ${flashlightActive ? 'flashlight-on' : ''} ${uvLightActive ? 'uv-on' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Detailed room background with visual elements */}
      <div className="room-background">
        {/* Back Wall */}
        <div className="wall back-wall">
          <div className="wall-texture"></div>
          <div className="crack crack-1"></div>
          <div className="crack crack-2"></div>
          <div className="water-stain"></div>
        </div>

        {/* Floor */}
        <div className="floor">
          <div className="floor-boards"></div>
          <div className="floor-stain"></div>
        </div>

        {/* Ceiling */}
        <div className="ceiling">
          <div className="ceiling-light"></div>
        </div>

        <div className="room-overlay darkness"></div>

        {/* Flickering light effect */}
        <div className="flickering-light"></div>

        {/* Flashlight beam */}
        {flashlightActive && (
          <div
            className="flashlight-beam"
            style={{
              left: `${mousePosition.x}%`,
              top: `${mousePosition.y}%`,
            }}
          ></div>
        )}

        {/* UV light effect */}
        {uvLightActive && (
          <>
            <div className="uv-light-overlay"></div>
            <div className="uv-symbols">
              <div className="uv-symbol" style={{ top: '25%', left: '15%' }}>△</div>
              <div className="uv-symbol" style={{ top: '35%', right: '20%' }}>◐</div>
              <div className="uv-symbol" style={{ bottom: '40%', left: '45%' }}>⚷</div>
              <div className="uv-symbol" style={{ top: '50%', right: '15%' }}>☿</div>
              <div className="uv-symbol" style={{ bottom: '30%', left: '25%' }}>⌛</div>
            </div>
          </>
        )}
      </div>

      {/* Interactive objects with visual representations */}
      <div className="objects-layer">
        {ROOM_OBJECTS.map((obj) => {
          const isNear = isNearObject(obj, mousePosition.x, mousePosition.y);
          const isHovered = hoveredObject === obj.id;

          return (
            <div
              key={obj.id}
              className={`interactive-object ${obj.type} ${isNear ? 'nearby' : ''} ${isHovered ? 'hovered' : ''} ${!obj.isInteractable ? 'locked' : ''}`}
              style={{
                left: `${obj.position.x * 100}%`,
                top: `${obj.position.y * 100}%`,
              }}
              onClick={() => {
                if (obj.isInteractable || isNear) {
                  onObjectClick(obj.id);
                }
              }}
              onMouseEnter={() => setHoveredObject(obj.id)}
              onMouseLeave={() => setHoveredObject(null)}
            >
              {/* Object visual */}
              <div className="object-visual">
                <div className="object-emoji">{getObjectEmoji(obj.type)}</div>
                {obj.type === 'clock' && <div className="clock-time">3:47</div>}
                {obj.type === 'mirror' && <div className="mirror-crack"></div>}
                {obj.type === 'safe' && <div className="safe-dial">🔐</div>}
              </div>

              <div className="object-hotspot"></div>

              {isNear && obj.isInteractable && (
                <div className="object-label">
                  <span className="label-icon">👆</span>
                  <span className="label-text">{obj.name}</span>
                </div>
              )}

              {!obj.isInteractable && obj.requiresItem && isNear && (
                <div className="locked-indicator">
                  <span>🔒 Locked</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Atmospheric particles */}
      <div className="particles-layer">
        {[...Array(flashlightActive ? 30 : 15)].map((_, i) => (
          <div
            key={i}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
              opacity: flashlightActive ? 0.6 : 0.3,
            }}
          ></div>
        ))}
      </div>

      {/* Enhanced tooltip */}
      {hoveredObject && (
        <div
          className="object-tooltip"
          style={{
            left: `${Math.min(mousePosition.x, 85)}%`,
            top: `${Math.max(mousePosition.y - 15, 5)}%`
          }}
        >
          <div className="tooltip-header">
            {getObjectEmoji(ROOM_OBJECTS.find(o => o.id === hoveredObject)?.type || '')}
            <strong>{ROOM_OBJECTS.find(o => o.id === hoveredObject)?.name}</strong>
          </div>
          <div className="tooltip-description">
            {ROOM_OBJECTS.find(o => o.id === hoveredObject)?.description}
          </div>
        </div>
      )}

      {/* Room ambience indicators */}
      <div className="ambience-indicators">
        <div className="sound-wave sound-1">〰️</div>
        <div className="sound-wave sound-2">〰️</div>
      </div>
    </div>
  );
};

export default RoomView;
