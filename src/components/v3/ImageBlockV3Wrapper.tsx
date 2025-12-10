"use client";

import ImageBlockV3 from './ImageBlockV3';

interface ImageBlockV3WrapperProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'none';
}

export default function ImageBlockV3Wrapper(props: ImageBlockV3WrapperProps) {
  // Check if this is a hero image by filename (common pattern: hero, Hero, or first image after nav)
  const isHero = props.src.toLowerCase().includes('hero') || 
                 props.src.toLowerCase().includes('hero_bmw') ||
                 props.alt.toLowerCase().includes('hero');

  return <ImageBlockV3 {...props} priority={isHero} />;
}

