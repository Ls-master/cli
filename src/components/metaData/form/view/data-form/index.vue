<template lang="html">
  <div class="comp-md-form-dataform">
    <el-form size="medium" label-position="top" @submit.native.prevent>
      <div v-for="(meta, i) in fieldMetas" :label="meta.name" :key=" onlyKey ? meta.onlyKey ? meta.onlyKey : i  : i">
      <component
          v-if="fields.find(meta) && !meta.unVisible"
          ref="fields"
          :is="fields.find(meta)"
          :key="meta.key"
          :meta="meta"
          :index="index"
          :env="env"
          v-bind="meta.scene.element_props"
          :outerValue="getOuterValue(value[meta.key])"
          :sceneEmitter="sceneEmitter"
          :fieldEmitter="fieldEmitter"
        />
      </div>
    </el-form>
  </div>
</template>

<script>
import fields from 'components/metaData/form/field/all';
import Emitter from 'wolfy87-eventemitter';

export default {
  props: {
    onlyKey: kr.vue.getPropBoolean(),
    fieldMetas: kr.vue.getPropArray(),
    value: kr.vue.getPropObject(),
    index: kr.vue.getPropNumber(),
    env: Object
  },
  data() {
    return {
      fields,
      fieldEmitter: new Emitter(),
      sceneEmitter: new Emitter(),
    }
  },
  methods: {
    getOuterValue(value) {
      if (kr.script.isArray(value)) {
        value = value.map((item) => {
          if (kr.script.isObject(value)) {
            return Object.assign({}, item);
          }
          return item;
        });
        return value;
      }
      return value;
    },
    getKey() {
      return kr.getId(16);
    },
    getEleRefs() {
      let {fields} = this.$refs;
      return fields.reduce((pre, item) => {
        pre.push(item.getEleRef());
        return pre;
      }, [])
    },
    getFields() {
      let {fields} = this.$refs;
      fields = fields.filter((item) => {
        return item.getForm;
      })
      return fields;
    },
    getForm() {
      const fields = this.getFields();
      if (kr.script.isArray(fields)) {
        return fields.reduce((result, component) => {
          const [key, value] = component.getKV();
          if (key !== 'MODULE_HEADER' && key !== 'FORMAT_EXPLAIN') {
            result[key] = value;
          }
          return result;
        }, {});
      }
      return {};
    },
    async submit() {
      const fields = this.getFields();
      const form = this.getForm();
      if (kr.script.isArray(fields)) {
        await Promise.all(fields.map(field => field.doValidate(form)));
      }
      return form;
    },
  },
  components: {
    ...fields
  }
}
</script>


<style lang="scss" scoped>
  .comp-md-form-dataform {
    
  }
</style>
