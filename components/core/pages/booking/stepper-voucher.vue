<template>
  <div>
    <v-card flat outlined class="my-6">
      <div class="pt-4 d-flex flex-column align-center">
        <check-mark></check-mark>
        <v-card-title class="px-6">{{ $t("Your reservation has been successfully confirmed") }}</v-card-title>
        <v-card-subtitle class="px-6">
          {{ $t("Your booking information can be seen below. You can use this information at checkin.") }}
        </v-card-subtitle>
      </div>
      <v-card-text id="voucher-data-section" class="pb-1">
        <voucher :print="print" :reservation="reservation"></voucher>
      </v-card-text>
    </v-card>
    <v-row justify="end" class="my-n3">
      <v-col cols="6" sm="auto">
        <v-btn
          block
          color="error"
          link
          :to="
            localePath('index') + 
            ($store.state.club.isActive
            ? `?${$store.state.info.authStrategy.param}=${$store.state.club.key}`
            : '')
          "
        >
          <v-icon class="ms-n1 me-1">
            {{$vuetify.rtl ? 'mdi-arrow-right' : 'mdi-arrow-left'}}
          </v-icon>
          {{$t('Return')}}
        </v-btn>
      </v-col>
      <v-col cols="6" sm="auto">
        <v-btn block color="success" @click="printVoucher">
          <v-icon class="ms-n1 me-1">mdi-printer</v-icon>
          {{$t('Print')}}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import CheckMark from '~/components/core/pages/booking/animated-checkmark.vue'
import Voucher from '~/components/core/pages/booking/voucher.vue'

import TRANSLATE_CURRENCY from "~/util/translations/translate-currency";

import { VERIFY_RESERVATION } from "~/api";

export default {
  props: {
    reservation: {
      type: Object,
      default: {}
    },
    currency: {
      type: String,
      default: 'IRR'
    },
    hotel: {
      type: String,
      default: ''
    }
  },
  components: { CheckMark, Voucher },
  data() {
    return {
      print: false,
    }
  },
  methods: {
    printVoucher() {
      try {
        this.print = true;
        this.$nextTick(() => {
          this.$htmlToPaper('voucher-data-section', {
            styles: [
              'https://cdn.jsdelivr.net/npm/vuetify@2.4.0/dist/vuetify.min.css',
              `https://lamasoo.com/fonts/voucher/${this.$i18n.locale}.css`,
            ]
          }, () => {
            this.$nextTick(() => {
              this.print = false;
            })
          });
        })
      } catch (e) {}
    }
  },
  computed: {
    translatedCurrency() {
      return TRANSLATE_CURRENCY[this.currency]
    },
  },
}
</script>