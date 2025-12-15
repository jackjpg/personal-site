import React from 'react';

interface SectionWithMediaV3Props {
  title?: string;
  children: React.ReactNode;
  media?: React.ReactNode;
}

/**
 * V3 section variant that keeps the same text column width as other v3 sections
 * but allows optional media to sit to the right on desktop.
 *
 * - Desktop: two columns (text left, media right).
 * - Mobile: stacks (text first, media below).
 */
export default function SectionWithMediaV3({
  title,
  children,
  media,
}: SectionWithMediaV3Props) {
  return (
    <section className="case-study-v3-section case-study-v3-section-with-media">
      <div className="case-study-v3-section-with-media__grid">
        <div className="case-study-v3-section-with-media__text case-study-v3-content-section">
          {title && <h2 className="case-study-v3-section-header">{title}</h2>}
          <div className="case-study-v3-body">{children}</div>
        </div>
        {media && (
          <div className="case-study-v3-section-with-media__media">
            {media}
          </div>
        )}
      </div>
    </section>
  );
}


