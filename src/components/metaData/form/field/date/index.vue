<template>
  <Container
    @click="handleClick"
    ref="container"
    :runtime_validate="runtime_validate"
    :meta="meta"
    :disabled="conf_element_props.disabled"
    :env="finalEnv"
    class="kr-datepicker"
  >
    <span slot="view" v-html="skin || $kr.statics.PROP_DEFAULT"></span>
    <el-date-picker
      ref="field"
      slot="field"
      v-model="value"
      :picker-options="{
        stepMinute: 5,
      }"
      v-bind="[local_element_props, element_props, runtime_element_props]"
      @input="handleInput"
      value-format="timestamp"
      :editable="false"
      @blur="checkMode('handleFieldBlur', ...arguments)"
      />
  </Container>
</template>
<script>
import moment from 'moment';
import fieldMixin from '../basic/field-mixin';

export default {
  INDEX: ['DATE', 'DATE_TIME', 'DATE_WEEK', 'DATE_MONTH', 'DATE_YEAR', 'DATE_RANGE', 'DATE_TIME_RANGE', 'DATES'],

  DEFAULT_COMPONENT_PROP: {
    DATE: {
      type: 'date',
    },
    DATE_TIME: {
      type: 'datetime',
    },
    DATE_WEEK: {
      type: 'week',
    },
    DATE_MONTH: {
      type: 'month',
    },
    DATE_YEAR: {
      type: 'year',
    },
    DATE_RANGE: {
      type: 'daterange',
      'unlink-panels': true
    },
    DATE_TIME_RANGE: {
      type: 'datetimerange',
      'unlink-panels': true
    },
    DATES: {
      type: 'dates',
    },
  },
  DEFAULT_FORMAT: {
    DATE: 'YYYY-MM-DD',
    DATE_TIME: 'YYYY-MM-DD HH:mm:ss',
    DATE_MONTH: 'YYYY-MM',
    DATE_YEAR: 'YYYY',
    DATE_RANGE: 'date_range'
  },
  SEARCH_CONDITION: {
    DATE: ['EQUAL'], // ['EQUAL', 'NOT_EQUAL', 'GREATER_THAN', 'LESS_THAN', 'GREATER_THAN_OR_EQUAL', 'LESS_THAN_OR_EQUAL'],
    DATE_TIME: ['EQUAL'],
  },
  SEARCH_FORM: {
    DATE: 'FROM_TO',
    DATE_TIME: 'FROM_TO'
  },
  mixins: [
    fieldMixin,
  ],
  props: {
  },
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    skin() {
      const { meta, value, runtime_format } = this;
      let format = null;
      let def = {
        scene: {format: this.$options.DEFAULT_FORMAT[meta.type]}
      }

      if (runtime_format) {
        format = runtime_format;
      } else if (meta.scene.format) {
        ({ format } = meta.scene);
      } else {
        format = this.$options.DEFAULT_FORMAT[meta.type];
      }
      
      return kr.format.make(format, value, meta.scene.format ? meta : def);
    },
  },
  methods: {
    handleInput(nv) {
      this.$nextTick(() => {
        this.setValue(nv);
      });
    },
    getKV() {
      /* eslint-disable prefer-const */
      const kv = fieldMixin.methods.getKV.call(this);
      if (!kv.length) {
        return kv;
      }
      let [k, v] = kv;
      if (v == null) {
        v = null;
      }

      //范围的时候，结束日期要多加一天。
      if (Array.isArray(v)) {
        const oneday = 24 * 60 * 60 * 1000 - 1; 
        let [start, end] = v;
        start = Number(start);
        end = Number(end);
        end += oneday;
        v = [start, end];
      }
      return [k, v];
    },
  },
};
</script>
<style lang="scss">
  .kr-datepicker {
    .el-date-editor.el-input, .el-date-editor.el-input__inner {
      width: 100%;
    }
  }
</style>
