
import React from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = React.useState('May 2025');
  
  const handleDownload = (type: 'csv' | 'pdf') => {
    toast({
      title: `${type.toUpperCase()} Download Started`,
      description: `Your ${selectedMonth} report is being downloaded.`,
    });
  };
  
  return (
    <MobileLayout title="Monthly Reports" showBackButton>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">Monthly Reports</h2>
        
        {/* Month selector */}
        <div className="mb-4">
          <select
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="May 2025">May 2025</option>
            <option value="April 2025">April 2025</option>
            <option value="March 2025">March 2025</option>
          </select>
        </div>
        
        {/* Download buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center space-x-2 h-12"
            onClick={() => handleDownload('csv')}
          >
            <FileSpreadsheet size={16} />
            <span>Download CSV</span>
          </Button>
          
          <Button 
            className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center space-x-2 h-12"
            onClick={() => handleDownload('pdf')}
          >
            <FileText size={16} />
            <span>Download PDF</span>
          </Button>
        </div>
        
        {/* Report summary */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <table className="w-full">
              <tbody>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-left">Total Sales:</td>
                  <td className="p-4 text-right font-semibold">₹2,79,700</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-left">Total Expenses:</td>
                  <td className="p-4 text-right font-semibold">₹3,500</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="p-4 text-left">Fixed Expenses:</td>
                  <td className="p-4 text-right font-semibold">₹1,833</td>
                </tr>
                <tr>
                  <td className="p-4 text-left font-bold">Net Profit:</td>
                  <td className="p-4 text-right font-bold text-green-500">₹2,74,367</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
        
        {/* Monthly transactions */}
        <h3 className="text-lg font-semibold mb-2">Monthly Transactions</h3>
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-300 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">iPhone 15 Pro Max</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">May 14, 2025</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-green-500">+₹1,19,900</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-pink-100 text-pink-500 dark:bg-pink-900/30 dark:text-pink-300 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">2x Samsung S24</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">May 14, 2025</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-green-500">+₹1,59,800</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center">
            <div className="h-12 w-12 rounded-lg bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-300 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold">Store Maintenance</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">May 14, 2025</p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-red-500">-₹3,500</p>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Reports;
