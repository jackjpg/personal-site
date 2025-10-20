"use client";

import { useEffect, useRef, useState } from "react";
import { icons, Icon } from "@/lib/icons";
import DraggableIcon from "./DraggableIcon";

interface IconPosition {
  id: string;
  x: number;
  y: number;
}


export default function Desktop() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);

  const getFixedRandomPosition = (icon: Icon, index: number) => {
    const workspaceWidth = window.innerWidth;
    const workspaceHeight = window.innerHeight;
    // Fixed tile width for layout grid
    const iconSize = 132;
    
    // Simple grid structure aligned to the right
    const cols = 2; // 2 columns
    const rows = Math.ceil(icons.length / cols);
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // Total icon dimensions: use tile width as width, approximate height with label
    const iconWidth = 132; // fixed tile width
    const iconHeight = 132; // align to 8px grid; label pill sits below but spacing drives layout
    
    // Consistent spacing between icons (40px)
    const spacing = 40; // 40px padding between icons
    const marginTop = 40;
    const marginRight = 40;
    
    // Calculate position from top-right corner
    // Both use the same spacing value for consistent gaps
    const x = workspaceWidth - (col * (iconWidth + spacing) + iconWidth) - marginRight;
    const y = (row * (iconHeight + spacing)) + marginTop;
    
    return { x, y };
  };

  const loadPositions = () => {
    // Create fixed "random" positions for all icons
    const positions = icons.map((icon, index) => {
      const position = getFixedRandomPosition(icon, index);
      return {
        id: icon.id,
        ...position
      };
    });
    
    setIconPositions(positions);
  };

  // Force refresh positions
  const refreshPositions = () => {
    loadPositions();
  };

  const savePosition = (id: string, x: number, y: number) => {
    const newPositions = iconPositions.map(pos => 
      pos.id === id ? { id, x, y } : pos
    );
    setIconPositions(newPositions);
    // Don't persist to localStorage - positions reset on refresh
  };

  useEffect(() => {
    // Wait for workspace to be ready before loading positions
    const timer = setTimeout(() => {
      loadPositions();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Force refresh positions when icons change
  useEffect(() => {
    loadPositions();
  }, [icons.length]);

  // Handle window resize to regenerate positions for new screen size
  useEffect(() => {
    const handleResize = () => {
      loadPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="desktop">
      <div ref={workspaceRef} className="workspace">
        {iconPositions.map(position => {
          const icon = icons.find(i => i.id === position.id);
          if (!icon) return null;
          
          return (
            <DraggableIcon
              key={icon.id}
              icon={icon}
              x={position.x}
              y={position.y}
              onDragEnd={savePosition}
              workspaceRef={workspaceRef}
            />
          );
        })}
      </div>
    </div>
  );
}
