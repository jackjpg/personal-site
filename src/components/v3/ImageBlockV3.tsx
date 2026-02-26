import Image from "next/image";

interface ImageBlockV3Props {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'none';
  priority?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  border?: boolean;
  borderRadius?: string;
  gradient?: string; // CSS gradient string, e.g. "linear-gradient(to bottom, #3C2A97, #DAA588)"
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
  priority = false,
  autoPlay = false,
  loop = true,
  controls = true,
  border = false,
  borderRadius,
  gradient
}: ImageBlockV3Props) {
  const isVideo = src.match(/\.(mp4|webm|ogg|mov)$/i);

  // Bypass Next.js optimization to preserve original image quality for case studies
  // Quality 100 with optimization can still reduce quality, so we use unoptimized
  const shouldUnoptimize = true;

  return (
    <figure className="case-study-v3-image-block">
      <div
        className={`case-study-v3-image-wrapper ${aspectRatioMap[aspectRatio]}`}
        style={border ? { border: '1px solid rgba(0, 0, 0, 0.1)' } : undefined}
      >
        {isVideo ? (
          <div
            style={{
              width: '100%',
              height: aspectRatio === 'none' ? 'auto' : '100%',
              background: gradient || 'transparent',
              position: aspectRatio === 'none' ? 'relative' : 'absolute',
              top: aspectRatio === 'none' ? 'auto' : 0,
              left: aspectRatio === 'none' ? 'auto' : 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <video
              autoPlay={autoPlay}
              controls={controls}
              loop={loop}
              muted
              playsInline
              preload="metadata"
              className="case-study-v3-image"
              style={{
                position: aspectRatio === 'none' ? 'relative' : 'relative',
                top: aspectRatio === 'none' ? 'auto' : 'auto',
                left: aspectRatio === 'none' ? 'auto' : 'auto',
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                ...(borderRadius ? { borderRadius } : {})
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

