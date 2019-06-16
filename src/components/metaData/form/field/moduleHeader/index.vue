<template lang="html">
  <krModuleHeader :meta="meta" ></krModuleHeader>
</template>


<script>
import fieldMixin from '../basic/field-mixin';
import krModuleHeader from '../../../krModuleHeader';

export default {
  INDEX: ['MODULE_HEADER'],
  mixins: [fieldMixin],
  components: {
    krModuleHeader
  }
}
</script>

<style scoped>

</style>