<template>
  <div>
    <section class="full-page">
      <hotel-carousel :hotel="availData.hotel"></hotel-carousel>
      <div class="overlay">
        <v-container class="h-100">
          <v-row class="h-100" align="end" align-md="end">
            <v-col cols="12">
              <v-card rounded color="#0007" class="pt-3">
                <v-img v-if="!isMobile" :src="info.logo" width="80px" class="mx-auto" />
                <v-card-text v-if="(hotelStars)" class="d-flex flex-column align-center pa-0 mb-n2">
                  <v-rating
                    color="white"
                    readonly
                    :value="hotelStars"
                    :length="hotelStars"
                  />
                </v-card-text>
                <v-card-title v-if="!isMobile" class="white--text">
                  <h1 class="text-center w-100">
                    {{
                      hotelTitle
                    }}
                  </h1>
                </v-card-title>
                <v-card-text>
                  <input-section
                    button-title="Search"
                    dense
                    dark
                    :hotel="info.chain ? availData.hotel : Object.keys(hotelsDic)[0]"
                    :checkinDate="availData.checkinDate"
                    :checkoutDate="availData.checkoutDate"
                    @input:hotel="setHotel"
                    @input:checkinDate="availData.checkinDate=$event"
                    @input:checkoutDate="availData.checkoutDate=$event"
                    @submit-params="$router.push({ path: localePath('index-booking'), query: $event })"
                  />
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </section>
    <section v-if="info.chain && !availData.hotel">
      <hotels-section @hotel-select="setHotel($event);$vuetify.goTo(0)"></hotels-section>
    </section>
    <template v-else>
      <section>
        <amenities
          :hotel="
            info.chain
            ? availData.hotel
            : Object.keys(hotelsDic)[0]
          "
        />
      </section>
      <section>
        <rooms-carousel
          :hotel="
            info.chain
            ? availData.hotel
            : Object.keys(hotelsDic)[0]
          "
        />
      </section>
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"

import HotelCarousel from "~/components/core/pages/home/hotel-carousel"
import InputSection  from "~/components/core/pages/home/input-section"
import HotelsSection from "~/components/core/pages/home/hotels-section"
import Amenities     from "~/components/core/pages/home/amenities"
import RoomsCarousel from "~/components/core/pages/home/rooms-carousel"

export default {
  head() {
    return {
      title: (!this?.info?.chain
        ? this?.info?.title
        : (this?.hotelsDic?.[this.$route.query?.hotel]?.info?.hotel?.name || this?.info?.title))?.[this.$i18n.locale] || ''
        || this.$t('Booking Engine Service'),
      titleTemplate: `%s`
      }
    },
  fetch() {
    let hotel = this.$route.query.hotel
    if(hotel && Object.keys(this.$store.state.hotelsDic).includes(hotel))
      this.availData.hotel = hotel
  },
  mounted() {
    this.setClubToken()
  },
  data: () => ({
    availData: {
      hotel: '',
      checkinDate: '',
      checkoutDate: ''
    },
  }),
  methods: {
    setClubToken() {
      let apiKey = this.$store.state.club.token
      if(apiKey) {
        this.$api.defaults.headers['Authorization'] = apiKey
      }
    },
    setHotel(hotel) {
      this.availData.hotel = hotel
      this.$router.replace({ path: this.localePath('index'), query:{ hotel } })
    }
  },
  computed: {
    ...mapState(['info', 'hotelsDic']),
    isMobile() {
      return ['xs','sm'].includes(this.$vuetify.breakpoint.name)
    },
    chosenHotel() {
      return this.hotelsDic[this.$route.query.hotel]
    },
    hotelStars() {
      if(!this.info.chain) {
        return Object.values(this.hotelsDic)[0]?.info?.hotel?.star || false
      }
      else if(this.chosenHotel) {
        return this.chosenHotel?.info?.hotel?.star || false
      }
      return false
    },
    hotelTitle() {
      return (!this?.info?.chain ? this?.info?.title : (this?.hotelsDic?.[this?.availData?.hotel]?.info?.hotel?.name || this?.info?.title))?.[this.$i18n.locale] || ''
    }
  },
  components: { HotelCarousel, InputSection, Amenities, RoomsCarousel, HotelsSection }
};
</script>

<style lang="scss" scoped>
.full-page {
  min-height:100vh;
  position:relative
}

section {
  margin-bottom: 48px;
  &:last-of-type {
    margin-bottom: 16px;
  }
}
</style>
