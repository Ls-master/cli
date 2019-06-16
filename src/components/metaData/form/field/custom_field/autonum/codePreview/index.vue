<template>
  <div v-if="disabled"/>
  <Container :disabled="conf_element_props.disabled" :runtime_validate="runtime_validate"
    v-else
    ref="container"
    :meta="meta"
    :env="finalEnv"
    @click="handleClick"
  >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <div
      class="field-code-preview"
      ref="field"
      slot="field"
      @focus="checkMode('handleFieldFocus', ...arguments)"
      @blur="checkMode('handleComposeBlur', ...arguments)"
    >
      <!-- <el-button @click="handlePreview">预览</el-button> -->
      <el-table
      :data="tableData"
      class="preview-table"
      border>
        <el-table-column
          v-for="(item, index) in headerData"
          :key="index"
          :prop="item.id"
          :label="item.label">
        </el-table-column>
      </el-table>
    </div>
  </Container>
</template>
<script>
import _ from 'lodash';
import fieldMixin from '../../../basic/field-mixin';

export default {
  INDEX: ['CODE_PREVIEW'],
  DEFAULT_VALIDATE: { },
  mixins: [ fieldMixin ],
  props: {
    outerValue: kr.vue.getPropArray(),
  },
  components: {

  },
  data() {
    return {
      rawData: [],  //原始选择数据
      tableData: [],  //表格数据
      headerData: []  //表头
    };
  },
  computed: {
  },
  methods: {
    handlePreview(){  //点击预览
      let tmpRowData = {};
      let tmpHeadData = [];
      this.rawData.forEach((opt) => {
        opt = (opt.rawData && opt.rawData.optionData) || {};
        tmpHeadData.push({ id: opt.apiName, label: opt.label });
        if(opt.type == 'custom_text'){
          tmpRowData[opt.apiName] = opt.StrVal;
        }else if(opt.type == 'autoIncreNo'){
          const iNum = Number(opt.AutoIncreNoVal.digit_num);
          const iCount = opt.AutoIncreNoVal.start_num;
          let zeroNum = '';
          const vKey = iCount;
          for (let i = 0; i < iNum - (iCount.length-1); i++) { 
            if (i >= 1) {
              zeroNum += '0';
            }
          }
          tmpRowData[opt.apiName] = (zeroNum + iCount);
        }else if(opt.type == 'department'){
          tmpRowData[opt.apiName] = opt.DepSelectVal=='_number'?'部门编号':'部门名称';
        }else if(opt.type == 'select_one'){
          tmpRowData[opt.apiName] = opt.selectVal=='_value'?'选项编号':'选项名称';
        }
      });
      this.headerData.splice(0, this.headerData.length, ...tmpHeadData);
      this.tableData.splice(0, this.tableData.length, tmpRowData);
    },
    setOptions(vals){    //传过来的option格式[{apiName,label,type, rawData}]
      this.rawData = vals;
      this.handlePreview();
    }
  },
  mounted() {
      
  },
  watch: {
  },
};
</script>
<style lang="scss">
.preview-table {
  margin-top: 12px;
}
</style>
