<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
  >
    <el-radio-group
      ref="field"
      slot="view"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value"
      @change="handleInput"
    >
      <div 
        class="comp-md-form-radio-group-radio" 
        :class="{ vertical: getLayoutStyle ==='vertical' }" 
        v-for="(option, index) in runtime_related_data"
        :key="index">
        <el-radio 
          :label="getOptionKey ? option[getOptionKey.value] : option.value" 
          :key="getOptionKey ? option[getOptionKey.value] : option.value">
          {{getOptionKey ? option[getOptionKey.label] : option.label}}
        </el-radio>
      </div>
    </el-radio-group>

    <el-radio-group
      class="comp-md-form-radio-group"
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value"
      @change="handleInput"
    >
      <div 
        class="comp-md-form-radio-group-radio" 
        :class="{ vertical: getLayoutStyle ==='vertical' }" 
        v-for="(option, index) in runtime_related_data"
        :key="index">
        <el-radio 
          class="radio" 
          :label="getOptionKey ? option[getOptionKey.value] : option.value" 
          :key="getOptionKey ? option[getOptionKey.value] : option.value"
          :disabled="option.disabled ? option.disabled : false">
          {{getOptionKey ? option[getOptionKey.label] : option.label}}
        </el-radio>
        <span class="radio-note" v-if="getLayoutStyle ==='vertical'">{{option.note}}</span>
      </div>
    </el-radio-group>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';

export default {
  INDEX: ['RADIO_GROUP'],
  mixins: [
    fieldMixin,
  ],
  computed: {
    getOptionKey() {
      return this.meta.scene.getOptionKey;
    }
  },
  methods: {
    handleInput(nv) {
      this.$nextTick(() => {
        this.setValue(nv);
      });
    },
  }
}
</script>

<style lang="scss">
  .comp-md-form-radio-group {
    white-space: pre-wrap;
  }

  .comp-md-form-radio-group-radio {
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 8px;
    .radio {
      padding-left: 12px;
    }
    .radio-note {
      display: block;
      font-size: 12px;
      color: #979BA8;
      text-align: justify;
      line-height: 18px;
      /*height: 18px;*/
      margin-bottom: 8px;
      padding-left: 36px;
    }
  }

  .vertical {
    display: block;
  }

</style>
