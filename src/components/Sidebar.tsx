
import { useState } from "react";
import { 
  LayoutDashboard, 
  Boxes, 
  FlaskConical, 
  Gauge, 
  Plane, 
  Package, 
  BellRing, 
  Brain, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Robotic Arm Control", href: "/robotic-arm-control", icon: Boxes },
  { name: "Digital Testing", href: "/digital-testing", icon: FlaskConical },
  { name: "Engine Assembly", href: "/engine-assembly", icon: Gauge },
  { name: "Drones & Aircraft", href: "/drones-aircraft", icon: Plane },
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Alerts & Logs", href: "/alerts-logs", icon: BellRing },
  { name: "AI Insights", href: "/ai-insights", icon: Brain },
  { name: "System Configurations", href: "/system-configurations", icon: Settings },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(true); // Default to collapsed
  const location = useLocation();

  return (
    <aside 
      className={cn(
        "bg-honeywell-panel border-r border-white/10 transition-all duration-300 ease-in-out relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={cn(
          "flex items-center h-16 px-4 border-b border-white/10 transition-all",
          collapsed ? "justify-center" : "justify-start"
        )}>
          <div className="relative animate-pulse-glow">
            <img 
              src="/honeywell-logo.png" 
              alt="Honeywell" 
              className={cn(
                "transition-all duration-300",
                collapsed ? "h-8" : "h-10"
              )}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-honeywell-blue opacity-40 animate-radar-sweep rounded-full scale-75 origin-center blur-md" />
            </div>
          </div>
          {!collapsed && (
            <span className="ml-2 text-white font-bold tracking-wider transition-opacity duration-300 opacity-100">DIGITAL FACTORY</span>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={cn(
                      "flex items-center px-2 py-3 rounded-md text-sm transition-all group relative",
                      isActive 
                        ? "text-white bg-honeywell-blue/20" 
                        : "text-white/70 hover:text-white hover:bg-honeywell-blue/10",
                      collapsed ? "justify-center" : "justify-start"
                    )}
                  >
                    <div className={cn(
                      "relative flex items-center justify-center",
                      isActive && "text-honeywell-blue"
                    )}>
                      <item.icon className={cn(
                        "h-5 w-5 transition-all",
                        isActive && "animate-pulse-glow"
                      )} />
                      {isActive && (
                        <div className="absolute inset-0 bg-honeywell-blue opacity-30 animate-pulse rounded-full scale-150 blur-md -z-10" />
                      )}
                    </div>
                    
                    {!collapsed && (
                      <span className="ml-3 whitespace-nowrap opacity-0 transform transition-all duration-300 group-hover:opacity-100" style={{ 
                        animationDelay: "0.1s", 
                        opacity: collapsed ? 0 : 1,
                        transform: collapsed ? "translateX(-10px)" : "translateX(0)",
                        transitionDelay: collapsed ? "0s" : "0.1s"
                      }}>
                        {item.name}
                      </span>
                    )}
                    
                    {collapsed && (
                      <div className="absolute left-full rounded-md px-2 py-1 ml-6 bg-honeywell-dark border border-white/10 text-sm opacity-0 -translate-x-3 invisible transition-all group-hover:opacity-100 group-hover:translate-x-0 group-hover:visible z-50">
                        {item.name}
                      </div>
                    )}
                    
                    {isActive && !collapsed && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-honeywell-blue rounded-r" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse button */}
        <div className="p-2 border-t border-white/10">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 rounded-md text-white/70 hover:text-white hover:bg-honeywell-blue/10 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
