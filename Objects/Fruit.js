import * as THREE from 'three';
import { scene } from '../Core/Scene';
import { renderer } from '../Core/Renderer';

const gridBoundary = 18; 

let fruit = null;
let fruitPosition = { x: 0, z: 0 };
let minCollisionDistance = 0.8;

function createFruit(x, z) {
  const geometry = new THREE.OctahedronGeometry(0.5);
  const material = new THREE.MeshBasicMaterial({ color: '#f03333'});
  fruit = new THREE.Mesh(geometry, material);
 
  const aura = new THREE.SphereGeometry(0.7);
  const glow = new THREE.MeshBasicMaterial({color: 'red'})
  const fruitAura = new THREE.PointLight('#920101', 100, 5);

  const glowMesh = new THREE.Mesh(aura, glow);
  glowMesh.material.transparent = true;
  glowMesh.material.opacity = 0.2;

  fruit.add(glowMesh);
  //fruit.add(fruitAura);

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 'black'});
  const outline = new THREE.LineSegments(edgeGeometry, lineMaterial);
  fruit.add(outline);
  fruit.castShadow = true
  fruit.position.set(x, 0.6, z);
  scene.add(fruit);
}

export function rotateFruit(){
  if(fruit)
  fruit.rotation.y += 0.01;
}

function fruitSpawnPosition() {
  const x = Math.floor(Math.random() * gridBoundary - gridBoundary / 2);
  const z = Math.floor(Math.random() * gridBoundary - gridBoundary / 2);
  return { x: x, z: z };
}


export function spawnFruit() {
  let newPos = fruitSpawnPosition();
  fruitPosition = newPos;

  if (!fruit) {
    createFruit(newPos.x, newPos.z);
  } else {
    fruit.position.set(newPos.x, 1, newPos.z);
  }
}


export function checkFruitCollision(snakeHead) {
  if(Math.abs(snakeHead.x - fruitPosition.x) < minCollisionDistance  && Math.abs(snakeHead.z - fruitPosition.z) < minCollisionDistance )
    return true;
    else
    return false;
}