"use client";

import { useState } from "react";
import Image from "next/image";
import { carouselData } from '@/data/carouselData';

interface CSCarouselInteractiveProps {
  dataKey?: string;
  images?: string[];
  captions?: string[];
  items?: number;
  fullWidth?: boolean;
}

export default function CSCarouselInteractive({ dataKey, images: imagesProp, captions: captionsProp, items, fullWidth: fullWidthProp = false }: CSCarouselInteractiveProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const FallbackColors = [
    '#FC6DB3',
    '#FDE047',
    '#60A5FA',
    '#34D399',
    '#F472B6',
  ];

  // If dataKey is provided, look up from registry (bypasses RSC array serialization)
  const registryEntry = dataKey ? carouselData[dataKey] : null;
  const images = registryEntry?.images ?? imagesProp;
  const captions = registryEntry?.captions ?? captionsProp;
  const fullWidth = registryEntry?.fullWidth ?? fullWidthProp;

  const itemCount = images ? images.length : (items || 3);
  const hasImages = images && images.length > 0;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? itemCount - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === itemCount - 1 ? 0 : prev + 1));
  };

  return (
    <div className="cs-carousel">
      <div className="cs-carousel-container">
        <button
          className="cs-carousel-button cs-carousel-button--prev"
          onClick={goToPrevious}
          aria-label="Previous slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="cs-carousel-track">
          {hasImages ? (
            images!.map((src, index) => (
              <div
                key={index}
                className="cs-carousel-slide"
                style={{
                  display: index === currentIndex ? 'flex' : 'none',
                  visibility: index === currentIndex ? 'visible' : 'hidden',
                  position: index === currentIndex ? 'relative' : 'absolute'
                }}
              >
                <div className="cs-carousel-image-wrapper">
                  <Image
                    src={src}
                    alt={`Carousel image ${index + 1}`}
                    {...(fullWidth
                      ? { width: 1024, height: 768 }
                      : { fill: true }
                    )}
                    sizes={fullWidth ? "(min-width: 1024px) 1024px, 100vw" : "(min-width: 820px) 810px, 92vw"}
                    quality={100}
                    loading={index <= 1 ? "eager" : "lazy"}
                    priority={index === 0 && fullWidth}
                    unoptimized={true}
                    className="cs-carousel-image"
                    style={fullWidth ? { position: 'relative', width: '100%', height: 'auto', display: 'block', maxWidth: '100%' } : undefined}
                  />
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: itemCount }).map((_, index) => (
              <div
                key={index}
                className="cs-carousel-slide"
                style={{
                  display: index === currentIndex ? 'flex' : 'none',
                  visibility: index === currentIndex ? 'visible' : 'hidden',
                  position: index === currentIndex ? 'relative' : 'absolute'
                }}
              >
                <div
                  className="cs-carousel-image-placeholder"
                  style={{
                    backgroundColor: FallbackColors[index % FallbackColors.length],
                  }}
                />
              </div>
            ))
          )}
        </div>

        <button
          className="cs-carousel-button cs-carousel-button--next"
          onClick={goToNext}
          aria-label="Next slide"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      {captions && captions[currentIndex] && (
        <figcaption className="cs-carousel-caption">{captions[currentIndex]}</figcaption>
      )}
      <div className="cs-carousel-pips">
        {Array.from({ length: itemCount }).map((_, index) => (
          <button
            key={index}
            className={`cs-carousel-pip ${currentIndex === index ? 'cs-carousel-pip--active' : ''}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
