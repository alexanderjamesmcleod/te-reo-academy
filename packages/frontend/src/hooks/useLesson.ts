import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Lesson data from database (single lesson)
 */
interface LessonData {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  order_index: number;
  lesson_type: 'tutorial' | 'practice' | 'challenge' | 'test';
  created_at: string;
  updated_at: string;
}

/**
 * Custom hook to fetch a single lesson by ID
 *
 * @param lessonId - The UUID of the lesson to fetch
 *
 * @example
 * ```tsx
 * function LessonView() {
 *   const { lessonId } = useParams();
 *   const { data: lesson, isLoading, error } = useLesson(lessonId!);
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return <div>{lesson?.title}</div>;
 * }
 * ```
 */
export function useLesson(lessonId: string) {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async (): Promise<LessonData | null> => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single();

      if (error) {
        // Return null if not found instead of throwing
        if (error.code === 'PGRST116') {
          return null;
        }
        throw new Error(`Failed to fetch lesson: ${error.message}`);
      }

      return data;
    },
    enabled: !!lessonId, // Only run query if lessonId is provided
  });
}
