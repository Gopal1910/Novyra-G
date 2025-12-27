
import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { 
  Package, 
  Search, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Truck,
  CircleOff
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

const consumptionData = generateTimeSeriesData(24, 45, 15);
const restockingData = generateTimeSeriesData(24, 60, 30);
const forecastData = generateTimeSeriesData(24, 55, 10, 1);

// Sample inventory data
const inventoryItems = [
  { id: 1, name: "Carbon Fiber Sheets", category: "Materials", stock: 124, critical: false, reorder: 50 },
  { id: 2, name: "Aircraft Grade Aluminum", category: "Materials", stock: 78, critical: false, reorder: 40 },
  { id: 3, name: "Hydraulic Actuators", category: "Components", stock: 32, critical: false, reorder: 20 },
  { id: 4, name: "Engine Control Units", category: "Electronics", stock: 15, critical: true, reorder: 20 },
  { id: 5, name: "Drone Camera Assemblies", category: "Electronics", stock: 43, critical: false, reorder: 25 },
  { id: 6, name: "Aircraft Bolts (Titanium)", category: "Fasteners", stock: 542, critical: false, reorder: 200 },
  { id: 7, name: "Jet Fuel Injectors", category: "Engine Parts", stock: 18, critical: true, reorder: 30 },
  { id: 8, name: "Circuit Board Assemblies", category: "Electronics", stock: 64, critical: false, reorder: 30 },
  { id: 9, name: "Sensor Arrays", category: "Electronics", stock: 28, critical: false, reorder: 15 },
  { id: 10, name: "Flight Control Software", category: "Digital", stock: 5, critical: true, reorder: 10 },
];

// Warehouse 3D Model Component
const WarehouseModel = () => {
  const warehouseRef = useRef<THREE.Group>(null);
  const robotRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (robotRef.current) {
      // Move robot along the shelves
      const time = clock.getElapsedTime();
      robotRef.current.position.x = Math.sin(time * 0.5) * 4;
      robotRef.current.rotation.y = Math.atan2(Math.cos(time * 0.5), 0);
      
      // Occasionally raise/lower the arm
      if (Math.sin(time * 0.2) > 0.8) {
        robotRef.current.position.y = 0.5 + Math.sin(time * 2) * 0.3;
      } else {
        robotRef.current.position.y = 0.5;
      }
    }
  });
  
  // Function to create a shelf unit
  const ShelfUnit = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number], rotation?: [number, number, number] }) => {
    const hasItems = Math.random() > 0.3;
    const shelfColor = hasItems ? "#FFB300" : "#2C3142";
    
    return (
      <group position={position} rotation={rotation as any}>
        {/* Shelf structure */}
        <mesh castShadow>
          <boxGeometry args={[1.5, 2, 0.5]} />
          <meshStandardMaterial 
            color="#141821" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Shelf levels */}
        {[0.5, 0, -0.5].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} castShadow>
            <boxGeometry args={[1.4, 0.1, 0.45]} />
            <meshStandardMaterial 
              color={shelfColor}
              emissive={shelfColor}
              emissiveIntensity={0.3}
              metalness={0.5} 
              roughness={0.5}
            />
          </mesh>
        ))}
        
        {/* Items on shelves */}
        {hasItems && (
          <group>
            <mesh position={[-0.3, 0.3, 0]} castShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#1A1F2C" metalness={0.6} roughness={0.4} />
            </mesh>
            <mesh position={[0.3, -0.2, 0]} castShadow>
              <boxGeometry args={[0.4, 0.2, 0.3]} />
              <meshStandardMaterial color="#1A1F2C" metalness={0.6} roughness={0.4} />
            </mesh>
          </group>
        )}
      </group>
    );
  };
  
  return (
    <group ref={warehouseRef}>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#141821" 
          metalness={0.5} 
          roughness={0.5}
        />
      </mesh>
      
      {/* Warehouse Shelves */}
      {Array.from({ length: 6 }).map((_, i) => (
        <ShelfUnit key={`shelf-left-${i}`} position={[-5, 0, -4 + i * 1.8]} rotation={[0, Math.PI / 2, 0]} />
      ))}
      
      {Array.from({ length: 6 }).map((_, i) => (
        <ShelfUnit key={`shelf-right-${i}`} position={[5, 0, -4 + i * 1.8]} rotation={[0, -Math.PI / 2, 0]} />
      ))}
      
      {Array.from({ length: 6 }).map((_, i) => (
        <ShelfUnit key={`shelf-front-${i}`} position={[-4 + i * 1.8, 0, -5]} />
      ))}
      
      {Array.from({ length: 6 }).map((_, i) => (
        <ShelfUnit key={`shelf-back-${i}`} position={[-4 + i * 1.8, 0, 5]} rotation={[0, Math.PI, 0]} />
      ))}
      
      {/* Robot on track */}
      <mesh ref={robotRef} position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          emissive="#00A3FF"
          emissiveIntensity={0.5}
          metalness={0.9} 
          roughness={0.1}
        />
        
        {/* Robot arm */}
        <mesh position={[0, 0.5, 0.4]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#2C3142" metalness={0.8} roughness={0.2} />
          
          {/* Gripper */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.4, 0.2, 0.2]} />
            <meshStandardMaterial color="#2C3142" metalness={0.8} roughness={0.2} />
          </mesh>
        </mesh>
        
        {/* Robot tracks */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[1, 0.2, 1]} />
          <meshStandardMaterial color="#141821" metalness={0.7} roughness={0.3} />
        </mesh>
      </mesh>
      
      {/* Robot tracks */}
      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[12, 0.1, 0.2]} />
        <meshStandardMaterial color="#2C3142" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Central Lighting */}
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#FFFFFF" />
    </group>
  );
};

const Inventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("consumption");
  
  // Filter inventory items
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories
  const categories = Array.from(new Set(inventoryItems.map(item => item.category)));
  
  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Inventory Management</h1>
        <p className="text-white/60">Real-time tracking and optimization of factory inventory</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="glass-panel p-4 h-[450px]">
            <Canvas
              shadows
              camera={{ position: [10, 10, 10], fov: 45 }}
            >
              <ambientLight intensity={0.4} />
              <spotLight 
                position={[0, 10, 0]} 
                angle={0.6} 
                penumbra={1} 
                intensity={1} 
                castShadow 
                shadow-mapSize={1024} 
              />
              <pointLight position={[-10, 10, -10]} intensity={0.5} />
              <pointLight position={[0, 5, 0]} color="#00A3FF" intensity={0.3} />
              
              <WarehouseModel />
              
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            </Canvas>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="glass-panel p-4">
            <h3 className="text-white text-base mb-4 font-medium">Inventory Search</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-white/50" />
                <input 
                  type="text" 
                  placeholder="Search items..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-honeywell-panel border border-white/10 text-white rounded pl-9 pr-3 py-2"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-white/70">Filter by Category</label>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                  >
                    All
                  </Button>
                  
                  {categories.map(category => (
                    <Button 
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={selectedCategory === category ? "bg-honeywell-blue hover:bg-honeywell-blue/80" : ""}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatusCard 
              title="Total Items"
              value={inventoryItems.length.toString()}
            />
            
            <StatusCard 
              title="Critical Stock"
              value={inventoryItems.filter(item => item.critical).length.toString()}
              variant="warning"
            />
          </div>
        </div>
      </div>
      
      <div className="glass-panel p-4 overflow-hidden">
        <h3 className="text-white text-base mb-4 font-medium">Inventory Items</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-4 text-sm font-medium text-white/70">Item</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-white/70">Category</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-white/70">Stock</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-white/70">Status</th>
                <th className="text-left py-2 px-4 text-sm font-medium text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-sm text-white">{item.name}</td>
                  <td className="py-3 px-4 text-sm text-white/70">{item.category}</td>
                  <td className="py-3 px-4 text-sm text-white">{item.stock} units</td>
                  <td className="py-3 px-4">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs ${
                        item.stock < item.reorder 
                          ? "bg-red-500/20 text-red-400" 
                          : item.stock < item.reorder * 1.5 
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {item.stock < item.reorder 
                        ? "Low Stock" 
                        : item.stock < item.reorder * 1.5
                        ? "Moderate"
                        : "Optimal"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Truck className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/60">
                    <CircleOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No items found matching your search criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3 bg-transparent">
          <TabsTrigger value="consumption" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <BarChart3 className="h-4 w-4 mr-2" />
            Consumption
          </TabsTrigger>
          <TabsTrigger value="restocking" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <Truck className="h-4 w-4 mr-2" />
            Restocking
          </TabsTrigger>
          <TabsTrigger value="forecast" className="data-[state=active]:bg-honeywell-blue/20 data-[state=active]:text-white">
            <TrendingUp className="h-4 w-4 mr-2" />
            Forecast
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="consumption" className="mt-4">
          <TimeSeriesChart 
            data={consumptionData} 
            dataKey="value" 
            title="Daily Consumption Rate (units)"
            stroke="#00A3FF"
            height={300}
            yAxisLabel="Units"
          />
        </TabsContent>
        
        <TabsContent value="restocking" className="mt-4">
          <TimeSeriesChart 
            data={restockingData} 
            dataKey="value" 
            title="Restocking Timeline (units)"
            stroke="#00E676"
            fill="#00E676"
            height={300}
            yAxisLabel="Units"
          />
        </TabsContent>
        
        <TabsContent value="forecast" className="mt-4">
          <TimeSeriesChart 
            data={forecastData} 
            dataKey="value" 
            title="Demand Forecast (units)"
            stroke="#FFB300"
            fill="#FFB300"
            height={300}
            yAxisLabel="Units"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Inventory;
