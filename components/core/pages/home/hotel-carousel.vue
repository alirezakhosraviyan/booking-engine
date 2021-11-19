<template>
  <v-carousel
    hide-delimiters
    continuous
    :show-arrows="false"
    :interval="6500"
    cycle
    height="100vh"
  >
    <v-carousel-item eager v-for="(hotel,idx) in imgList" :key="idx">
      <div
        class="h-100 carousel-img"
        :style="`background-image: url(${ $options.filters.mainImg(hotel).url || ''})`"
        role="img"
        :alt="$options.filters.mainImg(hotel).caption"
        :title="$options.filters.mainImg(hotel).caption"
      ></div>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
import { mapState } from "vuex"

export default {
  props: {
    hotel: {
      default: '',
    }
  },
  computed: {
    ...mapState(['hotelsDic']),
    imgList() {
      if(!this.hotel) {
        return Object.values(this.hotelsDic)
      }
      else {
        return [ this.hotelsDic[this.hotel] ]
      }
    }
  },
  filters: {
    mainImg(hotel) {
      return hotel?.info?.images?.main
    }
  }
};
</script>

<style lang="scss" scoped>
.carousel-img {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
}
</style>