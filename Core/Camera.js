import * as THREE from 'three';
import { scene } from './Scene';

//#region Perspective Camera
const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
perspectiveCamera.position.z = 10;
perspectiveCamera.position.y = 10;
perspectiveCamera.rotation.x = Math.PI/4;
//#endregion

//#region Orthographic Camera
const width = 50, height = 50;
const aspect = window.innerWidth / window.innerHeight;
const orthographicCamera = new THREE.OrthographicCamera(
    -width/2 * aspect, width/2 * aspect,
    height/2, -height/2,
    1, 1000);
orthographicCamera.position.set(20, 50, 50);
orthographicCamera.lookAt(0, 0, 0);
//#endregion


export let camera = new THREE.Camera()
camera = perspectiveCamera;

export function changeCamera(keys){
    if(keys['-']) {
        camera = perspectiveCamera;
    }
    if(keys['=']) {
        camera = orthographicCamera;
    }
}