/**
 * Custom hooks index
 * Central export point for all data fetching and mutation hooks
 */

// Query hooks
export { useModules } from './useModules';
export { useLessons } from './useLessons';
export { useChallenges } from './useChallenges';
export { useProgress, useLessonProgress } from './useProgress';

// Mutation hooks
export { useSaveProgress, useUpdateProgress } from './useSaveProgress';

// Types
export type { ChallengeData } from './useChallenges';
export type { ProgressData } from './useProgress';
