<template>
  <el-dialog
    v-bind="$attrs"
    :title="title"
    ref="dialog"
    :close-on-click-modal="false"
    :append-to-body="appendToBody"
    :lock-scroll="lockScroll"
    top="60px"
    @close="$emit('close')"
    @update:visible="handleUpdateVisible"
    :style="{maxHeight: `${this.dialogHeight ? this.dialogHeight : this.maxHeight}px`}"
    :class="dialogHeight ? 'dialogFullBody' : ''"
  >
    <slot/>
    <slot name="title" slot="title"/>
    <slot name="footer" slot="footer"/>
  </el-dialog>
</template>
<script>
export default {
  mixins: [],
  props: {
    appendToBody: kr.vue.getPropBoolean(false),
    lockScroll: kr.vue.getPropBoolean(true),
    dialogHeight: kr.vue.getPropString(),
    title: String
  },
  components: {},
  data() {
    return {};
  },
  computed: {
    maxHeight() {
      return (document.documentElement.clientHeight * 0.9)
    }
  },
  methods: {
    handleUpdateVisible(...args) {
      this.$emit('update:visible', ...args);
    }
  },
  mounted() {
    // const { dialog } = this.$refs;
    // const el = dialog.$el;
    // console.log('xxx', el);
    //
    // const body = el.getElementsByClassName('el-dialog__body');
    // console.log('body', body);
  }
};
</script>
 <style lang="scss" >
 .dialogFullBody {
   .el-dialog__body {
     max-height: 100%;
   }
 }
 </style>
