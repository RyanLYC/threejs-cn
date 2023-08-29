import * as THREE from 'three'

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
})

renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度
renderer.shadowMap.enabled = true // 开启阴影

export default renderer
