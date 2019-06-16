<template>
  <div class="comp-md-form-field-filtercondition-row">
    <main>
      <div class="row-index">{{(index+1)}}</div>
      <KR_SELECT
        ref="a"
        class="item first"
        :meta="fieldMeta"
        :env="env"
        :outerValue="innerData.fieldName"
        :outerMakeRelatedDataRemote="outerMakeRelatedDataRemote"
        @input="handleFieldInput"
      />
      <KR_SELECT
        :key="`b${relationMetaDirty}`"
        ref="b"
        class="item"
        :meta="relationMeta"
        :env="env"
        :outerValue="innerData.operator"
        v-if="relationMeta"
        @input="handleSecInput"
      />
      <component
        :key="`c${valueMetaDirty}`"
        ref="c"
        class="item last"
        :is="fields.find(valueMeta)"
        :meta="valueMeta"
        :env="env"
        :outerValue="getComponentVal"
        v-if="valueMeta"
      />

      <i class="el-icon-circle-plus btn" v-if="!disabled" @click="handleAdd" title="添加条件"></i>
      <i class="el-icon-remove btn" v-if="!disabled" :class="{'disabled': delDisabled }" @click="handleDelete" title="移除条件"></i>
    </main>
  </div>
</template>
<script>
import fields from '../some';
import { getAllUsers } from '@/service/metaData/org/account';

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
    fieldOptions: kr.vue.getPropArray()
  },
  components: {
    ...fields,
  },
  data() {
    const { disabled } = this;
    return {
      innerData: {
        fieldName: this.data.fieldName || '',
        operator: this.data.operator || '',
        fieldValues: this.data.fieldValues || [],
        fieldValueType: this.data.fieldValueType || '',
        valueType: this.data.valueType || 0
      },
      fields,
      env: {
        PURE: true,
      },
      fieldMeta: {    //第一下拉框数据
        key: 'fieldName',
        name: '',
        type: 'SELECT',
        scene: {
          return_value: true,
          related_data: { options: this.fieldOptions },
          element_props: {
            disabled,
          },
        },
      },
      relationMeta: null,
      relationMetaDirty: 0,
      valueMeta: null,
      valueMetaDirty: 0,
    };
  },
  computed: {
    getFirstOptions(){  //获取第一下拉框选项
      return this.options;
    },
    getComponentVal(){
      if(!this.valueMeta) return null;
      return this.formatValues(this.innerData.fieldValues, this.innerData.fieldValueType);
    }
  },
  methods: {
    formatValues(values, type) {
      if (type === "employee") {
        return values;
      } else if (type === "select_one") {
        return values.length ? values[0] : null;
      } else if (type === "object_reference" || type === "multiple_object_reference" || type === "select_many") {
        values =  (values || []).map(v => {
          return { value: v, id: v };
        });
      }
      return values;
    },
    getValue() {
      const { a, b, c } = this.$refs;
      let finalVal =  [a, b, c].reduce((result, comp) => {
        if (comp) {
          Object.assign(result, comp.getForm());
        }
        return result;
      }, {});
      finalVal['valueType'] = 0;
      finalVal['fieldValueType'] = this.innerData.fieldValueType;

      kr.script.isArray(finalVal['fieldValues'])?'':(finalVal['fieldValues']=[finalVal['fieldValues']]);
      return finalVal;
    },
    outerRefresh(always=false) {
      this.innerData = Object.assign({}, this.data);
      this.$nextTick(() => {
        this.innerRefresh(always);
      });
    },
    innerRefresh(always=false, keys = ['a', 'b', 'c']) {
      keys.forEach(key => {
        const comp = this.$refs[key];
        if (comp) {
          comp.refresh(always);
        }
      });
    },
    handleAdd() {
      this.$emit('add');
    },
    handleDelete() {
      this.$emit('delete');
    },
    handleSecInput(value, cache, source){
      if(value === "BETWEEN") {
        let rtype = this.valueMeta.type;
        switch (this.valueMeta.type) {
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
          break;
        }
        this.valueMeta.type = rtype;
      }
    },
    async handleFieldInput(value, cache, source) {
      const { disabled } = this;
      const data = cache && cache[value];
      
      if (data) {
        //hack一下，employee 类型下，isSingle时为单选
        if(data.type == 'employee' && data.isSingle){
          data.type = 'select_one';
          data.selectOptions = await getAllUsers();
        }
        this.innerData.fieldValueType = data.type;

        const { type, local_scene, local_value } = kr.conversion.transformType(data.type, data);
        const { fields } = this;
        const { operate } = data;

        const relationMeta = {
          key: 'operator',
          name: '',
          type: 'SELECT',
          scene: {
            return_value: true,
            related_data: {
              options: operate,
            },
            element_props: {
              disabled,
            },
          },
        };
        this.relationMeta = relationMeta;
        this.relationMetaDirty = (this.relationMetaDirty + 1) % 2;
        
        local_scene.element_props.disabled = false;
        this.valueMeta = kr._.merge({}, {
          key: 'fieldValues',
          name: '',
          needValue: true,
          type: type,
          scene: {
            ...local_scene,
            return_value: true
          }
        });
        this.valueMetaDirty = (this.valueMetaDirty + 1) % 2;
      } else {
        this.innerData.fieldValueType = '';
        this.relationMeta = null;
        this.valueMeta = null;
      }      

      if (source === 'inner') {   //如果改变来自用户自己选择，而非初始化的值
        // 第一个值有更改时，后续值置空
        this.innerData.operator = '';
        this.innerData.fieldValues = '';
        this.$nextTick(() => {
          this.innerRefresh(false, ['b', 'c']);
        });
      }
    },
  },
  watch: {
    data(nv) {
      this.outerRefresh();
    },
    fieldOptions(val, oldVal){
      this.fieldMeta.scene.related_data.options = val;
      this.$refs['a'].setRuntimeRelatedData(val);
      this.outerRefresh(true);  //设置选项后 强制刷新值，编辑状态下更新值
    }
  },
  created() {
    this.innerData = Object.assign({}, this.data);
  },
  mounted() {
    this.outerRefresh(true);
  },
};
</script>

<style lang="scss">
.comp-md-form-field-filtercondition-row {
  main {
    line-height: 1;
    margin: 12px 0;

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
      width: 98px;
      margin-left: -4px;
      margin-right: 8px;
      vertical-align: top;
      .el-form-item {
        margin-bottom: 0px;
      }

      &.first {
        width: 122px;
      }

      &.last{
        width: 168px;
        vertical-align: top;
      }
    }
    .btn{
      font-size: 20px;
      line-height: 40px;
      //margin-right: 8px;
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
}
</style>
