<template>
  <div class="code-switch-row">
    <div class="group-box left-box">
      <el-select class="type-select" clearable v-model="data.apiName" @change="changeVal" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :disabled="item.disabled"
          :label="item.label"
          :value="item.apiName">
        </el-option>
      </el-select>
    </div>
    <div class="group-box right-box">
      <i class="el-icon-circle-plus"
        @click="handleAdd"
      ></i>
      <i :class="['el-icon-remove']"
        @click="handleDelete"
      ></i>
    </div>
  </div>
</template>
<script>
export default{
  mixins: [],
  props: {
    data: Object,
    options: kr.vue.getPropArray(),
    level: kr.vue.getPropNumber(0),
    SeleteVal: String,
    sort: Number,
  },
  components: {
  },
  data() {
    return { };
  },
  computed: {
  },
  methods: {
    handleBlur(...args) {
      this.$emit('blur', ...args);
    },
    handleAdd() {
      this.$emit('addChild');
    },
    handleDelete() {
      this.$emit('deleteChild');
    },
    handleLabelInput(nv) {
      nv = nv.replace(/\s+/g, '');
      this.$nextTick(() => {
        this.data.label = nv;
      });
    },
    handleValueInput(nv) {
      nv = nv.replace(/\s+/g, '');
      this.$nextTick(() => {
        this.data.value = nv;
      });
    },
    changeVal(val){
      this.options.find((ii) => {
        if(ii.apiName == val){
          this.data.label = ii.label;
          this.data.type = ii.type;
          return true;
        }
        return false;
      })
    }
  },
  mounted() {
  },
};
</script>
<style lang="scss">
.code-switch-row{
  position: relative;
  margin-top: 12px;
  .left-box{
    width: 447px;
  }
  .right-box{
    position: absolute;
    right: 0;
    top: 0;
    color: #CACEE0;
    font-size: 22px;
    text-align: left;
  }
}
</style>