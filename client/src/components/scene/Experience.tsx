import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Center, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import defaultPerson from '@assets/person_0_1766404645511.glb?url';
import defaultObject from '@assets/object_0_1766404645511.glb?url';

function Model({ url, isWearable = false }: { url: string; isWearable?: boolean }) {
  const gltf = useLoader(GLTFLoader, url);
  const { scene } = gltf;
  const clone = scene.clone();

  return <primitive object={clone} />;
}

function SceneContent() {
  const { avatarUrl, wearableUrl, rotationVelocity, setAvatarUrl, setWearableUrl } = useStore();

  useEffect(() => {
    if (!avatarUrl && defaultPerson) setAvatarUrl(defaultPerson);
    if (!wearableUrl && defaultObject) setWearableUrl(defaultObject);
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Apply rotation velocity
      // Sensitivity factor can be tweaked
      groupRef.current.rotation.y += rotationVelocity * delta * 2; 
    }
  });

  return (
    <group position={[0, -1, 0]}>
      <Center top>
        <group ref={groupRef}>
          <Suspense fallback={<Html><div className="text-white font-mono text-xs">LOADING AVATAR...</div></Html>}>
            {avatarUrl && <Model url={avatarUrl} />}
          </Suspense>
          
          <Suspense fallback={null}>
            {wearableUrl && (
              <group position={[0, 0, 0]}> 
                <Model url={wearableUrl} isWearable />
              </group>
            )}
          </Suspense>
        </group>
      </Center>
      
      <ContactShadows 
        opacity={0.5} 
        scale={10} 
        blur={1.5} 
        far={10} 
        resolution={256} 
        color="#000000" 
      />
    </group>
  );
}

export default function Experience() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black">
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <fog attach="fog" args={['#101010', 10, 20]} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={1024}
        />
        <spotLight position={[-5, 5, -5]} intensity={0.5} color="#3b82f6" />
        <Environment preset="city" />
        
        <SceneContent />
        
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}
