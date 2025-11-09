import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-indigo-600">
              Te Reo Academy
            </h1>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Kia ora! Welcome to your dashboard
          </h2>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-sm font-semibold text-green-800 mb-2">
              ✅ Phase 3 Complete: Authentication
            </p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• User authentication working</li>
              <li>• Protected routes active</li>
              <li>• Session persistence enabled</li>
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

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/game-demo')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold mb-6"
            >
              🎮 Try Game Components Demo
            </button>

            <p className="text-gray-600 mb-4">
              Learning modules coming in Phase 5 & 6!
            </p>
            <div className="inline-flex space-x-2 text-sm">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                ✓ Phase 1: Setup
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                ✓ Phase 2: Supabase
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                ✓ Phase 3: Auth
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                🚧 Phase 4: Game Components (In Progress)
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
