import * as THREE from 'three';
import { scene } from '../Core/Scene';

const gridSize = 1;
const gridBoundary = 10; 

let fruit = null;
let fruitPosition = { x: 0, z: 0 };

function createFruitMesh(x, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 'red' });
  fruit = new THREE.Mesh(geometry, material);
  fruit.castShadow = true
  fruit.position.set(x, 0.5, z);
  scene.add(fruit);
}

function fruitSpawnPosition() {
  const x = Math.floor(Math.random() * gridBoundary - gridBoundary / 2);
  const z = Math.floor(Math.random() * gridBoundary - gridBoundary / 2);

  return {
    x: x * gridSize,
    z: z * gridSize
  };
}

// -----------------------------
// Spawn fruit (avoid snake body)
export function spawnFruit(snake) {
  let newPos;

  do {
    newPos = fruitSpawnPosition();
  } while (snake.some(segment => segment.x === newPos.x && segment.z === newPos.z));

  fruitPosition = newPos;

  if (fruit) {
    fruit.position.set(newPos.x, 0.5, newPos.z);
  } else {
    createFruitMesh(newPos.x, newPos.z);
  }
}


export function checkFruitCollision(snakeHead) {
  if(snakeHead.x === fruitPosition.x && snakeHead.z === fruitPosition.z)
    return true;
    else
    return false;
}
