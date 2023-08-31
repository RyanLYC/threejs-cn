// import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'
import renderer from './renderer'

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
// controls.enableDamping = true
// 设置自动旋转
// controls.autoRotate = true;

controls.maxPolarAngle = Math.PI / 2 // 你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。
controls.minPolarAngle = 0 // 你能够垂直旋转的角度的下限，范围是0到Math.PI，其默认值为0。

// controls.target.copy(
//   new THREE.Vector3(-49.75538734049477, 4.337308958193096, 2.1564683860978624)
// )

export default controls
