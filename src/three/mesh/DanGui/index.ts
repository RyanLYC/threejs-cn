import { createApp, watch } from 'vue'
import type THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { scaleObj, getObjSize, cleanObj } from '../../objUtil'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import ModelTag from './ModelTag.vue'
import mixer from '../../mixer'
import type { DianGuiDataI } from '@/components/Scene/types'

interface OptionsI {
  rotation: THREE.Vector3
  vectorInParent: THREE.Vector3
  // vectorInModel: string
  // size: THREE.Vector3
  // position: THREE.Vector3
}

/**
 * laicheng 对象
 */
export default class DanGui {
  scene: THREE.Scene
  loader: GLTFLoader
  gltf: GLTF | null = null
  options: OptionsI | null = null

  physicalSizeX = 13.1 // 模型物理长度

  physicalSizeY = 3.46 // 模型物理高度

  physicalSizeZ = 4.09 // 模型物理宽度

  cssObj: CSS3DObject | null = null

  action: THREE.AnimationAction | null = null
  dianGuiData: DianGuiDataI

  constructor(
    scene: THREE.Scene,
    options: OptionsI,
    cabinets: THREE.Group[],
    dianGuiData: DianGuiDataI
  ) {
    // 载入模型
    this.scene = scene
    this.dianGuiData = dianGuiData
    this.loader = new GLTFLoader()

    this.loader.load('./models/laicheng/dangui_animation.gltf', (gltf) => {
      this.gltf = gltf
      cabinets.push(this.gltf.scene)

      this.options = options
      scene.add(gltf.scene)

      // 旋转
      if (this.options.rotation) {
        this.gltf.scene.rotation.set(
          options.rotation.x,
          options.rotation.y,
          options.rotation.z
        )
      }
      // 位置
      options.vectorInParent.x -= 0.5
      options.vectorInParent.y -= this.physicalSizeY
      this.gltf.scene.position.copy(options.vectorInParent)

      gltf.scene.traverse((child) => {
        this.initMesh(child as THREE.Mesh)
      })

      this.scale()
      this.createNameLabel()
      this.handleChargeAnimation()
    })
  }
  initMesh(child: THREE.Mesh) {
    if (child.isMesh) {
      // child.frustumCulled = false // 当这个设置了的时候，每一帧渲染前都会检测这个物体是不是在相机的视椎体范围内。 如果设置为false 物体不管是不是在相机的视椎体范围内都会渲染。默认为true。
      const material = child.material as THREE.MeshStandardMaterial
      material.depthWrite = true
      if (['充电', '充电01', '放电', '放电01', '停机'].includes(child.name)) {
        material.transparent = true
        child.castShadow = false
      } else {
        material.transparent = false
        child.castShadow = true
      }
      // @ts-ignore 为点击事件 自定义一个属性 返回 数据 索引
      child.customIndex = this.dianGuiData.index
    }
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
  //  创建储能柜铭牌
  createNameLabel() {
    if (this.cssObj) {
      return this.cssObj
    }
    if (this.gltf) {
      const size = getObjSize(this.gltf.scene)
      const element = document.createElement('div') as HTMLElement

      const app = createApp(ModelTag, {
        userData: this.dianGuiData,
      })
      app.mount(element)

      this.cssObj = new CSS3DObject(element)
      this.cssObj.scale.multiplyScalar(0.2)
      this.cssObj.element.style.pointerEvents = 'none'
      this.cssObj.rotation.set(Math.PI / 2, Math.PI, 0)

      const position = this.options!.vectorInParent.clone()
      position.x -= size.x / 2 + 2.1
      this.cssObj.position.copy(position)

      this.scene.add(this.cssObj)
    }
  }
  setStatus(name: string, name1: string | null, visible: boolean) {
    const obj = this.gltf!.scene.getObjectByName(name)
    if (obj) {
      obj.visible = visible
    }
    if (name1) {
      const obj2 = this.gltf!.scene.getObjectByName(name1)
      if (obj2) {
        obj2.visible = visible
      }
    }
  }

  setCharge(visible: boolean) {
    this.setStatus('充电', '充电01', visible)
  }

  setDischarge(visible: boolean) {
    this.setStatus('放电', '放电01', visible)
  }

  setStop(visible: boolean) {
    this.setStatus('停机', null, visible)
  }

  getModelAction(animationName: string) {
    this.action = null
    if (this.gltf) {
      const { animations } = this.gltf

      if (Array.isArray(animations) && animations.length) {
        const clip = animations.find((item) => item.name === animationName)
        if (clip) {
          this.action = mixer.clipAction(clip, this.gltf.scene)
        }
      }
    }
  }

  /** 处理充放电动画 */
  handleChargeAnimation() {
    // 运行状态  1：停机 2：待机 3：充电 4：放电 其他值:未知
    watch(
      this.dianGuiData.runStatus,
      () => {
        // console.log('this.userData.runStatus:', this.dianGuiData.runStatus)
        if (this.action) {
          this.action.stop()
        }
        const runStatusVal = this.dianGuiData.runStatus?.val
        this.setCharge(+runStatusVal === 3)
        this.setDischarge(+runStatusVal === 4)
        this.setStop(+runStatusVal === 1)
        if (+runStatusVal === 3) {
          this.getModelAction('charge')
        } else if (+runStatusVal === 4) {
          this.getModelAction('discharge')
        } else if (+runStatusVal === 1) {
          this.getModelAction('tingji')
        } else {
          this.action = null
        }
        if (this.action) {
          this.action.play()
        }
      },
      { immediate: true }
    )
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
