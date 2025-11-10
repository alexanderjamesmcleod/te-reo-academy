// Shared package entry point

// Types (explicit exports to avoid Challenge name conflict)
export type {
  // User types
  User,
  AuthTokens,
  LoginCredentials,
  SignupData,
  // Progress types
  UserProgress,
  LessonAttempt,
  DashboardStats,
  // Game types
  MultiplayerGame,
  GameMove,
  GameResult,
  // Lesson types
  Challenge,
  Lesson,
  Module,
  // Validation types
  Card,
  ValidationFeedback,
  WordBreakdown,
  ValidationResult
} from './types';

// Validators
export * from './validators';

// Data (word library, curriculum)
export * from './data';

// Constants
export * from './constants';

// Utils
export * from './utils';
