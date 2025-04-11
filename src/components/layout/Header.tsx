
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Moon, Sun, Info } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleDarkMode }) => {
  const { toast } = useToast();

  const showAboutInfo = () => {
    toast({
      title: "About LexiAdapt",
      description: "LexiAdapt helps people with dyslexia read more comfortably by providing customizable text display options and text-to-speech functionality.",
      duration: 5000,
    });
  };

  return (
    <header className="border-b py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-primary">LexiAdapt</h1>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={showAboutInfo} aria-label="About LexiAdapt">
          <Info className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;
