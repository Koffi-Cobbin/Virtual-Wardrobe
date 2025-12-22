import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Center, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Assets
import defaultPerson from '@assets/person_0_1766404645511.glb?url';
import defaultObject from '@assets/object_0_1766404645511.glb?url';

function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  
  // Clone the scene to allow multiple instances and avoid mutation issues
  const scene = gltf.scene.clone();

  return <primitive object={scene} />;
}

function SceneContent() {
  const { avatarUrl, wearableUrl, rotationVelocity, setAvatarUrl, setWearableUrl } = useStore();

  useEffect(() => {
    // Force set defaults if nothing is loaded
    if (!avatarUrl) setAvatarUrl(defaultPerson);
    if (!wearableUrl) setWearableUrl(defaultObject);
  }, [avatarUrl, wearableUrl, setAvatarUrl, setWearableUrl]);

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
          <Suspense fallback={<Html><div className="text-white font-mono text-xs whitespace-nowrap">INITIALIZING...</div></Html>}>
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
    <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 40 }} gl={{ antialias: true }}>
        <fog attach="fog" args={['#0a0a0a', 8, 20]} />
        <ambientLight intensity={0.7} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1.5} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={1} />
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
