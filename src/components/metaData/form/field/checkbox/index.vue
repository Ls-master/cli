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
    <div
      ref="field"
      slot="field"
      tabindex="0"
      @focus="checkMode('handleFieldFocus', ...arguments)"
      @blur="checkMode('handleFieldBlur', ...arguments)"
    >
      <el-checkbox
        v-bind="[local_element_props, element_props, runtime_element_props]"
        v-model="value"
        @input="handleInput"
      >
      </el-checkbox>
    </div>
  </Container>
</template>
<script>
import fieldMixin from '../basic/field-mixin';

export default{
  INDEX: ['SINGLE_CHECKBOX'],
  DEFAULT_FORMAT: {
    SINGLE_CHECKBOX: 'bool',
  },
  SEARCH_CONDITION: {
    SINGLE_CHECKBOX: ['EQUAL', 'NOT_EQUAL'],
  },
  SEARCH_FORM: {
    SINGLE_CHECKBOX: 'EQUAL',
  },
  mixins: [
    fieldMixin,
  ],
  props: {
  },
  components: {
  },
  data() {
    return {
    };
  },
  computed: {},
  methods: {
    handleInput(nv) {
      this.$nextTick(() => {
        this.setValue(nv);
      });

      this.fieldFocus();
    },
    setValue(nv, ...args) {
      fieldMixin.methods.setValue.call(this, !!nv, ...args);
    },
  },
};
</script>
