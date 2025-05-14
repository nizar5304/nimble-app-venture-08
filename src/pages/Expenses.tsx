
import React, { useEffect, useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import FixedExpenseItem from '@/components/expenses/FixedExpenseItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  frequency: string;
}

const Expenses = () => {
  const [expenses, setExpenses] = useState<FixedExpense[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    frequency: 'Daily',
  });
  const { toast } = useToast();
  const { user } = useAuth();

  // Load expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('fixed_expenses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setExpenses(data || []);
      } catch (error: any) {
        toast({
          title: "Error loading expenses",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, [user]);

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Fixed Expense",
      description: `This feature is coming soon. Expense ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const { error } = await supabase
          .from('fixed_expenses')
          .delete()
          .eq('id', deleteId);
          
        if (error) throw error;
        
        setExpenses(expenses.filter(e => e.id !== deleteId));
        toast({
          title: "Fixed Expense Deleted",
          description: "The fixed expense has been deleted successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error deleting expense",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setDeleteId(null);
      }
    }
  };
  
  const handleAddExpense = async () => {
    try {
      // Validate inputs
      if (!newExpense.name.trim()) {
        throw new Error("Please enter an expense name");
      }
      
      if (!newExpense.amount || isNaN(Number(newExpense.amount))) {
        throw new Error("Please enter a valid amount");
      }
      
      // Insert expense
      const { error, data } = await supabase
        .from('fixed_expenses')
        .insert({
          user_id: user?.id,
          name: newExpense.name,
          amount: parseInt(newExpense.amount, 10),
          frequency: newExpense.frequency,
        })
        .select()
        .single();
        
      if (error) throw error;
      
      // Add new expense to list
      setExpenses([data, ...expenses]);
      
      // Reset form and close dialog
      setNewExpense({
        name: '',
        amount: '',
        frequency: 'Daily',
      });
      setShowAddDialog(false);
      
      toast({
        title: "Fixed Expense Added",
        description: "Your fixed expense has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <MobileLayout title="Daily Fixed Expenses" showBackButton>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daily Fixed Expenses</h2>
          <Button 
            className="bg-[#c2446e] hover:bg-[#a03759] text-white"
            onClick={() => setShowAddDialog(true)}
          >
            Add Fixed Expense
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading fixed expenses...</div>
            </div>
          ) : (
            <>
              {expenses.map((expense) => (
                <FixedExpenseItem
                  key={expense.id}
                  id={expense.id}
                  name={expense.name}
                  amount={expense.amount}
                  frequency={expense.frequency}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              
              {expenses.length === 0 && (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No fixed expenses found</p>
                  <Button 
                    className="mt-4 bg-[#c2446e] hover:bg-[#a03759]"
                    onClick={() => setShowAddDialog(true)}
                  >
                    Add Fixed Expense
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Fixed Expense</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this fixed expense? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Fixed Expense Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Fixed Expense</DialogTitle>
            <DialogDescription>
              Add a new recurring expense to track daily costs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Expense Name</label>
              <Input
                value={newExpense.name}
                onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                placeholder="Rent, Salary, etc."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount (in paise)</label>
              <Input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="Enter amount in paise (e.g., ₹100 = 10000)"
              />
              <p className="text-xs text-gray-500">Enter amount in paise (e.g., ₹100 = 10000 paise)</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <select
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                value={newExpense.frequency}
                onChange={(e) => setNewExpense({...newExpense, frequency: e.target.value})}
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-[#c2446e] hover:bg-[#a03759]"
              onClick={handleAddExpense}
            >
              Add Expense
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Expenses;
