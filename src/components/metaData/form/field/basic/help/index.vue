<template lang="html">
  <div class="help">
    {{description}}
  </div>
</template>

<script>
export default {
  props: {
    description: String,
  }
}
</script>

<style lang="scss" scoped>
  .help {
    @include font-content-3(#979BA8);
  }
</style>
