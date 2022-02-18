import * as THREE from "three"
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style.css'

const textureLoader = new THREE.TextureLoader()
const circleTexture = textureLoader.load('/circle.png')

const scene = new THREE.Scene()
const count = 100
const distance = 4

scene.add(new THREE.AxesHelper())

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000)
camera.position.z = 2
camera.position.y = 0.5
camera.position.x = 0.5
scene.add(camera)

const points = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
 for(let i = 0; i< points.length; i++){
  points[i] = THREE.MathUtils.randFloatSpread(distance * 2)
  colors[i] = Math.random()
 }

const geometry = new THREE.BufferGeometry(1,1,1)
geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3))
geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))
const pointMaterial = new THREE.PointsMaterial({
  size: 0.2,
  vertexColors: THREE.VertexColors,
  map: circleTexture,
  alphaTest: 0.01,
  transparent: true
})
const pointsObject = new THREE.Points(geometry, pointMaterial)

const group = new THREE.Group()
group.add(pointsObject)

const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x000000,
  opacity: .05,
  depthWrite: false
})
//const lineObject = new THREE.Line(geometry, lineMaterial)
//group.add(lineObject)
group.add(new THREE.Mesh(new THREE.SphereBufferGeometry(1, 32), new THREE.MeshBasicMaterial()))

scene.add(group)


const renderer = new THREE.WebGLRenderer({
  antiAlias: true,
  alpha: true
})
renderer.setClearColor(0x000000, 0)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild(renderer.domElement)
renderer.render(scene, camera)

const controls = new OrbitControls(camera, renderer.domElement)
const clock = new THREE.Clock()

let mouseX = 0
window.addEventListener('mousemove', e => {
  mouseX = e.clientX
})


function tick(){
  const time = clock.getElapsedTime()
  renderer.render(scene, camera)
  controls.update()
  //group.rotation.y = time * 0.1
  const ratio = (mouseX /window.innerWidth - 0.5) * 2
  group.rotation.y = ratio * Math.PI * 0.3
  requestAnimationFrame(tick)
}

tick()

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})