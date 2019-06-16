import fieldMixin from '../basic/field-mixin';

export default {
  methods: {
    setRuntimeRelatedData(nv, source) {
      let dataFromValue = [];
      let v = this.getOptionKey ? this.getOptionKey.value : 'value';
      if (source === 'fetch') {
        const { cache } = this;
        let { value } = this;
        if (value) {
          if (!Array.isArray(value)) {
            value = [value];
          }
          dataFromValue = value.reduce((result, item) => {
            if (cache[item]) {
              result.push(cache[item]);
            }
            return result;
          }, []);
        }
      } else if (source === 'refresh') {
        let { outerValue } = this;
        if (outerValue) {
          if (!Array.isArray(outerValue)) {
            outerValue = [outerValue];
          }
          dataFromValue = outerValue.slice();
        }
      }

      if (!Array.isArray(nv)) {
        nv = [];
      }
      const dict = nv.reduce((result, option) => {
        result[option[v]] = 1;
        return result;
      }, {});
      for (let i = 0; i < dataFromValue.length; i += 1) {
        const now = dataFromValue[i];
        if (dict[now[v]] || dict[now]) {
          dataFromValue.splice(i, 1);
          i -= 1;
          continue;
        }
      }
      this.runtime_related_data = nv.concat(dataFromValue);
      this.related_data_bak = nv.concat(dataFromValue);
    },
    doCache(value) {
      /* eslint-disable prefer-const */
      if (!kr.script.isArray(value)) {
        value = value ? [value] : [];
      }
      let { cache, runtime_related_data, getOptionKey } = this;
      if (!kr.script.isArray(runtime_related_data)) {
        runtime_related_data = [];
      }

      const dict = {};
      value.forEach(item => {
        if (!cache[item]) {
          const found = runtime_related_data.find(option => {
            if(getOptionKey) {
              return option[getOptionKey.value] === item;
            } else {
              return option.value === item;
            }
          });

          if (found) {
            this.$set(cache, getOptionKey ? found[getOptionKey.value] : found.value, found);
          }
        }
        dict[item] = 1;
      });
      Object.keys(cache).forEach(key => {
        if (!dict[key]) {
          delete cache[key];
        }
      });
    },
    refresh(always = false) {
      this.setRuntimeRelatedData(this.related_data_bak, 'refresh');
      let { outerValue, getOptionKey, meta } = this;
      //  人员单选时处理 outerValue 为数组的 bug
      let selSingleArr = ['SELECT', 'SELECT_REMOTE', 'SELECT_SEARCH', 'RELATION_SINGLE', 'RELATION_SINGLE_SUMMARY', 'RELATION_SINGLE_FORM', 'SELECT_SEARCH_CREATE'];
      if (selSingleArr.indexOf(meta.type) > -1) {
        if (kr.script.isArray(outerValue)) {
          outerValue = outerValue[0];
        }
      }

      let final = null;
      if (outerValue || outerValue === 0) {
        if (kr.script.isArray(outerValue)) {
          if(getOptionKey) {
            final = outerValue.map(item => { return item[getOptionKey.value] || item });
          } else {
            final = outerValue.map(item => { return item.value || item });
          }
        } else {
          if(getOptionKey) {
            final = outerValue[getOptionKey.value] || outerValue;
          } else {
            final = outerValue.value || outerValue;
          }
        }
      }
      this.setValue(final, 'outer', always);
    },
    setValue(nv, ...args) {
      const { meta } = this;
      if ((nv === null || nv === undefined) && (meta.type.indexOf('MULTIPLE') > -1 || meta.type.indexOf('SUMMARY') > -1)) {
        nv = [];
      }
      fieldMixin.methods.setValue.call(this, nv, ...args);
      this.setRuntimeRelatedData(this.related_data_bak, 'fetch');
    },
    getKV() {
      /* eslint-disable prefer-const,prefer-destructuring */
      const kv = fieldMixin.methods.getKV.call(this);
      const { return_value, needValue, needArray } = this.meta.scene;
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;

      if (v === '' || v == null) {
        return [k, null];
      }
      if (needArray) {
        // return Array.isArray(v) ? [k, v] : [k, [v]];
        if (!Array.isArray(v)) {
          v = [v];
        }
      }
      //for select that needs value instead of object.
      if (needValue) {
        return [k, v];
      }
      const { cache } = this;
      const optionKey = this.getOptionKey;
      if (kr.script.isArray(v)) {
        v = v.reduce((result, item) => {
          const option = cache[item];
          if (option !== undefined) {
            result.push(return_value ? (optionKey ? cache[item][optionKey.value] : cache[item].value) : option);
          }
          return result;
        }, []);
      } else {
        v = return_value && kr.script.isObject(cache[v]) ? (optionKey ? cache[v][optionKey.value] : cache[v].value) : cache[v] || v;
      }

      return [k, v];
    },
    setDisable(state){
      this.element_props.disabled = state;
    }
  },
};
