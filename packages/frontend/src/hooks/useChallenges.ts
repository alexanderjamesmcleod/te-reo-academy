import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Challenge data from database (aligned with Supabase schema)
 */
export interface ChallengeData {
  id: string;
  lesson_id: string;
  order_index: number;
  pattern_type: 'ko' | 'he' | 'equative' | 'kei_te';
  target_maori: string;
  target_english: string;
  target_nzsl_video_url: string | null;
  target_nzsl_description: string | null;
  hint: string | null;
  created_at: string;
}

/**
 * Custom hook to fetch challenges for a specific lesson
 *
 * Fetches challenges filtered by lesson_id, ordered by order_index
 * Challenges are publicly accessible (no auth required)
 *
 * @param lessonId - The UUID of the lesson to fetch challenges for
 *
 * @example
 * ```tsx
 * function LessonView() {
 *   const { lessonId } = useParams();
 *   const { data: challenges, isLoading, error } = useChallenges(lessonId!);
 *
 *   if (isLoading) return <div>Loading challenges...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {challenges?.map(challenge => (
 *         <ChallengeCard key={challenge.id} challenge={challenge} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChallenges(lessonId: string) {
  return useQuery({
    queryKey: ['challenges', lessonId],
    queryFn: async (): Promise<ChallengeData[]> => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch challenges: ${error.message}`);
      }

      return data || [];
    },
    enabled: !!lessonId, // Only run query if lessonId is provided
  });
}
