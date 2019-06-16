import Container from './container';
import Schema from 'async-validator';
import ajax from '@/service/metaData/basic';
import getEventMixin from '@/mixin/event.js';

const fieldMixin = getEventMixin({
  scope: 'FIELD',
  getEmitter() {
    return this.fieldEmitter;
  },
  getListen() {
    return this.meta.scene.field_event_listen || [];
  },
  getEmit() {
    return this.meta.scene.field_event_emit || [];
  },
  getId() {
    return this.meta.key;
  },
});

const sceneMixin = getEventMixin({
  scope: 'SCENE',
  getEmitter() {
    return this.sceneEmitter;
  },
  getListen() {
    return this.meta.scene.scene_event_listen || [];
  },
  getEmit() {
    return this.meta.scene.scene_event_emit || [];
  },
  getId() {
    return 'field';
  },
});

export default {
  DEFAULT_VALIDATE: {},
  DEFAULT_COMPONENT_PROP: {},
  DEFAULT_FORMAT: {},
  ENV: {},
  props: {
    meta: kr.vue.getPropObject(),
    // 初始值
    outerValue: {
      default: undefined,
    },
    env: {
      type: Object,
      default() {
        return {
          PURE: true
        }
      }
    },
    submitDataflow: kr.vue.getPropArray(),
    fieldEmitter: kr.vue.getPropObject(),
    sceneEmitter: kr.vue.getPropObject(),
    outerMakeRelatedDataRemote: kr.vue.getPropFunction(null),
    index: kr.vue.getPropNumber(),
    layoutStyle: kr.vue.getPropString(),
    args: kr.vue.getPropObject(),
    getFormValue: kr.vue.getPropFunction(), // 实时获取 尚未提交表单 value集合
  },
  components: {
    Container,
  },
  data() {
    let runtime_related_data = this.$props.meta.scene.related_data ? this.$props.meta.scene.related_data.options : [];
    runtime_related_data = typeof runtime_related_data === 'function' ? runtime_related_data() : runtime_related_data;
    return {
      value: null,
      oldValue: null,
      loading: false,
      disabled: false,
      cache: {},
      runtime_element_props: {},
      related_data_bak: runtime_related_data,
      runtime_related_data,
      runtime_related_data_remote_params: {},
      runtime_related_data_remote_query: {},
      runtime_related_data_remote: "",
      self_make_related_data_remote_func: this.makeRelatedDataRemote.bind(this),
      runtime_format: null,
      runtime_validate: [],
    }
  },
  watch: {
    outerValue(val) {
      this.refresh();
    }
  },
  computed: {
    getLayoutStyle() {
      return this.layoutStyle;
    },
    finalEnv() {
      return Object.assign({}, this.env, this.$options.ENV[this.meta.type]);
    },
    // value 验证
    validator() {
      const { meta } = this;
      const desc = {};
      let rules = [];
      // rules = (this.$options.DEFAULT_VALIDATE[meta.type] || []).concat(meta.scene.validate || []).concat(this.runtime_validate || []);
      if(meta.scene.validate !== null) {
        rules = (this.$options.DEFAULT_VALIDATE[meta.type] || []).concat(meta.scene.validate || []).concat(this.runtime_validate || []);
      }
      if (rules.length) {
        rules.forEach(rule => {
          if (typeof rule.validator === 'string') {
            /* eslint-disable prefer-const */
            let func = null;
            eval(`func=function(rule, value, callback, source){
              ${rule.validator};
            }`);
            rule.validator = func;
          }
        });
        desc[meta.key] = rules;
        return new Schema(desc);
      }
      return null;
    },
    related_data_remote() {
      return this.meta.scene.related_data_remote;
    },
    element_props() {
      return this.meta.scene.element_props || {};
    },
    local_element_props() {
      const { type } = this.meta;
      const { DEFAULT_COMPONENT_PROP } = this.$options;
      return DEFAULT_COMPONENT_PROP[type] || {};
    },
    type() {
      return this.meta.type;
    },
    conf_element_props() {
      const { local_element_props, element_props, runtime_element_props } = this;
      return Object.assign({}, local_element_props, element_props, runtime_element_props);
    },
    skin() {
      const { meta, value, runtime_format } = this;
      let format = null;
      if (runtime_format) {
        format = runtime_format;
      } else if (meta.scene.format) {
        ({ format } = meta.scene);
      } else {
        format = this.$options.DEFAULT_FORMAT[meta.type];
      }
      return kr.format.make(format, value, meta, this);
    },
  },
  asyncComputed: {
    async asyncSkin() {
      const { meta, value, runtime_format } = this;
      let format = null;
      if (runtime_format) {
        format = runtime_format;
      } else if (meta.scene.asyncFormat) {
        (format = meta.scene.asyncFormat);
      } else {
        format = this.$options.DEFAULT_FORMAT[meta.type];
      }
      return await kr.format.asyncMake(format, value, meta, this);
    },
  },
  methods: {
    ...fieldMixin.methods,
    ...sceneMixin.methods,
    // 设置 value
    setValue(nv, source = 'inner', always = false) {
      this.doCache(nv);
      this.value = nv;
      // if (always || this.oldValue !== this.value) {
      if (always || !_.isEqual(this.oldValue, this.value)) {
        this.emit_FIELD('change', source);
        this.emit_SCENE('change', source);
        this.$emit('input', nv, this.cache, source);
      }
      this.oldValue = this.value;
    },
    refreshValue(nv) {
      this.setValue(nv);
    },
    // 初始值回填
    refresh(always = false) {
      this.setValue(this.outerValue, 'outer', always);
    },
    doCache(nv) {
      const { type } = this.meta;
      if (/DATE/.test(type) && Array.isArray(nv)) {
        this.cache = nv.reduce((pre, item) => {
          pre[item] = item;
          return pre;
        }, {});
      } else {
        this.cache = {
          [nv]: nv
        }
      }
    },

    // 获取 value 数据流
    getKV() {
      const { meta, disabled, value } = this;
      if (disabled) {
        return [];
      }
      return [meta.key, value];
    },
    getForm() {
      const { disabled } = this;
      if (disabled) {
        return {};
      }
      const [k, v] = this.getKV();
      return { [k]: v };
    },
    setError(nv) {
      const { container } = this.$refs;
      if (container) {
        container.setError(nv);
      }
    },
    // 组件内部 value 验证
    async doValidate(form) {
      const { validator, disabled, conf_element_props } = this;
      if (disabled || conf_element_props.disabled) {
        return;
      }

      if (validator) {
        await new Promise((resolve, reject) => {
          validator.validate(form, (errs) => {
            if (errs) {
              errs.forEach(err => {
                const { message } = err;
                this.setError(message);
              });
              reject();
            } else {
              resolve();
            }
          });
        });
      }
    },
    makeRelatedDataRemote(outerParams = {}, outerQuery = {}) {
      const { outerMakeRelatedDataRemote } = this;
      if (typeof outerMakeRelatedDataRemote === 'function') {
        return outerMakeRelatedDataRemote(outerParams, outerQuery);
      }
      let { related_data_remote, runtime_related_data_remote } = this;
      // let { related_data_remote_query } = this.meta.scene;
      // related_data_remote = Object.assign({}, related_data_remote, related_data_remote_query);
      if (runtime_related_data_remote) {
        return runtime_related_data_remote
      }
      if (!related_data_remote) {
        return '';
      }
      return related_data_remote;
    },
    setRuntimeRelatedData(nv) {
      this.runtime_related_data = nv;
    },
    async fetch(outerParams = {}, outerQuery = {}, cb) {
      const { loading } = this;
      if (!loading) {
        const url = this.makeRelatedDataRemote(outerParams, outerQuery);
        let { related_data_remote_query, related_data_remote_back_filter } = this.meta.scene;
        let { runtime_related_data_remote_query } = this;
        if (url) {
          related_data_remote_query = typeof related_data_remote_query === 'function' ? related_data_remote_query(outerParams, outerQuery) : related_data_remote_query;
          let query = Object.keys(runtime_related_data_remote_query).length ? runtime_related_data_remote_query : related_data_remote_query;
          try {
            this.loading = true;
            // 直接做 meta.scene.related_data_remote 接口路径请求
            let result = await ajax(kr.script.updateState({
              method: 'post',
              url,
            }, kr.script.updateState({
              data: { keyWord: outerQuery }
            }, query)), [], ['/result/handle-error']);

            if(related_data_remote_back_filter && (typeof related_data_remote_back_filter == 'function')){
              result = related_data_remote_back_filter(result, this);
            }
            this.related_data_bak = result;
            this.setRuntimeRelatedData(result, 'fetch');
            cb && (typeof cb == 'function') && cb(result);
          } finally {
            this.loading = false;
          }
        }
      }
    },

    // 点击 编辑/展示 状态切换
    handleClick() {
      const { conf_element_props } = this;
      if (conf_element_props.disabled) {
        return;
      }
      this.fieldFocus();
    },
    fieldFocus() {
      // 获取当前组件焦点
      const { field } = this.$refs;
      if (field) {
        const { container } = this.$refs;
        if (!this.isEditing()) {
          container.setEditing(true);
          this.$nextTick(() => {
            field.focus && field.focus();
          })
        }
      }
    },
    handleFieldFocus() {
      this.containerFocus();
    },
    async handleFieldBlur() {
      const { isQuickMode } = this;
      const { validator } = this;
      const form = this.getForm();

      if (!isQuickMode) {
        if (validator) {
          await new Promise((resolve, reject) => {
            validator.validate(form, (errs) => {
              if (errs) {
                errs.forEach(err => {
                  const { message } = err;
                  this.setError(message);
                });
                this.fieldFocus();
                reject();
              } else {
                resolve();
              }
            });
          });
        }

        (async () => {
          try {
            await kr.dataflow.run(this.submitDataflow, this, form);
          } catch (e) {
            this.refresh();
          } finally {
            this.submitFinally();
          }
        })();
      }
      this.containerBlur();
    },
    submitFinally() {},
    containerFocus() {
      const { container } = this.$refs;
      if (container) {
        if (!this.isEditing()) {
          container.setEditing(true);
          this.emit_FIELD('editing');
        }
      }
    },
    containerBlur() {
      const { container } = this.$refs;
      if (container) {
        if (this.isEditing()) {
          container.setEditing(false);
          this.emit_FIELD('unediting');
        }
      }
    },
    isEditing() {
      const { container } = this.$refs;
      return container && container.editing;
    },
    check(condition, method, ...args) {
      const { finalEnv } = this;
      if (Object.keys(condition).every(key => {
        let cvs = condition[key];
        const ev = finalEnv[key];
        if (!Array.isArray(cvs)) {
          cvs = [cvs];
        }
        return cvs.some(cv => cv === ev);
      })) {
        const func = this[method];
        if (typeof func === 'function') {
          func.call(this, ...args);
        }
      }
    },
    checkMode(...args) {
      this.check({
        QUICK_MODE: [false, null, undefined],
        PURE: [false, null, undefined],
      }, ...args);
    },
    emitFieldEvent(evt, data){
      this.emit_FIELD(evt, data);
    },
    emitGlobalEvent(evt, data) {
      kr.bus.$emit(evt, data);
    },
    handleTitleRight(result) {
      this.$emit('handleTitleRight', result);
    },
    setDisable(state){
      this.meta.scene.element_props = Object.assign({}, this.element_props, { disabled: state });
    },
    setReturnType(state){
      this.meta.scene.element_props = Object.assign({}, this.element_props, { returnType: state });
    },
    getEleRef() {
      return this.$refs.field;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.refresh(true);
    });
  },
  created() {
    fieldMixin.created.call(this);
    sceneMixin.created.call(this);
  },
  beforeDestroy() {
    fieldMixin.beforeDestroy.call(this);
    sceneMixin.beforeDestroy.call(this);
  },
}
