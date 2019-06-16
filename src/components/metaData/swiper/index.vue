<template>
  <div class="kr-swiper">
    <el-carousel v-bind="conf_swiperOption" ref="krSwiper">
      <el-carousel-item v-for="(item, index) in slides" :key="index" :style="{lineHeight: conf_swiperOption.height}">
        <span v-if="item.type === 'text'" >{{item.content}}</span>

        <img v-if="item.type === 'img'" :src="`${item.src}`" class="swiper-img">
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'KrSwiper',
  props: {
    slides: kr.vue.getPropArray(
      // slides: [{
      //   type: 'img / text',
      //   content: '',
      //   src: ''
      // }],
    ),
    swiperOption: kr.vue.getPropObject(),
  },
  data () {
    return {
      local_swiperOption: {  
        height: '300px',
        autoplay: true,
        // type: '',
        loop: true,
        interval: 5000
      },
      runtime_swiperOption: {},
    }
  },
  computed: {  
    swiper() {
      return this.$refs.krSwiper;  
    },
    conf_swiperOption() {
      const { local_swiperOption, swiperOption, runtime_swiperOption } = this;
      return Object.assign({}, local_swiperOption, swiperOption, runtime_swiperOption);
    }
  }, 
  mounted () {  
  }   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
.kr-swiper {
  .swiper-img {
    height: 100%;
  }
  .el-carousel__item {
    text-align: center;
    background-color: #d3dce6;
   
  }
}
</style>