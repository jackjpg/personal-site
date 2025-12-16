"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useMedia } from "@/contexts/MediaContext";

interface ImageBlockV3Props {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'none';
  priority?: boolean;
}

const aspectRatioMap = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '3:2': 'aspect-[3/2]',
  'none': '',
};

export default function ImageBlockV3({ 
  src, 
  alt, 
  caption,
  aspectRatio = '16:9',
  priority = false
}: ImageBlockV3Props) {
  const isVideo = src.match(/\.(mp4|webm|ogg|mov)$/i);
  const { registerMedia, openModal } = useMedia();
  const indexRef = useRef<number | null>(null);
  
  // Bypass Next.js optimization to preserve original image quality for case studies
  // Quality 100 with optimization can still reduce quality, so we use unoptimized
  const shouldUnoptimize = true;
  
  // Register this media item when component mounts
  useEffect(() => {
    const index = registerMedia({
      src,
      alt,
      caption,
      type: isVideo ? 'video' : 'image',
    });
    indexRef.current = index;
  }, [src, alt, caption, isVideo, registerMedia]);

  const handleClick = () => {
    if (indexRef.current !== null) {
      openModal(indexRef.current);
    }
  };
  
  return (
    <figure 
      className="case-study-v3-image-block case-study-v3-image-block--clickable"
      onClick={handleClick}
    >
      <div className={`case-study-v3-image-wrapper ${aspectRatioMap[aspectRatio]}`}>
        {isVideo ? (
          <div 
            style={{
              width: '100%',
              height: aspectRatio === 'none' ? 'auto' : '100%',
              backgroundColor: '#ffffff',
              position: aspectRatio === 'none' ? 'relative' : 'absolute',
              top: aspectRatio === 'none' ? 'auto' : 0,
              left: aspectRatio === 'none' ? 'auto' : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <video
              controls
              loop
              muted
              playsInline
              preload="none"
              className="case-study-v3-image"
              style={{
                position: aspectRatio === 'none' ? 'relative' : 'relative',
                top: aspectRatio === 'none' ? 'auto' : 'auto',
                left: aspectRatio === 'none' ? 'auto' : 'auto',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center'
              }}
            >
              <source src={src} type="video/mp4" />
              <source src={src} type="video/webm" />
              <source src={src} type="video/ogg" />
              <source src={src} type="video/quicktime" />
            </video>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            {...(aspectRatio === 'none' 
              ? { width: 1024, height: 768 } 
              : { fill: true }
            )}
            sizes="(min-width: 1024px) 1024px, 100vw"
            quality={100}
            priority={priority}
            loading={priority ? undefined : 'lazy'}
            unoptimized={shouldUnoptimize}
            className="case-study-v3-image"
            style={aspectRatio === 'none' ? { position: 'relative', width: '100%', height: 'auto' } : undefined}
          />
        )}
      </div>
      {caption && (
        <figcaption className="case-study-v3-image-caption">{caption}</figcaption>
      )}
    </figure>
  );
}

