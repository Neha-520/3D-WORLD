import React, { Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { CubeTextureLoader } from 'three';
import './App.css';


function Skybox() {
  const { scene } = useThree();
  const loader = new CubeTextureLoader();

  const texture = loader.load([
    "/1.jpg",
    "/2.jpg",
    "/3.jpg",
    "/4.jpg",
    "/5.jpg",
    "/6.jpg",
  ]);
  //images are passed in array for 6 sides of cube

  scene.background = texture;
  return null;
}

function Sphere() {
  const { scene, gl } = useThree();

  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <sphereGeometry attach="geometry" args={[2, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        roughness={0.1}
        metalness={1}
      />
    </mesh>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading....</div>}>
      <Canvas>
        <Sphere />
        <Skybox />
      </Canvas>
    </Suspense>
  );
}

export default App;
