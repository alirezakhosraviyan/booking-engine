<template>
  <div>

    <v-app-bar
      app
      class="app-bar"
      :elevation="loggedIn ? 1 : 0"
      :color="loggedIn ? 'secondary': '#0000'"
    >
      <v-row align="center" dense class="mx-n3">
        <v-col cols="auto" v-if="loggedIn">
          <v-btn @click.stop="drawer = !drawer" icon>
            <v-icon v-text="'mdi-menu'" />
          </v-btn>
        </v-col>
        <v-col cols="auto ps-1" v-if="loggedIn" class="d-none d-md-block">
          <v-toolbar-title v-text="$t('Booking Engine Management')" />
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" v-if="true">
          <v-menu eager bottom nudge-bottom="56">
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
        </v-col>
        <v-col cols="auto" v-if="loggedIn">
          <v-btn icon @click="$auth.logout('local')">
            <v-icon :class="{ 'mdi-rotate-180': $vuetify.rtl }">mdi-logout-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-app-bar>

    <v-navigation-drawer
      v-if="loggedIn"
      :mini-variant="!isMobile && !drawer"
      :value="isMobile ? drawer : true"
      @input="drawer = $event"
      app
      :right="$vuetify.rtl"
    >
      <template v-slot:prepend>
        <v-list-item style="height:63px" class="px-0">
          <v-list-item-action :style="`margin-${ $vuetify.rtl ? 'right' : 'left' }:6px`" class="me-0 my-2">
            <v-img
              width="43px"
              class="mx-auto"
              :src="info.logo"
            />
          </v-list-item-action>
          <v-list-item-content class="my-2 py-0 ms-6 me-n6">
            <v-list-item-title class="text-h6">{{info.title[$i18n.locale]}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
      </template>
      <v-list class="py-0">
        <nav-list-item v-for="(item,idx) in menuItems" :tooltip="!drawer" :item="item" :key="idx" />
      </v-list>
      <template v-slot:append v-if="isMobile">
        <v-divider></v-divider>
        <nav-list-item @click="drawer=false" :tooltip="!drawer" :item="menuCloseItem" />
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container class="h-100 px-6 py-6">
        <NuxtChild />
      </v-container>
    </v-main>

  </div>
</template>

<script>
import { mapState } from "vuex"

import NavListItem from "~/components/admin/core/nav-list-item"

export default {
  middleware: 'auth',
  transition(to, from) {
    try {

      let toName = to?.name
      toName = toName?.substring?.(toName?.length - 2)

      let fromName = from?.name
      fromName = fromName?.substring?.(fromName?.length - 2)

      if(toName && fromName && (toName != fromName))
        return ''

    } catch(e) {}

    return 'fade-transition'

  },
  head() {
    let engineConfigId = this?.info?.id || '';
    return {
      changed: ({ titleChunk }) => {
        this.pageTitle = titleChunk;
      },
      title: this.$t('Administration'),
      titleTemplate: `${this.$t('Booking Engine Management')} - %s`,
      link: [
        { rel: 'manifest' , href: this?.info?.meta?.adminWebmanifestUrl },
      ]
    }
  },
  data() {
    return {
      pageTitle: '',
      drawer: false,
      menuItems: [
        {
          group: false,
          show: true,
          link: "admin-colors",
          title: "Colors",
          icon: "mdi-palette-outline",
        },
        {
          group: false,
          show: true,
          link: "admin-info",
          title: "Primary Information",
          icon: "mdi-information-outline",
        },
        {
          group: false,
          show: true,
          link: "admin-promotions",
          title: "Promotions",
          icon: "mdi-percent-outline",
        },
        {
          group: false,
          show: true,
          link: "admin-hotel",
          title: this.$store.state.info.chain ? "Hotels" : "Hotel",
          icon: "mdi-city-variant-outline",
        },
      ],
      menuCloseItem: {
        show: true,
        group: false,
        icon: `mdi-arrow-right-circle-outline mdi-rotate-${ this.$vuetify.rtl ? 0 : 180 }`,
        title: 'Return',
        on: { click: () => { this.drawer = false } },
      }
    }
  },
  computed: {
    ...mapState(['info','colors']),
    isMobile() {
      return ['xs', 'sm', 'md'].includes(this.$vuetify.breakpoint.name)
    },
    loggedIn() {
      return this.$auth?.loggedIn
    }
  },
  components: { NavListItem },
};
</script>
