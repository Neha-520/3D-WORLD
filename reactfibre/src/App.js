import React,{useState} from "react";
import * as THREE from 'three'
import {Canvas} from '@react-three/fiber';
import {OrbitControls,Stars} from '@react-three/drei';
import {  Physics, useBox, usePlane } from '@react-three/cannon'
import './App.css';

function Box(){
  const [hovered, setHover] = useState(true)
  const [ref,api] = useBox(() => ({ 
    mass: 1,
    position : [0,2,0], 
  }))

  return(
    <mesh 
    onClick={()=>{
       api.velocity.set(0,4,0);
    }} 
    castShadow
    onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    ref={ref} >
      <boxBufferGeometry attach="geometry"/>
      <meshLambertMaterial attach="material" color={hovered ? 'hotpink' : 'mob'}/>
    </mesh>
  )
}

function Plane(){
  const [ref] = usePlane(()=>({
    rotation : [-Math.PI / 2, 0, 0],
  }));
  return(
    <mesh ref={ref} position={[0,0,0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[100,100]}/>
      <meshLambertMaterial attach="material" color="seafoamgreen"/>
    </mesh>
  )
}

function App() {
  return (
   <Canvas camera={{position:[0,0,5]}} onCreated={({gl})=>{
     gl.shadowMap.enabled = true
     gl.shadowMap.type = THREE.PCFSoftShadowMap
   }}>
   <OrbitControls autoRotate/> 
   {/* use maxPolarAngle and minPolarAngle to restrict rotation to particular angle */}
   <Stars/>
   <ambientLight intensity={0.5}/>
   <spotLight position={[10,15,10]} angle={0.3} castShadow/>
   <Physics>
     <Box/>
     <Plane/>
     </Physics>
   </Canvas>
  );
}

export default App;
