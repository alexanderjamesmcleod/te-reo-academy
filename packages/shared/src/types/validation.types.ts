// Card and validation types for validators

export interface Card {
  id: string;
  maori: string;
  english: string;
  type: string;
  color: string;
  [key: string]: any; // Allow additional properties
}

export interface Challenge {
  id: string;
  instruction: string;
  pattern: string[];
  target?: {
    maori: string;
    english: string;
  };
  requiredWords?: string[];
  hints?: string[];
}

export interface ValidationFeedback {
  type: 'success' | 'warning' | 'error';
  message: string;
  hint?: string;
  explanation?: string;
  naturalness?: string;
}

export interface WordBreakdown {
  word: string;
  role: string;
  meaning: string;
}

export interface ValidationResult {
  valid: boolean;
  correct: boolean;
  feedback: ValidationFeedback;
  translation: string;
  breakdown: WordBreakdown[];
}
