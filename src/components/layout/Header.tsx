import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Info } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onReset: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode, onReset }) => {
  const { toast } = useToast();

  const showAboutInfo = () => {
    toast({
      title: "About LexiAdapt",
      description: "LexiAdapt helps people with dyslexia read more comfortably by providing customizable text display options and text-to-speech functionality.",
      duration: 5000,
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onReset}
            className="text-2xl font-bold text-primary tracking-tight hover:text-primary/90 transition-colors"
          >
            LexiAdapt
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={showAboutInfo} 
            aria-label="About LexiAdapt"
            className="hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Info className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
