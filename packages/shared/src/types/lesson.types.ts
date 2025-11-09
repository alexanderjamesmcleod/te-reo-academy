// Lesson and curriculum types
export interface Challenge {
  id: string;
  instruction: string;
  pattern: string[];
  requiredWords?: string[];
  hints?: string[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  number: number;
  name: string;
  nameEnglish: string;
  description: string;
  objectives: string[];
  grammar: {
    structure: string;
    pattern: string[];
    colors: string[];
    explanation: {
      simple: string;
      detailed: string;
      examples: any[];
    };
  };
  newWords: string[];
  challenges: Challenge[];
  mastery: {
    required: number;
    unlocks?: string;
  };
}

export interface Module {
  id: string;
  number: number;
  name: string;
  nameEnglish: string;
  description: string;
  unlocked: boolean;
  prerequisite?: string;
  lessons: Lesson[];
}
