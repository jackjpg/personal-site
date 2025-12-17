"use client";

import React, { useEffect, useRef } from "react";

interface CaseStudyFooterShellV3Props {
  children: React.ReactNode;
}

/**
 * CaseStudyFooterShellV3
 *
 * Scroll-driven shell that shows a small preview sliver of the desktop footer.
 * Transitions the page background from case study color to white as footer enters viewport.
 */
export default function CaseStudyFooterShellV3({
  children,
}: CaseStudyFooterShellV3Props) {
  const shellRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const shell = shellRef.current;
      if (!shell) return;

      const rect = shell.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how much of the footer is visible
      // When rect.top < viewportHeight, footer is entering viewport
      const footerTop = rect.top;
      const startFade = viewportHeight; // Start fading when footer top reaches viewport bottom
      const endFade = 0; // Fully white when footer top reaches viewport top
      
      let whiteOpacity = 0;
      if (footerTop <= startFade && footerTop >= endFade) {
        // Footer is entering viewport, fade from 0 to 1
        whiteOpacity = 1 - (footerTop / viewportHeight);
      } else if (footerTop < endFade) {
        // Footer is fully in viewport
        whiteOpacity = 1;
      } else {
        // Footer hasn't entered yet
        whiteOpacity = 0;
      }
      
      // Interpolate between case study color (#F1EDEA) and white
      const whiteOpacityValue = Math.min(1, Math.max(0, whiteOpacity));
      const caseStudyColor = { r: 241, g: 237, b: 234 };
      const white = { r: 255, g: 255, b: 255 };
      
      const r = Math.round(caseStudyColor.r + (white.r - caseStudyColor.r) * whiteOpacityValue);
      const g = Math.round(caseStudyColor.g + (white.g - caseStudyColor.g) * whiteOpacityValue);
      const b = Math.round(caseStudyColor.b + (white.b - caseStudyColor.b) * whiteOpacityValue);
      
      document.body.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Reset on unmount
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div ref={shellRef} className="case-study-v3-footer-preview-shell">
      <div className="case-study-v3-footer-preview-inner">
        {children}
      </div>
    </div>
  );
}


