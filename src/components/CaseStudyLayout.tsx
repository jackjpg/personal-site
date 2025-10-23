interface CaseStudyLayoutProps {
  title: string;
  subtitle?: string;
  introduction?: string;
  meta?: { label: string; value: string }[];
  children: React.ReactNode;
}

export default function CaseStudyLayout({ 
  title, 
  subtitle, 
  introduction,
  meta, 
  children 
}: CaseStudyLayoutProps) {
  return (
    <div className="case-study-container">
      <header className="case-study-header">
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
      </header>
      <div className="case-study-prose">
        {children}
      </div>
    </div>
  );
}

