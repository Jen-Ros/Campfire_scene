import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Fog
 */
const fog = new THREE.Fog('#0a0a0a', 1, 15)
scene.fog = fog

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 2, 5)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
})
renderer.setSize(sizes.width, sizes.height)
renderer.setClearColor('#0a0a0a') // matches fog color
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

/**
 * Controls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Ground
 */
const grassColor = textureLoader.load('/textures/grass/color.jpg')
const grassAO = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

// Repeat texture like in Haunted House
grassColor.repeat.set(8, 8)
grassAO.repeat.set(8, 8)
grassNormal.repeat.set(8, 8)
grassRoughness.repeat.set(8, 8)

grassColor.wrapS = THREE.RepeatWrapping
grassAO.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping
grassColor.wrapT = THREE.RepeatWrapping
grassAO.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColor,
        aoMap: grassAO,
        normalMap: grassNormal,
        roughnessMap: grassRoughness
    })
)
ground.rotation.x = -Math.PI * 0.5
ground.receiveShadow = true
scene.add(ground)

/**
 * Camp Setup (Tent, Logs)
 */
const camp = new THREE.Group()
scene.add(camp)

camp.position.set(0, 0, -3)

// Tent (cone shape)
const tent = new THREE.Mesh(
    new THREE.ConeGeometry(1.5, 1.2, 4),
    new THREE.MeshStandardMaterial({ color: '#c7b9a8' })
)
tent.position.set(0, 0.6, 0)
tent.castShadow = true
camp.add(tent)

/**
 * Bonfire Logs (4 logs leaning towards the fire)
 */
const logGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16)
const logMaterial = new THREE.MeshStandardMaterial({ color: '#5a3e2b' })

const fireLogs = new THREE.Group()
scene.add(fireLogs)

// Create 4 crossed logs leaning towards the fire center
const log1 = new THREE.Mesh(logGeometry, logMaterial)
log1.rotation.z = Math.PI * 0.25
log1.position.set(0.4, 0.1, 0.3)
log1.castShadow = true

const log2 = log1.clone()
log2.rotation.z = -Math.PI * 0.25
log2.position.set(-0.4, 0.1, -0.3)

const log3 = log1.clone()
log3.rotation.x = Math.PI * 0.25
log3.position.set(0.3, 0.1, -0.4)

const log4 = log1.clone()
log4.rotation.z = -Math.PI * 0.25
log4.rotation.x = Math.PI * 0.25
log4.position.set(-0.3, 0.1, 0.10)

// Additional front log (closer to camera)
const log5 = log1.clone()
log5.rotation.x = -Math.PI * 0.25
log5.position.set(0, 0.1, 0.6)

// Additional back log (further from camera)
const log6 = log1.clone()
log6.rotation.x = Math.PI * 0.35
log6.position.set(0, 0.1, -0.6)

fireLogs.add(log1, log2, log3, log4, log5, log6)


/**
 * Log Chair (a big log facing the bonfire)
 */
const chairGeometry = new THREE.CylinderGeometry(0.30, 0.30, 1.8, 16)
const chairMaterial = new THREE.MeshStandardMaterial({ color: '#6b4a2b' })
const chairLog = new THREE.Mesh(chairGeometry, chairMaterial)
chairLog.rotation.z = Math.PI / 2         // lay it horizontally
chairLog.position.set(0, 0.2, 1.7)        // in front of the fire
chairLog.castShadow = true
chairLog.receiveShadow = true
scene.add(chairLog)

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight('#404040', 0.3)
scene.add(ambientLight)

// Moon Light (Directional)
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.15)
moonLight.position.set(4, 5, -2)
moonLight.castShadow = true
scene.add(moonLight)

// Fire Light (main light source)
const fireLight = new THREE.PointLight('#ff7b00', 1.5, 6)
fireLight.position.set(0, 0.4, 0)
fireLight.castShadow = true
scene.add(fireLight)

// Subtle warm reflection light on tent
const reflectionLight = new THREE.PointLight('#ff9933', 0.3, 4)
reflectionLight.position.set(0, 1, 0.8)
scene.add(reflectionLight)

/**
 * Shadows Optimization
 */
moonLight.shadow.mapSize.width = 512
moonLight.shadow.mapSize.height = 512
moonLight.shadow.camera.near = 1
moonLight.shadow.camera.far = 15

fireLight.shadow.mapSize.width = 512
fireLight.shadow.mapSize.height = 512
fireLight.shadow.camera.near = 0.1
fireLight.shadow.camera.far = 7

/**
 * Pine Trees Around the Camp
 */
const trees = new THREE.Group()
scene.add(trees)

// Tree materials
const treeTrunkMaterial = new THREE.MeshStandardMaterial({ color: '#4b2e05' })
const treeLeavesMaterial = new THREE.MeshStandardMaterial({ color: '#0b3d02' })

for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = 6 + Math.random() * 1.5 // slight random distance
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius

    // Tree trunk
    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1, 8),
        treeTrunkMaterial
    )
    trunk.position.set(x, 0.5, z)
    trunk.castShadow = true
    trunk.receiveShadow = true

    // Tree leaves (stacked cones for tall pine)
    const leaves1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 1.5, 8),
        treeLeavesMaterial
    )
    leaves1.position.set(x, 1.5, z)
    leaves1.castShadow = true

    const leaves2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.6, 1.2, 8),
        treeLeavesMaterial
    )
    leaves2.position.set(x, 2.2, z)
    leaves2.castShadow = true

    const leaves3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.8, 8),
        treeLeavesMaterial
    )
    leaves3.position.set(x, 2.7, z)
    leaves3.castShadow = true

    trees.add(trunk, leaves1, leaves2, leaves3)
}

/**
 * Resize
 */
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

/**
 * Animation
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Fire flicker
    fireLight.intensity = 1.5 + Math.sin(elapsedTime * 10) * 0.3
    fireLight.position.y = 0.4 + Math.sin(elapsedTime * 3) * 0.05

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
