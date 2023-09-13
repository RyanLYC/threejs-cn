import * as THREE from 'three'
import createShadowPlane from './mesh/ShadowPlane'
import LaiCheng from './mesh/LaiCheng'
import scene from './scene'
import type { DianGuiDataI } from '@/components/Scene/types'
import BatteryCabinet from './mesh/BatteryCabinet'
import ClusterModel from './mesh/ClusterModel'

let laiCheng: LaiCheng | null
let batteryCabinet: BatteryCabinet | null
let clusterModel: ClusterModel | null
let plane: THREE.Mesh | null

/**创建laicheng 站点 */
export default function createLaiChengMesh(dianGuisDataList: DianGuiDataI[]) {
  // 创建站点
  laiCheng = new LaiCheng(scene, dianGuisDataList)
  // 创建投影平面
  plane = createShadowPlane(370, 370)
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
/** 销毁laicheng */
export function disposeLaiChengMesh() {
  console.log('dispose LaiCheng Mesh')
  if (plane) {
    scene.remove(plane)
  }
  if (laiCheng) {
    laiCheng.dispose()
    laiCheng = null
  }
  if (batteryCabinet) {
    batteryCabinet.dispose()
    batteryCabinet = null
  }
  if (clusterModel) {
    clusterModel.dispose()
    clusterModel = null
  }
}
/** 创建电池柜 */
export function createBatteryCabinetMesh(batteryData: any, cuList: any[]) {
  batteryCabinet = new BatteryCabinet(scene, batteryData, cuList)
  // 创建投影平面
  plane = createShadowPlane(50, 50)
  plane.position.y = -2.2
}

/**点击电池簇 */
export function clickBatteryCluster(x: number, y: number) {
  if (batteryCabinet) {
    return batteryCabinet.selectBatteryCluster(x, y)
  }
  return null
}

/**创建电池pack */
export function createBatteryCluster(cuData: any) {
  clusterModel = new ClusterModel(
    scene,
    { vectorInParent: new THREE.Vector3(0, 0, 0) },
    cuData,
    null,
    '01'
  )
  // 创建投影平面
  plane = createShadowPlane(50, 50)
  plane.position.y = -2.2
}

export function clickBatteryPack(x: number, y: number) {
  if (clusterModel) {
    clusterModel.selectBatteryPack(x, y)
  }
}

export function updateBatteryCluster() {
  if (clusterModel) {
    clusterModel.update()
  }
}
