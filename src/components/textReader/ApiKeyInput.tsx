
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import geminiService from '@/services/geminiService';

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isSet, setIsSet] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if API key is already stored in localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      geminiService.setApiKey(storedKey);
      setIsSet(true);
    }
  }, []);

  useEffect(() => {
    // Initialize with the provided API key
    const defaultKey = 'AIzaSyAHvTvAshBT1u2RgBHdLXaVagMHRnePJhg';
    if (defaultKey && !localStorage.getItem('gemini_api_key')) {
      localStorage.setItem('gemini_api_key', defaultKey);
      geminiService.setApiKey(defaultKey);
      setIsSet(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (apiKey.trim()) {
      // Store the API key in localStorage and service
      localStorage.setItem('gemini_api_key', apiKey);
      geminiService.setApiKey(apiKey);
      setIsSet(true);
      
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved for this session.",
      });
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid Gemini API key.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    localStorage.removeItem('gemini_api_key');
    geminiService.setApiKey('');
    setApiKey('');
    setIsSet(false);
    
    toast({
      title: "API Key Removed",
      description: "Your Gemini API key has been removed.",
    });
  };

  return (
    <div className="border rounded-md p-4 mb-4 bg-background">
      <h3 className="text-lg font-medium mb-2">Gemini API Integration</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Connect your Gemini API key to enable advanced text simplification.
      </p>
      
      {isSet ? (
        <div className="flex items-center justify-between">
          <span className="text-sm text-green-600 flex items-center">
            <Key className="h-4 w-4 mr-2" />
            API key is set and ready to use
          </span>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset API Key
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="flex-1"
          />
          <Button type="submit" disabled={!apiKey.trim()}>
            Save Key
          </Button>
        </form>
      )}
    </div>
  );
};

export default ApiKeyInput;
