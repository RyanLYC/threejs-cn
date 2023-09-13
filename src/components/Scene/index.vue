<template>
  <div class="scene" ref="sceneDiv" @click="clickHandler"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
// 导入场景
import scene from '@/three/scene'
//导入相机
import camera from '@/three/camera'
// 导入渲染器
import renderer from '@/three/renderer'
// 导入css 3d渲染器
import css3dRenderer from '@/three/css3dRenderer'
// 导入gui对象
// import gui from '@/three/gui'
// 导入辅助坐标轴
import axesHelper from '@/three/axesHelper'
// 导入每一帧的执行函数
import animate from '@/three/animate'
// 导入添加物体函数
import createLaiChengMesh, {
  clickLaiChengMesh,
  disposeLaiChengMesh,
  createBatteryCabinetMesh,
  clickBatteryCluster,
  createBatteryCluster,
  clickBatteryPack,
} from '@/three/createMesh'
// 初始化调整屏幕
import '@/three/init'
import type { DianGuiDataI } from './types'
import cuList from './cuData.json'

// 场景元素div
let sceneDiv = ref<HTMLElement>()
// 添加相机
scene.add(camera)
// 添加辅助坐标轴
scene.add(axesHelper)

const dianGuisDataList = ref<DianGuiDataI[]>([])

const init = () => {
  let index = 0
  for (let i = 0; i < 14; i++) {
    const array = ['a', 'b', 'c']
    array.forEach((phaseCode) => {
      const unitCode = i + 1
      dianGuisDataList.value.push({
        unitCode,
        phaseCode,
        runStatus: { val: (Math.random() * 5).toFixed(0) },
        index,
      })
      index++
    })
  }
  // setInterval(() => {
  //   dianGuisDataList.value.forEach((item) => {
  //     item.runStatus.val = (Math.random() * 5).toFixed(0)
  //   })
  // }, 30000)
}

init()
// 创建物体
createLaiChengMesh(dianGuisDataList.value)

onMounted(() => {
  if (sceneDiv.value) {
    sceneDiv.value.appendChild(renderer.domElement)
    sceneDiv.value.appendChild(css3dRenderer.domElement)
    animate()
  }
})

onUnmounted(() => {
  disposeLaiChengMesh()
})

const clickHandler = (event: MouseEvent) => {
  const data = clickLaiChengMesh(event.clientX, event.clientY)
  if (data) {
    disposeLaiChengMesh()
    // 创建电池柜
    //     {
    //     "unitCode": 6,
    //     "phaseCode": "b",
    //     "runStatus": {
    //         "val": "2"
    //     },
    //     "index": 16
    // }
    // get 电池簇信息
    createBatteryCabinetMesh(data, cuList)
    return
  }
  const cuData = clickBatteryCluster(event.clientX, event.clientY)
  if (cuData) {
    disposeLaiChengMesh()
    console.log('scene:', scene)
    // get 电池pack 信息
    createBatteryCluster(cuData)
    return
  }
  clickBatteryPack(event.clientX, event.clientY)
}
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
