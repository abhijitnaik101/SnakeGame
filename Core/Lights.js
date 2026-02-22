import * as THREE from 'three';
import { scene } from './Scene';

const ambientLight = new THREE.AmbientLight('white', 1);

const directionalLight = new THREE.DirectionalLight('white', 8);
directionalLight.position.set(20, 20, 20);
directionalLight.castShadow = true;
directionalLight.lookAt(0,0,0);
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight,2 ,'red');

scene.add(ambientLight);
scene.add(directionalLight);
