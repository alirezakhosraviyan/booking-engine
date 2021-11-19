<template>
  <v-app v-scroll="updateScroll">

    <div v-html="`<!-- ${version} -->`"></div>

    <nuxt />

    <client-only>
      <notifications
        animation-type="velocity"
        group="default"
        position="bottom left"
      >
        <template v-slot:body="{ item, close }">
          <v-alert
            class="mx-3 cursor-pointer"
            dark
            border="left"
            :color="item.type"
            :icon="item.type | notificationIcon"
            @click="close"
          >
            {{$t(item.text)}}
          </v-alert>
        </template>
      </notifications>
    </client-only>

  </v-app>
</template>

<script>
import { mapState } from "vuex"

import { isRtl } from "~/plugins/i18n"

import { version } from "~/package.json"

export default {
  head() {
    let engineConfigId = this?.info?.hostName || ''
    return {
      meta: [
        { content: this.info.description[this.$i18n.locale] , name: 'description' , hid: 'description'      },
        { content: this.colors.primary                      , name: 'msapplication-TileColor'               },
        { content: this.colors.primary                      , name: 'theme-color'                           },
      ],
      link: [
        { rel: 'icon'             , type: 'image/x-icon'                    , href: this?.info?.meta?.favIconUrl         },
        { rel: 'icon'             , type: 'image/png'    , sizes: '32x32'   , href: this?.info?.meta?.favIcon32x32Url    },
        { rel: 'icon'             , type: 'image/png'    , sizes: '16x16'   , href: this?.info?.meta?.favIcon16x16Url    },
        { rel: 'apple-touch-icon'                        , sizes: '180x180' , href: this?.info?.meta?.appleTouchIconUrl  },
        { rel: 'mask-icon'                                                  , href: this?.info?.meta?.safariPinnedTabUrl },
      ]
    }
  },
  mounted() {
    this.setColors()
    this.setLocale()
    this.updateScroll()
  },
  data: () => ({ version }),
  computed: mapState(['info','colors', 'hotelsDic']),
  methods: {
    async setColors() {
      this.$vuetify.theme.themes.light.primary   = this.$store.state.colors.primary
      this.$vuetify.theme.themes.light.accent    = this.$store.state.colors.accent
      this.$vuetify.theme.themes.light.secondary = this.$store.state.colors.secondary
      this.$vuetify.theme.themes.light.info      = this.$store.state.colors.info
      this.$vuetify.theme.themes.light.warning   = this.$store.state.colors.warning
      this.$vuetify.theme.themes.light.error     = this.$store.state.colors.error
      this.$vuetify.theme.themes.light.success   = this.$store.state.colors.success
      this.$nextTick(() => {
        let i = this.$vuetify.theme.themes.light;
        this.$vuetify.theme.themes.light = {}
        this.$vuetify.theme.themes.light = i;
      })
    },
    async setLocale() {
      this.$vuetify.lang.current = this.$i18n.locale
      this.$vuetify.rtl = isRtl(this.$i18n.locale, this.$i18n)
    },
    updateScroll() {
      this.$store.commit(
        'setOffsetTop',
        (window.pageYOffset || document.documentElement.scrollTop),
      )
    },
  },
  filters: {
    notificationIcon(type) {
      switch (type) {
        case 'error'   : return 'mdi-close-thick'
        case 'warning' : return 'mdi-exclamation-thick'
        case 'success' : return 'mdi-check-bold'
        case 'info'    : return 'mdi-information-outline'
        default        : return 'mdi-help'
      }
    },
  },
};
</script>
