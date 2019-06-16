<template lang="html">
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <el-input
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value"
      @input="handleInput"
      @blur="checkMode('handleFieldBlur', ...arguments)"
    >
      <template slot="prepend" v-if="meta.type==='CURRENCY'">{{currency_unit ? currency_unit : '¥'}}</template>
      <template slot="append" v-if="meta.type==='PERCENT'">%</template>
    </el-input>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default {
  INDEX: ['NUMBER', 'CURRENCY', 'PERCENT'],
  DEFAULT_FORMAT: {
    PERCENT: 'percent',
    CURRENCY: 'currency',
    NUMBER: 'number',
  },
  SEARCH_CONDITION: {
    NUMBER: ['EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL'],
    CURRENCY: ['EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL'],
    PERCENT: ['EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL'],
  },
  SEARCH_FORM: {
    NUMBER: 'FROM_TO',
    CURRENCY: 'FROM_TO',
    PERCENT: 'FROM_TO',
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
      runtime_validate: [
        (rule, value, callback) => {
          if (value || value === 0) {
            const str = `${value}`;
            let decimal_limit = 0;
            try {
              ({ decimal_limit } = this.meta.scene);
            } catch (e) {
              e;
            }
            decimal_limit = parseInt(decimal_limit, 10);
            if (decimal_limit < 0) {
              decimal_limit = parseInt('', 10);
            }

            if (!/(^-?\d+\.\d+$)|(^-?\d+$)/.test(value)) {
              callback(Error(`数字类型只能包含数字及小数点`));
              return;
            } else {
              let reg = null;
              if (!Number.isNaN(decimal_limit)) {
                if (decimal_limit === 0) {
                  reg = new RegExp('^-?\\d*$');
                } else {
                  reg = new RegExp(`(^-?\\d+\\.\\d{0,${decimal_limit}}$)|(^-?\\d*$)`);
                }

                if (!reg.test(value)) {
                  callback(Error(`小数位数最多为${decimal_limit}`));
                  return;
                }
              }
            }
          }
          callback();
        },
      ],
    };
  },
  computed: {
    currency_unit() {
      return this.meta.scene.currency_unit;
    }
  },
  methods: {
    handleInput(nv) {
      this.$nextTick(() => {
        const reg = /(^-?\d+\.\d*$)|(^-?\d*$)/;
        if (!reg.test(nv)) {
          this.setValue(this.oldValue);
          return;
        }
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

      if (v != null) {
        if (!/(^-?\d+\.\d+$)|(^-?\d+$)/.test(v)) {
          v = null;
        }
      } else {
        v = null;
      }
      return [k, v];
    },
  },
};
</script>

<style lang="css">
</style>
