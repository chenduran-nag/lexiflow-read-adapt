import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Play,
  Pause,
  SkipBack,
  Volume2,
  Type,
  AlignCenter,
  PaintBucket,
  CircleOff,
  RefreshCw,
  BookOpen,
  ImageIcon,
} from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger 
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReadingControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  onStop: () => void;
  speed: number;
  onSpeedChange: (value: number) => void;
  font: string;
  onFontChange: (value: string) => void;
  fontSize: string;
  onFontSizeChange: (value: string) => void;
  spacing: string;
  onSpacingChange: (value: string) => void;
  showHighlighting: boolean;
  onHighlightingChange: (value: boolean) => void;
  wordByWord: boolean;
  onWordByWordChange: (value: boolean) => void;
  simplificationLevel: string;
  onSimplificationLevelChange: (value: string) => void;
  showImages: boolean;
  onShowImagesChange: (value: boolean) => void;
  showDictionary: boolean;
  onShowDictionaryChange: (value: boolean) => void;
}

const ReadingControls: React.FC<ReadingControlsProps> = ({
  isPlaying,
  onPlayPause,
  onRestart,
  onStop,
  speed,
  onSpeedChange,
  font,
  onFontChange,
  fontSize,
  onFontSizeChange,
  spacing,
  onSpacingChange,
  showHighlighting,
  onHighlightingChange,
  wordByWord,
  onWordByWordChange,
  simplificationLevel,
  onSimplificationLevelChange,
  showImages,
  onShowImagesChange,
  showDictionary,
  onShowDictionaryChange
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center justify-between border-b border-t py-3 px-2 bg-card rounded-md">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onPlayPause}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={onRestart}
            aria-label="Restart"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={onStop}
            aria-label="Stop"
          >
            <CircleOff className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground mr-1">Speed:</span>
          <Slider
            value={[speed]}
            min={0.5}
            max={2}
            step={0.1}
            onValueChange={(value) => onSpeedChange(value[0])}
            className="w-24"
            aria-label="Reading speed"
          />
          <span className="text-xs text-muted-foreground w-8">{speed.toFixed(1)}x</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Text settings">
                <Type className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Tabs defaultValue="appearance">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="reading">Reading</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="appearance" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Text Appearance</h4>
                    <p className="text-sm text-muted-foreground">
                      Customize text appearance for better readability.
                    </p>
                  </div>
                  <Separator />
                  <div className="grid gap-3">
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="font" className="col-span-1">Font</Label>
                      <Select 
                        value={font} 
                        onValueChange={onFontChange}
                      >
                        <SelectTrigger id="font" className="col-span-3">
                          <SelectValue placeholder="Select Font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lexend">Lexend</SelectItem>
                          <SelectItem value="openDyslexic">OpenDyslexic</SelectItem>
                          <SelectItem value="arial">Arial</SelectItem>
                          <SelectItem value="comic">Comic Sans MS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="fontSize" className="col-span-1">Font Size</Label>
                      <Select 
                        value={fontSize} 
                        onValueChange={onFontSizeChange}
                      >
                        <SelectTrigger id="fontSize" className="col-span-3">
                          <SelectValue placeholder="Select Size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-size-sm">Small</SelectItem>
                          <SelectItem value="text-size-base">Normal</SelectItem>
                          <SelectItem value="text-size-lg">Large</SelectItem>
                          <SelectItem value="text-size-xl">Extra Large</SelectItem>
                          <SelectItem value="text-size-2xl">Huge</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="spacing" className="col-span-1">
                        <AlignCenter className="h-4 w-4" />
                      </Label>
                      <Select 
                        value={spacing} 
                        onValueChange={onSpacingChange}
                      >
                        <SelectTrigger id="spacing" className="col-span-3">
                          <SelectValue placeholder="Select Spacing" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text-spacing-normal">Normal</SelectItem>
                          <SelectItem value="text-spacing-wide">Wide</SelectItem>
                          <SelectItem value="text-spacing-wider">Extra Wide</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="reading" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Reading Settings</h4>
                    <p className="text-sm text-muted-foreground">
                      Adjust how text is displayed and read.
                    </p>
                  </div>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="highlighting" className="flex-grow">Text Highlighting</Label>
                      <Switch
                        id="highlighting"
                        checked={showHighlighting}
                        onCheckedChange={onHighlightingChange}
                        aria-label="Toggle text highlighting"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="wordByWord" className="flex-grow">Word-by-Word Mode</Label>
                      <Switch
                        id="wordByWord"
                        checked={wordByWord}
                        onCheckedChange={onWordByWordChange}
                        aria-label="Toggle word-by-word highlighting"
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-2">
                      <Label htmlFor="simplification" className="col-span-1">Text Level</Label>
                      <Select 
                        value={simplificationLevel} 
                        onValueChange={onSimplificationLevelChange}
                      >
                        <SelectTrigger id="simplification" className="col-span-3">
                          <SelectValue placeholder="Text Complexity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="original">Original</SelectItem>
                          <SelectItem value="medium">Medium (Simplified)</SelectItem>
                          <SelectItem value="easy">Easy (Very Simple)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Additional Features</h4>
                    <p className="text-sm text-muted-foreground">
                      Enable or disable additional reading aids.
                    </p>
                  </div>
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="images" className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        <span>Visual Aids</span>
                      </Label>
                      <Switch
                        id="images"
                        checked={showImages}
                        onCheckedChange={onShowImagesChange}
                        aria-label="Toggle visual aids"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ReadingControls;
