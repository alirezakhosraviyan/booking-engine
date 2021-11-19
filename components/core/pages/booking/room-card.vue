<template>
  <v-card v-if="roomInfo && finalPrice" flat outlined class="overflow-hidden">
    <v-row no-gutters align="stretch" justify="space-between">
      <v-col cols="12" lg="5">
        <v-carousel
          height="unset"
          reverse
          hide-delimiters
          :show-arrows="images.length > 1"
        >
          <v-carousel-item eager v-for="(img,idx) in images" :key="idx">
            <div
              class="carousel-img"
              :style="`background-image: url(${img && img.url || ''})`"
              role="img"
              :alt="(img && img.caption) || ''"
              :title="(img && img.caption) || ''"
            >
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="12" lg="" class="d-flex justify-space-between flex-column flex-sm-column flex-md-column flex-lg-column flex-xl-column">
        <v-card-title class="break-word text-h6">
          {{roomInfo.title[$i18n.locale]}}
        </v-card-title>
        <v-card-text class="align-self-md-center">
          <v-row class="mb-n3" justify="center" justify-lg="start">
            <v-col class="d-flex flex-column align-center" cols="auto">
              <v-icon size="28" class="pb-2">mdi-account-outline</v-icon>
              <div class="font-weight-bold">
                {{
                  (room.info.capacity == 1)
                  ? $t('1 Person')
                  : $t('__D__ People').replace('__D__', room.info.capacity)
                }}
              </div>
            </v-col>
            <v-col class="d-flex flex-column align-center" cols="auto">
              <v-icon size="28" class="pb-2">mdi-coffee-outline</v-icon>
              <div class="font-weight-bold">{{$t('Breakfast')}}</div>
            </v-col>
            <v-col class="d-flex flex-column align-center" cols="auto">
              <v-icon size="28" class="pb-2">mdi-bed-outline</v-icon>
              <div class="font-weight-bold">
                {{$t((room.info.extra_capacity == 0) ? 'No Extra Bed' : 'Extra Bed')}}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-col>
      <v-col align-self="stretch" cols="12" lg="auto" class="px-4 py-4 d-flex flex-row flex-lg-column align-end align-lg-end justify-space-between">
        <div class="d-flex flex-column align-start align-lg-end justify-end">
          <span class="body-1">
            {{$t('For __NIGHT__ night(s)').replace('__NIGHT__', nights)}}
          </span>
          <span v-if="room.rates[ratePlan].price.price_to_pay < room.rates[ratePlan].price.price">
            <v-chip label rounded small color="error" class="me-2">
              {{room.rates[ratePlan].price | discountPercent}}%
            </v-chip>
            <span class="body-1 text-decoration-line-through error--text">{{room.rates[ratePlan].price.price | thousandify}}</span>
          </span>
          <span class="text-h6">
            {{room.rates[ratePlan].price.price_to_pay | thousandify}}
            <span class="text-subtitle-1">{{translatedCurrency}}</span>
          </span>
        </div>
        <plus-minus-input :value="count" @input="$emit('change-count',$event)" :max="room.info.rooms_remaining"></plus-minus-input>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import TRANSLATE_CURRENCY from "~/util/translations/translate-currency"

import PlusMinusInput from "~/components/base/plus-minus-input"

export default {
  components: { PlusMinusInput },
  props: {
    currency    : { type: String },
    room        : { type: Object },
    dict        : { type: Object },
    ratePlan    : { type: String },
    count       : { type: Number },
    checkinDate : { type: String },
    checkoutDate: { type: String }
  },
  computed: {
    roomInfo() {
      return this.dict[this.room.info.id]
    },
    images() {
      return Object.values(this?.roomInfo?.images || {}).flat().filter(i => i?.url)
    },
    translatedCurrency() {
      return TRANSLATE_CURRENCY[this.currency]
    },
    nights() {
      return this.$moment(this.$route.query.checkoutDate).diff(this.$moment(this.$route.query.checkinDate), 'days');
    },
    finalPrice() {
      return (this.room.rates[this.ratePlan]?.price?.price_to_pay ?? 0)
    }
  },
  filters: {
    hasDiscount(item) {
      return (item?.price != item.price_to_pay)
    },
    discountPercent(item) {
      return (100 - Math.floor(100 * (item.price_to_pay / item?.price)))
    },
  },
};
</script>

<style lang="scss">
.widescreen {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 0;
  padding: 0;
  padding-bottom: 62.5%;
  & > * {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
}
.small-btn {
  min-width: unset !important;
  width: 34px !important;
}

img {
  user-select: none;
}

.details-cell {
  width: 42px;
}

.carousel-img {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 0;
  padding-bottom: 62.5%;
}
</style>
