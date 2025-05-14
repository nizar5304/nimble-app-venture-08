
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Receipt, Calendar, FileText, PlusCircle, UserRound, LogOut, BadgePercent } from 'lucide-react';

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

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Receipt, label: 'Transactions', path: '/transactions' },
    { icon: Calendar, label: 'Fixed Expenses', path: '/expenses' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: PlusCircle, label: 'Add Transaction', path: '/add' },
    { icon: UserRound, label: 'Profile', path: '/profile' },
    { icon: BadgePercent, label: 'Subscription', path: '/subscription' },
  ];

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
      
      <SheetContent side="left" className="w-[250px] sm:w-[300px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-[#c2446e]">PhoneMetrics</SheetTitle>
            <SheetDescription>
              Mobile shop management app
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto">
            {user ? (
              <div className="flex flex-col items-center py-6 px-4 mb-2 border-b">
                <div className="w-16 h-16 rounded-full bg-[#c2446e] text-white flex items-center justify-center text-2xl mb-2">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <p className="text-sm truncate max-w-full">{user.email}</p>
              </div>
            ) : null}
            
            <div className="px-2 py-4">
              {menuItems.map((item) => (
                <Button 
                  key={item.path}
                  variant="ghost" 
                  className="w-full justify-start my-1 rounded-lg"
                  onClick={() => handleNavigation(item.path)}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          
          <SheetFooter className="p-4 border-t mt-auto">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
