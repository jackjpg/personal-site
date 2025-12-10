import React from 'react';

interface SectionV3Props {
  title?: string;
  children: React.ReactNode;
}

export default function SectionV3({ 
  title, 
  children 
}: SectionV3Props) {
  return (
    <section className="case-study-v3-section case-study-v3-content-section">
      {title && <h2 className="case-study-v3-section-header">{title}</h2>}
      <div className="case-study-v3-body">
        {children}
      </div>
    </section>
  );
}

