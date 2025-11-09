import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-600 mb-4">
            Te Reo Academy
          </h1>
          <p className="text-xl text-gray-700 mb-2">
            Interactive Māori language learning platform
          </p>
          <p className="text-gray-600">
            Learn te reo Māori through engaging card-based games
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🎮</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Game-Based Learning
            </h3>
            <p className="text-gray-600 text-sm">
              Build sentences with drag-and-drop cards. Learn grammar through play!
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600 text-sm">
              Monitor your learning journey with detailed analytics and achievements.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🗣️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Tri-lingual Vision
            </h3>
            <p className="text-gray-600 text-sm">
              Te reo Māori, English, and NZSL support (coming in Phase 4).
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-3">🤖</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI-Powered Tutoring
            </h3>
            <p className="text-gray-600 text-sm">
              Personalized hints and adaptive learning (coming with PydanticAI).
            </p>
          </div>
        </div>

        <div className="text-center">
          {user ? (
            <Link
              to="/dashboard"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="inline-block bg-white hover:bg-gray-50 text-indigo-600 font-semibold py-3 px-8 rounded-lg border-2 border-indigo-600 transition-colors duration-200"
              >
                Login
              </Link>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap gap-2 text-xs justify-center">
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              ✓ Phase 1: Setup Complete
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              ✓ Phase 2: Supabase Connected
            </span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
              ✓ Phase 3: Authentication Working
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
