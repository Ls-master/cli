<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
  >
    <KrDragInputGroup
            ref="field"
            slot="field"
            v-bind="[local_element_props, element_props, runtime_element_props]"
            v-model="value"
    >
    </KrDragInputGroup>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import KrDragInputGroup from '../../../krDragInputGroup';

export default {
  INDEX: ['DRAG_INPUT_GROUP'],
  mixins: [
    fieldMixin
  ],
  components: {
    KrDragInputGroup
  },
}
</script>

<style>

</style>