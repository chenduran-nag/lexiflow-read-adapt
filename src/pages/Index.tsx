
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import TextReader from '@/components/textReader/TextReader';

const Index = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-primary">Welcome to LexiAdapt</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Customize your reading experience with dyslexia-friendly text adaptations and 
            text-to-speech capabilities. Paste your text or upload a file to get started.
          </p>
        </div>
        
        <TextReader />
      </main>
      
      <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
        <p>LexiAdapt - Making reading accessible for everyone</p>
      </footer>
    </div>
  );
};

export default Index;
