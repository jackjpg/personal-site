"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

export interface MediaItem {
  src: string;
  alt: string;
  caption?: string;
  type: 'image' | 'video';
}

interface MediaContextType {
  mediaItems: MediaItem[];
  registerMedia: (item: MediaItem) => number; // Returns the index
  openModal: (index: number) => void;
  closeModal: () => void;
  currentIndex: number | null;
  isOpen: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: ReactNode }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const itemsRef = useRef<MediaItem[]>([]);

  const registerMedia = useCallback((item: MediaItem): number => {
    // Check if item already exists to avoid duplicates
    const existingIndex = itemsRef.current.findIndex((existing) => existing.src === item.src);
    if (existingIndex !== -1) {
      return existingIndex;
    }
    
    const newIndex = itemsRef.current.length;
    itemsRef.current = [...itemsRef.current, item];
    setMediaItems(itemsRef.current);
    return newIndex;
  }, []);

  const openModal = useCallback((index: number) => {
    if (index >= 0 && index < mediaItems.length) {
      setCurrentIndex(index);
      setIsOpen(true);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }, [mediaItems.length]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setCurrentIndex(null);
    // Restore body scroll
    document.body.style.overflow = '';
  }, []);

  const goToNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < mediaItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, mediaItems.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex, mediaItems.length]);

  return (
    <MediaContext.Provider
      value={{
        mediaItems,
        registerMedia,
        openModal,
        closeModal,
        currentIndex,
        isOpen,
        goToNext,
        goToPrevious,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}

