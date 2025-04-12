
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, BookText, TrendingUp, BarChart2 } from 'lucide-react';

interface ReadingStatsProps {
  readingTime: number; // in seconds
  totalWords: number;
  wordsPerMinute: number;
}

const ReadingStats: React.FC<ReadingStatsProps> = ({
  readingTime,
  totalWords,
  wordsPerMinute,
}) => {
  // Format reading time
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (minutes === 0) {
      return `${remainingSeconds} sec`;
    }
    
    return `${minutes} min ${remainingSeconds} sec`;
  };

  return (
    <Card className="max-w-3xl mx-auto mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          Reading Analytics
        </CardTitle>
        <CardDescription>
          Track your reading progress and performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-md">
            <Clock className="h-5 w-5 text-primary mb-2" />
            <h3 className="text-sm font-medium text-muted-foreground">Reading Time</h3>
            <p className="text-2xl font-semibold">{formatTime(readingTime)}</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-md">
            <BookText className="h-5 w-5 text-primary mb-2" />
            <h3 className="text-sm font-medium text-muted-foreground">Total Words</h3>
            <p className="text-2xl font-semibold">{totalWords}</p>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-md">
            <TrendingUp className="h-5 w-5 text-primary mb-2" />
            <h3 className="text-sm font-medium text-muted-foreground">Words Per Minute</h3>
            <p className="text-2xl font-semibold">{wordsPerMinute.toFixed(0)}</p>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Based on your reading speed, we suggest:</p>
          <ul className="list-disc pl-5">
            {wordsPerMinute < 100 ? (
              <>
                <li>Try using a larger font size</li>
                <li>Consider wider text spacing</li>
                <li>Enable word-by-word highlighting</li>
              </>
            ) : wordsPerMinute < 200 ? (
              <>
                <li>Your reading speed is good</li>
                <li>Experiment with different fonts to see what works best</li>
                <li>Try text-to-speech for longer passages</li>
              </>
            ) : (
              <>
                <li>You're reading at an excellent pace</li>
                <li>Try challenging yourself with more complex texts</li>
                <li>Consider disabling highlighting if not needed</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadingStats;
