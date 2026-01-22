import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Html, TransformControls } from '@react-three/drei';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useStore, type LoadedWearable } from '@/store';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { toast } from 'sonner';

function Model({ 
  id, 
  url, 
  onLoad 
}: { 
  id: string; 
  url: string; 
  onLoad?: (scene: THREE.Group) => void 
}) {
  const [modelScene, setModelScene] = useState<THREE.Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const selectedObjectId = useStore((state) => state.selectedObjectId);
  const setSelectedObjectId = useStore((state) => state.setSelectedObjectId);
  
  // Load model using GLTFLoader only
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        try {
          const scene = gltf.scene.clone();
          
          // Ensure shadows are enabled
          scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // Center the model
          const box = new THREE.Box3().setFromObject(scene);
          const center = box.getCenter(new THREE.Vector3());
          scene.position.sub(center);
          
          // Fix male avatar inclination
          if (url.includes('default_avatar.glb')) {
            scene.rotation.x = 0;
          }
          
          setModelScene(scene);
          onLoad?.(scene);
          setIsLoading(false);
        } catch (err) {
          console.error('Error processing GLTF:', err);
          setError('Failed to process model file');
          setIsLoading(false);
        }
      },
      undefined,
      (err) => {
        console.error('Error loading GLTF:', err);
        setError('Failed to load model file');
        setIsLoading(false);
      }
    );
    
    // Cleanup
    return () => {
      if (modelScene) {
        modelScene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry?.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach(m => m.dispose());
            } else {
              child.material?.dispose();
            }
          }
        });
      }
    };
  }, [url]);

  if (isLoading) {
    return (
      <Html center>
        <div className="text-primary font-display font-bold animate-pulse text-sm">
          LOADING {id.toUpperCase()}...
        </div>
      </Html>
    );
  }

  if (error) {
    return (
      <Html center>
        <div className="text-red-500 font-display font-bold text-sm">
          ERROR: {error}
        </div>
      </Html>
    );
  }

  if (!modelScene) return null;

  const isSelected = selectedObjectId === id;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        setSelectedObjectId(id);
      }}
    >
      <primitive object={modelScene} />
      {isSelected && (
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
}

function WearableInstance({ 
  wearable,
  onTransformChange 
}: { 
  wearable: LoadedWearable;
  onTransformChange: (position: THREE.Vector3, rotation: THREE.Euler) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const sceneRef = useRef<THREE.Group | null>(null);
  const selectedObjectId = useStore((state) => state.selectedObjectId);

  const handleLoad = (scene: THREE.Group) => {
    sceneRef.current = scene;
  };

  // Apply stored position and rotation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(
        wearable.position.x,
        wearable.position.y,
        wearable.position.z
      );
      groupRef.current.rotation.set(
        wearable.rotation.x,
        wearable.rotation.y,
        wearable.rotation.z
      );
    }
  }, [wearable.position, wearable.rotation]);

  if (!wearable.isVisible) return null;

  return (
    <group 
      ref={groupRef}
      position={[wearable.position.x, wearable.position.y, wearable.position.z]}
      rotation={[wearable.rotation.x, wearable.rotation.y, wearable.rotation.z]}
    >
      <Suspense fallback={null}>
        <Model 
          id={wearable.id}
          url={wearable.url}
          onLoad={handleLoad}
        />
      </Suspense>
    </group>
  );
}

function SceneContent({ setControlsEnabled }: { setControlsEnabled: (val: boolean) => void }) {
  const avatarUrl = useStore((state) => state.avatarUrl);
  const loadedWearables = useStore((state) => state.loadedWearables);
  const rotationVelocity = useStore((state) => state.rotationVelocity);
  const selectedObjectId = useStore((state) => state.selectedObjectId);
  const setSelectedObjectId = useStore((state) => state.setSelectedObjectId);
  const updateWearablePosition = useStore((state) => state.updateWearablePosition);
  const updateWearableRotation = useStore((state) => state.updateWearableRotation);
  const shouldMerge = useStore((state) => state.shouldMerge);
  const setShouldMerge = useStore((state) => state.setShouldMerge);
  const setIsMerged = useStore((state) => state.setIsMerged);
  const isMerged = useStore((state) => state.isMerged);

  const avatarGroupRef = useRef<THREE.Group>(null);
  const wearableGroupsRef = useRef<Map<string, THREE.Group>>(new Map());
  const mergedGroupRef = useRef<THREE.Group>(null);
  const avatarSceneRef = useRef<THREE.Group | null>(null);
  const wearableScenesRef = useRef<Map<string, THREE.Group>>(new Map());

  useFrame((state, delta) => {
    if (avatarGroupRef.current && !selectedObjectId) {
      avatarGroupRef.current.rotation.y += rotationVelocity * delta * 2.5;
    }
  });

  const handleAvatarLoad = (scene: THREE.Group) => {
    avatarSceneRef.current = scene;
  };

  const handleWearableTransformChange = (id: string, position: THREE.Vector3, rotation: THREE.Euler) => {
    updateWearablePosition(id, { x: position.x, y: position.y, z: position.z });
    updateWearableRotation(id, { x: rotation.x, y: rotation.y, z: rotation.z });
  };

  // Merge geometries
  useEffect(() => {
    if (shouldMerge && avatarSceneRef.current && avatarGroupRef.current) {
      try {
        const geometries: THREE.BufferGeometry[] = [];
        const visibleWearables = Array.from(loadedWearables.values()).filter(w => w.isVisible);
        
        if (visibleWearables.length === 0) {
          toast.error("No wearables to merge", {
            description: "Load at least one wearable"
          });
          setShouldMerge(false);
          return;
        }

        avatarGroupRef.current.updateMatrixWorld(true);
        
        // Update all wearable groups
        wearableGroupsRef.current.forEach(group => group.updateMatrixWorld(true));

        const processObject = (obj: THREE.Object3D) => {
          obj.traverse((child) => {
            if (child instanceof THREE.Mesh && child.geometry) {
              let geom = child.geometry.clone();
              
              child.updateMatrixWorld(true);
              geom.applyMatrix4(child.matrixWorld);

              // Ensure required attributes exist
              if (!geom.attributes.uv) {
                const count = geom.attributes.position.count;
                geom.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(count * 2), 2));
              }

              if (!geom.attributes.normal) {
                geom.computeVertexNormals();
              }

              // Remove non-standard attributes
              const standardAttributes = ['position', 'normal', 'uv', 'color'];
              Object.keys(geom.attributes).forEach(key => {
                if (!standardAttributes.includes(key)) {
                  geom.deleteAttribute(key);
                }
              });

              geom.morphAttributes = {};
              if (geom.groups) geom.groups = [];

              geometries.push(geom);
            }
          });
        };

        // Process avatar
        processObject(avatarGroupRef.current);
        
        // Process all visible wearables
        visibleWearables.forEach(wearable => {
          const group = wearableGroupsRef.current.get(wearable.id);
          if (group) {
            processObject(group);
          }
        });

        if (geometries.length > 0) {
          const combined = mergeGeometries(geometries, true);
          const material = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc,
            roughness: 0.3,
            metalness: 0.2,
            side: THREE.DoubleSide
          });
          const mergedMesh = new THREE.Mesh(combined, material);
          mergedMesh.castShadow = true;
          mergedMesh.receiveShadow = true;

          avatarGroupRef.current.visible = false;
          wearableGroupsRef.current.forEach(group => group.visible = false);

          if (mergedGroupRef.current) {
            mergedGroupRef.current.clear();
          } else {
            mergedGroupRef.current = new THREE.Group();
            avatarGroupRef.current.parent?.add(mergedGroupRef.current);
          }

          mergedGroupRef.current.add(mergedMesh);
          mergedGroupRef.current.visible = true;
          setIsMerged(true);
          
          toast.success("Models merged successfully", {
            description: `Combined avatar with ${visibleWearables.length} wearable(s)`
          });
        }

        setShouldMerge(false);
      } catch (error) {
        console.error('Error merging models:', error);
        setShouldMerge(false);
        toast.error("Merge failed", {
          description: "Technical error during geometry combination."
        });
      }
    }
  }, [shouldMerge]);

  // Handle unmerge
  useEffect(() => {
    if (!isMerged && avatarGroupRef.current) {
      avatarGroupRef.current.visible = true;
      wearableGroupsRef.current.forEach(group => group.visible = true);
      if (mergedGroupRef.current) {
        mergedGroupRef.current.visible = false;
        mergedGroupRef.current.clear();
      }
    }
  }, [isMerged]);

  const wearablesArray = Array.from(loadedWearables.values());
  const selectedWearable = selectedObjectId ? loadedWearables.get(selectedObjectId) : null;
  const selectedWearableGroup = selectedObjectId ? wearableGroupsRef.current.get(selectedObjectId) : null;

  return (
    <group position={[0, 0, 0]}>
      <group ref={avatarGroupRef} position={[0, 0, 0]}>
        <Suspense fallback={null}>
          {avatarUrl && <Model id="avatar" url={avatarUrl} onLoad={handleAvatarLoad} />}
        </Suspense>
      </group>

      {/* Render all loaded wearables */}
      {wearablesArray.map((wearable) => (
        <group
          key={wearable.id}
          ref={(el) => {
            if (el) {
              wearableGroupsRef.current.set(wearable.id, el);
            } else {
              wearableGroupsRef.current.delete(wearable.id);
            }
          }}
          position={[wearable.position.x, wearable.position.y, wearable.position.z]}
          rotation={[wearable.rotation.x, wearable.rotation.y, wearable.rotation.z]}
          visible={wearable.isVisible && !isMerged}
        >
          <Suspense fallback={null}>
            <Model 
              id={wearable.id}
              url={wearable.url}
            />
          </Suspense>
        </group>
      ))}

      {/* Transform controls for selected wearable */}
      {selectedWearable && selectedWearableGroup && !isMerged && (
        <>
          <TransformControls 
            object={selectedWearableGroup} 
            mode="translate"
            size={1.2}
            onMouseDown={() => setControlsEnabled(false)}
            onMouseUp={() => setControlsEnabled(true)}
            onChange={() => {
              if (selectedWearableGroup) {
                const pos = selectedWearableGroup.position;
                const rot = selectedWearableGroup.rotation;
                updateWearablePosition(selectedWearable.id, { x: pos.x, y: pos.y, z: pos.z });
                updateWearableRotation(selectedWearable.id, { x: rot.x, y: rot.y, z: rot.z });
              }
            }}
          />
          <TransformControls 
            object={selectedWearableGroup} 
            mode="rotate"
            size={0.8}
            onMouseDown={() => setControlsEnabled(false)}
            onMouseUp={() => setControlsEnabled(true)}
            onChange={() => {
              if (selectedWearableGroup) {
                const pos = selectedWearableGroup.position;
                const rot = selectedWearableGroup.rotation;
                updateWearablePosition(selectedWearable.id, { x: pos.x, y: pos.y, z: pos.z });
                updateWearableRotation(selectedWearable.id, { x: rot.x, y: rot.y, z: rot.z });
              }
            }}
          />
        </>
      )}
      
      {selectedObjectId === 'avatar' && avatarGroupRef.current && !isMerged && (
        <TransformControls 
          object={avatarGroupRef.current} 
          mode="rotate"
          onMouseDown={() => setControlsEnabled(false)}
          onMouseUp={() => setControlsEnabled(true)}
        />
      )}

      <group ref={mergedGroupRef} />
      
      <ContactShadows 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={10} 
        resolution={512} 
        color="#000000" 
        position={[0, -1.5, 0]}
      />
    </group>
  );
}

export default function Experience() {
  const orbitControlsRef = useRef<any>(null);
  const shouldResetCamera = useStore((state) => state.shouldResetCamera);
  const setSelectedObjectId = useStore((state) => state.setSelectedObjectId);
  const [controlsEnabled, setControlsEnabled] = useState(true);

  useEffect(() => {
    if (shouldResetCamera && orbitControlsRef.current) {
      orbitControlsRef.current.reset();
      useStore.setState({ shouldResetCamera: false });
    }
  }, [shouldResetCamera]);

  return (
    <div className="w-full h-full bg-gradient-to-b from-gray-950 via-black to-gray-950">
      <Canvas 
        shadows 
        camera={{ position: [0, 0, 5], fov: 40 }} 
        gl={{ antialias: true }}
        onPointerMissed={() => setSelectedObjectId(null)}
      >
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