<template>
  <el-form class="table-filter-form">
    <div v-for="(item, index) in filterMetas" :key="item.onlyKey">
      <component
              v-if="fields.find(item) && !item.unVisible"
              ref="filterMeta"
              :is="fields.find(item)"
              :key="item.key"
              :meta="item"
              :outerValue="filterValue[item.key]"
              v-bind="item.scene.element_props"
              :sceneEmitter="sceneEmitter"
              :fieldEmitter="fieldEmitter"
      />
    </div>
  </el-form>
</template>

<script>
import fields from 'components/metaData/form/field/all';
import Emitter from 'wolfy87-eventemitter';

export default {
  props: {
    meta: kr.vue.getPropObject(),
    value: kr.vue.getPropObject()
  },
  data() {
    return {
      fields,
      fieldEmitter: new Emitter(),
      sceneEmitter: new Emitter(),
      filterMetas: [],
      filterValue: {},
      innerMeta: {},
      isSelectChange: true
    }
  },
  components: {
    ...fields
  },
  computed: {
    showSelect() {
      return !this.meta.operate;
    }
  },
  watch: {
    meta: {
      handler: function (val, oldVal) {
        // this.innerMeta = Object.assign({}, this.meta);
        // this.filterValue = {};
        // this.filterMetas = this.init();
      },
      deep: true,
      immediate: true
    },
  },
  methods: {
    init() {
      let { innerMeta, isSelectChange } = this;
      let defType = innerMeta.type;
      this.filterMetas = [
        {
          key: 'relation',
          name: '',
          type: 'SELECT',
          unVisible: this.showSelect,
          onlyKey: kr.getId(16),
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
                      innerMeta.type = "DATE_TIME_RANGE";
                    } else {
                      innerMeta.type = defType;
                    }
                  }
                },
              },
            ],
          }
        },
        {
          key: 'value',
          name: '',
          type: innerMeta.type,
          unVisible: false,
          onlyKey: kr.getId(16),
          scene: {
            return_value: true,
            related_data: {
            },
            element_props: {
              pickerOptions: {
                stepMinute: 5
              },
              format: 'yyyy-MM-dd hh:mm',
              clearable: true,
              size: 'mini',
            },
            ...this.meta.scene
          }
        }
      ];
      console.log('filterMetas ', this.filterMetas);
    }
  },
  mounted() {
    console.log('xxxxxxxxxxxxxx');
    this.init();
  }
}
</script>

<style scoped>

</style>