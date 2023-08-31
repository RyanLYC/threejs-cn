import * as THREE from 'three'
import camera from './camera'
import renderer from './renderer'
import controls from './controls'
import scene from './scene'
import css3dRenderer from '@/three/css3dRenderer'
import mixer from './mixer'
import { updateMesh } from './createMesh'

const clock = new THREE.Clock()
function animate() {
  const delta = clock.getDelta()
  mixer.update(delta)

  controls.update()

  updateMesh()

  requestAnimationFrame(animate)
  // 使用渲染器渲染相机看这个场景的内容渲染出来
  renderer.render(scene, camera)
  css3dRenderer.render(scene, camera)
}

export default animate
