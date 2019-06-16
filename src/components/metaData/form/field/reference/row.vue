<template lang="html">
  <div class="reference-row">
    <nav>
      <span :class="state === 'all' ? 'child active' : 'child'" @click="handleChangeNav('all')">全部</span>
      <span>|</span>
      <span :class="state === 'chosed' ? 'child active' : 'child'" @click="handleChangeNav('chosed')">已选({{selectionRows.length}})</span>
    </nav>
    <div class="row-search" v-if="state === 'all'">
      <el-input
        size="small"
        placeholder="输入关键词搜索"
        v-model="rowKeyWord"
        prefix-icon="el-icon-search"
        clearable
        @clear="search"
        @keyup.enter.native="search">
      </el-input>
      <el-button size="small" @click="search">搜索</el-button>
    </div>

    <section >
      <KrDataTable
        ref="allTable"
        v-show="state==='all'"
        :metas="allTableMetas"
        :isSingle="isSingle"
        :selectedRows="selectionRows"
        @metadataChange="metadataChange"
        @getSelectionRows="getSelectionRows"
      />

      <KrDataTable
        v-show="state==='chosed'"
        :metas="chosedTableMetas"
        :isSingle="isSingle"
        @settingsClick="settingsClick"
      />
    </section>
  </div>
</template>

<script>
import ajax from '@/service/metaData/basic';
// import dataTable from 'components/metaData/krDataTable/index.vue';

export default {
  props: {
    isSingle: kr.vue.getPropBoolean(false),
    title: kr.vue.getPropString('管理相关项'),
    table_data_remote: kr.vue.getPropString(),
    moduleInfoId: kr.vue.getPropString(),
    selection_rows: kr.vue.getPropArray(),
    extraParams: kr.vue.getPropObject(),
    chosed_extraParams: kr.vue.getPropObject(),
    pagerLayout: kr.vue.getPropString("prev, pager, next"),
  },
  data() {
    const { selection_rows } = this.$props;
    let selectionRows = selection_rows ? _.cloneDeep(this.$props.selection_rows) : [];
    let selectionIds = selectionRows.map(item => item.id);

    return {
      state: 'all',
      rowKeyWord: '',
      allTableMetas: {
        api: this.fetch,
        opt: {
          moduleInfoId: this.$props.moduleInfoId,
          filters: [],
          ...this.$props.extraParams
        },
        pageLayout: this.$props.pagerLayout,
      },
      selectionRows,
      selectionIds
    }
  },
  computed: {
    chosedTableMetas() {
      return {
        api: this.fetch,
        opt: {
          moduleInfoId: this.$props.moduleInfoId,
          filters: [{"fieldName": "id", "operator": "IN", "fieldValues": [...this.selectionIds]}],
          ...this.$props.extraParams,
          ...this.$props.chosed_extraParams
        },
        pageLayout: this.$props.pagerLayout,
      }
    },
  },
  methods: {
    handleChangeNav(state) {
      this.state = state;
    },
    async fetch(extra) {
      let result = await ajax(Object.assign({}, {
        method: 'post',
        url: this.$props.table_data_remote
      }, extra), [], []);
      return result;
    },
    search() {
      if(this.rowKeyWord) {
        this.allTableMetas.opt.filters = [{      //名称筛选，没有时，不传此节点
          "fieldName": "name",
          "operator": "LIKE",
          "fieldValues": [this.rowKeyWord]
        }];
      } else {
        this.allTableMetas.opt.filters = [];
      }
    },
    // 获取选中行
    getSelectionRows(rows) {
      this.selectionRows = rows;
      this.selectionIds = this.selectionRows.map(item => item.id);
      this.$emit("selectedRows", this.selectionIds);
    },
    settingsClick(args) {
      if (!args) {
        return;
      }
      const { index, key, row } = args;
      if (key === "delete") {
        this.removeItem(row);
      }
    },
    removeItem(row) {
      let rows = _.filter(this.selectionRows, (item) => item.id !== row.id);
      this.getSelectionRows(rows);
      //更新选中行
      if (this.$refs.allTable.$children && this.$refs.allTable.$children.length) {
        // this.$refs.allTable.$children[0].toggleSelection(rows);
        _.defer(() => {
          this.$refs.allTable.$children[0].selectedRowsReturn();
        })
      }
    },
    metadataChange(metaData) {
      this.$emit("metadataChange", metaData);
    }
  },
  components: {
    // dataTable
  }
}
</script>

<style lang="scss">
  .reference-row {
    margin: 20px 0;
    .row-title {
      @include font-title-2(#2E3242, 600);
    }
    nav {
      margin: 20px 0;
      @include font-title-3(#525975);
      span {
        margin-right: 12px;
      }
      .child {
        cursor: pointer;
        &:hover {
          color: #5C6AC4;
        }
        &.active {
          color: #5C6AC4;
        }
      }
    }
    .row-search {
      display: flex;
      margin-bottom: 12px;
      .el-button {
        margin-left: 12px;
      }
    }
    .el-checkbox .el-checkbox__inner {
        width: 14px;
        height: 14px;
      }
  }
</style>
