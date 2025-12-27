import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  Plane, 
  Gauge, 
  Battery, 
  Wifi, 
  Navigation, 
  PlayCircle,
  Pause
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const efficiencyData = generateTimeSeriesData(24, 85, 10);
const temperatureData = generateTimeSeriesData(24, 65, 15);
const batteryData = generateTimeSeriesData(24, 80, 20, -0.5);
const signalData = generateTimeSeriesData(24, 95, 5, -0.1);

// Next-Gen Fighter Jet Model Component
const NextGenFighterModel = () => {
  const jetRef = useRef<THREE.Group>(null);
  const exhaustRef1 = useRef<THREE.Mesh>(null);
  const exhaustRef2 = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (jetRef.current) {
      // Gentle hovering and banking motion
      jetRef.current.position.y = Math.sin(time * 0.5) * 0.2;
      jetRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
      jetRef.current.rotation.y = Math.sin(time * 0.2) * 0.1 + Math.PI / 4;
    }
    
    // Animate the exhaust glow
    if (exhaustRef1.current && exhaustRef1.current.material instanceof THREE.MeshStandardMaterial) {
      exhaustRef1.current.material.emissiveIntensity = 0.8 + Math.sin(time * 10) * 0.2;
    }
    
    if (exhaustRef2.current && exhaustRef2.current.material instanceof THREE.MeshStandardMaterial) {
      exhaustRef2.current.material.emissiveIntensity = 0.8 + Math.sin(time * 10 + 0.5) * 0.2;
    }
  });
  
  return (
    <group ref={jetRef}>
      {/* Main Fuselage - Stealth design */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.8, 4, 8]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#1A1F2C"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Advanced Cockpit - Sleeker design */}
      <mesh position={[0, 0.4, -1.2]} castShadow>
        <sphereGeometry args={[0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#00A3FF"
          emissiveIntensity={0.5}
          transparent={true}
          opacity={0.8}
        />
      </mesh>
      
      {/* Main Wings - Stealth angular design */}
      <mesh position={[0, 0, -0.3]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[5.5, 0.1, 2]} />
        <meshStandardMaterial 
          color="#2C3142" 
          metalness={0.7} 
          roughness={0.3}
          emissive="#2C3142"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Wing details */}
      <mesh position={[2, 0, -0.3]} rotation={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.8]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#1A1F2C"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[-2, 0, -0.3]} rotation={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.8]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.8} 
          roughness={0.2}
          emissive="#1A1F2C"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Vertical Stabilizers (Twin Tails) */}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={`stabilizer-${i}`} position={[x, 0.5, 1.5]} rotation={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.8, 1]} />
          <meshStandardMaterial 
            color="#2C3142" 
            metalness={0.7} 
            roughness={0.3}
            emissive="#2C3142"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Canards (Forward Control Surfaces) */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={`canard-${i}`} position={[x, 0.05, -1.3]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]} castShadow>
          <boxGeometry args={[0.7, 0.05, 0.4]} />
          <meshStandardMaterial 
            color="#1A1F2C" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#1A1F2C"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Advanced Engines */}
      {[-0.6, 0.6].map((x, i) => (
        <group key={`engine-${i}`} position={[x, -0.1, 1.3]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.25, 0.3, 1.2, 16]} />
            <meshStandardMaterial 
              color="#141821" 
              metalness={0.9} 
              roughness={0.1}
              emissive="#141821"
              emissiveIntensity={0.1}
            />
          </mesh>
          
          {/* Advanced Afterburner/Exhaust - Brighter */}
          <mesh 
            ref={i === 0 ? exhaustRef1 : exhaustRef2}
            position={[0, 0, 0.7]} 
            castShadow
          >
            <cylinderGeometry args={[0.3, 0.2, 0.3, 16]} />
            <meshStandardMaterial 
              color="#FF3A5E" 
              emissive="#FF3A5E"
              emissiveIntensity={1}
            />
          </mesh>
          
          {/* Exhaust trail */}
          <mesh position={[0, 0, 1.1]} castShadow>
            <coneGeometry args={[0.15, 0.4, 16]} />
            <meshStandardMaterial 
              color="#FF8C00" 
              emissive="#FF8C00"
              emissiveIntensity={1}
              transparent={true}
              opacity={0.7}
            />
          </mesh>
        </group>
      ))}
      
      {/* Weapons/Hardpoints - More stealth integrated */}
      {[-2, -1, 1, 2].map((x, i) => (
        <mesh key={`weapon-${i}`} position={[x, -0.1, -0.2]} castShadow>
          <boxGeometry args={[0.2, 0.1, 0.8]} />
          <meshStandardMaterial 
            color="#141821" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#141821"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
      
      {/* Sensor Arrays */}
      <mesh position={[0, 0.2, -1.8]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          metalness={0.9} 
          roughness={0.1}
          emissive="#00A3FF"
          emissiveIntensity={0.7}
        />
      </mesh>
      
      {/* Tech details - Running lights */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={`light-${i}`} position={[x, 0.05, -0.3]} castShadow>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#00E676" : "#FF3A5E"} 
            emissive={i % 2 === 0 ? "#00E676" : "#FF3A5E"}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
};

const DronesAircraft = () => {
  const [activeVehicle, setActiveVehicle] = useState<"drone" | "fighter">("drone");
  const [simulating, setSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState("efficiency");
  
  const toggleSimulation = () => {
    setSimulating(!simulating);
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Advanced Aircraft</h1>
        <p className="text-white/60">Next-generation fighter monitoring and control</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel p-4 h-[450px]">
            <Canvas
              shadows
              camera={{ position: [0, 4, 8], fov: 45 }}
            >
              <ambientLight intensity={0.5} />
              <spotLight 
                position={[10, 10, 10]} 
                angle={0.3} 
                penumbra={1} 
                intensity={2} 
                castShadow 
                shadow-mapSize={1024} 
              />
              <pointLight position={[-10, 10, -10]} intensity={1} color="#ffffff" />
              <pointLight position={[0, 5, 5]} intensity={0.8} color="#00A3FF" />
              <pointLight position={[0, -2, 0]} intensity={0.5} color="#FFB300" />
              
              <NextGenFighterModel />
              
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                <planeGeometry args={[20, 20]} />
                <meshStandardMaterial 
                  color="#141821" 
                  emissive="#141821"
                  emissiveIntensity={0.05}
                />
              </mesh>
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Flight Control</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Select Vehicle</label>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={activeVehicle === "drone" ? "default" : "outline"}
                    onClick={() => setActiveVehicle("drone")}
                    className={activeVehicle === "drone" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                  >
                    <Plane className="h-4 w-4 mr-2 rotate-90" />
                    Drone
                  </Button>
                  <Button 
                    variant={activeVehicle === "fighter" ? "default" : "outline"}
                    onClick={() => setActiveVehicle("fighter")}
                    className={activeVehicle === "fighter" ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    Fighter
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">
                  {activeVehicle === "drone" ? "Drone Status" : "Aircraft Status"}
                </h4>
                
                <div className="glass-panel-blue p-3 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Flight Status</span>
                    <span className="text-xs font-medium text-white">{simulating ? "Active" : "Standby"}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">
                      {activeVehicle === "drone" ? "Battery Level" : "Fuel Level"}
                    </span>
                    <span className="text-xs font-medium text-white">
                      {activeVehicle === "drone" ? "82%" : "93%"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-xs text-white/70">Signal Strength</span>
                    <span className="text-xs font-medium text-white">Excellent</span>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={toggleSimulation}
                className={`w-full ${simulating ? "bg-red-500 hover:bg-red-600" : "bg-honeywell-blue hover:bg-honeywell-blue/80"} text-white`}
              >
                {simulating ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Flight
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Start Simulation
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="Flight Status"
              value={simulating ? "Active" : "Standby"}
              variant={simulating ? "success" : "default"}
            />
            
            <StatusCard 
              title="Mission Time"
              value={simulating ? "00:15:42" : "--:--:--"}
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 bg-transparent">
          <TabsTrigger value="efficiency" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Gauge className="h-4 w-4 mr-2" />
            Aerodynamics
          </TabsTrigger>
          <TabsTrigger value="temperature" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Gauge className="h-4 w-4 mr-2" />
            Temperature
          </TabsTrigger>
          <TabsTrigger value="battery" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Battery className="h-4 w-4 mr-2" />
            {activeVehicle === "drone" ? "Battery" : "Fuel"}
          </TabsTrigger>
          <TabsTrigger value="signal" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Wifi className="h-4 w-4 mr-2" />
            Signal
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="efficiency" className="mt-4">
          <TimeSeriesChart 
            data={efficiencyData} 
            dataKey="value" 
            title="Aerodynamic Efficiency (%)"
            stroke="#00A3FF"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
        
        <TabsContent value="temperature" className="mt-4">
          <TimeSeriesChart 
            data={temperatureData} 
            dataKey="value" 
            title="Engine Temperature (°C)"
            stroke="#FF3A5E"
            fill="#FF3A5E"
            height={300}
            yAxisLabel="°C"
          />
        </TabsContent>
        
        <TabsContent value="battery" className="mt-4">
          <TimeSeriesChart 
            data={batteryData} 
            dataKey="value" 
            title={activeVehicle === "drone" ? "Battery Level (%)" : "Fuel Level (%)"}
            stroke="#FFB300"
            fill="#FFB300"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
        
        <TabsContent value="signal" className="mt-4">
          <TimeSeriesChart 
            data={signalData} 
            dataKey="value" 
            title="Signal Strength (%)"
            stroke="#00E676"
            fill="#00E676"
            height={300}
            yAxisLabel="%"
          />
        </TabsContent>
      </Tabs>
      
      <div className="glass-panel p-4">
        <h3 className="text-white text-base mb-3 font-medium flex items-center">
          <Navigation className="h-5 w-5 mr-2 text-honeywell-blue" />
          Flight Path
        </h3>
        
        <div className="aspect-video h-60 bg-honeywell-dark border border-white/5 rounded-lg relative overflow-hidden">
          {/* Simple flight path visualization */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-white/10" style={{ top: `${i * (100 / 12)}%` }}></div>
            ))}
            {Array.from({ length: 13 }).map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-white/10" style={{ left: `${i * (100 / 12)}%` }}></div>
            ))}
          </div>
          
          {/* Flight path line */}
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
            <path 
              d="M10,50 C20,30 40,20 50,50 C60,80 75,60 90,50" 
              fill="none" 
              stroke="#00A3FF" 
              strokeWidth="1" 
              strokeDasharray="4 2"
              className={simulating ? "animate-pulse" : ""}
            />
            <circle cx="10" cy="50" r="2" fill="#00A3FF" />
            <circle cx="90" cy="50" r="2" fill="#FF3A5E" />
            
            {simulating && (
              <circle 
                cx="50" 
                cy="50" 
                r="3" 
                fill="#FFB300" 
                filter="drop-shadow(0 0 3px #FFB300)"
                className="animate-pulse"
              />
            )}
          </svg>
          
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-00A3FF mr-1"></div>
              <span className="text-xs text-white/60">Start</span>
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 rounded-full bg-FF3A5E mr-1"></div>
              <span className="text-xs text-white/60">End</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DronesAircraft;
