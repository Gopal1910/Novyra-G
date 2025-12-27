import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  Settings, 
  Save, 
  Sliders, 
  Network, 
  Cpu, 
  Shield,
  Power,
  Check,
  AlertTriangle,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import TimeSeriesChart from "@/components/Visualizations/TimeSeriesChart";
import StatusCard from "@/components/StatusCard";
import { toast } from "sonner";

const generateTimeSeriesData = (points = 24, base = 50, variance = 20, trend = 0) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    value: Math.max(0, base + Math.sin(i / 3) * variance + Math.random() * variance / 2 + trend * i)
  }));
};

const latencyData = generateTimeSeriesData(24, 15, 8);
const loadData = generateTimeSeriesData(24, 65, 20, 0.3);
const temperatureData = generateTimeSeriesData(24, 55, 10);
const performanceData = generateTimeSeriesData(24, 85, 10, -0.2);

const FactorySystemModel = () => {
  const groupRef = useRef<THREE.Group>(null);
  const serversRef = useRef<THREE.Mesh[]>([]);
  const connectionsRef = useRef<THREE.Line[]>([]);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.1;
    }
    
    serversRef.current.forEach((server, i) => {
      if (server && server.userData.indicator && server.userData.indicator instanceof THREE.Mesh) {
        const indicator = server.userData.indicator as THREE.Mesh;
        if (indicator.material instanceof THREE.MeshStandardMaterial) {
          indicator.material.emissiveIntensity = 0.5 + Math.sin(time * 2 + i) * 0.5;
        }
      }
    });
    
    connectionsRef.current.forEach((connection, i) => {
      if (connection && connection.material instanceof THREE.LineBasicMaterial) {
        connection.material.opacity = 0.3 + Math.abs(Math.sin(time * 3 + i * 0.5)) * 0.7;
      }
    });
  });
  
  const ServerRack = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    const serverMeshes: THREE.Mesh[] = [];
    
    const rack = (
      <mesh position={position} rotation={rotation as any} castShadow>
        <boxGeometry args={[1.2, 2, 0.8]} />
        <meshStandardMaterial 
          color="#141821" 
          metalness={0.8} 
          roughness={0.2}
        />
        
        {Array.from({ length: 5 }).map((_, i) => {
          const serverRef = useRef<THREE.Mesh>(null);
          const indicatorRef = useRef<THREE.Mesh>(null);
          const serverY = -0.8 + i * 0.35;
          
          return (
            <group key={i} position={[0, serverY, 0]}>
              <mesh 
                ref={serverRef} 
                castShadow 
                onPointerEnter={() => {}}
              >
                <boxGeometry args={[1.1, 0.25, 0.75]} />
                <meshStandardMaterial 
                  color="#1A1F2C" 
                  metalness={0.7} 
                  roughness={0.3}
                />
                
                <mesh position={[0, 0, 0.38]} castShadow>
                  <boxGeometry args={[1, 0.2, 0.02]} />
                  <meshStandardMaterial 
                    color="#2C3142" 
                    metalness={0.6} 
                    roughness={0.4}
                  />
                </mesh>
                
                <mesh 
                  ref={indicatorRef} 
                  position={[0.4, 0, 0.39]} 
                  castShadow
                >
                  <sphereGeometry args={[0.03, 16, 16]} />
                  <meshStandardMaterial 
                    color={Math.random() > 0.2 ? "#00E676" : "#FFB300"} 
                    emissive={Math.random() > 0.2 ? "#00E676" : "#FFB300"}
                    emissiveIntensity={1}
                  />
                </mesh>
              </mesh>
            </group>
          );
        })}
      </mesh>
    );
    
    return rack;
  };
  
  const NetworkNode = ({ position, color = "#00A3FF" }: { position: [number, number, number], color?: string }) => (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.5, 0.2, 0.5]} />
      <meshStandardMaterial 
        color="#2C3142" 
        metalness={0.7} 
        roughness={0.3}
      />
      
      <mesh position={[0.15, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>
      
      <mesh position={[-0.15, 0.12, 0]} castShadow>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={1}
        />
      </mesh>
    </mesh>
  );
  
  const createConnections = () => {
    const connections = [];
    const nodes = [
      [0, 0, 0],      // Central
      [2.5, 0, 2.5],  // Corner
      [-2.5, 0, 2.5], // Corner
      [2.5, 0, -2.5], // Corner
      [-2.5, 0, -2.5] // Corner
    ];
    
    for (let i = 1; i < nodes.length; i++) {
      const start = new THREE.Vector3(...nodes[0]);
      const end = new THREE.Vector3(...nodes[i]);
      
      const points = [start, end];
      const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
      
      connections.push(
        <primitive 
          key={`connection-${i}`}
          object={new THREE.Line(
            lineGeometry,
            new THREE.LineBasicMaterial({ 
              color: "#00A3FF", 
              opacity: 0.5, 
              transparent: true 
            })
          )}
          ref={(ref) => {
            if (ref) connectionsRef.current.push(ref);
          }}
        />
      );
    }
    
    return connections;
  };
  
  return (
    <group ref={groupRef}>
      <NetworkNode position={[0, 0, 0]} color="#00E676" />
      
      <NetworkNode position={[2.5, 0, 2.5]} color="#00A3FF" />
      <NetworkNode position={[-2.5, 0, 2.5]} color="#00A3FF" />
      <NetworkNode position={[2.5, 0, -2.5]} color="#FFB300" />
      <NetworkNode position={[-2.5, 0, -2.5]} color="#00A3FF" />
      
      <ServerRack position={[2.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <ServerRack position={[-2.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <ServerRack position={[0, 0, 2.5]} rotation={[0, Math.PI, 0]} />
      <ServerRack position={[0, 0, -2.5]} rotation={[0, 0, 0]} />
      
      {createConnections()}
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
        <planeGeometry args={[10, 10, 10, 10]} />
        <meshStandardMaterial 
          color="#141821" 
          wireframe={true}
          opacity={0.5}
          transparent={true}
        />
      </mesh>
    </group>
  );
};

const SystemConfigurations = () => {
  const [activeTab, setActiveTab] = useState<"network" | "performance" | "security">("network");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [powerLevel, setPowerLevel] = useState(70);
  const [bandwidth, setBandwidth] = useState(60);
  const [redundancy, setRedundancy] = useState(50);
  const [security, setSecurity] = useState(80);
  
  const startDeploy = () => {
    setCountdown(5);
    
    const interval = setInterval(() => {
      setCountdown(current => {
        if (current === null) return null;
        if (current <= 1) {
          clearInterval(interval);
          toast.success("Configuration changes deployed successfully", {
            description: "All systems operating within normal parameters",
            duration: 5000,
          });
          return null;
        }
        return current - 1;
      });
    }, 1000);
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">System Configurations</h1>
        <p className="text-white/60">Advanced settings and system parameters</p>
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
                position={[5, 8, 5]} 
                angle={0.4} 
                penumbra={1} 
                intensity={1} 
                castShadow 
                shadow-mapSize={1024} 
              />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />
              <pointLight position={[0, 3, 0]} color="#00A3FF" intensity={0.3} />
              
              <FactorySystemModel />
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium flex items-center">
              <Settings className="h-5 w-5 mr-2 text-honeywell-blue" />
              Control Panel
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">Power Allocation</label>
                  <span className="text-sm font-mono text-honeywell-blue">{powerLevel}%</span>
                </div>
                <Slider 
                  value={[powerLevel]} 
                  onValueChange={(value) => setPowerLevel(value[0])}
                  min={10} 
                  max={100} 
                  step={1} 
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">Network Bandwidth</label>
                  <span className="text-sm font-mono text-honeywell-blue">{bandwidth}%</span>
                </div>
                <Slider 
                  value={[bandwidth]} 
                  onValueChange={(value) => setBandwidth(value[0])}
                  min={10} 
                  max={100} 
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">System Redundancy</label>
                  <span className="text-sm font-mono text-honeywell-blue">{redundancy}%</span>
                </div>
                <Slider 
                  value={[redundancy]} 
                  onValueChange={(value) => setRedundancy(value[0])}
                  min={10} 
                  max={100} 
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm text-white/70">Security Level</label>
                  <span className="text-sm font-mono text-honeywell-blue">{security}%</span>
                </div>
                <Slider 
                  value={[security]} 
                  onValueChange={(value) => setSecurity(value[0])}
                  min={10} 
                  max={100} 
                  step={1}
                  className="cursor-pointer"
                />
              </div>
              
              <Button 
                onClick={startDeploy}
                disabled={countdown !== null}
                className="w-full bg-honeywell-blue hover:bg-honeywell-blue/80 text-white relative"
              >
                {countdown !== null ? (
                  <>
                    <span className="animate-pulse">Deploying in {countdown}s</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Deploy Changes
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="System Status"
              value="Online"
              variant="success"
            />
            
            <StatusCard 
              title="Last Updated"
              value="10:42 AM"
              description="Today"
            />
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as "network" | "performance" | "security")}>
        <TabsList className="w-full grid grid-cols-3 bg-transparent">
          <TabsTrigger value="network" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Network className="h-4 w-4 mr-2" />
            Network
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Cpu className="h-4 w-4 mr-2" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="network" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimeSeriesChart 
              data={latencyData} 
              dataKey="value" 
              title="Network Latency (ms)"
              stroke="#00A3FF"
              height={250}
              yAxisLabel="ms"
            />
            <TimeSeriesChart 
              data={loadData} 
              dataKey="value" 
              title="Network Load (%)"
              stroke="#FFB300"
              fill="#FFB300"
              height={250}
              yAxisLabel="%"
            />
          </div>
          
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Network Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Primary Gateway</span>
                  <span className="text-sm font-mono text-white">192.168.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">DNS Servers</span>
                  <span className="text-sm font-mono text-white">8.8.8.8, 1.1.1.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Subnet Mask</span>
                  <span className="text-sm font-mono text-white">255.255.255.0</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Bandwidth Allocation</span>
                  <span className="text-sm font-mono text-white">1 Gbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">QoS Enabled</span>
                  <span className="text-sm font-mono text-green-400">Yes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Packet Loss</span>
                  <span className="text-sm font-mono text-white">0.02%</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TimeSeriesChart 
              data={temperatureData} 
              dataKey="value" 
              title="System Temperature (°C)"
              stroke="#FF3A5E"
              fill="#FF3A5E"
              height={250}
              yAxisLabel="°C"
            />
            <TimeSeriesChart 
              data={performanceData} 
              dataKey="value" 
              title="Performance Metrics (%)"
              stroke="#00E676"
              fill="#00E676"
              height={250}
              yAxisLabel="%"
            />
          </div>
          
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Performance Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">CPU Throttling</span>
                  <span className="text-sm font-mono text-white">Disabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Memory Allocation</span>
                  <span className="text-sm font-mono text-white">16 GB / 32 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Cache Policy</span>
                  <span className="text-sm font-mono text-white">Aggressive</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Cooling Mode</span>
                  <span className="text-sm font-mono text-white">Dynamic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Power Saving</span>
                  <span className="text-sm font-mono text-red-400">Disabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Process Priority</span>
                  <span className="text-sm font-mono text-white">High</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4 space-y-6">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Security Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Firewall Status</span>
                  <span className="text-sm font-mono text-green-400">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Encryption</span>
                  <span className="text-sm font-mono text-white">AES-256</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Authentication</span>
                  <span className="text-sm font-mono text-white">2FA Required</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Access Control</span>
                  <span className="text-sm font-mono text-white">Role-Based</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Last Security Scan</span>
                  <span className="text-sm font-mono text-white">Today, 08:15 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Vulnerabilities</span>
                  <span className="text-sm font-mono text-yellow-400">2 Medium</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Intrusion Detection</span>
                  <span className="text-sm font-mono text-green-400">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/70">Data Backups</span>
                  <span className="text-sm font-mono text-white">Daily, Encrypted</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                <h4 className="text-white text-sm font-medium">Security Recommendations</h4>
              </div>
              
              <div className="space-y-2">
                <div className="glass-panel-blue p-3 flex items-start">
                  <Check className="h-4 w-4 mr-2 mt-0.5 text-green-400" />
                  <div>
                    <h5 className="text-white text-xs font-medium">System Firmware</h5>
                    <p className="text-xs text-white/70">All firmware is up to date</p>
                  </div>
                </div>
                
                <div className="glass-panel-blue p-3 flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-400" />
                  <div>
                    <h5 className="text-white text-xs font-medium">Update Security Certificates</h5>
                    <p className="text-xs text-white/70">2 certificates expiring in 15 days</p>
                  </div>
                </div>
                
                <div className="glass-panel-blue p-3 flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-yellow-400" />
                  <div>
                    <h5 className="text-white text-xs font-medium">Network Perimeter</h5>
                    <p className="text-xs text-white/70">Consider additional scanning for manufacturing subnet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="glass-panel p-4 border-l-4 border-honeywell-blue">
        <h3 className="text-white text-base mb-3 font-medium flex items-center">
          <Power className="h-5 w-5 mr-2 text-honeywell-blue" />
          System Impact Analysis
        </h3>
        
        <p className="text-sm text-white/80 mb-4">
          The current configuration changes will have the following projected impact on system performance:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-panel-blue p-3">
            <h4 className="text-sm font-medium text-white mb-1">Power Usage</h4>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-yellow-400 mr-2" />
              <span className="text-sm text-white/80">+{(powerLevel - 70) > 0 ? (powerLevel - 70) : 0}% Increase</span>
            </div>
          </div>
          
          <div className="glass-panel-blue p-3">
            <h4 className="text-sm font-medium text-white mb-1">Response Time</h4>
            <div className="flex items-center">
              {bandwidth > 60 ? (
                <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
              ) : (
                <TrendingUp className="h-4 w-4 text-yellow-400 mr-2" />
              )}
              <span className="text-sm text-white/80">
                {bandwidth > 60 ? `${((bandwidth - 60) * 0.5).toFixed(1)}% Faster` : 
                                 `${((60 - bandwidth) * 0.5).toFixed(1)}% Slower`}
              </span>
            </div>
          </div>
          
          <div className="glass-panel-blue p-3">
            <h4 className="text-sm font-medium text-white mb-1">Stability</h4>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-sm text-white/80">+{redundancy - 50 > 0 ? (redundancy - 50) * 0.4 : 0}% Improved</span>
            </div>
          </div>
          
          <div className="glass-panel-blue p-3">
            <h4 className="text-sm font-medium text-white mb-1">Risk Factor</h4>
            <div className="flex items-center">
              {security > 80 ? (
                <TrendingUp className="h-4 w-4 text-green-400 mr-2 rotate-180" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-400 mr-2" />
              )}
              <span className="text-sm text-white/80">
                {security > 80 ? `${(security - 80) * 0.4}% Reduced` : 
                               `${(80 - security) * 0.6}% Increased`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfigurations;
