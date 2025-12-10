import React from 'react';
import CSImage from './CSImage';

interface ContentProps {
  children: React.ReactNode;
}

interface ContentPProps {
  text?: string;
  children?: React.ReactNode;
}

interface ContentH2Props {
  children: React.ReactNode;
}

interface ContentImageProps {
  src: string;
  alt: string;
  breakout?: boolean;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'none';
}

function ContentP({ text, children }: ContentPProps) {
  return <p>{text || children}</p>;
}

function ContentH2({ children }: ContentH2Props) {
  return <h2>{children}</h2>;
}

function ContentImage({ 
  src, 
  alt, 
  breakout = false, 
  caption,
  aspectRatio = '16:9'
}: ContentImageProps) {
  return (
    <CSImage
      src={src}
      alt={alt}
      caption={caption}
      aspectRatio={aspectRatio}
      size={breakout ? 'large' : 'medium'}
      fullWidth={breakout}
    />
  );
}

function Content({ children }: ContentProps) {
  return <div className="case-study-v2-content">{children}</div>;
}

Content.P = ContentP;
Content.H2 = ContentH2;
Content.Image = ContentImage;

export default Content;

