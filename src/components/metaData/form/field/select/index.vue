<template lang="html">
  <container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
    >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT">
    </span>
    <div slot="field" >
      <el-select
        ref="field"
        v-bind="[local_element_props, element_props, runtime_element_props]"
        v-model="value"
        @input="handleInput"
        @focus="checkMode('handleFocus', ...arguments)"
        @blur="blur(...arguments)"
        @visible-change="checkMode('handleVisibleChange', ...arguments)"
        :loading="loading"
        :remote-method="$options.SEARCHES.find(item=>item===type)?debouncedSearch:null"
      >
        <el-option
          v-for="option in runtime_related_data"
          :key="getKey()"
          :disabled="getOptionKey ? option[getOptionKey.disabled] : option.disabled"
          :label="getOptionKey ? option[getOptionKey.label] : option.label"
          :value="getOptionKey ? option[getOptionKey.value] : option.value"
        />
      </el-select>
    </div>
  </container>
</template>

<script>
import _ from 'lodash';
// import layouts from 'component/form/field/basic/layouts';
import fieldMixin from '../basic/field-mixin';
import selectMixin from '../basic/select-mixin';
import { typeDict } from '../basic/statics';

export default {
  INDEX: ['SELECT', 'SELECT_MULTIPLE', 'SELECT_REMOTE', 'SELECT_MULTIPLE_REMOTE', 'SELECT_SEARCH', 'SELECT_SEARCH_MULTIPLE', 'SELECT_MULTIPLE_REMOTE_FIELD', 'SELECT_SEARCH_MULTIPLE_FIELD', 'RELATION_SINGLE', 'RELATION_MULTIPLE', 'RELATION_SINGLE_SUMMARY', 'RELATION_MULTIPLE_SUMMARY', 'RELATION_SINGLE_FORM', 'RELATION_MULTIPLE_FORM', 'SELECT_SEARCH_CREATE', 'SELECT_SEARCH_MULTIPLE_CREATE'],
  DEFAULT_COMPONENT_PROP: {
    SELECT: {
      clearable: true,
    },
    SELECT_MULTIPLE: {
      multiple: true,
    },
    SELECT_REMOTE: {
      clearable: true,
    },
    SELECT_MULTIPLE_REMOTE: {
      multiple: true,
    },
    SELECT_MULTIPLE_REMOTE_FIELD: {
      multiple: true,
    },
    SELECT_SEARCH_MULTIPLE_FIELD: {
      remote: true,
      filterable: true,
      multiple: true,
    },
    SELECT_SEARCH: {
      clearable: true,
      remote: true,
      filterable: true,
      placeholder: '请搜索',
    },
    SELECT_SEARCH_MULTIPLE: {
      remote: true,
      filterable: true,
      multiple: true,
      placeholder: '请搜索',
    },
    SELECT_SEARCH_CREATE: {
      clearable: true,
      remote: true,
      filterable: true,
      placeholder: '请搜索',
    },
    SELECT_SEARCH_MULTIPLE_CREATE: {
      remote: true,
      filterable: true,
      multiple: true,
      placeholder: '请搜索',
    },
    RELATION_SINGLE: {
      clearable: true,
      remote: true,
      filterable: true,
      placeholder: '请搜索',
    },
    RELATION_MULTIPLE: {
      remote: true,
      multiple: true,
      filterable: true,
      placeholder: '请搜索',
    },
    RELATION_SINGLE_SUMMARY: {
      multiple: true,
      remote: true,
      filterable: true,
      placeholder: '请搜索',
    },
    RELATION_MULTIPLE_SUMMARY: {
      remote: true,
      multiple: true,
      filterable: true,
      placeholder: '请搜索',
    },
    RELATION_SINGLE_FORM: {
      clearable: true,
      remote: true,
      filterable: true,
      placeholder: '请搜索',
    },
    RELATION_MULTIPLE_FORM: {
      remote: true,
      multiple: true,
      filterable: true,
      placeholder: '请搜索',
    },
  },
  SEARCH_CONDITION: {
    SELECT: ['EQUAL', 'NOT_EQUAL'],
    SELECT_MULTIPLE: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    SELECT_REMOTE: ['EQUAL', 'NOT_EQUAL'],
    SELECT_MULTIPLE_REMOTE: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    SELECT_MULTIPLE_REMOTE_FIELD: ['EQUAL', 'NOT_EQUAL'],
    SELECT_SEARCH_MULTIPLE_FIELD: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    SELECT_SEARCH: ['EQUAL', 'NOT_EQUAL'],
    SELECT_SEARCH_MULTIPLE: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    SELECT_SEARCH_CREATE: ['EQUAL', 'NOT_EQUAL'],
    SELECT_SEARCH_MULTIPLE_CREATE: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    RELATION_SINGLE: ['EQUAL', 'NOT_EQUAL'],
    RELATION_MULTIPLE: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    RELATION_SINGLE_SUMMARY: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    RELATION_MULTIPLE_SUMMARY: ['CONTAIN_FOR_MULTIPLE', 'NOT_CONTAIN_FOR_MULTIPLE'],
    //      RELATION_SINGLE_FORM: ['EQUAL', 'NOT_EQUAL'],
    //      RELATION_MULTIPLE_FORM: ['EQUAL', 'NOT_EQUAL'],
  },
  SEARCH_FORM: {
    SELECT: 'EQUAL',
    SELECT_MULTIPLE: 'EQUAL',
    SELECT_REMOTE: 'EQUAL',
    SELECT_MULTIPLE_REMOTE: 'EQUAL',
    SELECT_MULTIPLE_REMOTE_FIELD: 'EQUAL',
    SELECT_SEARCH_MULTIPLE_FIELD: 'EQUAL',
    SELECT_SEARCH: 'EQUAL',
    SELECT_SEARCH_MULTIPLE: 'EQUAL',
    SELECT_SEARCH_CREATE: 'EQUAL',
    SELECT_SEARCH_MULTIPLE_CREATE: 'EQUAL',
    RELATION_SINGLE: 'EQUAL',
    RELATION_MULTIPLE: 'EQUAL',
    RELATION_SINGLE_SUMMARY: 'EQUAL',
    RELATION_MULTIPLE_SUMMARY: 'EQUAL',
    //      RELATION_SINGLE_FORM: 'EQUAL',
    //      RELATION_MULTIPLE_FORM: 'EQUAL',
  },
  SEARCHES: [
    'SELECT_SEARCH',
    'SELECT_SEARCH_MULTIPLE',
    'SELECT_SEARCH_CREATE',
    'SELECT_SEARCH_MULTIPLE_CREATE',
    'SELECT_SEARCH_MULTIPLE_FIELD',
    'RELATION_SINGLE',
    'RELATION_MULTIPLE',
    'RELATION_SINGLE_SUMMARY',
    'RELATION_MULTIPLE_SUMMARY',
    'RELATION_SINGLE_FORM',
    'RELATION_MULTIPLE_FORM',
  ],
  REMOTES: [
    'SELECT_REMOTE',
    'SELECT_MULTIPLE_REMOTE',
    'SELECT_MULTIPLE_REMOTE_FIELD',
  ],
  TABLES: [
    'SELECT_MULTIPLE_REMOTE_FIELD',
    'SELECT_SEARCH_MULTIPLE_FIELD',
  ],
  ADDS: [
    'RELATION_SINGLE_FORM',
    'RELATION_MULTIPLE_FORM',
  ],
  ENV: {
    SELECT_MULTIPLE_REMOTE_FIELD: {
      QUICK_MODE_HACK: true,
    },
    SELECT_SEARCH_MULTIPLE_FIELD: {
      QUICK_MODE_HACK: true,
    },
    RELATION_SINGLE_FORM: {
      QUICK_MODE_HACK: true,
    },
    RELATION_MULTIPLE_FORM: {
      QUICK_MODE_HACK: true,
    },
  },
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
  // DEFAULT_FORMAT: {
  //   SELECT: 'select_one',
  //   SELECT_MULTIPLE: 'select_many',
  //   SELECT_REMOTE: 'select_one',
  //   SELECT_MULTIPLE_REMOTE: 'select_many',
  //   SELECT_MULTIPLE_REMOTE_FIELD: 'select_many',
  //   SELECT_SEARCH_MULTIPLE_FIELD: 'select_many',
  //   SELECT_SEARCH: 'select_one',
  //   SELECT_SEARCH_MULTIPLE: 'select_many',
  //   SELECT_SEARCH_CREATE: 'select_one',
  //   SELECT_SEARCH_MULTIPLE_CREATE: 'select_many',
  // },
  mixins: [
    fieldMixin,
    selectMixin,
  ],
  props: {},
  components: {},
  data() {
    const { meta } = this.$props;
    let value = null;
    if (meta.type.indexOf('MULTIPLE') > -1 || meta.type.indexOf('SUMMARY') > -1) {
      value = [];
    }
    return {
      value,
      loading: false,
      fields: {},
      debouncedSearch: _.debounce(this.search.bind(this), 1000),
      lastKeyword: '',
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
      const {
        meta, value, cache, runtime_format,
      } = this;
      const return_value = meta && meta.scene && meta.scene.return_value;
      const final = Array.isArray(value) ? value.reduce((result, item) => {
        if (cache[item]) {
          if(return_value){
            result.push(item);  
          }else{
            result.push(cache[item]);
          }
        }
        return result;
      }, []) : (return_value ? value : cache[value]);

      let format = null;
      if (runtime_format) {
        format = runtime_format;
      } else if (meta.scene.format) {
        ({ format } = meta.scene);
      } else {
        format = this.$options.DEFAULT_FORMAT[meta.type];
      }
      return kr.format.make(format, final, meta, this);
    },
  },
  methods: {
    getKey() {
      return kr.getId(16);
    },
    blur(...args) {
      if(this.type.indexOf('CREATE') > -1) {
        this.doAutoFill();
      }
      this.checkMode('handleBlur', ...args);
    },
    doAutoFill() {
      const { field } = this.$refs;
      if (field) {
        const { query } = field;
        if (query) {
          const { value } = this;
          const newOption = { label: query, value: query };
          const { runtime_related_data } = this;
          const doFillOptions = () => {
            if (!runtime_related_data.find(option => option.value === newOption.value)) {
              runtime_related_data.push(newOption);
            }
          };
          if (Array.isArray(value)) {
            doFillOptions();
            this.setValue(value.concat([value]));
          } else if (!value) {
            doFillOptions();
            this.setValue(query);
          }
        }
      }
    },
    getMetaType(meta) {
      try {
        const { type } = meta;
        return typeDict[type] || '-';
      } catch (e) {
        return '-';
      }
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
    handleBlur() {
      const { field } = this.$refs;
      if (field) {
        if (!field.visible) {
          this.handleFieldBlur();
        }
      }
    },
    handleVisibleChange(nv) {
      if (!nv) {
        setTimeout(() => {
          this.handleBlur();
        }, 0);
      }
    },
    search(keyword) {
      this.lastKeyword = keyword;
      this.fetch({}, { keyword });
    },
    searchAgain() {
      this.search(this.lastKeyword);
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
    const { type } = this;
    if (this.$options.REMOTES.find(item => item === type)) {
      this.fetch();
    }
    if (this.$options.SEARCHES.find(item => item === type)) {
      this.search('');
    }
    this.emit_FIELD('mounted');
  },
}
</script>

<style lang="css">
</style>
