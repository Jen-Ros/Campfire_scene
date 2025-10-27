import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

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
renderer.shadowMap.autoUpdate = true

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
const grassColor = textureLoader.load('./textures/grass/color.jpg')
const grassAO = textureLoader.load('./textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('./textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('./textures/grass/roughness.jpg')

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
        roughnessMap: grassRoughness,
        roughness: 0.8,
        metalness: 0.2
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
    new THREE.MeshStandardMaterial({ 
        color: '#c7b9a8',
        roughness: 0.7,
        metalness: 0.1
    })
)
tent.position.set(0, 0.6, 0)
tent.castShadow = true
tent.receiveShadow = true
camp.add(tent)

/**
 * Bonfire Logs 
 */
const logGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16)
const logMaterial = new THREE.MeshStandardMaterial({ 
    color: '#5a3e2b',
    roughness: 0.9,
    metalness: 0.05
})

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

// Additional front log 
const log5 = log1.clone()
log5.rotation.x = -Math.PI * 0.25
log5.position.set(0, 0.1, 0.6)

// Additional back log 
const log6 = log1.clone()
log6.rotation.x = Math.PI * 0.35
log6.position.set(0, 0.1, -0.6)

fireLogs.add(log1, log2, log3, log4, log5, log6)


/**
 * Log Chair 
 */
const chairGeometry = new THREE.CylinderGeometry(0.30, 0.30, 1.8, 16)
const chairMaterial = new THREE.MeshStandardMaterial({ 
    color: '#6b4a2b',
    roughness: 0.85,
    metalness: 0.05
})
const chairLog = new THREE.Mesh(chairGeometry, chairMaterial)
chairLog.rotation.z = Math.PI / 2        
chairLog.position.set(0, 0.2, 1.7)        
chairLog.castShadow = true
chairLog.receiveShadow = true
scene.add(chairLog)

/**
 * Lights
 */

// Ambient Light
const ambientLight = new THREE.AmbientLight('#404040', 0.3)
scene.add(ambientLight)

// Moon Light 
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.15)
moonLight.position.set(4, 5, -2)
moonLight.castShadow = true
scene.add(moonLight)

// Fire Lights - Multiple point lights for realistic fire effect
const fireLight1 = new THREE.PointLight('#ff7b00', 2.5, 8)
fireLight1.position.set(0, 0.3, 0)
fireLight1.castShadow = true
scene.add(fireLight1)

const fireLight2 = new THREE.PointLight('#ffaa00', 1.8, 6)
fireLight2.position.set(0.2, 0.2, 0.1)
fireLight2.castShadow = true
scene.add(fireLight2)

const fireLight3 = new THREE.PointLight('#ff6600', 1.2, 5)
fireLight3.position.set(-0.2, 0.25, -0.1)
fireLight3.castShadow = true
scene.add(fireLight3)

// Orange glow for warmer reflection
const fireGlow = new THREE.PointLight('#ff9933', 1.0, 10)
fireGlow.position.set(0, 0.5, 0)
scene.add(fireGlow)

// Ground reflection light for realistic fire on ground
const groundReflection = new THREE.PointLight('#ff7700', 0.8, 4)
groundReflection.position.set(0, 0.05, 0)
scene.add(groundReflection)

/**
 * Shadows Optimization
 */
moonLight.shadow.mapSize.width = 1024
moonLight.shadow.mapSize.height = 1024
moonLight.shadow.camera.near = 1
moonLight.shadow.camera.far = 15
moonLight.shadow.camera.top = 10
moonLight.shadow.camera.right = 10
moonLight.shadow.camera.bottom = -10
moonLight.shadow.camera.left = -10

fireLight1.shadow.mapSize.width = 512
fireLight1.shadow.mapSize.height = 512
fireLight1.shadow.camera.near = 0.1
fireLight1.shadow.camera.far = 8

fireLight2.shadow.mapSize.width = 256
fireLight2.shadow.mapSize.height = 256
fireLight2.shadow.camera.near = 0.1
fireLight2.shadow.camera.far = 6

fireLight3.shadow.mapSize.width = 256
fireLight3.shadow.mapSize.height = 256
fireLight3.shadow.camera.near = 0.1
fireLight3.shadow.camera.far = 5

groundReflection.shadow.mapSize.width = 512
groundReflection.shadow.mapSize.height = 512
groundReflection.shadow.camera.near = 0.05
groundReflection.shadow.camera.far = 4

/**
 * Pine Trees Around the Camp
 */
const trees = new THREE.Group()
scene.add(trees)

// Tree materials
const treeTrunkMaterial = new THREE.MeshStandardMaterial({ 
    color: '#4b2e05',
    roughness: 0.8,
    metalness: 0.1
})
const treeLeavesMaterial = new THREE.MeshStandardMaterial({ 
    color: '#0b3d02',
    roughness: 0.95,
    metalness: 0.0
})

for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const radius = 6 + Math.random() * 1.5 
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

    // Tree leaves 
    const leaves1 = new THREE.Mesh(
        new THREE.ConeGeometry(0.8, 1.5, 8),
        treeLeavesMaterial
    )
    leaves1.position.set(x, 1.5, z)
    leaves1.castShadow = true
    leaves1.receiveShadow = true

    const leaves2 = new THREE.Mesh(
        new THREE.ConeGeometry(0.6, 1.2, 8),
        treeLeavesMaterial
    )
    leaves2.position.set(x, 2.2, z)
    leaves2.castShadow = true
    leaves2.receiveShadow = true

    const leaves3 = new THREE.Mesh(
        new THREE.ConeGeometry(0.4, 0.8, 8),
        treeLeavesMaterial
    )
    leaves3.position.set(x, 2.7, z)
    leaves3.castShadow = true
    leaves3.receiveShadow = true

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
 * GUI
 */
const gui = new GUI()
const guiParams = {
    // Fire controls
    fireIntensity: 2.5,
    fireSpeed: 10,
    fireColor: '#ff7b00',
    
    // Moon light
    moonIntensity: 0.15,
    moonColor: '#b9d5ff',
    
    // Ambient light
    ambientIntensity: 0.3,
    
    // Fog
    fogNear: 1,
    fogFar: 15,
    fogColor: '#0a0a0a',
    
    // Camera position
    cameraX: 4,
    cameraY: 2,
    cameraZ: 5,
    
    // Show helpers
    showHelpers: false
}

// Create light helpers for visualization
const fireLight1Helper = new THREE.PointLightHelper(fireLight1, 0.2)
const moonLightHelper = new THREE.DirectionalLightHelper(moonLight, 0.5)
scene.add(fireLight1Helper, moonLightHelper)
fireLight1Helper.visible = false
moonLightHelper.visible = false

// Fire Lights folder
const fireFolder = gui.addFolder('Fire Lights')
fireFolder.add(guiParams, 'fireIntensity', 0, 5).onChange(value => {
    fireLight1.intensity = value * 1.0
    fireLight2.intensity = value * 0.7
    fireLight3.intensity = value * 0.5
    fireGlow.intensity = value * 0.4
    groundReflection.intensity = value * 0.32
})
fireFolder.add(guiParams, 'fireSpeed', 1, 30)
fireFolder.addColor(guiParams, 'fireColor').onChange(color => {
    fireLight1.color.setHex(color.replace('#', '0x'))
    fireLight2.color.setHex(color.replace('#', '0x'))
    fireLight3.color.setHex(color.replace('#', '0x'))
    groundReflection.color.setHex(color.replace('#', '0x'))
})

// Moon Light folder
const moonFolder = gui.addFolder('Moon Light')
moonFolder.add(guiParams, 'moonIntensity', 0, 1).onChange(value => {
    moonLight.intensity = value
})
moonFolder.addColor(guiParams, 'moonColor').onChange(color => {
    moonLight.color.setHex(color.replace('#', '0x'))
})

// Ambient Light folder
const ambientFolder = gui.addFolder('Ambient Light')
ambientFolder.add(guiParams, 'ambientIntensity', 0, 2).onChange(value => {
    ambientLight.intensity = value
})

// Fog folder
const fogFolder = gui.addFolder('Fog')
fogFolder.add(guiParams, 'fogNear', 0, 5).onChange(value => {
    scene.fog.near = value
})
fogFolder.add(guiParams, 'fogFar', 1, 50).onChange(value => {
    scene.fog.far = value
})
fogFolder.addColor(guiParams, 'fogColor').onChange(color => {
    scene.fog.color.setHex(color.replace('#', '0x'))
    renderer.setClearColor(color)
})

// Camera folder
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(guiParams, 'cameraX', -10, 10).onChange(value => {
    camera.position.x = value
})
cameraFolder.add(guiParams, 'cameraY', 0, 10).onChange(value => {
    camera.position.y = value
})
cameraFolder.add(guiParams, 'cameraZ', -10, 10).onChange(value => {
    camera.position.z = value
})
cameraFolder.add(guiParams, 'cameraX', -10, 10).listen()
cameraFolder.add(guiParams, 'cameraY', 0, 10).listen()
cameraFolder.add(guiParams, 'cameraZ', -10, 10).listen()

// Helpers folder
const helpersFolder = gui.addFolder('Debug Helpers')
helpersFolder.add(guiParams, 'showHelpers').onChange(value => {
    fireLight1Helper.visible = value
    moonLightHelper.visible = value
})

gui.close() // Start with GUI closed

/**
 * Animation
 */
const clock = new THREE.Clock()
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Realistic fire flicker with multiple lights moving independently
    const flicker1 = Math.sin(elapsedTime * guiParams.fireSpeed)
    const flicker2 = Math.sin(elapsedTime * guiParams.fireSpeed * 1.3)
    const flicker3 = Math.sin(elapsedTime * guiParams.fireSpeed * 0.8)
    const flicker4 = Math.sin(elapsedTime * guiParams.fireSpeed * 1.1)
    const flicker5 = Math.sin(elapsedTime * guiParams.fireSpeed * 0.9)
    
    fireLight1.intensity = guiParams.fireIntensity * (1.0 + flicker1 * 0.15)
    fireLight1.position.y = 0.3 + Math.sin(elapsedTime * 3) * 0.08
    fireLight1.position.x = 0 + Math.sin(elapsedTime * 2.5) * 0.1
    
    fireLight2.intensity = guiParams.fireIntensity * 0.7 * (1.0 + flicker2 * 0.2)
    fireLight2.position.x = 0.2 + Math.sin(elapsedTime * 2.8) * 0.15
    fireLight2.position.y = 0.2 + Math.sin(elapsedTime * 3.2) * 0.08
    
    fireLight3.intensity = guiParams.fireIntensity * 0.5 * (1.0 + flicker3 * 0.25)
    fireLight3.position.x = -0.2 + Math.sin(elapsedTime * 2.3) * 0.12
    fireLight3.position.y = 0.25 + Math.sin(elapsedTime * 3.5) * 0.06
    
    fireGlow.intensity = guiParams.fireIntensity * 0.4 * (1.0 + flicker4 * 0.1)
    fireGlow.position.y = 0.5 + Math.sin(elapsedTime * 2) * 0.15
    
    groundReflection.intensity = guiParams.fireIntensity * 0.32 * (1.0 + flicker5 * 0.15)
    
    // Update helpers if visible
    if (guiParams.showHelpers) {
        fireLight1Helper.update()
        moonLightHelper.update()
    }
    
    // Update camera parameters in GUI
    guiParams.cameraX = camera.position.x
    guiParams.cameraY = camera.position.y
    guiParams.cameraZ = camera.position.z

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()
