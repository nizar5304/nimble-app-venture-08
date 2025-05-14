
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subDays } from 'date-fns';

interface DashboardStats {
  monthlyProfit: number;
  dailyProfit: number;
  dailySales: number;
  performanceData: any[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    monthlyProfit: 0,
    dailyProfit: 0,
    dailySales: 0,
    performanceData: [],
  });
  const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D'>('7D');

  const chartConfig = {
    profit: {
      label: 'Daily Profit',
      color: '#c2446e',
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Calculate date ranges
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayStr = today.toISOString();
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfMonthStr = startOfMonth.toISOString();
        
        // Get days for performance data based on selected range
        const days = timeRange === '7D' ? 7 : timeRange === '14D' ? 14 : 30;
        
        // Daily profit (Today's transactions)
        const { data: dailyTransactions, error: dailyError } = await supabase
          .from('transactions')
          .select('*')
          .gte('transaction_date', todayStr)
          .order('transaction_date', { ascending: false });
          
        if (dailyError) throw dailyError;
        
        // Monthly profit (Current month's transactions)
        const { data: monthlyTransactions, error: monthlyError } = await supabase
          .from('transactions')
          .select('*')
          .gte('transaction_date', startOfMonthStr)
          .order('transaction_date', { ascending: false });
          
        if (monthlyError) throw monthlyError;
        
        // Get performance data for the selected time range
        const performanceData = [];
        for (let i = days - 1; i >= 0; i--) {
          const date = subDays(today, i);
          const dateStr = format(date, 'MMM d');
          
          // In a real app we would fetch data for each day
          // For demo, we'll generate random profit between 10000-13000
          performanceData.push({
            date: dateStr,
            profit: Math.floor(Math.random() * 3000) + 10000,
          });
        }
        
        // Calculate stats
        let dailySalesTotal = 0;
        let dailyProfitTotal = 0;
        
        dailyTransactions?.forEach(transaction => {
          if (transaction.type === 'sale') {
            dailySalesTotal += transaction.amount;
            dailyProfitTotal += transaction.profit_amount || 0;
          } else if (transaction.type === 'expense') {
            dailyProfitTotal -= transaction.amount;
          }
        });
        
        let monthlyProfitTotal = 0;
        
        monthlyTransactions?.forEach(transaction => {
          if (transaction.type === 'sale') {
            monthlyProfitTotal += transaction.profit_amount || 0;
          } else if (transaction.type === 'expense') {
            monthlyProfitTotal -= transaction.amount;
          }
        });
        
        setStats({
          monthlyProfit: monthlyProfitTotal,
          dailyProfit: dailyProfitTotal,
          dailySales: dailySalesTotal,
          performanceData,
        });
        
      } catch (error: any) {
        toast({
          title: "Error loading dashboard data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [timeRange]);

  return (
    <MobileLayout title="Daily Performance">
      <div className="p-4 space-y-6">
        {/* Menu Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">PhoneMetrics</h2>
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 hover:bg-pink-50 dark:hover:bg-gray-700"
              onClick={() => navigate('/')}
            >
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Overview
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 hover:bg-pink-50 dark:hover:bg-gray-700"
              onClick={() => navigate('/transactions')}
            >
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 3H7C5.9 3 5 3.9 5 5M17 3C18.1 3 19 3.9 19 5M17 3V19M19 5V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V5"/>
                <path d="M12 7v10"/>
                <path d="m15 11-3 3-3-3"/>
              </svg>
              Transactions
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 hover:bg-pink-50 dark:hover:bg-gray-700"
              onClick={() => navigate('/expenses')}
            >
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Fixed Expenses
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 hover:bg-pink-50 dark:hover:bg-gray-700"
              onClick={() => navigate('/reports')}
            >
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6"/>
                <path d="M16 13H8"/>
                <path d="M16 17H8"/>
                <path d="M10 9H8"/>
              </svg>
              Reports
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left h-12 hover:bg-pink-50 dark:hover:bg-gray-700"
              onClick={() => navigate('/subscription')}
            >
              <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
              Subscription
            </Button>
          </div>
        </div>
        
        {/* Performance Cards */}
        <StatCard 
          title="Current Month Net Profit" 
          value={`₹${(stats.monthlyProfit / 100).toLocaleString('en-IN')}`}
          change={{value: "15% from last month", positive: true}}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          }
        />
        
        <StatCard 
          title="Today's Net Profit" 
          value={`₹${(stats.dailyProfit / 100).toLocaleString('en-IN')}`}
          change={{value: "22% from yesterday", positive: true}}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="6" x2="12" y2="12"/>
              <path d="m9 15 3-3 3 3"/>
            </svg>
          }
        />
        
        <StatCard 
          title="Today's Total Sales" 
          value={`₹${(stats.dailySales / 100).toLocaleString('en-IN')}`}
          change={{value: "18% from yesterday", positive: true}}
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          }
        />
        
        {/* Chart Section */}
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold mb-2">Daily Net Profit (Last {timeRange.replace('D', ' Days')})</h2>
            <div className="flex space-x-2">
              <Button 
                variant={timeRange === "7D" ? "outline" : "ghost"} 
                size="sm" 
                className={timeRange === "7D" ? "bg-white dark:bg-gray-800" : ""}
                onClick={() => setTimeRange("7D")}
              >
                7D
              </Button>
              <Button 
                variant={timeRange === "14D" ? "outline" : "ghost"} 
                size="sm"
                className={timeRange === "14D" ? "bg-white dark:bg-gray-800" : ""}
                onClick={() => setTimeRange("14D")}
              >
                14D
              </Button>
              <Button 
                variant={timeRange === "30D" ? "outline" : "ghost"} 
                size="sm"
                className={timeRange === "30D" ? "bg-white dark:bg-gray-800" : ""}
                onClick={() => setTimeRange("30D")}
              >
                30D
              </Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-64 mt-2">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-pulse">Loading chart data...</div>
              </div>
            ) : (
              <ChartContainer className="h-full" config={chartConfig}>
                <ResponsiveContainer>
                  <LineChart data={stats.performanceData}>
                    <XAxis 
                      dataKey="date" 
                      tickLine={false} 
                      axisLine={false} 
                      tickMargin={10}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      tickLine={false} 
                      axisLine={false}
                      tickMargin={10}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="profit" 
                      stroke="#c2446e" 
                      strokeWidth={2} 
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
