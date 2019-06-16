<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <div
      ref="field"
      slot="field"
      tabindex="0"
    >
      <el-checkbox 
        v-if="value && needCheckAll"
        :indeterminate="isIndeterminate" 
        v-model="checkAll" 
        @change="handleCheckAllChange"
      >
        全选
      </el-checkbox>

      <el-checkbox-group
        v-bind="[local_element_props, element_props, runtime_element_props]"
        v-model="value"
        @change="handleInput"
        @blur="checkMode('handleFieldBlur', ...arguments)"
      >
        <span 
          class="check-item"
          v-for="(option, index) in runtime_related_data"
          :key="getOptionKey ? option[getOptionKey.value] : option.value || index"
        >
          <el-checkbox
            :label="getOptionKey ? option[getOptionKey.value] : option.value || option"
            :disabled="option.disabled ? option.disabled : false"
          >
            {{getOptionKey ? option[getOptionKey.label] : option.label || option}}
          </el-checkbox>
        </span>

      </el-checkbox-group>
    </div>
  </Container>
</template>
<script>
import fieldMixin from '../basic/field-mixin';
import selectMixin from '../basic/select-mixin';

export default {
  INDEX: ['CHECKBOX_GROUP'],
  DEFAULT_FORMAT: {
    CHECKBOX_GROUP: 'bool',
  },
  SEARCH_CONDITION: {
    CHECKBOX_GROUP: ['EQUAL', 'NOT_EQUAL'],
  },
  SEARCH_FORM: {
    CHECKBOX_GROUP: 'EQUAL',
  },
  mixins: [
    fieldMixin,
    selectMixin,
  ],
  props: {
  },
  components: {
  },
  data() {
    return {
      checkAll: false,
    };
  },
  computed: {
    getOptionKey() {
      return this.meta.scene.getOptionKey;
    },
    needCheckAll() {
      return this.meta.scene.needCheckAll;
    },
    isIndeterminate() {
      const {value, runtime_related_data} = this;
      let checkedCount = value.length || 0;
      this.checkAll = checkedCount === this.runtime_related_data.length;
      return checkedCount > 0 && checkedCount < runtime_related_data.length;
    },
  },
  methods: {
    handleInput(nv) {
      this.$nextTick(() => {
        this.setValue(nv);
      });
    },
    getKV() {
      const { value, meta, disabled, cache } = this;
      const kv = selectMixin.methods.getKV.call(this);
      
      let [k, v] = kv;

      if (disabled) {
        return [];
      }

      return [k, v ? v : []];
    },
    handleCheckAllChange(val) {
      const {runtime_related_data, getOptionKey} = this;
      const options = runtime_related_data.map(option => {
        return getOptionKey ? option[getOptionKey.value] : option.value || option
      });
      let _value = val ? options : [];
      this.setValue(_value);
      // this.isIndeterminate = false;
    },
  },
};
</script>

<style lang="scss" scoped>
  .check-item {
    margin-right: 30px;
  }
</style>

