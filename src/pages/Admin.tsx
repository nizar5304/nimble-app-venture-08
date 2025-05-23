
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { AlertCircle, Check, Shield, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define user type for the admin panel
type AdminUser = {
  id: string;
  email: string;
  role: 'admin' | 'owner' | 'staff';
  created_at: string;
  full_name: string | null;
};

const Admin = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'admin' | 'owner'>('owner');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        navigate('/auth');
        return;
      }

      try {
        // Check if the user has admin role directly
        if (user.role === 'admin') {
          setIsAdmin(true);
          fetchUsers();
        } else {
          toast({
            title: "Access Denied",
            description: "You don't have admin privileges.",
            variant: "destructive",
          });
          navigate('/');
        }
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

    checkAdmin();
  }, [user, navigate, toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all users from our custom users table
      const { data, error } = await supabase.functions.invoke('admin', {
        body: {
          action: 'get_users'
        }
      });
      
      if (error) throw error;
      
      if (data && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch users");
      toast({
        title: "Error fetching users",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create user using our custom auth function
      const { data, error } = await supabase.functions.invoke('admin', {
        body: {
          action: 'create_user',
          email,
          password,
          fullName,
          role
        }
      });

      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to create user');
      }

      toast({
        title: "User Created",
        description: `User ${email} has been created successfully.`,
      });
      
      setAddUserOpen(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      setError(error.message || "Failed to create user");
      toast({
        title: "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setFullName('');
    setRole('owner');
  };

  if (loading) {
    return (
      <Layout title="Admin Panel" showBackButton>
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout title="Access Denied" showBackButton>
        <div className="p-4 text-center">
          <p className="text-red-500">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Panel" showBackButton>
      <div className="p-4">
        <div className="grid gap-6">
          {/* Admin Dashboard Summary */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Owners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'owner').length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Staff
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {users.filter(u => u.role === 'staff').length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <Button 
              onClick={() => setAddUserOpen(true)}
              className="bg-[#c2446e] hover:bg-[#a03759]"
            >
              Add New User
            </Button>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="owners">Owners</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="bg-white rounded-md shadow">
              <UserTable users={users} onRefresh={fetchUsers} />
            </TabsContent>
            
            <TabsContent value="admins" className="bg-white rounded-md shadow">
              <UserTable users={users.filter(user => user.role === 'admin')} onRefresh={fetchUsers} />
            </TabsContent>
            
            <TabsContent value="owners" className="bg-white rounded-md shadow">
              <UserTable users={users.filter(user => user.role === 'owner')} onRefresh={fetchUsers} />
            </TabsContent>
            
            <TabsContent value="staff" className="bg-white rounded-md shadow">
              <UserTable users={users.filter(user => user.role === 'staff')} onRefresh={fetchUsers} />
            </TabsContent>
          </Tabs>

          {/* Add User Dialog */}
          <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  Add a new user to the system with the specified role.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">Role</label>
                  <select
                    id="role"
                    className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'admin' | 'owner')}
                  >
                    <option value="owner">Owner</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddUserOpen(false);
                      resetForm();
                    }}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#c2446e] hover:bg-[#a03759]"
                    disabled={submitting}
                  >
                    {submitting ? 'Creating...' : 'Create User'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

const UserTable = ({ 
  users, 
  onRefresh 
}: { 
  users: AdminUser[];
  onRefresh: () => void;
}) => {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<'admin' | 'owner' | 'staff'>('owner');
  const [openChangeRole, setOpenChangeRole] = useState(false);
  const { toast } = useToast();
  
  const handleRoleChange = async () => {
    if (!updatingUserId) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('admin', {
        body: {
          action: 'update_user_role',
          userId: updatingUserId,
          role: newRole
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to update user role');
      }
      
      toast({
        title: "Role Updated",
        description: `User role has been updated to ${newRole}.`,
      });
      
      setOpenChangeRole(false);
      setUpdatingUserId(null);
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Error updating role",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const openRoleDialog = (user: AdminUser) => {
    setUpdatingUserId(user.id);
    setNewRole(user.role);
    setOpenChangeRole(true);
  };

  if (users.length === 0) {
    return <div className="p-8 text-center text-gray-500">No users found</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-800'
                      : user.role === 'owner'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {user.role}
                </span>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => openRoleDialog(user)}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Change Role
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* Change Role Dialog */}
      <Dialog open={openChangeRole} onOpenChange={setOpenChangeRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the user's role in the system.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newRole" className="text-sm font-medium">New Role</label>
              <select
                id="newRole"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as 'admin' | 'owner' | 'staff')}
              >
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenChangeRole(false)}>Cancel</Button>
              <Button onClick={handleRoleChange} className="bg-[#c2446e] hover:bg-[#a03759]">
                Update Role
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
