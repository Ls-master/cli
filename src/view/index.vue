<template lang="html">
  <div class="view-index">
    <div class="kr-top-menu">
      <top-menu></top-menu>
    </div>
    <div class="kr-content-router">
      <router-view/>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import topMenu from '@/components/home/topMenu/index.vue';

export default {
  methods: {
    
  },
  mounted() {
    
  },
  components: {
    topMenu
  }
}
</script>

<style lang="scss">
.view-index {
  height: 100%;
  .kr-top-menu {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: 1000;
  }
  .kr-content-router {
    width: 100%;
    height: calc(100% - 52px);
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 52px;
    bottom: 0;
  }
}
</style>
