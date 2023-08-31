import * as THREE from 'three'

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true, // 抗锯齿
  alpha: true,
  // logarithmicDepthBuffer: true,
})

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight) // 设置渲染器的大小为窗口的内宽度，也就是内容区的宽度
renderer.shadowMap.enabled = true // 开启阴影
renderer.shadowMap.type = THREE.PCFSoftShadowMap //  定义阴影贴图类型
// renderer.useLegacyLights = false

const pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileEquirectangularShader() // 预编译等距柱状着色器。您可以通过在纹理的网络获取期间调用此方法来提高并发性，从而加快启动速度。

renderer.setClearColor(0x908a80, 1) //设置背景颜色

// renderer.toneMapping = THREE.ACESFilmicToneMapping
// renderer.toneMappingExposure = 1.5

export default renderer
