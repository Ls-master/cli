<template>
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
    <div slot="field" ref="field" v-clickoutside="clickoutside">
      <el-select
              ref="select"
              v-model="selectOptions"
              :size="size"
              :custom-icon="`plus`"
              @custom-icon-click="handleInput"
              filterable
              :clearable="$attrs.clearable"
              :multiple="innerType === 'multiple'"
              v-bind="[local_element_props, element_props, runtime_element_props]"
              @change="selectChange"
              placeholder="请选择">
        <i slot="prefix" v-if="innerType === 'multiple'" class="icon iconfont icon-group"></i>
        <i slot="prefix" v-else class="icon iconfont icon-icon-renmai"></i>
        <el-option
                v-for="item in users"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
      <el-dialog
              :modal-append-to-body="false"
              :close-on-click-modal="false"
              :append-to-body="appendToBody"
              @close="handleCancel"
              title="选择成员"
              :visible.sync="dialogVisible"
      >
        <inner ref="inner" v-if="innerType === 'multiple'" :value="innerEmployees"></inner>
        <singleInner ref="inner" v-else :value="innerEmployees"></singleInner>
        <span slot="footer" class="dialog-footer">
        <el-button @click.stop="handleCancel">取 消</el-button>
        <el-button type="primary" @click.stop="handleDone">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </container>
</template>

<script>
import { getAllUsers } from '@/service/metaData/org/account';
import fieldMixin from '../basic/field-mixin';
import Clickoutside from 'element-ui/src/utils/clickoutside';
import inner from './inner';
import singleInner from './singleInner';

export default {
  INDEX: ['EMPLOYEE_MULTIPLE', 'EMPLOYEE_SINGLE', 'EMPLOYEE_NEW'],
  props: {
    size: String,
    employeeType: String,
    appendToBody: {
      default: true,
      type: Boolean
    }
  },
  data() {
    return {
      dialogVisible: false,
      employees: [],
      innerEmployees: [],
      users: [],
      selectOptions: [],
      innerType: ''
    }
  },
  mixins: [
    fieldMixin,
  ],
  directives: { Clickoutside },
  components: {
    inner,
    singleInner
  },
  computed: {
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
  watch: {
    value: {
      handler(val) {
        if (this.innerType === 'multiple') {
          if (Array.isArray(val)) {
            this.selectOptions = val.reduce((pre, item) => {
              pre.push(item.value || item);
              return pre;
            }, []);
            // if (val.value) {
            //   console.log('innerType', 'innerType');
            //   this.selectOptions = val.reduce((pre, item) => {
            //     pre.push(item.value);
            //     return pre;
            //   }, []);
            // } else {
            //   this.selectOptions = [ ...val ];
            // }
          } else {
            this.selectOptions = [];
          }
        } else {
          this.selectOptions = val ? val.value ? val.value : val : null;
        }
      },
      deep: true,
      immediate: true
    },
    selectOptions: {
      handler(val) {
        this.matchingOptions(val, this.users);
      },
      deep: true
    },
    size: {
      handler() {
        this.resetSize();
      },
      immediate: true
    }
  },
  methods: {
    fieldFocus() {
      // 获取当前组件焦点
      const { select } = this.$refs;
      if (select) {
        const { container } = this.$refs;
        if (!this.isEditing()) {
          container.setEditing(true);
          this.$nextTick(() => {
            select.focus && select.focus();
          })
        }
      }
    },
    clickoutside() {
      this.checkMode('handleFieldBlur');
    },
    selectChange(val) {
      this.matchingOptions(val, this.users, true);
    },
    handleCancel() {
      this.$nextTick(() => {
        this.dialogVisible = false;
      })
    },
    handleDone() {
      let { inner } = this.$refs;
      if (this.innerType === 'multiple') {
        this.employees = [ ...inner.selectTags ];
        this.selectOptions = this.employees.reduce((pre, item) => {
          pre.push(item.id);
          return pre;
        }, [])
        this.matchingOptions(this.selectOptions, this.users, true);
      } else {
        this.employees = inner.selectTags;
        this.selectOptions = inner.selectTags && inner.selectTags.id;
        this.matchingOptions(this.selectOptions, this.users, true);
      }

      this.dialogVisible = false;
    },
    handleInput() {
      if(!this.conf_element_props.disabled) {
        this.innerType === 'multiple' && (this.innerEmployees = [ ...this.innerEmployees ]);
        this.dialogVisible = true;
      }
    },
    async requestUserAll() {

      if (!this.users.length) {
        this.users = await getAllUsers();
      }

      if (!this.value) {
        return;
      }

      this.matchingOptions(this.value, this.users, true);
    },
    matchingOptions(value, users, isSet) {
      if (this.innerType === 'multiple') {
        this.employees = [];
        value && value.forEach((item) => {
          item = item.id || item;
          let user = users.find((urer) => {
            return urer.id === item;
          })
          user && this.employees.push(user);
        })
        this.innerEmployees = [].concat(this.employees);
        isSet && this.setValue(this.employees.map((item) => {
          return item.id;
        }), 'inner');
      } else {
        this.employees = '';
        if (value) {
          let id = value.id || value;
          let user = users.find((urer) => {
            return urer.id === id;
          })
          user && (this.employees = user);
        }
        this.innerEmployees = this.employees;
        isSet && this.setValue(this.employees ? this.employees.id : null, 'inner');
      }

    },
    async setValue(nv, source = 'inner', always = false) {
      if(source !== 'inner') {
        await this.requestUserAll();
      }
      this.value = nv;
      this.doCache(this.employees);
      this.oldValue = this.value;
    },
    doCache(nv) {
      nv = Array.isArray(nv) ? nv : [nv];
      this.cache = {};
      nv.forEach((item) => {
        this.cache[item.id] = item;
      })
    },
    getKV() {
      let { innerType } = this;
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;

      if(innerType === 'multiple' && !v) {
        v = [];
      };

      if(this.meta.scene.needArray_Object) {
        return [k, this.employees];
      }
      if (innerType === 'multiple') {
        let ids = v.map(item => item.id || item);
        return [k, ids];
      }
      return [k, v];
    },
    resetSize() {
      this.$nextTick(() => {
        let { select } = this.$refs;
        let sizes = {
          medium: 36,
          small: 32,
          mini: 28
        }
        select.initialInputHeight = sizes[this.size];
      })
    },
    initType() {
      switch (this.meta.type) {
        case 'EMPLOYEE_MULTIPLE':
          this.innerType = 'multiple';
          break;
        case 'EMPLOYEE_SINGLE':
          this.innerType = 'single';
          break;
        case 'EMPLOYEE_NEW':
          if (this.employeeType === 'multiple') {
            this.innerType = 'multiple';
          } else if (this.employeeType === 'single') {
            this.innerType = 'single';
          } else {
            this.innerType = 'multiple';
          }
          break;
        default:
          break;
      }

      if (this.innerType === 'single') {
        this.initSingle();
      } else {
        this.initMultiple();
      }
    },
    initMultiple() {

    },
    initSingle() {
      this.employees = '';
      this.innerEmployees = '';
      this.selectOptions = '';
    }
  },
  mounted() {
    this.resetSize();
    this.requestUserAll();
  },
  created() {
    this.initType();
  }
}
</script>

<style lang="scss">

  /*.kr-employee-new-input {*/
    /*width: 100%;*/
    /*min-height: 28px;*/
    /*max-height: 84px;*/
    /*line-height: 28px;*/
    /*padding: 0 30px 0 10px;*/
    /*border: 1px solid #dcdfe6;*/
    /*cursor: pointer;*/
    /*position: relative;*/

    /*.kr-employee-new-tag-panel {*/
      /*height: 100%;*/
      /*max-height: 82px;*/
      /*overflow: auto;*/
    /*}*/

  /*}*/

  /*.kr-employee-new-tag {*/
    /*margin: 3px;*/
  /*}*/

  /*.employee-new-input-icon {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*right: 5px;*/
  /*}*/

  /*.kr-employee-new-input:hover {*/
    /*border-color: #ABB1C7;*/
  /*}*/

</style>