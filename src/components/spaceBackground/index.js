import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function SpaceBackground() {
  
  return (
    <mesh>
      <sphereGeometry args={[500, 60, 40]} />
    </mesh>
  );
}

export default SpaceBackground;
