
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserRole = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setUserRole(data?.role || null);
      } finally {
        setLoading(false);
      }
    };
    
    getUserRole();
  }, [user]);

  return (
    <Layout title="Dashboard">
      <div className="p-4">
        <div className="grid gap-6">
          {/* Admin Actions */}
          {userRole === 'admin' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Admin Actions</h2>
              <div className="grid gap-2">
                <Button
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 hover:bg-purple-700 text-white justify-start h-10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
              </div>
            </div>
          )}

          {/* Owner Actions */}
          {userRole === 'owner' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid gap-2">
                <Button
                  onClick={() => navigate('/add')}
                  className="bg-[#c2446e] hover:bg-[#a03759] text-white justify-start h-10"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
                
                <Button
                  onClick={() => navigate('/staff-management')}
                  className="bg-blue-600 hover:bg-blue-700 text-white justify-start h-10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage Staff
                </Button>
              </div>
            </div>
          )}

          {/* Staff Actions - Limited to adding transactions only */}
          {userRole === 'staff' && (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Staff Actions</h2>
              <p className="text-gray-500 mb-4">
                As a staff member, you can only add transactions.
              </p>
              <Button
                onClick={() => navigate('/add')}
                className="bg-[#c2446e] hover:bg-[#a03759] text-white w-full sm:w-auto"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Transaction
              </Button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow flex justify-center">
              <p className="text-gray-500">Loading...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
