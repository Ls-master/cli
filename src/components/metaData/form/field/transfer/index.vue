<template lang="html">
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
    >
    <el-transfer
      class="kr-transfer"
      ref="field"
      slot="field"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      v-model="value"
      :props="getOptionKey || {
        key: 'value',
        label: 'label',
      }"
      :titles="['隐藏', '显示']"
      :data="runtime_related_data"
      @input="handleInput"
    />
    </el-input>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import selectMixin from '../basic/select-mixin';

export default {
  INDEX: ['TRANSFER', 'TRANSFER_REMOTE'],
  DEFAULT_COMPONENT_PROP: {
    TRANSFER: {
      filterable: true,
    },
    TRANSFER_REMOTE: {
      filterable: true,
    },
  },
  DEFAULT_FORMAT: {
    TRANSFER: 'select_multiple',
    TRANSFER_REMOTE: 'select_multiple'
  },
  ENV: {
    TRANSFER: {
      QUICK_MODE_HACK: true,
    },
    TRANSFER_REMOTE: {
      QUICK_MODE_HACK: true,
    },
  },
  mixins: [
    fieldMixin,
    selectMixin,
  ],
  props: {
    outerValue: kr.vue.getPropArray(),
  },
  components: {
  },
  data() {
    return {
      value: [],
    };
  },
  computed: {
    getOptionKey() {
      if(this.meta && this.meta.scene && this.meta.scene.optionKey){
        const { optionKey } = this.meta.scene;
        return {
          label: optionKey.label,
          key: optionKey.value
        };
      }
      return null;
    },
  },
  methods: {
    handleInput(nv) {
      this.$nextTick(() => {
        this.setValue(nv);
      });
    },
    // async refresh(always = false) {
    //   const { type } = this;
    //   if (type === 'TRANSFER_REMOTE') {
    //     await this.fetch();
    //   }
    //   selectMixin.methods.refresh.call(this);
    // },
  },
  mounted() {
    const { type } = this;
    if (type === 'TRANSFER_REMOTE') {
      this.fetch();
    }
  },
};
</script>

<style lang="scss">
  .kr-transfer {
    .el-checkbox .el-checkbox__inner {
      width: 14px;
      height: 14px;
    }
    .el-transfer__buttons {
      padding: 0 20px;
    }
  }
</style>
