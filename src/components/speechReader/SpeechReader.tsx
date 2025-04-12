import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SpeechReaderProps {
  text: string;
}

const SpeechReader: React.FC<SpeechReaderProps> = ({ text }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [comparison, setComparison] = useState<{ word: string; status: 'correct' | 'incorrect' | 'skipped' }[]>([]);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const timeoutRef = useRef<number | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        // Compare with original text
        compareTexts(text, transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        toast({
          title: "Speech Recognition Error",
          description: "There was an error with the speech recognition. Please try again.",
          variant: "destructive",
        });
      };
      
      recognitionInstance.onend = () => {
        if (isListening) {
          recognitionInstance.start();
        }
      };
      
      setRecognition(recognitionInstance);
    } else {
      toast({
        title: "Browser Not Supported",
        description: "Your browser doesn't support speech recognition. Please try Chrome, Edge, or Safari.",
        variant: "destructive",
      });
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [text, isListening, toast]);

  // Toggle listening state
  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setComparison([]);
      setFeedback(null);
      recognition.start();
      setIsListening(true);
    }
  };

  // Reset the speech reader
  const resetReader = () => {
    setTranscript('');
    setComparison([]);
    setFeedback(null);
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    }
  };

  // Compare spoken text with original text
  const compareTexts = (original: string, spoken: string) => {
    const originalWords = original.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const spokenWords = spoken.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    const comparisonResult = originalWords.map((word, index) => {
      if (index >= spokenWords.length) {
        return { word, status: 'skipped' as const };
      }
      
      // Check for exact match or close match (allowing for some pronunciation differences)
      const isCorrect = word === spokenWords[index] || 
                        calculateSimilarity(word, spokenWords[index]) > 0.8;
      
      return { 
        word, 
        status: isCorrect ? 'correct' as const : 'incorrect' as const 
      };
    });
    
    setComparison(comparisonResult);
    
    // Provide feedback
    provideFeedback(comparisonResult);
  };

  // Calculate similarity between two strings (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;
    
    const track = Array(str2.length + 1).fill(null).map(() => 
      Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }
    
    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator // substitution
        );
      }
    }
    
    const distance = track[str2.length][str1.length];
    const maxLength = Math.max(str1.length, str2.length);
    return 1 - distance / maxLength;
  };

  // Provide feedback based on comparison
  const provideFeedback = (comparisonResult: { word: string; status: 'correct' | 'incorrect' | 'skipped' }[]) => {
    const incorrectCount = comparisonResult.filter(item => item.status === 'incorrect').length;
    const skippedCount = comparisonResult.filter(item => item.status === 'skipped').length;
    
    if (incorrectCount === 0 && skippedCount === 0) {
      setFeedback("Excellent reading! You read all words correctly.");
    } else if (incorrectCount > 0) {
      // Find a challenging word to give specific feedback on
      const challengingWord = comparisonResult.find(item => item.status === 'incorrect');
      if (challengingWord) {
        setFeedback(`Try that again? The word "${challengingWord.word}" was a bit tricky.`);
      } else {
        setFeedback("Try that again? There were some misread words.");
      }
    } else if (skippedCount > 0) {
      setFeedback("You skipped some words. Try reading the passage again.");
    }
    
    // Clear previous timeout if exists
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    // Set a timeout to clear feedback after 5 seconds
    timeoutRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 5000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Speech-to-Text Guided Reading</h3>
        <div className="flex gap-2">
          <Button 
            variant={isListening ? "destructive" : "outline"} 
            size="icon"
            onClick={toggleListening}
            disabled={!recognition}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={resetReader}
            aria-label="Reset reader"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {feedback && (
        <div className={`p-3 rounded-md flex items-start gap-2 ${
          feedback.includes("Excellent") ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200" : 
          "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200"
        }`}>
          {feedback.includes("Excellent") ? (
            <CheckCircle className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5" />
          )}
          <p className="text-sm">{feedback}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-md p-4 bg-card">
          <h4 className="text-sm font-medium mb-2">Text to read:</h4>
          <div className="p-3 bg-muted/30 rounded-md max-h-[300px] overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">{text}</p>
          </div>
        </div>
        
        <div className="border rounded-md p-4 bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Your reading:</h4>
          <p className="text-sm text-muted-foreground min-h-[2rem]">
            {transcript || (isListening ? "Listening..." : "Click the microphone to start reading")}
          </p>
        </div>
      </div>
      
      <div className="border rounded-md p-4">
        <h4 className="text-sm font-medium mb-2">Word comparison:</h4>
        <div className="flex flex-wrap gap-1">
          {comparison.map((item, index) => (
            <span 
              key={index} 
              className={`px-1.5 py-0.5 rounded text-sm ${
                item.status === 'correct' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
                item.status === 'incorrect' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
                'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
              }`}
            >
              {item.word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeechReader; 