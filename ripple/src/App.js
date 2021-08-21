import './App.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Canvas, extend, useFrame, useLoader, useThree } from 'react-three-fiber';
import circleImg from './assets/circle.png';
import { Suspense, useCallback, useMemo, useRef } from 'react';
extend({ OrbitControls })

function CameraControls() {
  const {
    camera,
    gl: { domElement }
  } = useThree();

  const controlsRef = useRef();
  useFrame(() => controlsRef.current.update())

  return (
    <orbitControls
      ref={controlsRef}
      args={[camera, domElement]}
      autoRotate
      autoRotateSpeed={-0.2}
    />
  );
}

function Points() {
  const imgTex = useLoader(THREE.TextureLoader, circleImg); //loading image as texture
  const bufferRef = useRef();

  let t = 0; //phase shift
  let f = 0.002;  //frequency
  let a = 3.2; //amplitude

  const graph = useCallback((x, z) => {
    return Math.sin(f * (x ** 2 + z ** 2 + t)) * a;
  }, [t, f, a]);

  const count = 100; //points across 1 axis
  const sep = 3; //distance between points

  // try set count = 500, sep=0.1 will look like mesh

  //we cannot pass 2d array to bufferattribute,we passed 1-D array as [x1,y1,z1,x2,y2,z2...]
  let positions = useMemo(() => {
    let positions = []

    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);
        let y = graph(x, z);
        positions.push(x, y, z);
      }
    }

    return new Float32Array(positions); //can be used in buffer
  }, [count, sep, graph]);


  useFrame(() => {
    t += 15;
    //a+=0.1
    const positions = bufferRef.current.array;

    let i = 0;
    for (let xi = 0; xi < count; xi++) {
      for (let zi = 0; zi < count; zi++) {
        let x = sep * (xi - count / 2);
        let z = sep * (zi - count / 2);

        positions[i + 1] = graph(x, z);
        i += 3;
      }
    }
    bufferRef.current.needsUpdate = true;
  })

  return (
    //points are placed in a grid
    <points>
      <bufferGeometry attach="geometry">
        {/*to read and edit data in bufferGeometry */}
        <bufferAttribute
          ref={bufferRef}
          attachObject={['attributes', 'position']} //attach it to position of these points as we are animating them
          array={positions}
          count={positions.length / 3} //no. of position to do operation on
          itemSize={3} //x1,y1,z1
        />
      </bufferGeometry>

      <pointsMaterial
        attach="material"
        map={imgTex}
        color={0x00AAFF}
        size={0.5}
        sizeAttenuation
        transparent={false}
        alphaTest={0.5}
        opacity={1.0}
      // properties above ensures transparent portion is rendered transparent
      />
    </points>
  );
}

function AnimationCanvas() {
  return (
    <Canvas
      colorManagement={false}
      camera={{ position: [100, 10, 0], fov: 75 }} //field of view
    >
      <Suspense fallback={null}>
        {/* //fallback ui here has to be displayable i.e inside canvas we can only display three js component while its loading */}
        <Points />
      </Suspense>
      <CameraControls />
    </Canvas>
  );
}

function App() {
  return (
    <div className="anim">
      <Suspense fallback={<div>Loading....</div>}>
        {/* //since it takes time to load it will be displayed */}
        <AnimationCanvas />
      </Suspense>
    </div>
  );
}

export default App;
