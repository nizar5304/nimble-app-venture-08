
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { PlusCircle, Users, LineChart, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Layout title="Dashboard">
      <div className="p-4">
        <div className="grid gap-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome, {user?.full_name || 'User'}!</CardTitle>
              <CardDescription>
                {user?.role === 'admin' ? 'You have admin privileges.' : 
                 user?.role === 'owner' ? 'Manage your business with PhoneMetrics.' : 
                 'Track your transactions with PhoneMetrics.'}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Admin Actions */}
          {user?.role === 'admin' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-purple-600" />
                  Admin Actions
                </CardTitle>
                <CardDescription>
                  Manage users and system settings
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Button
                  onClick={() => navigate('/admin')}
                  className="bg-purple-600 hover:bg-purple-700 text-white justify-start h-10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  User Management
                </Button>
                <Button
                  onClick={() => navigate('/reports')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white justify-start h-10"
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  System Reports
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Owner Actions */}
          {user?.role === 'owner' && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Manage your business operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
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
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>
                    View business performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-2">
                  <Button
                    onClick={() => navigate('/transactions')}
                    className="bg-green-600 hover:bg-green-700 text-white justify-start h-10"
                  >
                    <LineChart className="mr-2 h-4 w-4" />
                    View Transactions
                  </Button>
                  <Button
                    onClick={() => navigate('/reports')}
                    className="bg-amber-600 hover:bg-amber-700 text-white justify-start h-10"
                  >
                    <LineChart className="mr-2 h-4 w-4" />
                    Financial Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Staff Actions - Limited to adding transactions only */}
          {user?.role === 'staff' && (
            <Card>
              <CardHeader>
                <CardTitle>Staff Actions</CardTitle>
                <CardDescription>
                  As a staff member, you can record transactions and view reports
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button
                  onClick={() => navigate('/add')}
                  className="bg-[#c2446e] hover:bg-[#a03759] text-white"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
                <Button
                  onClick={() => navigate('/transactions')}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  <LineChart className="mr-2 h-4 w-4" />
                  View Transactions
                </Button>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  Note: Some features are restricted based on your access level.
                </p>
              </CardFooter>
            </Card>
          )}

          {/* Default - For new users or if role not recognized */}
          {(!user?.role || !['admin', 'owner', 'staff'].includes(user.role)) && (
            <Card>
              <CardHeader>
                <CardTitle>Welcome!</CardTitle>
                <CardDescription>
                  Get started by adding your first transaction
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 mb-4">
                  Track your phone sales, repairs, and accessories with PhoneMetrics.
                </p>
                <Button
                  onClick={() => navigate('/add')}
                  className="bg-[#c2446e] hover:bg-[#a03759] text-white w-full sm:w-auto"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
