<template>
  <div class="comp-md-form-field-searchCondition-row">
    <main>
      <div class="row-index">{{(index+1)}}</div>
      <KR_SELECT
        ref="a"
        class="item first"
        :meta="fieldMeta"
        :env="env"
        :outerValue="innerData.field"
        :outerMakeRelatedDataRemote="outerMakeRelatedDataRemote"
        @input="handleFieldInput"
        :sceneEmitter="sceneEmitter"
        :fieldEmitter="fieldEmitter"
      />
      <KR_SELECT
        :key="`b${relationMetaDirty}`"
        ref="b"
        class="item"
        :meta="relationMeta"
        :env="env"
        :outerValue="innerData.relation"
        v-if="relationMeta"
        :sceneEmitter="sceneEmitter"
        :fieldEmitter="fieldEmitter"
      />
      <component
        :key="`c${valueMetaDirty}`"
        ref="c"
        class="item last"
        :is="fields.find(valueMeta)"
        :meta="valueMeta"
        :env="env"
        :outerValue="innerData.value"
        v-if="valueMeta"
        :sceneEmitter="sceneEmitter"
        :fieldEmitter="fieldEmitter"
      />

      <div style="flex-shrink: 0">
        <i class="el-icon-circle-plus btn" v-if="!disabled" @click="handleAdd" title="添加条件"></i>
        <i class="el-icon-remove btn" v-if="!disabled" :class="{'disabled': delDisabled }" @click="handleDelete" title="移除条件"></i>
      </div>
    </main>
    <div class="row-info" v-if="info">{{info}}</div>
  </div>
</template>
<script>
import fields from '../some';
import Emitter from 'wolfy87-eventemitter';
import ajax from '@/service/metaData/basic';

export default {
  mixins: [],
  props: {
    data: kr.vue.getPropObject(),
    outerMakeRelatedDataRemote: kr.vue.getPropFunction(null),
    disabled: kr.vue.getPropBoolean(false),
    delDisabled: kr.vue.getPropBoolean(false),
    index: {
      type: Number,
      default: 0
    },
    cNeedArray_object: kr.vue.getPropBoolean(false),
    needInfo: kr.vue.getPropBoolean(false),
    relatedInfoRemote: kr.vue.getPropString()
  },
  components: {
    ...fields,
  },
  data() {
    const { disabled } = this;
    return {
      fieldEmitter: new Emitter(),
      sceneEmitter: new Emitter(),
      innerData: {},
      fields,
      env: {
        PURE: true,
      },
      info: "",
      fieldMeta: {
        key: 'field',
        name: '',
        type: 'SELECT_REMOTE',
        scene: {
          related_data_remote: this.$props.remote,
          element_props: {
            disabled,
          },
          related_data_remote_back_filter: (res) => {
            this.selectOptions = res;
            return res;
          },
        },
      },
      relationMeta: null,
      relationMetaDirty: 0,
      valueMeta: null,
      valueMetaDirty: 0,
      isSingle: false,
      selectOptions: [],
      relatedInfoQuery: null,
      fieldData: null
    };
  },
  computed: {},
  methods: {
    getValue() {
      const { a, b, c } = this.$refs;
      let value = [a, b, c].reduce((result, comp) => {
        if (comp) {
          Object.assign(result, comp.getForm());
        }
        return result;
      }, {});
      if (this.isSingle) {
        value.value = value.value ? [value.value] : [];
      }
      value.id = this.data.id;
      return value;
    },
    outerRefresh(isSingle) {
      let { data } = this;
      if (isSingle && Array.isArray(data.value) && data.value.length) {
        data.value = data.value[0];
      }
      this.innerData = data;
      this.relatedInfoQuery = data && data.query;
      this.$nextTick(() => {
        this.innerRefresh();
      });
    },
    innerRefresh(keys = ['a', 'b', 'c']) {
      keys.forEach(key => {
        const comp = this.$refs[key];
        if (comp) {
          comp.refresh();
        }
      });
    },
    handleAdd() {
      this.$emit('add');
    },
    handleDelete() {
      this.$emit('delete');
    },
    async handleFieldInput(value, cache, source) {
      let _this = this;
      const { disabled, selectOptions } = this;
      const data = cache && cache[value];

      if (selectOptions) {
        let currentSelect = selectOptions.find((item) => {
          return item.value === value;
        });
        if (currentSelect) {
          data.isSingle = currentSelect.isSingle;
          if (source === 'outer') {
            this.outerRefresh(data.isSingle);
          }
        }
      }
      if (data) {
        this.fieldData = data;
        if (data.type === 'employee' && data.isSingle) {
          this.isSingle = true;
        } else {
          this.isSingle = false;
        }
        const { type, local_scene, local_value } = kr.conversion.transformType(data.type, data);
        const { fields } = this;
        const { operate } = data;
        const relationMeta = {
          key: 'relation',
          name: '',
          type: 'SELECT',
          scene: {
            related_data: {
              options: operate,
            },
            element_props: {
              disabled,
            },
            field_event_emit: [
              {
                event: 'change',
                script: (ctx, ...arg) => {
                  const { component } = ctx;
                  return component.value;
                },
              },
            ],
          },
        };
        this.relationMeta = relationMeta;
        this.relationMetaDirty = (this.relationMetaDirty + 1) % 2;
        // c, 预处理 c 列 '范围'type类型, for setValueBUG
        if(this.data.relation && this.data.relation.value === 'BETWEEN') {
          this.defaultType = this.whenChoseBetween(type);
        } else {
          this.defaultType = type;
        }
        // c 预处理c列 "为空" "不为空"
        if(this.data.relation && (this.data.relation.value === "IS" || this.data.relation.value === "ISN")) {
          local_scene.element_props.disabled = true;
        }
        let rtype = "";
        this.valueMeta = kr._.merge({ type: this.defaultType }, {
          key: 'value',
          name: '',
          scene: {
            // ...local_scene,
            ...kr.script.updateState(local_scene, {element_props: {"disabled": false}}),
            // needValue: true,
            field_event_listen: [{
              src: 'relation',
              event: 'change',
              script: ({ component, args }) => {
                component.setValue(null);
                if(args[0] === "BETWEEN") {
                  // this.innerData.value = '';
                  switch (_this.valueMeta.type) {
                  case 'DATE':
                    rtype = 'DATE_RANGE';
                    component.runtime_format = 'date_range';
                    break;
                  case 'DATE_TIME':
                    rtype = 'DATE_RANGE';
                    component.runtime_format = 'date_range';
                    break;
                  case 'NUMBER':
                    rtype = 'NUMBER_RANGE';
                    component.runtime_format = 'numberRange';
                    break;
                  case 'CURRENCY':
                    rtype = 'CURRENCY_RANGE';
                    component.runtime_format = 'currencyRange';
                    break;
                  case 'PERCENT':
                    rtype = 'PERCENT_RANGE';
                    component.runtime_format = 'percentRange';
                    break;
                  default:
                    rtype = _this.defaultType;
                    break;
                  }
                  component.runtime_element_props = Object.assign({}, component.runtime_element_props, {
                    disabled: false
                  });
                  _this.valueMeta = Object.assign({}, this.valueMeta, {type: rtype});     
                } else if (args[0] === "IS" || args[0] === "ISN") {
                  component.runtime_element_props = Object.assign({}, component.runtime_element_props, {
                    disabled: true
                  });
                } else {
                  component.runtime_element_props = Object.assign({}, component.runtime_element_props, {
                    disabled: false
                  });
                  _this.valueMeta = Object.assign({}, this.valueMeta, {type: this.defaultType}); 
                }
              },
            }],
            needArray_object: this.cNeedArray_object
          }
        });
        this.valueMetaDirty = (this.valueMetaDirty + 1) % 2;
      } else {
        this.relationMeta = null;
        this.valueMeta = null;
        this.info = null;
        this.fieldData = null;
      }
      
      if (source === 'inner') {
        const { innerData: { field } } = this;
        this.innerData = {
          field,
        };
        this.$nextTick(() => {
          this.innerRefresh(['b', 'c']);
        });
      }
      if (this.needInfo) {
        this.fetchInfo();
      }
    },
    whenChoseBetween(type) {
      let rtype = '';
      switch (type) {
      case 'DATE':
        rtype = 'DATE_RANGE';
        break;
      case 'DATE_TIME':
        rtype = 'DATE_RANGE';
        break;
      case 'NUMBER':
        rtype = 'NUMBER_RANGE';
        break;
      case 'CURRENCY':
        rtype = 'CURRENCY_RANGE';
        break;
      case 'PERCENT':
        rtype = 'PERCENT_RANGE';
        break;
      default:
        rtype = type;
        break;
      }
      return rtype
    },
    async fetchInfo() {
      let { relatedInfoRemote, fieldData,  relatedInfoQuery } = this;
      if (!relatedInfoRemote || !fieldData || !relatedInfoQuery || !relatedInfoQuery.describeApiName || !relatedInfoQuery.dataId) {
        return;
      }
      const query = {
        data: {
          describeApiName: this.relatedInfoQuery.describeApiName,
          dataId: this.relatedInfoQuery.dataId,
          fieldNames: [this.fieldData.apiName]
        }
      }
      let info = await ajax(Object.assign({}, {
        method: 'post',
        url: this.relatedInfoRemote
      }, query), [], []);
      if (!info) {
        return;
      }
      this.info = `当前值：${kr.formatMd.formatInfo(info[this.fieldData.apiName], this.fieldData.type, this.fieldData.apiName, this.fieldData.dateFormat)}`; 
    },
  },
  watch: {
    data(v) {
      this.outerRefresh();
    },
  },
  created() {
    this.innerData = this.data;
  },
  mounted() {
    this.outerRefresh();
  },
};
</script>

<style lang="scss">
.comp-md-form-field-searchCondition-row {
  main {
    line-height: 1;
    margin: 12px 0;
    display: flex;
    align-items: center;

    .row-index {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      width: 20px;
      text-align: center;
      background-color: #F6F7FB;
      margin-right: 4px;
    }

    .item{
      display: inline-block;
      width: 110px;
      margin-right: 8px;
      // vertical-align: middle;
      .el-form-item {
        margin-bottom: 0px;
      }

      &.first {
        width: 132px;
      }

      &.last{
        width: 182px;
      }
    }
    .btn{
      font-size: 20px;
      /*line-height: 40px;*/
      cursor: pointer;
      color: #CACEE0;
      width: 20px;
      height: 20px;

      &.disabled {
        color: #E6E9F5;
        pointer-events: none;
      }
    }
  }
  .row-info {
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 0;
    margin-left: 30px;
  }
}
</style>
