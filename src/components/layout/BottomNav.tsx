
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Receipt, Calendar, FileText, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      icon: Home,
      label: 'Home',
      path: '/',
    },
    {
      icon: Receipt,
      label: 'Transactions',
      path: '/transactions',
    },
    {
      icon: Calendar,
      label: 'Expenses',
      path: '/expenses',
    },
    {
      icon: PlusCircle,
      label: 'Add',
      path: '/add',
    },
    {
      icon: FileText,
      label: 'Reports',
      path: '/reports',
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-full h-full"
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive 
                    ? "text-[#c2446e]" 
                    : "text-gray-500 dark:text-gray-400"
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1",
                  isActive 
                    ? "text-[#c2446e] font-medium" 
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
