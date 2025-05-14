
import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, PlusCircle, UserRound, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface MobileLayoutProps {
  children: React.ReactNode;
  title: string;
  showBackButton?: boolean;
}

const MobileLayout = ({ children, title, showBackButton = false }: MobileLayoutProps) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
    toast({
      title: isDarkMode ? "Light Mode Activated" : "Dark Mode Activated",
      duration: 2000,
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-[#c2446e] dark:bg-[#a03759] text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={goBack}
              className="mr-2 text-white hover:bg-[#a03759]/50 dark:hover:bg-[#c2446e]/50"
            >
              <span className="text-xl">←</span>
            </Button>
          )}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-white hover:bg-[#a03759]/50 dark:hover:bg-[#c2446e]/50"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          <div className="w-8 h-8 rounded-full bg-white text-[#c2446e] dark:bg-gray-200 flex items-center justify-center ml-2">
            A
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 grid grid-cols-3 gap-2">
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-16 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => navigate("/")}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-16 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => navigate("/add")}
        >
          <PlusCircle size={24} />
          <span className="text-xs mt-1">Add</span>
        </Button>
        <Button
          variant="ghost"
          className="flex flex-col items-center justify-center h-16 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => navigate("/profile")}
        >
          <UserRound size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Button>
      </nav>
    </div>
  );
};

export default MobileLayout;
