
import React, { useEffect, useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const [transactionType, setTransactionType] = React.useState('sale');
  const [itemName, setItemName] = React.useState('');
  const [itemCost, setItemCost] = React.useState('');
  const [sellingPrice, setSellingPrice] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get user role when component mounts
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
        
        // Use optional chaining to safely access the role property
        setUserRole(data?.role || null);
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Couldn't fetch user role.",
          variant: "destructive",
        });
      }
    };
    
    getUserRole();
  }, [user]);
  
  // Redirect if user is staff and tries to navigate away
  useEffect(() => {
    if (userRole === 'staff') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        const message = 'You have limited access to only this page.';
        e.returnValue = message; // Standard for most browsers
        return message; // For some older browsers
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [userRole]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!itemName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }
    
    if (!itemCost || isNaN(Number(itemCost))) {
      toast({
        title: "Error",
        description: "Please enter a valid item cost",
        variant: "destructive",
      });
      return;
    }
    
    if (transactionType === 'sale' && (!sellingPrice || isNaN(Number(sellingPrice)))) {
      toast({
        title: "Error",
        description: "Please enter a valid selling price",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      // Prepare transaction data
      const costPrice = parseInt(itemCost, 10);
      let amount = costPrice;
      let profitAmount = null;
      
      if (transactionType === 'sale') {
        amount = parseInt(sellingPrice, 10);
        profitAmount = amount - costPrice;
      }
      
      // Determine the user_id to use
      let transaction_user_id = user?.id;
      
      // If user is a staff member, we need to get their owner's ID
      if (userRole === 'staff' && user?.id) {
        // Use the ANY function to safely query the staff table that might not be in types yet
        const { data: staffData, error: staffError } = await supabase
          .rpc('get_staff_owner', { staff_user_id: user.id });
          
        if (staffError) {
          // Fallback to direct query if RPC fails
          const { data: directData, error: directError } = await supabase
            .from('staff')
            .select('owner_id')
            .eq('user_id', user.id)
            .single();
            
          if (directError) throw directError;
          if (directData) transaction_user_id = directData.owner_id;
        } else if (staffData) {
          transaction_user_id = staffData.owner_id;
        }
      }
      
      // Insert transaction
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: transaction_user_id,
          name: itemName,
          amount,
          cost_price: transactionType === 'sale' ? costPrice : null,
          profit_amount: profitAmount,
          type: transactionType,
        });
        
      if (error) throw error;
      
      toast({
        title: "Transaction Added",
        description: "Your transaction has been saved successfully.",
      });
      
      // Reset form
      setItemName('');
      setItemCost('');
      setSellingPrice('');
      
      // Navigate to transactions page if not staff
      if (userRole !== 'staff') {
        navigate('/transactions');
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
  
  return (
    <MobileLayout title="Add New Transaction" showBackButton={userRole !== 'staff'}>
      <div className="p-4">
        {userRole === 'staff' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
            <p className="text-sm font-medium">Staff Access Only</p>
            <p className="text-xs">You have limited access to only add transactions.</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Transaction Type</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              disabled={loading}
            >
              <option value="sale">Sale</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Item Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {transactionType === 'sale' ? 'Item Cost (₹)' : 'Amount (₹)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              placeholder={transactionType === 'sale' ? 'Enter item cost in paise' : 'Enter amount in paise'}
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Enter amount in paise (e.g., ₹100 = 10000 paise)</p>
          </div>
          
          {transactionType === 'sale' && (
            <div>
              <label className="block text-sm font-medium mb-1">Selling Price (₹)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                placeholder="Enter selling price in paise"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Enter amount in paise (e.g., ₹100 = 10000 paise)</p>
            </div>
          )}
          
          <div className="flex space-x-3 pt-2">
            {userRole !== 'staff' && (
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => navigate('/transactions')}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              className="flex-1 bg-[#c2446e] hover:bg-[#a03759] text-white h-12"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AddTransaction;
