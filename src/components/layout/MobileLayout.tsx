
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import BottomNav from './BottomNav';
import { useAuth } from '@/contexts/AuthContext';

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

const MobileLayout = ({ children, title, showBackButton }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!loading && !user && window.location.pathname !== '/auth') {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm px-4 py-3 flex items-center">
        {showBackButton ? (
          <button 
            onClick={() => navigate(-1)}
            className="p-1 mr-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Go back"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        ) : null}
        
        <MobileSidebar title={title} />
      </header>

      {/* Content */}
      <main className="flex-1 pb-16">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default MobileLayout;
