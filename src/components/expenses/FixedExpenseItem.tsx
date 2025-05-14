
import React from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FixedExpenseItemProps {
  id: string;
  name: string;
  amount: number;
  frequency: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const FixedExpenseItem = ({ 
  id, 
  name, 
  amount, 
  frequency,
  onEdit,
  onDelete 
}: FixedExpenseItemProps) => {
  return (
    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="h-12 w-12 rounded-lg bg-purple-100 text-purple-500 dark:bg-purple-900/30 dark:text-purple-300 flex items-center justify-center mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{frequency} expense</p>
      </div>
      
      <div className="ml-4 flex flex-col items-end">
        <p className="font-semibold text-red-500">-₹{amount.toLocaleString()}</p>
        <div className="flex space-x-2 mt-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(id)}>
            <Pencil size={16} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onDelete(id)}>
            <Trash size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FixedExpenseItem;
