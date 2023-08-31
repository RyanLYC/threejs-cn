<template>
  <div class="model-tag" v-once>
    {{ userData.unitCode }}{{ userData.phaseCode }}
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
  options: {
    type: Object,
    default: () => {
      return {}
    },
  },
})
</script>
<style lang="scss" scoped>
.model-tag {
  font-size: 12px;
  color: #fff;
  text-transform: uppercase;
}
</style>
