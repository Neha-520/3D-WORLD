import React, { useState, useRef, Suspense } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Canvas, useThree, useFrame,extend } from '@react-three/fiber'
// import { useSpring, a } from "@react-spring/three";

import './App.css';

extend({ OrbitControls })

const SpaceShip = () => {
  const [model, setModel] = useState()

  useFrame(() => {
    new GLTFLoader().load("/scene.gltf", setModel)
  })

  return model ? <primitive object={model.scene} /> : null
}

const Controls = () => {
  const orbitRef = useRef()
  const { camera, gl } = useThree()

  useFrame(() => {
    orbitRef.current.update()
  })

  return (
    <orbitControls
      autoRotate
     enablePan={false} 
      args={[camera, gl.domElement]}
      ref={orbitRef}
 enableDamping dampingFactor={0.5} rotateSpeed={1} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/2}
    />
  )
}


export default function App ()  {
  const isBrowser = typeof window !== "undefined"

  return (
    <>
        <div className="bg"/>
    <h1>
       LET'S
       <br/>
       <span>GO</span>
       </h1>
      {isBrowser && (
        <Canvas
          camera={{ position: [0, 0, 5] }}
          onCreated={({ gl }) => {
             gl.shadowMap.enabled = true
            gl.shadowMap.type = THREE.PCFSoftShadowMap
          }}
        >
          <ambientLight intensity={0.75} />
          <spotLight  position={[25, 25, 25]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}  penumbra={1} castShadow intensity={2.25} angle={0.2}/>
          <fog attach="fog" args={['#cc7b32', 16, 20]} />
          <Controls />
          <Suspense fallback={null}>
          <SpaceShip />
          </Suspense>
        </Canvas>
      )}
    </>
  )
}














// import React,{useState,useEffect, Suspense} from 'react';
// import * as THREE from 'three';
// import {Canvas,useLoader} from '@react-three/fiber';
// import {useTransition, a} from "@react-spring/three";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// import {OrbitControls} from '@react-three/drei';
// import './App.css';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

// function Rocket({url}){
// const {nodes,materials} = useLoader(GLTFLoader, url,new DRACOLoader())
// // Draco is an open-source library for compressing and decompressing 3D geometric meshes and point clouds, used to improve the storage and transmission of 3D graphics.
// // glTF (GL Transmission Format) is an open format specification for efficient delivery and loading of 3D content.  Assets may be provided either in JSON (.gltf) or binary (.glb) format 
// return(
//    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={[7, 7, 7]}>
//      <group rotation={[Math.PI/13.5,- Math.PI/5.8,Math.PI/5.6]}>
//          <mesh castShadow receiveShadow geometry={nodes.plane001.geometry} material={materials.scene}/>
//          <mesh castShadow receiveShadow geometry={nodes.planet002.geometry} material={materials.scene}/>
//      </group>
//    </group>
//   )
// }

// function Loading() {
//   const [finished, set] = useState(false)
//   const [width, setWidth] = useState(0)

//   useEffect(() => {
//     THREE.DefaultLoadingManager.onLoad = () => set(true)
//     THREE.DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) =>
//       setWidth((itemsLoaded / itemsTotal) * 200)
//   }, [])

//   const props = useTransition(finished, null, {
//     from: { opacity: 1, width: 0 },
//     leave: { opacity: 0 },
//     update: { width },
//   })

//   return props.map(
//     ({ item: finished, key, props: { opacity, width } }) =>
//       !finished && (
//         <a.div className="loading" key={key} style={{ opacity }}>
//           <div className="loading-bar-container">
//             <a.div className="loading-bar" style={{ width }} />
//           </div>
//         </a.div>
//       ),
//   )
// }

// function App() {
//   return (
//     <>
//     <div className="bg"/>
//     <h1>
//        LET'S
//        <br/>
//        <span>GO</span>
//        </h1>
 
//  <Canvas shadowMap camera={{position : [0,0,15]}}>
//     <ambientLight intensity={0.75}/>\
//     <pointLight intensity={1} position={[-10,-25,-10]}/>
//     <spotLight castShadow intensity={2.25} angle={0.2}/>
//     <fog attach="fog" args={[]}/>
//     <Suspense fallback={null}>
//       <Rocket url="/scene.gltf"/>
//     </Suspense>
//     <OrbitControls autoRotate enablePan={false} enableZoom={false} enableDamping dampingFactor={0.5} rotateSpeed={1} maxPolarAngle={Math.PI/2} minPolarAngle={Math.PI/2}/>
//  </Canvas>
//  <div className="layer" />
//       <Loading />
//       <a href="https://github.com/drcmda/learnwithjason" className="top-left" children="Github" />
//       <a href="https://twitter.com/0xca0a" className="top-right" children="Twitter" />
//       <a href="https://github.com/drcmda/react-three-fiber" className="bottom-left" children="+ react-three-fiber" />
//  </>
//   );
// }

// export default App;

