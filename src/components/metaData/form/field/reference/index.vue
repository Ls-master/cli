<template lang="html">
<div>
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
    <div slot="field">
      <el-select
        ref="field"
        v-bind="[local_element_props, element_props, runtime_element_props]"
        v-model="value"
        @input="handleInput"
        @focus="checkMode('handleFocus', ...arguments)"
        @blur="blur(...arguments)"
        @visible-change="checkMode('handleVisibleChange', ...arguments)"
        :loading="loading"
        :remote-method="debouncedSearch"
        :custom-icon="`plus`"
        @custom-icon-click="mainClick"
      >
        <el-option
          v-for="option in runtime_related_data"
          :key="getKey()"
          :disabled="getOptionKey ? option[getOptionKey.disabled] : option.disabled"
          :label="getOptionKey ? option[getOptionKey.label] : option.label"
          :value="getOptionKey ? option[getOptionKey.value] : option.value"
        />
      </el-select>
      <!-- <div class="kr-reference">
        <div class="kr-reference__inner" :class="{'disabled': conf_element_props.disabled}">
          <el-tag
            type="info"
            v-for="tag in value"
            :key="tag.id"
            size="small"
            @close="handleRemove(tag)"
          >
            {{tag.name | krEllipsis(15)}}
          </el-tag>
        </div>

        <span class="kr-reference__suffix" :class="{'disabled': conf_element_props.disabled}">
          <span class="kr-reference__suffix-inner">
            <i class="el-icon-plus"></i>
          </span>
        </span>
      </div> -->
    </div>

  </container>

  <el-dialog
    v-if="mainDialog.visible"
    :close-on-click-modal="false"
    append-to-body
    top="60px"
    @close=""
    @update:visible="handleUpdateVisible"
    :style="`max-height: ${this.maxHeight}px`"
    :visible.sync="mainDialog.visible"
    :title="meta.name || mainDialog.title"
  >
    <row
      ref="row"
      :selection_rows="selection_rows"
      v-bind="reference"
      @metadataChange="metadataChange"
    />
    <span slot="footer" class="dialog-footer">
      <el-button @click="mainDialog.visible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import selectMixin from '../basic/select-mixin';
import row from './row.vue';

export default {
  INDEX: ['OBJECT_REFERENCE', 'MULTI_OBJECT_REFERENCE'],
  DEFAULT_FORMAT: {},
  DEFAULT_COMPONENT_PROP: {
    OBJECT_REFERENCE: {
      remote: true,
      filterable: true
    },
    MULTI_OBJECT_REFERENCE: {
      remote: true,
      filterable: true,
      multiple: true,
    }
  },
  MULTIPLE: ['MULTI_OBJECT_REFERENCE'],
  mixins: [
    fieldMixin,
    selectMixin
  ],
  data() {
    return {
      mainDialog: {
        visible: false,
        title: '关联字段',
      },
      metaData: null,
      debouncedSearch: _.debounce(this.search.bind(this), 1000),
      lastKeyword: '',
    }
  },
  computed: {
    maxHeight() {
      return (document.documentElement.clientHeight * 0.9);
    },
    reference() {
      let reference = this.meta.scene.reference ? this.meta.scene.reference : {};
      return Object.assign({}, reference);
    },
    selection_rows() {
      let v = Array.isArray(this.value) ? this.value : [this.value];
      const { cache } = this;
      const optionKey = this.getOptionKey;

      v = v.reduce((result, item) => {
        const option = cache[item];
        if (option !== undefined) {
          result.push(option);
        }
        return result;
      }, []);

      return v;
    },
    getOptionKey() {
      if(this.meta && this.meta.scene && this.meta.scene.optionKey){
        return this.meta.scene.optionKey;
      }
      return null;
    },
  },
  methods: {
    getKey() {
      return kr.getId(16);
    },
    // handleClick() {
    //   fieldMixin.methods.handleClick.call(this);
    //   if(!this.conf_element_props.disabled) {
    //     this.mainClick();
    //   }
    // },
    mainClick() {
      const { field } = this.$refs;
      if (field) {
        field.visible = false;
      }
      if (!this.conf_element_props.disabled) {
        this.mainDialog.visible = true;
      }
    },
    handleUpdateVisible() {

    },
    handleRemove(tag){
      for(let i = this.value.length - 1; i >=0; i--){
        this.value[i].id == tag.id;
        this.value.splice(i, 1);
        return;
      }
    },
    // doCache(nv) {
    //   this.cache = nv;
    // },
    // setValue(nv, source = 'inner', always = false) {
    //   if(source !== 'inner') {
    //     this.doCache(nv);
    //   }
    //   this.value = nv;
    //   if (always || !kr.script.compare(this.value, this.oldValue)) {
    //     if(!this.submitDataflow.length) {   // 如果存在内部提交数据流, emtter 在调教 renturn 后执行(submitFinally)
    //       this.emit_FIELD('change', source);
    //       this.emit_SCENE('change', source);
    //     }
    //     this.$emit('input', nv, this.cache, source);
    //   }
    //   this.oldValue = this.value;
    //   console.log(this.value);
      
    // },
    setValue(nv, ...args) {
      const { meta } = this;
      if(meta.type === 'OBJECT_REFERENCE' && Array.isArray(nv)) {
        nv = nv[0];
      }
      if ((nv === null || nv === undefined) && (meta.type.indexOf('MULTI') > -1 || meta.type.indexOf('SUMMARY') > -1)) {
        nv = [];
      }
      fieldMixin.methods.setValue.call(this, nv, ...args);
      this.setRuntimeRelatedData(this.related_data_bak, 'fetch');
    },
    handleSubmit() {
      const rows = this.$refs.row.selectionRows;
      let v = this.getOptionKey ? this.getOptionKey.value : 'value';
      this.setValue(rows.map(r => r[v]));
      this.mainDialog.visible = false;
    },
    // 内部数据流请求 return 后执行
    submitFinally() {
      if(!kr.script.compare(this.value, this.cache)) {
        // 更新缓存
        this.doCache(this.value);
        this.emit_FIELD('change', 'inner');
        this.emit_SCENE('change', 'inner');
      }
    },
    getKV() {
      const { needArray_object } = this.meta.scene;
      const { cache } = this;
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;

      if(!v) {
        v = [];
      };
      // 控制 getValue return 数组对象格式
      if(needArray_object) {
        if(Array.isArray(v)) {
          v = v.reduce((result, item) => {
            const option = cache[item];
            if (option !== undefined) {
              option.meta = this.metaData;
              result.push(option);
            }
            return result;
          }, []);
        } else {
          v = cache[v];
          v.meta = this.metaData;
        }
      }

      // let ids = v.map(item => item.id);
      return [k, v];
    },
    metadataChange(metaData) {
      this.metaData = metaData;
    },
    blur(...args) {
      this.checkMode('handleBlur', ...args);
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
  },
  watch: {
    "mainDialog.visible": {
      handler(v) {
        if(!v) {
          this.checkMode('handleFieldBlur');
        }
      }
    }
  },
  components: {
    row
  },
  mounted() {
    this.search('');
    this.emit_FIELD('mounted');
  }
}
</script>

<style lang="scss">
  .kr-reference {
    width: 100%;
    position: relative;
    font-size: 13px;
    display: inline-block;
    vertical-align: bottom;
    cursor: pointer;
    .kr-reference__inner {
      width: 100%;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #525975;
      /*display: inline-block;*/
      align-items: center;
      font-size: inherit;
      min-height: 36px;
      line-height: 36px;
      outline: none;
      padding: 0 8px;
      padding-right: 30px;
      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
        background-color: #F6F7FB;
      }
      .el-tag {
        margin-right: 5px;
        border-radius: 2px;
        color: #525975;
        background: #f6f7fb;
        border: none;
        cursor: text;
        .el-tag__close.el-icon-close{
          color: #fff;
          background: #c0c4cc;
          cursor: pointer;
        }
      }
    }
    .kr-reference__suffix {
      position: absolute;
      height: 100%;
      right: 5px;
      top: 0;
      text-align: center;
      color: #B8BBCC;
      transition: all .3s;
      pointer-events: none;
      height: 36px;
      width: 25px;
      line-height: 36px;
      .kr-reference__suffix-inner {
        pointer-events: all;
      }
      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
</style>
