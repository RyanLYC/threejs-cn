// 相机组件
import * as THREE from 'three'
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerHeight / window.innerHeight,
  1,
  1000
)
// 设置相机位置
// camera.position.set(0, 60, 100)
camera.position.set(-50, 64, -108)

export default camera
