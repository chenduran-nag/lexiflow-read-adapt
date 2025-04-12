
export interface ReadingSession {
  startTime: number;
  endTime?: number;
  totalWords: number;
  totalTime?: number;
  wordsPerMinute?: number;
}

class AnalyticsService {
  private session: ReadingSession | null = null;
  
  /**
   * Start a new reading session
   */
  startSession(totalWords: number): ReadingSession {
    this.session = {
      startTime: Date.now(),
      totalWords,
    };
    
    console.log('Reading session started', this.session);
    return this.session;
  }
  
  /**
   * End the current reading session and calculate statistics
   */
  endSession(): ReadingSession | null {
    if (!this.session) {
      console.warn('No active reading session to end');
      return null;
    }
    
    const session = this.session;
    session.endTime = Date.now();
    session.totalTime = (session.endTime - session.startTime) / 1000; // Convert to seconds
    
    // Calculate words per minute
    if (session.totalTime > 0) {
      session.wordsPerMinute = (session.totalWords / session.totalTime) * 60;
    } else {
      session.wordsPerMinute = 0;
    }
    
    console.log('Reading session ended', session);
    
    // Store in localStorage for persistence
    this.saveSession(session);
    
    return session;
  }
  
  /**
   * Get the current active session
   */
  getCurrentSession(): ReadingSession | null {
    return this.session;
  }
  
  /**
   * Save session to local storage
   */
  private saveSession(session: ReadingSession): void {
    try {
      const sessions = this.getSavedSessions();
      sessions.push(session);
      localStorage.setItem('readingSessions', JSON.stringify(sessions));
    } catch (error) {
      console.error('Failed to save reading session', error);
    }
  }
  
  /**
   * Get all saved sessions from local storage
   */
  getSavedSessions(): ReadingSession[] {
    try {
      const sessionsData = localStorage.getItem('readingSessions');
      return sessionsData ? JSON.parse(sessionsData) : [];
    } catch (error) {
      console.error('Failed to retrieve reading sessions', error);
      return [];
    }
  }
}

// Create a singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
