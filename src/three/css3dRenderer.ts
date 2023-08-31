// @ts-ignore
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js'

const renderer = new CSS3DRenderer()
renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度

// renderer.domElement.className = 'css3-renderer threejs-renderer'
const element = renderer.domElement as HTMLElement

element.style.position = 'absolute'
element.style.top = '0px'
element.style.left = '0px'
element.style.fontSize = '14px'
element.style.pointerEvents = 'none'

export default renderer
