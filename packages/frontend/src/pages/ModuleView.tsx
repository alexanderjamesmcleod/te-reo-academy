import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useModules } from '@/hooks/useModules';
import { useLessons } from '@/hooks/useLessons';
import { useProgress } from '@/hooks/useProgress';

/**
 * ModuleView - Display a specific module and its lessons
 *
 * Shows module information and a list of lessons that can be accessed.
 * Fetches real-time data from Supabase with progress tracking.
 */
export function ModuleView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();

  // Fetch module data
  const { data: modules, isLoading: modulesLoading } = useModules();
  const module = modules?.find((m) => m.id === moduleId);

  // Fetch lessons for this module
  const {
    data: lessons,
    isLoading: lessonsLoading,
    error: lessonsError,
  } = useLessons(moduleId || '');

  // Fetch user progress for this module
  const { data: progress } = useProgress({ moduleId });

  const isLoading = modulesLoading || lessonsLoading;

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-4 text-gray-600">Loading module...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Module not found
  if (!module) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Module not found
            </h2>
            <p className="text-gray-600 mb-6">
              The module you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error loading lessons
  if (lessonsError) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800 font-semibold mb-2">
              Failed to load lessons
            </p>
            <p className="text-red-600 text-sm">
              {lessonsError instanceof Error
                ? lessonsError.message
                : 'Unknown error'}
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Module Header */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-4 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {module.title}
              </h1>
              <p className="text-lg text-gray-600">
                {module.description}
              </p>
            </div>
            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
              Module {module.order_index}
            </span>
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">📚</span>
              <span>{lessons?.length || 0} lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">🎯</span>
              <span>Beginner friendly</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold">✅</span>
              <span>
                {progress?.filter((p) => p.status === 'completed').length || 0}{' '}
                completed
              </span>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>

          {lessons && lessons.length > 0 ? (
            <div className="space-y-4">
              {lessons.map((lesson) => {
                // Find progress for this lesson
                const lessonProgress = progress?.find(
                  (p) => p.lesson_id === lesson.id
                );
                const isCompleted = lessonProgress?.status === 'completed';
                const inProgress = lessonProgress?.status === 'in_progress';

                return (
                  <Link
                    key={lesson.id}
                    to={`/lessons/${lesson.id}`}
                    className={`block border rounded-lg p-6 hover:shadow-md transition-all ${
                      isCompleted
                        ? 'border-green-300 bg-green-50'
                        : inProgress
                        ? 'border-yellow-300 bg-yellow-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              isCompleted
                                ? 'bg-green-200 text-green-800'
                                : inProgress
                                ? 'bg-yellow-200 text-yellow-800'
                                : 'bg-indigo-100 text-indigo-700'
                            }`}
                          >
                            {isCompleted ? '✓' : lesson.order_index}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {lesson.title}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              lesson.lesson_type === 'tutorial'
                                ? 'bg-blue-100 text-blue-700'
                                : lesson.lesson_type === 'practice'
                                ? 'bg-green-100 text-green-700'
                                : lesson.lesson_type === 'challenge'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-purple-100 text-purple-700'
                            }`}
                          >
                            {lesson.lesson_type}
                          </span>
                          {isCompleted && (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                              Completed
                            </span>
                          )}
                          {inProgress && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                              In Progress
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 mb-3">
                          {lesson.description || 'Start this lesson'}
                        </p>

                        {lessonProgress && (
                          <div className="text-sm text-gray-600 mb-2">
                            Score: {lessonProgress.score || 0} | Attempts:{' '}
                            {lessonProgress.attempts || 0}
                          </div>
                        )}
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-indigo-600"
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
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">No lessons available yet</p>
              <p className="text-sm">Check back soon for new content!</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
