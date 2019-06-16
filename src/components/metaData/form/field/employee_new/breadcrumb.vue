<template>
  <span>
    <i class="el-icon-arrow-right" v-if="index !== 0"></i>
    <span class="employee-breadcrumb-text" :style="index === length - 1 ? 'color: #606ECC' : ''" @click="handleBreadcrumb">{{data.name}}</span>
  </span>
</template>

<script>
export default {
  props: {
    data: Object,
    index: Number,
    length: Number
  },
  methods: {
    handleBreadcrumb() {
      this.$emit('click', this.data, this.index);
    }
  }
}
</script>

<style scoped>
  .employee-breadcrumb-text {
    cursor: pointer;
  }

  .employee-breadcrumb-text:hover {
    color: #606ECC;
  }
</style>