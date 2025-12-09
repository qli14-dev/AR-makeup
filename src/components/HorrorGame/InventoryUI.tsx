import React, { useState } from 'react';
import { InventoryItem } from '../../types/game';
import './InventoryUI.css';

interface InventoryUIProps {
  items: InventoryItem[];
  onUseItem: (itemId: string) => void;
  onCombineItems: (item1Id: string, item2Id: string) => void;
}

const InventoryUI: React.FC<InventoryUIProps> = ({ items, onUseItem, onCombineItems }) => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    if (selectedItem === itemId) {
      // Deselect
      setSelectedItem(null);
    } else if (selectedItem) {
      // Try to combine
      const item1 = items.find(i => i.id === selectedItem);

      if (item1?.canCombineWith?.includes(itemId)) {
        onCombineItems(selectedItem, itemId);
        setSelectedItem(null);
      } else {
        // Just select new item
        setSelectedItem(itemId);
      }
    } else {
      // Select item
      setSelectedItem(itemId);
    }
  };

  const handleUseItem = (itemId: string) => {
    onUseItem(itemId);
  };

  return (
    <div className="inventory-ui">
      <div className="inventory-header">
        <h3>Inventory</h3>
        <span className="item-count">{items.length}/8</span>
      </div>

      <div className="inventory-slots">
        {[...Array(8)].map((_, index) => {
          const item = items[index];
          const isSelected = selectedItem === item?.id;
          const isHovered = hoveredItem === item?.id;

          return (
            <div
              key={index}
              className={`inventory-slot ${item ? 'has-item' : 'empty'} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
              onClick={() => item && handleItemClick(item.id)}
              onMouseEnter={() => item && setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item ? (
                <>
                  <div className="item-icon">{item.icon}</div>
                  <div className="item-name">{item.name}</div>
                  {isSelected && item.isUsable && (
                    <button
                      className="use-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUseItem(item.id);
                      }}
                    >
                      Use
                    </button>
                  )}
                </>
              ) : (
                <div className="empty-slot-indicator">•</div>
              )}
            </div>
          );
        })}
      </div>

      {hoveredItem && (
        <div className="item-description">
          {items.find(i => i.id === hoveredItem)?.description}
        </div>
      )}

      {selectedItem && (
        <div className="inventory-hint">
          Click another item to combine, or click outside to deselect
        </div>
      )}
    </div>
  );
};

export default InventoryUI;
