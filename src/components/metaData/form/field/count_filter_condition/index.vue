<template lang="html">
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <span slot="view" v-html="skin"></span>
    <div
      class="comp-md-form-field-summaryfiltercondition"
      ref="field"
      slot="field"
    >
      <div v-if="value && value.length">
        <Row
          ref="rows"
          v-for="(item,i) in value"
          :key="item.id"
          :index="i"
          :data="item"
          :fieldOptions='fieldOptions'
          :outerMakeRelatedDataRemote="self_make_related_data_remote_func"
          :delDisabled="value.length < 2"
          @delete="handleDelete(i)"
          @add="handleAdd()"
        >
        </Row>
      </div>
    </div>
  </Container>
</template>

<script>
import mixin from '../basic/field-mixin';
import KrInput from '../input';

export default {
  INDEX: 'COUNT_FILTER_CONDITION',
  DEFAULT_VALIDATE: {
    COUNT_FILTER_CONDITION: [{
      validator(rule, value, callback) {
        const keys = ['fieldName', 'operator', 'fieldValues'];
        if (value.some(row => {
          return keys.some(key => {
            return row[key] == null || row[key] === '';
          });
        })) {
          callback(Error('条件中不能有空值'));
        } else {
          callback();
        }
      },
    }],
  },
  ENV: {
    SEARCH_CONDITION: {
      QUICK_MODE_HACK: true,
    },
  },
  mixins: [
    mixin,
  ],
  props: {
    outerValue: kr.vue.getPropArray(),
  },
  components: {
    Row: require('./row').default, KrInput
  },
  data() {
    return {
      fieldOptions: []
    };
  },
  watch: {
    value(nv, oldVal){
      if(!nv || nv.length<1){
        this.value = [{
          fieldName: '',
          operator: '',
          fieldValues: [''],
          valueType: 0
        }];
      }
    }
  },
  computed: {
  },
  methods: {
    setValue(nv, ...args) {
      if (!Array.isArray(nv)) {
        nv = [];
      }
      mixin.methods.setValue.call(this, nv, ...args);
    },
    setOptions(options){  //设置选项
      this.fieldOptions = options;
    },
    handleAdd() {
      const nv = this.value.slice();

      const item = {
        value: null,
        relation: null,
        field: '',
        id: kr.random.string(16, nv.reduce((result, item) => {
          result[item.id] = 1;
          return result;
        }, {})),
      };
      nv.push(item);
      this.setValue(nv);
    },
    handleDelete(i) {
      const nv = this.value.slice();
      nv.splice(i, 1);
      this.setValue(nv);
    },
    getKV() {
      const { meta, disabled } = this;
      if (disabled) {
        return [];
      }
      let { rows } = this.$refs;
      let value = [];
      if(!Array.isArray(rows)) {
        rows = [rows];
      };
      rows.forEach(row => {
        let nv = row.getValue();
        if(nv.operator && nv.fieldValues) {
          value.push(nv);
        }
      });
      return [meta.key, value];
    },
  },
};
</script>

<style lang="scss">
.comp-md-form-field-searchCondition {
  outline: none;
}
</style>
