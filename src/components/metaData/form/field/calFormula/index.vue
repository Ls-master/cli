<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
  >
    <KrCalFormula ref="field"
                  slot="field"
                  v-bind="[local_element_props, element_props, runtime_element_props]"
                  v-model="value"
    >
    </KrCalFormula>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import KrCalFormula from '../../../krCalFormula';

export default {
  INDEX: ['CAL_FORMULA'],
  data() {
    return {
      options: []
    }
  },
  mixins: [
    fieldMixin,
  ],
  components: {
    KrCalFormula
  },
  methods: {
    calFormulaChange(val) {
      this.setValue(val, 'inner');
    },
    setError(nv) {
      const { field } = this.$refs;
      field.setError(nv);
    },
    loadOptions(val) {
      this.options = val;
      this.emit_FIELD('change', 'inner');
    }
  }
}
</script>

<style scoped>

</style>