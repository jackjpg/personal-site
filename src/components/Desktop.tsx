"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
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
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null); // Track hovered/dragged project
  const chipRef = useRef<HTMLDivElement>(null);
  const chipAnimReq = useRef<number | null>(null);
  const chipPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const chipTarget = useRef<{ x: number; y: number }>({ x: 0, y: 0 });


  const getSizeForRatio = (ratio: string) => {
    const isMobile = window.innerWidth <= 880;
    const sizeMap = {
      square: { width: isMobile ? 110 : 160, height: isMobile ? 110 : 160 },
      portrait: { width: isMobile ? 110 : 160, height: isMobile ? 198 : 288 },
      landscape: { width: isMobile ? 198 : 288, height: isMobile ? 110 : 160 }
    };
    return sizeMap[ratio as keyof typeof sizeMap];
  };

  const getRandomPosition = useCallback((icon: Icon, index: number) => {
                const { width, height } = getSizeForRatio(icon.ratio);
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const isMobile = viewportWidth <= 880;
                const margin = isMobile ? 16 : 24;
                
                // Get actual workspace height if available, otherwise fall back to viewport
                let workspaceHeight = viewportHeight;
                if (workspaceRef.current) {
                  const workspaceRect = workspaceRef.current.getBoundingClientRect();
                  workspaceHeight = workspaceRect.height;
                } else if (isMobile) {
                  // Fallback: workspace is viewport minus header on mobile
                  workspaceHeight = viewportHeight - 72;
                }
                
                // Manual positioning - carefully spaced to avoid overlaps
                // Desktop: landscape=360x200, portrait=200x360
                const desktopPositions = [
                  { x: 0.05, y: 0.45, rot: -6 },   // 0: forest (landscape) - left-middle
                  { x: 0.70, y: 0.35, rot: 4 },    // 1: sweden (landscape) - right-middle
                  { x: 0.75, y: 0.50, rot: -8 },   // 2: seenit (portrait) - right-center
                  { x: 0.25, y: 0.25, rot: 7 },    // 3: cornfields (portrait) - left-center  
                  { x: 0.85, y: 0.30, rot: -5 },   // 4: clouds (portrait) - far-right
                  { x: 0.40, y: 0.50, rot: 6 },    // 5: post-sale (portrait) - center-middle
                  { x: 0.55, y: 0.35, rot: -4 }    // 6: verification (portrait) - center-right
                ];
                
                // Mobile: utilize vertical space, more organic scatter
                const mobilePositions = [
                  { x: 0.15, y: 0.08, rot: -6 },   // 0: forest (landscape) - top
                  { x: 0.60, y: 0.22, rot: 4 },    // 1: sweden (landscape) - upper-right
                  { x: 0.75, y: 0.42, rot: -8 },   // 2: seenit (portrait) - middle-right
                  { x: 0.08, y: 0.35, rot: 7 },    // 3: cornfields (portrait) - middle-left  
                  { x: 0.55, y: 0.55, rot: -5 },   // 4: clouds (portrait) - center-right
                  { x: 0.20, y: 0.50, rot: 6 },    // 5: post-sale (portrait) - center-left
                  { x: 0.65, y: 0.72, rot: -4 }    // 6: verification (portrait) - lower-right
                ];
                
                const pos = isMobile 
                  ? (mobilePositions[index] || { x: 0.5, y: 0.5, rot: 0 })
                  : (desktopPositions[index] || { x: 0.5, y: 0.5, rot: 0 });
                
                const availableWidth = viewportWidth - margin * 2;
                
                // Use full viewport width
                const containerWidth = availableWidth;
                const containerOffsetX = margin;
                
                const x = containerOffsetX + (pos.x * (containerWidth - width));
                // Use workspace height for Y positioning - workspace already accounts for header on mobile
                const y = pos.y * (workspaceHeight - height);
                const rotation = pos.rot;
                
                return { x, y, rotation };
              }, [workspaceRef]);

  const loadPositions = useCallback(() => {
    // Create positions for all icons - simple direct positioning
    const positions: IconPosition[] = icons.map((icon, index) => {
      const position = getRandomPosition(icon, index);
      return {
        id: icon.id,
        ...position
      };
    });
    
    setIconPositions(positions);
  }, [getRandomPosition]);

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
  }, [loadPositions]);

  // Force refresh positions when icons change
  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  // Handle window resize to regenerate positions for new screen size
  useEffect(() => {
    const handleResize = () => {
      // Force regenerate all positions on resize
      loadPositions();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [loadPositions]);

  // Floating chip follower for active project
  useEffect(() => {
    const el = chipRef.current;
    const workspaceEl = workspaceRef.current;
    if (!workspaceEl) return;

    const offset = { x: -80, y: -60 }; // Further left and higher up to avoid hand blocking

    const isCoarsePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    const animate = () => {
      const lerp = isCoarsePointer ? 0.5 : 0.2;
      chipPos.current.x += (chipTarget.current.x - chipPos.current.x) * lerp;
      chipPos.current.y += (chipTarget.current.y - chipPos.current.y) * lerp;
      if (el) {
        el.style.transform = `translate3d(${chipPos.current.x}px, ${chipPos.current.y}px, 0)`;
      }
      chipAnimReq.current = requestAnimationFrame(animate);
    };

    let hasMoved = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = workspaceEl.getBoundingClientRect();
      const x = e.clientX - rect.left + offset.x;
      const y = e.clientY - rect.top + offset.y;
      
      if (!hasMoved && el) {
        // First move - show the chip and set initial position
        hasMoved = true;
        el.style.opacity = '0.9';
        el.style.visibility = 'visible';
      }
      
      if (isCoarsePointer) {
        // On touch devices, follow finger tightly with no extra smoothing
        chipPos.current = { x, y };
        chipTarget.current = { x, y };
        if (el) {
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      } else {
        chipTarget.current = { x, y };
        if (chipAnimReq.current === null) {
          chipAnimReq.current = requestAnimationFrame(animate);
        }
      }
    };

    if (activeProjectId) {
      // Initialize both positions and hide chip initially
      const rect = workspaceEl.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Try to get current mouse position if available
      let initialX = centerX;
      let initialY = centerY;
      
      // Check if we can get the current pointer position
      if (typeof window !== 'undefined' && 'PointerEvent' in window) {
        // We'll update on first move, but initialize to a safe position
        initialX = centerX;
        initialY = centerY;
      }
      
      chipPos.current = { x: initialX, y: initialY };
      chipTarget.current = { x: initialX, y: initialY };
      hasMoved = false;
      
      if (el) {
        // Hide chip initially until first pointer move
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        el.style.transform = `translate3d(${initialX}px, ${initialY}px, 0)`;
      }
      
      workspaceEl.addEventListener('pointermove', handlePointerMove);
      
      // Also listen for mouseenter to catch initial position
      const handleMouseEnter = (e: MouseEvent) => {
        if (!hasMoved) {
          const rect = workspaceEl.getBoundingClientRect();
          const x = e.clientX - rect.left + offset.x;
          const y = e.clientY - rect.top + offset.y;
          chipPos.current = { x, y };
          chipTarget.current = { x, y };
          if (el) {
            el.style.opacity = '0.9';
            el.style.visibility = 'visible';
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            hasMoved = true;
          }
        }
      };
      
      workspaceEl.addEventListener('mouseenter', handleMouseEnter as any);
      
      return () => {
        workspaceEl.removeEventListener('pointermove', handlePointerMove);
        workspaceEl.removeEventListener('mouseenter', handleMouseEnter as any);
      };
    } else {
      if (chipAnimReq.current !== null) {
        cancelAnimationFrame(chipAnimReq.current);
        chipAnimReq.current = null;
      }
      if (el) {
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
      }
      workspaceEl.removeEventListener('pointermove', handlePointerMove);
    }
  }, [activeProjectId]);

  return (
    <div className="desktop">
      <div 
        ref={workspaceRef} 
        className={`workspace ${activeProjectId ? 'has-active-project' : ''}`}
      >
        {iconPositions.map(position => {
          const icon = icons.find(i => i.id === position.id);
          if (!icon) return null;
          
          // Projects (case studies) get higher z-index by default
          const baseZIndex = zIndexOrder.indexOf(icon.id);
          let zIndex = icon.kind === "route" ? baseZIndex + 100 : baseZIndex;
          if (icon.id === "seenit-image") {
            zIndex += 50; // Boost Seenit above other project thumbnails by default
          }
          
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
              isActive={activeProjectId === icon.id}
              onInteractionChange={(isInteracting) => {
                // Only set active state for project thumbnails
                if (icon.kind === "route") {
                  setActiveProjectId(isInteracting ? icon.id : null);
                }
              }}
            />
          );
        })}

        {activeProjectId && (() => {
          const activeIcon = icons.find(i => i.id === activeProjectId);
          const previewMedia = activeIcon?.previewImage;
          
          if (previewMedia) {
            const isVideo = previewMedia.match(/\.(mp4|mov|webm)$/i);
            
            return (
              <div ref={chipRef} className="floatingChip floatingChip--thumbnail" aria-hidden="true">
                {isVideo ? (
                  <video
                    src={previewMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: 'auto',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <Image
                    src={previewMedia}
                    alt=""
                    width={400}
                    height={260}
                    style={{
                      width: 'auto',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                    unoptimized
                  />
                )}
              </div>
            );
          }
          
          return (
            <div ref={chipRef} className="floatingChip" aria-hidden="true">
              View project
            </div>
          );
        })()}
      </div>
    </div>
  );
}
