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
  onDragEnd: (id: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableIcon({ 
  icon, 
  x, 
  y, 
  onDragEnd, 
  workspaceRef 
}: DraggableIconProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

  useEffect(() => {
    const updateConstraints = () => {
      // Use fixed tile width for bounds as the draggable footprint
      const draggableSize = 132;
      
      setDragConstraints({
        left: 0,
        right: window.innerWidth - draggableSize,
        top: 0,
        bottom: window.innerHeight - draggableSize
      });
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [icon.size, workspaceRef]);

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
    
    // Constrain using fixed tile width footprint
    const iconSize = 132;
    
    // Use full viewport bounds
    const maxX = window.innerWidth - iconSize;
    const maxY = window.innerHeight - iconSize;
    
    // Constrain to bounds
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    onDragEnd(icon.id, constrainedX, constrainedY);
  };

  // Fixed tile width per new spec
  const tileWidthPx = 132;
  // Sizes per state
  const assetSizes = { default: 72, hover: 80, pressed: 78 } as const;
  const bboxSizes = { default: 80, hover: 88, pressed: 86 } as const;

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const currentAsset = isPressed ? assetSizes.pressed : isHovered ? assetSizes.hover : assetSizes.default;
  const currentBbox = isPressed ? bboxSizes.pressed : isHovered ? bboxSizes.hover : bboxSizes.default;

  return (
    <motion.button
      className="iconButton focusRing"
      style={{ 
        x, 
        y,
        width: `${tileWidthPx}px`
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      aria-label={icon.label}
      tabIndex={0}
    >
      <div
        className="bboxContainer"
        style={{
          width: "80px",
          height: "80px",
          background: isHovered || isPressed ? "rgba(0,0,0,0.1)" : "transparent",
          boxShadow: "none"
        }}
      >
        <div className="assetContainer" style={{ width: "64px", height: "64px" }}>
          <Image
            src="/icons/PROJECT-FOLDER.svg"
            alt=""
            width={64}
            height={64}
            sizes="160px"
            style={{ objectFit: "contain", objectPosition: "center", transform: "translateZ(0)" }}
            priority={false}
          />
        </div>
      </div>
      <div className="iconLabel label-">{icon.label}</div>
    </motion.button>
  );
}
