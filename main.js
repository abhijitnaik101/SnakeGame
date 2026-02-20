import * as THREE from 'three'
import { scene } from './Core/Scene';
import { camera, changeCamera } from './Core/Camera';
import './Objects/Board';
import './Core/Lights';
import { controls } from './Controls/OrbitControls';
import { renderer } from './Core/Renderer';
import { moveSnake, playerMovement } from './Objects/Player';

const keys = {};
window.addEventListener('keydown', (e) => (keys[e.key] = true));
window.addEventListener('keyup', (e) => (keys[e.key] = false));

let moveInterval = 200; //millisec
let lastMoveTime = 0;


function animate(time) {
  controls.object = camera;

  if (time - lastMoveTime > moveInterval) {
    moveSnake();
    lastMoveTime = time;
  }

  changeCamera(keys);
  playerMovement(keys);
  renderer.render(scene, camera);
  controls.update();
}
renderer.setAnimationLoop(animate);
