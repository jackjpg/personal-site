"use client";

import Image from "next/image";

interface CSImageProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'none';
  style?: React.CSSProperties;
  size?: 'medium' | 'large';
}

const aspectRatioMap = {
  '16:9': 'aspect-[16/9]',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '3:2': 'aspect-[3/2]',
  'none': '',
};

export default function CSImage({ 
  src, 
  alt, 
  caption, 
  aspectRatio = '16:9',
  style,
  size = 'medium'
}: CSImageProps) {
  const isVideo = src.match(/\.(mp4|webm|ogg|mov)$/i);
  
  // Generate poster image path for videos
  const getPosterPath = (videoSrc: string) => {
    const basePath = videoSrc.replace(/\.(mp4|webm|ogg|mov)$/i, '');
    return `${basePath}_poster.jpg`;
  };
  
  // Compute width behavior based on size variant
  const isLarge = size === 'large';
  const maxWidth = isLarge ? '1228px' : '810px';
  
  return (
    <figure className="cs-image-figure" style={style || { margin: '32px 0' }}>
      <div 
        className={`cs-image-wrapper ${aspectRatioMap[aspectRatio]}`}
        style={{
          maxWidth: maxWidth,
          width: '100%',
          margin: '0 auto',
          ...(isLarge && {
            marginLeft: '50%',
            transform: 'translateX(-50%)',
            width: `min(${maxWidth}, 100vw - 48px)`
          })
        }}
      >
        {isVideo ? (
          <div 
            style={{
              width: '100%',
              height: aspectRatio === 'none' ? '500px' : '100%',
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
              preload="auto"
              className="cs-image"
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
            fill={aspectRatio !== 'none'}
            width={aspectRatio === 'none' ? 1288 : undefined}
            height={aspectRatio === 'none' ? 0 : undefined}
            sizes="(min-width: 1300px) 1288px, (min-width: 820px) 810px, 92vw"
            quality={100}
            className="cs-image"
            style={aspectRatio === 'none' ? { position: 'relative', width: '100%', height: 'auto' } : undefined}
          />
        )}
      </div>
      {caption && (
        <figcaption className="cs-image-caption">{caption}</figcaption>
      )}
    </figure>
  );
}

