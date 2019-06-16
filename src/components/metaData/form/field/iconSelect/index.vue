<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
          @handleTitleRight="handleTitleRight"
  >
    <span slot="view">
      <i class="icon iconfont" :class="value" style="font-size: 20px" v-if="value"></i>
      <span v-else> - </span>
    </span>

    <KrIconSelect
            ref="field"
            slot="field"
            size="medium"
            clearable
            v-model="value"
            @change="krIconSelectChange"
            @blur="checkMode('handleFieldBlur', ...arguments)"
    >
    </KrIconSelect>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import KrIconSelect from '../../../krIconSelect';

export default {
  INDEX: ['ICON_SELECT'],
  mixins: [
    fieldMixin,
  ],
  components: {
    KrIconSelect
  },
  methods: {
    krIconSelectChange() {
      this.$emit('change', ...arguments);
    }
  }
}
</script>

<style>

</style>