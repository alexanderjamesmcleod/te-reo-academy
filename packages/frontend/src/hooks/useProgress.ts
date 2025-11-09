import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

/**
 * User progress data from database
 */
export interface ProgressData {
  id: string;
  user_id: string;
  module_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  attempts: number;
  last_attempted_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Options for useProgress hook
 */
interface UseProgressOptions {
  lessonId?: string;
  moduleId?: string;
}

/**
 * Custom hook to fetch user progress
 *
 * Fetches progress data for the authenticated user
 * Can filter by lesson or module
 * Requires authentication
 *
 * @param options - Optional filters (lessonId or moduleId)
 *
 * @example
 * ```tsx
 * // Fetch all progress
 * const { data: allProgress } = useProgress();
 *
 * // Fetch progress for specific lesson
 * const { data: lessonProgress } = useProgress({ lessonId: 'lesson-uuid' });
 *
 * // Fetch progress for specific module
 * const { data: moduleProgress } = useProgress({ moduleId: 'module-uuid' });
 * ```
 */
export function useProgress(options: UseProgressOptions = {}) {
  const { user } = useAuth();
  const { lessonId, moduleId } = options;

  return useQuery({
    queryKey: ['progress', user?.id, lessonId, moduleId],
    queryFn: async (): Promise<ProgressData[]> => {
      if (!user) {
        throw new Error('User must be authenticated to fetch progress');
      }

      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (lessonId) {
        query = query.eq('lesson_id', lessonId);
      }

      if (moduleId) {
        query = query.eq('module_id', moduleId);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Failed to fetch progress: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!user, // Only run query if user is authenticated
  });
}

/**
 * Custom hook to fetch progress for a specific lesson
 *
 * Convenience wrapper around useProgress for single lesson queries
 *
 * @param lessonId - The UUID of the lesson
 *
 * @example
 * ```tsx
 * function LessonView() {
 *   const { lessonId } = useParams();
 *   const { data: progress } = useLessonProgress(lessonId!);
 *
 *   const isCompleted = progress?.status === 'completed';
 *   const score = progress?.score || 0;
 * }
 * ```
 */
export function useLessonProgress(lessonId: string) {
  const result = useProgress({ lessonId });

  return {
    ...result,
    data: result.data?.[0] || null, // Return single progress object or null
  };
}
