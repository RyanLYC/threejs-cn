import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { positionList } from './position'

/**
 * laicheng 对象
 */
export default class TreeModel {
  scene: THREE.Scene
  loader: GLTFLoader
  gltf: GLTF | null = null

  constructor(scene: THREE.Scene) {
    // 载入模型
    this.scene = scene
    this.loader = new GLTFLoader()
    // const dracoLoader = new DRACOLoader()
    // dracoLoader.setDecoderPath('./draco/')
    // this.loader.setDRACOLoader(dracoLoader)
    this.loader.load('./models/laicheng/tree.gltf', (gltf) => {
      console.log(gltf)
      // 从加载到的 gltf 对象中获取场景中的 Mesh
      const modelMesh = gltf.scene.children[0] as THREE.Mesh
      // 创建 InstancedMesh
      const numInstances = positionList.length // 实例数量
      const instancedMesh = new THREE.InstancedMesh(
        modelMesh.geometry,
        modelMesh.material,
        numInstances
      )
      instancedMesh.castShadow = true
      // 随机放置实例
      const matrix = new THREE.Matrix4()
      const position = new THREE.Vector3()
      const quaternion = new THREE.Quaternion()
      const scale = new THREE.Vector3()
      const scaleNumber = 4

      for (let i = 0; i < numInstances; i++) {
        position.set(positionList[i][0], positionList[i][1], positionList[i][2])
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2)
        const t = Math.random() * (Math.random() > 0.5 ? -1 : 1)
        scale.set(scaleNumber, scaleNumber, scaleNumber + t)

        // 构建变换矩阵
        matrix.compose(position, quaternion, scale)
        instancedMesh.setMatrixAt(i, matrix)
      }
      this.scene.add(instancedMesh)
    })
  }
}
