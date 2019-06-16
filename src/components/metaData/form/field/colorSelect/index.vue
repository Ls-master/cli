<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
          @handleTitleRight="handleTitleRight"
          v-clickoutside="clickoutside"
  >
    <span slot="view">
      <span class="color-select-item" :style="'background-color:' + value" v-if="value"></span>
      <span v-else> - </span>
    </span>

    <div ref="field" slot="field">
      <span @click.stop="handleColorSelectItem(item)" class="color-select-item" v-for="(item, index) in colors" :style="'background-color:' + item.color" :key="index">
        <i class="icon iconfont icon-icon-true color-select-item-icon" v-if="item.value"></i>
      </span>
    </div>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import Clickoutside from 'element-ui/src/utils/clickoutside';

export default {
  INDEX: ['COLOR_SELECT'],
  data() {
    return {
      colors: [
        {
          color: '#7383EB',
          value: false
        },
        {
          color: '#44A6FC',
          value: false
        },
        {
          color: '#3AC299',
          value: false
        },
        {
          color: '#F5A22F',
          value: false
        },
        {
          color: '#FA7878',
          value: false
        }
      ]
    }
  },
  directives: { Clickoutside },
  watch: {
    value(val) {
      let colorItem = this.colors.find((item) => {
        return item.color === val;
      });
      this.colors.forEach((item) => {
        item.value = false;
      })
      colorItem && (colorItem.value = true);
    }
  },
  mixins: [
    fieldMixin
  ],
  methods: {
    clickoutside() {
      this.checkMode('handleFieldBlur');
    },
    handleColorSelectItem(item) {
      this.colors.forEach((item) => {
        item.value = false
      })
      item.value = true;
      this.setValue(item.color, 'inner');
      this.clickoutside();
      this.$emit('change', item.color);
    }
  },
  created() {
    // if (!this.value) {
    //   this.setValue(this.colors[0].color);
    // }
    if (this.meta && this.meta.scene && this.meta.scene.colors) {
      this.colors = this.meta.scene.colors;
    }
  }
}
</script>

<style scoped lang="scss">

  .color-select-item {
    float: left;
    width: 24px;
    height: 24px;
    display: flex;
    margin-right: 20px;
    border-radius: 2px;
    align-items: center;
    justify-content: center;

    .color-select-item-icon {
      font-size: 16px;
      color: #ffffff;
    }
  }
</style>