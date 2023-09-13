import * as THREE from 'three'
import scene from '../../scene'

/**
 * 创建投影平面
 * @param width 平面宽
 * @param height 平面高
 * @param opacity 透明度 默认值 0.3
 */
export default function createShadowPlane(
  width: number,
  height: number,
  opacity = 0.3
) {
  const planeGeometry = new THREE.PlaneGeometry(width, height)
  planeGeometry.rotateX(-Math.PI / 2)
  const planeMaterial = new THREE.ShadowMaterial({
    color: 0x000000,
    opacity,
  })
  // const planeMaterial = new THREE.MeshBasicMaterial({
  //   color: 0xff0000,
  //   opacity,
  // })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)
  plane.name = '接收阴影的平面'
  plane.receiveShadow = true
  scene.add(plane)

  return plane
}
