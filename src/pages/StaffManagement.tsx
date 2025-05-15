
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
import { Input } from '@/components/ui/input';
import { AlertCircle, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StaffMember {
  id: string;
  user_id: string;
  staff_name: string;
  email: string;
  created_at: string;
}

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is owner
    if (user && user.role !== 'owner') {
      toast({
        title: "Access Denied",
        description: "Only owners can manage staff members.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    if (user) {
      fetchStaffMembers();
    }
  }, [user, navigate, toast]);

  const fetchStaffMembers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the edge function to get staff members
      const { data, error } = await supabase.functions.invoke('get_owner_staff', {
        body: { owner_id: user.id }
      });
        
      if (error) throw error;
        
      // Get emails for staff members
      if (Array.isArray(data)) {
        setStaffMembers(data);
      } else {
        setStaffMembers([]);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch staff members");
      toast({
        title: "Error fetching staff",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    
    try {
      if (!user) throw new Error("You must be logged in");
      
      // Create staff member
      const { data, error } = await supabase.functions.invoke('staff_management', {
        body: {
          action: 'create_staff',
          owner_id: user.id,
          email,
          password,
          staff_name: staffName
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Failed to create staff member");
      }
      
      toast({
        title: "Staff Added",
        description: `${staffName} has been added successfully.`,
      });
      
      setAddStaffOpen(false);
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
      setError(error.message || "Failed to add staff");
      toast({
        title: "Error adding staff",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!deleteId) return;
    setSubmitting(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('staff_management', {
        body: {
          action: 'delete_staff',
          staff_id: deleteId
        }
      });
      
      if (error) throw error;
      
      if (!data.success) {
        throw new Error(data.error || "Failed to delete staff member");
      }
      
      toast({
        title: "Staff Deleted",
        description: "Staff member has been deleted successfully.",
      });
      
      setDeleteId(null);
      fetchStaffMembers();
    } catch (error: any) {
      setError(error.message || "Failed to delete staff");
      toast({
        title: "Error deleting staff",
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
    setStaffName('');
  };

  if (loading) {
    return (
      <Layout title="Staff Management" showBackButton>
        <div className="flex items-center justify-center h-64">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Staff Management" showBackButton>
      <div className="p-4">
        <div className="grid gap-6">
          {/* Staff Management Header */}
          <Card>
            <CardHeader>
              <CardTitle>Staff Management</CardTitle>
              <CardDescription>
                Add and manage staff members for your business. Staff members can add transactions but have limited access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setAddStaffOpen(true)}
                className="bg-[#c2446e] hover:bg-[#a03759]"
              >
                Add New Staff
              </Button>
            </CardContent>
          </Card>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {staffMembers.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't added any staff members yet.</p>
                <Button 
                  className="bg-[#c2446e] hover:bg-[#a03759]"
                  onClick={() => setAddStaffOpen(true)}
                >
                  Add Your First Staff Member
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Added On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffMembers.map((staff) => (
                      <TableRow key={staff.id}>
                        <TableCell className="font-medium">{staff.staff_name}</TableCell>
                        <TableCell>{staff.email}</TableCell>
                        <TableCell>{new Date(staff.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(staff.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>

          {/* Add Staff Dialog */}
          <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
                <DialogDescription>
                  Create login credentials for your staff member.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleCreateStaff} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="staffName" className="text-sm font-medium">Staff Name</label>
                  <Input
                    id="staffName"
                    type="text"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    required
                  />
                </div>
                
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
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setAddStaffOpen(false);
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
                    {submitting ? 'Adding...' : 'Add Staff'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Staff Member</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to delete this staff member? This will permanently remove their account.</p>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteStaff}
                  disabled={submitting}
                >
                  {submitting ? 'Deleting...' : 'Delete'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Layout>
  );
};

export default StaffManagement;
