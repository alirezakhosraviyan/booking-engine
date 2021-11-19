<template>
  <v-card elevation="1">
    <v-card-title>{{$t('Hotels')}}</v-card-title>
    <v-card-subtitle>{{$t('In this section, you can edit your hotels\' information')}}</v-card-subtitle>
    <v-card-text>
      <v-data-table
        class="elevation-1"
        :search="search"
        hide-default-footer
        disable-pagination
        disable-sort
        disable-filtering
        :items="Object.values(hotelsDic)"
        :headers="headers"
      >
        <template v-slot:item.info.hotel.name="{ item, value }">
          {{ value[$i18n.locale] }}
        </template>
        <template v-slot:item.info.hotel.email="{ item, value }">
          {{ value }}
        </template>
        <template v-slot:item.actions="{ item, value }">
          <v-btn icon link :to="localePath({ name: 'admin-hotel-id-slider', params: { id: item.info.hotel._id } })">
            <v-icon size="20">mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  validate({ store, redirect, app: { localePath } }) {
    if (!store.state.info.chain) {
      redirect(localePath({ name: 'admin-hotel-id-slider', params: { id: Object.keys(store.state.hotelsDic)[0] } }))
    }
    return true;
  },
  head() {
    return {
      title: this.$t("Hotels"),
    };
  },
  data() {
    return {
      search: '',
      headers: [
        { text: this.$t("Title")        , value: "info.hotel.name"    },
        // { text: this.$t("Email")        , value: "info.hotel.email"   },
        // { text: this.$t("Website")      , value: "info.hotel.website" },
        // { text: this.$t("Phone Number") , value: "info.hotel.phone"   },
        { text: this.$t("Actions")      , value: "actions"            , align: 'left' },
      ],
    };
  },
  computed: {
    ...mapState(["hotelsDic"]),
  },
};
</script>