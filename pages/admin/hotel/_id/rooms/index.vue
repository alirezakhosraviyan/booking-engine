<template>
  <div>
    <v-card-title class="black--text pa-2">{{$t('Rooms')}}</v-card-title>
    <v-card-text class="pa-2 pb-0">
      <v-row v-if="true">
        <v-col
          v-for="(room,idx) in hotelsDic[id].rooms"
          :key="idx"
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            elevation="1"
            class="rounded"
          >
            <div class="p-relative overflow-hidden">
              <v-img class="secondary" :src="
              room &&
              room.images &&
              room.images.main &&
              room.images.main.url
              " :aspect-ratio="8/5" />
              <div class="overlay d-flex flex-column actions">
                <div class="mt-auto px-3">
                  <v-row align="center" justify="space-between" dense>
                    <v-col cols="auto">
                      <v-card-title class="white--text">
                        {{ room.title[$i18n.locale] }}
                      </v-card-title>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn icon color="white" link :to="localePath({ name: 'admin-hotel-id-rooms-room-images', params: { id, room: room._id } })">
                        <v-icon>
                          mdi-image-multiple-outline
                        </v-icon>
                      </v-btn>
                      <v-btn v-if="false" icon color="white" link :to="localePath({ name: 'admin-hotel-id-rooms-room-info', params: { id, room: room._id } })">
                        <v-icon>
                          mdi-information-outline
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  head() {
    return {
      title: this.$t('Rooms')
    }
  },
  asyncData({ params }) {
    return { id: params.id }
  },
  computed: mapState(['hotelsDic']),
}
</script>

<style lang="scss" scoped>
.actions {
  background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%);
}
</style>