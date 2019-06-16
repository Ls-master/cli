<template lang="html">
  <container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
    class="insight-select-container"
    >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT">
    </span>
    <div slot="field" >
      <el-select
        ref="field"
        v-bind="[local_element_props, element_props, runtime_element_props]"
        v-model="runtime_value"
        @input="handleInput"
        @focus="checkMode('handleFieldFocus', ...arguments)"
        @blur="checkMode('handleFieldBlur', ...arguments)"
        @visible-change="blur(...arguments)"
        @change="handleChange(...arguments)"
        :loading="loading"
        :class="'insight-select'"
        :popper-class="'insight-select-option'"
        :remote-method="search"
      >
          <template v-if="meta.type=='SELECT_COMPANY'">
            <el-option-group
              label="不关联对象"
              :key="'no-relate'">
              <el-option
                :value="lastKeyword"
                :label="lastKeyword"
                :key="lastKeyword"
                class="com-container"
              >
                <div class="com-option">
                  <div class="no-relate-container">
                    <svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-iconNotassociated"></use>
                    </svg>
                    <span class="no-relate-hint">不关联，直接创建</span>
                  </div>
                </div>
              </el-option>
            </el-option-group>
            <el-option-group
              :key="'relate'"
              label="关联对象">
              <el-option
                v-for="option in runtime_related_data"
                :value="option.value"
                :key="option.id"
                :label="option.label"
                class="com-container">
                <div class="com-option">
                  <div class="com-logo-div">
                    <img class="com-logo" :src="option.logo"/>
                  </div>
                  <span class="com-name">{{option.short_name | krEllipsis(5)}}<span class='com-full-name'> {{(option.name?('(' + option.name + ')'):'') | krEllipsis(11)}}</span></span>
                  <span class="com-intro">{{option.brief}}</span>
                </div>
              </el-option>
            </el-option-group>
          </template>
          <el-option
            v-else
            v-for="option in runtime_related_data"
            :key="getOptionKey ? option[getOptionKey.value] : option.value"
            :label="getOptionKey ? option[getOptionKey.label] : option.label"
            :value="getOptionKey ? option[getOptionKey.value] : option.value"
          />
      </el-select>
      <div class="relate-hint" v-if="insight_related_id__u">已关联鲸准数据{{companyLabel}}</div>
    </div>
  </container>
</template>

<script>
import _ from 'lodash';
// import layouts from 'component/form/field/basic/layouts';
import fieldMixin from '../../basic/field-mixin';
import selectMixin from '../../basic/select-mixin';
import { typeDict } from '../../basic/statics';

export default {
  INDEX: ['SELECT_COMPANY'],
  DEFAULT_COMPONENT_PROP: {
    SELECT_COMPANY: {
      clearable: true,
      remote: true,
      filterable: true,
      placeholder: '请搜索',
    }
  },
  DEFAULT_FORMAT: {
    SELECT_COMPANY: ''
  },
  SEARCH_CONDITION: {
    SELECT_COMPANY: ['EQUAL', 'NOT_EQUAL'],
  },
  SEARCH_FORM: {
    SELECT_COMPANY: 'EQUAL'
  },
  SEARCHES: [
    'SELECT_COMPANY', // 选择公司类型
  ],
  REMOTES: [ ],
  TABLES: [ ],
  ADDS: [ ],
  MULTIPLE: [
    'SELECT_MULTIPLE',
    'SELECT_MULTIPLE_REMOTE',
    'SELECT_SEARCH_MULTIPLE',
    'SELECT_MULTIPLE_REMOTE_FIELD',
    'RELATION_MULTIPLE',
    'RELATION_MULTIPLE_SUMMARY',
    'RELATION_MULTIPLE_FORM',
    'SELECT_SEARCH_MULTIPLE_CREATE'
  ],
  mixins: [
    fieldMixin,
    selectMixin,
  ],
  props: {},
  components: {},
  data() {
    const { meta } = this.$props;
    return {
      value: '',    
      runtime_value: '',  // 选项以公司名称为value
      init_value: '', //初始值，在options回来之前，先不要设置runtime_value，暂存init_value，避免展示id
      insight_related_id__u: '',    // 关联的洞见公司id
      loading: false,
      fields: {},
      lastKeyword: '',
      companyLabel: '',
      debouncedSearch: _.debounce(this.search.bind(this), 10)
    }
  },
  watch: {
    runtime_related_data(options){
      if(this.init_value){    // 如果有初始值，关联了洞见公司的
        this.runtime_value = this.init_value;
        this.init_value = '';
        this.companyLabel = this.getOptionById(this.runtime_value).label;
      }
    },
    value(val){
      if(kr.script.isObject(val) && val['inner_value']){
        if(val['insight_related_id__u']){   //如果是有id值的，即 关联了洞见数据的
          // 如果有选项值，并且有对应值，则直接赋值runtime_value，否则暂存init_value
          if((this.runtime_related_data.length > 0) && this.runtime_related_data.find((ii) => {
            +ii.value == +val['insight_related_id__u'];
          })){
            this.runtime_value = +val['insight_related_id__u'];
            this.companyLabel = this.getOptionById(+val['insight_related_id__u']).label;
          }else{
            this.runtime_value == '';
            this.init_value = +val['insight_related_id__u'];
          }
          
          this.insight_related_id__u = String(val['insight_related_id__u']);
        }else{
          this.runtime_value = val['inner_value'];
          this.insight_related_id__u = '';
        }
        
        this.search(val['inner_value']);
      }
    },
    finalEnv: {
      immediate: true,
      handler(val){
        if(this.meta.metaconfig && this.meta.metaconfig.insightIsMaster){
          if(!val.PURE){
            this.meta.scene.element_props.disabled = true;    //详情页，鲸准关联字段不能编辑
          } 
        }
      }
    }
  },
  computed: {
    getOptionKey() {
      if(this.meta && this.meta.scene && this.meta.scene.optionKey){
        return this.meta.scene.optionKey;
      }
      return null;
    },
    skin() {
      // const { meta, value, runtime_format } = this;
      return this.lastKeyword;
    },
  },
  methods: {
    getEnv(meta){   //暂时废弃
      if(meta.metaconfig && meta.metaconfig.insightIsMaster){
        if(!this.env.PURE){
          return { READONLY: true };  // 洞见关联数据，如果不是pure模式，则为只读，即详情页主体部分为只读
        }
      }
      return this.env;
    },
    blur(...args) {
      this.checkMode('handleBlur', ...args);
    },
    // 根据id 获取对应的option
    getOptionById(id){
      let res = {};
      (this.runtime_related_data || []).forEach((option) => {
        if(option.value == id){
          res =  Object.assign({}, option);
        }
      });
      return res;
    },
    handleChange(val){
      if(val == this.lastKeyword){    // 如果选择的是非关联对象（关联对象其value必然不和label相同）
        this.insight_related_id__u = '';  
      }else{
        let option = this.getOptionById(val);
        this.insight_related_id__u = String(option.id);
        this.companyLabel = option.label;
        if(option.id){
          this.updateComData(option.id);
        }
      }
    },

    // hack写法，直接由单组件触发 父组件即整个表单值的更新
    async updateComData(com_id){
      this.emit_SCENE('change', {insightData: com_id});
    },
    getMetaType(meta) {
      try {
        const { type } = meta;
        return typeDict[type] || '-';
      } catch (e) {
        return '-';
      }
    },
    // 定制化写keyValue方法，需要传递两个key
    getKV(){
      const { meta, disabled, runtime_value } = this;
      if(runtime_value != this.lastKeyword){
        let option = this.getOptionById(runtime_value);
        return {
          [meta.key]: option.label,
          'insight_related_id__u': this.insight_related_id__u
        };
      }else{
        return {
          [meta.key]: this.lastKeyword,
          'insight_related_id__u': ''
        };
      }
    },
    getForm() {
      const { disabled } = this;
      if (disabled) {
        return {};
      }
      const kv = this.getKV();
      return kv;
    },
    handleRequiredInput(nv, row) {
      const { cache } = this;
      const found = cache[row.value];
      if (found) {
        row.required = nv;
        this.cache = Object.assign({}, cache);
      }
    },
    handleDeleteField(row) {
      const { value } = this;
      if (Array.isArray(value)) {
        const index = value.findIndex(field => field === row.value);
        if (index > -1) {
          value.splice(index, 1);
        }
        this.setValue(value.slice());
      }
    },
    handleInput(nv) {
      this.setValue(nv);
    },
    handleFocus() {
      this.handleFieldFocus();
      const { field } = this.$refs;
      if (field) {
        field.visible = true;
      }
    },
    handleVisibleChange(nv) {
      if (!nv) {
        setTimeout(() => {
          // this.handleBlur();
          this.containerBlur();
        }, 0);
      }
    },
    search(keyword) { 
      this.lastKeyword = keyword;  //最后搜索关键字，避免直接用选项value导致不准确问题
      this.fetch({}, keyword );
    },
    handleQuickAdd() {
      this.$emit('quick-add', this);
    },
    makeRoute() {
      return {
        name: this.$route.name,
        params: {
          moduleInfoId: this.meta.scene.relationId,
          moduleDataId: this.value,
        },
      };
    },
    handleAnchor(e) {
      const { key } = this.meta;
      this.$emit('anchor', document.getElementById(layouts.getAnchorId(null, {
        id: key,
      })));
      e.stopPropagation();
    },
  },
  mounted() {

  },
}
</script>
<style lang="scss">
.insight-select-container{
  .relate-hint{
    font-size: 12px;
    line-height: 13px;
    color: #45c4b5;
    margin-bottom: -16px;
    margin-top: 3px;
  }
}
.insight-select-option{
  .el-select-group__title{
    line-height: 12px;
  }
}
.no-relate-container{
  height: 36px;
  line-height: 36px;
  font-size: 13px;
}
.com-container{
  position: relative;
  // width: 320px;
  height: 52px !important;
  padding: 8px 0 8px 20px !important;
  color: #2E3242;
  .com-option{
    position: relative;
    .icon{
      width: 1em; height: 1em;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
  .com-logo-div{
    position: absolute;
    top: 0;
    left: 0;
    width: 34px;
    height: 34px;
    line-height: 36px;
    border: 1px solid #ECF0F4;
    border-radius: 4px;
    background: #fff;
    overflow: hidden;
    .com-logo{
      display: block;
      width: 32px;
      height: 32px;
      line-height: 36px !important;
    }
  }
  .com-name{
    display: block;
    margin: 0 0 0 44px;
    font-size: 13px;
    height: 18px;
    line-height: 18px !important;
    .com-full-name{
      display: inline-block;
      font-size: 13px;
      height: 18px;
      line-height: 18px !important;
      vertical-align: top;
      color: #9da2b3;
    }
  }
  .com-intro{
    display: block;
    margin: 0 0 0 44px;
    font-size: 12px;
    line-height: 16px !important;
  }
}
</style>
