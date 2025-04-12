import { GoogleGenerativeAI } from "@google/generative-ai";

interface GeminiSimplificationOptions {
  level: 'easy' | 'medium' | 'original';
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private apiKey: string | null = null;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  /**
   * Simplify text using Gemini API based on specified complexity level
   */
  async simplifyText(text: string, options: GeminiSimplificationOptions): Promise<string> {
    if (options.level === 'original') {
      return text;
    }

    if (!this.apiKey) {
      throw new Error('Gemini API key is not set. Please provide an API key.');
    }

    try {
      // Determine the audience based on difficulty level
      const audience = options.level === 'easy' ? 'a 10-year-old' : 'a teenager';
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `You are a helpful assistant that simplifies complex text for ${audience}. 
                  Keep the meaning intact but use simpler vocabulary and shorter sentences.
                  Respond with only the simplified text, no explanations or additional context.
                  
                  Simplify this text for ${audience}: ${text}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`Gemini API Error: ${data.error.message}`);
      }
      
      // Extract the simplified text from the Gemini response
      const simplifiedText = data.candidates[0].content.parts[0].text;
      return simplifiedText.trim();
    } catch (error) {
      console.error('Error simplifying text with Gemini:', error);
      throw error;
    }
  }

  async getWordDefinition(word: string, level: string = 'original'): Promise<{
    definition: string;
    example: string;
    partOfSpeech: string;
    phonetic?: string;
  }> {
    if (!this.apiKey) {
      throw new Error('Gemini API key is not set.');
    }

    const prompt = `Define the word "${word}" in a clear ${level}-level way. Include:
    1. A brief definition
    2. An example sentence
    3. The part of speech
    4. Pronunciation (if available)

    Respond in this exact JSON format:
    {
      "definition": "brief definition",
      "example": "example sentence",
      "partOfSpeech": "noun/verb/etc",
      "phonetic": "pronunciation (optional)"
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          temperature: 0.2,
          maxTokens: 150,
          topP: 1,
          frequencyPenalty: 0,
          presencePenalty: 0,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.choices || !data.choices[0]?.text) {
        throw new Error('Invalid response from Gemini API.');
      }

      const text = data.choices[0].text.trim();

      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Response does not contain valid JSON.');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        definition: parsed.definition || 'Definition not available',
        example: parsed.example || 'Example not available',
        partOfSpeech: parsed.partOfSpeech || 'unknown',
        phonetic: parsed.phonetic || undefined,
      };
    } catch (error) {
      console.error('Error fetching word definition:', error);
      throw new Error('Failed to fetch definition from Gemini API.');
    }
  }
}

const geminiService = new GeminiService('AIzaSyBpncdk71-xtYZVgc9DcSuvc6cPRHIjbVQ');
export default geminiService;
