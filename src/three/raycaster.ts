import * as THREE from 'three'
import renderer from './renderer'
import camera from './camera'

class RaycasterModlue {
  /** 鼠标在裁剪空间中的点位 */
  pointer = new THREE.Vector2()
  raycaster: THREE.Raycaster

  constructor() {
    this.raycaster = new THREE.Raycaster()
  }

  setFromCamera(x: number, y: number) {
    const { width, height } = renderer.domElement
    this.raycaster.setFromCamera(this.pointer, camera)
    // 鼠标的canvas坐标转裁剪坐标
    this.pointer.set((x / width) * 2 - 1, -(y / height) * 2 + 1)
    // 基于鼠标点和相机设置射线投射器
    this.raycaster.setFromCamera(this.pointer, camera)
  }
}

export default new RaycasterModlue()
