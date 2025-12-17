import React, { Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Environment, PerspectiveCamera, Grid } from '@react-three/drei';
import { BoilerModel } from './BoilerModel';
import { useSimulationStore } from '../../stores/simulationStore';

export const MainScene: React.FC = () => {
  const { anomalies } = useSimulationStore();

  // Physics Loop
  // We can attach it to a component inside Canvas so it runs on useFrame
  
  return (
    <div className="absolute inset-0 bg-gray-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[5, 2, 8]} fov={50} />
        
        {/* Physics ticker */}
        <PhysicsTicker />

        {/* Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={100} castShadow />
        <spotLight 
            position={[-10, 10, 5]} 
            angle={0.3} 
            penumbra={1} 
            intensity={200} 
            castShadow 
            color={anomalies.overpressureRisk ? "red" : "white"} 
        />

        {/* Environment */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Grid infiniteGrid sectionColor="#06b6d4" cellColor="#1c1c1c" sectionSize={3} cellSize={1} fadeDistance={30} position={[0,-2,0]} />
        <Environment preset="city" />

        {/* Objects */}
        <Suspense fallback={null}>
            <BoilerModel />
        </Suspense>

        <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
};

const PhysicsTicker = () => {
    const { updatePhysics } = useSimulationStore();
    
    useFrame((_state, delta) => {
        updatePhysics(delta);
    });

    return null;
}
