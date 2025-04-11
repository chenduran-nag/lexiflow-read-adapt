import React, { useRef, useEffect, useState } from 'react';
import DictionaryPopup from './DictionaryPopup';

interface ReadingDisplayProps {
  text: string;
  font: string;
  fontSize: string;
  spacing: string;
  currentWordIndex: number;
  showHighlighting: boolean;
  simplificationLevel: string;
  showDictionary: boolean;
  showImages: boolean;
}

const ReadingDisplay: React.FC<ReadingDisplayProps> = ({
  text,
  font,
  fontSize,
  spacing,
  currentWordIndex,
  showHighlighting,
  simplificationLevel,
  showDictionary,
  showImages,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  // Split text into words, preserving punctuation and line breaks
  const words = text.split(/(\s+)/).filter(word => word.length > 0);

  useEffect(() => {
    // Scroll active word into view if highlighting is enabled
    if (showHighlighting && activeWordRef.current) {
      const container = containerRef.current;
      const activeWord = activeWordRef.current;
      
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const activeWordRect = activeWord.getBoundingClientRect();
        
        // Only scroll if the active word is outside the visible area
        if (
          activeWordRect.top < containerRect.top ||
          activeWordRect.bottom > containerRect.bottom
        ) {
          activeWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }, [currentWordIndex, showHighlighting]);

  // Create the correct font class based on the font prop
  const getFontClass = () => {
    switch (font) {
      case 'lexend':
        return 'font-lexend';
      case 'openDyslexic':
        return 'font-openDyslexic';
      case 'arial':
        return 'font-arial';
      case 'comic':
        return 'font-comic';
      default:
        return 'font-lexend';
    }
  };

  // Get the appropriate badge color for simplification level
  const getSimplificationBadgeColor = () => {
    switch (simplificationLevel) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100';
      case 'original':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getSimplificationBadgeColor()}`}>
          {simplificationLevel === 'easy' ? 'Easy (10-year-old)' : 
           simplificationLevel === 'medium' ? 'Medium (Teenager)' : 'Original'}
        </span>
      </div>
      
      <div 
        ref={containerRef}
        className={`reading-container p-6 bg-card rounded-md shadow-sm overflow-y-auto max-h-[60vh] ${fontSize} ${spacing} ${getFontClass()}`}
      >
        {words.map((word, index) => {
          const isActiveWord = index === currentWordIndex;
          
          if (word.match(/\s+/)) {
            // Preserve whitespace
            return <span key={index}>{word}</span>;
          }
          
          return (
            <DictionaryPopup
              key={index}
              word={word}
              simplificationLevel={simplificationLevel}
              showImages={showImages}
            >
              <span
                ref={isActiveWord ? activeWordRef : null}
                className={`word cursor-help ${isActiveWord && showHighlighting ? 'active' : ''}`}
              >
                {word}
              </span>
            </DictionaryPopup>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingDisplay;
