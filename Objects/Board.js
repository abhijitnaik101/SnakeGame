import * as THREE from 'three';
import { scene } from '../Core/Scene';

const planeHeight = 20, planeWidth = 20;
const boundaryHeight = 1, boundaryLength = 20, boundaryThickness = 1;
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
const planeMaterial = new THREE.MeshStandardMaterial({color: 'green', side : THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = -Math.PI /2 ;
scene.add(plane);

// const boundaryGeometry = new THREE.BoxGeometry(boundaryLength, boundaryHeight, boundaryThickness);
// const boundaryMaterial = new THREE.MeshToonMaterial({color: 'green'})
// const boundary_t = new THREE.Mesh(boundaryGeometry, boundaryMaterial);

// boundary_t.position.set(0, 0, -(planeHeight/2 + boundaryThickness/2));
// scene.add(boundary_t);