
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AppNavigationMenu from './NavigationMenu';

interface DesktopLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DesktopLayout: React.FC<DesktopLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!loading && !user && window.location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-[#c2446e] mr-8">PhoneMetrics</h1>
          <AppNavigationMenu />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-6 py-8">
        <h2 className="text-2xl font-semibold mb-6">{title}</h2>
        {children}
      </main>
    </div>
  );
};

export default DesktopLayout;
