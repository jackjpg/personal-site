import React from 'react';
import CaseStudyHeroV2 from './CaseStudyHeroV2';
import Content from './Content';

interface CaseStudyLayoutV2Props {
  title: string;
  subtitle?: string;
  date?: string;
  role?: string;
  client?: string;
  introduction?: string;
  children: React.ReactNode;
  slug?: string;
  heroImage?: React.ReactNode;
}

export default function CaseStudyLayoutV2({ 
  title, 
  subtitle,
  date,
  role,
  client,
  introduction,
  children,
  slug,
  heroImage
}: CaseStudyLayoutV2Props) {
  return (
    <div className="case-study-v2-container" data-case-slug={slug}>
      <CaseStudyHeroV2
        title={title}
        role={role}
        date={date}
        description={introduction}
        heroImage={heroImage}
      />
      <Content>
        {children}
      </Content>
    </div>
  );
}



