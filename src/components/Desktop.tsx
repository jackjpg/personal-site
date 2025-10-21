"use client";

import { useEffect, useRef, useState } from "react";
import { icons, Icon } from "@/lib/icons";
import DraggableIcon from "./DraggableIcon";

interface IconPosition {
  id: string;
  x: number;
  y: number;
  rotation: number;
}


export default function Desktop() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);
  const [zIndexOrder, setZIndexOrder] = useState<string[]>([]); // Track z-index order

  // Seeded random function for consistent positioning
  const seededRandom = (seed: number) => {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const getSizeForRatio = (ratio: string) => {
    const sizeMap = {
      square: { width: 120, height: 120 },
      portrait: { width: 120, height: 216 },
      landscape: { width: 216, height: 120 }
    };
    return sizeMap[ratio as keyof typeof sizeMap];
  };

              const getRandomPosition = (icon: Icon, index: number) => {
                const { width, height } = getSizeForRatio(icon.ratio);
                const seed = index + 98765; // Different seed for new positioning
                const randomValue = seededRandom(seed);
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const headerHeight = 72; // Just the header height, no margin
                const margin = viewportWidth <= 880 ? 16 : 24; // Responsive margins
                
                // Account for desktop margins only (header no longer has margins)
                const totalMargin = margin; // Only desktop margin now
                
                // Available area dimensions with padding
                const availableWidth = viewportWidth - totalMargin * 2;
                const availableHeight = viewportHeight - headerHeight - margin - 40; // 20px top + 20px bottom padding
                
                // Use an 810px centered container for initial positioning on desktop
                const isMobile = viewportWidth <= 880;
                
                // Generate multiple random values for more variation
                const randomX = seededRandom(seed * 2);
                const randomY = seededRandom(seed * 3);
                const randomCluster = seededRandom(seed * 7);
                
                // Desktop: 810px container, Mobile: 90% of width
                const containerWidth = isMobile ? (availableWidth * 0.9) : Math.min(810, availableWidth);
                const spreadHeight = isMobile ? (availableHeight * 0.7) : (availableHeight * 0.5);
                
                // Center the container
                const containerOffsetX = (viewportWidth - containerWidth) / 2;
                const offsetY = (availableHeight - spreadHeight) / 2;
                
                // Position within the container
                const baseX = containerOffsetX + randomX * containerWidth;
                const baseY = headerHeight + 20 + offsetY * 0.3 + randomY * spreadHeight;
                
                // Add clustering variation (some thumbnails cluster more)
                // Less clustering on mobile for better spread
                const clusterOffsetX = (randomCluster - 0.5) * (isMobile ? 40 : 60);
                const clusterOffsetY = (randomCluster - 0.5) * (isMobile ? 40 : 50);
                
                let x = baseX + clusterOffsetX - width / 2;
                let y = baseY + clusterOffsetY - height / 2;
                
                // Constrain to bounds (with 20px padding)
                const minX = totalMargin;
                const maxX = viewportWidth - totalMargin - width;
                const minY = headerHeight + 20; // 20px top padding
                const maxY = viewportHeight - margin - 20 - height; // 20px bottom padding
                
                x = Math.max(minX, Math.min(x, maxX));
                y = Math.max(minY, Math.min(y, maxY));
                
                // Add random rotation for organic feel
                const rotation = (randomValue - 0.5) * 8; // -4 to +4 degrees
                
                return { x, y, rotation };
              };

  const loadPositions = () => {
    // Create random positions for all icons with collision detection
    const positions: IconPosition[] = [];
    const isMobile = window.innerWidth <= 880;
    const minSpacing = isMobile ? -30 : 20; // Allow overlap on mobile (-30px), spacing on desktop (20px)
    
    icons.forEach((icon, index) => {
      let attempts = 0;
      let position;
      let hasCollision;
      
      do {
        position = getRandomPosition(icon, index + attempts);
        hasCollision = false;
        
        // Check if this position collides with any existing positions
        for (const existingPos of positions) {
          const existingIcon = icons.find(i => i.id === existingPos.id);
          if (!existingIcon) continue;
          
          const existingSize = getSizeForRatio(existingIcon.ratio);
          const currentSize = getSizeForRatio(icon.ratio);
          
          // Calculate bounding boxes
          const left1 = position.x;
          const right1 = position.x + currentSize.width;
          const top1 = position.y;
          const bottom1 = position.y + currentSize.height;
          
          const left2 = existingPos.x;
          const right2 = existingPos.x + existingSize.width;
          const top2 = existingPos.y;
          const bottom2 = existingPos.y + existingSize.height;
          
          // Check for overlap with spacing buffer
          if (!(right1 + minSpacing < left2 || 
                left1 > right2 + minSpacing || 
                bottom1 + minSpacing < top2 || 
                top1 > bottom2 + minSpacing)) {
            hasCollision = true;
            break;
          }
        }
        
        attempts++;
      } while (hasCollision && attempts < 50); // Try up to 50 times
      
      positions.push({
        id: icon.id,
        ...position
      });
    });
    
    setIconPositions(positions);
  };

  // Force refresh positions
  const refreshPositions = () => {
    loadPositions();
  };

  const savePosition = (id: string, x: number, y: number) => {
    const newPositions = iconPositions.map(pos => 
      pos.id === id ? { id, x, y, rotation: pos.rotation } : pos
    );
    setIconPositions(newPositions);
    
    // Update z-index order - move this item to the front
    setZIndexOrder(prev => {
      const filtered = prev.filter(itemId => itemId !== id);
      return [...filtered, id]; // Add to end (highest z-index)
    });
    
    // Don't persist to localStorage - positions reset on refresh
  };

  useEffect(() => {
    // Wait for workspace to be ready before loading positions
    const timer = setTimeout(() => {
      loadPositions();
      // Initialize z-index order
      setZIndexOrder(icons.map(icon => icon.id));
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Force refresh positions when icons change
  useEffect(() => {
    loadPositions();
  }, [icons]); // Use full icons array instead of just length

  // Handle window resize to regenerate positions for new screen size
  useEffect(() => {
    const handleResize = () => {
      // Force regenerate all positions on resize
      loadPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [icons]); // Include icons dependency to ensure all thumbnails are handled

  return (
    <div className="desktop">
      <div ref={workspaceRef} className="workspace">
        {iconPositions.map(position => {
          const icon = icons.find(i => i.id === position.id);
          if (!icon) return null;
          
          const zIndex = zIndexOrder.indexOf(icon.id);
          
          return (
            <DraggableIcon
              key={icon.id}
              icon={icon}
              x={position.x}
              y={position.y}
              rotation={position.rotation}
              zIndex={zIndex}
              onDragEnd={savePosition}
              workspaceRef={workspaceRef}
            />
          );
        })}
      </div>
    </div>
  );
}
