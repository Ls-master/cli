<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <el-input-number
      class="comp-md-form-inputNumber-input"
      v-model="value"
      controls-position="right"
      @change="handleChange"
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      @blur="containerBlur"
    >
    </el-input-number>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default {
  INDEX: ['INPUT_NUMBER'],
  mixins: [
    fieldMixin,
  ],
  methods: {
    handleChange() {
      // const {tooltip, tooltipIcon} = this.$refs;
      // tooltip.$slots.default = tooltipIcon;
      // tooltip.handleFocus();
    }
  }
}
</script>

<style scoped>
</style>
