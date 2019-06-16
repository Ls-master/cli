<template>
  <el-form class="table-filter-form">
    <component
            class="filter-select-item"
            v-if="fields.find(selectMeta) && showSelect"
            ref="selectMeta"
            :is="fields.find(selectMeta)"
            :key="selectMeta.key"
            :meta="selectMeta"
            :outerValue="selectValue"
            v-bind="selectMeta.scene.element_props"
            :sceneEmitter="sceneEmitter"
            :fieldEmitter="fieldEmitter"
    />
    <component
            v-if="fields.find(filterMeta)"
            ref="filterMeta"
            :is="fields.find(filterMeta)"
            :key="filterMeta.key"
            :meta="filterMeta"
            :outerValue="filterValue"
            v-bind="filterMeta.scene.element_props"
            :sceneEmitter="sceneEmitter"
            :fieldEmitter="fieldEmitter"
    />
  </el-form>
</template>

<script>

import fields from 'components/metaData/form/field/all';
import Emitter from 'wolfy87-eventemitter';

export default {
  props: {
    meta: kr.vue.getPropObject(),
    value: [Object, String]
  },
  data() {
    return {
      fields,
      fieldEmitter: new Emitter(),
      sceneEmitter: new Emitter(),
      selectMeta: {},
      filterMeta: {},
      innerMeta: {},
      selectValue: '',
      filterValue: ''
    }
  },
  components: {
    ...fields
  },
  computed: {
    showSelect() {
      return this.meta.operate;
    }
  },
  watch: {
    meta: {
      handler: function (val, oldVal) {
        this.innerMeta = Object.assign({}, this.meta);
        this.clearValue();
        this.init()
      },
      deep: true,
      immediate: true
    },
    value: {
      handler: function (val, oldVal) {
        if (val) {
          this.$nextTick(() => {
            const { selectMeta, filterMeta } = this.$refs;
            if (val.relation) {
              selectMeta.setValue(val.relation.value);
              this.selectValue = val.relation.value;

            }
            if (val.value) {
              filterMeta.setValue(val.value);
              this.filterValue = val.value;
            }
          })
        } else {
          this.clearValue();
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getKey() {
      return kr.getId(16);
    },
    clearValue() {
      const { selectMeta, filterMeta } = this.$refs;
      if (selectMeta) {
        selectMeta.setValue('');
      }
      if (filterMeta) {
        filterMeta.setValue('');
      }
      this.selectValue = '';
      this.filterValue = '';
    },
    init() {

      let { innerMeta } = this;
      let defType = innerMeta.type;

      this.selectMeta = {
        key: 'relation',
        name: '',
        type: 'SELECT',
        scene: {
          related_data: {
            options: innerMeta.operate
          },
          element_props: {
            clearable: true,
            size: 'mini'
          },
          field_event_emit: [
            {
              event: 'change',
              script: (ctx, ...arg) => {
                const { component } = ctx;

                if (defType === 'DATE_TIME') {
                  if (component.value === 'BETWEEN') {
                    const { filterMeta } = this.$refs;
                    filterMeta.setValue('');
                    innerMeta.type = "DATE_TIME_RANGE";
                  } else {
                    innerMeta.type = defType;
                  }
                  this.init();
                }
              },
            },
          ],
        }
      }
      this.filterMeta = {
        key: 'value',
        name: '',
        type: innerMeta.type,
        scene: {
          return_value: true,
          related_data: {
          },
          element_props: {
            pickerOptions: {
              stepMinute: 5
            },
            format: 'yyyy-MM-dd HH:mm',
            clearable: true,
            size: 'mini',
            appendToBody: false
          },
          ...this.meta.scene
        }
      }
      this.$nextTick(() => {
        let { filterMeta } = this.$refs;
        if (filterMeta) {
          let referenceEl = filterMeta.$el.getElementsByClassName('el-date-editor')[0];
          let reference = filterMeta.$children[0].$children[0].$children[0];
          if (reference) {
            reference.referenceElm = referenceEl;
            reference.updatePopper && reference.updatePopper();
          }
        }
      })
    },
    getFields() {
      let { selectMeta, filterMeta } = this.$refs;
      let arr = [];
      if (selectMeta) {
        arr.push(selectMeta);
      }
      if (filterMeta) {
        arr.push(filterMeta);
      }
      return arr;
    },
    getForm() {
      const fields = this.getFields();
      return fields.reduce((result, component) => {
        const [key, value] = component.getKV();
        result[key] = value;
        return result;
      }, {});
    },
    async submit() {
      const { filterMeta } = this.$refs;
      const fields = this.getFields();
      const form = this.getForm();
      if (kr.script.isArray(fields)) {
        await Promise.all(fields.map(field => field.doValidate(form)));
      }
      form.field = Object.assign({}, this.meta);
      form.cache = filterMeta.cache;
      return form;
    },
  }
}
</script>

<style lang="scss">

  .table-filter-form {
    .el-form-item {
      margin-bottom: 0px !important;
    }

    .filter-select-item {
      width: 100px;
    }
  }

</style>