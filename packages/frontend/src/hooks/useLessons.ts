import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Lesson data from database (aligned with Supabase schema)
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
 * Custom hook to fetch lessons for a specific module
 *
 * Fetches lessons filtered by module_id, ordered by order_index
 * Lessons are publicly accessible (no auth required)
 *
 * @param moduleId - The UUID of the module to fetch lessons for
 *
 * @example
 * ```tsx
 * function ModuleView() {
 *   const { moduleId } = useParams();
 *   const { data: lessons, isLoading, error } = useLessons(moduleId!);
 *
 *   if (isLoading) return <div>Loading lessons...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {lessons?.map(lesson => (
 *         <LessonCard key={lesson.id} lesson={lesson} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLessons(moduleId: string) {
  return useQuery({
    queryKey: ['lessons', moduleId],
    queryFn: async (): Promise<LessonData[]> => {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          id,
          module_id,
          title,
          description,
          order_index,
          lesson_type,
          created_at,
          updated_at
        `)
        .eq('module_id', moduleId)
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch lessons: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!moduleId, // Only run query if moduleId is provided
  });
}
