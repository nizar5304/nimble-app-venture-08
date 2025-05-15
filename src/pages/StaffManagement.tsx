
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
import { Trash2 } from 'lucide-react';

interface Staff {
  id: string;
  staff_name: string;
  user_id: string;
  created_at: string;
  email?: string;
}

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffName, setStaffName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchStaffMembers();
    }
  }, [user]);

  const fetchStaffMembers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('owner_id', user.id);
        
      if (error) throw error;

      // Get emails for staff members
      const staffWithEmails = await Promise.all(
        data.map(async (staff) => {
          // Get user email
          const { data: userData } = await supabase.auth.admin.getUserById(staff.user_id);
          return {
            ...staff,
            email: userData?.user?.email || 'N/A',
          };
        })
      );
      
      setStaffMembers(staffWithEmails);
    } catch (error: any) {
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
    
    try {
      // 1. Create user in Auth
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: staffName }
      });
      
      if (userError) throw userError;
      
      if (!userData.user) {
        throw new Error("Failed to create user");
      }
      
      // 2. Update profile with staff role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role: 'staff' })
        .eq('id', userData.user.id);
        
      if (profileError) throw profileError;
      
      // 3. Create staff record
      const { error: staffError } = await supabase
        .from('staff')
        .insert({
          owner_id: user?.id,
          user_id: userData.user.id,
          staff_name: staffName,
        });
        
      if (staffError) throw staffError;
      
      toast({
        title: "Staff Added",
        description: `${staffName} has been added successfully.`,
      });
      
      setAddStaffOpen(false);
      resetForm();
      fetchStaffMembers();
    } catch (error: any) {
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
    
    try {
      setSubmitting(true);
      
      // Find the staff member to get user_id
      const staffMember = staffMembers.find(staff => staff.id === deleteId);
      if (!staffMember) {
        throw new Error("Staff member not found");
      }
      
      // Delete staff record first (because of foreign key constraint)
      const { error: staffError } = await supabase
        .from('staff')
        .delete()
        .eq('id', deleteId);
        
      if (staffError) throw staffError;
      
      // Delete the user from auth
      const { error: userError } = await supabase.auth.admin.deleteUser(
        staffMember.user_id
      );
      
      if (userError) throw userError;
      
      toast({
        title: "Staff Deleted",
        description: "Staff member has been deleted successfully.",
      });
      
      setDeleteId(null);
      fetchStaffMembers();
    } catch (error: any) {
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

  return (
    <Layout title="Staff Management" showBackButton>
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Your Staff</h2>
          <Button 
            onClick={() => setAddStaffOpen(true)}
            className="bg-[#c2446e] hover:bg-[#a03759]"
          >
            Add New Staff
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading staff members...</div>
            </div>
          ) : staffMembers.length === 0 ? (
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
    </Layout>
  );
};

export default StaffManagement;
