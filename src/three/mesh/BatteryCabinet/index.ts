import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  scaleObj,
  cleanObj,
  getObjVertexVector,
  createVueCss3Object,
} from '../../objUtil'
import type { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import NameLabel from './NameLabel.vue'
import ClusterModel from '../ClusterModel'
import raycasterModlue from '../../raycaster'

/**
 * laicheng 对象
 */
export default class BatteryCabinet {
  scene: THREE.Scene
  loader: GLTFLoader
  gltf: GLTF | null = null

  // 设备物理尺寸
  physicalSizeX = 13.1

  physicalSizeZ = 3.17

  physicalSizeY = 4.1

  cssObj: CSS3DObject | null = null

  cuList: any[] = []
  batteryData: any = null

  /**电池簇集合 */
  batteryClusters: THREE.Group[] = []
  clusterModel: ClusterModel[] = []

  constructor(scene: THREE.Scene, batteryData: any, cuList: any) {
    // 载入模型
    this.scene = scene

    this.cuList = cuList
    this.batteryData = batteryData
    this.loader = new GLTFLoader()

    this.loader.load('./models/laicheng/phase.gltf', (gltf) => {
      this.gltf = gltf
      // console.log('BatteryCabinet', this.gltf)
      scene.add(gltf.scene)

      gltf.scene.traverse((child) => {
        child.frustumCulled = false
        if ((child as THREE.Mesh).isMesh) {
          child.castShadow = true
          if (child.name === '液冷001') {
            child.castShadow = false
          }
        }
      })

      this.scale()
      this.addNameLabel()
      this.handlePhaseDevice()
      this.addClusterModels()
    })
  }

  // 按物理大小 缩放站点模型
  scale() {
    scaleObj(
      this.gltf!.scene,
      this.physicalSizeX,
      this.physicalSizeY,
      this.physicalSizeZ
    )
  }

  addNameLabel() {
    if (this.cssObj) {
      return this.cssObj
    }
    if (this.gltf && this.batteryData) {
      this.cssObj = createVueCss3Object(NameLabel, {
        unitCode: this.batteryData.unitCode,
        phaseCode: String(this.batteryData.phaseCode).toUpperCase(),
      })
      const zhanweiobj = this.gltf.scene.getObjectByName('zhanweimingpai')
      if (zhanweiobj) {
        // 加到本来的物体上
        this.cssObj.rotation.set(0, Math.PI / 2, 0)
        this.cssObj.position.copy(zhanweiobj.position)
        this.gltf.scene.add(this.cssObj)
        // 加到  this.scene 上
        // const vector = getObjVertexVector(zhanweiobj, 'lc')
        // this.cssObj.rotation.set(0, Math.PI / 2, 0)
        // this.cssObj.position.copy(vector)
        // this.scene.add(this.cssObj)
      }
    }
  }

  handlePhaseDevice() {
    if (this.gltf) {
      const obj = this.gltf.scene.getObjectByName('zhanweisb')
      if (obj) {
        obj.visible = false
      }
    }
  }
  addClusterModels() {
    if (this.cuList.length && this.gltf) {
      this.batteryClusters = []
      this.clusterModel = []
      this.cuList.forEach((cuData) => {
        const cuCode = cuData.cuCode.toString().padStart(2, '0')
        const obj = this.gltf!.scene.getObjectByName(`zhanwei${cuCode}`)
        if (obj) {
          // const { position, center, size } = getObjBoundingRect(obj)
          // const vector = getVertexVector(size, center, 'dc')
          // console.log(
          //   'position:',
          //   `x:${position.x},y:${position.y},z:${position.z}`
          // )
          // console.log('vector:', `x:${vector.x},y:${vector.y},z:${vector.z}`)
          const model = new ClusterModel(
            this.gltf!.scene as any,
            {
              vectorInParent: obj.position.clone(),
              rotation:
                cuData.cuCode > 8
                  ? new THREE.Vector3(0, -Math.PI / 2, 0)
                  : new THREE.Vector3(0, Math.PI / 2, 0),
            },
            cuData,
            this.batteryClusters
          )
          this.clusterModel.push(model)
        }
      })
    }
  }

  /**选择电池簇 */
  selectBatteryCluster(x: number, y: number) {
    let data = null
    raycasterModlue.setFromCamera(x, y)
    // 选择机柜
    const intersect = raycasterModlue.raycaster.intersectObjects(
      this.batteryClusters
    )[0]
    const intersectObj = intersect ? intersect.object : null
    // console.log('intersectObj:', intersectObj)
    // @ts-ignore
    if (intersectObj && intersectObj.cuDataId !== undefined) {
      // @ts-ignore
      const cuDataId = intersectObj.cuDataId
      console.log('cuDataId:', cuDataId)
      data = this.cuList.find((item) => item.id === cuDataId)
      console.log('data:', data)
    }
    return data
  }

  /**
   * 销毁模型
   */
  dispose() {
    this.clusterModel.forEach((item) => {
      item.dispose()
    })
    if (this.gltf) {
      cleanObj(this.gltf.scene)
      this.gltf = null
    }
  }
}
