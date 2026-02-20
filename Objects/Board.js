import * as THREE from 'three';
import { scene } from '../Core/Scene';

const planeGeometry = new THREE.PlaneGeometry(10,10);
const planeMaterial = new THREE.MeshStandardMaterial({color: 'green', side : THREE.DoubleSide});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI /2 ;
scene.add(plane);