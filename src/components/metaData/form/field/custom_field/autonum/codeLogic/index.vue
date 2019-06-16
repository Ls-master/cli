<template lang="html">
  <container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
    >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <div
      class="field-code-logic"
      ref="field"
      slot="field"
      @focus="checkMode('handleFieldFocus', ...arguments)"
      @blur="checkMode('handleComposeBlur', ...arguments)"
    >
      <div class="content" v-if="inner_value.length>0">
        <draggable
          v-model="inner_value">
          <Row
            v-for="(item,i) in inner_value"
            :key="item.id"
            :data="item"
            :level="1"
            :hasSub="limit==1"
            :options="opts"
            :addType="addType"
            @delete="handleDelete(i)"
            @add-child="handleAdd(i)"
            @focus="checkMode('fieldFocus', ...arguments)"
            @blur="checkMode('handleComposeBlur', ...arguments)"
            class="row"
          >
          </Row>
        </draggable>
      </div>
    </div>
  </container>
</template>
<style lang="scss">

</style>
<script>
// import { mapMutations } from 'vuex';
import _ from 'lodash';
import draggable from 'vuedraggable';
// import { getModuleInfoList } from 'wrapper/ajax/field';
import { fieldList } from "@/service/metaData/businessCustomization";
import fieldMixin from '../../../basic/field-mixin';

export default {
  INDEX: ['CODE_LOGIC'],
  DEFAULT_VALIDATE: {
    CODE_LOGIC: [{
      validator(rule, value, callback) {
        const dict = {};
        let error = null;
        let autoIncreNoFlag = 0;
        (value || []).forEach((ii) => {
          if(ii.optionData.apiName == 'autoIncreNo'){
            autoIncreNoFlag++;
          }  
        })
        if(autoIncreNoFlag != 1){
          callback(new Error('必须包含且只能包含一个自增流水号')); return;
        }
        

        kr.collection.dfs(null, value, 'children', (parent, now) => {
          const { optionData } = now;

          if (optionData.apiName === '') {
            error = new Error('apiName必填');
            return error;
          }
          if (optionData.type === 'custom_text' && optionData.StrVal === '') {
            error = new Error('自定义字符串内容必填');
            return error;
          }
          if (optionData.type === 'custom_text' && optionData.StrVal.length > 20) {
            error = new Error('自定义字符串最长20个字符');
            return error;
          }
          if (optionData.type === 'date' && (optionData.DateVal.chooseKey === '')) {
            error = new Error('日期取值不能为空');
            return error;
          }
          if (optionData.type === 'date' && optionData.DateVal.chooseKey === 'year' && (optionData.DateVal.chooseKey === '' || optionData.DateVal.chooseNum === '')) {
            error = new Error('日期取值和位数不能为空');
            return error;
          }
          if (optionData.type === 'autoIncreNo' && (optionData.AutoIncreNoVal.start_num === '' || optionData.AutoIncreNoVal.digit_num === '')) {
            error = new Error('自增流水号位数和起始编号必填');
            return error;
          }
          if (optionData.type === 'autoIncreNo' && (Number(optionData.AutoIncreNoVal.start_num) === 0 || Number(optionData.AutoIncreNoVal.digit_num) === 0)) {
            error = new Error('自增流水号的起始编号和位数不能为0');
            return error;
          }
          if (optionData.type === 'autoIncreNo') {
            const testNum = /^[0-9]*$/;
            if (!testNum.test(optionData.AutoIncreNoVal.start_num) || !testNum.test(optionData.AutoIncreNoVal.digit_num)) {
              error = new Error('自增流水号的位数和起始编号必须是数字');
              return error;
            }
            if (optionData.AutoIncreNoVal.start_num.length > Number(optionData.AutoIncreNoVal.digit_num)) {
              error = new Error('自增流水号的起始编号的长度不能大于位数');
              return error;
            }
            if (Number(optionData.AutoIncreNoVal.digit_num) > 5 || Number(optionData.AutoIncreNoVal.digit_num) < 1) {
              error = new Error('自增流水号位数为1-5的整数');
              return error;
            }
          }
          if (optionData.type === 'select_one' && optionData.selectVal === '') {
            error = new Error('单选类型值必填');
            return error;
          }
        });

        if (error) {
          callback(error);
        } else {
          callback();
        }
      },
    }],
  },
  mixins: [ fieldMixin ],
  props: {
    outerValue: kr.vue.getPropArray(),
  },
  components: {
    Row: require('./row').default,
    Draggable: draggable,
  },
  data() {
    return {
      addType: this.meta.addType,  //添加类型，新建业务(addObject) 还是新建字段 (addField)使用
      filterList: ['phone_number', 'text', 'email', 'currency_group', 'number', 'select_one', 'department', 'date', 'percentile'],   // 支持编号的字段类型[电话，文本，邮箱，货币，数字，单选，部门，日期，百分比，人员]
      auto_add: { type: 'autoIncreNo', apiName: 'autoIncreNo', label: '自增流水号' },  //自增流水号类型，固定不可变类型
      custom_text: { type: 'custom_text', apiName: 'custom_text', label: '自定义字符串' },  //自定义字符串
      inner_value: [],
      opts: [{ type: 'autoIncreNo', apiName: 'autoIncreNo', label: '自增流水号' }]
    };
  },
  computed: {
    limit() {
      let limit = 1;
      try {
        const outer = this.meta.scene.limit;
        if (outer) {
          limit = outer;
        }
      } catch (e) {
        e;
      }
      limit = Math.min(3, Math.max(1, limit));
      return limit;
    },
  },
  methods: {
    getEnv(meta){
      if(!this.env.PURE){
        return { READONLY: true };  // 如果不是pure模式，则为只读，即详情页主体部分为只读
      }
      return this.env;
    },
    saveCodeLogic(){
      // ...mapMutations('autoCode', ['saveCodeLogic']),      
    },
    setValue(nv, ...args) {
      if (!Array.isArray(nv)) {
        nv = [];
      }
      if(nv.length == 0){
        this.inner_value.splice(0, this.inner_value.length, {
          optionData: {
            apiName: 'autoIncreNo', 
            type: 'autoIncreNo',
            label: '自增流水号',
            DepSelectVal: '_number',  //部门查找，默认给个部门编号
            selectVal: '_value',  //单选查找
            StrVal: '',   //自定义字符串
            DateVal: { chooseKey: 'year', chooseNum: '_YYYY' },
            AutoIncreNoVal: { digit_num: '3', start_num: '1' }
          },
          id: kr.random.string_number(),
        })
      }else{
        this.inner_value = nv;
      }
    },
    handleAdd(i) {
      const nv = this.inner_value.slice();
      let target = null;
      target = nv;
      if (Array.isArray(target)) {
        let item = {
          optionData: { 
            apiName: 'custom_text', 
            type: 'custom_text',
            label: '自定义字符串',
            DepSelectVal: '_number',  //部门单选，默认给个部门编号
            selectVal: '_value', //单选值
            StrVal: '',   //自定义字符串
            DateVal: { chooseKey: 'year', chooseNum: '_YYYY' },
            AutoIncreNoVal: { digit_num: '3', start_num: '1' }
          },
          id: kr.random.string(16),
        };
        target.splice(i+1, 0, item)
        this.setValue(target);
      }
    },
    handleDelete(index) {
      if (this.inner_value.length <= 1) {
        return kr.ui.error('必须有至少一条编号规则');
      }
      this.inner_value.splice(index, 1);
    },
    getKV() {
      return [this.meta.key, this.inner_value];
    },
    async getOpts() {
      let result = await fieldList({
        data: {
          apiName: this.$route.params.apiName
        },
      });
      let tmpData = [];
      result.data && (result.data.tableData || []).forEach((item) => {
        if(this.filterList.indexOf(item.type) > -1){
          if(item.type == 'date'){
            if(item.defineType == 'system'){
              //如果是系统产生的时间如创建时间，修改时间可以使用，否则跳过
              if(item.apiName != 'created_at' && item.apiName != 'last_modified_at') return;
            }
          } 
          if(item.apiName == 'current_stage') return; //业务阶段跳过
          let tmpObj = {
            type: item.type,
            label: item.label,
            value: item.apiName,
            apiName: item.apiName
          };
          if(item.type == 'date'){
            tmpObj.dateFormat = item.dateFormat;
          }
          tmpData.push(tmpObj);
        }
      })
      this.opts = [_.cloneDeep(this.auto_add)].concat(_.cloneDeep(this.custom_text)).concat(tmpData);  //选项中要
      
      if (this.inner_value.length < 1) {
        let item = {
          optionData: {
            apiName: 'autoIncreNo', 
            type: 'autoIncreNo',
            label: '自增流水号',
            DepSelectVal: '_number',  //部门查找，默认给个部门编号
            selectVal: '_value',  //单选查找
            StrVal: '',   //自定义字符串
            DateVal: { chooseKey: 'year', chooseNum: '_YYYY' },
            AutoIncreNoVal: { digit_num: '', start_num: '' }
          },
          id: kr.random.string_number(),
        };
        this.inner_value.splice(0, 0, item);
      }else{
        this.updateOptions(); //如果字段是编辑态，以前有值，需要刷新一次option
      }
    },
    updateOptions(){  // 更新选项，每个字段只能出现一次，除了自定义字符串
      let val = this.inner_value;
      this.opts.forEach((ii) => {
        if(ii.type == 'custom_text') return;   //自定义字符串不限制
        let index = (val || []).findIndex((iii) => {
          return iii.optionData.type == ii.type
        });
        if(index > -1){
          ii.disabled = true;
        }else{
          ii.disabled = false;
        }
      });
    }
  },
  mounted() {
    if(this.addType == 'addField'){   //字段处理
      this.getOpts();   //只有添加/修改字段的时候才能去拉取字段列表
    }else{    //新建业务
      let item = {
        optionData: {
          apiName: 'autoIncreNo', 
          type: 'autoIncreNo',
          label: '自增流水号',
          DepSelectVal: '_number',  //部门查找，默认给个部门编号
          selectVal: '_value',  //单选查找
          StrVal: '',   //自定义字符串
          DateVal: { chooseKey: 'year', chooseNum: '_YYYY' },
          AutoIncreNoVal: { digit_num: '3', start_num: '1' }
        },
        id: kr.random.string_number(),
      };
      this.inner_value.splice(0, this.inner_value.length, item);
    }
  },
  watch: {
    inner_value: {
      deep: true,
      immediate: true,
      handler(val){ //值改变时，更新选项，同时发事件出去更新分组编码 和 预览
        //更新选项，同一个apiName的不能再次选择
        this.updateOptions();

        let options = (val || []).map((ii) => {
          let optionData = ii.optionData;
          return{
            apiName: optionData.apiName, 
            type: optionData.type,
            label: optionData.label,
            rawData: ii   //原始数据
          }
        })
        this.emit_FIELD('change_inner_val', { options: options });
      }
    },
  },
};
</script>

