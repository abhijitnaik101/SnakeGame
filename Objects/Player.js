import * as THREE from 'three';
import { scene } from '../Core/Scene';
import { spawnFruit, checkFruitCollision } from './Fruit';

const gridSize = 1;
const boardLimit = 10;
let score = 0;
const scoreElement = document.getElementById('scoreValue');

let snake = [
  { x: 0, z: 0 }
];

let snakeMeshes = [];
let direction = { x: 1, z: 0 };


createSegment(0, 0);

spawnFruit(snake);

function createSegment(x, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhysicalMaterial({ color: 'white' });

  const edgeGeometry = new THREE.EdgesGeometry(geometry);
  const lineMaterial = new THREE.LineBasicMaterial({ color: 'black'});
  const outline = new THREE.LineSegments(edgeGeometry, lineMaterial);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0.5, z);
  mesh.add(outline);
  mesh.castShadow = true;

  scene.add(mesh);
  snakeMeshes.push(mesh);
}
export function playerMovement(keys) {
  if (keys['w'] && direction.z !== 1) {
    direction = { x: 0, z: -1 };
  }
  else if (keys['s'] && direction.z !== -1) {
    direction = { x: 0, z: 1 };
  }
  else if (keys['a'] && direction.x !== 1) {
    direction = { x: -1, z: 0 };
  }
  else if (keys['d'] && direction.x !== -1) {
    direction = { x: 1, z: 0 };
  }
}

export function moveSnake() {
  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    z: head.z + direction.z
  };
  snake.unshift(newHead);

  if (checkFruitCollision(newHead)) {
    growSnake();
    spawnFruit(snake);
    score += 10;
  scoreElement.textContent = score;
  } else {
    snake.pop();
  }

  if (checkWallCollision(newHead)) {
    console.log('Wall Collision');
    return;
  }
  if (checkSelfCollision()) console.log('dead');

  updateMeshes();
}

function updateMeshes() {
  snake.forEach((segment, index) => {
    if (!snakeMeshes[index]) return;
    snakeMeshes[index].position.set(segment.x, 0.5, segment.z);
  });
}

export function growSnake() {
  const tail = snake[snake.length - 1];
  snake.push({ ...tail });
  createSegment(tail.x, tail.z);
}

function checkSelfCollision() {
  const head = snake[0];

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.z === snake[i].z) {
      return true;
    }
  }

  return false;
}
function checkWallCollision(position) {
  if (position.x > boardLimit || position.x < -boardLimit ||position.z > boardLimit ||position.z < -boardLimit)
    return true;
else
    return false;
}

