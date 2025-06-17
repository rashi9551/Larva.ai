"use client";

import {  PointMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as random from "maath/random";
import { useState, useRef, Suspense } from "react";
import * as THREE from "three";

export const StarBackground = () => {
  const ref = useRef<THREE.Points>(null);

  const [sphere] = useState<Float32Array>(() => {
    const buffer = new Float32Array(1200 * 3); // 3 components per point
    random.inSphere(buffer, { radius: 1.2 });
    return buffer;
  });

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={ref} frustumCulled>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={sphere.length / 3}
            array={sphere}
            itemSize={3} 
            args={[sphere,3]}/>
        </bufferGeometry>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.002}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

const StarsCanvas = () => (
  <div className="fixed inset-0 w-full h-auto pointer-events-none">
    <Canvas camera={{ position: [0, 0, 1] }} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <StarBackground />
      </Suspense>
    </Canvas>
  </div>
);

export default StarsCanvas;