import * as THREE from 'three';
import { scene } from '../Core/Scene';
import { renderer } from '../Core/Renderer';

const gridBoundary = 18; 

let fruit = null;
let fruitPosition = { x: 0, z: 0 };

function createFruit(x, z) {
  const geometry = new THREE.OctahedronGeometry(0.5);
  const material = new THREE.MeshBasicMaterial({ color: '#dd2c2c' });
  fruit = new THREE.Mesh(geometry, material);
  fruit.material.opacity = 0.2 + Math.sin(performance.now() * 0.005) * 0.1;
  const fruitAura = new THREE.PointLight('#920101', 100, 5);
  fruit.add(fruitAura);

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 'black'});
  const outline = new THREE.LineSegments(edgeGeometry, lineMaterial);
  fruit.add(outline);
  fruit.castShadow = true
  fruit.position.set(x, 1, z);
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
  if(snakeHead.x === fruitPosition.x && snakeHead.z === fruitPosition.z)
    return true;
    else
    return false;
}