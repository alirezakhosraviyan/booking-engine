<template>
  <v-container fluid>
    <title-line>
      <v-card-title class="py-0 my-1 font-weight-bold">{{$t('Rooms')}}</v-card-title>
    </title-line>
    <div class="d-flex flex-row align-center jusify-space-around">
      <v-btn class="ms-0 ms-lg-2 d-none d-lg-inline" large icon @click="slide = ((slide == 0) ? (numOfSlides - 1) :  (slide - 1))">
        <v-icon>
          {{$vuetify.rtl ? 'mdi-chevron-right' : 'mdi-chevron-left'}}
        </v-icon>
      </v-btn>
      <v-carousel
        interval="8000"
        v-model="slide"
        cycle
        hide-delimiters
        height="unset"
        :show-arrows="false"
        :dark="$vuetify.theme.dark"
        :light="!$vuetify.theme.dark"
      >
        <v-carousel-item eager v-for="i in Math.ceil(slides.length/slice)" :key="i">
          <v-container class="pa-0">
            <v-row class="px-3">
              <v-col :cols="12 / slice" v-for="(room,idx) in slides.slice((i - 1) * slice, i * slice)" :key="idx">
                <room-card
                  :room="room"
                  @add-to-cart="addToCart"
                  :hotel-title="hotelsDic[hotel].info.hotel.name.en"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-carousel-item>
      </v-carousel>
      <v-btn class="me-0 me-lg-2 d-none d-lg-inline" large icon @click="slide = ((slide == (numOfSlides - 1)) ? 0 :  (slide + 1))">
        <v-icon>
          {{$vuetify.rtl ? 'mdi-chevron-left' : 'mdi-chevron-right'}}
        </v-icon>
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import { mapState } from "vuex"

import RoomCard from "~/components/core/pages/home/room-card"
import TitleLine from "~/components/base/title-line";

  export default {
  props: ['hotel'],
  components: { RoomCard, TitleLine },
  data: () => ({
    slide: null,
    rooms: []
  }),
  methods: {
    addToCart(id) {
      this.$store.commit('avail/addToCart', id)
      let todayObj = this.$moment()
      let today = todayObj.format('YYYY-MM-DD')
      todayObj.add(1, 'days')
      let tomorrow = todayObj.format('YYYY-MM-DD')
      this.$router.push({
        path: this.localePath('index-booking'),
        query: {
          hotel: this.hotel,
          checkinDate: today,
          checkoutDate: tomorrow,
        }
      })
    }
  },
  computed: {
    ...mapState(['hotelsDic']),
    numOfSlides() {
      return Math.ceil(this.slides.length/this.slice)
    },
    slides() {
      return (this.hotelsDic[this.hotel]?.rooms && Object.values(this.hotelsDic[this.hotel].rooms)) || []
    },
    slice() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 1;
        case 'sm':
        case 'md':
          return 2;
        case 'lg':
        case 'xl':
          return 3;
      }
    }
  }
}
</script>