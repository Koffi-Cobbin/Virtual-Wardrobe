import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Center, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function Model({ url }: { url: string }) {
  // Use useMemo to avoid reloading the loader every time
  const gltf = useLoader(GLTFLoader, url);
  
  // Clone the scene to allow multiple instances and avoid mutation issues
  const scene = useMemo(() => {
    if (!gltf) return null;
    return gltf.scene.clone();
  }, [gltf]);

  if (!scene) return null;
  return <primitive object={scene} />;
}

function SceneContent() {
  const avatarUrl = useStore((state) => state.avatarUrl);
  const wearableUrl = useStore((state) => state.wearableUrl);
  const rotationVelocity = useStore((state) => state.rotationVelocity);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationVelocity * delta * 2.5; 
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Center top>
        <group ref={groupRef}>
          <Suspense fallback={<Html center><div className="text-primary font-display font-bold animate-pulse text-lg">INITIALIZING AVATAR...</div></Html>}>
            {avatarUrl && <Model url={avatarUrl} />}
          </Suspense>
          
          <Suspense fallback={null}>
            {wearableUrl && <Model url={wearableUrl} />}
          </Suspense>
        </group>
      </Center>
      
      <ContactShadows 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={10} 
        resolution={512} 
        color="#000000" 
      />
    </group>
  );
}

export default function Experience() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true }}>
        <fog attach="fog" args={['#050505', 8, 20]} />
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, 10, -10]} color="#f59e0b" intensity={0.5} />
        <Environment preset="city" />
        
        <SceneContent />
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.8}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
