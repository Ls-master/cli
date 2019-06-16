<template>
  <Container
          @click="containerClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
  >
    <span slot="view">{{getViewText}}</span>
    <div slot="field" @blur="panelBlur" class="comp-currency-group-panel">
      <el-select ref="fieldSelect" v-model="selectValue" @change="selectChange" @blur="selectBlur" class="comp-currency-group-select" :disabled="conf_element_props.disabled">
        <el-option
                v-for="item in options"
                :key="item.value"
                v-bind="[local_element_props, element_props, runtime_element_props]"
                :label="item.label"
                :value="item.value"
        >
        </el-option>
      </el-select>
      <el-input
              ref="field"
              class="comp-currency-group-input"
              v-bind="[local_element_props, element_props, runtime_element_props]"
              v-model="inputValue"
              @input="handleInput"
              @blur="inputBlur"
      >
      </el-input>
    </div>
  </Container>
</template>

<script>

import fieldMixin from '../basic/field-mixin';
import Schema from 'async-validator';

export default {
  INDEX: ['CURRENCY_GROUP'],
  data() {
    return {
      selectValue: 'CNY',
      inputValue: '',
      isSuffixClick: false,
      options: [
        {
          value: 'CNY',
          label: 'CNY'
        },
        {
          value: 'USD',
          label: 'USD'
        },
        {
          value: 'EUR',
          label: 'EUR'
        },
        {
          value: 'GBP',
          label: 'GBP'
        },
        {
          value: 'HKD',
          label: 'HKD'
        },
        {
          value: 'TWD',
          label: 'TWD'
        },
        {
          value: 'JPY',
          label: 'JPY'
        },
        {
          value: 'AUD',
          label: 'AUD'
        },
        {
          value: 'SGD',
          label: 'SGD'
        },
        {
          value: 'CAD',
          label: 'CAD'
        }
      ],
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
    }
  },
  mixins: [
    fieldMixin,
  ],
  computed: {
    getViewText() {
      let val = '';

      if (this.selectValue && (this.inputValue || this.inputValue === 0)) {
        val += this.selectValue;
      }

      let num = kr.script.formatNum(this.inputValue);

      if (this.inputValue || this.inputValue === 0) {
        val += val === '' ? num : ' ' + num;
      }

      if (val === '') {
        val = '-'
      }

      return val;
    }
  },
  methods: {
    handleInput() {
      this.emitValue();
    },
    selectChange() {
      const { field } = this.$refs;
      if (field) {
        const { container } = this.$refs;
        container.setEditing(true);
        this.$nextTick(() => {
          field.focus && field.focus();
        })
      }
      this.emitValue();
    },
    emitValue() {
      this.value = { currency: this.selectValue, num: this.inputValue, dollar: null }
    },
    // 初始值回填
    refresh(always = false) {
      this.setValue(this.outerValue, 'outer', always);
      this.selectValue = this.value ? this.value.currency ? this.value.currency : 'CNY' : 'CNY';
      this.inputValue = this.value && this.value.num;
    },
    refreshValue(value) {
      if (!value || !value.currency || value.num === undefined || value.num === null) {
        return;
      }
      this.selectValue = value.currency;
      this.inputValue = value.num;
    },
    getValidator(key) {
      const { meta } = this;
      const desc = {};
      let rules = (this.$options.DEFAULT_VALIDATE[meta.type] || []).concat(meta.scene.validate || []);
      if (key === 'num') {
        rules = rules.concat(this.runtime_validate || []);
      }
      if (rules.length) {
        rules.forEach(rule => {
          if (typeof rule.validator === 'string') {
            /* eslint-disable prefer-const */
            let func = null;
            eval(`func=function(rule, value, callback, source){
              ${rule.validator};
            }`);
            rule.validator = func;
          }
        });
        desc[key] = rules;
        return new Schema(desc);
      }
      return null;
    },
    async doValidate(form) {
      const { disabled } = this;
      if (disabled) {
        return;
      }
      form = form[this.meta.key] || {};
      form = [{ currency: form.currency }, { num: form.num }];
      await Promise.all(form.map((item) => {
        return this.doValidates(Object.keys(item)[0], item);
      }))
    },
    async doValidates(key, form) {
      let validator = this.getValidator(key);
      if (validator) {
        await new Promise((resolve, reject) => {
          validator.validate(form, (errs) => {
            if (errs) {
              errs.forEach(err => {
                const { message } = err;
                this.setError(message);
              });
              reject();
            } else {
              resolve();
            }
          });
        });
      }
    },
    async handleFieldBlur() {
      const { isQuickMode } = this;
      const { validator } = this;
      const form = this.getForm();

      if (!isQuickMode) {
        // if (validator) {
        //   await new Promise((resolve, reject) => {
        //     validator.validate(form, (errs) => {
        //       if (errs) {
        //         errs.forEach(err => {
        //           const { message } = err;
        //           this.setError(message);
        //         });
        //         this.fieldFocus();
        //         reject();
        //       } else {
        //         resolve();
        //       }
        //     });
        //   });
        // }
        await this.doValidate(form);
        (async () => {
          try {
            await kr.dataflow.run(this.submitDataflow, this, form);
          } catch (e) {
            this.refresh();
          } finally {
            this.submitFinally();
          }
        })();
      }
      this.containerBlur();
    },
    hasChildren(relatedTarget, target) {

      let children = target.children;
      for (let i = 0; i < children.length; i ++) {
        if (children[i] !== relatedTarget) {
          return this.hasChildren(relatedTarget, children[i]);
        } else {
          return true;
        }
      }
      return false;
    },
    panelBlur(e) {
      let has = this.hasChildren(e.relatedTarget, e.target);
      if (!has) {
        this.checkMode('handleFieldBlur', ...arguments)
      }
    },
    selectBlur(e) {
      // const { field } = this.$refs;
      // let el = field.$el;
      // let relatedTarget = e.relatedTarget;
      // if (relatedTarget) {
      //   let has = this.hasChildren(relatedTarget, el);
      //   if (!has) {
      //     this.checkMode('handleFieldBlur', ...arguments);
      //   }
      // } else {
      //   this.checkMode('handleFieldBlur', ...arguments);
      // }
    },
    inputBlur(e) {
      if (this.isSuffixClick) {
        this.isSuffixClick = false;
        return false;
      }
      const { fieldSelect } = this.$refs;
      let el = fieldSelect.$el;
      let relatedTarget = e.relatedTarget;
      if (relatedTarget) {
        let has = this.hasChildren(relatedTarget, el);
        if (!has) {
          this.checkMode('handleFieldBlur', ...arguments);
        }
      } else {
        this.checkMode('handleFieldBlur', ...arguments);
      }
    },
    containerClick() {
      this.handleClick();
    },
  },
  mounted() {
    const { fieldSelect } = this.$refs;

    let el = fieldSelect.$el;

    let suffix = el.getElementsByClassName('el-input__suffix')[0];

    suffix.addEventListener('mousedown', () => {
      this.isSuffixClick = true;
    })

  }
}
</script>

<style lang="scss">

  .comp-currency-group-panel {
    /*position: relative;*/
    outline: none;

    .comp-currency-group-select {
      position: absolute;
      width: 90px !important;
      z-index: 100;
      .el-input--medium .el-input__inner {
        border-right-width: 0;
        &:hover {
          border-right-width: 1px;
        }
      }
      .el-input.is-focus .el-input__inner {
        border-right-width: 1px !important;
      }
    }

    .comp-currency-group-input {
      width: 100%;
      box-sizing: border-box;
      padding-left: 90px;
    }
  }

</style>