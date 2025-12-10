import React from 'react';

interface SectionHeaderV3Props {
  children: React.ReactNode;
}

export default function SectionHeaderV3({ children }: SectionHeaderV3Props) {
  return (
    <h2 className="case-study-v3-section-header">
      {children}
    </h2>
  );
}

