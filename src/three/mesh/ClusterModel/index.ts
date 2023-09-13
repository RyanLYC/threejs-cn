import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import {
  cleanObj,
  createTextPromise,
  getObjBoundingRect,
  getVertexVector,
} from '../../objUtil'
import lightMaterial from '@/three/modify/lightMaterial'
import raycasterModlue from '../../raycaster'

interface OptionsI {
  rotation?: THREE.Vector3
  vectorInParent: THREE.Vector3
  // vectorInModel: string
  // size: THREE.Vector3
  // position: THREE.Vector3
}

/**
 * laicheng 对象
 */
export default class ClusterModel {
  scene: THREE.Scene
  loader: GLTFLoader
  gltf: GLTF | null = null
  options: OptionsI | null = null
  cuData: any = null
  batteryPacks: any[] = []
  glowMesh: THREE.Mesh | null = null

  constructor(
    scene: THREE.Scene,
    options: OptionsI,
    cuData: any,
    batteryClusters: THREE.Group[] | null = null,
    showCode: string | null = null
  ) {
    // 载入模型
    this.scene = scene
    this.cuData = cuData
    this.loader = new GLTFLoader()

    this.loader.load('./models/laicheng/cluster.gltf', (gltf) => {
      this.gltf = gltf
      console.log('cluster:', this.gltf)
      if (batteryClusters) {
        batteryClusters.push(this.gltf.scene)
      }

      this.options = options
      scene.add(gltf.scene)

      // 旋转
      if (this.options.rotation) {
        this.gltf.scene.rotation.set(
          this.options.rotation.x,
          this.options.rotation.y,
          this.options.rotation.z
        )
      }
      // 位置
      this.gltf.scene.position.copy(options.vectorInParent)

      this.addPackLabel()

      this.batteryPacks = []
      gltf.scene.traverse((child) => {
        if (child.name === '架子') {
          child.castShadow = true
        }
        if (child.name.includes('pack0')) {
          child.castShadow = true
          this.batteryPacks.push(child)
        }
        // @ts-ignore 为点击事件 自定义一个属性
        child.cuDataId = this.cuData.id
      })
      if (showCode) {
        this.handleStateActiveCode(showCode)
      }
    })
  }

  addPackLabel() {
    if (this.gltf) {
      const obj = this.gltf.scene.getObjectByName(`biaoshi00`)
      if (obj) {
        createTextPromise(`${this.cuData.cuCode}#`, 0xffffff).then((mesh) => {
          mesh.rotation.set(0, Math.PI / 2, 0)
          mesh.scale.multiplyScalar(0.8)

          obj.position.z += 0.1
          obj.position.y -= 0.1

          mesh.position.copy(obj.position)
          this.gltf!.scene.add(mesh)
        })
      }
    }
  }
  handleStateActiveCode(code: string) {
    if (this.gltf) {
      const obj = this.gltf.scene.getObjectByName(`pack${code}`)
      if (obj) {
        const { size, position } = getObjBoundingRect(obj)
        obj.position.set(position.x + size.x / 4, position.y, position.z)

        const material = lightMaterial('#1ae0ff')
        // const { center } = getObjBoundingRect(obj)
        // const vector = getVertexVector(size, center, 'center')
        size.multiplyScalar(1.002)
        const boxGeometry = new THREE.BoxGeometry(size.x, size.y, size.z)

        this.glowMesh = new THREE.Mesh(boxGeometry, material)
        // mesh.frustumCulled = false
        // this.glowMesh.position.set(vector.x, vector.y, vector.z)
        this.glowMesh.position.copy(obj.position)
        this.gltf.scene.add(this.glowMesh)

        // @ts-ignore
        const preLineName = `line${String(+code - 1).padStart(2, '0')}`
        const prevLine = this.gltf.scene.getObjectByName(preLineName)
        if (prevLine) {
          prevLine.visible = false
        }
        const nextLineName = `line${code}`
        const nextLine = this.gltf.scene.getObjectByName(nextLineName)
        if (nextLine) {
          nextLine.visible = false
        }
      }
    }
  }

  update() {
    if (this.glowMesh) {
      // this.glowMesh.material.uniforms.viewVector.value =
      //   new THREE.Vector3().subVectors(camera.position, this.glowMesh.position)
    }
  }

  /**选择电池簇 */
  selectBatteryPack(x: number, y: number) {
    const data = null
    raycasterModlue.setFromCamera(x, y)
    // 选择机柜
    const intersect = raycasterModlue.raycaster.intersectObjects(
      this.batteryPacks
    )[0]
    const intersectObj = intersect ? intersect.object : null
    if (intersectObj && intersectObj.parent?.name) {
      const name = intersectObj.parent?.name
      const code = name.replace('pack', '')
      console.log('code:', code)

      this.handleStateActiveCode(code)
    }

    return data
  }

  /**
   * 销毁模型
   */
  dispose() {
    if (this.gltf) {
      cleanObj(this.gltf.scene)
      this.gltf = null
    }
  }
}
