
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import FixedExpenseItem from '@/components/expenses/FixedExpenseItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for fixed expenses
const initialExpenses = [
  { 
    id: '1', 
    name: 'Salary', 
    amount: 1000, 
    frequency: 'Daily',
  },
  { 
    id: '2', 
    name: 'Rent', 
    amount: 833, 
    frequency: 'Daily',
  },
];

const Expenses = () => {
  const [expenses, setExpenses] = React.useState(initialExpenses);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    // In a real app, this would open an edit dialog or navigate to an edit page
    toast({
      title: "Edit Fixed Expense",
      description: `Editing expense with ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setExpenses(expenses.filter(e => e.id !== deleteId));
      toast({
        title: "Fixed Expense Deleted",
        description: "The fixed expense has been deleted successfully.",
      });
      setDeleteId(null);
    }
  };

  return (
    <MobileLayout title="Daily Fixed Expenses" showBackButton>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Daily Fixed Expenses</h2>
          <Button className="bg-[#c2446e] hover:bg-[#a03759] text-white">
            Add Fixed Expense
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
            </div>
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
    </MobileLayout>
  );
};

export default Expenses;
