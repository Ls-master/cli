<template lang="html">
  <div class="comp-md-form-datadetail">
    <KrDetail
      ref="detail"
      :fieldMetas="fieldMetas"
      :layout="layout"
      :value="value"
      :hostObjInfo="hostObjInfo"
      :customStyles="customStyles"
      v-loading="loading"
      v-bind="$attrs"
      @change="handleChange"
      @sceneChange="sceneChange"
      @handleTitleRight="handleTitleRight"
    >
    </KrDetail>

  </div>
</template>

<script>

export default {
  props: {
    initDataflow: kr.vue.getPropArray(),
    hostObjInfo: {    //如果是来自相关项，会有一些来自父窗口的额外信息
      type: Object,
      default: function(){ return {}; }
    },
    submitDataflow: kr.vue.getPropArray(),
    // fieldSubmitDataflow: kr.vue.getPropArray(),
  },
  data() {
    return {
      fieldMetas: [],
      layout: [],
      value: {},
      loading: false,
      customStyles: {}
    }
  },
  computed: {

  },
  methods: {
    async init() {
      try {
        this.loading = true;
        // 数据流执行 api 接口, run方法内部赋值 fieldMetas, layout, value
        await kr.dataflow.run(this.initDataflow, this);
        this.$emit('update-layout', this.layout);
        this.$refs.detail.sceneReady("dataDetail");
      } finally {
        this.loading = false;
      }
    },
    async submit(noMessage = false) {
      const form = await this.$refs.detail.submit();
      const { submitDataflow } = this;
      let result = null;
      if (submitDataflow.length) {
        try {
          this.loading = true;
          result = await kr.dataflow.run(submitDataflow, this, form);
          if (!noMessage) {
            kr.ui.success();
          }
        } finally {
          this.loading = false;
        }
      }
      return [result, form];
    },
    handleChange(nv) {
      this.$emit('change', nv);
    },
    sceneChange(ctx) {
      this.$emit('sceneChange', ctx);
    },
    updateValue(val) {
      this.value = val;
    },
    handleTitleRight(result) {
      this.$emit('handleTitleRight', result);
    }
  },
  mounted() {
    this.init();
    this.$on('updateValue', this.updateValue);
  },
  components: {
    KrDetail: require('../detail').default,
  },
}
</script>

