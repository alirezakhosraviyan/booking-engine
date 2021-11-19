<template>
  <div>

    <v-dialog
      v-model="pwaDialog"
      max-width="500"
      fullscreen
      hide-overlay
      eager
    >
      <pwa-dialog v-if="pwaDialog" :type="userAgent" @close="pwaDialog=false;$store.commit('setPwaPrompt', true);"/>
    </v-dialog>

    <v-dialog
      v-model="verifyDialog"
      max-width="500"
    >
      <verify-dialog v-if="verifyDialog" @close="verifyDialog=false" @submit="verifyReservation" />
    </v-dialog>

    <v-app-bar
      :style="{
        borderBottom: (stickyAppBar || !isHome) ? 'thin solid rgba(0, 0, 0, 0.12)' : ''
      }"
      flat
      clipped-left
      fixed
      :dark="!(stickyAppBar || !isHome)"
      :color="(stickyAppBar || !isHome) ? '#fff' : '#0007'"
      height="66px"
    >
      <v-scroll-x-reverse-transition>
        <v-avatar v-show="stickyAppBar || isMobile || !isHome" tile class="ms-n3">
          <v-img eager :src="info.logo" width="85px" />
        </v-avatar>
      </v-scroll-x-reverse-transition>
      <v-scroll-x-reverse-transition>
        <v-toolbar-title v-show="stickyAppBar || isMobile || !isHome">
          <h1 class="text-body-1 text-sm-h6 ms-2">
            <NuxtLink
              class="nuxt-link"
              :to="
              localePath('index') +
              ($store.state.club.isActive
              ? `?${$store.state.info.authStrategy.param}=${$store.state.club.key}`
              : '')
              "
            >
              {{chosenHotelTitle}}
            </NuxtLink>
          </h1>
        </v-toolbar-title>
      </v-scroll-x-reverse-transition>
      <v-spacer></v-spacer>
      <v-chip class="ms-2" outlined label v-if="$store.state.club.hasCredit">
        <v-icon class="me-2">mdi-cash</v-icon>
        {{$store.getters['club/remainingCredit'] | thousandify}} {{translatedCurrency}}
      </v-chip>
      <v-chip class="ms-2" outlined label v-if="!isMobile && clubUsername">
        <v-icon class="me-2">mdi-account</v-icon>
        {{clubUsername}}
      </v-chip>
      <v-btn v-if="false" icon class="ms-1" @click="verifyDialog = true">
        <v-icon>mdi-text-box-check-outline</v-icon>
      </v-btn>
      <v-menu v-if="false" eager bottom nudge-bottom="56">
        <template #activator="{ on, attrs }">
          <v-btn icon class="me-n3 ms-1" v-on="on" v-bind="attrs">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list dense class="py-0">
          <v-list-item
            v-for="locale in $i18n.locales"
            :key="locale.code"
            link
            :to="switchLocalePath(locale.code)"
          >
            <v-list-item-action class="me-4">
              <v-img eager width="35px" :src="`/locales/${locale.code}.png`" />
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{locale.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main
      :class="{
        'mt-14': !isHome,
        'pt-3': !isHome
      }"
      :style="{
        'min-height': isHome ? '70vh' : 'calc(70vh - 68px)'
      }"
    >
      <NuxtChild />
    </v-main>

    <v-footer color="secondary">
      <v-container>
        <v-row align="center">
          <v-col cols="auto">
            <v-img :src="info.logo" width="70px" />
          </v-col>
          <v-col cols="auto">
            <h3 class="font-weight-bold text-h5">
              {{chosenHotelTitle}}
            </h3>
          </v-col>
        </v-row>
        <v-row justify="space-between">
          <v-col cols="12" md="12" lg="5">
            <p class="text-h6 font-weight-bold">{{$t('About Us')}}</p>
            <p class="text-justify">{{chosenHotelDescription}}</p>
          </v-col>
          <v-col cols="12" md="6" lg="3">
            <p class="text-h6 font-weight-bold">{{$t('Contact Us')}}</p>
            <v-list flat color="#0000" class="py-0">
              <v-list-item
                v-for="(item,idx) in footerItems.filter(i => i.show)"
                :key="idx"
                color="#0000"
                class="px-1 mb-1"
                :ripple="false"
                v-on="item.on"
                v-bind="item.attrs"
              >
                <v-list-item-action class="me-4">
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-item-action>
                <v-list-item-content class="font-weight-medium">
                  {{item.content}}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" md="6" lg="4">
            <p class="text-h6 font-weight-bold">{{$t('Map')}}</p>
            <v-card class="overflow-hidden" outlined flat>
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
                          <a :href="`geo:${hotel.info.hotel.latitude},${hotel.info.hotel.longitude}`" target="_blank" rel="follow">
                            {{(info.chain ? hotel.info.hotel.name : info.title)[$i18n.locale]}}
                          </a>
                        </l-popup>
                      </l-marker>
                    </template>
                  </l-map>
                </client-only>
              </v-responsive>
            </v-card>
          </v-col>
        </v-row>
        <v-row justify="space-between" align="center">
          <v-col cols="auto">
            <div>
              <p class="py-0 my-0" v-html="copyrightMessage"></p>
            </div>
            <div>
              <p class="py-0 my-0">
                {{$t('Powered By')}}
                <a
                  class="primary--text links font-weight-bold"
                  href="https://lamasoo.com/"
                  target="_blank"
                  rel="follow"
                >{{$t('Lamasoo')}}</a>
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>

  </div>
</template>

<script>
import { mapState } from "vuex"

import { isRtl } from "~/plugins/i18n"

import PWADialog    from "~/components/core/layouts/pwa-dialog"
import VerifyDialog from "~/components/core/layouts/verify-dialog"

import getCoordCenter from "~/util/functions/get-coord-center.js"
import TRANSLATE_CURRENCY from "~/util/translations/translate-currency"

import gsc from "~/util/options/gsc"

import { version } from "~/package.json"

export default {
  middleware: 'club',
  head() {
    let engineUrl = this?.info?.hostName || '';
    let engineConfigId = this?.info?.id || '';
    return {
      titleTemplate: `${
        (!this?.info?.chain
        ? this?.info?.title
        : (this?.hotelsDic?.[this.$route.query?.hotel]?.info?.hotel?.name || this?.info?.title))?.[this.$i18n.locale] || ''
        || this.$t('Booking Engine Service')
      } - %s`,
      link: [
        { rel: 'manifest' , href: this?.info?.meta?.siteManifestUrl },
      ],
      meta: [
        { name: 'google-site-verification', content: gsc[engineUrl] },
      ],
    }
  },
  mounted() {
    this.pwaPrompt()
    this.$nextTick(this.fitMap)
  },
  data: () => ({
    pwaDialog: false,
    verifyDialog: false,
    userAgent: '',
    version,
  }),
  jsonld() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      "name" : this.chosenHotelTitle,
      "description" : this.chosenHotelDescription,
      "address" : this.address,
      "telephone" : this.phoneNumber,
      "starRating" : {
        "@type" : "Rating",
        "ratingValue" : this.chosenHotelStars
      }
    };
  },
  components: { 'pwa-dialog': PWADialog, VerifyDialog },
  methods: {
    async pwaPrompt() {
      let isPWA     = window.matchMedia('(display-mode: standalone)').matches || this.$store.state.pwaPrompt;
      if(!isPWA && !this.$store.state.pwaPromptSeen) {
        let isIOS     = !!navigator.platform.match(/iPhone|iPod|iPad/);
        let isAndroid = /(android)/i.test(navigator.userAgent);
        this.userAgent = (isIOS && 'ios') || (isAndroid && 'android') || ''
        this.pwaDialog = (this.userAgent != '');
        this.$store.commit('setPwaPrompt', true)
      }
    },
    async fitMap() {
      if(this.pinsGroup.some(i => (i == null))) {
        return false
      }
      else if(this.pinsGroup.length == 1) {
        this.$refs.myMap.mapObject.setView(this.pinsGroup[0], 13);
      }
      else {
        const L = await import('leaflet')
        this.$refs.myMap.mapObject.fitBounds(L.latLngBounds(this.pinsGroup));
      }
    },
    verifyReservation({ national_code, reference_id }) {
      this.$router.push({
        path: this.localePath('index-verify'),
        query: {
          national_code,
          reference_id,
        }
      })
      this.verifyDialog = false
    }
  },
  computed: {
    ...mapState(['info','colors', 'hotelsDic', 'offsetTop']),
    clubUsername() {
      return this.$store.state.club?.userInfo?.firstName?.[this.$i18n.locale]
      && this.$store.state.club?.userInfo?.lastName?.[this.$i18n.locale]
      && `${this.$store.state.club.userInfo.firstName[this.$i18n.locale]} ${this.$store.state.club.userInfo.lastName[this.$i18n.locale]}`
    },
    translatedCurrency() {
      return TRANSLATE_CURRENCY['IRR']
    },
    copyrightMessage() {
      switch (this.$i18n.locale) {
        case 'fa':
          return `
            &copy;
            ${this.$moment().format('jYYYY')},
            تمامی حقوق متعلق به
            ${this.info.title[this.$i18n.locale]}
            می‌باشد.
          `
        case 'en':
        default:
          return `
            Copyright
            &copy;
            ${this.$moment().format('YYYY')}
            ${this.info.title[this.$i18n.locale]},
            All Rights Reserved
          `
      }
    },
    isHome() {
      return !!this?.$route?.name?.includes?.('index___')
    },
    isMobile() {
      return ['xs','sm'].includes(this.$vuetify.breakpoint.name)
    },
    stickyAppBar() {
      return (this.offsetTop > 20)
    },
    pinsGroup() {
      return Object.values(this.hotelsDic).map(i => {
        let hotel = i?.info?.hotel
        if(!hotel?.latitude && !hotel?.longitude) {
          return null
        }
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
    phoneNumber() {
      return Object.values(this.hotelsDic)?.[0]?.info?.hotel?.phone || ''
    },
    address() {
      return Object.values(this.hotelsDic)?.[0]?.info?.hotel?.street || ''
    },
    chosenHotel() {
      return this.hotelsDic[this.$route.query.hotel]
    },
    chosenHotelTitle() {
      return (!this.info.chain ? this.info.title : (this.chosenHotel?.info?.hotel?.name || this.info.title))?.[this.$i18n.locale] || ''
    },
    chosenHotelDescription() {
      return (!this.info.chain ? this.info.description : (this.chosenHotel?.info?.hotel?.desc || this.info.description))?.[this.$i18n.locale] || ''
    },
    chosenHotelNumber() {
      return this.chosenHotel?.info?.hotel?.phone || ''
    },
    chosenHotelAddress() {
      return this.chosenHotel?.info?.hotel?.street || ''
    },
    chosenHotelStars() {
      if(!this.info.chain) {
        return Object.values(this.hotelsDic)[0]?.info?.hotel?.star || false
      }
      else if(this.chosenHotel) {
        return this.chosenHotel?.info?.hotel?.star || false
      }
      return false
    },
    footerItems() {
      return [
        {
          show: !!this.info.email,
          icon: 'mdi-at',
          content: this.info.email,
          on: {},
          attrs: {
            link: true,
            href: `mailto:${this.info.email}`
          }
        },
        {
          show: !!this.info.website,
          icon: 'mdi-web',
          content: this.info.website,
          on: {},
          attrs: {
            link: true,
            href: `http://${this.info.website}`,
            rel: "follow",
            target: "_blank",
          }
        },
        {
          show: !!(!this.info.chain ? this.phoneNumber : this.chosenHotelNumber),
          icon: 'mdi-phone-classic',
          content: !this.info.chain ? this.phoneNumber : this.chosenHotelNumber,
          on: {},
          attrs: {
            link: true,
            href: `tel:${!this.info.chain ? this.phoneNumber : this.chosenHotelNumber}`
          }
        },
        {
          show: !!(!this.info.chain ? this.address : this.chosenHotelAddress),
          icon: 'mdi-map-marker',
          content: !this.info.chain ? this.address : this.chosenHotelAddress,
          on: {},
          attrs: {}
        },
        {
          show: true,
          icon: 'mdi-text-box-check-outline',
          content: this.$t('Follow Up Reservation'),
          on: {
            click: () => { this.verifyDialog = true }
          },
          attrs: {}
        },
      ]
    }
  },
}
</script>
