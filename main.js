import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ---------------- SCENE ----------------
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87ceeb)

// ---------------- CAMERA ----------------
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 15, 25)

// ---------------- RENDERER ----------------
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.physicallyCorrectLights = true
renderer.outputColorSpace = THREE.SRGBColorSpace
document.body.appendChild(renderer.domElement)

// ---------------- CONTROLS ----------------
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// ---------------- LIGHTING ----------------
scene.add(new THREE.AmbientLight(0xffffff, 0.3))

const dirLight = new THREE.DirectionalLight(0xffffff, 2)
dirLight.position.set(15, 30, 15)
dirLight.castShadow = true
scene.add(dirLight)

// ---------------- GROUND ----------------
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshPhysicalMaterial({
    color: 0x6d9e51,
    roughness: 0.6,
    metalness: 0.05,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3
  })
)
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
scene.add(plane)

// ---------------- MAZE ----------------
const walls = []

const wallMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x013220,
  roughness: 0.4,
  metalness: 0.1,
  clearcoat: 0.2
})

function createWall(width, height, depth, x, z) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    wallMaterial
  )
  wall.position.set(x, height / 2, z)
  wall.castShadow = true
  wall.receiveShadow = true
  scene.add(wall)
  walls.push(wall)
}

const wallHeight = 4
const t = 1 // wall thickness

// ---- OUTER BORDER ----
createWall(40, wallHeight, t, -2, -22)
createWall(44, wallHeight, t, 0, 22)
createWall(t, wallHeight, 44, -22, 0)
createWall(t, wallHeight, 44, 22, 0)

// ---- TOP SECTION ----
createWall(30, wallHeight, t, 0, 16)
createWall(t, wallHeight, 12, -8, 10)

// ---- LEFT SECTION ----
createWall(t, wallHeight, 26, -18, 6)
createWall(10, wallHeight, t, -14, 8)
createWall(t, wallHeight, 10, -14, 3)
createWall(12, wallHeight, t, -8, -2)

// ---- CENTER SECTION ----
createWall(t, wallHeight, 16, 2, 6)
createWall(24, wallHeight, t, 8, 8)

// ---- RIGHT SECTION ----
createWall(t, wallHeight, 16, 12, 2)
createWall(10, wallHeight, t, 16, 6)

// ---- BOTTOM SECTION ----
createWall(12, wallHeight, t, -8, -14)
createWall(12, wallHeight, t, 10, -14)

createWall(t, wallHeight, 14, -6, -8)
createWall(t, wallHeight, 16, -2, -6)

createWall(14, wallHeight, t, 4, -8)
createWall(t, wallHeight, 14, 14, -10)

// ---------------- BALL ----------------
const ballGeometry = new THREE.SphereGeometry(1, 64, 64)

const ballMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x3a9aff,
  roughness: 0.1,
  metalness: 0.8,
  clearcoat: 1,
  clearcoatRoughness: 0.05
})

const ball = new THREE.Mesh(ballGeometry, ballMaterial)
ball.position.set(0, 5, 0)
ball.castShadow = true
scene.add(ball)

// Outline effect
const outlineMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  side: THREE.BackSide
})

const outline = new THREE.Mesh(ballGeometry, outlineMaterial)
outline.scale.set(1.07, 1.07, 1.07)
ball.add(outline)

// ---------------- PHYSICS ----------------
let velocityY = 0.5
const gravity = -0.03
const bounceForce = 0.5

// ---------------- MOVEMENT ----------------
const keys = {}
const moveSpeed = 0.3

window.addEventListener('keydown', (e) => (keys[e.key] = true))
window.addEventListener('keyup', (e) => (keys[e.key] = false))

// ---------------- RESIZE ----------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// ---------------- ANIMATE ----------------
function animate() {
  requestAnimationFrame(animate)

  // ---- Vertical Bounce ----
  velocityY += gravity
  ball.position.y += velocityY

  if (ball.position.y <= 1) {
    ball.position.y = 1
    velocityY = bounceForce
  }

  // ---- Horizontal Movement ----
  let moveX = 0
  let moveZ = 0

  if (keys['ArrowUp']) moveZ -= moveSpeed
  if (keys['ArrowDown']) moveZ += moveSpeed
  if (keys['ArrowLeft']) moveX -= moveSpeed
  if (keys['ArrowRight']) moveX += moveSpeed

  const oldX = ball.position.x
  const oldZ = ball.position.z

  ball.position.x += moveX
  ball.position.z += moveZ

  const ballBox = new THREE.Box3().setFromObject(ball)

  for (let wall of walls) {
    const wallBox = new THREE.Box3().setFromObject(wall)

    if (ballBox.intersectsBox(wallBox)) {
      ball.position.x = oldX
      ball.position.z = oldZ
      break
    }
  }

  controls.update()
  renderer.render(scene, camera)
}

animate()
