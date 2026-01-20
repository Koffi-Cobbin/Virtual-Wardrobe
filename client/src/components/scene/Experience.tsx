import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { Environment, Center, ContactShadows, OrbitControls, Html, TransformControls } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function Model({ 
  id, 
  url, 
  onLoad 
}: { 
  id: string; 
  url: string; 
  onLoad?: (scene: THREE.Group) => void 
}) {
  const gltf = useLoader(GLTFLoader, url);
  const selectedObjectId = useStore((state) => state.selectedObjectId);
  const setSelectedObjectId = useStore((state) => state.setSelectedObjectId);
  
  const scene = useMemo(() => {
    if (!gltf) return null;
    const clonedScene = gltf.scene.clone();
    onLoad?.(clonedScene);
    return clonedScene;
  }, [gltf]);

  if (!scene) return null;

  const isSelected = selectedObjectId === id;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        setSelectedObjectId(id);
      }}
    >
      <primitive object={scene} />
      {isSelected && (
        <mesh scale={1.1}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.1} />
        </mesh>
      )}
    </group>
  );
}

function SceneContent({ setControlsEnabled }: { setControlsEnabled: (val: boolean) => void }) {
  const avatarUrl = useStore((state) => state.avatarUrl);
  const wearableUrl = useStore((state) => state.wearableUrl);
  const rotationVelocity = useStore((state) => state.rotationVelocity);
  const selectedObjectId = useStore((state) => state.selectedObjectId);
  const setSelectedObjectId = useStore((state) => state.setSelectedObjectId);
  const wearablePosition = useStore((state) => state.wearablePosition);
  const setWearablePosition = useStore((state) => state.setWearablePosition);
  const shouldMerge = useStore((state) => state.shouldMerge);
  const setShouldMerge = useStore((state) => state.setShouldMerge);

  const avatarGroupRef = useRef<THREE.Group>(null);
  const wearableGroupRef = useRef<THREE.Group>(null);
  const mergedGroupRef = useRef<THREE.Group>(null);
  const avatarSceneRef = useRef<THREE.Group | null>(null);
  const wearableSceneRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (avatarGroupRef.current && !selectedObjectId) {
      avatarGroupRef.current.rotation.y += rotationVelocity * delta * 2.5;
    }
  });

  const handleAvatarLoad = (scene: THREE.Group) => {
    avatarSceneRef.current = scene;
  };

  const handleWearableLoad = (scene: THREE.Group) => {
    wearableSceneRef.current = scene;
  };

  useEffect(() => {
    if (shouldMerge && avatarSceneRef.current && wearableSceneRef.current && avatarGroupRef.current) {
      try {
        const geometries: THREE.BufferGeometry[] = [];
        const materials: THREE.Material[] = [];

        avatarSceneRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            geometries.push(child.geometry);
            if (child.material && !materials.includes(child.material)) {
              materials.push(child.material);
            }
          }
        });

        wearableSceneRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            geometries.push(child.geometry);
            if (child.material && !materials.includes(child.material)) {
              materials.push(child.material);
            }
          }
        });

        if (geometries.length > 0) {
          const combined = mergeGeometries(geometries);
          const material = materials.length > 0 ? materials[0] : new THREE.MeshPhongMaterial({ color: 0x888888 });
          const mergedMesh = new THREE.Mesh(combined, material);

          avatarGroupRef.current.visible = false;
          if (wearableGroupRef.current) {
            wearableGroupRef.current.visible = false;
          }

          if (mergedGroupRef.current) {
            mergedGroupRef.current.clear();
          } else {
            mergedGroupRef.current = new THREE.Group();
            avatarGroupRef.current.parent?.add(mergedGroupRef.current);
          }

          mergedGroupRef.current.add(mergedMesh);
          mergedGroupRef.current.visible = true;
        }

        setShouldMerge(false);
      } catch (error) {
        console.error('Error merging models:', error);
        setShouldMerge(false);
      }
    }
  }, [shouldMerge]);

  return (
    <group 
      position={[0, -1, 0]} 
      onPointerMissed={() => setSelectedObjectId(null)}
    >
      <Center top>
        <group ref={avatarGroupRef}>
          <Suspense fallback={<Html center><div className="text-primary font-display font-bold animate-pulse text-lg">INITIALIZING AVATAR...</div></Html>}>
            {avatarUrl && <Model id="avatar" url={avatarUrl} onLoad={handleAvatarLoad} />}
          </Suspense>
        </group>

        <group 
          ref={wearableGroupRef}
          position={[wearablePosition.x, wearablePosition.y, wearablePosition.z]}
        >
          <Suspense fallback={null}>
            {wearableUrl && (
              <Model 
                id="wearable"
                url={wearableUrl}
                onLoad={handleWearableLoad}
              />
            )}
          </Suspense>
        </group>

        {selectedObjectId === 'wearable' && wearableGroupRef.current && (
          <TransformControls 
            object={wearableGroupRef.current} 
            mode="translate"
            onMouseDown={() => setControlsEnabled(false)}
            onMouseUp={() => setControlsEnabled(true)}
            onChange={() => {
              if (wearableGroupRef.current) {
                const pos = wearableGroupRef.current.position;
                setWearablePosition({ x: pos.x, y: pos.y, z: pos.z });
              }
            }}
          />
        )}
        
        {selectedObjectId === 'avatar' && avatarGroupRef.current && (
          <TransformControls 
            object={avatarGroupRef.current} 
            mode="rotate"
            onMouseDown={() => setControlsEnabled(false)}
            onMouseUp={() => setControlsEnabled(true)}
          />
        )}

        <group ref={mergedGroupRef} />
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
  const orbitControlsRef = useRef<any>(null);
  const shouldResetCamera = useStore((state) => state.shouldResetCamera);
  const [controlsEnabled, setControlsEnabled] = useState(true);

  useEffect(() => {
    if (shouldResetCamera && orbitControlsRef.current) {
      orbitControlsRef.current.reset();
      useStore.setState({ shouldResetCamera: false });
    }
  }, [shouldResetCamera]);

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
        
        <SceneContent setControlsEnabled={setControlsEnabled} />
        
        <OrbitControls 
          ref={orbitControlsRef}
          enabled={controlsEnabled}
          enableRotate={true}
          enablePan={false} 
          minPolarAngle={0} 
          maxPolarAngle={Math.PI}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}
