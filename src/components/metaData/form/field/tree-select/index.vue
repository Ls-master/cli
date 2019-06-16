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
      <treeselect
        ref="field"
        class="kr-treeselect"
        v-bind="[local_element_props, element_props, runtime_element_props]"
        v-model="value"
        :options="runtime_related_data"
        @input="handleInput"
        :normalizer="normalizer"
        :close-on-select="true"
        :append-to-body="true"
        :openDirection="'auto'"
        :zIndex="10000"
        :alwaysOpen="false"
        @open="checkMode('handleFocus', ...arguments)"
        @close="checkMode('handleFieldBlur', ...arguments)"
      />

    </div>
  </container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
// import selectMixin from '../basic/select-mixin';
// import { typeDict } from '../basic/statics';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import Treeselect from '@riophae/vue-treeselect';

export default {
  INDEX: ['TREE_SELECT', 'TREE_SELECT_MULTIPLE', 'TREE_SELECT_REMOTE', 'TREE_SELECT_MULTIPLE_REMOTE'],
  DEFAULT_COMPONENT_PROP: {
    TREE_SELECT: {
      'value-format': "object",
      searchable: true, // 搜索
      'open-on-focus': true,  //是否在控件聚焦时自动打开菜单
      limit: 3, // 限制所选选项的显示。其余的将隐藏在limitText字符串中
      placeholder: "Select your favourite(s)...",
      'default-expand-level': 1, // 加载时应自动扩展多少级别的分支节点。设置Infinity为默认情况下展开所有分支节点。
    },
    TREE_SELECT_MULTIPLE: {
      'value-format': "object",
      multiple: true, // 多选
      searchable: true, // 搜索
      'open-on-focus': true,  //是否在控件聚焦时自动打开菜单
      limit: 3,
      'clear-on-select': true,  // 选择选项后是否清除搜索输入
      placeholder: "Select your favourite(s)..."
    },
    TREE_SELECT_REMOTE: {
      'value-format': "object",
      // searchable: true, // 搜索
      'open-on-focus': true,  //是否在控件聚焦时自动打开菜单
      limit: 3, // 限制所选选项的显示。其余的将隐藏在limitText字符串中
      placeholder: "Select your favourite(s)...",
      'default-expand-level': 1, // 加载时应自动扩展多少级别的分支节点。设置Infinity为默认情况下展开所有分支节点。
    },
    TREE_SELECT_MULTIPLE_REMOTE: {
      'value-format': "object",
      multiple: true, // 多选
      // searchable: true, // 搜索
      'open-on-focus': true,  //是否在控件聚焦时自动打开菜单
      limit: 3,
      // 'clear-on-select': true,  // 选择选项后是否清除搜索输入
      placeholder: "Select your favourite(s)..."
    }
  },
  MULTIPLE: [
    'TREE_SELECT_MULTIPLE',
    'TREE_SELECT_MULTIPLE_REMOTE'
  ],
  REMOTES: [
    'TREE_SELECT_REMOTE',
    'TREE_SELECT_MULTIPLE_REMOTE'
  ],
  DEFAULT_FORMAT: {
    TREE_SELECT: 'tree_select',
    TREE_SELECT_MULTIPLE: 'tree_select',
    TREE_SELECT_REMOTE: 'tree_select',
    TREE_SELECT_MULTIPLE_REMOTE: 'tree_select'
  },
  mixins: [
    fieldMixin,
  ],
  props: {},
  components: {
    Treeselect
  },
  data() {
    const { optionKey } = this.$props.meta.scene;

    return {
      normalizer(node) {
        if(optionKey) {
          return {
            id: node[optionKey.value],
            label: node[optionKey.label],
            children: node[optionKey.children]
          }
        } else {
          return {
            id: node.id,
            label: node.label,
            children: node.children
          }
        }
      },
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
      const { meta, value, runtime_format, getOptionKey } = this;
      let format = null;
      if (runtime_format) {
        format = runtime_format;
      } else if (meta.scene.format) {
        ({ format } = meta.scene);
      } else {
        format = this.$options.DEFAULT_FORMAT[meta.type];
      }

      return kr.format.make(format, value, meta);
    },
  },
  methods: {
    handleInput(value, instanceId) {
      this.setValue(value);
    },
    handleFocus() {
      const { container, field } = this.$refs;
      if (container) {
        if (!this.isEditing()) {
          container.setEditing(true);
          this.emit_FIELD('editing');
        }
      }
      this.setRuntimeRelatedData(this.related_data_bak);
    },
    handleFieldBlur() {
      _.defer(() => {
        fieldMixin.methods.handleFieldBlur.call(this);
      })
    },
    getKV() {
      const kv = fieldMixin.methods.getKV.call(this);
      const { return_value, needValue, optionKey } = this.meta.scene;
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;
      if (v === undefined || v == null) {
        return [k, null];
      }

      if(!needValue) {
        return [k, v];
      }

      if (kr.script.isArray(v)) {
        v = v.reduce((result, item) => {
          const option = item[optionKey ? optionKey.value : 'id'];
          if (option !== undefined) {
            result.push(option);
          }
          return result;
        }, []);
      }else {
        v = v[optionKey ? optionKey.value : 'id']
      }

      return [k, v];
    },
    fieldFocus() {
      // 获取当前组件焦点
      const { field } = this.$refs;
      if (field) {
        const { container } = this.$refs;
        if (!this.isEditing()) {
          container.setEditing(true);
          this.$nextTick(() => {
            field.focusInput && field.focusInput();
          })
        }
      }
    },
  },
  mounted() {
    const { type } = this;
    if (this.$options.REMOTES.find(item => item === type)) {
      this.fetch({}, {}, () => {
        this.refresh(true);
      });
    }
  },
}
</script>

<style lang="scss">
  .kr-treeselect {
    font-family: "PingFang SC","Lantinghei SC","Microsoft YaHei","Helvetica Neue",Helvetica,Arial, "Microsoft YaHei","STHeitiSC-Light",simsun,"WenQuanYi Zen Hei","WenQuanYi Micro Hei","sans-serif";
    -webkit-font-smoothing: antialiased;
    font-size: 13px;
    color: #525975;
    display: inline-block;
    vertical-align: bottom;
  }
  .vue-treeselect{
    .vue-treeselect__menu-container{
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .vue-treeselect__menu{
      padding: 12px 20px;
    }
    .vue-treeselect__option--highlight{
      background: #F6F7FB;
    }
  }
</style>
