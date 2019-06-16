<template>
  <div v-if="disabled"/>
  <Container
    :disabled="conf_element_props.disabled"
    :runtime_validate="runtime_validate"
    v-else
    ref="container"
    :meta="meta"
    :env="finalEnv"
    @click="handleClick"
  >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <div
      class="field-code-switch"
      ref="field"
      slot="field"
      @focus="checkMode('handleFieldFocus', ...arguments)"
      @blur="checkMode('handleComposeBlur', ...arguments)"
    >
      <div class="content">
        <Row
          v-for="(item, i) in inner_value"
          class="type-select-row"
          :key="i"
          :options="chooseOptions"
          :data="item"
          @addChild="addChildHandler(i)"
          @deleteChild="deleteChildHandler(i)"
        ></Row>
        <template>
          <label class="el-form-item__label">起始编号</label>
          <el-input :disabled="!hasCategory" v-model="start_num"/>
          <label class="el-form-item__label" for>自增间隔</label>
          <el-input :disabled="!hasCategory" v-model="addInterval"/>
        </template>
      </div>
    </div>
  </Container>
</template>
<script>
import _ from "lodash";
import fieldMixin from "../../../basic/field-mixin";

export default {
  INDEX: ["CODE_SWITCH"],
  DEFAULT_VALIDATE: {
    CODE_SWITCH: [{
      validator(rule, value, callback) {
        const dict = {};
        const testNum = /^[0-9]*$/;
        let error = null;
        let check = false; //check表示是否需要校验
        let rawData = value.rawData;
        rawData.findIndex((ii) => {
          return ii.apiName && (check=true); //如果有选项存在，则需要教研起始编号和自增间隔
        })
        if(check){
          if( !testNum.test(value.start_num) || !testNum.test(value.addInterval)){
            callback(new Error("起始编号和自增间隔必须是整数")); return;
          }
          if( +value.start_num<1 || value.addInterval<1){
            callback(new Error("起始编号和自增间隔必须大于0")); return;
          };
          if(value.addInterval > 10){
            callback(new Error("自增间隔必须为1~10的整数")); return;
          };
        }
        callback();
      }
    }]
  },
  mixins: [fieldMixin],
  props: {
    outerValue: kr.vue.getPropObject()
  },
  components: {
    Row: require("./row.vue").default
  },
  data() {
    return {
      value: [],
      opts: [],
      backupOptions: [], // 所有备选可选项
      chooseOptions: [], // 目前可用选项(因为选项会和值有联系，选择某个值后，同类型的就不再可选)
      start_num: "", //起始编号
      addInterval: "", //自动间隔
      inner_value: [
        {
          type: "",
          apiName: "",
          label: ""
        }
      ]
    };
  },
  computed: {
    hasCategory() {
      return (
        (this.inner_value || []).filter(ii => {
          return !!ii.apiName;
        }).length > 0
      );
    }
  },
  methods: {
    setValue(nv, ...args) {
      this.start_num = nv.start_num;
      this.addInterval = nv.addInterval;
      this.inner_value = (!nv.rawData || nv.rawData.length==0)
        ?[{
          type: "",
          apiName: "",
          label: ""
        }] : nv.rawData;
    },
    addChildHandler(index) {
      //添加选项
      this.inner_value.splice(index + 1, 0, {
        apiName: "",
        label: "",
        type: ""
      });
    },
    deleteChildHandler(index) {
      //删除值
      if (this.inner_value.length < 2) return;
      this.inner_value.splice(index, 1);
    },
    getKV() {
      return [
        this.meta.key,
        {
          start_num: this.start_num,
          addInterval: this.addInterval,
          rawData: this.inner_value,
          category: this.inner_value
            .filter(ii => {
              return !!ii.apiName;
            })
            .map(iii => {
              return iii.apiName;
            })
        }
      ];
    },
    setOptions(options) {
      options = (options || []).filter(opt => {
        return ["select_one", "date", "department"].indexOf(opt.type) > -1; //只能选择(单选，部门，日期)类型
      });
      this.backupOptions.splice(0, this.backupOptions.length, ...options);
      // 选项更新，需要过滤掉值列表中已经不存在的类型
      let tmpVals = (this.inner_value || []).filter(item => {
        return options.findIndex((ii) => {
          return ii.type == item.type;
        }) > -1;
      });
      if(tmpVals.length == 0){
        tmpVals = [{
          type: "",
          apiName: "",
          label: ""
        }];
      }
      this.inner_value.splice(0, this.inner_value.length, ...tmpVals);
    }
  },
  mounted() {},
  watch: {
    inner_value: {
      deep: true,
      handler(val) {
        //当值改变时，需要过滤掉选项中相同的类型(单选，部门，日期)
        const tmpVal = val || [];
        let tmpOptions = (this.backupOptions || []).map(item => {
          if (
            (tmpVal || []).find(ii => {
              return ii.type == item.type;
            })
          ) {
            // 如果值列表中已经有该类型选项，则排除掉该选项
            item.disabled = true;
          } else {
            item.disabled = false;
          }
          return item;
        });
        this.chooseOptions.splice(0, this.chooseOptions.length, ...tmpOptions);
      }
    },
    hasCategory: {
      immediate: true,
      handler(val){
        if(!val){   //没有分组数据也需要设置为初始化的1
          this.start_num = '';
          this.addInterval = '';
        }
      }
    }
  }
};
</script>
<style lang="scss">
.field-code-switch {
  position: relative;
}
</style>
