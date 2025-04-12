import geminiService from './geminiService';
import axios from 'axios';

interface Definition {
  definition: string;
  phonetic?: string;
  partOfSpeech?: string;
  frequency?: 'common' | 'uncommon' | 'rare';
}

class DictionaryService {
  // Mock data for MVP - in a real app this would connect to a dictionary API
  private dictionaryData: Record<string, Definition> = {
    "read": {
      definition: "To look at and understand the meaning of letters, words, symbols, etc.",
      phonetic: "riːd",
      partOfSpeech: "verb"
    },
    "book": {
      definition: "A set of printed or written pages bound together along one edge.",
      phonetic: "bʊk",
      partOfSpeech: "noun"
    },
    "word": {
      definition: "A single unit of language that has meaning and can be spoken or written.",
      phonetic: "wɜːd",
      partOfSpeech: "noun"
    },
    "text": {
      definition: "The main body of printed or written matter on a page.",
      phonetic: "tekst",
      partOfSpeech: "noun"
    },
    "dyslexia": {
      definition: "A learning disorder characterized by difficulty reading due to problems identifying speech sounds and learning how they relate to letters and words.",
      phonetic: "dɪsˈleksiə",
      partOfSpeech: "noun"
    },
    "dictionary": {
      definition: "A reference book containing an alphabetical list of words with information about them.",
      phonetic: "ˈdɪkʃənəri",
      partOfSpeech: "noun"
    },
    "difficult": {
      definition: "Needing much effort or skill to accomplish, deal with, or understand.",
      phonetic: "ˈdɪfɪkəlt",
      partOfSpeech: "adjective",
      frequency: "common"
    },
    "comprehend": {
      definition: "To understand or grasp fully with the mind.",
      phonetic: "ˌkɒmprɪˈhend",
      partOfSpeech: "verb",
      frequency: "uncommon"
    },
    "eloquent": {
      definition: "Fluent or persuasive in speaking or writing.",
      phonetic: "ˈeləkwənt",
      partOfSpeech: "adjective",
      frequency: "rare"
    },
  };

  // Get definition with simplification level
  async getDefinition(word: string, simplificationLevel: string = 'original', context?: string): Promise<Definition> {
    const normalizedWord = word.toLowerCase().trim();
    
    // First, check mock data
    const mockDefinition = this.dictionaryData[normalizedWord];
    if (mockDefinition) {
      return mockDefinition;
    }

    try {
      // Fetch definition from the free dictionary API
      const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${normalizedWord}`);
      const data = response.data[0];

      if (!data || !data.meanings || data.meanings.length === 0) {
        throw new Error('No valid data returned from API');
      }

      // Extract relevant fields from the API response
      const phonetic = data.phonetic || undefined;

      // Score and prioritize definitions based on relevance
      const scoredMeanings = data.meanings.map((meaning: any) => {
        const score = this.calculateRelevanceScore(meaning.definitions[0]?.definition || '', context);
        return { ...meaning, score };
      });

      // Sort meanings by score in descending order
      scoredMeanings.sort((a: any, b: any) => b.score - a.score);

      const bestMeaning = scoredMeanings[0];
      const definition = bestMeaning.definitions[0]?.definition || 'Definition not available';
      const partOfSpeech = bestMeaning.partOfSpeech || 'unknown';

      return { definition, partOfSpeech, phonetic };
    } catch (error) {
      console.warn(`Primary API failed for "${word}". Attempting fallback.`);

      // Fallback: Try a secondary API or alternative approach
      return this.getFallbackDefinition(word, context);
    }
  }

  private calculateRelevanceScore(definition: string, context?: string): number {
    let score = 0;

    // Increase score for definitions that match the provided context
    if (context && definition.toLowerCase().includes(context.toLowerCase())) {
      score += 20;
    }

    // Increase score for definitions that are concise and clear
    if (definition.split(' ').length <= 10) {
      score += 10;
    }

    // Increase score for definitions that avoid overly complex language
    const complexWords = ['complicated', 'difficult', 'technical'];
    if (!complexWords.some(word => definition.toLowerCase().includes(word))) {
      score += 5;
    }

    return score;
  }

  private async getFallbackDefinition(word: string, context?: string): Promise<Definition> {
    try {
      // Example fallback: Use another dictionary API or a hardcoded fallback
      const response = await axios.get(`https://api.datamuse.com/words?sp=${word}&md=d`);
      const data = response.data[0];

      if (!data || !data.defs || data.defs.length === 0) {
        throw new Error('No valid data returned from fallback API');
      }

      // Extract relevant fields from the fallback API response
      let definition = data.defs[0]?.split('\t')[1] || 'Definition not available';
      const partOfSpeech = data.defs[0]?.split('\t')[0] || 'unknown';

      // Adjust definition based on context if provided
      if (context) {
        const contextMatch = data.defs.find((def: string) => def.includes(context));
        if (contextMatch) {
          definition = contextMatch.split('\t')[1] || definition;
        }
      }

      return {
        definition,
        partOfSpeech,
        phonetic: undefined, // Fallback API may not provide phonetics
      };
    } catch (error) {
      console.error(`Fallback API failed for "${word}":`, error.message || error);

      // Final fallback: Return a basic definition
      return {
        definition: `${word} - A word in the English language`,
        partOfSpeech: 'unknown',
      };
    }
  }

  // Get image for a word
  async getImage(word: string): Promise<string | null> {
    // Normalize word to lowercase for lookup
    const normalizedWord = word.toLowerCase();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock image URLs for demo purposes
    // In a real implementation, this would call an image API
    const imageMap: Record<string, string> = {
      "book": "https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?q=80&w=600",
      "read": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?q=80&w=600",
      "word": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=600",
      "text": "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600",
      "dyslexia": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600",
      "dictionary": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600",
    };
    
    return imageMap[normalizedWord] || null;
  }
  
  // Helper to simplify text based on level
  // In a real implementation, this would use NLP
  private simplifyText(text: string, level: 'easy' | 'medium'): string {
    if (level === 'easy') {
      // For easy, keep sentences very short by splitting long ones
      const simplifiedText = text
        .replace(/(\.|,) /g, '.\n') // Break at periods and commas
        .split('\n')
        .filter(s => s.length > 0)
        .map(s => s.trim())
        .join('. ');
      
      return simplifiedText;
    } else {
      // For medium, just do minor simplifications
      return text;
    }
  }

  // Add method to check if a word is considered "hard"
  isHardWord(word: string): boolean {
    const definition = this.dictionaryData[word.toLowerCase()];
    return definition?.frequency === 'uncommon' || definition?.frequency === 'rare';
  }
}

const dictionaryService = new DictionaryService();
export default dictionaryService;
