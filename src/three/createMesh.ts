import createShadowPlane from './mesh/ShadowPlane'
import LaiCheng from './mesh/LaiCheng'
import scene from './scene'

let laiCheng: LaiCheng

/**创建物体组件 */
export default function createMesh() {
  // 创建站点
  laiCheng = new LaiCheng(scene)
  // 创建投影平面
  const plane = createShadowPlane(370, 370)
  plane.position.y = 0.05
}

export function updateMesh() {
  laiCheng.update()
}
