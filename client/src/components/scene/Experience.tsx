import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Html } from '@react-three/drei';
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
  const isMerged = useStore((state) => state.isMerged);
  const setIsMerged = useStore((state) => state.setIsMerged);

  const avatarGroupRef = useRef<THREE.Group>(null);
  const wearableGroupRef = useRef<THREE.Group>(null);
  const mergedMeshRef = useRef<THREE.Mesh | null>(null);
  const containerRef = useRef<THREE.Group>(null);
  const centerOffset = useRef(new THREE.Vector3());

  // Calculate and center the bounding box only when models change
  useEffect(() => {
    if (!containerRef.current) return;

    const recalculateCenter = () => {
      const box = new THREE.Box3();
      const center = new THREE.Vector3();

      // Update world matrices before calculating bounds
      containerRef.current!.updateMatrixWorld(true);
      
      box.setFromObject(containerRef.current!);
      box.getCenter(center);
      
      // Store the center offset
      centerOffset.current.copy(center);
      
      // Offset the container to center it
      containerRef.current!.position.set(-center.x, -center.y, -center.z);
    };

    // Initial calculation with a slight delay to ensure models are loaded
    const timer = setTimeout(recalculateCenter, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [avatarUrl, wearableUrl, isMerged]);

  useFrame((state, delta) => {
    if (!isDragging && containerRef.current) {
      // Save current position
      const currentPos = containerRef.current.position.clone();
      
      // Reset position to apply rotation around world center
      containerRef.current.position.set(0, 0, 0);
      
      // Rotate around world center (0,0,0)
      containerRef.current.rotation.y += rotationVelocity * delta * 2.5;
      
      // Reapply the centering offset
      containerRef.current.position.copy(currentPos);
    }
  });

  // Merge meshes when requested
  useEffect(() => {
    if (shouldMerge && avatarGroupRef.current && wearableGroupRef.current && !isMerged) {
      try {
        const geometriesToMerge: THREE.BufferGeometry[] = [];
        let firstMaterial: THREE.Material | null = null;
        let hasUV = false;
        let hasNormal = false;

        // First pass: check what attributes exist
        avatarGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            if (child.geometry.attributes.uv) hasUV = true;
            if (child.geometry.attributes.normal) hasNormal = true;
          }
        });
        wearableGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            if (child.geometry.attributes.uv) hasUV = true;
            if (child.geometry.attributes.normal) hasNormal = true;
          }
        });

        // Collect geometries from avatar with world transforms
        avatarGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const geometry = child.geometry.clone();
            child.updateWorldMatrix(true, false);
            geometry.applyMatrix4(child.matrixWorld);
            
            // Normalize attributes
            if (hasUV && !geometry.attributes.uv) {
              const vertexCount = geometry.attributes.position.count;
              const uvArray = new Float32Array(vertexCount * 2);
              geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
            }
            if (hasNormal && !geometry.attributes.normal) {
              geometry.computeVertexNormals();
            }
            
            geometriesToMerge.push(geometry);
            
            if (!firstMaterial && child.material) {
              firstMaterial = Array.isArray(child.material) ? child.material[0] : child.material;
            }
          }
        });

        // Collect geometries from wearable with world transforms
        wearableGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.geometry) {
            const geometry = child.geometry.clone();
            child.updateWorldMatrix(true, false);
            geometry.applyMatrix4(child.matrixWorld);
            
            // Normalize attributes
            if (hasUV && !geometry.attributes.uv) {
              const vertexCount = geometry.attributes.position.count;
              const uvArray = new Float32Array(vertexCount * 2);
              geometry.setAttribute('uv', new THREE.BufferAttribute(uvArray, 2));
            }
            if (hasNormal && !geometry.attributes.normal) {
              geometry.computeVertexNormals();
            }
            
            geometriesToMerge.push(geometry);
            
            if (!firstMaterial && child.material) {
              firstMaterial = Array.isArray(child.material) ? child.material[0] : child.material;
            }
          }
        });

        if (geometriesToMerge.length > 0) {
          const mergedGeometry = mergeGeometries(geometriesToMerge, false);
          
          if (mergedGeometry) {
            // Create merged mesh
            const material = firstMaterial || new THREE.MeshStandardMaterial({ color: 0x888888 });
            const mergedMesh = new THREE.Mesh(mergedGeometry, material);
            mergedMesh.name = 'mergedModel';
            
            // Add to container
            if (containerRef.current) {
              containerRef.current.add(mergedMesh);
              mergedMeshRef.current = mergedMesh;
            }
            
            // Hide original meshes
            avatarGroupRef.current.visible = false;
            wearableGroupRef.current.visible = false;
            
            // Update state
            setIsMerged(true);
            console.log('Merge successful');
          }
        }

        // Clean up cloned geometries
        geometriesToMerge.forEach(geo => geo.dispose());
        
      } catch (error) {
        console.error('Merge failed:', error);
      }
      
      setShouldMerge(false);
    }
  }, [shouldMerge, isMerged, setIsMerged, setShouldMerge]);

  // Unmerge effect
  useEffect(() => {
    if (!isMerged && mergedMeshRef.current) {
      // Remove and cleanup merged mesh
      if (containerRef.current && mergedMeshRef.current.parent) {
        containerRef.current.remove(mergedMeshRef.current);
      }
      
      // Dispose geometry and material
      if (mergedMeshRef.current.geometry) {
        mergedMeshRef.current.geometry.dispose();
      }
      
      mergedMeshRef.current = null;
      
      // Show original meshes
      if (avatarGroupRef.current) {
        avatarGroupRef.current.visible = true;
      }
      if (wearableGroupRef.current) {
        wearableGroupRef.current.visible = true;
      }
      
      console.log('Unmerge successful');
    }
  }, [isMerged]);

  return (
    <group>
      <group ref={containerRef}>
        <group ref={avatarGroupRef}>
          <Suspense fallback={<Html center><div className="text-primary font-display font-bold animate-pulse text-lg">INITIALIZING AVATAR...</div></Html>}>
            {avatarUrl && <Model url={avatarUrl} draggable={!isMerged} />}
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
                draggable={!isMerged}
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
      </group>
      
      <ContactShadows 
        opacity={0.4} 
        scale={15} 
        blur={2} 
        far={10} 
        resolution={512} 
        color="#000000"
        position={[0, -1, 0]}
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
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}