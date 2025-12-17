import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSimulationStore } from '../../stores/simulationStore';
import * as THREE from 'three';

export const BoilerModel: React.FC = () => {
  const { temperature, waterLevel, anomalies } = useSimulationStore();
  
  // Refs for animation
  const waterRef = useRef<THREE.Mesh>(null);
  const heaterRef = useRef<THREE.Mesh>(null);
  const drumRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    // 1. Water Level Animation
    if (waterRef.current) {
        // Scale Y based on water level (0 to 1). 
        // Water is inside the drum.
        // If drum is horizontal cylinder: scale Y is water HEIGHT if cylinder is rotated?
        // Let's assume drum is horizontal cylinder along X axis.
        // Actually, simulating water level in a horizontal cylinder is complex visually (segment of circle).
        // Simplification: Drum is transparent, inside is a "water" mesh that is a box or cylinder clipping.
        // Let's use a Box that moves up/down inside the cylinder to act as water surface.
        
        const targetY = (waterLevel / 100) * 2 - 1; // Map 0-100 to -1 to 1 (approx local coords)
        // Lerp position
        waterRef.current.position.y = THREE.MathUtils.lerp(waterRef.current.position.y, targetY - 0.5, delta * 2);
        // Note: scaling a box to fill the bottom half is better.
        // Let's keep it simple: Water is a blue Box covering the bottom part.
        // Position Y varies, Scale Y varies.
        // Map 0 -> pos -1, scale 0.
        // Map 100 -> pos 0, scale 2 (full height).
        const pct = waterLevel / 100;
        waterRef.current.scale.y = pct * 2;
        waterRef.current.position.y = -1 + (pct * 2) / 2;
    }

    // 2. Temperature Glow
    if (heaterRef.current) {
        // Base color -> Red as temp goes up.
        // Max expected temp ~400.
        // 100 -> Start glowing.
        const glowIntensity = Math.max(0, (temperature - 100) / 300);
        const material = heaterRef.current.material as THREE.MeshStandardMaterial;
        material.emissive.setRGB(glowIntensity, glowIntensity * 0.2, 0); // Red-Orange glow
        material.emissiveIntensity = glowIntensity * 2;
    }

    // 3. Overpressure / Danger State (Drum Pulse)
    if (drumRef.current) {
         const material = drumRef.current.material as THREE.MeshPhysicalMaterial;
         if (anomalies.overpressureRisk || temperature > 200) {
             const pulse = Math.sin(state.clock.elapsedTime * 5) * 0.2 + 0.2;
             material.emissive.setRGB(pulse, 0, 0);
         } else {
             material.emissive.setRGB(0,0,0);
         }
    }
  });

  return (
    <group>
      {/* Base Stand */}
      <mesh position={[0, -1.5, 0]}>
         <boxGeometry args={[3, 0.5, 1.5]} />
         <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Main Drum (Glass/Current View) */}
      <group position={[0, 0.2, 0]}>
          {/* Outer Shell - Translucent */}
          <mesh ref={drumRef} rotation={[0, 0, Math.PI / 2]}> 
             <cylinderGeometry args={[1.1, 1.1, 4, 32]} />
             <meshPhysicalMaterial 
               color="#ffffff" 
               metalness={0.1} 
               roughness={0.1} 
               transmission={0.6} // Glass-like
               transparent 
               opacity={0.3} 
               thickness={0.5}
             />
          </mesh>
          
          {/* Inner Water */}
          <group>
             {/* Clipping logic is hard in basic three.js without stencil. 
                 We will just put a slightly smaller box inside that intersects. 
                 Ideally, a smaller horizontal cylinder intersected by a plane? 
                 Let's stick to the Box approximation for simplicity as planned. 
              */}
              <mesh ref={waterRef} position={[0, -0.5, 0]} scale={[3.8, 1, 1]}>
                  {/* Reuse width of drum (approx 4) */}
                  <boxGeometry args={[3.8, 1, 1.8]} /> 
                  <meshStandardMaterial 
                    color="#00aaff" 
                    transparent 
                    opacity={0.6}
                    roughness={0.2}
                  />
              </mesh>
          </group>
      </group>

      {/* Heating Pipes (The coil inside) */}
      <group position={[0, 0, 0]}>
         {/* Simple representation: A series of torus loops or a helical tube */}
         <mesh ref={heaterRef} rotation={[0, 0, Math.PI / 2]}>
             {/* Using a knot or complex shape to look like coils */}
             <torusKnotGeometry args={[0.6, 0.1, 64, 8, 2, 3]} /> 
             <meshStandardMaterial color="#555555" />
         </mesh>
      </group>

      {/* Input Pipe (Fuel/Feed) */}
      <mesh position={[-2.2, -0.5, 0.5]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 1]} />
          <meshStandardMaterial color="#444" />
      </mesh>
      
      {/* Steam Output Pipe (Top) */}
      <mesh position={[1, 1.5, 0]}>
         <cylinderGeometry args={[0.15, 0.15, 1]} />
         <meshStandardMaterial color="#666" />
      </mesh>
      
      {/* Particle System for Leak would go here contextually, or outside */}
      {anomalies.leak && (
         <LeakEffect />
      )}
    </group>
  );
};

// Simple particle effect for leak
const LeakEffect: React.FC = () => {
    // Visualizes water leaking from the bottom
    const particles = useRef<THREE.Group>(null);
    useFrame((_state) => {
        if(particles.current) {
            particles.current.children.forEach((child) => {
                 child.position.y -= 0.1;
                 if (child.position.y < -3) {
                     child.position.y = -1;
                     child.position.x = (Math.random() - 0.5) * 2;
                 }
            });
        }
    });

    return (
        <group ref={particles} position={[0, -1.2, 0]}> 
            {Array.from({ length: 10 }).map((_, i) => (
                <mesh key={i} position={[(Math.random() - 0.5) * 2, -1 - Math.random(), 0]}>
                    <sphereGeometry args={[0.05]} />
                    <meshBasicMaterial color="cyan" />
                </mesh>
            ))}
        </group>
    )
}
