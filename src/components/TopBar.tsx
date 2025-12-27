
import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const TopBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertCount, setAlertCount] = useState(3);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-16 glass-panel flex items-center justify-between px-4 md:px-6 border-b border-white/10">
      <div className="flex items-center">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-honeywell-blue opacity-70" />
          <Input 
            placeholder="Search..." 
            className="w-48 md:w-64 pl-8 bg-black/40 border-honeywell-blue/30 focus:border-honeywell-blue text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-sm text-white/80 font-mono">
          {currentTime.toLocaleTimeString()} <span className="text-honeywell-blue">|</span> {currentTime.toLocaleDateString()}
        </div>
        
        <div className="relative">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
            <Bell className="h-5 w-5" />
          </Button>
          {alertCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-honeywell-red text-[10px] text-white">
              {alertCount}
            </span>
          )}
        </div>
        
        <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
          <Settings className="h-5 w-5" />
        </Button>
        
        <div className="h-8 w-8 rounded-full bg-honeywell-panel flex items-center justify-center border border-white/20">
          <User className="h-5 w-5 text-white/80" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
