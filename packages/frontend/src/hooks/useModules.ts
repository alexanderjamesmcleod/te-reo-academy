import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

/**
 * Module data from database (without nested lessons)
 */
interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

/**
 * Custom hook to fetch all learning modules from Supabase
 *
 * Returns modules ordered by order_index (ascending)
 * Modules are publicly accessible (no auth required)
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { data: modules, isLoading, error } = useModules();
 *
 *   if (isLoading) return <div>Loading modules...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {modules?.map(module => (
 *         <ModuleCard key={module.id} module={module} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useModules() {
  return useQuery({
    queryKey: ['modules'],
    queryFn: async (): Promise<ModuleData[]> => {
      const { data, error } = await supabase
        .from('modules')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch modules: ${error.message}`);
      }

      return data || [];
    },
  });
}
