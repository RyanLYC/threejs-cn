import * as THREE from 'three'
import { createApp } from 'vue'
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
const fontPath = './models/fonts/optimer_regular.typeface.json'

/**
 * 返回包围盒的宽度，高度，和 深度
 * @param obj
 * @returns
 */
export function getObjSize(obj: THREE.Object3D) {
  const box3 = new THREE.Box3().setFromObject(obj)
  const size = new THREE.Vector3()
  box3.getSize(size)
  return size
}

/**
 * 将Object3d缩放至指定大小
 * @param obj  Object3d
 * @param width
 * @param height
 * @param depth
 */
export function scaleObj(
  obj: THREE.Object3D,
  width = 0,
  height = 0,
  depth = 0
) {
  const size = getObjSize(obj)
  const maxScaleRate = Math.max(width / size.x, height / size.y, depth / size.z)
  obj.scale.set(maxScaleRate, maxScaleRate, maxScaleRate)
}

/**
 * 获取Object3d对象的理论几何中心坐标,尺寸,实际几何中心坐标
 */
export function getObjBoundingRect(obj: THREE.Object3D) {
  const box3 = new THREE.Box3().setFromObject(obj)
  const size = new THREE.Vector3()
  const center = new THREE.Vector3()
  box3.getCenter(center)
  box3.getSize(size)
  return {
    size,
    center,
    position: obj.position.clone(),
  }
}

/**
 * 合成方法，获取对象的指定坐标
 * @param obj
 * @param vectorInModel
 * @returns
 */
export const getObjVertexVector = (
  obj: THREE.Object3D,
  vectorInModel = 'center'
) => {
  const { size, center } = getObjBoundingRect(obj)
  return getVertexVector(size, center, vectorInModel)
}

/**
 * 彻底移除对象
 */
export function cleanObj(obj: THREE.Object3D) {
  if (obj.children && obj.children.length) {
    obj.remove(...obj.children)
  }
  if (obj.parent) {
    obj.removeFromParent()
  }
}

/**
 * 获取模型外切长方体顶点坐标 center(模型中心) bbl(后面底部左顶点) bbr(后面底部右顶点) btl(后面顶部左顶点) btr(后面顶部右顶点) fbl(前面底部左顶点) fbr(前面底部右顶点) ftl(前面顶部左顶点) ftr(前面顶部右顶点)
 * @param size
 * @param center
 * @param vectorInModel
 * @returns
 */
export function getVertexVector(
  size: THREE.Vector3,
  center: THREE.Vector3,
  vectorInModel: string
) {
  const centerVector = center.clone()
  if (vectorInModel === 'center') {
    return centerVector
  }
  const halfSize = size.clone().divideScalar(2)
  if (vectorInModel === 'bbl') {
    // back-bottom-left
    return centerVector.add(halfSize.multiply(new THREE.Vector3(-1, -1, -1)))
  }
  if (vectorInModel === 'bbr') {
    // back-bottom-right
    return centerVector.add(halfSize.multiply(new THREE.Vector3(1, -1, -1)))
  }
  if (vectorInModel === 'btl') {
    // back-top-left
    return centerVector.add(halfSize.multiply(new THREE.Vector3(-1, 1, -1)))
  }
  if (vectorInModel === 'btr') {
    // back-top-right
    return centerVector.add(halfSize.multiply(new THREE.Vector3(1, 1, -1)))
  }
  if (vectorInModel === 'fbl') {
    // front-bottom-left
    return centerVector.add(halfSize.multiply(new THREE.Vector3(-1, -1, 1)))
  }
  if (vectorInModel === 'fbr') {
    // front-bottom-right
    return centerVector.add(halfSize.multiply(new THREE.Vector3(1, -1, 1)))
  }
  if (vectorInModel === 'ftl') {
    // front-top-left
    return centerVector.add(halfSize.multiply(new THREE.Vector3(-1, 1, 1)))
  }
  if (vectorInModel === 'ftr') {
    // front-top-right
    return centerVector.add(halfSize.multiply(new THREE.Vector3(1, 1, 1)))
  }
  if (vectorInModel === 'uc') {
    // upper-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(0, 1, 0)))
  }
  if (vectorInModel === 'dc') {
    // down-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(0, -1, 0)))
  }
  if (vectorInModel === 'lc') {
    // left-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(-1, 0, 0)))
  }
  if (vectorInModel === 'lbc') {
    // left-bottom-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(-1, -1, 0)))
  }
  if (vectorInModel === 'rc') {
    // right-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(1, 0, 0)))
  }
  if (vectorInModel === 'rbc') {
    // right-bottom-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(1, -1, 0)))
  }
  if (vectorInModel === 'fc') {
    // front-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(0, 0, -1)))
  }
  if (vectorInModel === 'bc') {
    // back-center
    return centerVector.add(halfSize.multiply(new THREE.Vector3(0, 0, 1)))
  }
  return centerVector
}

/**
 * 将模型的坐标移动到指定的坐标
 * @param vectorInParent 父节点坐标系中目标位置
 * @param vectorInModel 模型指定位置，默认使用模型中心，也可定义长方体的特殊点位 当值为null时使用模型默认位置，当值为数组时表示指定位置。center(模型中心) bbl(后面底部左顶点) bbr(后面底部右顶点) btl(后面顶部左顶点) btr(后面顶部右顶点) fbl(前面底部左顶点) fbr(前面底部右顶点) ftl(前面顶部左顶点) ftr(前面顶部右顶点)
 * @example 将模型的后左下角放到坐标原点
 * this.moveModelToPosition([0,0,0],'bbl')
 */
export function moveObjToPosition(
  obj: THREE.Object3D,
  vectorInParent = new THREE.Vector3(),
  vectorInModel = 'center'
) {
  const { size, position, center } = getObjBoundingRect(obj)
  const positionVector = getVertexVector(size, center, vectorInModel)
  obj.position.copy(vectorInParent.clone().sub(position).sub(positionVector))
}

export function createVueCss3Object(
  Component: any,
  userData: any,
  scaleRate = 0.01
) {
  const element = document.createElement('div') as HTMLElement
  const app = createApp(Component, {
    userData,
  })
  app.mount(element)

  const cssObj = new CSS3DObject(element)
  cssObj.scale.multiplyScalar(scaleRate)
  cssObj.element.style.pointerEvents = 'none'

  return cssObj
}

/**创建一个文本，因为需要加载字体，所以是一个promise */
export const createTextPromise = (textStr: string, color = 0xff0000) => {
  return new Promise<THREE.Mesh<TextGeometry, THREE.MeshBasicMaterial>>(
    (resolve) => {
      const loader = new FontLoader()
      loader.load(fontPath, (font) => {
        const textGeo = new TextGeometry(textStr, {
          font,
          size: 0.12,
          height: 0.01,
        })
        const material = new THREE.MeshBasicMaterial({ color })
        const textMesh = new THREE.Mesh(textGeo, material)
        textGeo.computeBoundingBox()
        resolve(textMesh)
      })
    }
  )
}
