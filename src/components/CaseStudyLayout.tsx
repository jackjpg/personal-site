import React from 'react';

interface CaseStudyLayoutProps {
  title: string;
  subtitle?: string;
  introduction?: string;
  meta?: Array<{ label: string; value: string }>;
  children: React.ReactNode;
  slug?: string;
}

export default function CaseStudyLayout({ 
  title, 
  subtitle, 
  introduction,
  meta, 
  children,
  slug
}: CaseStudyLayoutProps) {
  const isPostSale = slug === 'post-sale';
  
  // Extract intro paragraph from children for post-sale page
  let introParagraph: React.ReactNode | null = null;
  let remainingChildren: React.ReactNode[] = [];
  
  if (isPostSale) {
    const childrenArray = React.Children.toArray(children);
    
    // Helper function to check if an element has the intro class
    const hasIntroClass = (child: React.ReactElement): boolean => {
      const props = child.props as any;
      const className = props?.className;
      
      if (typeof className === 'string') {
        return className === 'case-study-intro-paragraph' || className.includes('case-study-intro-paragraph');
      }
      if (Array.isArray(className)) {
        return className.some((cls: any) => cls === 'case-study-intro-paragraph' || (typeof cls === 'string' && cls.includes('case-study-intro-paragraph')));
      }
      return false;
    };
    
    // Extract intro paragraph and filter it out from remaining children
    childrenArray.forEach((child) => {
      if (React.isValidElement(child)) {
        if (hasIntroClass(child)) {
          // Found the intro paragraph - don't add to remainingChildren
          if (!introParagraph) {
            introParagraph = child;
          }
          return; // Skip adding to remainingChildren
        }
        // Check if it's a wrapper with children that might contain the intro paragraph
        const props = child.props as any;
        if (props?.children) {
          const childNodes = React.Children.toArray(props.children);
          let hasIntroChild = false;
          const filteredChildren: React.ReactNode[] = [];
          
          childNodes.forEach((grandChild) => {
            if (React.isValidElement(grandChild) && hasIntroClass(grandChild)) {
              if (!introParagraph) {
                introParagraph = grandChild;
                hasIntroChild = true;
              }
            } else {
              filteredChildren.push(grandChild);
            }
          });
          
          // If we found the intro paragraph in this child's children, clone the parent without it
          if (hasIntroChild) {
            remainingChildren.push(React.cloneElement(child, { ...props, children: filteredChildren }));
            return;
          }
        }
      }
      // Add to remaining children if it's not the intro paragraph
      remainingChildren.push(child);
    });
  }
  
  return (
    <div className="case-study-container" data-case-slug={slug}>
      <header className={`case-study-header ${title.toLowerCase().includes('screenshots') ? 'seenit-header' : ''} ${isPostSale ? 'post-sale-header' : ''}`}>
        {isPostSale ? (
          <div className="case-study-header-grid">
            <h1 className="case-study-title">{title}</h1>
            <div className="case-study-header-right">
              {introParagraph}
            </div>
          </div>
        ) : (
          <>
        <h1 className="case-study-title">{title}</h1>
        {subtitle && <p className="case-study-subtitle">{subtitle}</p>}
        {meta && meta.length > 0 && (
          <dl className="case-study-meta">
            {meta.map(({ label, value }) => (
              <div key={label} className="case-study-meta-item">
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {introduction && (
          <div className="case-study-introduction">
            {introduction.split('\n\n').map((paragraph, index) => (
              <p key={index}>{paragraph.trim()}</p>
            ))}
          </div>
            )}
          </>
        )}
      </header>
      <div className="case-study-prose">
        {isPostSale ? remainingChildren : children}
      </div>
    </div>
  );
}

