<template lang="html">
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
    @handleTitleRight="handleTitleRight"
  >
    <span slot="view" :class="'type-'+local_element_props.type" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <el-input
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value"
      @input="handleInput"
      @blur="checkMode('handleFieldBlur', ...arguments)"
    >
    </el-input>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default {
  // input 类型
  INDEX: ['TEXT', 'TEXT_AREA', 'PHONE', 'URL', 'EMAIL'],
  // default component prop
  DEFAULT_COMPONENT_PROP: {
    TEXT_AREA: {
      type: 'textarea',
    },
    PHONE: {
      suffixIcon: 'el-icon-phone',
    },
  },
  DEFAULT_FORMAT: {
    URL: 'url',
    EMAIL: 'email',
  },
  SEARCH_CONDITION: {
    TEXT: ['EQUAL', 'NOT_EQUAL', 'CONTAIN', 'NOT_CONTAIN'],
    TEXT_AREA: ['EQUAL', 'NOT_EQUAL', 'CONTAIN', 'NOT_CONTAIN'],
    PHONE: ['EQUAL', 'NOT_EQUAL', 'CONTAIN', 'NOT_CONTAIN'],
    URL: ['EQUAL', 'NOT_EQUAL', 'CONTAIN', 'NOT_CONTAIN'],
    EMAIL: ['EQUAL', 'NOT_EQUAL', 'CONTAIN', 'NOT_CONTAIN'],
  },
  SEARCH_FORM: {
    TEXT: 'CONTAIN',
    TEXT_AREA: 'CONTAIN',
    PHONE: 'CONTAIN',
    URL: 'CONTAIN',
    EMAIL: 'CONTAIN',
  },
  DEFAULT_VALIDATE: {
    PHONE: [{
      validator(rule, value, cb, source) {
        // let reg = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
        let reg = /^[0-9+\-*/();#]+$/g;
        if(!value) {
          cb();
          return;
        }
        if (!reg.test(value)) {
          cb(new Error('手机号码格式不正确!'));
        }
        cb();
      },
    }],
    EMAIL: [{
      validator(rule, value, cb, source) {
        // let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
        if(!value) {
          cb();
          return;
        }
        if (!reg.test(value)) {
          cb(new Error('email格式不正确!'));
        }
        cb();
      },
    }],
    URL: [{
      validator(rule, value, cb, source) {
        let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        if(!value) {
          cb();
          return;
        }
        if (reg.test(value)) {
          cb(new Error('url格式不正确!'));
        }
        cb();
      },
    }]
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
      // if (v == null) {
      //   v = '';
      // }
      v = _.trim(v);
      // v = k === 'apiName' ? v + '__u' : v;
      if(!v) {
        v = null;
      }
      return [k, v];
    },
  }
}
</script>

<style lang="scss">
</style>
