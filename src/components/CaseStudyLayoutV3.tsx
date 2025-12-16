"use client";

import React from 'react';
import ProjectNavV3 from './v3/ProjectNavV3';
import FooterV3 from './v3/FooterV3';
import { MediaProvider } from '@/contexts/MediaContext';
import ImageModal from './v3/ImageModal';

interface CaseStudyLayoutV3Props {
  children: React.ReactNode;
  slug?: string;
  title: string;
  date?: string;
  footerLinks?: Array<{
    title: string;
    href: string;
  }>;
}

export default function CaseStudyLayoutV3({ 
  children,
  slug,
  title,
  date,
  footerLinks
}: CaseStudyLayoutV3Props) {
  return (
    <MediaProvider>
      <div className="case-study-v3-wrapper">
        <div className="case-study-v3-container" data-case-slug={slug}>
          <ProjectNavV3 title={title} date={date} />
          {children}
          <FooterV3 links={footerLinks} />
        </div>
      </div>
      <ImageModal />
    </MediaProvider>
  );
}

