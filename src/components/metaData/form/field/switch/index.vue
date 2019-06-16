<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <span slot="view" v-html="skin"></span>
    <el-switch
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value"
      @change="handleInput"
      @blur="containerBlur"
    ></el-switch>

  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default{
  INDEX: ['SWITCH'],
  DEFAULT_FORMAT: {
    SWITCH: 'bool',
  },
  SEARCH_CONDITION: {
    SWITCH: ['EQUAL', 'NOT_EQUAL'],
  },
  ENV: {
    SWITCH: {
      QUICK_MODE_HACK: true,
    },
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
    },
    setValue(nv, ...args) {
      fieldMixin.methods.setValue.call(this, !!nv, ...args);
    },
  },
  mounted() {
    /*
    const dom = this.$el.querySelector('.el-switch__input');
    if (dom) {
      dom.addEventListener('focus', (e) => {
        this.checkMode('handleFieldFocus', e);
      });
      dom.addEventListener('blur', (e) => {
        console.log(e);
        this.checkMode('handleFieldBlur', e);
      });
    } */
  },
};
</script>
