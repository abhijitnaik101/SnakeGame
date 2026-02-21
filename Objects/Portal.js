import * as THREE from 'three';
import { scene } from '../Core/Scene';

const gridBoundary = 10;

let portalA = null;
let portalB = null;

let portalMeshA = null;
let portalMeshB = null;

let lastTeleportTick = -1;

const portalGeometry = new THREE.PlaneGeometry(1,1);
const materialA = new THREE.MeshStandardMaterial({ color: '#094100', side:THREE.DoubleSide});
const materialB = new THREE.MeshStandardMaterial({ color: '#094100', side:THREE.DoubleSide});

const edge = new THREE.EdgesGeometry(portalGeometry);
const line = new THREE.LineBasicMaterial({color: 'black'});


function getRandomPosition() {
  return {
    x: Math.floor(Math.random() * gridBoundary - gridBoundary / 2),
    z: Math.floor(Math.random() * gridBoundary - gridBoundary / 2)
  };
}

function isPositionOccupied(pos, snake) {
  return snake.some(seg => seg.x === pos.x && seg.z === pos.z);
}

export function spawnPortals(snake) {

  removePortals();

  do {
    portalA = getRandomPosition();
  } while (isPositionOccupied(portalA, snake));

  do {
    portalB = getRandomPosition();
  } while (
    isPositionOccupied(portalB, snake) ||
    (portalB.x === portalA.x && portalB.z === portalA.z)
  );

  portalMeshA = new THREE.Mesh(portalGeometry, materialA);
  portalMeshB = new THREE.Mesh(portalGeometry, materialB);
const outlineA = new THREE.LineSegments(edge, line);
const outlineB = new THREE.LineSegments(edge, line);
  portalMeshA.add(outlineA);
  portalMeshB.add(outlineB);

    portalMeshA.rotation.x = Math.PI / 2;
    portalMeshB.rotation.x = Math.PI / 2;

  portalMeshA.position.set(portalA.x, 0.01, portalA.z);
  portalMeshB.position.set(portalB.x, 0.01, portalB.z);

  scene.add(portalMeshA);
  scene.add(portalMeshB);
}

export function handlePortalTeleport(head, tick, snake) {

  if (!portalA || !portalB) return;

  if (tick === lastTeleportTick) return;

  let teleported = false;

  if (head.x === portalA.x && head.z === portalA.z) {
    head.x = portalB.x;
    head.z = portalB.z;
    teleported = true;
  }
  else if (head.x === portalB.x && head.z === portalB.z) {
    head.x = portalA.x;
    head.z = portalA.z;
    teleported = true;
  }

  if (teleported) {
    lastTeleportTick = tick;
    removePortals();
    spawnPortals(snake);
  }
}

export function updatePortalAnimation() {
  if (!portalMeshA || !portalMeshB) return;

  portalMeshA.rotation.z += 0.05;
  portalMeshB.rotation.z += 0.05;
}

export function removePortals() {
  if (portalMeshA) scene.remove(portalMeshA);
  if (portalMeshB) scene.remove(portalMeshB);

  portalMeshA = null;
  portalMeshB = null;
  portalA = null;
  portalB = null;
}