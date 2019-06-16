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
    <span slot="view" v-html="asyncSkin"></span>
    <div
      class="comp-md-form-field-rangeCondition"
      ref="field"
      slot="field"
      tabindex="0">
      <div class="add-range" @click="handleAddRange"><i class="icon iconfont icon-add add-icon"></i>添加筛选范围</div>
      <div v-if="value && value.length">
        <div v-for="(range, index) in value">
          <div class="range">
            <div class="range-bar">
              <i class="icon iconfont icon-drag range-icon"></i>
              <div class="range-bar-relation">
                <span class="range-bar-relation-label">组内关系：</span>
                <el-select v-model="range.connector">
                  <el-option
                    v-for="item in relations"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
              </div>
              <i class="icon iconfont icon-garbage delete-icon" @click="handleDeleteRange(index)"></i>
            </div>
            <div class="range-filters">
              <Row
                :ref="`rows${index}`"
                v-for="(item, subIndex) in range.filters"
                :key="item.id"          
                :index="subIndex"
                :data="item"
                :needInfo="meta && meta.scene && meta.scene.needInfo"
                :outerMakeRelatedDataRemote="self_make_related_data_remote_func"
                :relatedInfoRemote="meta && meta.scene && meta.scene.related_info_remote"
                :disabled="conf_element_props.disabled"
                :delDisabled="range.filters.length < 2"
                @delete="handleDeleteFilter(index, subIndex)"
                @add="handleAddFilter(index)"
                :cNeedArray_object="cNeedArray_object">
              </Row>
            </div>
          </div>
          <div class="range-connector">
            <div class="range-connector-separator"></div>
            <el-select v-model="range.filterConnector" v-if="index !== value.length - 1">
              <el-option
                v-for="item in relations"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled">
              </el-option>
            </el-select>
            <div class="range-connector-separator"></div>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import mixin from '../basic/field-mixin';
import KrInput from '../input';

export default {
  INDEX: 'RANGE_CONDITION',
  DEFAULT_VALIDATE: {
    RANGE_CONDITION: [{
      validator(rule, value, callback) {
        const { filters } = value;
        const keys = ['field', 'relation', 'value'];
        const invalid = filters.some(row => {
          return keys.some(key => {
            return row.field == null || row.field === "" || row.relation == null || row.relation== "" || 
          (row.relation && row.relation.value !== "IS" && row.relation.value !== "ISN" && (row.value == null || row.value == ""));
          });
        })  
        if (invalid) {
          callback(Error('筛选条件中不能有空值'));
        } else {
          callback();
        }
      },
    }],
  },
  ENV: {
    RANGE_CONDITION: {
      QUICK_MODE_HACK: true,
    },
  },
  DEFAULT_FORMAT: {
    RANGE_CONDITION: 'range_condition'
  },
  mixins: [
    mixin,
  ],
  props: {
    outerValue: [Array, Object]
  },
  components: {
    Row: require('../search-condition/row').default, 
    KrInput
  },
  data() {
    return {
      relations: [
        { value: "and", label: "且", disabled: false },
        { value: "or", label: "或", disabled: false }
      ],
      relatedInfoQuery: null,
      options: []
    };
  },
  computed: {
    cNeedArray_object() {
      return this.meta.scene.cNeedArray_object || false;
    }
  },
  methods: {
    handleAddRange() {
      if (!this.value) {
        this.value = [];
      }
      this.value.push({
        filters: [
          {
            field: "",
            relation: { value: "" },
            value: "",
            query: this.relatedInfoQuery
          }
        ],
        connector: "and",
        filterConnector: "and",
      });
     if (this.needSetOptions()) {
       this.$nextTick(() => {
         this.setOptions(this.options);
       });
     }
    },
    handleDeleteRange(index) {
      if (this.getMin() && this.value.length === this.getMin()) {
        kr.ui.error(`至少创建${this.getMin()}个筛选条件！`);
        return;
      }
      this.value.splice(index, 1);
    },
    handleAddFilter(index) {
      if (this.getMax() && this.value[index].filters.length === this.getMax()) {
        kr.ui.error(`最多能创建${this.getMax()}筛选条件！`);
        return;
      }
      const item = {
        value: null,
        relation: null,
        field: '',
        id: kr.random.string(16),
        query: this.relatedInfoQuery
      };
     this.value[index].filters.push(item);
     if (this.needSetOptions()) {
       this.$nextTick(() => {
         this.setOptions(this.options);
       });
     }
    },
    handleDeleteFilter(index, subIndex) {
      this.value[index].filters.splice(subIndex, 1);
    },
    setValue(nv, ...args) {
      if (Array.isArray(nv)) {
        const isRangeFormat = nv.every(range => range.filters && range.connector);
        if (!isRangeFormat) {
          const ranges = [];
          ranges.push({
            connector: "and",
            filters: nv,
            filterConnector: "and"
          });
          nv = [...ranges];
        }
        if (nv.length) {
          nv.forEach(range => {
            if (range.filters && range.filters[0] && !range.filters[0].id) {
              range.filters[0].id = "firstRow";
            }
          });
        }
      } else if (nv && nv.filters) {
        let { filters, pattern } = nv;
        if (!this.skipFormat()) {
          filters = this.formatFilters(filters);
        }
        const ranges = [];   
        if (pattern) {
          const tempRanges = kr.formatMd.parsePattern(pattern);
          tempRanges.forEach(range => {
            const [start, end] = range.position;
            range.filters = filters.slice(start, end);
            if (range.filterConnector === undefined) {
              range.filterConnector = "and";
            }
            ranges.push(range);
          });
        } else {
          if (filters.length === 0) {
            filters = [
              {
                field: "",
                relation: { value: "" },
                value: "",
              }
            ]
          }
          ranges.push({
            connector: "and",
            filters,
            filterConnector: "and"
          });
        }
        nv = [...ranges];
      } else {
        nv = [];
      }
      mixin.methods.setValue.call(this, nv, ...args);
    },
    setOptions(option, display) {
      this.options = option;
      if (this.value) {
        this.value.forEach((item, index) => {
          let rows = this.$refs['rows' + index];
          rows && rows.forEach((i, n) => {
            let { a } = i.$refs;
            a.setRuntimeRelatedData(option, 'fetch');
            // display && (a.$emit('input', a.value, { [a.value]: option.find((item) => {
            //   return item.apiName === a.value;
            // })}))
          })
        })
      }
    },
    getKV() {
      const { meta, disabled } = this;
      if (disabled) {
        return [];
      }
      if (!this.value) {
        this.value = [];
      }
      if (!Array.isArray(this.value)) {
        this.value = [this.value];
      }
      let allFilters = [];
      let rules = [];
      let allIndex = 1;
      this.value.forEach((range, index) => {
        let rows = this.$refs[`rows${index}`];
        if (!rows) {
          rows = [];
        }
        if(!Array.isArray(rows)) {
          rows = [rows];
        };
        let filters = [];
        rows.forEach(row => {
          let nv = row.getValue();
          filters.push(nv);
        });
        allFilters.push(...filters);
        rules.push({
          connector: range.connector || "and",
          filterConnector: range.filterConnector || "and",
          ids: filters.map((v, i) => i + allIndex)
        });
        allIndex += filters.length;
      });
      const pattern = rules.map((rule, index) => {
        if (index === rules.length - 1) {
          return ` ( ${rule.ids.join(` ${rule.connector} `)} ) `;
        }
        return ` ( ${rule.ids.join(` ${rule.connector} `)} ) ${rule.filterConnector}`;
      }).join(" ");
      
      let value = {
        filters: allFilters,
        pattern: pattern
      };
      return [meta.key, value];
    },
    getMax() {
      const max = this.meta && this.meta.scene && this.meta.scene.max;
      if (max !== undefined && Number.isInteger(max)) {
        return max;
      }
      return null;
    },
    getMin() {
      const min = this.meta && this.meta.scene && this.meta.scene.min;
      if (min !== undefined && Number.isInteger(min)) {
        return min;
      }
      return null;
    },
    skipFormat() {
      return this.meta && this.meta.scene && this.meta.scene.skipFormat;
    },
    needInfo() {
      return this.meta && this.meta.scene && this.meta.scene.needInfo;
    },
    needSetOptions() {
      return this.meta && this.meta.scene && this.meta.scene.manualSetOptions;
    },
    formatFilters(filters) {
      return filters.map((filter) => {
        return {
          field: {
            apiName: filter.fieldName,
            value: filter.value,
            operate: filter.operate,
            type: filter.fieldValueType,
            selectOptions: filter.selectOptions,
            recordTypeOptions: filter.recordTypeOptions,
            targetApiName: filter.targetApiName,
            subFieldName: filter.subFieldName,
            dateFormat: filter.dateFormat
          },
          relation: { value: filter.operator },
          value: kr.formatMd.formatValues(filter.fieldValues, filter.fieldValueType, filter.config, filter.operator)
        }
      });
    },
  },
};
</script>

<style lang="scss">
.comp-md-form-field-rangeCondition {
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

  .add-range {
    cursor: pointer;
    font-family: "PingFangSC-Regular";
    font-size: 13px;
    color: #525975;
    line-height: 18px;
    float: right;
    margin-top: -20px;
    &:hover {
      color: #606ECC;
      .add-icon {
        color: #606ECC;
      }
    }
    .add-icon {
      font-size: 14px;
      color: #9DA2B3;
      margin-right: 5px;
      &:hover {
        color: #606ECC;
      }
    }
  }

  .range {
    border: 1px solid #E6E9F5;
    border-radius: 2px;
    .range-bar {
      background: #E6E9F5;
      height: 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .range-icon {
        font-size: 24px;
        margin-left: 5px;
        cursor: pointer;
        &:hover {
          color: #606ECC;
        }
      }
      .delete-icon {
        font-size: 20px;
        margin-right: 5px;
        cursor: pointer;
        &:hover {
          color: #606ECC;
        }
      }
      .range-bar-relation {
        display: flex;
        align-items: center;
        height: 24px;
        .el-select {
          width: 80px;
        }
        .el-input--medium .el-input__inner {
          height: 24px;
          background: #E6E9F5;
          border: none;
        }
        .el-input__suffix, .el-input--medium .el-input__icon {
          line-height: 24px;
        }
      }
    }
    .range-filters {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .range-connector {
    display: flex;
    width: 100%;
    align-items: center;
    height: 24px;
    margin-top: 2px;
    margin-bottom: 2px;
    .range-connector-separator {
      flex: 1;
      height: 0;
      border-top: 1px dashed #D8D8D8;
    }
    .el-select {
      width: 100px !important;
    }
    .el-input--medium .el-input__inner {
      height: 24px;
      background: #F6F7FB;
      border: none;
    }
    .el-input__suffix, .el-input--medium .el-input__icon {
      line-height: 24px;
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
