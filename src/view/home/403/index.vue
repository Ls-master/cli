<template>
  <div class="root">
    <div class="container">
      <img src="@/assets/img/403.png" alt="" class="img">
      <p class="sorry">很抱歉，您没有访问权限</p>
      <p class="concat">请联系管理员</p>
    </div>
  </div>
</template>

<script>
  export default{
    mixins: [],
    props: {},
    components: {},
    data() {
      return {};
    },
    computed: {},
    methods: {},
  };
</script>

<style lang="scss" scoped>
  .root {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    .container {
      margin: auto;
      width: 750px;
      padding-top: 90px;
      img {
        width: 600px;
        margin: auto;
        display: block;
        margin-bottom: 70px;
      }
      .sorry {
        margin: auto;
        width: 180px;
        text-align: center;
        font-size: 16px;
        color: #525975;
        margin-bottom: 30px;
      }
      .concat {
        margin: auto;
        width: 90px;
        text-align: center;
        font-size: 14px;
        color: #9094A3;
      }
    }
  }
</style>
