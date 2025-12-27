
import { 
  Activity, 
  Gauge, 
  Cpu, 
  ThermometerSun, 
  BarChart, 
  Server, 
  AlertTriangle, 
  Check
} from "lucide-react";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import FactoryModel from "@/components/ThreeJSModels/FactoryModel";
import SystemHealthOrb from "@/components/SystemHealthOrb";
import StatusCard from "@/components/StatusCard";
import ActivityFeed from "@/components/ActivityFeed";

// Fake data for charts
const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const powerData = generateTimeSeriesData(24, 150, 40);
const motorData = generateTimeSeriesData(24, 75, 25, 0.5);
const networkData = generateTimeSeriesData(24, 20, 15, -0.2);
const thermalData = generateTimeSeriesData(24, 60, 10);

// Activity feed data
const activities = [
  {
    id: "1",
    type: "alert" as const,
    message: "Critical temperature threshold exceeded in Engine Assembly",
    timestamp: "10 minutes ago",
    severity: "critical" as const,
  },
  {
    id: "2",
    type: "notification" as const,
    message: "Software update available for robotics controller",
    timestamp: "25 minutes ago",
    severity: "low" as const,
  },
  {
    id: "3",
    type: "update" as const,
    message: "Inventory restocked: Carbon fiber components",
    timestamp: "1 hour ago",
    severity: "low" as const,
  },
  {
    id: "4",
    type: "optimization" as const,
    message: "AI suggested optimizations for motor efficiency available",
    timestamp: "2 hours ago",
    severity: "medium" as const,
  },
  {
    id: "5",
    type: "alert" as const,
    message: "Network latency detected in zone B communications",
    timestamp: "3 hours ago",
    severity: "high" as const,
    read: true,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Mission Control</h1>
        <p className="text-white/60">Real-time overview of Digital Factory systems and operations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard 
          title="System Uptime"
          value="99.98%"
          icon={<Server className="h-5 w-5 text-white/80" />}
          trend="up"
          trendValue="0.2%"
          description="Last 30 days"
        />
        <StatusCard 
          title="Active Processes"
          value="42"
          icon={<Cpu className="h-5 w-5 text-white/80" />}
          trend="stable"
          trendValue="No change"
          variant="default"
        />
        <StatusCard 
          title="Alert Status"
          value="2 Active"
          icon={<AlertTriangle className="h-5 w-5 text-white/80" />}
          trend="down"
          trendValue="3 resolved"
          variant="warning"
        />
        <StatusCard 
          title="Production Efficiency"
          value="104.2%"
          icon={<Check className="h-5 w-5 text-white/80" />}
          trend="up"
          trendValue="4.2%"
          variant="success"
          description="Above target"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <FactoryModel height="400px" />
        </div>
        <div className="flex flex-col justify-between space-y-4">
          <div className="glass-panel p-4 flex-1 flex items-center justify-center">
            <SystemHealthOrb status="good" size="lg" />
          </div>
          <ActivityFeed activities={activities.slice(0, 3)} maxHeight="180px" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeSeriesChart 
          data={powerData} 
          dataKey="value" 
          title="Power Consumption (kW)"
          stroke="#00A3FF"
          yAxisLabel="kW"
          height={200}
        />
        <TimeSeriesChart 
          data={motorData} 
          dataKey="value" 
          title="Motor Performance (%)"
          stroke="#00E676"
          fill="#00E676"
          yAxisLabel="%"
          height={200}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeSeriesChart 
          data={networkData} 
          dataKey="value" 
          title="Network Latency (ms)"
          stroke="#FFB300"
          fill="#FFB300"
          yAxisLabel="ms"
          height={200}
        />
        <TimeSeriesChart 
          data={thermalData} 
          dataKey="value" 
          title="Thermal Monitoring (°C)"
          stroke="#FF3A5E"
          fill="#FF3A5E"
          yAxisLabel="°C"
          height={200}
        />
      </div>
      
      <div>
        <ActivityFeed activities={activities} maxHeight="250px" />
      </div>
    </div>
  );
};

export default Dashboard;
