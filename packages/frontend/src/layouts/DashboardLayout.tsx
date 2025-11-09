import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * DashboardLayout - Shared layout for authenticated pages
 *
 * Provides consistent navigation, header, and structure across
 * all protected routes (Dashboard, ModuleView, LessonView).
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Primary Nav */}
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Te Reo Academy
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath('/dashboard')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/game-demo"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActivePath('/game-demo')
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  Game Demo
                </Link>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-600">
        <p>Te Reo Academy &copy; 2025 - Learn te reo Māori through play</p>
      </footer>
    </div>
  );
}
