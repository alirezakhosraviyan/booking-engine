<template>
  <v-container>
    <title-line>
      <v-card-title class="py-0 my-1 font-weight-bold">{{$t('Our Hotels')}}</v-card-title>
    </title-line>
    <v-row>
      <v-col v-for="(hotel,idx) in Object.values(hotelsDic)" :key="idx" cols="12" sm="6" lg="4">
        <flip-card>
          <template v-slot:front>
            <div
              class="square h-100 w-100 rounded overflow-hidden"
              role="img"
              :alt="hotel | altText"
              :title="hotel | altText"
              :style="`background-image: url(${ $options.filters.imgUrl(hotel) })`"
            ></div>
          </template>
          <template v-slot:back>
            <v-card class="h-100 overflow-hidden" flat outlined>
              <title-underline>
                <v-card-title>
                  <h3 class="text-h6 font-weight-bold">{{hotel.info.hotel.name[$i18n.locale]}}</h3>
                </v-card-title>
                <v-card-text>
                  <p class="text-justify body-2 mb-0">
                    {{hotel.info.hotel.desc[$i18n.locale]}}
                  </p>
                </v-card-text>
                <v-card-text>
                  <p class="text-center mb-0">
                    <v-btn text color="primary" @click="selectHotel(hotel.info.hotel._id)">
                      {{$t('Make a Reservation')}}
                    </v-btn>
                  </p>
                </v-card-text>
              </title-underline>
            </v-card>
          </template>
        </flip-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex"

import FlipCard from "~/components/base/flip-card";
import TitleLine from "~/components/base/title-line";
import TitleUnderline from "~/components/base/title-underline";
import BlurCard from "~/components/base/blur-card";

export default {
  components: { FlipCard, TitleLine, TitleUnderline, BlurCard },
  methods: {
    selectHotel(i) {
      this.$emit('hotel-select', `${i}`)
    }
  },
  filters: {
    altText(hotel) {
      return (
        hotel &&
        hotel.info &&
        hotel.info.images &&
        hotel.info.images.main &&
        hotel.info.images.main.caption
      ) || ''
    },
    imgUrl(hotel) {
      return (
        hotel &&
        hotel.info &&
        hotel.info.images &&
        hotel.info.images.main &&
        hotel.info.images.main.url
      ) || ''
    }
  },
  computed: { 
    ...mapState(['hotelsDic'])
  }
}
</script>

<style lang="scss" scoped>
.square {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>