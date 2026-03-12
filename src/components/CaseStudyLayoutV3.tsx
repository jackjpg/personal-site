"use client";

import React from 'react';
import ProjectNavV3 from './v3/ProjectNavV3';
import MoreWorkV3 from './v3/MoreWorkV3';

interface CaseStudyLayoutV3Props {
  children: React.ReactNode;
  slug?: string;
  title: string;
  date?: string;
}

export default function CaseStudyLayoutV3({
  children,
  slug,
  title,
  date
}: CaseStudyLayoutV3Props) {
  return (
    <div className="case-study-v3-wrapper">
      <div className="case-study-v3-container" data-case-slug={slug}>
        <ProjectNavV3 title={title} date={date} />
        {children}
        {slug && <MoreWorkV3 current={slug} />}
      </div>
    </div>
  );
}

