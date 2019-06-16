<template>
  <krFormatExplain :dynamicData="dynamicData"></krFormatExplain>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import krFormatExplain from '../../../krFormatExplain';

export default {
  INDEX: ['FORMAT_EXPLAIN'],
  data() {
    return {
      dynamicData: []
    }
  },
  mixins: [fieldMixin],
  components: {
    krFormatExplain
  },
  mounted() {
    this.fetch({}, {}, () => {
      this.dynamicData = this.runtime_related_data;
    })
  }
}
</script>

<style scoped>

</style>