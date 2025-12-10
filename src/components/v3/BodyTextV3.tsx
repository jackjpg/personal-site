import React from 'react';

interface BodyTextV3Props {
  children: React.ReactNode;
  as?: 'p' | 'div';
}

export default function BodyTextV3({ 
  children, 
  as: Component = 'p' 
}: BodyTextV3Props) {
  return (
    <Component className="case-study-v3-body">
      {children}
    </Component>
  );
}

