import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Microscope, 
  Layers, 
  Cpu, 
  CheckCircle, 
  AlertTriangle, 
  BarChart3, 
  ThermometerSun
} from "lucide-react";
import StatusCard from "@/components/StatusCard";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// Fake data for charts
const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const stressData = generateTimeSeriesData(24, 65, 25);
const temperatureData = generateTimeSeriesData(24, 80, 15, 0.1);
const faultRateData = generateTimeSeriesData(24, 2, 3, -0.05);

// 3D Testing Chamber Model
const TestingChamber = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Base Platform */}
      <mesh position={[0, -1.5, 0]} receiveShadow>
        <cylinderGeometry args={[4, 4, 0.5, 32]} />
        <meshStandardMaterial 
          color="#2C3142" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Testing Chamber */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[3, 3.5, 3, 32]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.7} 
          roughness={0.3}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* Scanning Beam */}
      <mesh position={[0, 0, 0]} castShadow>
        <torusGeometry args={[2, 0.1, 16, 32]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          emissive="#00A3FF"
          emissiveIntensity={1.5}
          metalness={1} 
          roughness={0.3}
        />
      </mesh>
      
      {/* Component Being Tested */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <boxGeometry args={[1, 0.5, 1.5]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          metalness={0.9} 
          roughness={0.1} 
          emissive="#FFFFFF"
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Sensor Arrays */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshStandardMaterial 
            color="#141821" 
            metalness={0.8} 
            roughness={0.2} 
          />
          <mesh position={[0, 1, 0]}>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial 
              color={i === 1 ? "#00E676" : "#FFB300"} 
              emissive={i === 1 ? "#00E676" : "#FFB300"}
              emissiveIntensity={1}
            />
          </mesh>
        </mesh>
      ))}
      
      {/* Rotating Scanner */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial 
          color="#FF3A5E" 
          emissive="#FF3A5E"
          emissiveIntensity={1}
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

const DigitalTesting = () => {
  const [activeTab, setActiveTab] = useState("stress");
  const [testStatus, setTestStatus] = useState<"idle" | "running" | "complete">("idle");
  
  const startTest = () => {
    setTestStatus("running");
    setTimeout(() => setTestStatus("complete"), 3000);
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Digital Testing Laboratory</h1>
        <p className="text-white/60">Virtual quality assurance and component stress testing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel p-4 h-[450px]">
            <Canvas
              shadows
              camera={{ position: [0, 2, 8], fov: 45 }}
            >
              <ambientLight intensity={0.4} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.3} 
                penumbra={1} 
                intensity={1.5} 
                castShadow 
                shadow-mapSize={1024} 
              />
              <pointLight position={[-10, 10, -10]} intensity={0.8} color="#00A3FF" />
              <pointLight position={[5, -5, 5]} intensity={0.5} color="#FFB300" />
              
              <TestingChamber />
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Testing Controls</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Component Type</label>
                <select className="w-full bg-honeywell-panel border border-white/10 text-white rounded px-3 py-2">
                  <option>Engine Component</option>
                  <option>Circuit Board</option>
                  <option>Drone Propeller</option>
                  <option>Sensor Array</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70">Test Protocol</label>
                <select className="w-full bg-honeywell-panel border border-white/10 text-white rounded px-3 py-2">
                  <option>Stress Tolerance</option>
                  <option>Heat Resistance</option>
                  <option>EMI Compatibility</option>
                  <option>Vibration Analysis</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70">Duration</label>
                <select className="w-full bg-honeywell-panel border border-white/10 text-white rounded px-3 py-2">
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>4 Hours</option>
                  <option>24 Hours</option>
                </select>
              </div>
              
              <Button 
                onClick={startTest}
                disabled={testStatus === "running"}
                className="w-full bg-honeywell-blue hover:bg-honeywell-blue/80 text-white"
              >
                {testStatus === "idle" && <Microscope className="h-4 w-4 mr-2" />}
                {testStatus === "running" && <span className="animate-pulse">Testing...</span>}
                {testStatus === "complete" && <CheckCircle className="h-4 w-4 mr-2" />}
                {testStatus === "idle" && "Start Digital Test"}
                {testStatus === "running" && "Running Test"}
                {testStatus === "complete" && "Test Complete"}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="Test Status"
              value={testStatus === "idle" ? "Ready" : testStatus === "running" ? "Running" : "Complete"}
              variant={testStatus === "complete" ? "success" : "default"}
            />
            
            <StatusCard 
              title="AI Analysis"
              value={testStatus === "complete" ? "Passed" : "Pending"}
              variant={testStatus === "complete" ? "success" : "default"}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 bg-transparent">
          <TabsTrigger value="stress" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Layers className="h-4 w-4 mr-2" />
            Stress Response
          </TabsTrigger>
          <TabsTrigger value="temperature" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <ThermometerSun className="h-4 w-4 mr-2" />
            Temperature
          </TabsTrigger>
          <TabsTrigger value="fault" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Fault Rate
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stress" className="mt-4">
          <TimeSeriesChart 
            data={stressData} 
            dataKey="value" 
            title="Material Stress Response (MPa)"
            stroke="#00A3FF"
            height={300}
            yAxisLabel="MPa"
          />
        </TabsContent>
        
        <TabsContent value="temperature" className="mt-4">
          <TimeSeriesChart 
            data={temperatureData} 
            dataKey="value" 
            title="Component Temperature (°C)"
            stroke="#FF3A5E"
            fill="#FF3A5E"
            height={300}
            yAxisLabel="°C"
          />
        </TabsContent>
        
        <TabsContent value="fault" className="mt-4">
          <TimeSeriesChart 
            data={faultRateData} 
            dataKey="value" 
            title="Fault Detection Rate (%)"
            stroke="#FFB300"
            fill="#FFB300"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
      </Tabs>
      
      <div className="glass-panel p-4">
        <h3 className="text-white text-base mb-3 font-medium flex items-center">
          <Cpu className="h-5 w-5 mr-2 text-honeywell-blue" />
          AI Diagnostic Report
        </h3>
        
        {testStatus === "complete" ? (
          <div className="space-y-4">
            <p className="text-sm text-white/80">
              Component analysis complete. The tested engine component shows excellent stress tolerance within operational parameters.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-panel-blue p-3">
                <h4 className="text-sm font-medium text-white mb-1">Structural Integrity</h4>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-white/80">98.7% Optimal</span>
                </div>
              </div>
              
              <div className="glass-panel-blue p-3">
                <h4 className="text-sm font-medium text-white mb-1">Heat Resistance</h4>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-white/80">Within Tolerance</span>
                </div>
              </div>
              
              <div className="glass-panel-blue p-3">
                <h4 className="text-sm font-medium text-white mb-1">Estimated Lifespan</h4>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-sm text-white/80">5,200 Flight Hours</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-24 text-white/60">
            {testStatus === "running" ? (
              <p className="flex items-center">
                <span className="animate-pulse mr-2">●</span>
                Analyzing component...
              </p>
            ) : (
              <p>Start a test to generate a diagnostic report</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DigitalTesting;
