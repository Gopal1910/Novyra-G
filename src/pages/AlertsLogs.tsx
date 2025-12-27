import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  BellRing, 
  AlertTriangle, 
  Filter, 
  CheckCircle, 
  X, 
  Clock,
  MessageSquare,
  BarChart3,
  Search,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import StatusCard from "@/components/StatusCard";

// Fake data for charts
const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const alertFrequencyData = generateTimeSeriesData(24, 12, 8);
const resolutionTimeData = generateTimeSeriesData(24, 45, 15, -0.5);
const systemsAffectedData = generateTimeSeriesData(24, 3, 2);

// Sample alert data
const alertsData = [
  { 
    id: 1, 
    type: "critical", 
    system: "Engine Assembly", 
    message: "Critical temperature threshold exceeded on turbine assembly line", 
    timestamp: "10 minutes ago", 
    resolved: false 
  },
  { 
    id: 2, 
    type: "warning", 
    system: "Inventory", 
    message: "Low stock alert: Carbon fiber components below threshold", 
    timestamp: "25 minutes ago", 
    resolved: false 
  },
  { 
    id: 3, 
    type: "info", 
    system: "Robotic Arm", 
    message: "Scheduled maintenance due in 48 hours", 
    timestamp: "1 hour ago", 
    resolved: false 
  },
  { 
    id: 4, 
    type: "warning", 
    system: "Network Infrastructure", 
    message: "Latency detected in zone B communications", 
    timestamp: "2 hours ago", 
    resolved: false 
  },
  { 
    id: 5, 
    type: "critical", 
    system: "Security", 
    message: "Unauthorized access attempt detected at server room", 
    timestamp: "3 hours ago", 
    resolved: true 
  },
  { 
    id: 6, 
    type: "info", 
    system: "Software", 
    message: "System update available for robotics controller", 
    timestamp: "5 hours ago", 
    resolved: true 
  },
  { 
    id: 7, 
    type: "warning", 
    system: "Drones", 
    message: "Drone #AR-42 reporting abnormal vibration patterns", 
    timestamp: "6 hours ago", 
    resolved: true 
  },
  { 
    id: 8, 
    type: "critical", 
    system: "Power Systems", 
    message: "Power fluctuation detected in primary manufacturing grid", 
    timestamp: "1 day ago", 
    resolved: true 
  },
];

// Sample log data
const logsData = [
  { id: 1, level: "ERROR", system: "engine-assembly", message: "Temperature sensor TH-23 reading out of bounds: 342°C", timestamp: "2023-04-05 09:23:15" },
  { id: 2, level: "INFO", system: "inventory", message: "Restocking procedure initiated for carbon fiber components", timestamp: "2023-04-05 09:15:42" },
  { id: 3, level: "WARN", system: "robotic-arm", message: "Joint #3 torque exceeding normal operational parameters", timestamp: "2023-04-05 08:57:30" },
  { id: 4, level: "INFO", system: "user-auth", message: "User jsmith logged in from terminal T-12", timestamp: "2023-04-05 08:45:12" },
  { id: 5, level: "DEBUG", system: "network", message: "Packet loss rate at 0.5% on subnet 192.168.12.0/24", timestamp: "2023-04-05 08:32:54" },
  { id: 6, level: "ERROR", system: "security", message: "Failed authentication attempt from IP 203.51.24.33", timestamp: "2023-04-05 08:21:05" },
  { id: 7, level: "INFO", system: "maintenance", message: "Scheduled maintenance completed for drone fleet", timestamp: "2023-04-05 08:15:00" },
  { id: 8, level: "WARN", system: "power", message: "Backup generator test cycle initiated", timestamp: "2023-04-05 08:00:00" },
  { id: 9, level: "ERROR", system: "digital-testing", message: "Test case TC-452 failed: component stress tolerance below threshold", timestamp: "2023-04-05 07:48:32" },
  { id: 10, level: "INFO", system: "ai-module", message: "Model retraining completed. Accuracy: 98.7%", timestamp: "2023-04-05 07:30:15" },
];

// Network Visualization Component
const NetworkVisualization = () => {
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const linesRef = useRef<THREE.Line[]>([]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Animate the nodes with subtle movement
    nodesRef.current.forEach((node, i) => {
      if (node) {
        node.position.y = Math.sin(time * 0.5 + i) * 0.1;
      }
    });
    
    // Animate the data flowing along lines
    linesRef.current.forEach((line, i) => {
      if (line && line.material instanceof THREE.LineBasicMaterial) {
        // Pulse animation for the lines
        const opacity = 0.5 + Math.sin(time * 2 + i) * 0.3;
        line.material.opacity = opacity;
      }
    });
  });
  
  // Create network nodes
  const createNodes = () => {
    const nodes = [];
    const nodeCount = 12;
    
    for (let i = 0; i < nodeCount; i++) {
      // Calculate position in a circular pattern
      const angle = (i / nodeCount) * Math.PI * 2;
      const radius = 3 + Math.random();
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = Math.random() * 2 - 1;
      
      const nodeSize = 0.2 + Math.random() * 0.2;
      const nodeColor = i % 3 === 0 ? "#FF3A5E" : i % 3 === 1 ? "#00A3FF" : "#FFB300";
      
      nodes.push(
        <mesh 
          key={i}
          position={[x, y, z]} 
          ref={ref => ref && nodesRef.current.push(ref)}
          castShadow
        >
          <sphereGeometry args={[nodeSize, 16, 16]} />
          <meshStandardMaterial 
            color={nodeColor} 
            emissive={nodeColor}
            emissiveIntensity={1}
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
      );
    }
    
    return nodes;
  };
  
  // Create connecting lines between nodes
  const createLines = () => {
    const lines = [];
    
    // Create lines between nodes (not all connections, just some)
    for (let i = 0; i < nodesRef.current.length; i++) {
      for (let j = i + 1; j < nodesRef.current.length; j++) {
        // Only connect some nodes based on random selection or pattern
        if (Math.random() > 0.7 || (i % 4 === 0 && j % 4 === 0)) {
          const nodeA = nodesRef.current[i];
          const nodeB = nodesRef.current[j];
          
          if (nodeA && nodeB) {
            const points = [nodeA.position, nodeB.position];
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            
            lines.push(
              <primitive 
                key={`${i}-${j}`}
                object={new THREE.Line(
                  lineGeometry,
                  new THREE.LineBasicMaterial({ 
                    color: "#00A3FF", 
                    opacity: 0.5, 
                    transparent: true 
                  })
                )}
                ref={(ref) => {
                  if (ref) linesRef.current.push(ref);
                }}
              />
            );
          }
        }
      }
    }
    
    return lines;
  };
  
  return (
    <group ref={groupRef}>
      {/* Create the nodes */}
      {createNodes()}
      
      {/* We'll add the lines in useEffect after nodes are created */}
      {nodesRef.current.length > 0 && createLines()}
      
      {/* Central Hub */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#00E676" 
          emissive="#00E676"
          emissiveIntensity={1}
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const AlertsLogs = () => {
  const [activeTab, setActiveTab] = useState<"alerts" | "logs">("alerts");
  const [alertFilter, setAlertFilter] = useState<"all" | "critical" | "warning" | "info">("all");
  const [logFilter, setLogFilter] = useState<"all" | "ERROR" | "WARN" | "INFO" | "DEBUG">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter alerts
  const filteredAlerts = alertsData.filter(alert => {
    const matchesType = alertFilter === "all" || alert.type === alertFilter;
    const matchesSearch = alert.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          alert.system.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });
  
  // Filter logs
  const filteredLogs = logsData.filter(log => {
    const matchesLevel = logFilter === "all" || log.level === logFilter;
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.system.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Alerts & Logs</h1>
        <p className="text-white/60">System monitoring and diagnostic information</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel p-4 h-[450px]">
            <Canvas
              shadows
              camera={{ position: [0, 0, 10], fov: 45 }}
            >
              <ambientLight intensity={0.4} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.3} 
                penumbra={1} 
                intensity={1} 
                castShadow 
                shadow-mapSize={1024} 
              />
              
              <NetworkVisualization />
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">System Status</h3>
            
            <div className="space-y-3">
              {["Engine Assembly", "Robotic Systems", "Inventory", "Network"].map((system, i) => (
                <div key={system} className="flex items-center justify-between">
                  <span className="text-sm text-white/70">{system}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    i === 0 ? "bg-red-500/20 text-red-400" : 
                    i === 3 ? "bg-yellow-500/20 text-yellow-400" : 
                    "bg-green-500/20 text-green-400"
                  }`}>
                    {i === 0 ? "Critical" : i === 3 ? "Warning" : "Operational"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="Active Alerts"
              value="3"
              variant="warning"
            />
            
            <StatusCard 
              title="Systems"
              value="8/10"
              variant="default"
            />
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-4">
        <Tabs defaultValue="alerts" onValueChange={(value) => setActiveTab(value as "alerts" | "logs")}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-transparent">
              <TabsTrigger value="alerts" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
                <BellRing className="h-4 w-4 mr-2" />
                Alerts
              </TabsTrigger>
              <TabsTrigger value="logs" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
                <FileText className="h-4 w-4 mr-2" />
                Logs
              </TabsTrigger>
            </TabsList>
            
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-white/50" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-honeywell-panel border border-white/10 text-white rounded pl-9 pr-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <TabsContent value="alerts" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={alertFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("all")}
                className={alertFilter === "all" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
              >
                All
              </Button>
              <Button 
                variant={alertFilter === "critical" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("critical")}
                className={alertFilter === "critical" ? "bg-red-500 hover:bg-red-600" : ""}
              >
                <AlertTriangle className="h-3 w-3 mr-1" />
                Critical
              </Button>
              <Button 
                variant={alertFilter === "warning" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("warning")}
                className={alertFilter === "warning" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              >
                Warning
              </Button>
              <Button 
                variant={alertFilter === "info" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlertFilter("info")}
                className={alertFilter === "info" ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                Info
              </Button>
            </div>
            
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {filteredAlerts.map(alert => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border ${
                    alert.type === "critical" ? "bg-red-500/10 border-red-500/30" :
                    alert.type === "warning" ? "bg-yellow-500/10 border-yellow-500/30" :
                    "bg-blue-500/10 border-blue-500/30"
                  } ${alert.resolved ? "opacity-50" : ""}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      {alert.type === "critical" && <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />}
                      {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2" />}
                      {alert.type === "info" && <BellRing className="h-5 w-5 text-blue-400 mr-2" />}
                      <div>
                        <h4 className="text-white text-sm font-medium">{alert.system}</h4>
                        <p className="text-white/70 text-sm">{alert.message}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-white/50 text-xs mr-2">{alert.timestamp}</span>
                      {alert.resolved ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredAlerts.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-white/50">
                  <BellRing className="h-12 w-12 mb-2 opacity-30" />
                  <p>No alerts match your current filters</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={logFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogFilter("all")}
                className={logFilter === "all" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
              >
                All
              </Button>
              <Button 
                variant={logFilter === "ERROR" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogFilter("ERROR")}
                className={logFilter === "ERROR" ? "bg-red-500 hover:bg-red-600" : ""}
              >
                ERROR
              </Button>
              <Button 
                variant={logFilter === "WARN" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogFilter("WARN")}
                className={logFilter === "WARN" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
              >
                WARN
              </Button>
              <Button 
                variant={logFilter === "INFO" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogFilter("INFO")}
                className={logFilter === "INFO" ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                INFO
              </Button>
              <Button 
                variant={logFilter === "DEBUG" ? "default" : "outline"}
                size="sm"
                onClick={() => setLogFilter("DEBUG")}
                className={logFilter === "DEBUG" ? "bg-gray-500 hover:bg-gray-600" : ""}
              >
                DEBUG
              </Button>
            </div>
            
            <div className="font-mono text-xs max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-white/10">
                    <th className="p-2 text-white/70">Timestamp</th>
                    <th className="p-2 text-white/70">Level</th>
                    <th className="p-2 text-white/70">System</th>
                    <th className="p-2 text-white/70">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="border-b border-white/5">
                      <td className="p-2 text-white/70">{log.timestamp}</td>
                      <td className="p-2">
                        <span 
                          className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            log.level === "ERROR" ? "bg-red-500/20 text-red-400" :
                            log.level === "WARN" ? "bg-yellow-500/20 text-yellow-400" :
                            log.level === "INFO" ? "bg-blue-500/20 text-blue-400" :
                            "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="p-2 text-white/90">{log.system}</td>
                      <td className="p-2 text-white/90">{log.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredLogs.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-white/50">
                  <FileText className="h-12 w-12 mb-2 opacity-30" />
                  <p>No logs match your current filters</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeSeriesChart 
          data={alertFrequencyData} 
          dataKey="value" 
          title="Alert Frequency (per hour)"
          stroke="#FF3A5E"
          fill="#FF3A5E"
          height={250}
          yAxisLabel="Count"
        />
        <TimeSeriesChart 
          data={resolutionTimeData} 
          dataKey="value" 
          title="Resolution Time (minutes)"
          stroke="#00A3FF"
          height={250}
          yAxisLabel="Minutes"
        />
        <TimeSeriesChart 
          data={systemsAffectedData} 
          dataKey="value" 
          title="Systems Affected"
          stroke="#FFB300"
          fill="#FFB300"
          height={250}
          yAxisLabel="Count"
        />
      </div>
      
      <div className="glass-panel p-4">
        <h3 className="text-white text-base mb-3 font-medium flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-honeywell-blue" />
          AI Assistant
        </h3>
        
        <div className="glass-panel-blue p-4">
          <p className="text-sm text-white/90 mb-3">
            Based on the current alert patterns, I've identified a potential correlation between temperature fluctuations in the Engine Assembly line and network latency in zone B. Would you like me to investigate this relationship further?
          </p>
          
          <div className="flex gap-2">
            <Button size="sm" className="bg-honeywell-blue hover:bg-honeywell-blue/80">
              Investigate
            </Button>
            <Button size="sm" variant="outline">
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsLogs;
