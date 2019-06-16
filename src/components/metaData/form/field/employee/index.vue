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
    <div slot="field" ref="field" @click="mainClick">
      <div class="kr-employee">
        <div class="kr-employee__inner" :class="{'disabled': conf_element_props.disabled}">
          <el-tag
            type="info"
            v-for="tag in employees"
            :key="tag.id"
            size="small"
            @close="handleRemove(tag)"
          >
          <!-- closable -->
            {{tag.label}}
          </el-tag>
        </div>

        <span class="kr-employee__suffix" :class="{'disabled': conf_element_props.disabled}">
          <span class="kr-employee__suffix-inner">
            <i class="el-icon-plus"></i>
          </span>
        </span>
      </div>
    </div>

  </container>
</div>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import empDialog from './dialog.vue';

export default {
  INDEX: ['EMPLOYEE'],
  DEFAULT_FORMAT: {
    EMPLOYEE: 'employee'
  },
  mixins: [
    fieldMixin,
  ],
  data() {
    return {
      mainDialog: {
        visible: false,
        title: '人员选择',
      },
    }
  },
  computed: {
    maxHeight() {
      return (document.documentElement.clientHeight * 0.9);
    },
    employees() {
      if(!this.value) {
        return []
      }
      const root = this.$root;
      if(!Object.keys(root.user.map).length) {
        return [];
      }
      return this.value.map(user => {
        if(user.id) {
          return root.user.map[user.id];
        }
        return root.user.map[user];
      });
    },
    skin() {
      const { meta, value, runtime_format, employees } = this;
      let format = null;
      if (runtime_format) {
        format = runtime_format;
      } else if (meta.scene.format) {
        ({ format } = meta.scene);
      } else {
        format = this.$options.DEFAULT_FORMAT[meta.type];
      }
      return kr.format.make(format, employees, meta);
    },
  },
  methods: {
    handleClick() {
      fieldMixin.methods.handleClick.call(this);
      if(!this.conf_element_props.disabled) {
        this.mainClick();
      }
    },
    mainClick() {
      const root = this.$root;

      if (!this.conf_element_props.disabled) {
        let v = this.value ? this.value : [];
        v = v.map(user => user.id ? user.id : user);
        
        root.chooseMember(v, (ids) => {
          this.setValue([...ids]);
          this.checkMode('handleFieldBlur');
        }, () => {
          this.checkMode('containerBlur');
        })
      }
    },
    handleRemove(tag){
      for(let i = this.value.length - 1; i >=0; i--){
        this.value[i].id == tag.id;
        this.value.splice(i, 1);
        return;
      }
    },
    doCache(nv) {
      this.cache = nv;
    },
    setValue(nv, source = 'inner', always = false) {
      if(source !== 'inner') {
        this.doCache(nv);
      }
      this.value = nv;
      if (always || !kr.script.compare(this.value, this.oldValue)) {
        if(!this.submitDataflow.length) {   // 如果存在内部提交数据流, emtter 在调教 renturn 后执行(submitFinally)
          this.emit_FIELD('change', source);
          this.emit_SCENE('change', source);
        }
        this.$emit('input', nv, this.cache, source);
      }
      this.oldValue = this.value;
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
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;
    
      if(!v) {
        v = [];
      };
      
      if(this.meta.scene.needArray_Object) {
        return [k, this.employees];
      }
      let ids = v.map(item => item.id || item);
    
      return [k, ids];
    }
  },
  watch: {
    "mainDialog.visible": {
      handler(v) {
        if(!v) {
          this.checkMode('handleFieldBlur');
        }
      }
    },
  },
  components: {
    empDialog
  }
}
</script>

<style lang="scss">
  .kr-employee {
    width: 100%;
    height: 100%;
    position: relative;
    font-size: 13px;
    display: inline-block;
    cursor: pointer;
    &.disabled {
      background-color: #F6F7FB;
      cursor: not-allowed;
      pointer-events: none;
    }
    .kr-employee__inner {
      width: 100%;
      background-color: #fff;
      border-radius: 2px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #525975;
      display: inline-block;
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
    .kr-employee__suffix {
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
      .kr-employee__suffix-inner {
        pointer-events: all;
      }
      &.disabled {
        cursor: not-allowed;
        pointer-events: none;
      }
    }
  }
</style>
