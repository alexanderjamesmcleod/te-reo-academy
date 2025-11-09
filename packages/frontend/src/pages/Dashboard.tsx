import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useModules } from '@/hooks/useModules';
import { useProgress } from '@/hooks/useProgress';

/**
 * Dashboard - Main user dashboard
 *
 * Displays learning modules and user progress overview.
 * Fetches real-time data from Supabase.
 */
export function Dashboard() {
  const { user } = useAuth();
  const { data: modules, isLoading, error } = useModules();
  const { data: allProgress } = useProgress();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kia ora! Welcome back
          </h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-2">
              ✅ Phase 6 Active: Data Fetching with React Query
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Live data from Supabase</li>
              <li>• Real-time progress tracking</li>
              <li>• Optimized caching with React Query</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              Your Account
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm text-blue-800">
                <span className="font-medium">User ID:</span>{' '}
                <span className="font-mono text-xs">{user?.id}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Learning Modules */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Learning Path
          </h2>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-4 text-gray-600">Loading modules...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-800 font-semibold mb-2">
                Failed to load modules
              </p>
              <p className="text-red-600 text-sm">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </div>
          )}

          {/* Modules Grid */}
          {modules && modules.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {modules.map((module) => {
                // Calculate progress for this module
                const moduleProgress = allProgress?.filter(
                  (p) => p.module_id === module.id
                ) || [];
                const completedLessons = moduleProgress.filter(
                  (p) => p.status === 'completed'
                ).length;
                // Note: We'll get actual lesson count from useLessons in ModuleView
                const progressPercent = 0; // Will be calculated when we have lesson count

                return (
                  <Link
                    key={module.id}
                    to={`/modules/${module.id}`}
                    className="group border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full text-lg font-bold">
                            {module.order_index}
                          </span>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {module.title}
                          </h3>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {module.description || 'Explore this module'}
                        </p>
                      </div>
                      <svg
                        className="w-6 h-6 text-indigo-600 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>

                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>📚</span>
                        <span>Module {module.order_index}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>🎯</span>
                        <span>Beginner</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      {completedLessons > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {completedLessons} lessons completed
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Empty State */}
          {modules && modules.length === 0 && !isLoading && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No modules available yet</p>
              <p className="text-sm">Check back soon for new content!</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid gap-4 md:grid-cols-3">
            <Link
              to="/game-demo"
              className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <span className="text-4xl mb-3">🎮</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Game Demo
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Try the interactive card game
              </p>
            </Link>

            <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg opacity-50">
              <span className="text-4xl mb-3">📊</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Progress
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Coming in Phase 6
              </p>
            </div>

            <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg opacity-50">
              <span className="text-4xl mb-3">🏆</span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Challenges
              </h3>
              <p className="text-sm text-gray-600 text-center">
                Coming in Phase 7
              </p>
            </div>
          </div>
        </div>

        {/* Development Status */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Development Status
          </h2>

          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Phase 1: Setup
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Phase 2: Supabase
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Phase 3: Auth
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Phase 4: Game Components
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              ✓ Phase 5: Routing & Layout
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              → Phase 6: Data Fetching (In Progress)
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
