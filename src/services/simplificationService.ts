
import geminiService from './geminiService';

interface SimplificationOptions {
  level: 'easy' | 'medium' | 'original';
}

class SimplificationService {
  /**
   * Simplify text based on the specified complexity level
   */
  async simplifyText(text: string, options: SimplificationOptions): Promise<string> {
    if (options.level === 'original') {
      return text;
    }
    
    // Try to use Gemini if API key is set
    if (geminiService.getApiKey()) {
      try {
        return await geminiService.simplifyText(text, options);
      } catch (error) {
        console.error('Gemini simplification failed, falling back to basic simplification:', error);
        // Fall back to basic simplification if Gemini fails
      }
    }
    
    // Basic fallback simplification for when Gemini is not available
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    if (options.level === 'medium') {
      return this.mediumSimplification(sentences);
    } else {
      return this.easySimplification(sentences);
    }
  }
  
  private mediumSimplification(sentences: string[]): string {
    return sentences.map(sentence => {
      // Keep sentences shorter
      const words = sentence.split(' ');
      if (words.length > 15) {
        return words.slice(0, 15).join(' ') + '.';
      }
      return sentence;
    }).join(' ');
  }
  
  private easySimplification(sentences: string[]): string {
    return sentences.map(sentence => {
      // Keep sentences very short
      const words = sentence.split(' ');
      if (words.length > 8) {
        return words.slice(0, 8).join(' ') + '.';
      }
      return sentence;
    }).join(' ');
  }
}

const simplificationService = new SimplificationService();
export default simplificationService;
