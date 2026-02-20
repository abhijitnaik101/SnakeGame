import * as THREE from 'three';
import { scene } from './Scene';

const ambientLight = new THREE.AmbientLight('white', 1);

const directionalLight = new THREE.DirectionalLight('white', 10);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
directionalLight.lookAt(0,0,0);
//const directionalLightHelper = new THREE.DirectionalLightHelper('white',2 ,'red');

scene.add(ambientLight);
scene.add(directionalLight);
//scene.add(directionalLightHelper);