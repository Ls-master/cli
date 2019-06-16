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
    <div slot="view" v-html="skin"></div>
    <div
      class="comp-md-form-field-searchCondition"
      ref="field"
      slot="field"
      tabindex="0"
    >
      <div v-if="value && value.length">
        <Row
          ref="rows"
          v-for="(item, i) in value"
          :key="item.id"          
          :index="i"
          :data="item"
          :needInfo="meta && meta.scene && meta.scene.needInfo"
          :outerMakeRelatedDataRemote="self_make_related_data_remote_func"
          :relatedInfoRemote="meta && meta.scene && meta.scene.related_info_remote"
          :disabled="conf_element_props.disabled"
          :delDisabled="value.length < 2"
          @delete="handleDelete(i)"
          @add="handleAdd"
          :cNeedArray_object="cNeedArray_object">
        </Row>
      </div>
    </div>
  </Container>
</template>

<script>
import mixin from '../basic/field-mixin';
import KrInput from '../input';

export default {
  INDEX: 'SEARCH_CONDITION',
  DEFAULT_VALIDATE: {
    SEARCH_CONDITION: [{
      validator(rule, value, callback) {
        const keys = ['field', 'relation', 'value'];
        if (value.some(row => {
          return keys.some(key => {
            return row.field == null || row.field === "" || row.relation == null || row.relation== "" || 
            (row.relation && row.relation.value !== "IS" && row.relation.value !== "ISN" && (row.value == null || row.value == ""));
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
  DEFAULT_FORMAT: {
    SEARCH_CONDITION: 'search_condition'
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
    return { };
  },
  computed: {
    cNeedArray_object() {
      return this.meta.scene.cNeedArray_object || false;
    }
  },
  methods: {
    setValue(nv, ...args) {
      if (!Array.isArray(nv)) {
        nv = [];
      }
      if(nv[0] && !nv[0].id) {
        nv[0].id = 'firstRow'
      }
      mixin.methods.setValue.call(this, nv, ...args);
    },
    handleAdd() {
      if (this.getMax() && this.value.length === this.getMax()) {
        kr.ui.error(`最多能创建${this.getMax()}筛选条件！`);
        return;
      }
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
      if (!rows) {
        rows = [];
      }
      let value = [];
      if(!Array.isArray(rows)) {
        rows = [rows];
      };
      rows.forEach(row => {
        let nv = row.getValue();
        if(nv.relation && (nv.relation.value !== "IS" && nv.relation.value !== "ISN") && nv.value) {
          value.push(nv);
        } else if (nv.relation && (nv.relation.value === "IS" || nv.relation.value === "ISN")) {
          value.push(nv);
        }
      });
      return [meta.key, value];
    },
    getMax() {
      const max = this.meta && this.meta.scene && this.meta.scene.max;
      if (max !== undefined && Number.isInteger(max)) {
        return max;
      }
      return null;
    }
  },
};
</script>

<style lang="scss">
.comp-md-form-field-searchCondition {
  outline: none;
  .comp-md-form-field-title {
    height: 24px;
    .comp-md-form-field-title-title {
      color: #525975;
      font-size: 13px;
      line-height: 18px;
    }
    .comp-md-form-field-title-subtitle {
      color: #979BA8;
      font-size: 12px;
      margin-left: 11px;
      line-height: 18px;
    }
  }

  .kr-employee {
    vertical-align: top;
    .kr-employee__inner {
      max-height: 80px;
      overflow-y: auto;
    }
  }
}
</style>
