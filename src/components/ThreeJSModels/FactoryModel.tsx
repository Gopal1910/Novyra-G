
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Placeholder for a real factory model
const FactoryScene = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Factory Base */}
      <mesh position={[0, -1, 0]} receiveShadow>
        <boxGeometry args={[8, 0.5, 8]} />
        <meshStandardMaterial 
          color="#1A1F2C" 
          metalness={0.6} 
          roughness={0.3} 
          emissive="#1A1F2C" 
          emissiveIntensity={0.05} 
        />
      </mesh>
      
      {/* Factory Building */}
      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[6, 2, 6]} />
        <meshStandardMaterial 
          color="#2C3142" 
          metalness={0.5} 
          roughness={0.3} 
          emissive="#2C3142" 
          emissiveIntensity={0.08} 
        />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 2.5, 0]} castShadow>
        <boxGeometry args={[6.5, 0.5, 6.5]} />
        <meshStandardMaterial 
          color="#141821" 
          metalness={0.6} 
          roughness={0.2} 
          emissive="#141821" 
          emissiveIntensity={0.1} 
        />
      </mesh>
      
      {/* Control Tower */}
      <mesh position={[0, 4, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 3, 16]} />
        <meshStandardMaterial 
          color="#2C3142" 
          metalness={0.6} 
          roughness={0.2} 
          emissive="#2C3142" 
          emissiveIntensity={0.1} 
        />
      </mesh>
      
      {/* Tower Top */}
      <mesh position={[0, 6, 0]} castShadow>
        <torusGeometry args={[1.2, 0.2, 16, 32]} />
        <meshStandardMaterial 
          color="#00A3FF" 
          emissive="#00A3FF" 
          emissiveIntensity={0.8} 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Decorative Elements */}
      {[-2, 2].map((x) => (
        [-2, 2].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0, z]} castShadow>
            <boxGeometry args={[0.8, 2, 0.8]} />
            <meshStandardMaterial 
              color="#141821" 
              metalness={0.7} 
              roughness={0.2} 
              emissive="#141821" 
              emissiveIntensity={0.1} 
            />
          </mesh>
        ))
      ))}
      
      {/* Emissive Elements - Made brighter */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 3]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial 
            color={i % 2 === 0 ? "#00A3FF" : "#FFB300"} 
            emissive={i % 2 === 0 ? "#00A3FF" : "#FFB300"} 
            emissiveIntensity={1.2} 
          />
        </mesh>
      ))}
    </group>
  );
};

interface FactoryModelProps {
  height?: string;
}

const FactoryModel = ({ height = "400px" }: FactoryModelProps) => {
  return (
    <div style={{ height, width: '100%' }} className="glass-panel">
      <Canvas
        shadows
        camera={{ position: [-10, 10, 10], fov: 35 }}
      >
        <ambientLight intensity={0.4} /> {/* Increased from 0.2 */}
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1.5} /* Increased from 1 */
          castShadow 
          shadow-mapSize={1024} 
        />
        <pointLight position={[-10, 10, -10]} intensity={0.8} /> {/* Increased from 0.5 */}
        <pointLight position={[0, 5, 0]} color="#00A3FF" intensity={1} /> {/* Increased from 0.5 */}
        <pointLight position={[5, 0, 5]} color="#ffffff" intensity={0.6} /> {/* Added new light */}
        
        <FactoryScene />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default FactoryModel;
