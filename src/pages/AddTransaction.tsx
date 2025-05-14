
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const AddTransaction = () => {
  const [transactionType, setTransactionType] = React.useState('sale');
  const [itemName, setItemName] = React.useState('');
  const [itemCost, setItemCost] = React.useState('');
  const [sellingPrice, setSellingPrice] = React.useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
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
    
    // In a real app, would send this to Supabase
    toast({
      title: "Transaction Added",
      description: "Your transaction has been saved successfully.",
    });
    
    // Reset form
    setItemName('');
    setItemCost('');
    setSellingPrice('');
  };
  
  return (
    <MobileLayout title="Add New Transaction" showBackButton>
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Transaction Type</label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
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
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {transactionType === 'sale' ? 'Item Cost (₹)' : 'Amount (₹)'}
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
              placeholder={transactionType === 'sale' ? 'Enter item cost' : 'Enter amount'}
              value={itemCost}
              onChange={(e) => setItemCost(e.target.value)}
            />
          </div>
          
          {transactionType === 'sale' && (
            <div>
              <label className="block text-sm font-medium mb-1">Selling Price (₹)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800"
                placeholder="Enter selling price"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>
          )}
          
          <div className="flex space-x-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#c2446e] hover:bg-[#a03759] text-white h-12"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AddTransaction;
