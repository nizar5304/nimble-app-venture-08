
import React, { useEffect, useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import TransactionItem from '@/components/transactions/TransactionItem';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  timestamp: string;
  type: 'sale' | 'expense';
  profitAmount?: number | null;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get today's date (start and end)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .gte('transaction_date', today.toISOString())
          .lt('transaction_date', tomorrow.toISOString())
          .order('transaction_date', { ascending: false });
          
        if (error) throw error;
        
        const formattedTransactions: Transaction[] = data.map(item => ({
          id: item.id,
          name: item.name,
          amount: item.amount,
          timestamp: item.transaction_date,
          type: item.type as 'sale' | 'expense',
          profitAmount: item.profit_amount,
        }));
        
        setTransactions(formattedTransactions);
      } catch (error: any) {
        toast({
          title: "Error loading transactions",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchTransactions();
  }, [user]);

  const handleEdit = (id: string) => {
    toast({
      title: "Edit Transaction",
      description: `This feature is coming soon. Transaction ID: ${id}`,
    });
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        const { error } = await supabase
          .from('transactions')
          .delete()
          .eq('id', deleteId);
          
        if (error) throw error;
        
        setTransactions(transactions.filter(t => t.id !== deleteId));
        toast({
          title: "Transaction Deleted",
          description: "The transaction has been deleted successfully.",
        });
      } catch (error: any) {
        toast({
          title: "Error deleting transaction",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setDeleteId(null);
      }
    }
  };

  return (
    <MobileLayout title="Today's Transactions" showBackButton>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Today's Transactions</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Filter",
                  description: "This feature is coming soon.",
                });
              }}
            >
              Filter
            </Button>
            <Button 
              size="sm"
              className="bg-[#c2446e] hover:bg-[#a03759]"
              onClick={() => navigate('/add')}
            >
              Add
            </Button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-pulse">Loading transactions...</div>
            </div>
          ) : (
            <>
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
                  <p className="text-gray-500 dark:text-gray-400">No transactions found today</p>
                  <Button 
                    className="mt-4 bg-[#c2446e] hover:bg-[#a03759]"
                    onClick={() => navigate('/add')}
                  >
                    Add Transaction
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
