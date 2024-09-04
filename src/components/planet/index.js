import React, { useRef, useEffect, useState } from "react";
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Planet({ scrollPosition, ...props }) {
  const mesh = useRef();
  const texture = useLoader(THREE.TextureLoader, "/images/mr.jpg");
  const normalMap = useLoader(THREE.TextureLoader, "/images/mr2.jpg");
  const displacementMap = useLoader(
    THREE.TextureLoader,
    "/images/mars_displacement_map.jpg"
  );

  const [isLoaded, setIsLoaded] = useState(false);
  const [initialRotation, setInitialRotation] = useState(0);
  const rotationDuration = 2; // 2 seconds duration

  useEffect(() => {
    if (texture && normalMap && displacementMap) {
      setIsLoaded(true);
    }
  }, [texture, normalMap, displacementMap]);

  useFrame((state, delta) => {
    if (mesh.current) {
      if (isLoaded) {
        const rotationSpeed = (Math.PI * 2) / rotationDuration; // Full rotation in 5 seconds
        mesh.current.rotation.y += rotationSpeed * delta;
        setInitialRotation((prev) => prev + rotationSpeed * delta);

        if (initialRotation >= Math.PI * 2) {
          setIsLoaded(false);
        }
      } else {
        mesh.current.rotation.y =
          scrollPosition * 0.001 + state.clock.getElapsedTime() * 0.1;
      }
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
