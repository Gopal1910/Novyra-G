
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  Gauge, 
  Wrench, 
  Thermometer, 
  Timer, 
  CheckCircle, 
  AlertTriangle,
  Zap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import StatusCard from "@/components/StatusCard";

// Fake data for charts
const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const powerData = generateTimeSeriesData(24, 250, 50);
const calibrationData = generateTimeSeriesData(24, 99, 1);
const temperatureData = generateTimeSeriesData(24, 65, 10);

// Engine 3D Model Component
const JetEngine = () => {
  const engineRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (engineRef.current) {
      engineRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });
  
  return (
    <group ref={engineRef}>
      {/* External Casing */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[2, 2, 6, 32]} />
        <meshStandardMaterial 
          color="#2C3142" 
          metalness={0.9} 
          roughness={0.2}
          emissive="#FFFFFF"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Front Fan */}
      <mesh castShadow position={[0, 0, -3]}>
        <torusGeometry args={[1.5, 0.2, 16, 32]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#FFFFFF"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Fan Blades */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.8;
        const y = Math.sin(angle) * 0.8;
        
        return (
          <mesh key={i} castShadow position={[x, y, -3]}>
            <boxGeometry args={[0.1, 0.8, 0.05]} />
            <meshStandardMaterial 
              color="#FFFFFF" 
              metalness={1} 
              roughness={0.1}
              emissive="#FFFFFF"
              emissiveIntensity={0.2} 
            />
          </mesh>
        );
      })}
      
      {/* Turbine Section */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.8, 1.4, 2, 32]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.8} 
          roughness={0.2}
          wireframe={false}
        />
      </mesh>
      
      {/* Afterburner */}
      <mesh castShadow position={[0, 0, 3]}>
        <cylinderGeometry args={[1.4, 1.2, 1, 32]} />
        <meshStandardMaterial 
          color="#141821" 
          metalness={1} 
          roughness={0.1} 
          emissive="#FF3A5E"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* Exhaust */}
      <mesh castShadow position={[0, 0, 4]}>
        <cylinderGeometry args={[1.2, 0.8, 2, 32]} />
        <meshStandardMaterial 
          color="#FF3A5E" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#FF3A5E"
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.7}
        />
      </mesh>
      
      {/* Engine Mounts */}
      {[-1.8, 1.8].map((y, i) => (
        <mesh key={i} castShadow position={[0, y, 0]}>
          <boxGeometry args={[0.3, 0.8, 2]} />
          <meshStandardMaterial 
            color="#141821" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
      ))}
      
      {/* Fuel Lines */}
      <mesh castShadow position={[0, 2, 0]}>
        <torusGeometry args={[0.2, 0.05, 16, 32]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          emissive="#00A3FF"
          emissiveIntensity={1}
          metalness={0.9} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Indicator Lights */}
      {[-2, 0, 2].map((z, i) => (
        <mesh key={i} position={[0, 2.3, z]} castShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            color={i === 1 ? "#00E676" : "#FFB300"} 
            emissive={i === 1 ? "#00E676" : "#FFB300"}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
};

const EngineAssembly = () => {
  const [section, setSection] = useState<"compressor" | "turbine" | "combustor">("turbine");
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Engine Assembly</h1>
        <p className="text-white/60">Jet engine production and quality monitoring</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel p-4 h-[450px]">
            <Canvas
              shadows
              camera={{ position: [0, 5, 10], fov: 45 }}
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
              <pointLight position={[0, 0, 5]} intensity={0.5} color="#FF3A5E" />
              
              <JetEngine />
              
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial color="#141821" />
              </mesh>
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Production Panel</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Select Engine Section</label>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={section === "compressor" ? "default" : "outline"}
                    onClick={() => setSection("compressor")}
                    className={section === "compressor" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                  >
                    Compressor
                  </Button>
                  <Button 
                    variant={section === "turbine" ? "default" : "outline"}
                    onClick={() => setSection("turbine")}
                    className={section === "turbine" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                  >
                    Turbine
                  </Button>
                  <Button 
                    variant={section === "combustor" ? "default" : "outline"}
                    onClick={() => setSection("combustor")}
                    className={section === "combustor" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                  >
                    Combustor
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">
                  {section === "compressor" && "Compressor Status"}
                  {section === "turbine" && "Turbine Status"}
                  {section === "combustor" && "Combustor Status"}
                </h4>
                
                <div className="glass-panel-blue p-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Assembly Progress</span>
                    <span className="text-xs font-medium text-white">78%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5">
                    <div className="bg-honeywell-blue h-1.5 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Quality Check</span>
                    <span className="text-xs font-medium text-green-400">Passed</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Components Fitted</span>
                    <span className="text-xs font-medium text-white">35/42</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="Production Line"
              value="Active"
              variant="success"
            />
            
            <StatusCard 
              title="Daily Output"
              value="7 Units"
              trend="up"
              trendValue="2 units"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TimeSeriesChart 
          data={powerData} 
          dataKey="value" 
          title="Power Consumption (kW)"
          stroke="#00A3FF"
          height={250}
          yAxisLabel="kW"
        />
        <TimeSeriesChart 
          data={calibrationData} 
          dataKey="value" 
          title="Motor Calibration (%)"
          stroke="#00E676"
          fill="#00E676"
          height={250}
          yAxisLabel="%"
        />
        <TimeSeriesChart 
          data={temperatureData} 
          dataKey="value" 
          title="Cooling Efficiency (°C)"
          stroke="#FF3A5E"
          fill="#FF3A5E"
          height={250}
          yAxisLabel="°C"
        />
      </div>
      
      <div className="glass-panel p-4 border-l-4 border-honeywell-blue">
        <h3 className="text-white text-base mb-3 font-medium flex items-center">
          <Zap className="h-5 w-5 mr-2 text-honeywell-blue" />
          AI Optimization Assistant
        </h3>
        
        <div className="space-y-4">
          <p className="text-sm text-white/80">
            Based on current production metrics, the AI has identified the following optimization opportunities:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel-blue p-3">
              <h4 className="text-sm font-medium text-white mb-1">Turbine Assembly</h4>
              <p className="text-xs text-white/80">Reduce blade spacing by 0.3mm to improve aerodynamic efficiency by 2.7%</p>
            </div>
            
            <div className="glass-panel-blue p-3">
              <h4 className="text-sm font-medium text-white mb-1">Cooling System</h4>
              <p className="text-xs text-white/80">Increase coolant flow rate to maintain optimal thermal balance during peak operation</p>
            </div>
            
            <div className="glass-panel-blue p-3">
              <h4 className="text-sm font-medium text-white mb-1">Production Queue</h4>
              <p className="text-xs text-white/80">Current production rate is 5% above target - consider allocating resources to maintenance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineAssembly;
