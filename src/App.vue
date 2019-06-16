<template>
  <div
    id="app"
  >
    <router-view />

  </div>
</template>

<script>

export default {
  name: 'App',

  data() {
    return {
    }
  },

  created() {
  },
  methods: {
  },
  components: {
  },
  destroyed() {
    
  },
  mounted() {
  }
}
</script>

<style lang="scss">
  @import "./style/reset.scss";
  @import "animate.css";
  @import './assets/iconFont/iconfont.css';
  @import 'saas3-element-ui/lib/theme-chalk/index.css';
  @import "./style/theme/index.css";
  @import "./style/index.scss";
</style>
