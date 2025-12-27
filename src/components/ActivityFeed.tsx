
import { Bell, CheckCircle, AlertTriangle, Info, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType = "alert" | "notification" | "update" | "optimization";

interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  severity?: "low" | "medium" | "high" | "critical";
  read?: boolean;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxHeight?: string;
}

const getActivityIcon = (type: ActivityType, severity?: string) => {
  switch (type) {
    case "alert":
      if (severity === "critical") return <AlertCircle className="h-4 w-4 text-honeywell-red" />;
      if (severity === "high") return <AlertTriangle className="h-4 w-4 text-honeywell-amber" />;
      return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    case "notification":
      return <Bell className="h-4 w-4 text-honeywell-blue" />;
    case "update":
      return <Info className="h-4 w-4 text-honeywell-blue" />;
    case "optimization":
      return <CheckCircle className="h-4 w-4 text-honeywell-green" />;
  }
};

const getSeverityClass = (severity?: string) => {
  switch (severity) {
    case "critical":
      return "border-l-honeywell-red";
    case "high":
      return "border-l-honeywell-amber";
    case "medium":
      return "border-l-yellow-400";
    case "low":
      return "border-l-honeywell-blue";
    default:
      return "border-l-gray-400";
  }
};

const ActivityFeed = ({ activities, maxHeight = "300px" }: ActivityFeedProps) => {
  return (
    <div className="glass-panel p-4">
      <h3 className="text-white font-medium mb-3 flex items-center">
        <Bell className="h-4 w-4 mr-2" />
        Activity Feed
      </h3>
      
      <div 
        className="space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pr-1" 
        style={{ maxHeight }}
      >
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className={cn(
              "glass-panel p-3 border-l-2 animate-fade-in transition-all hover:translate-x-1",
              getSeverityClass(activity.severity),
              activity.read ? "opacity-60" : "opacity-100"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-2">
                <div className="mt-0.5">
                  {getActivityIcon(activity.type, activity.severity)}
                </div>
                <div>
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-white/60 font-mono">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
