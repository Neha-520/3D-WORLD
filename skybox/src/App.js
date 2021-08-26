import React, { Suspense, useRef } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { CubeCamera, CubeTextureLoader, RGBFormat, WebGLCubeRenderTarget } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './App.css';
extend({ OrbitControls })

const CameraControls = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controls = useRef();
  useFrame(() => controls.current.update());
  return (
    <orbitControls
      ref={controls}
      args={[camera, domElement]}
      autoRotate
      enableZoom={false}
    />
  )
}


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

  scene.background = texture; //set scene bg prop to resulting texture
  return null;
}

function Sphere() {
  const { scene, gl } = useThree();

  //used by CubeCamera as its webGLRenderTarget. parameters >>size in pixels and object with texture parameters 
  const cubeRenderTarget = new WebGLCubeRenderTarget(256, {
    format: RGBFormat,
    // generateMipmaps: true, 
    // minFilter: LinearMipMapLinearFilter 
  });
  // used to generate texture for reflective sphere 
  // must be updated on each frame in order to track camera movement

  const cubeCamera = new CubeCamera(1, 1000, cubeRenderTarget); //contains 6 perspective cameras
  cubeCamera.position.set(0, 0, 0);
  scene.add(cubeCamera);

  //update the cubecamera with current renderer and scene
  useFrame(() => cubeCamera.update(gl, scene));

  return (
    <mesh visible position={[0, 0, 0]} rotation={[0, 0, 0]} castShadow>
      <sphereGeometry attach="geometry" args={[2, 32, 32]} />
      <meshBasicMaterial
        attach="material"
        envMap={cubeCamera.renderTarget.texture}
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
        <Suspense fallback={null}>
          <Sphere />
          <Skybox />
        </Suspense>
        <CameraControls />
      </Canvas>
    </Suspense>
  );
}

export default App;
