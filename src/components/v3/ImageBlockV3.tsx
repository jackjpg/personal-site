"use client";

import Image from "next/image";

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
  
  // Bypass Next.js optimization to preserve original image quality
  const shouldUnoptimize = true;
  
  return (
    <figure className="case-study-v3-image-block">
      <div className={`case-study-v3-image-wrapper ${aspectRatioMap[aspectRatio]}`}>
        {isVideo ? (
          <div 
            style={{
              width: '100%',
              height: aspectRatio === 'none' ? 'auto' : '100%',
              backgroundColor: 'transparent',
              position: aspectRatio === 'none' ? 'relative' : 'absolute',
              top: aspectRatio === 'none' ? 'auto' : 0,
              left: aspectRatio === 'none' ? 'auto' : 0
            }}
          >
            <video
              controls
              loop
              muted
              playsInline
              preload="metadata"
              className="case-study-v3-image"
              style={{
                position: aspectRatio === 'none' ? 'relative' : 'absolute',
                top: aspectRatio === 'none' ? 'auto' : 0,
                left: aspectRatio === 'none' ? 'auto' : 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
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

