
import React from "react";
import { format } from "date-fns";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionItemProps {
  id: string;
  name: string;
  amount: number;
  timestamp: string;
  type: "sale" | "expense";
  profitAmount?: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const TransactionItem = ({ 
  id, 
  name, 
  amount, 
  timestamp, 
  type, 
  profitAmount, 
  onEdit,
  onDelete
}: TransactionItemProps) => {
  const formattedDate = React.useMemo(() => {
    try {
      const date = new Date(timestamp);
      return format(date, "MMM d, yyyy h:mm a");
    } catch (e) {
      return timestamp;
    }
  }, [timestamp]);
  
  const isToday = React.useMemo(() => {
    try {
      const date = new Date(timestamp);
      const today = new Date();
      return date.setHours(0,0,0,0) === today.setHours(0,0,0,0);
    } catch (e) {
      return false;
    }
  }, [timestamp]);

  return (
    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center mr-4 ${
        type === "sale" ? "bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-300" : 
        "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-300"
      }`}>
        {type === "sale" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold">{name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isToday ? "Today, " + formattedDate.split(", ")[1] : formattedDate}
        </p>
        {type === "sale" && profitAmount !== undefined && (
          <p className="text-sm text-green-500">Profit: ₹{profitAmount.toLocaleString()}</p>
        )}
      </div>
      
      <div className="ml-4 flex flex-col items-end">
        <p className={`font-semibold ${type === "sale" ? "text-green-500" : "text-red-500"}`}>
          {type === "sale" ? "+" : "-"}₹{amount.toLocaleString()}
        </p>
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

export default TransactionItem;
