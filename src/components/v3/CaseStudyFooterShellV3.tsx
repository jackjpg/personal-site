"use client";

import React, { useEffect } from "react";

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
  useEffect(() => {
    // Set white background for v3 case studies
    document.body.style.backgroundColor = '#FFFFFF';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="case-study-v3-footer-preview-shell">
      <div className="case-study-v3-footer-preview-inner">
        {children}
      </div>
    </div>
  );
}


