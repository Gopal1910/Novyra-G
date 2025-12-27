
import { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// Placeholder for a real robotic arm model
const RoboticArm = () => {
  const armRef = useRef<THREE.Group>(null);
  const jointRef1 = useRef<THREE.Mesh>(null);
  const jointRef2 = useRef<THREE.Mesh>(null);
  const endEffectorRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    if (jointRef1.current) {
      jointRef1.current.rotation.z = THREE.MathUtils.lerp(
        -Math.PI / 4,
        Math.PI / 4,
        (Math.sin(time * 0.5) + 1) / 2
      );
    }
    
    if (jointRef2.current) {
      jointRef2.current.rotation.z = THREE.MathUtils.lerp(
        -Math.PI / 6,
        Math.PI / 3,
        (Math.sin(time * 0.7 + 0.5) + 1) / 2
      );
    }
    
    if (endEffectorRef.current) {
      endEffectorRef.current.rotation.z = THREE.MathUtils.lerp(
        -Math.PI / 8,
        Math.PI / 8,
        (Math.sin(time * 1.0 + 1.0) + 1) / 2
      );
    }
  });
  
  return (
    <group ref={armRef} position={[0, -2, 0]}>
      {/* Base */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[1.5, 2, 1, 32]} />
        <meshStandardMaterial 
          color="#2C3142" 
          metalness={0.6} 
          roughness={0.3} 
          emissive="#2C3142"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Base Platform */}
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[1, 1, 0.2, 32]} />
        <meshStandardMaterial 
          color="#141821" 
          metalness={0.7} 
          roughness={0.2} 
          emissive="#141821"
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Main Arm Segment */}
      <group position={[0, 0.7, 0]}>
        <mesh castShadow ref={jointRef1}>
          <boxGeometry args={[0.5, 3, 0.5]} />
          <meshStandardMaterial 
            color="#1A1F2C" 
            metalness={0.6} 
            roughness={0.3} 
            emissive="#1A1F2C"
            emissiveIntensity={0.1}
          />
          
          {/* Joint 1 */}
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshStandardMaterial 
              color="#00A3FF" 
              metalness={0.8} 
              roughness={0.1} 
              emissive="#00A3FF"
              emissiveIntensity={0.8}
            />
          </mesh>
          
          {/* Second Arm Segment */}
          <group position={[0, 3, 0]}>
            <mesh castShadow ref={jointRef2}>
              <boxGeometry args={[0.4, 2.5, 0.4]} />
              <meshStandardMaterial 
                color="#1A1F2C" 
                metalness={0.6} 
                roughness={0.3} 
                emissive="#1A1F2C"
                emissiveIntensity={0.1}
              />
              
              {/* Joint 2 */}
              <mesh position={[0, 1.4, 0]} castShadow>
                <sphereGeometry args={[0.35, 16, 16]} />
                <meshStandardMaterial 
                  color="#00A3FF" 
                  metalness={0.8} 
                  roughness={0.1} 
                  emissive="#00A3FF"
                  emissiveIntensity={0.8}
                />
              </mesh>
              
              {/* End Effector */}
              <group position={[0, 2.5, 0]}>
                <mesh castShadow ref={endEffectorRef}>
                  <boxGeometry args={[0.3, 0.8, 0.3]} />
                  <meshStandardMaterial 
                    color="#1A1F2C" 
                    metalness={0.6} 
                    roughness={0.3} 
                    emissive="#1A1F2C"
                    emissiveIntensity={0.1}
                  />
                  
                  {/* Gripper */}
                  <group position={[0, 0.5, 0]}>
                    <mesh position={[0.25, 0, 0]} castShadow>
                      <boxGeometry args={[0.3, 0.3, 0.1]} />
                      <meshStandardMaterial 
                        color="#FFB300" 
                        emissive="#FFB300" 
                        emissiveIntensity={0.8}
                        metalness={0.8} 
                        roughness={0.1} 
                      />
                    </mesh>
                    <mesh position={[-0.25, 0, 0]} castShadow>
                      <boxGeometry args={[0.3, 0.3, 0.1]} />
                      <meshStandardMaterial 
                        color="#FFB300" 
                        emissive="#FFB300" 
                        emissiveIntensity={0.8}
                        metalness={0.8} 
                        roughness={0.1} 
                      />
                    </mesh>
                  </group>
                </mesh>
              </group>
            </mesh>
          </group>
        </mesh>
      </group>
      
      {/* Floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#141821" 
          metalness={0.4} 
          roughness={0.5} 
          emissive="#141821"
          emissiveIntensity={0.05}
        />
      </mesh>
      
      {/* Add some decorative elements */}
      {[-3, 3].map((x, i) => (
        <mesh key={i} position={[x, 0, -2]} castShadow>
          <boxGeometry args={[0.5, 1.5, 0.5]} />
          <meshStandardMaterial 
            color="#2C3142" 
            metalness={0.6} 
            roughness={0.3} 
            emissive="#2C3142"
            emissiveIntensity={0.1}
          />
          <mesh position={[0, 0.9, 0]} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#00E676" : "#FF3A5E"} 
              emissive={i % 2 === 0 ? "#00E676" : "#FF3A5E"} 
              emissiveIntensity={1}
            />
          </mesh>
        </mesh>
      ))}
    </group>
  );
};

interface RoboticArmModelProps {
  height?: string;
}

const RoboticArmModel = ({ height = "500px" }: RoboticArmModelProps) => {
  return (
    <div style={{ height, width: '100%' }} className="glass-panel">
      <Canvas
        shadows
        camera={{ position: [8, 8, 8], fov: 50 }}
      >
        <ambientLight intensity={0.5} /> {/* Increased from 0.3 */}
        <spotLight 
          position={[10, 15, 10]} 
          angle={0.3} 
          penumbra={1} 
          intensity={1.5} /* Increased from 1 */
          castShadow 
          shadow-mapSize={1024} 
        />
        <pointLight position={[-10, 10, -10]} intensity={0.8} /> {/* Increased from 0.5 */}
        <pointLight position={[5, 5, 5]} color="#ffffff" intensity={0.7} /> {/* Added new light */}
        <pointLight position={[-5, 0, 5]} color="#00A3FF" intensity={0.5} /> {/* Added new light */}
        
        <RoboticArm />
        
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      </Canvas>
    </div>
  );
};

export default RoboticArmModel;
