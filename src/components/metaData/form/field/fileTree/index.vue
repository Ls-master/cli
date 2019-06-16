<template>
  <Container
          @click="handleClick"
          ref="container"
          :runtime_validate="runtime_validate"
          :meta="meta"
          :disabled="conf_element_props.disabled"
          :env="finalEnv"
  >
    <KrFileTree
            ref="field"
            slot="field"
            v-if="type === 'FILE_TREE'"
            :data="getTreeData"
            v-bind="[local_element_props, element_props, runtime_element_props]"
            v-model="value">
    </KrFileTree>
    <KrFileTree
            ref="field"
            slot="field"
            v-if="type === 'FILE_TREE_LAZY'"
            lazy
            :load="loadNode"
            v-bind="[local_element_props, element_props, runtime_element_props]"
            v-model="value">
    </KrFileTree>

  </Container>
</template>

<script>
import KrFileTree from '../../../krFileTree';
import fieldMixin from '../basic/field-mixin';

export default {
  INDEX: ['FILE_TREE', 'FILE_TREE_LAZY'],
  mixins: [
    fieldMixin,
  ],
  computed: {
    getTreeData() {
      this.runtime_related_data.forEach((item) => {
        item.pid = item.parentId;
      })
      return this.$root.createTree(this.runtime_related_data || [], '0000');
    }
  },
  methods: {
    async loadNode(node, resolve) {
      if (node.level === 0) {
        this.meta.scene.related_data_remote_query = {
          data: {
            parentId: '0000'
          }
        };
        await this.fetch();
        // console.log('this.runtime_related_data', this.runtime_related_data);
        // resolve(this.runtime_related_data);
        let ele = this.runtime_related_data[0];
        if (ele) {
          this.loadNode({ level: -1, key: ele.id, data: { bizType: ele.bizType } }, resolve);
        } else {
          resolve(this.runtime_related_data);
        }
      } else {
        this.meta.scene.related_data_remote_query = {
          data: {
            parentId: node.key,
            bizType: node.data.bizType
          }
        };
        await this.fetch();
        resolve(this.runtime_related_data);
      }
    },
  },
  components: {
    KrFileTree
  },
  created() {
    if (this.type === 'FILE_TREE') {
      this.fetch();
    }
  }
}
</script>

<style scoped>

</style>