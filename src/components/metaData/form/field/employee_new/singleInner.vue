<template>
  <div class="comp-md-kr-employee-new-single">
    <el-select v-model="filterValue" filterable clearable @clear="searchSelectClear" :filter-method="filterMethod" @change="searchSelectChange" placeholder="搜索成员…" class="employee-search-input" size="medium">
      <div slot="prefix" class="employee-search-input-icon">
        <i class="icon iconfont icon-search"></i>
      </div>
      <el-option
              v-for="(item, index) in userOptions.options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
        <row style="margin-left: 12px" :index="index" :data="item" :key="item.id"></row>
      </el-option>
    </el-select>
    <div class="employee-panel" v-loading="loading">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="成员" name="first">
          <div class="employee-user-panel">
            <row v-for="(item, index) in userAll" :index="index" :data="item" :key="getKey()" @click="handleRow"></row>
          </div>
        </el-tab-pane>
        <el-tab-pane label="部门" name="second" class="employee-dept-panel">
          <el-tree :data="deptTree" :props="defaultProps" @node-click="handleNodeClick">
            <span slot-scope="{ node, data }">
              <row :data="data" :index="node.id" @change="handleCheckbox(item, ...arguments)"></row>
            </span>
          </el-tree>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { getAllUsers } from '@/service/metaData/org/account';
import { deptList } from '@/service/metaData/dataJurisdiction';
import row from './row';

export default {
  data() {
    return {
      filterValue: '',
      userOptions: {
        label: '成员',
        options: []
      },
      userAll: [],
      deptTree: [],
      selectTags: [],
      loading: false,
      activeTab: 'first',
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  components: {
    row
  },
  methods: {
    getKey() {
      return kr.getId(16);
    },
    searchSelectClear() {
      this.selectTags = null;
      this.userOptions.options = [];
    },
    filterMethod(val) {
      let { userAll, userOptions } = this;
      if (!val) {
        userOptions.options = [];
      } else {
        userOptions.options = userAll.filter((item) => {
          let reg = new RegExp(val);
          return reg.test(item.name);
        })
      }
    },
    handleRow(data) {
      let { userAll } = this;
      userAll.forEach((item) => {
        if (item.id === data.id) {
          item.isSelected = true;
          this.selectTags = item;
        } else {
          item.isSelected = false;
        }
      })
    },
    searchSelectChange(val) {
      this.handleRow({ id: val });
    },
    handleNodeClick() {

    },
    async requestAllUser() {
      let res = await getAllUsers();
      return res;
    },
    async requestDept() {
      let res = await deptList();
      return res;
    },
    formatTree(dept, user) {
      if (!Array.isArray(dept) && !Array.isArray(user)) {
        return [];
      }
      let deptTree = dept.reduce((pre, item) => {
        if (item.parentId === '0') {
          item.isDept = true;
          item.isSelected = false;
          item.indeterminate = false;
          pre.push(item);
          this.recursionDept(item, dept, user);
        };
        return pre;
      }, []);
      this.deptTree = deptTree;
      this.userAll = user;
      this.loading = false;
    },
    recursionDept(item, dept, user) {
      dept.forEach((i) => {
        if (i.parentId === item.id) {
          i.isDept = true;
          if (item.children) {
            item.children.push(i);
          } else {
            item.children = [i];
          }
          i.isSelected = false;
          i.indeterminate = false;
          this.recursionDept(i, dept, user);
        }
      })
      user.forEach((i) => {
        if (i.deptId === item.id) {
          if (item.children) {
            item.children.push(i);
          } else {
            item.children = [i];
          }
          i.isSelected = false;
        }
        if (this.value) {
          this.value.forEach((item) => {
            if (item.id === i.id) {
              i.isSelected = true;
            }
          });
        }
      })
    }
  },
  async created() {
    this.loading = true;
    this.selectTags = this.value;
    console.log('selectTags', this.selectTags);
    Promise.all([await this.requestDept(), await this.requestAllUser()]).then(([dept, user]) => {
      this.formatTree(dept, user);
    })
  }
}
</script>

<style lang="scss">
  .comp-md-kr-employee-new-single {
    .employee-search-input {
      margin: 20px 12px 0;
      width: calc(100% - 24px) !important;
      .employee-search-input-icon {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 5px;
      }
    }

    .employee-panel {
      height: 363px;
      border: 1px solid #E4E7ED;
      border-top: none;
      margin: 0px 12px 12px;
      font-size: 0;

      .el-tabs__nav {
        margin-left: 20px;

        .el-tabs__item {
          font-size: 13px;
          height: 36px;
          line-height: 36px;
        }
      }

      .el-tabs__header {
        margin-bottom: 0px;
      }

      .el-tabs__content {
        /*padding-left: 20px;*/
        height: 320px;
        overflow-y: auto;
      }

      .employee-user-panel {
        /*padding-left: 20px;*/
        height: 100%;
        overflow: hidden;

        .comp-md-kr-employee-new-row {
          padding-left: 20px;
        }
      }

      /*.employee-dept-panel {*/
      /*}*/

      .el-tree-node__content {
        height: auto;
      }

    }
  }
</style>