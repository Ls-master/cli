<template>
  <div class="code-logic-row">
      <div class="group-box left-box">
        <i class="icon iconfont icon-drag"></i>
      </div>
      <div class="group-box center-box">
        <div class="type-select">
          <el-select class="select" v-model="data.optionData.apiName" @change="valChange" placeholder="请选择">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :disabled="item.disabled"
              :label="item.label"
              :value="item.apiName">
            </el-option>
          </el-select>
        </div>
        <!--(电话 文本，邮箱 货币，数字，百分比)均没有其他选项-->
        <div class="type-content" v-if="['phone_number','text', 'email', 'currency', 'number', 'percentile'].indexOf(data.optionData.type)>-1">
        </div>
        <!-- 自定义字符串 -->
        <div class="type-content" v-if="data.optionData.type==='custom_text'">
          <el-input
            v-model="data.optionData.StrVal"
            class="custom-text-input"
            @blur="handleBlur"
          />
        </div>
        <!-- 日期 -->
        <div class="type-content" v-if="data.optionData.type==='date'">
          <div class="date-select-key">
            <el-select clearable v-model="data.optionData.DateVal.chooseKey" placeholder="请选择">
              <el-option
                v-for="item in date.chooseKey"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="date-select-num">
            <el-select clearable v-if="data.optionData.DateVal.chooseKey ==='year'" v-model="data.optionData.DateVal.chooseNum" placeholder="请选择">
              <el-option
                v-for="item in date.chooseNum"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
        </div>
        <!-- 自增流水号 -->
        <div class="type-content" v-if="data.optionData.type==='autoIncreNo'">
          <el-input
            v-model="data.optionData.AutoIncreNoVal.digit_num"
            class="digit-num"
            :placeholder="'请输入位数'"
          />
          <el-input
            v-model="data.optionData.AutoIncreNoVal.start_num"
            class="start-num"
            :placeholder="'请输入起始编号'"
          />
        </div>
        <!-- 部门单选 -->
        <div class="type-content" v-if="data.optionData.type==='department'">
          <el-select class="depart-select" clearable v-model="data.optionData.DepSelectVal" placeholder="请选择">
            <el-option
              v-for="item in depSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- 单选 -->
        <div class="type-content" v-if="data.optionData.type==='select_one'">
          <el-select class="select-one" clearable v-model="data.optionData.selectVal" placeholder="请选择">
            <el-option
              v-for="item in select"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="group-box right-box" v-if="addType=='addField'">
        <i class="el-icon-circle-plus"
          @click="handleAdd"
          v-if="hasSub"
        ></i>
        <i :class="['el-icon-remove', data.optionData.type=='autoIncreNo'?'hide':'']"
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
    addType: kr.vue.getPropString(),  //添加类型，添加业务对象还是添加修改字段
    options: kr.vue.getPropArray(),
    level: kr.vue.getPropNumber(0),
    hasSub: kr.vue.getPropBoolean(true),
  },
  components: {
  },
  data() {
    return {
      date: {
        chooseKey: [
          { label: '年份', value: 'year' }, { label: '月份', value: '_MM' },
          { label: '日期', value: '_DD' }, { label: '小时', value: '_HH' },
          { label: '分钟', value: '_mm' }, { label: '秒', value: '_ss' }
        ],
        chooseNum: [
          { label: '1位,如"8"', value: '_Y' },
          { label: '2位,如"18"', value: '_YY' },
          { label: '3位,如"018"', value: '_YYY' },
          { label: '4位,如"2018"', value: '_YYYY' },
        ],
      },
      depSelect: [{ label: '部门编号', value: '_number' }, { label: '部门名称', value: '_value' }],
      select: [{ label: '选项编号', value: '_value' }, { label: '选项名称', value: '_label' }],
    };
  },
  computed: {
  },
  methods: {
    handleBlur(...args) {
      this.$emit('blur', ...args);
    },
    handleAdd() {
      this.$emit('add-child');
      this.$emit('focus');
    },
    handleDelete() {
      this.$emit('delete');
      this.$emit('focus');
    },
    valChange(val) {
      this.setSelectType(val);
      this.$emit('updateOptions');
    },
    setSelectType(apiName) {
      this.options.forEach(element => {
        if (element.apiName === apiName) {
          this.data.optionData.label = element.label;
          this.data.optionData.type = element.type;
        }
      });
    },
  },
  mounted() {
    this.setSelectType(this.data.optionData.apiName);
  },
};
</script>
<style lang="scss">
  .code-logic-row{
    position: relative;
    height: 36px;
    line-height: 36px;
    margin: 12px 0;
    .left-box{
      position: absolute;
    }
    .right-box{
      position: absolute;
      right: 0;
      top: 0;
      color: #CACEE0;
      font-size: 22px;
      text-align: left;
      .hide{
        visibility: hidden;
      }
    }
    .center-box{
      margin-left: 28px;
      width: 420px;
      .type-select{
        display: inline-block;
        width: 132px;
        height: 36px;
      }
      .type-content{
        display: inline-block;
        width: 276px;
        .digit-num{
          width: 118px;
        }
        .start-num{
          width: 153px;
        }
        .depart-select,
        .select-one,
        .custom-text-input{
          width: 276px;
        }
        .date-select-key{
          display: inline-block;
          width: 118px;
        }
        .date-select-num{
          display: inline-block;
          width: 153px;
        }
      }
    }
  }
</style>
