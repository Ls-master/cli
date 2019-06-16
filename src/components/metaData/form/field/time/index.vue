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
    <el-time-picker
      ref="field"
      slot="field"
      v-model="value"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      @input="handleInput"
      value-format="timestamp"
      :editable="false"
      @blur="containerBlur"
      arrow-control
      />
  </Container>
</template>
<script>
import moment from 'moment';
import fieldMixin from '../basic/field-mixin';

export default{
  INDEX: ['TIME'],
  DEFAULT_COMPONENT_PROP: {
    TIME: {}
  },
  DEFAULT_FORMAT: {
    TIME: 'HH:mm:ss'
  },
  SEARCH_CONDITION: {
    TIME: ['EQUAL'], // ['EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL'],
  },
  SEARCH_FORM: {
    TIME: 'FROM_TO',
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
    getKV() {
      /* eslint-disable prefer-const */
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;
      if (v == null) {
        v = null;
      }
      return [k, v];
    },
  },
};
</script>
