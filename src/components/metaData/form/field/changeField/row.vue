<template>
  <div class="comp-md-form-field-change-field-row">
    <div class="row-index">{{ index + 1 }}</div>
    <KR_SELECT
            ref="a"
            style="flex-grow: 1; margin-right: 10px"
            :env="env"
            :meta="fieldMeta"
            :outerMakeRelatedDataRemote="outerMakeRelatedDataRemote"
            :outerValue="initData.api_name"
            @input="handleFieldInput"
    >

    </KR_SELECT>
    <component
            ref="c"
            style="flex-grow: 1"
            :is="fields.find(valueMeta)"
            :meta="valueMeta"
            :env="env"
            :outerValue="initData.value"
            v-if="valueMeta"
            @input="handleValueInput"
    />
    <div class="button-panel">
      <i class="el-icon-circle-plus btn" @click="handleAddButton"></i>
      <i class="el-icon-remove btn" @click="handleDeleteButton"></i>
    </div>
  </div>
</template>

<script>
import fields from '../some';
import Emitter from 'wolfy87-eventemitter';
export default {
  props: {
    value: Object,
    outerMakeRelatedDataRemote: kr.vue.getPropFunction(null),
    disabled: kr.vue.getPropBoolean(false),
    index: {
      type: Number,
      default: 0
    },
  },
  data() {
    const { disabled } = this;
    return {
      env: {
        PURE: true,
      },
      fieldMeta: {
        key: 'field',
        name: '',
        type: 'SELECT_REMOTE',
        scene: {
          related_data_remote: this.$props.remote,
          element_props: {
            disabled,
          },
          related_data_remote_back_filter: (res) => {
            this.selectOptions = res;
            return res;
          },
        },
      },
      fields,
      valueMeta: null,
      initData: {}
    }
  },
  components: {
    ...fields,
  },
  methods: {
    getKey() {
      return kr.random.string_number();
    },
    handleAddButton() {
      this.$emit('handleAddButton', this.index);
    },
    handleDeleteButton() {
      this.$emit('handleDeleteButton', this.value);
    },
    handleValueInput(value) {
      this.value.value = value;
    },
    handleFieldInput(value, cache, source) {

      if (!value) {
        this.valueMeta =  {
          type: 'TEXT',
          scene: {
            element_props: {}
          },
          key: 'value'
        }

        return;
      }

      const data = cache && cache[value];

      const { type, local_scene } = kr.conversion.transformType(data.type, data);

      this.valueMeta = {
        type: type,
        scene: {
          ...local_scene
        },
        key: 'value'
      }

      this.value.api_name = value;

    },
    getValue() {
      let { a, c } = this.$refs;
      return {
        api_name: a.value,
        value: c.value,
        value_type: 'constant'
      }
    }
  },
  created() {
    // this.initData = this.value;
  }
}
</script>

<style scoped lang="scss">

.comp-md-form-field-change-field-row {

  display: flex;
  align-items: center;

  .row-index {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    width: 20px;
    text-align: center;
    background-color: #F6F7FB;
    margin-right: 4px;
    margin-bottom: 18px;
  }

  .button-panel {
    margin-bottom: 18px;
    padding-left: 10px;
  }

  .btn{
    font-size: 20px;
    line-height: 40px;
    cursor: pointer;
    color: #CACEE0;
    width: 20px;
    height: 20px;
    margin-bottom: 18px;
    &.disabled {
      color: #E6E9F5;
      pointer-events: none;
    }
  }
}


</style>