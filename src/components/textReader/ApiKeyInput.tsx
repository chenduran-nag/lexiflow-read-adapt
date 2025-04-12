import React, { useEffect } from 'react';
import geminiService from '@/services/geminiService';

const ApiKeyInput: React.FC = () => {
  useEffect(() => {
    // Initialize with the provided API key
    const defaultKey = 'AIzaSyAHvTvAshBT1u2RgBHdLXaVagMHRnePJhg';
    if (defaultKey && !localStorage.getItem('gemini_api_key')) {
      localStorage.setItem('gemini_api_key', defaultKey);
      geminiService.setApiKey(defaultKey);
    } else {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        geminiService.setApiKey(storedKey);
      }
    }
  }, []);

  return null;
};

export default ApiKeyInput;
