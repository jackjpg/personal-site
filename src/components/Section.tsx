interface SectionProps {
  title?: string;
  children: React.ReactNode;
  spacing?: 'normal' | 'tight' | 'loose';
}

const spacingMap = {
  tight: 'cs-section-tight',
  normal: 'cs-section-normal',
  loose: 'cs-section-loose',
};

export default function Section({ 
  title, 
  children, 
  spacing = 'normal' 
}: SectionProps) {
  return (
    <section className={`cs-section ${spacingMap[spacing]}`}>
      {title && <h2 className="cs-section-title">{title}</h2>}
      <div className="cs-section-content">
        {children}
      </div>
    </section>
  );
}

