import Vue from 'vue'

Vue.component('path-bread-list', {
  template: `
    <div class="path-bread-list" v-if="$root.pathBreadList.length > 1">
      <template
        v-for="(item, idx) in $root.pathBreadList"
      >
        <span
          @click="$root.pathBreadBackTo(idx)"
        >{{item}}</span>
        <i class="el-breadcrumb__separator el-icon-arrow-right"
          v-if="idx < $root.pathBreadList.length - 1"
        ></i>
      </template>
    </div>
  `
})