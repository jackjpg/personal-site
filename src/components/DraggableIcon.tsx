"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/lib/icons";

interface DraggableIconProps {
  icon: Icon;
  x: number;
  y: number;
  rotation: number;
  zIndex: number;
  onDragEnd: (id: string, x: number, y: number) => void;
  workspaceRef: React.RefObject<HTMLDivElement | null>;
  isActive?: boolean;
  onInteractionChange?: (isInteracting: boolean) => void;
}

export default function DraggableIcon({ 
  icon, 
  x, 
  y, 
  rotation,
  zIndex,
  onDragEnd, 
  workspaceRef,
  isActive = false,
  onInteractionChange
}: DraggableIconProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const textContentRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

  // Ratio-to-size mapping - responsive sizing
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 880;
  const sizeMap = {
    square: { width: isMobile ? 110 : 160, height: isMobile ? 110 : 160 },
    portrait: { width: isMobile ? 110 : 160, height: isMobile ? 198 : 288 },
    landscape: { width: isMobile ? 198 : 288, height: isMobile ? 110 : 160 }
  };
  const { width, height } = sizeMap[icon.ratio];

  // Generate unique floating animation parameters for each icon
  const floatDuration = 8 + (icon.id.length % 5); // 8-12 seconds based on id
  const floatX = 8 + (icon.id.charCodeAt(0) % 6); // 8-14px horizontal
  const floatY = 10 + (icon.id.charCodeAt(1) % 8); // 10-18px vertical
  const floatDelay = (icon.id.charCodeAt(0) % 10) * 0.2; // 0-1.8s stagger

  useEffect(() => {
    const updateConstraints = () => {
      // Get actual workspace bounds from DOM
      if (!workspaceRef.current) {
        return;
      }
      
      const workspaceRect = workspaceRef.current.getBoundingClientRect();
      
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

  // Check if text needs scrolling
  useEffect(() => {
    if (icon.text && textContentRef.current && textContainerRef.current) {
      const contentHeight = textContentRef.current.scrollHeight;
      const containerHeight = textContainerRef.current.clientHeight;
      setNeedsScroll(contentHeight > containerHeight);
    }
  }, [icon.text, width, height]);

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
    onInteractionChange?.(true);
  };

  const handleDrag = () => {
    // Keep isDragging true during drag
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number; y: number } }) => {
    setIsDragging(false);
    onInteractionChange?.(false);
    
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
      data-is-active={isActive}
      style={{ 
        x, 
        y,
        rotate: rotation,
        zIndex: isDragging ? 1000 : zIndex
      } as React.CSSProperties & { x: number; y: number; rotate: number }}
      drag
      dragConstraints={dragConstraints}
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      dragPropagation={false}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        setIsHovered(true);
        onInteractionChange?.(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onInteractionChange?.(false);
      }}
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
      aria-label={icon.label}
      tabIndex={0}
      animate={isDragging ? false : {
        x: [x, x + floatX, x - floatX, x],
        y: [y, y - floatY, y + floatY, y],
        rotate: [rotation, rotation + 0.5, rotation - 0.5, rotation]
      }}
      transition={isDragging ? { duration: 0 } : {
        duration: floatDuration,
        repeat: Infinity,
        ease: "easeInOut",
        delay: floatDelay
      }}
      initial={false}
    >
      <div 
        ref={textContainerRef}
        className={`iconTileRoot ${icon.text ? "textThumbnail" : ""} ${icon.kind === "route" ? "projectThumbnail" : ""}`} 
        style={{ 
          width, 
          height,
          backgroundColor: icon.bgColor || (icon.text ? "#F6F3EE" : "#FDE047"),
          '--thumbnail-bg': icon.bgColor || (icon.text ? "#F6F3EE" : "#FDE047")
        } as React.CSSProperties & { '--thumbnail-bg': string }}
      >
        {icon.text ? (
          needsScroll ? (
            <div className="textThumbnailScroller">
              <div 
                ref={textContentRef}
                className="textThumbnailContent"
                style={{
                  color: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000"
                }}
              >
                {icon.text}
              </div>
              <div 
                className="textThumbnailContent"
                style={{
                  color: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000"
                }}
              >
                {icon.text}
              </div>
            </div>
          ) : (
            <div className="textThumbnailStatic">
              {icon.kind === "route" && (
                <div 
                  className="projectLabel"
                  style={{
                    color: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000"
                  }}
                >
                  PROJECT
                </div>
              )}
              <div 
                ref={textContentRef}
                className="textThumbnailContent"
                style={{
                  color: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000"
                }}
              >
                {icon.text}
              </div>
              {icon.kind === "route" && icon.year && (
                <div 
                  className="projectYear"
                  style={{
                    color: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000"
                  }}
                >
                  {icon.year}
                </div>
              )}
            </div>
          )
        ) : icon.video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              pointerEvents: "none",
              userSelect: "none",
              opacity: isImageLoaded ? 1 : 0,
              transition: "opacity 0.2s ease-in-out"
            }}
            onLoadedData={() => setIsImageLoaded(true)}
          >
            <source src={icon.video} type="video/mp4" />
          </video>
        ) : icon.img ? (
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
        ) : null}
      </div>
      {icon.kind !== "route" && icon.label && (
        <div className="iconLabel label-">{icon.label}</div>
      )}
    </motion.button>
  );
}
