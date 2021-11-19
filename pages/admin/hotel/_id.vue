<template>
  <div>
    <v-card-title class="px-0 pt-0" v-if="info.chain">
      {{hotelTitle}}
    </v-card-title>

    <v-card class="rounded-md" elevation="1">
      <v-tabs background-color="primary" dark class="rounded-t-md">
        <template v-for="(tab,idx) in tabs">
          <v-tab
            v-show="tab.show"
            :key="idx"
            link
            :to="localePath({ name: tab.link, params: { id } })"
          >
            <v-icon class="me-2" v-text="tab.icon" />
            <span>{{tab.title}}</span>
          </v-tab>
        </template>
      </v-tabs>
      <v-card-text>
        <NuxtChild/>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  validate({ store, params, redirect, app: { localePath } }) {
    if(Object.keys(store.state.hotelsDic).includes(params.id)) {
      return true
    }
    redirect(localePath('admin-colors'))
  },
  asyncData({ params }) {
    return {
      id: params.id
    }
  },
  data() {
    return {
      tabs: [
        {
          show: true,
          link: `admin-hotel-id-slider`,
          icon: 'mdi-image-multiple-outline',
          title: this.$t('Slider'),
        },
        {
          show: true,
          link: `admin-hotel-id-facilities`,
          icon: 'mdi-star-outline',
          title: this.$t('Facilities'),
        },
        {
          show: true,
          link: `admin-hotel-id-rooms`,
          icon: 'mdi-door',
          title: this.$t('Rooms'),
        },
        {
          show: true,
          link: `admin-hotel-id-logo`,
          icon: 'mdi-file-image',
          title: this.$t('Logo'),
        },
        {
          show: false,
          link: `admin-hotel-id-information`,
          icon: 'mdi-information-outline',
          title: this.$t('Primary Information'),
        },
      ]
    }
  },
  computed: {
    ...mapState(["hotelsDic", "info"]),
    hotelTitle() {
      return this.hotelsDic?.[this.id]?.info?.hotel?.name?.[this.$i18n.locale]
    }
  },
}
</script>
