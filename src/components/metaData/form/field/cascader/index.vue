/**  级联选择器 **/

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
    <el-cascader
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      :options="runtime_related_data"
      v-model="value"
      @input="handleInput"
      @blur="containerBlur"
    ></el-cascader>

  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default{
  INDEX: ['CASCADER', 'CASCADER_REMOTE'],
  DEFAULT_FORMAT: {
    CASCADER: 'string',
  },
  SEARCH_CONDITION: {
    CASCADER: ['EQUAL', 'NOT_EQUAL'],
  },
  REMOTES: [
    'CASCADER_REMOTE'
  ],
  ENV: {
    CASCADER: {
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
      if (!kr.script.isArray(nv)) {
        nv = nv ? [nv] : [];
      }
      fieldMixin.methods.setValue.call(this, nv, ...args);
    }
  },
  mounted() {
    const { type } = this;
    if (this.$options.REMOTES.find(item => item === type)) {
      this.fetch({}, {}, () => {
        this.refresh(true);
      });
    }
  },
};
</script>
