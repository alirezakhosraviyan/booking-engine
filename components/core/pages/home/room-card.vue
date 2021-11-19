<template>
  <v-skeleton-loader
    v-if="loading"
    type="image, article, actions"
  />
  <v-card v-else flat outlined :rounded="false">
    <div
      class="carousel-img"
      :style="`background-image: url(${ $options.filters.getMainImg(room) || ''})`"
      role="img"
      :alt="room.title[$i18n.locale]"
      :title="room.title[$i18n.locale]"
    >
    </div>
    <v-card-title>{{room.title[$i18n.locale]}}</v-card-title>
    <v-card-actions class="px-4 pb-4">
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        :data-room-type="room.title.en"
        :data-hotel="hotelTitle"
        class="g-add-to-cart"
        @click="$emit('add-to-cart', room._id)"
      >
        {{$t('Make a Reservation')}}
      </v-btn>
      <v-spacer></v-spacer>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  filters: {
    getMainImg(room) {
      return room?.images?.main?.url;
    }
  },
  props: {
    room: {
      type: Object
    },
    loading: {
      type: Boolean
    },
    hotelTitle: {
      type: String
    }
  },
};
</script>

<style lang="scss">
.carousel-img {
  background-color: var(--v-secondary-darken1);
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 0;
  padding-bottom: 62.5%;
}
</style>