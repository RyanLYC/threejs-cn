<template>
  <div class="scene" ref="sceneDiv">6666</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// 导入场景
import scene from '@/three/scene'
//导入相机
import camera from '@/three/camera'
// 导入渲染器
import renderer from '@/three/renderer'
// 导入gui对象
// import gui from '@/three/gui'
// 导入辅助坐标轴
import axesHelper from '@/three/axesHelper'
// 导入每一帧的执行函数
import animate from '@/three/animate'
// 导入添加物体函数
import createMesh from '@/three/createMesh'
// 初始化调整屏幕
import '@/three/init'

// 场景元素div
let sceneDiv = ref<HTMLElement>()
// 添加相机
scene.add(camera)
// 添加辅助坐标轴
scene.add(axesHelper)
// 创建物体
createMesh()

onMounted(() => {
  if (sceneDiv.value) {
    sceneDiv.value.appendChild(renderer.domElement)
    animate()
  }
})
</script>
<style scoped lang="scss">
.scene {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100vw;
  height: 100vh;
}
</style>
