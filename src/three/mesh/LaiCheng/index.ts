import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { scaleObj, cleanObj } from '../../objUtil'
import DianGui from '../DanGui'
import texturePath from './texture.png'
import TreeModel from '../TreeModel'
import raycasterModlue from '../../raycaster'
import type { DianGuiDataI } from '@/components/Scene/types'

/**
 * laicheng 对象
 */
export default class LaiCheng {
  scene: THREE.Scene
  loader: GLTFLoader
  gltf: GLTF | null = null

  physicalSizeX = 371 // 模型物理长度

  physicalSizeY = 12.5 // 模型物理高度

  physicalSizeZ = 371 // 模型物理宽度

  tubeMaterial: THREE.MeshBasicMaterial | null = null

  /**机柜集合 */
  cabinets: THREE.Group[] = []
  dianGuis: DianGui[] = []
  dianGuisDataList: DianGuiDataI[]

  constructor(scene: THREE.Scene, dianGuisDataList: DianGuiDataI[]) {
    // 载入模型
    this.scene = scene
    this.dianGuisDataList = dianGuisDataList
    this.loader = new GLTFLoader()
    // const dracoLoader = new DRACOLoader()
    // dracoLoader.setDecoderPath('./draco/')
    // this.loader.setDRACOLoader(dracoLoader)
    this.loader.load('./models/laicheng/station.gltf', (gltf) => {
      console.log(gltf)

      scene.add(gltf.scene)

      this.gltf = gltf
      gltf.scene.traverse((child) => {
        this.initMesh(child as THREE.Mesh)
      })

      this.scale()
      // 添加电柜
      this.addDanguis()
      // 显示电路
      this.handleStateLine()
      // 添加树木模型
      this.addTreeModel()
    })
  }

  initMesh(child: THREE.Mesh) {
    if (child.isMesh) {
      // child.frustumCulled = false // 当这个设置了的时候，每一帧渲染前都会检测这个物体是不是在相机的视椎体范围内。 如果设置为false 物体不管是不是在相机的视椎体范围内都会渲染。默认为true。
      const material = child.material as THREE.MeshStandardMaterial
      material.transparent = false // 定义此材质是否透明
      material.depthWrite = true // 渲染此材质是否对深度缓冲区有任何影响。默认为true。
      if (
        [
          '高压01',
          '高压02',
          '高压03',
          '高压04',
          '液流储能',
          '立方体002',
          '立方体006',
          '柱体003',
          '柱体004',
          '柱体005',
          '柱体006',
          '柱体007',
          '柱体008',
          '柱体009',
          '柱体010',
          '柱体011',
          '液冷柜_1',
          '液冷柜_2',
          '液冷柜_3',
          '液冷柜',
          '综合舱',
        ].includes(child.name)
      ) {
        child.castShadow = true // 对象是否被渲染到阴影贴图中。默认值为false。
      } else {
        child.castShadow = false
      }
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
  /**添加电柜 */
  addDanguis() {
    if (this.gltf) {
      this.dianGuis = []
      this.dianGuisDataList.forEach((item) => {
        const { unitCode, phaseCode } = item
        const obj = this.gltf!.scene.getObjectByName(
          `zhanwei${unitCode}${phaseCode}`
        )
        // console.log('obj:', obj)
        if (obj) {
          // const { size, center } = getObjBoundingRect(obj)
          // const vector = getVertexVector(size, center, 'rbc')
          // console.log('vector:', vector)
          // console.log('obj position:', obj.position.clone())
          const dianGui = new DianGui(
            this.gltf!.scene as any,
            {
              vectorInParent: obj.position.clone(),

              rotation:
                (unitCode === 6 && phaseCode === 'c') || unitCode >= 7
                  ? new THREE.Vector3(0, Math.PI, 0)
                  : new THREE.Vector3(),
            },
            this.cabinets,
            item
          )
          this.dianGuis.push(dianGui)
          obj.removeFromParent()
        }
      })
    }
  }
  /** 电路显示 */
  handleStateLine() {
    const group = new THREE.Group()

    const texture = new THREE.TextureLoader().load(texturePath)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.rotation = Math.PI / 2
    // texture.repeat.set(1, 10)
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    })
    const material2 = new THREE.MeshBasicMaterial({
      transparent: true,
      color: 0x78c7ff,
      opacity: 0.2,
      depthTest: false,
    })
    const lines = [
      [
        [-1.8, -46.85, 0.85],
        [-8, -46.85, 0.85],
        // [-8, -26.87, 0.85],
        [-8, -7, 0.85],
        [-12.5, -7, 0.85],
      ],
      [
        [-8, -26.87, 0.85],
        [-12.5, -26.87, 0.85],
      ],
      [
        [-41.9, -59.2, 0.85],
        [-41.9, -54.5, 0.85],
        [-21.5, -54.5, 0.85],
        [-21.5, -46.85, 0.85],
      ],
      [
        [-29, -54.5, 0.85],
        [-29, -33.1, 0.85],
        [-31.9, -33.1, 0.85],
      ],
      [
        [-46.9, -59.2, 0.85],
        [-46.9, 6.7, 0.85],
        [-44.6, 6.7, 0.85],
      ],
      [
        [-46.9, -14.1, 0.85],
        [-44.6, -14.1, 0.85],
      ],
      [
        [-57.4, -59.2, 0.85],
        [-57.4, -54.5, 0.85],
        [-48.8, -54.5, 0.85],
        [-48.8, 6.7, 0.85],
        [-51.4, 6.7, 0.85],
      ],
      [
        [-48.8, -7, 0.85],
        [-51.4, -7, 0.85],
      ],
      [
        [-63.2, -59.2, 0.85],
        [-63.2, -54.5, 0.85],
        [-66.5, -54.5, 0.85],
        [-66.5, -33, 0.85],
        [-64.1, -33, 0.85],
      ],
      [
        [-66.5, -45.9, 0.85],
        [-71.5, -45.9, 0.85],
      ],
      [
        [-73, -59.2, 0.85],
        [-73, -53.9, 0.85],
        [-87.1, -53.9, 0.85],
        [-87.1, -7, 0.85],
        [-84.2, -7, 0.85],
      ],
      [
        [-78.7, -59.2, 0.85],
        [-78.7, -55.6, 0.85],
        [-88.9, -55.6, 0.85],
        [-88.9, 12.47, 0.85],
        [-84.2, 12.47, 0.85],
      ],
    ]
    lines.forEach((linePoints) => {
      const linePointsVector = [
        ...linePoints.map((points) => {
          return new THREE.Vector3(points[0], points[2], -points[1])
        }),
      ]
      const path = new THREE.CatmullRomCurve3(
        linePointsVector,
        false,
        'catmullrom',
        0
      )
      // 外管
      const tubeGeometry = new THREE.TubeGeometry(path, 64, 0.42, 8, false)
      const tubeMesh = new THREE.Mesh(tubeGeometry, material2)
      group.add(tubeMesh)
      // 内管
      const tubeGeometry2 = new THREE.TubeGeometry(path, 64, 0.1, 8, false)
      const tubeMesh2 = new THREE.Mesh(tubeGeometry2, material)
      group.add(tubeMesh2)
    })
    this.tubeMaterial = material
    group.visible = true
    this.gltf?.scene.add(group)
  }

  update() {
    if (this.tubeMaterial && this.tubeMaterial.map) {
      let y = this.tubeMaterial.map.offset.y
      y += 0.02
      this.tubeMaterial.map.offset.y = y % 1
    }
  }

  /** 添加树木模型*/
  addTreeModel() {
    if (this.gltf) {
      new TreeModel(this.gltf.scene as any)
    }
  }

  /**选择电池柜 */
  selectCabinet(x: number, y: number) {
    let data = null
    raycasterModlue.setFromCamera(x, y)
    // 选择机柜
    const intersect = raycasterModlue.raycaster.intersectObjects(
      this.cabinets
    )[0]
    const intersectObj = intersect ? intersect.object : null
    // console.log('intersectObj:', intersectObj)
    // @ts-ignore
    if (intersectObj && intersectObj.customIndex !== undefined) {
      // @ts-ignore
      const index = intersectObj.customIndex
      data = this.dianGuisDataList[index]
      console.log('data:', data)
    }
    return data
  }

  /**
   * 销毁模型
   */
  dispose() {
    if (this.gltf) {
      this.dianGuis.forEach((item) => {
        item.dispose()
      })
      cleanObj(this.gltf.scene)
      this.gltf = null
    }
  }
}
