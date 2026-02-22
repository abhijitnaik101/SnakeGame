import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { camera } from '../Core/Camera'
import { renderer } from '../Core/Renderer'

export const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableRotate = false;
controls.update();