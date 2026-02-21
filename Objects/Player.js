import * as THREE from 'three';
import { scene } from '../Core/Scene';
import { spawnFruit, checkFruitCollision } from './Fruit';
import { spawnPortals, handlePortalTeleport, updatePortalAnimation, removePortals } from './Portal';


const boardLimit = 10;
let score = 0;
let gameOver = false;
let tick = 0;
export let snakeSpeed = 250;


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

let snake = [
  { x: 0, z: 0 }
];
let snakeMeshes = [];
let direction = { x: 1, z: 0 };

createSegment(0, 0);
spawnFruit();
spawnPortals(snake);

export function moveSnake() {
  tick++;
  if (gameOver) return;
  const head = snake[0];
  const newHead = {
    x: head.x + direction.x,
    z: head.z + direction.z
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

function updateSpeed(){
  let speedFactor = 50;
  if(score>10) speedFactor = 50;
  if(score>25) speedFactor = 60;
  if(score>50) speedFactor = 50;

  snakeSpeed+=speedFactor;
}

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
  if ((keys['w'] || keys['ArrowUp']) && direction.z !== 1) {
    direction = { x: 0, z: -1 };
  }
  else if ((keys['s'] || keys['ArrowDown']) && direction.z !== -1) {
    direction = { x: 0, z: 1 };
  }
  else if ((keys['a'] || keys['ArrowLeft']) && direction.x !== 1) {
    direction = { x: -1, z: 0 };
  }
  else if ((keys['d'] || keys['ArrowRight']) && direction.x !== -1) {
    direction = { x: 1, z: 0 };
  }
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
  for (let i = 1; i < snake.length-1; i++) {
    if (head.x === snake[i].x && head.z === snake[i].z) return true;
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
  snake = [{ x: 0, z: 0 }];
  snakeMeshes = [];
  direction = { x: 1, z: 0 };
  score = 0;
  scoreElement.textContent = score;
  gameOver = false;
  createSegment(0, 0);
  spawnFruit();
  hideRestartModal();
}

