import createShadowPlane from './mesh/ShadowPlane'
import LaiCheng from './mesh/LaiCheng'
import scene from './scene'
import type { DianGuiDataI } from '@/components/Scene/types'

let laiCheng: LaiCheng | null

/**创建laicheng 站点 */
export default function createLaiChengMesh(dianGuisDataList: DianGuiDataI[]) {
  // 创建站点
  laiCheng = new LaiCheng(scene, dianGuisDataList)
  // 创建投影平面
  const plane = createShadowPlane(370, 370)
  plane.position.y = 0.05
}
/** laicheng 动画更新 */
export function updateLaiChengMesh() {
  if (laiCheng) {
    laiCheng.update()
  }
}
/**点击laicheng机柜 */
export function clickLaiChengMesh(x: number, y: number) {
  if (laiCheng) {
    return laiCheng.selectCabinet(x, y)
  }
  return null
}

export function disposeLaiChengMesh() {
  if (laiCheng) {
    console.log('dispose LaiCheng Mesh')
    laiCheng.dispose()
    laiCheng = null
  }
}
