import * as THREE from 'three';
import { scene } from '../Core/Scene';
import { spawnFruit, checkFruitCollision } from './Fruit';
import { spawnPortals, handlePortalTeleport, updatePortalAnimation, removePortals } from './Portal';

const boardLimit = 10;
let score = 0;
let gameOver = false;
let tick = 0;
let dir = 1/20;  // Consider changing to 1 for better spacing
export let snakeSpeed = 1/20;

const scoreElement = document.getElementById('scoreValue');
const restartModal = document.getElementById('restartModal');
const restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restartGame);

function showRestartModal() {
  restartModal.classList.remove('hidden');
  restartModal.querySelector('#score').textContent = score;
}
function hideRestartModal() {
  restartModal.classList.add('hidden');
}

let snake = [];
let snakeMeshes = [];

initializeSnake();
let direction = { x: dir, z: 0 };
let rotation = { r: 0 };

spawnFruit();
spawnPortals(snake);

export function moveSnake() {
  tick++;
  if (gameOver) return;
  const head = snake[0];
  let rotationVal = 0;
  if (direction.x !== 0) rotationVal = 0;
  else if (direction.z !== 0) rotationVal = Math.PI / 2;
  const newHead = {
    x: head.x + direction.x,
    z: head.z + direction.z,
    r: rotationVal
  };

  checkWallCollision(newHead);
  handlePortalTeleport(newHead, tick, snake);
  snake.unshift(newHead);

  if (checkFruitCollision(newHead)) {
    growSnake();
    spawnFruit();
    score += 1;
    updateSpeed();
    scoreElement.textContent = score;
  } else {
    snake.pop();
  }

  if (checkSelfCollision()) {
    gameOver = true;
    showRestartModal();
    return;
  }
  updateMeshes();
}

function updateSpeed() {
  let speedFactor = 0;
  if (score > 10) speedFactor = 1 / 15;
  if (score > 25) speedFactor = 1 / 10;
  if (score > 50) speedFactor = 1 / 5;

  snakeSpeed += speedFactor;
}

export function playerMovement(keys) {
  if ((keys['w'] || keys['ArrowUp']) && direction.z !== -dir) {
    direction = { x: 0, z: -dir };
    rotation = { r: Math.PI / 2 };
  } else if ((keys['s'] || keys['ArrowDown']) && direction.z !== dir) {
    direction = { x: 0, z: dir };
    rotation = { r: Math.PI / 2 };
  } else if ((keys['a'] || keys['ArrowLeft']) && direction.x !== dir) {
    direction = { x: -dir, z: 0 };
    rotation = { r: 0 };
  } else if ((keys['d'] || keys['ArrowRight']) && direction.x !== -dir) {
    direction = { x: dir, z: 0 };
    rotation = { r: 0 };
  }
}

function createSegment(x, z, r, type = 'body') {
  let geometry;
  if (type === 'head' ) {
    geometry = new THREE.BoxGeometry(1, 1, 1);
  }else if(type === 'tail'){
    geometry = new THREE.SphereGeometry(0.5);
  } else {
    geometry = new THREE.SphereGeometry(0.5);
  }

  const material = new THREE.MeshNormalMaterial({
    color: '#3940ff',
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(x, 0.5, z);
  mesh.castShadow = true;
  mesh.rotation.z = Math.PI / 2;
  mesh.rotation.y = r;

  scene.add(mesh);
  snakeMeshes.push(mesh);
  return mesh;  // <-- Return mesh for management
}

function initializeSnake() {
  const segmentsToCreate = Math.round(1 / dir);

  snake = [];
  snakeMeshes.forEach(mesh => scene.remove(mesh));
  snakeMeshes = [];

  for (let i = 0; i < segmentsToCreate; i++) {
    const segment = {
      x: -i * dir,
      z: 0,
      r: 0
    };

    snake.push(segment);

    if (i === 0) {
      createSegment(segment.x, segment.z, segment.r, 'head');
    } else if (i === segmentsToCreate - 1) {
      createSegment(segment.x, segment.z, segment.r, 'tail');
    } else {
      createSegment(segment.x, segment.z, segment.r, 'body');
    }
  }
}

function updateMeshes() {
  snake.forEach((segment, index) => {
    if (!snakeMeshes[index]) return;
    snakeMeshes[index].position.set(segment.x, 0.5, segment.z);
    snakeMeshes[index].rotation.set(0, segment.r, Math.PI / 2);
  });
}

export function growSnake() {
  const segmentsToAdd = Math.round(1 / dir);

  const tail = snake[snake.length - 1];
  const beforeTail = snake[snake.length - 2];

  const dx = tail.x - beforeTail.x;
  const dz = tail.z - beforeTail.z;

  // Remove old tail mesh and replace with body mesh
  const oldTailMesh = snakeMeshes.pop();
  scene.remove(oldTailMesh);
  const bodyMesh = createSegment(tail.x, tail.z, tail.r, 'body');

  // Replace old tail mesh reference with body mesh
  snakeMeshes.push(bodyMesh);

  for (let i = 1; i <= segmentsToAdd; i++) {
    const newSegment = {
      x: tail.x + dx * i,
      z: tail.z + dz * i,
      r: tail.r
    };

    snake.push(newSegment);

    if (i === segmentsToAdd) {
      createSegment(newSegment.x, newSegment.z, newSegment.r, 'tail');
    } else {
      createSegment(newSegment.x, newSegment.z, newSegment.r, 'body');
    }
  }
}

function checkSelfCollision() {
  const head = snake[0];
  const epsilon = 0.001;
  for (let i = 1; i < snake.length - 1; i++) {
    if (
      Math.abs(head.x - snake[i].x) < epsilon &&
      Math.abs(head.z - snake[i].z) < epsilon
    ) {
      return true;
    }
  }
  return false;
}

function checkWallCollision(position) {
  if (position.x > boardLimit) position.x = -boardLimit;
  if (position.x < -boardLimit) position.x = boardLimit;
  if (position.z > boardLimit) position.z = -boardLimit;
  if (position.z < -boardLimit) position.z = boardLimit;
}

function restartGame() {
  snakeMeshes.forEach(mesh => scene.remove(mesh));
  initializeSnake();
  direction = { x: dir, z: 0 };
  score = 0;
  scoreElement.textContent = score;
  gameOver = false;
  spawnFruit();
  hideRestartModal();
}