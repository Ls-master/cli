<template>
  <div class="comp-md-kr-employee-new">
    <el-select v-model="filterValue" filterable clearable @clear="searchSelectClear" :filter-method="filterMethod" @change="searchSelectChange" placeholder="搜索成员、部门…" class="employee-search-input" size="medium">
      <div slot="prefix" class="employee-search-input-icon">
        <i class="icon iconfont icon-search"></i>
      </div>
      <div v-if="userOptions.options.length" class="search-option-group-title">成员</div>
      <div v-if="userOptions.options.length" class="search-option-group-panel">
        <el-option
                v-for="(item, index) in userOptions.options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
          <row style="margin-left: 12px" :index="index" :data="item" :key="item.id"></row>
        </el-option>
      </div>
      <div v-if="deptOptions.options.length" class="search-option-group-title">部门</div>
      <div v-if="deptOptions.options.length" class="search-option-group-panel">
        <el-option
                v-for="(item, index) in deptOptions.options"
                :key="item.id"
                :label="item.name"
                :value="item.id">
          <row style="margin-left: 12px" :index="index" :data="item" :key="item.id"></row>
        </el-option>
      </div>
    </el-select>
    <div class="employee-panel">
      <div class="employee-panel-left" v-loading="loading">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="部门" name="first">
            <div class="employee-breadcrumb-panel">
              <breadcrumb v-for="(item, index) in breadcrumbArr" :index="index" :length="breadcrumbArr.length" :data="item" :key="index" @click="handleBreadcrumb"></breadcrumb>
            </div>
            <el-checkbox v-model="selectAllModel" @change="selectAll">全选</el-checkbox>
            <div class="employee-row-panel">
                <row ref="deptRow" v-for="(item, index) in deptTree" checkbox :index="index" :data="item" :key="getKey()" @click="handleDeptItem" @change="handleCheckbox(item, ...arguments)"></row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="成员" name="second">
            <row v-for="(item, index) in userAll" checkbox :index="index" :data="item" :key="getKey()" @change="handleCheckbox(item, ...arguments)"></row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="employee-panel-right">
        <div class="employee-right-top-panel">
          <span class="employee-right-top-select-num">已选 {{selectTags.length}} 人</span>
          <span class="employee-right-top-delete-icon" @click="clearTags(selectTags)">
            <i class="icon iconfont icon-garbage"></i>
            清空
          </span>
        </div>
        <div class="employee-right-tag-panel">
          <el-tag class="employee-right-tag" size="mini" closable @close="handleTagClose(item)" v-for="(item, index) in selectTags" :key="index">{{item.name}}</el-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllUsers } from '@/service/metaData/org/account';
import { deptList } from '@/service/metaData/dataJurisdiction';
import row from './row';
import breadcrumb from './breadcrumb';

export default {
  name: "inner",
  props: {
    value: Array
  },
  data() {
    return {
      selectAllModel: false,
      filterValue: '',
      activeTab: 'second',
      loading: false,
      userOptions: {
        label: '成员',
        options: []
      },
      deptOptions: {
        label: '部门',
        options: []
      },
      userAll: [],
      deptAll: [],
      deptTree: [],
      fullThree: [],
      breadcrumbArr: [],
      selectTags: [],
      currentSearch: ''
    }
  },
  components: {
    row,
    breadcrumb
  },
  watch: {
    userAll: {
      handler: function (val, oldVal) {
        this.selectTags = val.filter((item) => {
          return item.isSelected;
        })
      },
      deep: true
    },
    fullThree: {
      handler: function (val) {
        val.forEach((item) => {
          this.deepDeptTree(item);
        })
      },
      deep: true
    },
    value: {
      handler: function (val, oldVal) {
        this.selectTags = [...this.value];
        this.formatTree(this.deptAll, this.userAll);
      },
      deep: true
    },
    deptTree: {
      handler: function (val, oldVal) {
        this.changeSelectedAllModel();
      },
      deep: true
    }
  },
  methods: {
    getKey() {
      return kr.getId(16);
    },
    selectAll(val) {

      let { deptRow } = this.$refs;

      deptRow.forEach((item) => {
        item.checkboxChange(val);
      })
    },
    changeSelectedAllModel() {
      if (this.deptTree) {
        let dept = this.deptTree.find((item) => {
          return !item.isSelected;
        })
        this.selectAllModel = !dept;
      }
    },
    searchSelectChange(val) {

      let { deptAll, userAll } = this;

      let dept = deptAll.find((item) => {
        return item.id === val;
      })

      if (dept) {
        this.deepData(dept, true);
        this.currentSearch = dept;
        return;
      }

      let user = userAll.find((item) => {
        return item.id === val;
      })

      if (user) {
        user.isSelected = true;
        this.currentSearch = user;
      }

    },
    deepData(data, val) {
      data.isSelected = val;
      if (data.isDept) {
        data.children && data.children.forEach((item) => {
          this.deepData(item, val);
        })
      }
    },
    searchSelectClear() {
      this.deptOptions.options = [];
      this.userOptions.options = [];
      if (this.currentSearch) {
        if (this.currentSearch.isDept) {
          this.deepData(this.currentSearch, false);
        } else {
          this.handleTagClose(this.currentSearch);
        }
        this.currentSearch = '';
      }

    },
    deepDeptTree(val) {
      if (val.isDept && val.children) {
        let selected = val.children.filter((item) => {
          if (item.isDept) {
            this.deepDeptTree(item);
          }
          return item.isSelected || item.indeterminate;
        });
        if (selected.length === 0) {
          val.isSelected = false;
          val.indeterminate = false;
        } else if (selected.length === val.children.length) {
          val.isSelected = true;
          val.indeterminate = false;
        } else {
          val.isSelected = false;
          val.indeterminate = true;
        }
      }
    },
    handleBreadcrumb(data, index) {
      this.deptTree = data.children;
      this.breadcrumbArr = this.breadcrumbArr.slice(0, index + 1);
    },
    handleDeptItem(data) {
      if (data.isDept) {
        return;
      }
      this.breadcrumbArr.push(data);
      this.deptTree = data.children;
    },
    handleCheckbox(item, newItem) {
      item.isSelected = newItem.isSelected;
    },
    clearTags(tags) {
      tags.forEach((item) => {
        item.isSelected = false;
      })
      tags = [];
    },
    handleTagClose(tag) {
      tag.isSelected = false;
      this.selectTags = this.selectTags.filter((item) => {
        return tag.id !== item.id;
      })
    },
    filterMethod(val) {
      let { userAll, deptAll, deptOptions, userOptions } = this;
      if (!val) {
        userOptions.options = [];
        deptOptions.options = [];
      } else {
        userOptions.options = userAll.filter((item) => {
          let reg = new RegExp(val);
          return reg.test(item.name);
        })

        deptOptions.options = deptAll.filter((item) => {
          let reg = new RegExp(val);
          return reg.test(item.name);
        })
      }

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
      this.deptAll = dept;
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
      this.fullThree = deptTree;
      this.breadcrumbArr.push({
        name: '部门',
        id: '0',
        children: deptTree
      });
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
    this.selectTags = [...this.value];
    Promise.all([await this.requestDept(), await this.requestAllUser()]).then(([dept, user]) => {
      this.formatTree(dept, user);
    })
  }
}
</script>

<style lang="scss">

  .search-option-group-title {
    font-size: 12px;
    color: #9DA2B3;
    text-align: left;
    line-height: 34px;
    margin: 0 20px;
  }

  /*.search-option-group-title:nth-child(2) {*/
    /*border-top: 1px solid  #E6E9F5;*/
  /*}*/

  .search-option-group-panel {
    padding-bottom: 8px;
  }

  .comp-md-kr-employee-new {
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
      .employee-panel-left, .employee-panel-right {
        display: inline-block;
        width: 50%;
        height: 100%;
        box-sizing: border-box;
        vertical-align: top;
      }

      .employee-panel-left {
        border-right: 1px solid #E4E7ED;
        font-size: 13px;

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
          padding-left: 20px;
          height: 328px;
          overflow-y: auto;
        }

        .employee-breadcrumb-panel {
          margin: 8px 0 4px;
          line-height: 20px;
          font-size: 13px;
        }

        .employee-row-panel {
          height: 252px;
          /*height: 296px;*/
          overflow-y: auto;
        }
      }

      .employee-right-top-panel {
        font-size: 13px;
        height: 36px;
        line-height: 36px;
        position: relative;
        padding: 0 13px;
        border-bottom: 1px solid #E4E7ED;

        .employee-right-top-select-num {
          color: #9DA2B3;
        }

        .employee-right-top-delete-icon {
          position: absolute;
          top: 0;
          right: 13px;
          display: flex;
          align-items: center;
        }
      }

      .employee-right-tag-panel {
        padding: 12px 20px;

        .employee-right-tag {
          margin-right: 8px;
          margin-bottom: 6px;
        }
      }
    }
  }


</style>