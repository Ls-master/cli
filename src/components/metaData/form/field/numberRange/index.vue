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
    <el-input
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value[0]"
      @input="(nv) => handleInput(nv, 0)"
      @blur="containerBlur"
    >
      <template slot="prepend" v-if="meta.type==='CURRENCY_RANGE'">{{currency_unit ? currency_unit : '¥'}}</template>
      <template slot="append" v-if="meta.type==='PERCENT_RANGE'">%</template>
    </el-input>
    -
    <el-input
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value[1]"
      @input="(nv) => handleInput(nv, 1)"
      @blur="containerBlur"
    >
      <template slot="prepend" v-if="meta.type==='CURRENCY_RANGE'">{{currency_unit ? currency_unit : '¥'}}</template>
      <template slot="append" v-if="meta.type==='PERCENT_RANGE'">%</template>
    </el-input>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default {
  INDEX: ['NUMBER_RANGE', 'CURRENCY_RANGE', 'PERCENT_RANGE'],
  DEFAULT_FORMAT: {
    PERCENT_RANGE: 'percentRange',
    CURRENCY_RANGE: 'currencyRange',
    NUMBER_RANGE: 'numberRange',
  },
  SEARCH_FORM: {
    NUMBER_RANGE: 'FROM_TO',
    CURRENCY_RANGE: 'FROM_TO',
    PERCENT_RANGE: 'FROM_TO',
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
      value: [null, null],
      // runtime_validate: [
      //   (rule, value, callback) => {
      //     if (value != null) {
      //       const str = `${value}`;
      //       let decimal_limit = 0;
      //       try {
      //         ({ decimal_limit } = this.meta.scene);
      //       } catch (e) {
      //         e;
      //       }
      //       decimal_limit = parseInt(decimal_limit, 10);
      //       if (decimal_limit < 0) {
      //         decimal_limit = parseInt('', 10);
      //       }
      //       let reg = null;
      //       if (!Number.isNaN(decimal_limit)) {
      //         if (decimal_limit === 0) {
      //           reg = new RegExp('^-?\\d*$');
      //         } else {
      //           reg = new RegExp(`(^-?\\d+\\.\\d{0,${decimal_limit}}$)|(^-?\\d*$)`);
      //         }
      //       }
      //       if (reg) {
      //         if (!reg.test(value)) {
      //           callback(Error(`小数位数最多为${decimal_limit}`));
      //           return;
      //         }
      //       }
      //     }
      //     callback();
      //   },
      // ],
    };
  },
  computed: {
    currency_unit() {
      return this.meta.scene.currency_unit;
    }
  },
  methods: {
    handleInput(nv, index) {
      this.$nextTick(() => {
        const reg = /(^-?\d+\.\d*$)|(^-?\d*$)/;
        if (!reg.test(nv)) {
          this.setValue(this.oldValue);
          return;
        };
        let arr = [...this.value];
        arr[index] = nv;
        this.setValue(arr);
      });
    },
    getKV() {
      /* eslint-disable prefer-const */
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;
      // if (v != null) {
      //   v = parseFloat(v);
      //   if (Number.isNaN(v)) {
      //     v = null;
      //   }
      // } else {
      //   v = null;
      // }
      return [k, v];
    },
    setValue(nv, source = 'inner', always = false) {
      if(!Array.isArray(nv)) {
        nv = [null, null];
      }
      this.value = nv;
      if (always || this.oldValue !== this.value) {
        this.emit_FIELD('change', source);
        this.emit_SCENE('change', source);
        this.$emit('input', nv, this.cache, source);
      }
      this.oldValue = [...this.value];
    },
  },
};
</script>

<style lang="css">
</style>
