"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const textSequence = [
  "Jack Parrish designs products that think of you",
  ", across social, marketplaces, and mobile experiences.",
  "Previously led consumer design at Motorway, now making AI messaging for friends."
];

const TYPING_SPEED = 25; // ms per character
const BLUR_TRAIL = 4; // characters behind that are still blurred

function ArrowIcon({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        if (!disabled) onClick();
      }}
      className="siteHeader__arrow"
      aria-label="Show more"
      style={{ opacity: disabled ? 0.3 : 1, cursor: disabled ? 'default' : 'pointer' }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', transform: 'rotate(180deg)' }}
      >
        <path d="M20 43L6 28L20 13" stroke="currentColor" strokeWidth="2"/>
        <path d="M6 28H50" stroke="currentColor" strokeWidth="2"/>
      </svg>
    </button>
  );
}

export default function Header({ interClassName }: { interClassName: string }) {
  const [revealedCount, setRevealedCount] = useState(1);
  const [typingIndex, setTypingIndex] = useState<number | null>(null);
  const [typedChars, setTypedChars] = useState(0);
  const [trailingBlur, setTrailingBlur] = useState(0); // Track blur clearing after typing
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleArrowClick = () => {
    if (typingIndex !== null) return; // Already typing
    if (trailingBlur > 0) return; // Still clearing blur

    // If all revealed, open X profile
    if (revealedCount >= textSequence.length) {
      window.open('https://x.com/_jackparrish', '_blank');
      return;
    }

    setTypingIndex(revealedCount);
    setTypedChars(0);
  };

  useEffect(() => {
    if (typingIndex === null) return;

    const targetText = textSequence[typingIndex];

    if (typedChars < targetText.length) {
      intervalRef.current = setTimeout(() => {
        setTypedChars((prev) => prev + 1);
      }, TYPING_SPEED);
    } else {
      // Typing complete - start clearing the trailing blur
      setRevealedCount(typingIndex + 1);
      setTypingIndex(null);
      setTrailingBlur(BLUR_TRAIL);
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [typingIndex, typedChars]);

  // Clear trailing blur character by character
  useEffect(() => {
    if (trailingBlur > 0) {
      const timer = setTimeout(() => {
        setTrailingBlur((prev) => prev - 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timer);
    }
  }, [trailingBlur]);

  const isFullyRevealed = revealedCount === textSequence.length && typingIndex === null && trailingBlur === 0;
  const isTyping = typingIndex !== null || trailingBlur > 0;

  // Calculate clear vs blurred characters for the current typing segment
  const getClearChars = () => Math.max(0, typedChars - BLUR_TRAIL);
  const getBlurredChars = () => {
    if (typingIndex === null) return '';
    const text = textSequence[typingIndex];
    const clearCount = getClearChars();
    return text.slice(clearCount, typedChars);
  };
  const getClearText = () => {
    if (typingIndex === null) return '';
    const text = textSequence[typingIndex];
    return text.slice(0, getClearChars());
  };

  // For the last revealed segment, calculate trailing blur
  const getLastSegmentClear = () => {
    if (trailingBlur === 0 || revealedCount === 0) return null;
    const text = textSequence[revealedCount - 1];
    return text.slice(0, text.length - trailingBlur);
  };
  const getLastSegmentBlurred = () => {
    if (trailingBlur === 0 || revealedCount === 0) return null;
    const text = textSequence[revealedCount - 1];
    return text.slice(text.length - trailingBlur);
  };

  return (
    <header className={`siteHeader ${interClassName}`}>
      <div className="siteHeader__content">
        <Link href="/" className="siteHeader__leading">
          {textSequence.slice(0, revealedCount).map((text, index) => {
            const isLastRevealed = index === revealedCount - 1;

            // Don't add space if segment starts with punctuation
            const needsSpace = index > 0 && !text.startsWith(',') && !text.startsWith('.');

            // If this is the last revealed segment and we're clearing blur
            if (isLastRevealed && trailingBlur > 0) {
              return (
                <span key={index} className="siteHeader__text">
                  {needsSpace ? ' ' : ''}
                  {getLastSegmentClear()}
                  <span className="siteHeader__text--blur">{getLastSegmentBlurred()}</span>
                </span>
              );
            }

            return (
              <span key={index} className="siteHeader__text">
                {needsSpace ? ' ' : ''}{text}
              </span>
            );
          })}
          {typingIndex !== null && (() => {
            const currentText = textSequence[typingIndex];
            const needsSpace = !currentText.startsWith(',') && !currentText.startsWith('.');
            return (
              <span className="siteHeader__text">
                {needsSpace ? ' ' : ''}
                {getClearText()}
                <span className="siteHeader__text--blur">{getBlurredChars()}</span>
              </span>
            );
          })()}
          <ArrowIcon onClick={handleArrowClick} disabled={isTyping} />
        </Link>
      </div>
    </header>
  );
}
