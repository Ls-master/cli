<template>
  <div class="root">
    <div class="container">
      <img src="@/assets/img/404.png" class="img">
      <p class="sorry">很抱歉，您访问的页面不存在</p>
      <p class="concat">请检查网络设置或
        <a class="back" href="javascript:;" @click="handleReturn">
          返回上一页
        </a>
      </p>
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
    methods: {
      handleReturn() {
        window.history.back();
      },
    },
  };
</script>

<style lang="scss" scoped>
  .root {
    width: 100%;
    height: 100%;
    background: #FFFFFF;
    .container{
      padding-top: 90px;
      margin: auto;
      width: 750px;
      img{
        width: 600px;
        margin: auto;
        display: block;
        margin-bottom: 70px;
      }
      .sorry{
        margin: auto;
        width: 210px;
        font-size: 16px;
        text-align: center;
        color: #525975;
        margin-bottom: 30px;
      }
      .concat{
        margin: auto;
        width: 190px;
        text-align: center;
        font-size: 14px;
        color: #9094A3;
      }
    }
  }
</style>
