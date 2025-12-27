
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HealthStatus = "optimal" | "good" | "warning" | "critical";

interface SystemHealthOrbProps {
  status?: HealthStatus;
  size?: "sm" | "md" | "lg";
}

const getStatusColor = (status: HealthStatus) => {
  switch (status) {
    case "optimal":
      return {
        inner: "#00E676",
        outer: "#00E676",
      };
    case "good":
      return {
        inner: "#00A3FF",
        outer: "#00A3FF",
      };
    case "warning":
      return {
        inner: "#FFB300",
        outer: "#FFB300",
      };
    case "critical":
      return {
        inner: "#FF3A5E",
        outer: "#FF3A5E",
      };
  }
};

const getStatusText = (status: HealthStatus) => {
  switch (status) {
    case "optimal":
      return "System Optimal";
    case "good":
      return "System Good";
    case "warning":
      return "System Warning";
    case "critical":
      return "System Critical";
  }
};

const SystemHealthOrb = ({
  status = "good",
  size = "md",
}: SystemHealthOrbProps) => {
  const [pulse, setPulse] = useState(false);
  const colors = getStatusColor(status);
  const statusText = getStatusText(status);

  // Pulse effect
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 500);
    }, 2000 + Math.random() * 1000); // Randomize a bit for natural feel

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div className="flex flex-col items-center">
      <div className={cn(
        "relative rounded-full flex items-center justify-center",
        sizeClasses[size]
      )}>
        {/* Outer glow */}
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-20 animate-pulse-glow",
            pulse && "opacity-30 scale-110"
          )}
          style={{ 
            backgroundColor: colors.outer,
            boxShadow: `0 0 20px 5px ${colors.outer}`,
            transition: "all 0.5s ease"
          }}
        />
        
        {/* Middle layer */}
        <div 
          className="absolute inset-2 rounded-full glass-panel"
          style={{
            backgroundImage: `radial-gradient(circle at center, ${colors.inner}20, transparent 70%)`,
          }}
        />
        
        {/* Inner orb */}
        <div 
          className="absolute inset-4 rounded-full animate-pulse"
          style={{ 
            backgroundColor: colors.inner + "20",
            boxShadow: `inset 0 0 15px 2px ${colors.inner}50`
          }}
        />
        
        {/* Center dot */}
        <div 
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: colors.inner }}
        />
        
        {/* Radar lines */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div 
            className="w-full h-full opacity-40 animate-radar-sweep"
            style={{ 
              background: `conic-gradient(${colors.inner}00 0deg, ${colors.inner} 20deg, ${colors.inner}00 40deg)`,
            }}
          />
        </div>
      </div>
      
      <div className="mt-2 text-center">
        <p className="text-sm font-medium" style={{ color: colors.inner }}>{statusText}</p>
        <p className="text-xs text-white/60 font-mono">
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default SystemHealthOrb;
