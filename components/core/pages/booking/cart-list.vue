<template>
  <div v-if="cartIsEmpty" class="d-flex flex-column align-center py-3">
    <v-icon size="35">mdi-bed-king-outline</v-icon>
    <v-card-subtitle class="justify-center pt-2 pb-0">{{
      $t("You haven't chosen a room yet")
    }}</v-card-subtitle>
  </div>
  <div v-else>
    <template v-for="(room,idx) in cart">
      <v-card flat :key="`card-${idx}`">
        <v-card-title class="text-h6 break-word">
          {{room | roomTitle(hotelsDic, hotel, $i18n.locale)}} <span class="text-caption ms-1">({{room.count}})</span>
        </v-card-title>
        <v-card-text>
          <div class="d-flex flex-row justify-space-between align-end">
            <span>{{room | roomPrice(roomLookup, ratePlans[$store.state.avail.chosenRatePlan]) | thousandify}} {{translatedCurrency}}</span>
            <plus-minus-input v-if="!readonly" :value="room.count" @input="changeCart(room, $event)" :max="room.id | roomsRemaining(roomLookup)"></plus-minus-input>
          </div>
        </v-card-text>
      </v-card>
      <v-divider v-if="idx != (cart.length - 1)" :key="`div-${idx}`"></v-divider>
    </template>
  </div>
</template>

<script>
import PlusMinusInput from "~/components/base/plus-minus-input"
import TRANSLATE_CURRENCY from "~/util/translations/translate-currency"

import { mapGetters, mapState } from "vuex"

export default {
  props: {
    'noActions': {
      type: Boolean,
      default: false
    },
    'readonly': {
      type: Boolean,
      default: false
    },
    hotel: {
      type: String,
      default: '',
    },
    currency: {
      type: String,
      default: 'IRR'
    }
  },
  components: { PlusMinusInput },
  filters: {
    roomTitle(room, hotelsDic, hotel, locale) {
      return hotelsDic?.[hotel]?.rooms?.[room.id]?.title?.[locale] || ''
    },
    roomPrice(room, roomLookup, ratePlan) {
      return (roomLookup?.[room?.id]?.rates?.[ratePlan?.id]?.price?.price_to_pay * room?.count) || ''
    },
    roomsRemaining(id, roomLookup) {
      return roomLookup?.[id]?.info?.rooms_remaining;
    },
  },
  methods: {
    changeCart(room, count) {
      switch (room.count - count) {
        case 1:
          this.$store.commit('avail/removeFromCart', room.id)
          break;
        case -1:
          this.$store.commit('avail/addToCart', room.id)
          break;
      }
    },
  },
  computed: {
    ...mapGetters('avail', ['cartIsEmpty']),
    ...mapState('avail', ['cart', 'roomLookup', 'ratePlans']),
    ...mapState(['hotelsDic']),
    isMobile() {
      return ["xs", "sm"].includes(this.$vuetify.breakpoint.name);
    },
    translatedCurrency() {
      return TRANSLATE_CURRENCY[this.currency]
    }
  }
};
</script>