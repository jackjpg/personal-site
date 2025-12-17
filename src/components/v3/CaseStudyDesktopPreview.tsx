"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { icons, Icon } from "@/lib/icons";
import DraggableIcon from "../DraggableIcon";

// Reuse the homepage PreviewVideo logic for hover previews
function PreviewVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldLoad(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (shouldLoad && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, [shouldLoad]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      muted
      playsInline
      preload="none"
      style={{
        width: "auto",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

interface IconPosition {
  id: string;
  x: number;
  y: number;
  rotation: number;
}

/**
 * CaseStudyDesktopPreview
 *
 * A white-background version of the homepage desktop, used as a footer preview
 * for v3 case studies. It reuses the draggable icons and hover preview chip,
 * but does NOT use the `.desktop` class to avoid affecting global body styles.
 */
export default function CaseStudyDesktopPreview() {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([]);
  const [zIndexOrder, setZIndexOrder] = useState<string[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const chipAnimReq = useRef<number | null>(null);
  const chipPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const chipTarget = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const getSizeForRatio = (ratio: string) => {
    const isMobile =
      typeof window !== "undefined" && window.innerWidth <= 880;
    const sizeMap = {
      square: { width: isMobile ? 110 : 160, height: isMobile ? 110 : 160 },
      portrait: { width: isMobile ? 110 : 160, height: isMobile ? 198 : 288 },
      landscape: { width: isMobile ? 198 : 288, height: isMobile ? 110 : 160 },
    };
    return sizeMap[ratio as keyof typeof sizeMap];
  };

  const getPositionForIndex = useCallback(
    (icon: Icon, index: number) => {
      if (typeof window === "undefined") {
        return { x: 0, y: 0, rotation: 0 };
      }

      const { width, height } = getSizeForRatio(icon.ratio);

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const isMobile = viewportWidth <= 880;
      const margin = isMobile ? 16 : 24;

      // Base the workspace height on the preview container, but fall back to viewport
      let workspaceHeight = viewportHeight;
      if (workspaceRef.current) {
        const workspaceRect = workspaceRef.current.getBoundingClientRect();
        workspaceHeight = workspaceRect.height || viewportHeight;
      }

      const desktopPositions = [
        { x: 0.05, y: 0.45, rot: -6 },
        { x: 0.7, y: 0.35, rot: 4 },
        { x: 0.75, y: 0.5, rot: -8 },
        { x: 0.25, y: 0.25, rot: 7 },
        { x: 0.85, y: 0.3, rot: -5 },
        { x: 0.4, y: 0.5, rot: 6 },
        { x: 0.55, y: 0.35, rot: -4 },
      ];

      const mobilePositions = [
        { x: 0.15, y: 0.08, rot: -6 },
        { x: 0.6, y: 0.22, rot: 4 },
        { x: 0.75, y: 0.42, rot: -8 },
        { x: 0.08, y: 0.35, rot: 7 },
        { x: 0.55, y: 0.55, rot: -5 },
        { x: 0.2, y: 0.5, rot: 6 },
        { x: 0.65, y: 0.72, rot: -4 },
      ];

      const pos = isMobile
        ? mobilePositions[index] || { x: 0.5, y: 0.5, rot: 0 }
        : desktopPositions[index] || { x: 0.5, y: 0.5, rot: 0 };

      const availableWidth = viewportWidth - margin * 2;
      const containerWidth = availableWidth;
      const containerOffsetX = margin;

      const x = containerOffsetX + pos.x * (containerWidth - width);
      const y = pos.y * (workspaceHeight - height);
      const rotation = pos.rot;

      return { x, y, rotation };
    },
    [workspaceRef]
  );

  const loadPositions = useCallback(() => {
    const positions: IconPosition[] = icons.map((icon, index) => {
      const position = getPositionForIndex(icon, index);
      return {
        id: icon.id,
        ...position,
      };
    });

    setIconPositions(positions);
  }, [getPositionForIndex]);

  const savePosition = (id: string, x: number, y: number) => {
    const newPositions = iconPositions.map((pos) =>
      pos.id === id ? { id, x, y, rotation: pos.rotation } : pos
    );
    setIconPositions(newPositions);

    setZIndexOrder((prev) => {
      const filtered = prev.filter((itemId) => itemId !== id);
      return [...filtered, id];
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPositions();
      setZIndexOrder(icons.map((icon) => icon.id));
    }, 50);

    return () => clearTimeout(timer);
  }, [loadPositions]);

  useEffect(() => {
    loadPositions();
  }, [loadPositions]);

  useEffect(() => {
    const handleResize = () => {
      loadPositions();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [loadPositions]);

  // Floating chip follower for active project (simplified from homepage)
  useEffect(() => {
    const el = chipRef.current;
    const workspaceEl = workspaceRef.current;
    if (!workspaceEl) return;

    const offset = { x: -80, y: -60 };
    const isCoarsePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer: coarse)").matches;

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
        hasMoved = true;
        el.style.opacity = "0.9";
        el.style.visibility = "visible";
      }

      if (isCoarsePointer) {
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
      const rect = workspaceEl.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      let initialX = centerX;
      let initialY = centerY;

      chipPos.current = { x: initialX, y: initialY };
      chipTarget.current = { x: initialX, y: initialY };
      hasMoved = false;

      if (el) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
        el.style.transform = `translate3d(${initialX}px, ${initialY}px, 0)`;
      }

      workspaceEl.addEventListener("pointermove", handlePointerMove);

      const handleMouseEnter = (e: MouseEvent) => {
        if (!hasMoved) {
          const rect = workspaceEl.getBoundingClientRect();
          const x = e.clientX - rect.left + offset.x;
          const y = e.clientY - rect.top + offset.y;
          chipPos.current = { x, y };
          chipTarget.current = { x, y };
          if (el) {
            el.style.opacity = "0.9";
            el.style.visibility = "visible";
            el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
            hasMoved = true;
          }
        }
      };

      workspaceEl.addEventListener("mouseenter", handleMouseEnter as any);

      return () => {
        workspaceEl.removeEventListener("pointermove", handlePointerMove);
        workspaceEl.removeEventListener("mouseenter", handleMouseEnter as any);
      };
    } else {
      if (chipAnimReq.current !== null) {
        cancelAnimationFrame(chipAnimReq.current);
        chipAnimReq.current = null;
      }
      if (el) {
        el.style.opacity = "0";
        el.style.visibility = "hidden";
      }
      workspaceEl.removeEventListener("pointermove", handlePointerMove);
    }
  }, [activeProjectId]);

  return (
    <div className="case-study-v3-desktop-preview">
      <div
        ref={workspaceRef}
        className={`workspace ${
          activeProjectId ? "has-active-project" : ""
        } case-study-v3-desktop-workspace`}
      >
        {iconPositions.map((position) => {
          const icon = icons.find((i) => i.id === position.id);
          if (!icon) return null;

          const baseZIndex = zIndexOrder.indexOf(icon.id);
          let zIndex = icon.kind === "route" ? baseZIndex + 100 : baseZIndex;
          if (icon.id === "seenit-image") {
            zIndex += 50;
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
                if (icon.kind === "route") {
                  setActiveProjectId(isInteracting ? icon.id : null);
                }
              }}
            />
          );
        })}

        {activeProjectId &&
          (() => {
            const activeIcon = icons.find((i) => i.id === activeProjectId);
            const previewMedia = activeIcon?.previewImage;

            if (previewMedia) {
              const isVideo = previewMedia.match(/\.(mp4|mov|webm)$/i);

              return (
                <div
                  ref={chipRef}
                  className="floatingChip floatingChip--thumbnail"
                  aria-hidden="true"
                >
                  {isVideo ? (
                    <PreviewVideo src={previewMedia} />
                  ) : (
                    <Image
                      src={previewMedia}
                      alt=""
                      width={400}
                      height={260}
                      quality={90}
                      style={{
                        width: "auto",
                        objectFit: "cover",
                        display: "block",
                      }}
                      loading="lazy"
                    />
                  )}
                </div>
              );
            }

            return (
              <div
                ref={chipRef}
                className="floatingChip"
                aria-hidden="true"
              >
                View project
              </div>
            );
          })()}
      </div>
    </div>
  );
}


