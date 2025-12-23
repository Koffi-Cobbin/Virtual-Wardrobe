import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, Center, ContactShadows, OrbitControls, Html } from '@react-three/drei';
import { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '@/store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

function Model({ url, draggable = false, onDragStart, onDragMove, onDragEnd }: { url: string; draggable?: boolean; onDragStart?: () => void; onDragMove?: (delta: THREE.Vector3) => void; onDragEnd?: () => void }) {
  const gltf = useLoader(GLTFLoader, url);
  const meshRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const setIsDraggingGlobal = useStore((state) => state.setIsDragging);
  const dragPoint = useRef(new THREE.Vector3());
  const previousDragPoint = useRef(new THREE.Vector3());
  const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const raycaster = useRef(new THREE.Raycaster());
  
  const scene = useMemo(() => {
    if (!gltf) return null;
    return gltf.scene.clone();
  }, [gltf]);

  if (!scene) return null;

  return (
    <group
      ref={meshRef}
      onPointerDown={(e) => {
        if (!draggable) return;
        e.stopPropagation();
        setIsDragging(true);
        setIsDraggingGlobal(true);
        onDragStart?.();
        
        // Set up a plane parallel to camera for better dragging
        const camera = e.camera;
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        planeRef.current.setFromNormalAndCoplanarPoint(
          direction,
          e.point
        );
        
        dragPoint.current.copy(e.point);
        previousDragPoint.current.copy(e.point);
      }}
      onPointerMove={(e) => {
        if (!isDragging || !draggable) return;
        e.stopPropagation();
        
        // Project pointer onto the drag plane
        raycaster.current.setFromCamera(
          new THREE.Vector2(
            (e.pointer.x),
            (e.pointer.y)
          ),
          e.camera
        );
        
        const intersection = new THREE.Vector3();
        raycaster.current.ray.intersectPlane(planeRef.current, intersection);
        
        if (intersection) {
          dragPoint.current.copy(intersection);
          const delta = new THREE.Vector3().subVectors(dragPoint.current, previousDragPoint.current);
          onDragMove?.(delta);
          previousDragPoint.current.copy(dragPoint.current);
        }
      }}
      onPointerUp={(e) => {
        if (!draggable) return;
        e.stopPropagation();
        setIsDragging(false);
        setIsDraggingGlobal(false);
        onDragEnd?.();
      }}
      onPointerLeave={() => {
        if (isDragging) {
          setIsDragging(false);
          setIsDraggingGlobal(false);
          onDragEnd?.();
        }
      }}
    >
      <primitive object={scene} />
    </group>
  );
}

function SceneContent() {
  const avatarUrl = useStore((state) => state.avatarUrl);
  const wearableUrl = useStore((state) => state.wearableUrl);
  const rotationVelocity = useStore((state) => state.rotationVelocity);
  const isDragging = useStore((state) => state.isDragging);
  const wearablePosition = useStore((state) => state.wearablePosition);
  const setWearablePosition = useStore((state) => state.setWearablePosition);
  const shouldMerge = useStore((state) => state.shouldMerge);
  const setShouldMerge = useStore((state) => state.setShouldMerge);

  const avatarGroupRef = useRef<THREE.Group>(null);
  const wearableGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (avatarGroupRef.current && !isDragging) {
      avatarGroupRef.current.rotation.y += rotationVelocity * delta * 2.5;
    }
  });

  // Merge meshes when requested
  useEffect(() => {
    if (shouldMerge && avatarGroupRef.current && wearableGroupRef.current) {
      const avatarGeometries: THREE.BufferGeometry[] = [];
      const avatarMaterials: THREE.Material[] = [];

      // Collect all geometries from avatar
      avatarGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            avatarGeometries.push(child.geometry);
            if (child.material) {
              const mat = Array.isArray(child.material) ? child.material[0] : child.material;
              if (!avatarMaterials.includes(mat)) {
                avatarMaterials.push(mat);
              }
            }
          }
        }
      });

      // Collect all geometries from wearable
      const wearableGeometries: THREE.BufferGeometry[] = [];
      wearableGroupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            wearableGeometries.push(child.geometry);
            if (child.material) {
              const mat = Array.isArray(child.material) ? child.material[0] : child.material;
              if (!avatarMaterials.includes(mat)) {
                avatarMaterials.push(mat);
              }
            }
          }
        }
      });

      // Merge all geometries
      if (avatarGeometries.length > 0 && wearableGeometries.length > 0) {
        const geometries = [...avatarGeometries, ...wearableGeometries];
        
        const combined = mergeGeometries(geometries);
        if (combined) {
          // Create a new mesh with the merged geometry
          const mergedMesh = new THREE.Mesh(
            combined,
            avatarMaterials.length > 0 ? avatarMaterials[0] : new THREE.MeshPhongMaterial({ color: 0x888888 })
          );
          
          // Hide original meshes
          avatarGroupRef.current.visible = false;
          wearableGroupRef.current.visible = false;
          
          // Add merged mesh to scene
          if (avatarGroupRef.current.parent) {
            mergedMesh.position.copy(avatarGroupRef.current.position);
            avatarGroupRef.current.parent.add(mergedMesh);
            mergedMesh.name = 'mergedModel';
          }
        }
      }

      setShouldMerge(false);
    }
  }, [shouldMerge]);

  return (
    <group position={[0, -1, 0]}>
      <Center top>
        <group ref={avatarGroupRef}>
          <Suspense fallback={<Html center><div className="text-primary font-display font-bold animate-pulse text-lg">INITIALIZING AVATAR...</div></Html>}>
            {avatarUrl && <Model url={avatarUrl} draggable={true} />}
          </Suspense>
        </group>

        <group 
          ref={wearableGroupRef}
          position={[wearablePosition.x, wearablePosition.y, wearablePosition.z]}
        >
          <Suspense fallback={null}>
            {wearableUrl && (
              <Model 
                url={wearableUrl}
                draggable={true}
                onDragMove={(delta) => {
                  setWearablePosition({
                    x: wearablePosition.x + delta.x,
                    y: wearablePosition.y + delta.y,
                    z: wearablePosition.z + delta.z,
                  });
                }}
              />
            )}
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
  const orbitControlsRef = useRef<any>(null);
  const shouldResetCamera = useStore((state) => state.shouldResetCamera);
  const isDragging = useStore((state) => state.isDragging);

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
        
        <SceneContent />
        
        <OrbitControls 
          ref={orbitControlsRef}
          enablePan={false} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 1.8}
          enableZoom={true}
          minDistance={3}
          maxDistance={10}
          enabled={!isDragging}
        />
      </Canvas>
    </div>
  );
}