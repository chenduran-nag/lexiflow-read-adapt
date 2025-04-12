import React, { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Loader2, ImageIcon, BookOpen, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import dictionaryService from '@/services/dictionaryService';
import speechService from '@/services/speechService';

interface DictionaryPopupProps {
  word: string;
  children: React.ReactNode;
  simplificationLevel: string;
  showImages: boolean;
}

const DictionaryPopup: React.FC<DictionaryPopupProps> = ({
  word,
  children,
  simplificationLevel,
  showImages,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const cleanWord = word.replace(/[^\w\s]/gi, '');

  // Don't show hover card for very short words, punctuation, or numbers
  if (cleanWord.length <= 1 || /^\d+$/.test(cleanWord)) {
    return <>{children}</>;
  }

  const { data: definition, isLoading: isLoadingDefinition } = useQuery({
    queryKey: ['dictionary', cleanWord, simplificationLevel],
    queryFn: () => dictionaryService.getDefinition(cleanWord, simplificationLevel),
    enabled: cleanWord.length > 1,
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const { data: imageUrl, isLoading: isLoadingImage } = useQuery({
    queryKey: ['image', cleanWord],
    queryFn: () => dictionaryService.getImage(cleanWord),
    enabled: showImages && cleanWord.length > 0,
  });

  const handleSpeak = () => {
    setIsSpeaking(true);
    speechService.speak({
      text: cleanWord,
      rate: 1.0,
      onEnd: () => setIsSpeaking(false),
    });
  };

  return (
    <HoverCard openDelay={2000}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80 p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <h3 className="text-lg font-medium">{cleanWord}</h3>
                {definition?.phonetic && (
                  <p className="text-xs text-muted-foreground">/{definition.phonetic}/</p>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSpeak}
              disabled={isSpeaking}
              className="h-8 w-8"
            >
              <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-primary' : ''}`} />
            </Button>
          </div>

          {isLoadingDefinition ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : (
            <div className="space-y-3">
              {definition?.partOfSpeech && (
                <p className="text-xs font-medium text-muted-foreground italic">
                  {definition.partOfSpeech}
                </p>
              )}
              <div>
                <h4 className="text-sm font-medium">Definition</h4>
                <p className="text-sm">{definition?.definition}</p>
              </div>
            </div>
          )}

          {showImages && (
            <div className="pt-2">
              {isLoadingImage ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : imageUrl ? (
                <div className="rounded-md overflow-hidden border">
                  <img
                    src={imageUrl}
                    alt={cleanWord}
                    className="w-full h-auto max-h-40 object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground p-2 border rounded-md">
                  <ImageIcon className="h-4 w-4" />
                  <span>No image available</span>
                </div>
              )}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default DictionaryPopup;
