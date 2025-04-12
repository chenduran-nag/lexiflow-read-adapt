import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import TextReader from '@/components/textReader/TextReader';

const Index = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const textReaderRef = React.useRef<{ resetReader?: () => void }>({});

  // Initialize dark mode from user preference or system preference
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true' || 
                       window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());
      
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };

  const handleReset = () => {
    if (textReaderRef.current.resetReader) {
      textReaderRef.current.resetReader();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} onReset={handleReset} />
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Welcome to LexiAdapt
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Customize your reading experience with dyslexia-friendly text adaptations and 
            text-to-speech capabilities. Paste your text or upload a file to get started.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="card backdrop-blur-sm bg-card/50">
            <TextReader ref={textReaderRef} />
          </div>
        </div>
      </main>
      
      <footer className="py-6 px-6 border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            LexiAdapt - Making reading accessible for everyone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
