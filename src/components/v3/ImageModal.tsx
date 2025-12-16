"use client";

import { useEffect } from 'react';
import Image from 'next/image';
import { useMedia } from '@/contexts/MediaContext';

export default function ImageModal() {
  const { 
    mediaItems, 
    isOpen, 
    currentIndex, 
    closeModal, 
    goToNext, 
    goToPrevious 
  } = useMedia();

  const currentItem = currentIndex !== null ? mediaItems[currentIndex] : null;
  const hasMultiple = mediaItems.length > 1;
  const canGoNext = currentIndex !== null && currentIndex < mediaItems.length - 1;
  const canGoPrev = currentIndex !== null && currentIndex > 0;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal, goToNext, goToPrevious]);

  if (!isOpen || !currentItem) {
    return null;
  }

  const isVideo = currentItem.type === 'video';

  return (
    <div className="image-modal" onClick={closeModal}>
      <div className="image-modal-backdrop" />
      
      <button
        className="image-modal-close"
        onClick={closeModal}
        aria-label="Close modal"
      >
        <img 
          src="/Icons/Close_icon.svg" 
          alt="Close" 
          className="image-modal-close-icon"
        />
      </button>

      {hasMultiple && (
        <>
          <button
            className="image-modal-nav image-modal-nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            aria-label="Previous image"
            disabled={!canGoPrev}
          >
            <img 
              src="/Icons/Arrow full.svg" 
              alt="Previous" 
              className="image-modal-nav-icon image-modal-nav-icon--prev"
            />
          </button>

          <button
            className="image-modal-nav image-modal-nav--next"
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            aria-label="Next image"
            disabled={!canGoNext}
          >
            <img 
              src="/Icons/Arrow full.svg" 
              alt="Next" 
              className="image-modal-nav-icon image-modal-nav-icon--next"
            />
          </button>
        </>
      )}

      <div 
        className="image-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-modal-media">
          {isVideo ? (
            <video
              src={currentItem.src}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="image-modal-video"
            >
              <source src={currentItem.src} type="video/mp4" />
              <source src={currentItem.src} type="video/webm" />
              <source src={currentItem.src} type="video/ogg" />
              <source src={currentItem.src} type="video/quicktime" />
            </video>
          ) : (
            <Image
              src={currentItem.src}
              alt={currentItem.alt}
              fill
              style={{ objectFit: 'contain' }}
              quality={100}
              unoptimized={true}
              sizes="100vw"
            />
          )}
        </div>

        {currentItem.caption && (
          <figcaption className="image-modal-caption">
            {currentItem.caption}
          </figcaption>
        )}
      </div>
    </div>
  );
}

