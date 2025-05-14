
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Home, Receipt, Calendar, FileText, PlusCircle, UserRound, LogOut } from 'lucide-react';

interface MobileSidebarProps {
  title: string;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ title }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };
  
  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-2">
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle className="text-[#c2446e]">PhoneMetrics</SheetTitle>
          <SheetDescription>
            Mobile shop management app
          </SheetDescription>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 py-6">
          {user ? (
            <div className="flex flex-col items-center mb-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-[#c2446e] text-white flex items-center justify-center text-2xl mb-2">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <p className="text-sm truncate max-w-full">{user.email}</p>
            </div>
          ) : null}
          
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/')}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/transactions')}
            >
              <Receipt className="mr-2 h-4 w-4" />
              Transactions
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/expenses')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Fixed Expenses
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/reports')}
            >
              <FileText className="mr-2 h-4 w-4" />
              Reports
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/add')}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/profile')}
            >
              <UserRound className="mr-2 h-4 w-4" />
              Profile
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => handleNavigation('/subscription')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
              Subscription
            </Button>
          </div>
        </div>
        
        <SheetFooter>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
