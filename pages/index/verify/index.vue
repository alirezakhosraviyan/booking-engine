<template>
  <v-container class="h-100">
    <v-dialog max-width="500" v-model="cancelDialog">
      <v-card>
        <v-card-title>{{$t('Reservation Cancellation')}}</v-card-title>
        <v-card-subtitle>{{$t('Are you sure you want to cancel this reservation?')}}</v-card-subtitle>
        <v-card-actions class="px-4 pt-0">
          <v-row justify="end" dense>
            <v-col cols="6" sm="6" md="auto">
              <v-btn block color="info" @click="cancelDialog=false">
                <v-icon class="d-none d-sm-block ms-n1 me-1">
                  {{$vuetify.rtl ? 'mdi-arrow-right' : 'mdi-arrow-left'}}
                </v-icon>
                {{$t('Return')}}
              </v-btn>
            </v-col>
            <v-col cols="6" sm="6" md="auto">
              <v-btn block color="error" @click="cancelReservation();cancelDialog=false">
                <v-icon class="d-none d-sm-block ms-n1 me-1">mdi-close</v-icon>
                {{$t('Cancel Reservation')}}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <template v-if="loading">
      <v-row>
        <v-col cols="12" md="6">
          <v-card outlined flat>
            <v-skeleton-loader flat type="table-heading, list-item@4"></v-skeleton-loader>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card outlined flat>
            <v-skeleton-loader flat type="table-heading, list-item@4"></v-skeleton-loader>
          </v-card>
        </v-col>
        <v-col cols="12">
          <v-card outlined flat>
            <v-skeleton-loader flat type="table-heading, list-item@3"></v-skeleton-loader>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <template v-else-if="error">
      <div class="h-100 d-flex flex-column align-center justify-center">
        <cross-mark></cross-mark>
        <v-card-title>
          {{$t('A reservation with the given reference number was not found')}}
        </v-card-title>
        <NuxtLink
          class="links primary--text"
          :to="
            localePath('index') +
            ($store.state.club.isActive
            ? `?${$store.state.info.authStrategy.param}=${$store.state.club.key}`
            : '')
          "
        >
          {{$t('Go to Homepage')}}
        </NuxtLink>
      </div>
    </template>
    <template v-else-if="cancelled">
      <div class="h-100 d-flex flex-column align-center justify-center">
        <check-mark></check-mark>
        <v-card-title>
          {{$t('Your resetvation was successfully cancelled')}}
        </v-card-title>
        <NuxtLink
          class="links primary--text"
          :to="
            localePath('index') +
            ($store.state.club.isActive
            ? `?${$store.state.info.authStrategy.param}=${$store.state.club.key}`
            : '')
          "
        >
          {{$t('Go to Homepage')}}
        </NuxtLink>
      </div>
    </template>
    <template v-else>
      <v-card-title class="black--text h5 px-0">{{$t('Reservation Verification')}}</v-card-title>
      <div id="voucher-content">
        <voucher :print="print" :reservation="reservation.data" />
      </div>
      <v-row justify="end">
        <v-col cols="" sm="6" md="auto">
          <v-btn block color="error" @click="cancelDialog=true" v-if="reservation.data.payment_method == 'contract'">
            <v-icon class="ms-n1 me-1">
              mdi-close
            </v-icon>
            {{$t('Cancel')}}
          </v-btn>
        </v-col>
        <v-col cols="" sm="6" md="auto">
          <v-btn block color="success" @click="printVoucher">
            <v-icon class="ms-n1 me-1">mdi-printer</v-icon>
            {{$t('Print')}}
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script>
import { mapState } from "vuex"

import Voucher from "~/components/core/pages/booking/voucher"
import CrossMark from "~/components/core/pages/booking/animated-crossmark.vue"
import CheckMark from "~/components/core/pages/booking/animated-checkmark.vue"

import { VERIFY_RESERVATION, CANCEL_RESERVATION } from "~/api";

export default {
  head() {
    return {
      title: this.$t('Verification')
    }
  },
  validate({ redirect, query }) {
    let { reference_id, national_code } = query
    if (reference_id && (national_code && (national_code.length == 10) && !isNaN(national_code)))
      return true;
    redirect("/");
  },
  async fetch() {
    try {
      this.loading = true
      let { reference_id, national_code } = this?.$route?.query
      let { data } = await this.$api.post(VERIFY_RESERVATION, { reference_id, national_code });
      let { hotelId, status } = data.reservation
      if(!(Object.keys(this.hotelsDic).includes(hotelId) && ['CONFIRMED','MODIFIED'].includes(status)))
        this.error = true
      this.$set(this.reservation, 'data', data.reservation)
    } catch (e) {
      this.error = true
    } finally {
      this.loading = false
    }
  },
  data: () => ({
    print: false,
    loading: false,
    error: false,
    cancelled: false,
    cancelDialog: false,
    reservation: { data: {} }
  }),
  computed: mapState(['hotelsDic']),
  methods: {
    async cancelReservation() {
      const { reference_id } = this?.$route?.query;
      try {
        await this.$api.delete(CANCEL_RESERVATION, {
          data: { reference_id, penalty: 0 }
        });
        this.cancelled = true;
      } catch (error) {
        this.$notify({
          group: 'default',
          text: 'A problem occurred while cancelling the reservation. Please try again',
          type: 'error',
          duration: 6000,
        })
      }
    },
    printVoucher() {
      try {
        this.print = true;
        this.$nextTick(() => {
          this.$htmlToPaper('voucher-content', {
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
  watch: {
    '$route.params': '$fetch'
  },
  components: { Voucher, CrossMark, CheckMark },
}
</script>
