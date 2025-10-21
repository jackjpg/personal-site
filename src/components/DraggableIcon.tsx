"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Icon } from "@/lib/icons";

interface DraggableIconProps {
  icon: Icon;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  onDragEnd: (id: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableIcon({ 
  icon, 
  x, 
  y, 
  rotation,
  zIndex,
  onDragEnd, 
  workspaceRef 
}: DraggableIconProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

  // Ratio-to-size mapping
  const sizeMap = {
    square: { width: 120, height: 120 },
    portrait: { width: 120, height: 216 },
    landscape: { width: 216, height: 120 }
  };
  const { width, height } = sizeMap[icon.ratio];

  useEffect(() => {
    const updateConstraints = () => {
      // Get actual workspace bounds from DOM
      if (!workspaceRef.current) {
        return;
      }
      
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      const margin = window.innerWidth <= 880 ? 16 : 24; // Responsive margins
      
      // Use workspace bounds for drag constraints
      setDragConstraints({
        left: 0, // Relative to workspace
        right: workspaceRect.width - width, // Width of workspace
        top: 20, // 20px top padding relative to workspace
        bottom: workspaceRect.height - 20 - height // 20px bottom padding relative to workspace
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [icon.ratio, width, height]);

  const handleClick = () => {
    if (isDragging) return; // Don't trigger click if we were dragging
    switch (icon.kind) {
      case "route":
        router.push(icon.href);
        break;
      case "link":
        window.open(icon.href, "_blank", "noopener,noreferrer");
        break;
      case "mailto":
        window.location.href = icon.href;
        break;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_, info) => {
    setIsDragging(false);
    
    // Calculate new position
    const newX = x + info.offset.x;
    const newY = y + info.offset.y;
    
    // Get actual workspace bounds from DOM
    if (!workspaceRef.current) {
      onDragEnd(icon.id, x, y);
      return;
    }
    
    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    
    // Constrain to workspace bounds (relative to workspace)
    const constrainedX = Math.max(0, Math.min(newX, workspaceRect.width - width));
    const constrainedY = Math.max(20, Math.min(newY, workspaceRect.height - 20 - height));
    
    onDragEnd(icon.id, constrainedX, constrainedY);
  };

  return (
    <motion.button
      className="iconButton focusRing"
      style={{ 
        x, 
        y,
        rotate: rotation,
        zIndex: isDragging ? 1000 : zIndex
      } as React.CSSProperties}
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      aria-label={icon.label}
      tabIndex={0}
    >
      <div className="iconTileRoot" style={{ width, height }}>
        <Image
          src={icon.img}
          alt=""
          fill
          sizes="(max-width: 880px) 120px, 216px"
          quality={95}
          style={{ 
            objectFit: "cover", 
            transform: "translateZ(0)",
            opacity: isImageLoaded ? 1 : 0,
            transition: "opacity 0.2s ease-in-out"
          }}
          onLoad={() => setIsImageLoaded(true)}
          priority={false}
        />
      </div>
      <div className="iconLabel label-">{icon.label}</div>
    </motion.button>
  );
}
