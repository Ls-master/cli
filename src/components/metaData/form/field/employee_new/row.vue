<template>
  <div class="comp-md-kr-employee-new-row" @click="handleItem(innerData, ...arguments)" :class="{ 'comp-md-kr-employee-new-row-select': !checkbox && isSelected }">
    <el-checkbox ref="checkBox" :indeterminate="innerData.indeterminate" v-model="isSelected" v-if="checkbox" class="row-checkbox" @change="checkboxChange"></el-checkbox>
    <span style="cursor: pointer">
      <span class="row-icon" :style="!innerData.isDept ? 'backgroundColor:' + colors[index % 4] : ''">
        <i v-if="innerData.isDept" class="icon iconfont icon-institutional" style="color: #ffffff"></i>
        <span v-else class="row-icon-text">{{innerData.name.trim().substr(0, 1)}}</span>
      </span>
      <span class="row-text">
        {{data.name.trim()}}
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    data: Object,
    index: [Number, Function, Object],
    checkbox: Boolean
  },
  data() {
    return {
      checked: false,
      colors: ['#99ADFF', ' #FA9BB6', '#6CCED9', '#FCC453'],
      innerData: {}
    }
  },
  computed: {
    isSelected: {
      get: function () {
        return this.innerData.isSelected;
      },
      set: function (val) {
        this.innerData.isSelected = val;
      }
    }
  },
  watch: {
    data: {
      handler: function (val) {
        this.innerData = Object.assign({}, val);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleItem() {
      this.$emit('click', ...arguments);
    },
    checkboxChange(val) {
      this.deepData(this.innerData, val);
      this.$emit('change', this.innerData);
    },
    deepData(data, val) {
      data.isSelected = val;
      if (data.isDept) {
        data.indeterminate = false;
        data.children && data.children.forEach((item) => {
          this.deepData(item, val);
        })
      }
    }
  },
  created() {
  }
}
</script>

<style lang="scss">

  .comp-md-kr-employee-new-row-select {
    background-color: #F6F7FB;
    .row-text {
      color: #606ECC;
    }
  }


  .comp-md-kr-employee-new-row {
    height: 36px;
    display: flex;
    align-items: center;
    span {
      line-height: normal !important;
    }

    .row-checkbox {
      margin-right: 12px;
    }

    .row-icon {
      display: inline-block;
      height: 20px;
      line-height: 20px !important;
      width: 20px;
      text-align: center;
      border-radius: 50%;
      background-color: #CACEE0;
      font-size: 13px;
      margin-right: 4px;
      flex-shrink: 0;
    }

    .row-icon-text {
      /*line-height: normal !important;*/
    }

    .row-text {
      font-size: 13px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
</style>