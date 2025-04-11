
export interface SpeechOptions {
  text: string;
  rate: number;
  onBoundary?: (event: SpeechSynthesisEvent) => void;
  onEnd?: () => void;
}

class SpeechService {
  private utterance: SpeechSynthesisUtterance | null = null;
  private synth: SpeechSynthesis;
  
  constructor() {
    this.synth = window.speechSynthesis;
  }
  
  /**
   * Speak text with the provided options
   */
  speak({ text, rate, onBoundary, onEnd }: SpeechOptions): void {
    // Cancel any ongoing speech
    this.stop();
    
    // Create new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Set properties
    this.utterance.rate = rate;
    this.utterance.lang = 'en-US';
    
    // Set event handlers
    if (onBoundary) {
      this.utterance.onboundary = onBoundary;
    }
    
    if (onEnd) {
      this.utterance.onend = onEnd;
    }
    
    // Start speaking
    this.synth.speak(this.utterance);
  }
  
  /**
   * Pause the current speech
   */
  pause(): void {
    if (this.synth.speaking) {
      this.synth.pause();
    }
  }
  
  /**
   * Resume paused speech
   */
  resume(): void {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }
  
  /**
   * Stop and cancel all speech
   */
  stop(): void {
    this.synth.cancel();
    this.utterance = null;
  }
  
  /**
   * Check if speech synthesis is speaking or paused
   */
  isSpeaking(): boolean {
    return this.synth.speaking;
  }
  
  isPaused(): boolean {
    return this.synth.paused;
  }
  
  /**
   * Get available voices
   */
  getVoices(): SpeechSynthesisVoice[] {
    return this.synth.getVoices();
  }
}

// Create a singleton instance
const speechService = new SpeechService();
export default speechService;
