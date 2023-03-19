import { useLoader } from '@react-three/fiber';
import React from 'react';
import * as THREE from 'three';

const Cube: React.FC<{ url: string }> = ({ url }) => {
	const meshRef = React.useRef<any>();
	const textureLoader = useLoader(THREE.TextureLoader, url);
	textureLoader.wrapS = THREE.RepeatWrapping;
	textureLoader.wrapT = THREE.RepeatWrapping;
	textureLoader.repeat.set(2, 2);

	return (
		<mesh ref={meshRef}>
			<boxBufferGeometry />
			<meshStandardMaterial map={textureLoader} />
		</mesh>
	);
};

export default Cube;
