<template>
  <div>
    <v-dialog v-model="termsDialog" scrollable max-width="500">
      <terms-and-conditions
        @agree="termsDialog=false;$emit('proceed-to-payment', {
          martyrGang: isMartyrGang,
          other: specialRequest,
        });"
        @decline="termsDialog=false"
      />
    </v-dialog>
    <v-card flat outlined class="my-6">
      <v-card-title class="px-6">{{ $t('Confirmation') }}</v-card-title>
      <v-card-text class="px-6">
        <span class="font-weight-bold black--text">
          {{$t('Reservation Date')}}:
        </span>
        {{dateRange}}
      </v-card-text>
      <v-card-text class="px-6">
        <v-data-table
          :loading="loading"
          loader-height="3px"
          class="elevation-0 v-sheet--outlined mb-3 overflow-hidden"
          disable-filtering
          disable-pagination
          disable-sort
          hide-default-footer
          :items="loading ? [] : priceDetails"
          :headers="headers"
        >
          <template #item.roomType="{ item }">
            {{
              hotelsDic[hotel] &&
              hotelsDic[hotel].rooms &&
              hotelsDic[hotel].rooms[item.id] &&
              hotelsDic[hotel].rooms[item.id].title &&
              hotelsDic[hotel].rooms[item.id].title[$i18n.locale]
            }}
          </template>
          <template #item.guest="{ item }">
            {{ firstGuestName(item) }}
          </template>
          <template #item.party.children="{ item }">
            {{ item.party.children.length }}
          </template>
          <template #item.price="{ item }">
            {{ item.price | thousandify }}
          </template>
          <template #item.extra_price="{ item }">
            {{ item.extra_price | thousandify }}
          </template>
          <template #item.finalPrice="{ item }">
            {{ (item.price + item.extra_price) | thousandify }}
          </template>

          <template v-slot:body.append="{ isMobile, headers: { length } }">
            <template v-if="submitData.discount">
              <tr v-if="isMobile" class="v-data-table__mobile-table-row black--text">
                <td class="v-data-table__mobile-row">
                  <div class="v-data-table__mobile-row__header" style="background-color: var(--v-primary-lighten3)">{{$t('Discount')}}</div>
                  <div class="v-data-table__mobile-row__cell" style="background-color: var(--v-primary-lighten3)">
                    {{
                      submitData.discount | thousandify
                    }}
                  </div>
                </td>
              </tr>
              <tr v-else class="black--text">
                <td :colspan="length - 1" class="font-weight-bold black--text" style="background-color: var(--v-primary-lighten3)">
                  {{$t('Discount')}}
                </td>
                <td style="background-color: var(--v-primary-lighten3)">
                  {{
                    submitData.discount | thousandify
                  }}
                </td>
              </tr>
            </template>
            <tr v-if="isMobile" class="v-data-table__mobile-table-row white--text sum-row">
              <td class="v-data-table__mobile-row sum-row">
                <div class="v-data-table__mobile-row__header sum-row">{{$t('Total Price')}}</div>
                <div class="v-data-table__mobile-row__cell sum-row">
                  {{
                    submitData.price_to_pay | thousandify
                  }}
                </div>
              </td>
            </tr>
            <tr v-else class="white--text sum-row">
              <td :colspan="length - 1" class="font-weight-bold white--text sum-row">
                {{$t('Total Price')}}
              </td>
              <td class="sum-row">
                {{
                  submitData.price_to_pay | thousandify
                }}
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-text class="px-6 pb-6 pt-2">
        <v-row>
          <v-col cols="12" md="5">
            <v-checkbox
              class="ma-0 pa-0"
              v-model="earlyCheckin"
              :label="$t('I require early check-in')"
            />
            <v-checkbox
              class="ma-0 pa-0"
              v-model="lateCheckout"
              :label="$t('I require late check-out')"
            />
            <v-checkbox
              v-if=" 
                ($i18n.locale == 'fa') &&
                [
                  'booking.kosarhotels.com',
                  'howeyzeh.com',
                  'samen-hotel.ir',
                  'sefidkenar.ir',
                ].includes($store.state.info.hostName)
              "
              class="ma-0 pa-0"
              v-model="isMartyrGang"
              label="عضو خانواده‌ی محترم شهدا و از اعضای بنیاد شهید هستم"
            />
            <v-row dense>
              <v-col cols="">
                <v-text-field
                  clearable
                  :label="$t('Promotion Code')"
                  clear-icon="mdi-close"
                  prepend-inner-icon="mdi-percent"
                  @click:clear="rescindPromoCode"
                  outlined
                  dense
                  hide-details
                  v-model="promoCode"
                ></v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-btn height="40" color="info" @click="submitPromoCode">
                  {{$t('Apply')}}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="7">
            <v-textarea
              v-model="specialRequest"
              prepend-inner-icon="mdi-text"
              :label="$t('Special Requests')"
              auto-grow
              class="h-100"
              outlined
              hide-details
              dense
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card v-if="false" flat outlined class="mb-6">
      <v-card-title class="px-6">{{ $t('Payment') }}</v-card-title>
      <v-card-subtitle class="px-6">{{ $t('Please choose a form of payment') }}</v-card-subtitle>
      <v-card-text class="px-6">
        <v-item-group v-model="paymentMethod">
          <v-row justify="center">
            <v-col cols="12" sm="6" md="3" v-for="(pm,idx) in paymentMethods" :key="idx">
              <v-item v-slot="{ active, toggle }" :value="pm.value">
                <v-card
                  :class="{ 'active-item': active }"
                  flat
                  outlined
                  @click="active ? '' : toggle()"
                  :disabled="loading"
                >
                  <div class="d-flex flex-column align-center">
                    <img
                      :src="`/payment/${pm.value}.svg`"
                      :alt="pm.title"
                      style="height:60px"
                      class="pa-0 ma-3"
                    >
                    <v-card-title class="pa-0 mx-3 mb-3 justify-center">
                      {{pm.title}}
                    </v-card-title>
                  </div>
                </v-card>
              </v-item>
            </v-col>
          </v-row>
        </v-item-group>
      </v-card-text>
    </v-card>
    <v-row align="center" justify="end" class="my-n3">
      <v-col cols="6" sm="auto">
        <v-btn block color="success" :disabled="totalIsMoreThanCredit" @click="termsDialog=true" id="g-go-to-payment">
          <v-icon class="ms-n1 me-1">mdi-check</v-icon>
          {{$t('Pay')}}
        </v-btn>
      </v-col>
      <v-col cols="6" sm="auto">
        <v-btn block color="error" @click="$emit('go-back')">
          <v-icon class="ms-n1 me-1">
            {{$vuetify.rtl ? 'mdi-arrow-right' : 'mdi-arrow-left'}}
          </v-icon>
          {{$t('Return')}}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex"

import TermsAndConditions from "~/components/core/pages/booking/terms-and-conditions";

export default {
  components: { TermsAndConditions },
  props: {
    submitData: {
      type: Object,
      default: {},
    },
    hotelsDic: {
      type: Object,
      default: {},
    },
    hotel: {
      type: String,
      default: '',
    }
  },
  computed: {
    ...mapState("avail", ["loading"]),
    priceDetails() {
      return this.submitData.rooms;
    },
    outputDateFormat() {
      return (this.$i18n.locale == 'fa') ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD'
    },
    dateRange() {
      return `
        ${this.$moment(this.$route.query.checkinDate).format(this.outputDateFormat)}
        ${this.$t('To')}
        ${this.$moment(this.$route.query.checkoutDate).format(this.outputDateFormat)}
      `
    },
    totalIsMoreThanCredit() {
      return this.$store.state.club.hasCredit &&  (this.submitData.price_to_pay > this.$store.getters['club/remainingCredit'])
    }
  },
  watch: {
    totalIsMoreThanCredit(to, from) {
      if(to)
        this.$notify({
          group: 'default',
          text: 'Your cart total is more than your remaining credit',
          type: 'warning',
          duration: 5000,
        })
    }
  },
  methods: {
    firstGuestName(room) {
      return `${(room?.guests?.[0]?.first_name || this.submitData.customer.first_name)} ${(room?.guests?.[0]?.last_name || this.submitData.customer.last_name)}`
    },
    submitPromoCode() {
      this.$emit('apply-promo', this.promoCode)
    },
    rescindPromoCode() {
      this.$emit('rescind-promo', this.promoCode)
      this.promoCode = ''
    },
  },
  data() {
    return {
      isMartyrGang: false,
      earlyCheckin: false,
      lateCheckout: false,
      specialRequest: "",
      termsDialog: false,
      paymentMethod: null,
      promoCode: '',
      headers: [
        { text: this.$t('Room')            , value: 'roomType'        },
        { text: this.$t('Guest Name')      , value: 'guest'           },
        { text: this.$t('Adults')          , value: 'party.adults'    },
        { text: this.$t('Children')        , value: 'party.children'  },
        { text: this.$t('Price')           , value: 'price'           },
        { text: this.$t('Extra Bed Price') , value: 'extra_price'     },
        { text: this.$t('Total Price')     , value: 'finalPrice'      },
      ],
      paymentMethods: [
        {
          title: this.$t('Pasargad Portal'),
          value: 'pasargad',
        },
        {
          title: this.$t('Visa'),
          value: 'visa',
        },
      ]
    }
  },
  watch: {
    earlyCheckin(to) {
      this.$emit('set-early-checkin', to)
    },
    lateCheckout(to) {
      this.$emit('set-late-checkout', to)
    },
  },
};
</script>

<style lang="scss" scoped>
.active-item {
  position: relative;
  border-color: var(--v-info-lighten2) !important;
}

.sum-row {
  background-color: var(--v-primary-darken1) !important;
}
</style>
