
import { useState } from "react";
import { BarChart3, Gauge, ThermometerSun, RotateCw, ArrowRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import RoboticArmModel from "@/components/ThreeJSModels/RoboticArmModel";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import StatusCard from "@/components/StatusCard";
import { toast } from "sonner";

// Fake data for charts
const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const torqueData = generateTimeSeriesData(24, 65, 15);
const rpmData = generateTimeSeriesData(24, 120, 40);
const heatData = generateTimeSeriesData(24, 45, 10, 0.2);

const RoboticArmControl = () => {
  const [speed, setSpeed] = useState(50);
  const [precision, setPrecision] = useState(75);
  const [torque, setTorque] = useState(60);
  const [activeTab, setActiveTab] = useState("performance");
  
  const handleRunSequence = () => {
    toast.success("Robotic arm sequence initiated", {
      description: `Speed: ${speed}%, Precision: ${precision}%, Torque: ${torque}%`,
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Robotic Arm Control</h1>
        <p className="text-white/60">Precision control and monitoring of robotic arm systems</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="glass-panel p-4">
            <RoboticArmModel height="500px" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Control Panel</h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">Speed</label>
                  <span className="text-sm font-mono text-honeywell-blue">{speed}%</span>
                </div>
                <Slider 
                  value={[speed]} 
                  onValueChange={(value) => setSpeed(value[0])}
                  min={10} 
                  max={100} 
                  step={1} 
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">Precision</label>
                  <span className="text-sm font-mono text-honeywell-blue">{precision}%</span>
                </div>
                <Slider 
                  value={[precision]} 
                  onValueChange={(value) => setPrecision(value[0])}
                  min={10} 
                  max={100} 
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">Torque</label>
                  <span className="text-sm font-mono text-honeywell-blue">{torque}%</span>
                </div>
                <Slider 
                  value={[torque]} 
                  onValueChange={(value) => setTorque(value[0])}
                  min={10} 
                  max={100} 
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <Button 
                onClick={handleRunSequence}
                className="w-full bg-honeywell-blue hover:bg-honeywell-blue/80 text-white"
              >
                <RotateCw className="h-4 w-4 mr-2" />
                Run Sequence
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <StatusCard 
              title="Operational Status"
              value="Online"
              variant="success"
            />
            
            <StatusCard 
              title="Error Rate"
              value="0.02%"
              trend="down"
              trendValue="0.01%"
              variant="default"
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 bg-transparent">
          <TabsTrigger value="performance" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Gauge className="h-4 w-4 mr-2" />
            Diagnostics
          </TabsTrigger>
          <TabsTrigger value="thermal" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <ThermometerSun className="h-4 w-4 mr-2" />
            Thermal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-4">
          <TimeSeriesChart 
            data={torqueData} 
            dataKey="value" 
            title="Torque (N·m)"
            stroke="#00A3FF"
            height={300}
            yAxisLabel="N·m"
          />
        </TabsContent>
        
        <TabsContent value="diagnostics" className="mt-4">
          <TimeSeriesChart 
            data={rpmData} 
            dataKey="value" 
            title="Joint RPM"
            stroke="#00E676"
            fill="#00E676"
            height={300}
            yAxisLabel="RPM"
          />
        </TabsContent>
        
        <TabsContent value="thermal" className="mt-4">
          <TimeSeriesChart 
            data={heatData} 
            dataKey="value" 
            title="Heat Generation (°C)"
            stroke="#FF3A5E"
            fill="#FF3A5E"
            height={300}
            yAxisLabel="°C"
          />
        </TabsContent>
      </Tabs>
      
      <div className="glass-panel p-4 border-l-4 border-honeywell-blue">
        <h3 className="text-white text-base mb-2 font-medium">AI Recommendations</h3>
        <p className="text-sm text-white/80 mb-3">
          Based on recent performance data, the following optimizations are recommended:
        </p>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-honeywell-blue" />
            <span className="text-sm text-white/80">
              Reduce joint 2 torque by 5% to optimize energy consumption
            </span>
          </li>
          <li className="flex items-start">
            <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-honeywell-blue" />
            <span className="text-sm text-white/80">
              Schedule maintenance for end-effector in 15 days based on wear pattern
            </span>
          </li>
          <li className="flex items-start">
            <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-honeywell-blue" />
            <span className="text-sm text-white/80">
              Current pick-and-place sequence can be optimized for 8% improved cycle time
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RoboticArmControl;
