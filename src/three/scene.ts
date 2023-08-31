// 场景组件
import * as THREE from 'three'

// 初始化场景
const scene = new THREE.Scene()

// 半球光
const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1)
scene.add(hemiLight)
// 环境光
const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.3)
scene.add(ambientLight)

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(100, 180, -4) // ~60º
light.castShadow = true // 如果设置为 true 该平行光会产生动态阴影
light.shadow.bias = -0.005
light.shadow.camera.near = 5
light.shadow.camera.far = 400
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
light.shadow.camera.left = -180
light.shadow.camera.right = 180
light.shadow.camera.top = 180
light.shadow.camera.bottom = -180
light.shadow.camera.updateProjectionMatrix()
scene.add(light)

export default scene
