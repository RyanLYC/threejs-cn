<template>
  <div class="name-label">
    #{{ userData?.unitCode }}储能单元{{ userData?.phaseCode }}相
  </div>
</template>
<script lang="ts" setup>
defineProps({
  userData: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
</script>
<style lang="scss" scoped>
.name-label {
  padding: 5px 10px;
  font-size: 12px;
  color: #06386d;
  background: #fff;
}
</style>
