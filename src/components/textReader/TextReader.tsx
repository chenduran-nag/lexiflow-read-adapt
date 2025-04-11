import React, { useState, useEffect, useCallback } from 'react';
import TextInput from './TextInput';
import ReadingDisplay from './ReadingDisplay';
import ReadingControls from './ReadingControls';
import ReadingStats from '../analytics/ReadingStats';
import ApiKeyInput from './ApiKeyInput';
import speechService from '@/services/speechService';
import analyticsService from '@/services/analyticsService';
import simplificationService from '@/services/simplificationService';
import { useToast } from '@/hooks/use-toast';

const TextReader: React.FC = () => {
  // State for reader functionality
  const [text, setText] = useState<string>('');
  const [processedText, setProcessedText] = useState<string>('');
  const [isReading, setIsReading] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [isSimplifying, setIsSimplifying] = useState<boolean>(false);
  
  // State for customization options
  const [speed, setSpeed] = useState<number>(1.0);
  const [font, setFont] = useState<string>('lexend');
  const [fontSize, setFontSize] = useState<string>('text-size-lg');
  const [spacing, setSpacing] = useState<string>('text-spacing-wide');
  const [showHighlighting, setShowHighlighting] = useState<boolean>(true);
  const [wordByWord, setWordByWord] = useState<boolean>(false);
  
  // New state for additional features
  const [simplificationLevel, setSimplificationLevel] = useState<string>('original');
  const [showDictionary, setShowDictionary] = useState<boolean>(true);
  const [showImages, setShowImages] = useState<boolean>(false);
  
  // Analytics state
  const [readingTime, setReadingTime] = useState<number>(0);
  const [totalWords, setTotalWords] = useState<number>(0);
  const [wordsPerMinute, setWordsPerMinute] = useState<number>(0);
  
  const { toast } = useToast();
  
  // Split text into words for highlighting and reading
  const words = processedText.split(/(\s+)/).filter(word => word.length > 0);
  
  // Apply text simplification when level changes or text changes
  useEffect(() => {
    if (!text) return;
    
    const applySimplification = async () => {
      try {
        setIsSimplifying(true);
        const simplified = await simplificationService.simplifyText(
          text, 
          { level: simplificationLevel as 'easy' | 'medium' | 'original' }
        );
        setProcessedText(simplified);
        setIsSimplifying(false);
      } catch (error) {
        console.error('Error simplifying text:', error);
        setProcessedText(text); // Fall back to original text
        setIsSimplifying(false);
        
        toast({
          title: "Simplification Error",
          description: "Could not simplify text. Using original version.",
          variant: "destructive",
        });
      }
    };
    
    applySimplification();
  }, [text, simplificationLevel]);
  
  // Handle submitted text
  const handleTextSubmit = (newText: string) => {
    setText(newText);
    setIsReading(true);
    setCurrentWordIndex(0);
    
    // Calculate word count
    const wordCount = newText.split(/\s+/).filter(word => word.length > 0).length;
    setTotalWords(wordCount);
    
    // Start analytics session
    analyticsService.startSession(wordCount);
    
    toast({
      title: "Text Ready",
      description: `${wordCount} words loaded. Ready to start reading.`,
    });
  };
  
  // Handle text-to-speech boundary event to sync highlighting
  const handleBoundary = useCallback((event: SpeechSynthesisEvent) => {
    if (event.name === 'word') {
      // Find the word index that matches the character position
      const charIndex = event.charIndex;
      let currentChar = 0;
      let foundIndex = 0;
      
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        if (charIndex >= currentChar && charIndex < currentChar + word.length) {
          foundIndex = i;
          break;
        }
        currentChar += word.length;
      }
      
      setCurrentWordIndex(foundIndex);
    }
  }, [words]);
  
  // Toggle play/pause for TTS
  const handlePlayPause = () => {
    if (speechService.isSpeaking()) {
      if (speechService.isPaused()) {
        speechService.resume();
        setIsPlayingAudio(true);
      } else {
        speechService.pause();
        setIsPlayingAudio(false);
      }
    } else {
      // Start playing from current position
      const remainingText = words.slice(currentWordIndex).join('');
      
      speechService.speak({
        text: remainingText,
        rate: speed,
        onBoundary: handleBoundary,
        onEnd: () => {
          setIsPlayingAudio(false);
          
          // End session when playback is complete
          if (currentWordIndex >= words.length - 1) {
            const session = analyticsService.endSession();
            if (session?.totalTime) {
              setReadingTime(session.totalTime);
              
              if (session.wordsPerMinute) {
                setWordsPerMinute(session.wordsPerMinute);
              }
            }
          }
        },
      });
      
      setIsPlayingAudio(true);
    }
  };
  
  // Restart reading from beginning
  const handleRestart = () => {
    speechService.stop();
    setCurrentWordIndex(0);
    setIsPlayingAudio(false);
    
    toast({
      description: "Reading restarted from the beginning.",
    });
  };
  
  // Stop reading
  const handleStop = () => {
    speechService.stop();
    setIsPlayingAudio(false);
    
    // End analytics session
    const session = analyticsService.endSession();
    if (session?.totalTime) {
      setReadingTime(session.totalTime);
      
      if (session.wordsPerMinute) {
        setWordsPerMinute(session.wordsPerMinute);
      }
    }
  };
  
  // Handle simplification level change
  const handleSimplificationLevelChange = (level: string) => {
    setSimplificationLevel(level);
    
    toast({
      title: "Text Complexity Changed",
      description: `Text set to ${level} complexity level.`,
    });
  };
  
  // Clean up speech service on unmount
  useEffect(() => {
    return () => {
      speechService.stop();
    };
  }, []);
  
  return (
    <div className="space-y-6 py-4">
      {!isReading ? (
        <>
          <ApiKeyInput />
          <TextInput onTextSubmit={handleTextSubmit} />
        </>
      ) : (
        <div className="space-y-4">
          <ReadingControls
            isPlaying={isPlayingAudio}
            onPlayPause={handlePlayPause}
            onRestart={handleRestart}
            onStop={handleStop}
            speed={speed}
            onSpeedChange={setSpeed}
            font={font}
            onFontChange={setFont}
            fontSize={fontSize}
            onFontSizeChange={setFontSize}
            spacing={spacing}
            onSpacingChange={setSpacing}
            showHighlighting={showHighlighting}
            onHighlightingChange={setShowHighlighting}
            wordByWord={wordByWord}
            onWordByWordChange={setWordByWord}
            simplificationLevel={simplificationLevel}
            onSimplificationLevelChange={handleSimplificationLevelChange}
            showDictionary={showDictionary}
            onShowDictionaryChange={setShowDictionary}
            showImages={showImages}
            onShowImagesChange={setShowImages}
          />
          
          {isSimplifying ? (
            <div className="flex items-center justify-center p-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <span className="ml-3 text-primary">Simplifying text...</span>
            </div>
          ) : (
            <ReadingDisplay
              text={processedText}
              font={font}
              fontSize={fontSize}
              spacing={spacing}
              currentWordIndex={currentWordIndex}
              showHighlighting={showHighlighting}
              simplificationLevel={simplificationLevel}
              showDictionary={showDictionary}
              showImages={showImages}
            />
          )}
          
          <ReadingStats
            readingTime={readingTime}
            totalWords={totalWords}
            wordsPerMinute={wordsPerMinute}
          />
        </div>
      )}
    </div>
  );
};

export default TextReader;
