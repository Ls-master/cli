<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
          @handleTitleRight="handleTitleRight"
  >
    <div ref="field"
         slot="field"
    >
      <Row
              ref="row"
              v-for="(item, index) in rows"
              :key="item.id"
              :index="index"
              :outerMakeRelatedDataRemote="self_make_related_data_remote_func"
              :disabled="conf_element_props.disabled"
              :value="item"
              @handleAddButton="handleAddButton"
              @handleDeleteButton="handleDeleteButton"
      ></Row>
    </div>
  </Container>
</template>

<script>
import fieldMixin from '../basic/field-mixin';
import Row from './row';

export default {
  INDEX: [ 'CHANGE_FIELD' ],
  data() {
    return {
      rows: [
        {
          api_name: null,
          value: null,
          id: kr.random.string_number()
        }
      ]
    }
  },
  mixins: [
    fieldMixin,
  ],
  components: {
    Row
  },
  watch: {
    rows: {
      handler: function(val) {
        this.setValue(val);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getKey() {
      return kr.random.string_number();
    },
    handleAddButton(index) {
      this.rows.splice(index + 1, 0, {
        api_name: null,
        value: null,
        id: kr.random.string_number()
      });
    },
    handleDeleteButton(row) {
      this.rows = this.rows.filter((item) => {
        return item != row;
      });
    },
    getKV() {
      const {meta, disabled} = this;
      let rows = this.$refs.row;
      let value = rows.reduce((pre, item) => {
        pre.push(item.getValue());
        return pre;
      }, [])

      if (disabled) {
        return [];
      }
      return [meta.key, value];
    }
  }
}
</script>

<style scoped>

</style>