
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import TransactionItem from '@/components/transactions/TransactionItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

// Mock data for transactions
const initialTransactions = [
  { 
    id: '1', 
    name: 'iPhone 15 Pro Max', 
    amount: 119900, 
    timestamp: '2023-05-14T10:45:00', 
    type: 'sale' as const,
    profitAmount: 19900
  },
  { 
    id: '2', 
    name: '2x Samsung S24', 
    amount: 159800, 
    timestamp: '2023-05-14T09:30:00', 
    type: 'sale' as const,
    profitAmount: 19800
  },
  { 
    id: '3', 
    name: 'Store Maintenance', 
    amount: 3500, 
    timestamp: '2023-05-14T08:15:00', 
    type: 'expense' as const
  }
];

const Transactions = () => {
  const [transactions, setTransactions] = React.useState(initialTransactions);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const { toast } = useToast();

  const handleEdit = (id: string) => {
    // In a real app, this would open an edit dialog or navigate to an edit page
    toast({
      title: "Edit Transaction",
      description: `Editing transaction with ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setTransactions(transactions.filter(t => t.id !== deleteId));
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been deleted successfully.",
      });
      setDeleteId(null);
    }
  };

  return (
    <MobileLayout title="Today's Transactions" showBackButton>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today's Transactions</h2>
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              id={transaction.id}
              name={transaction.name}
              amount={transaction.amount}
              timestamp={transaction.timestamp}
              type={transaction.type}
              profitAmount={transaction.profitAmount}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
          
          {transactions.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
};

export default Transactions;
