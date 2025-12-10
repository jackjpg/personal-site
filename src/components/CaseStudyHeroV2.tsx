import React from 'react';

interface CaseStudyHeroV2Props {
  title: string;
  role?: string;
  date?: string;
  description?: string;
  heroImage?: React.ReactNode;
}

export default function CaseStudyHeroV2({
  title,
  role,
  date,
  description,
  heroImage
}: CaseStudyHeroV2Props) {
  return (
    <div className="case-study-v2-hero">
      <div className="case-study-v2-hero-grid">
        <div className="case-study-v2-hero-left">
          <h1 className="case-study-v2-hero-title">{title}</h1>
          {(role || date) && (
            <div className="case-study-v2-hero-meta">
              {role && <div className="case-study-v2-hero-meta-item">{role}</div>}
              {date && <div className="case-study-v2-hero-meta-item">{date}</div>}
            </div>
          )}
        </div>
        {description && (
          <div className="case-study-v2-hero-right">
            <div className="case-study-v2-hero-description">
              {description.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph.trim()}</p>
              ))}
            </div>
          </div>
        )}
      </div>
      {heroImage && (
        <div className="case-study-v2-hero-image">
          {React.isValidElement(heroImage) 
            ? React.cloneElement(heroImage as React.ReactElement, { fullWidth: true })
            : heroImage
          }
        </div>
      )}
    </div>
  );
}

