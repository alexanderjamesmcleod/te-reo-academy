import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

/**
 * Data for creating a lesson attempt
 */
interface LessonAttemptData {
  lessonId: string;
  challengeId: string;
  userAnswer: Array<{ word: string; type: string }>;
  isCorrect: boolean;
  timeTakenMs?: number;
}

/**
 * Data for updating user progress
 */
interface ProgressUpdateData {
  moduleId: string;
  lessonId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
}

/**
 * Custom hook to save lesson attempt and update progress
 *
 * Saves attempt to lesson_attempts table and updates/inserts user_progress
 * Invalidates progress cache on success
 * Shows toast notifications for user feedback
 *
 * @example
 * ```tsx
 * function GameBoard() {
 *   const saveProgress = useSaveProgress();
 *
 *   const handleSubmit = () => {
 *     saveProgress.mutate({
 *       attempt: {
 *         lessonId: 'lesson-uuid',
 *         challengeId: 'challenge-uuid',
 *         userAnswer: selectedCards,
 *         isCorrect: validationResult.isCorrect,
 *         timeTakenMs: 5000,
 *       },
 *       progress: {
 *         moduleId: 'module-uuid',
 *         lessonId: 'lesson-uuid',
 *         status: 'completed',
 *         score: 100,
 *       },
 *     });
 *   };
 * }
 * ```
 */
export function useSaveProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attempt,
      progress,
    }: {
      attempt: LessonAttemptData;
      progress: ProgressUpdateData;
    }) => {
      if (!user) {
        throw new Error('User must be authenticated to save progress');
      }

      // Save lesson attempt
      const { error: attemptError } = await supabase
        .from('lesson_attempts')
        .insert({
          user_id: user.id,
          lesson_id: attempt.lessonId,
          challenge_id: attempt.challengeId,
          user_answer: attempt.userAnswer,
          is_correct: attempt.isCorrect,
          time_taken_ms: attempt.timeTakenMs || null,
        });

      if (attemptError) {
        throw new Error(`Failed to save attempt: ${attemptError.message}`);
      }

      // Update or insert user progress (upsert)
      const { error: progressError } = await supabase
        .from('user_progress')
        .upsert(
          {
            user_id: user.id,
            module_id: progress.moduleId,
            lesson_id: progress.lessonId,
            status: progress.status,
            score: progress.score || 0,
            attempts: 1, // This will be incremented on conflict
            last_attempted_at: new Date().toISOString(),
            completed_at:
              progress.status === 'completed'
                ? new Date().toISOString()
                : null,
          },
          {
            onConflict: 'user_id,lesson_id',
          }
        );

      if (progressError) {
        throw new Error(`Failed to update progress: ${progressError.message}`);
      }

      return { attempt, progress };
    },
    onSuccess: (data) => {
      // Invalidate progress queries to refetch fresh data
      queryClient.invalidateQueries({
        queryKey: ['progress', user?.id],
      });

      // Show success toast
      if (data.progress.status === 'completed') {
        toast.success('Kei te tika! Lesson completed!');
      } else {
        toast.success('Progress saved!');
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(
        error instanceof Error ? error.message : 'Failed to save progress'
      );
      console.error('Save progress error:', error);
    },
  });
}

/**
 * Custom hook to save a quick progress update (without attempt details)
 *
 * Convenience hook for updating progress status without saving full attempt
 * Useful for marking lessons as started or in progress
 *
 * @example
 * ```tsx
 * function LessonView() {
 *   const updateProgress = useUpdateProgress();
 *
 *   useEffect(() => {
 *     // Mark lesson as in progress when viewed
 *     updateProgress.mutate({
 *       moduleId: 'module-uuid',
 *       lessonId: 'lesson-uuid',
 *       status: 'in_progress',
 *     });
 *   }, []);
 * }
 * ```
 */
export function useUpdateProgress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (progress: ProgressUpdateData) => {
      if (!user) {
        throw new Error('User must be authenticated to update progress');
      }

      const { error } = await supabase.from('user_progress').upsert(
        {
          user_id: user.id,
          module_id: progress.moduleId,
          lesson_id: progress.lessonId,
          status: progress.status,
          score: progress.score || 0,
          last_attempted_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,lesson_id',
        }
      );

      if (error) {
        throw new Error(`Failed to update progress: ${error.message}`);
      }

      return progress;
    },
    onSuccess: () => {
      // Invalidate progress queries
      queryClient.invalidateQueries({
        queryKey: ['progress', user?.id],
      });
    },
    onError: (error) => {
      console.error('Update progress error:', error);
    },
  });
}
