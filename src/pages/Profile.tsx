
import React, { useEffect, useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { UserRound, Moon, Sun, LogOut } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [fullName, setFullName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Fetch user profile data
    if (user) {
      const fetchProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw error;
          
          if (data) {
            setFullName(data.full_name || '');
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      };
      
      fetchProfile();
    }
  }, [user]);
  
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
    
    toast({
      title: isDarkMode ? "Light Mode Activated" : "Dark Mode Activated",
      duration: 2000,
    });
  };
  
  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <MobileLayout title="Profile">
      <div className="p-4 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-[#c2446e] text-white flex items-center justify-center text-4xl mt-6 mb-2">
          {user?.email?.[0]?.toUpperCase() || 'A'}
        </div>
        <h2 className="text-xl font-semibold">{fullName || 'User'}</h2>
        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
        
        <div className="w-full mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-1">Account Settings</h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {isEditing ? (
                <div className="p-4">
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    className="mb-3"
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="bg-[#c2446e] hover:bg-[#a03759]"
                    >
                      {loading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 h-auto text-left"
                  onClick={() => setIsEditing(true)}
                >
                  <UserRound className="mr-3 h-5 w-5" />
                  <span>Edit Profile</span>
                </Button>
              )}
              
              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-3 h-auto text-left"
                onClick={toggleDarkMode}
              >
                <div className="flex items-center">
                  {isDarkMode ? (
                    <Moon className="mr-3 h-5 w-5" />
                  ) : (
                    <Sun className="mr-3 h-5 w-5" />
                  )}
                  <span>Dark Mode</span>
                </div>
                <div className={`relative w-10 h-5 rounded-full ${isDarkMode ? 'bg-[#c2446e]' : 'bg-gray-200'}`}>
                  <div 
                    className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transform transition-transform ${isDarkMode ? 'translate-x-5' : ''}`}
                  ></div>
                </div>
              </Button>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full mt-4 border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50 dark:hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Profile;
