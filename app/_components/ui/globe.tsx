import React from "react";
import ThreeGlobe from "three-globe";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

export function World() {
  const globeRef = React.useRef<THREE.Mesh>(null);

  React.useEffect(() => {
    if (globeRef.current) {
      const globe = new ThreeGlobe()
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .backgroundColor("rgba(0,0,0,0)");

      // Add the globe to the mesh
      if (globeRef.current) {
        globeRef.current.add(globe);
      }
    }
  }, []);

  return (
    <Canvas style={{ height: "400px" }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={globeRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#404040" />
      </mesh>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
    </Canvas>
  );
}
