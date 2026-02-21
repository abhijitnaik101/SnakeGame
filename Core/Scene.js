import * as THREE from 'three';

export const scene = new THREE.Scene();
scene.background = new THREE.Color('#f1f1f1');
const gridHelper = new THREE.GridHelper(1000, 1000, 'grey', 'grey');
gridHelper.position.set(0, -0.01, 0)

scene.add(gridHelper);