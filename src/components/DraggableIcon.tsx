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
  const baseMobile = 116;
  const baseDesktop = 172;
  const base = isMobile ? baseMobile : baseDesktop;
  const longSide = Math.round(base * 1.8);
  const sizeMap = {
    square: { width: base, height: base },
    portrait: { width: base, height: longSide },
    landscape: { width: longSide, height: base }
  };
  const { width, height } = sizeMap[icon.ratio];

  // Generate unique floating animation parameters for each icon
  const floatDuration = 6 + (icon.id.length % 3); // 6-8 seconds based on id
  const floatX = 3 + (icon.id.charCodeAt(0) % 3); // 3-5px horizontal
  const floatY = 4 + (icon.id.charCodeAt(1) % 4); // 4-7px vertical
  const floatDelay = (icon.id.charCodeAt(0) % 8) * 0.1; // 0-0.7s stagger

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
  }, [icon.ratio, width, height, workspaceRef]);

  // Check if text needs scrolling
  useEffect(() => {
    if (icon.text && textContentRef.current && textContainerRef.current) {
      const contentHeight = textContentRef.current.scrollHeight;
      const containerHeight = textContainerRef.current.clientHeight;
      setNeedsScroll(contentHeight > containerHeight);
    }
  }, [icon.text, width, height]);

  const handleClick = (e?: React.MouseEvent) => {
    if (isDragging) {
      e?.preventDefault();
      return;
    }
    switch (icon.kind) {
      case "route":
        if (!e) router.push(icon.href);
        return;
      case "link":
        window.open(icon.href, "_blank", "noopener,noreferrer");
        return;
      case "mailto":
        window.location.href = icon.href;
        return;
    }
  };

  const handleTap = () => {
    if (isDragging) return;
    switch (icon.kind) {
      case "route":
        router.push(icon.href);
        return;
      case "link":
        window.open(icon.href, "_blank", "noopener,noreferrer");
        return;
      case "mailto":
        window.location.href = icon.href;
        return;
    }
  };

  // Treat minimal movement as a click even though drag is enabled
  const pressStart = useRef<{ x: number; y: number } | null>(null);
  const handlePointerDown = (e: React.PointerEvent) => {
    pressStart.current = { x: e.clientX, y: e.clientY };
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    const start = pressStart.current;
    pressStart.current = null;
    if (!start) return;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    const moved = Math.max(dx, dy) > 4; // threshold in px
    if (!moved) {
      // Force treat as click regardless of drag state
      switch (icon.kind) {
        case "route":
          router.push(icon.href);
          return;
        case "link":
          window.open(icon.href, "_blank", "noopener,noreferrer");
          return;
        case "mailto":
          window.location.href = icon.href;
          return;
      }
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

  const isAnchor = icon.kind === "route" || icon.kind === "link" || icon.kind === "mailto";
  const isDraggable = true;
  const MotionElement: any = isAnchor ? motion.a : motion.button;

  const commonHandlers: any = {
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerUp,
    onKeyDown: handleKeyDown,
    onMouseEnter: () => { onInteractionChange?.(true); },
    onMouseLeave: () => { onInteractionChange?.(false); },
  };

  const clickHandlers: any = icon.kind === 'route' ? {
    onClick: (e: any) => handleClick(e),
    onTap: handleTap,
  } : {};

  return (
    <MotionElement
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
      {...commonHandlers}
      {...clickHandlers}
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
      initial={true}
      {...(isAnchor && icon.kind === "route" ? { href: icon.href } : {})}
      {...(isAnchor && icon.kind === "link" ? { href: icon.href, target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(isAnchor && icon.kind === "mailto" ? { href: icon.href } : {})}
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
                <svg 
                  className="projectLabel" 
                  viewBox="0 0 100 20" 
                  style={{ 
                    position: 'absolute', 
                    top: '14px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '20px',
                    zIndex: 10
                  }}
                >
                  <defs>
                    <path id="topCurve" d="M 10,15 Q 50,5 90,15" />
                  </defs>
                  <text 
                    style={{ 
                      fontSize: '11px', 
                      fill: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000",
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
                      PROJECT
                    </textPath>
                  </text>
                </svg>
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
                <svg 
                  className="projectYear" 
                  viewBox="0 0 100 20" 
                  style={{ 
                    position: 'absolute', 
                    bottom: '14px', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '20px',
                    zIndex: 10
                  }}
                >
                  <defs>
                    <path id="bottomCurve" d="M 10,5 Q 50,15 90,5" />
                  </defs>
                  <text 
                    style={{ 
                      fontSize: '11px', 
                      fill: icon.bgColor === "#2B272A" ? "#FFFFFF" : "#000000",
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '600',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase'
                    }}
                  >
                    <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
                      {icon.year}
                    </textPath>
                  </text>
                </svg>
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
    </MotionElement>
  );
}
