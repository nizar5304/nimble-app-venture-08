
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MobileLayout from '@/components/layout/MobileLayout';
import StatCard from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

// This is mock data, in a real app this would come from Supabase
const performanceData = [
  { date: 'May 7', profit: 11200 },
  { date: 'May 8', profit: 11100 },
  { date: 'May 9', profit: 11500 },
  { date: 'May 10', profit: 12400 },
  { date: 'May 11', profit: 12500 },
  { date: 'May 12', profit: 12100 },
  { date: 'May 13', profit: 12000 },
];

const chartConfig = {
  profit: {
    label: 'Daily Profit',
    color: '#c2446e',
  },
};

const Dashboard = () => {
  const navigate = useNavigate();

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
          </div>
        </div>
        
        {/* Performance Cards */}
        <StatCard 
          title="Current Month Net Profit" 
          value="₹2,19,377" 
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
          value="₹2,74,367" 
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
          value="₹2,79,700" 
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
            <h2 className="text-lg font-semibold mb-2">Daily Net Profit (Last 7 Days)</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="bg-white dark:bg-gray-800">7D</Button>
              <Button variant="ghost" size="sm">14D</Button>
              <Button variant="ghost" size="sm">30D</Button>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 h-64 mt-2">
            <ChartContainer className="h-full" config={chartConfig}>
              <ResponsiveContainer>
                <LineChart data={performanceData}>
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
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;
