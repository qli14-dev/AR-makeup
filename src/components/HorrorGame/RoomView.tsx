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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    return distance < 8; // 8% radius for clickable area
  };

  const getObjectsToRender = () => {
    return ROOM_OBJECTS;
  };

  return (
    <div
      ref={roomRef}
      className={`room-view ${flashlightActive ? 'flashlight-on' : ''} ${uvLightActive ? 'uv-on' : ''}`}
      onMouseMove={handleMouseMove}
    >
      {/* Background room image/scene */}
      <div className="room-background">
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
          <div className="uv-light-overlay"></div>
        )}
      </div>

      {/* Interactive objects */}
      <div className="objects-layer">
        {getObjectsToRender().map((obj) => {
          const isNear = isNearObject(obj, mousePosition.x, mousePosition.y);
          const isHovered = hoveredObject === obj.id;

          return (
            <div
              key={obj.id}
              className={`interactive-object ${obj.type} ${isNear ? 'nearby' : ''} ${isHovered ? 'hovered' : ''}`}
              style={{
                left: `${obj.position.x * 100}%`,
                top: `${obj.position.y * 100}%`,
              }}
              onClick={() => {
                if (obj.isInteractable) {
                  onObjectClick(obj.id);
                }
              }}
              onMouseEnter={() => setHoveredObject(obj.id)}
              onMouseLeave={() => setHoveredObject(null)}
            >
              <div className="object-hotspot"></div>
              {isNear && obj.isInteractable && (
                <div className="object-label">
                  <span>{obj.name}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Atmospheric particles */}
      <div className="particles-layer">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="dust-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Object description tooltip */}
      {hoveredObject && (
        <div className="object-tooltip" style={{ left: mousePosition.x + '%', top: (mousePosition.y - 10) + '%' }}>
          {ROOM_OBJECTS.find(o => o.id === hoveredObject)?.description}
        </div>
      )}
    </div>
  );
};

export default RoomView;
