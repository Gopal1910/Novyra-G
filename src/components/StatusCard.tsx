
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  description?: string;
  variant?: "default" | "success" | "warning" | "danger";
  className?: string;
}

const StatusCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  description,
  variant = "default",
  className,
}: StatusCardProps) => {
  const variantClasses = {
    default: "border-white/10 bg-black/30",
    success: "border-honeywell-green/30 bg-honeywell-green/5",
    warning: "border-honeywell-amber/30 bg-honeywell-amber/5",
    danger: "border-honeywell-red/30 bg-honeywell-red/5",
  };
  
  const trendClasses = {
    up: "text-honeywell-green",
    down: "text-honeywell-red",
    stable: "text-honeywell-amber",
  };
  
  return (
    <div className={cn(
      "glass-panel p-4 transition-all hover:translate-y-[-2px]",
      variantClasses[variant],
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-white/70 text-sm font-mono">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-medium text-white">{value}</p>
            
            {trend && trendValue && (
              <span className={cn(
                "ml-2 text-xs font-medium flex items-center",
                trendClasses[trend]
              )}>
                {trend === "up" && "↑"}
                {trend === "down" && "↓"}
                {trend === "stable" && "→"}
                {" "}
                {trendValue}
              </span>
            )}
          </div>
          
          {description && (
            <p className="mt-1 text-xs text-white/60">{description}</p>
          )}
        </div>
        
        {icon && (
          <div className="p-2 rounded-full bg-white/5 border border-white/10">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;
