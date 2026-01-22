import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const gltf = useLoader(GLTFLoader, url);
  const scene = useMemo(() => {
    if (!gltf) return null;
    const cloned = gltf.scene.clone();
    
    // Center the model in the preview
    const box = new THREE.Box3().setFromObject(cloned);
    const center = box.getCenter(new THREE.Vector3());
    cloned.position.sub(center);
    
    // Fix male avatar inclination in preview
    if (url.includes('default_avatar.glb')) {
      cloned.rotation.x = 0;
    }
    
    return cloned;
  }, [gltf]);

  if (!scene) return null;
  return <primitive object={scene} />;
}

interface WearablePreviewProps {
  url: string;
  isSelected: boolean;
}

export default function WearablePreview({ url, isSelected }: WearablePreviewProps) {
  return (
    <div className={`relative w-full h-32 rounded-lg overflow-hidden border-2 transition-all ${
      isSelected 
        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
        : 'border-white/10 bg-white/5 hover:border-white/20'
    }`}>
      <Canvas 
        camera={{ position: [0, 0, 2.5], fov: 50 }} 
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <Environment preset="apartment" />
        
        <Suspense fallback={null}>
          <Model url={url} />
        </Suspense>
        
        <OrbitControls 
          autoRotate 
          autoRotateSpeed={4}
          enableZoom={false}
          enablePan={false}
        />
      </Canvas>
      
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 rounded-full border-2 border-primary bg-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary" />
          </div>
        </div>
      )}
    </div>
  );
}
