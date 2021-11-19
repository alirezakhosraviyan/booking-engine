<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <div v-if="selected !== null">
          <pre dir="ltr">{{hotelsDic[selected]}}</pre>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <v-responsive :aspect-ratio="isMobile ? 1.3 : 1.9">
          <client-only>
            <l-map
              :options="{
                attributionControl: false,
                minNativeZoom:1,
                minZoom:1,
              }"
              ref="myMap"
              :zoom=13
              :center="mapCenter || [35.73645604130492, 51.39975797653203]"
            >
              <l-tile-layer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tile-layer>
              <template v-if="mapCenter">
                <l-marker
                  v-for="(hotel,idx) in Object.values(hotelsDic)"
                  :key="idx"
                  :lat-lng="[
                    hotel.info.hotel.latitude,
                    hotel.info.hotel.longitude
                  ]"
                >
                  <l-popup>
                    <a role="button" @click="selected = hotel.info.hotel._id">
                      {{hotel.info.hotel.name[$i18n.locale]}}
                    </a>
                  </l-popup>
                </l-marker>
              </template>
            </l-map>
          </client-only>
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from "vuex"

import getCoordCenter from "~/util/functions/get-coord-center.js"

export default {
  head() {
    return { title: this.$t('Map') }
  },
  mounted() {
    
  },
  data: () => ({
    selected: null,
  }),
  computed: {
    ...mapState(['hotelsDic']),
    isMobile() {
      return ["xs", "sm"].includes(this.$vuetify.breakpoint.name);
    },
    pinsGroup() {
      return Object.values(this.hotelsDic).map(i => {
        let hotel = i?.info?.hotel
        if(!hotel?.latitude && !hotel?.longitude)
          return null
        return [
          hotel.latitude,
          hotel.longitude
        ]
      })
    },
    mapCenter() {
      if(this.pinsGroup.some(i => (i == null)))
        return false
      return getCoordCenter(this.pinsGroup)
    },
  }
}
</script>