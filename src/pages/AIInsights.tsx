import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Lightbulb,
  Activity,
  Share2,
  MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import StatusCard from "@/components/StatusCard";

const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const energyOptimizationData = generateTimeSeriesData(24, 100, 20, -0.8);
const machineEfficiencyData = generateTimeSeriesData(24, 78, 12, 0.5);
const predictiveMaintData = generateTimeSeriesData(24, 15, 8, -0.3);
const processOptimizationData = generateTimeSeriesData(24, 85, 15, 0.8);

const insightsData = [
  {
    id: 1,
    category: "Energy",
    title: "Power Usage Optimization",
    description: "Machine learning models have identified ways to reduce power consumption by 15% during off-peak manufacturing hours.",
    impact: "High",
    timeframe: "Immediate",
    confidence: 92
  },
  {
    id: 2,
    category: "Maintenance",
    title: "Predictive Bearing Replacement",
    description: "Vibration patterns indicate potential bearing failure in robotic arm joint #3 within the next 72 hours.",
    impact: "Critical",
    timeframe: "72 hours",
    confidence: 89
  },
  {
    id: 3,
    category: "Quality",
    title: "Defect Rate Reduction",
    description: "Adjusting nozzle temperature by 2.5°C can reduce defect rates by 7.3% in the injection molding process.",
    impact: "Medium",
    timeframe: "1 week",
    confidence: 85
  },
  {
    id: 4,
    category: "Inventory",
    title: "Supply Chain Optimization",
    description: "Current ordering patterns suggest potential savings of 12% by adjusting reorder quantities for titanium components.",
    impact: "Medium",
    timeframe: "Next quarter",
    confidence: 76
  },
  {
    id: 5,
    category: "Process",
    title: "Assembly Line Reconfiguration",
    description: "Simulation models show 18% throughput increase by reconfiguring stations 5-8 on the main assembly line.",
    impact: "High",
    timeframe: "1 month",
    confidence: 94
  }
];

const NeuralNetworkVisualization = () => {
  const networkRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const connectionsRef = useRef<THREE.Line[]>([]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    nodesRef.current.forEach((node, i) => {
      if (node) {
        const scale = 1 + Math.sin(time * 2 + i * 0.2) * 0.1;
        node.scale.set(scale, scale, scale);
        
        if (Math.sin(time + i) > 0.7 && node.material instanceof THREE.MeshStandardMaterial) {
          node.material.emissiveIntensity = 2;
        } else if (node.material instanceof THREE.MeshStandardMaterial) {
          node.material.emissiveIntensity = 0.5;
        }
      }
    });
    
    connectionsRef.current.forEach((connection, i) => {
      if (connection && connection.material instanceof THREE.LineBasicMaterial) {
        connection.material.opacity = 0.2 + Math.abs(Math.sin(time * 3 + i * 0.5)) * 0.8;
      }
    });
  });
  
  const createNeuralNetwork = () => {
    const layers = [4, 6, 8, 6, 3];
    const layerSpacing = 1.5;
    const nodes = [];
    const connections = [];
    
    layers.forEach((nodeCount, layerIndex) => {
      const layerX = (layerIndex - (layers.length - 1) / 2) * layerSpacing;
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = nodeCount * 0.15;
        const y = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        let nodeColor;
        if (layerIndex === 0) {
          nodeColor = "#00A3FF";
        } else if (layerIndex === layers.length - 1) {
          nodeColor = "#00E676";
        } else {
          nodeColor = "#FFFFFF";
        }
        
        nodes.push(
          <mesh 
            key={`node-${layerIndex}-${i}`}
            position={[layerX, y, z]} 
            ref={ref => ref && nodesRef.current.push(ref)}
            castShadow
          >
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial 
              color={nodeColor} 
              emissive={nodeColor}
              emissiveIntensity={0.5}
              metalness={0.8} 
              roughness={0.2}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        );
        
        if (layerIndex > 0) {
          const prevLayerNodes = layers[layerIndex - 1];
          for (let j = 0; j < prevLayerNodes; j++) {
            if (Math.random() > 0.3) {
              const prevLayerX = (layerIndex - 1 - (layers.length - 1) / 2) * layerSpacing;
              const prevAngle = (j / prevLayerNodes) * Math.PI * 2;
              const prevRadius = prevLayerNodes * 0.15;
              const prevY = Math.sin(prevAngle) * prevRadius;
              const prevZ = Math.cos(prevAngle) * prevRadius;
              
              const points = [
                new THREE.Vector3(prevLayerX, prevY, prevZ),
                new THREE.Vector3(layerX, y, z)
              ];
              
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
              
              const connectionColor = layerIndex === layers.length - 1 ? "#00E676" : "#00A3FF";
              
              connections.push(
                <primitive 
                  key={`connection-${layerIndex}-${i}-${j}`}
                  object={new THREE.Line(
                    lineGeometry,
                    new THREE.LineBasicMaterial({ 
                      color: connectionColor, 
                      opacity: 0.4, 
                      transparent: true 
                    })
                  )}
                  ref={(ref) => {
                    if (ref) connectionsRef.current.push(ref);
                  }}
                />
              );
            }
          }
        }
      }
    });
    
    return [...connections, ...nodes];
  };
  
  return (
    <group ref={networkRef} position={[0, 0, 0]}>
      {createNeuralNetwork()}
    </group>
  );
};

const AIInsights = () => {
  const [activeTab, setActiveTab] = useState("energy");
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">AI Insights</h1>
        <p className="text-white/60">Machine learning powered analysis and recommendations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel p-4 h-[450px] relative">
            <div className="absolute top-4 left-4 z-10">
              <h3 className="text-white text-base font-medium flex items-center">
                <Brain className="h-5 w-5 mr-2 text-honeywell-blue" />
                Neural Network Visualization
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Live representation of the AI system analyzing factory data
              </p>
            </div>
            
            <Canvas
              shadows
              camera={{ position: [0, 0, 5], fov: 45 }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={0.8} />
              <pointLight position={[-10, -10, -10]} intensity={0.4} />
              
              <NeuralNetworkVisualization />
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">AI System Status</h3>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Model Accuracy</span>
                  <span className="text-sm font-medium text-white">97.3%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-honeywell-blue h-1.5 rounded-full" style={{ width: "97.3%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Training Status</span>
                  <span className="text-sm font-medium text-green-400">Complete</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Data Processing</span>
                  <span className="text-sm font-medium text-white">24.5k events/sec</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className="bg-honeywell-blue h-1.5 rounded-full animate-pulse" style={{ width: "82%" }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="Active Models"
              value="12"
              variant="default"
            />
            
            <StatusCard 
              title="Insights Generated"
              value="28"
              trend="up"
              trendValue="5"
              variant="success"
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 bg-transparent">
          <TabsTrigger value="energy" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Zap className="h-4 w-4 mr-2" />
            Energy
          </TabsTrigger>
          <TabsTrigger value="machine" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Activity className="h-4 w-4 mr-2" />
            Machine Health
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="process" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Share2 className="h-4 w-4 mr-2" />
            Process
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="energy" className="mt-4">
          <TimeSeriesChart 
            data={energyOptimizationData} 
            dataKey="value" 
            title="Energy Optimization (kW)"
            stroke="#00A3FF"
            height={300}
            yAxisLabel="kW"
          />
        </TabsContent>
        
        <TabsContent value="machine" className="mt-4">
          <TimeSeriesChart 
            data={machineEfficiencyData} 
            dataKey="value" 
            title="Machine Efficiency (%)"
            stroke="#00E676"
            fill="#00E676"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
        
        <TabsContent value="maintenance" className="mt-4">
          <TimeSeriesChart 
            data={predictiveMaintData} 
            dataKey="value" 
            title="Predicted Failure Rate (%)"
            stroke="#FF3A5E"
            fill="#FF3A5E"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
        
        <TabsContent value="process" className="mt-4">
          <TimeSeriesChart 
            data={processOptimizationData} 
            dataKey="value" 
            title="Process Efficiency (%)"
            stroke="#FFB300"
            fill="#FFB300"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
      </Tabs>
      
      <div className="glass-panel p-4">
        <h3 className="text-white text-base mb-4 font-medium flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-honeywell-blue" />
          AI Recommended Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insightsData.map(insight => (
            <div 
              key={insight.id} 
              className={`glass-panel-blue p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                selectedInsight === insight.id ? "border-2 border-honeywell-blue" : ""
              }`}
              onClick={() => setSelectedInsight(insight.id === selectedInsight ? null : insight.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    insight.category === "Energy" ? "bg-blue-500/20 text-blue-400" :
                    insight.category === "Maintenance" ? "bg-yellow-500/20 text-yellow-400" :
                    insight.category === "Quality" ? "bg-purple-500/20 text-purple-400" :
                    insight.category === "Inventory" ? "bg-green-500/20 text-green-400" :
                    "bg-orange-500/20 text-orange-400"
                  }`}>
                    {insight.category}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-white/70 mr-1">Confidence:</span>
                  <span className={`text-xs ${
                    insight.confidence > 90 ? "text-green-400" :
                    insight.confidence > 80 ? "text-blue-400" :
                    "text-yellow-400"
                  }`}>
                    {insight.confidence}%
                  </span>
                </div>
              </div>
              
              <h4 className="text-white text-sm font-medium mt-2">{insight.title}</h4>
              
              <p className="text-white/70 text-xs mt-2 line-clamp-2">
                {insight.description}
              </p>
              
              {selectedInsight === insight.id && (
                <div className="mt-3 space-y-2 animate-fade-in">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Impact:</span>
                    <span className={`${
                      insight.impact === "High" || insight.impact === "Critical" ? "text-green-400" :
                      insight.impact === "Medium" ? "text-blue-400" :
                      "text-white/70"
                    }`}>
                      {insight.impact}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-white/70">Timeframe:</span>
                    <span className="text-white">{insight.timeframe}</span>
                  </div>
                  
                  <Button size="sm" className="w-full mt-2 bg-honeywell-blue hover:bg-honeywell-blue/80 text-xs">
                    Apply Recommendation
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="glass-panel p-4 border-l-4 border-honeywell-blue">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white text-base mb-1 font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-honeywell-blue" />
              AI Assistant
            </h3>
            <p className="text-sm text-white/80">
              I've analyzed recent temperature data from the Engine Assembly line and detected an anomaly pattern that could indicate a potential issue with the cooling system. Would you like me to run a simulation to determine if this will impact production in the next 48 hours?
            </p>
          </div>
          
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-honeywell-blue/70 to-honeywell-blue flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button className="bg-honeywell-blue hover:bg-honeywell-blue/80">
            Run Simulation
          </Button>
          <Button variant="outline">
            Ignore
          </Button>
          <Button variant="outline">
            Ask for More Info
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
