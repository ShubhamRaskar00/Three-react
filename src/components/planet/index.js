import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ scrollPosition, ...props }) {
  const mesh = useRef();
  const texture = useLoader(THREE.TextureLoader, '/images/mr.jpg');
  const normalMap = useLoader(THREE.TextureLoader, '/images/mr2.jpg');
  const displacementMap = useLoader(THREE.TextureLoader, '/images/mars_displacement_map.jpg');

  useEffect(() => {
    if (mesh.current) {
      mesh.current.rotation.y = scrollPosition * 0.001;
    }
  }, [scrollPosition]);

  useFrame((state) => {
    if (mesh.current) {
      // Add a slight constant rotation for a more dynamic effect
      mesh.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere args={[2, 256, 256]} ref={mesh} {...props}>
      <meshStandardMaterial 
        map={texture}
        normalMap={normalMap}
        displacementMap={displacementMap}
        displacementScale={0.15}
        metalness={0.2}
        roughness={0.8}
      />
    </Sphere>
  );
}

export default Planet;
