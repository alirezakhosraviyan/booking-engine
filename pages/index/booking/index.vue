<template>
  <div>
    <v-container class="my-3">
      <v-stepper
        v-model="step"
        class="overflow-visible elevation-0 v-sheet--outlined mb-3"
      >
        <v-stepper-header class="elevation-0">
          <v-stepper-step
            complete-icon="mdi-bed-king-outline"
            :step="1"
            :complete="step > 1"
          >
            {{ $t("Availability") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            complete-icon="mdi-account-outline"
            :step="2"
            :complete="step > 2"
          >
            {{ $t("Reservation Holder") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            complete-icon="mdi-cash"
            :step="3"
            :complete="step > 3"
          >
            {{ $t("Payment") }}
          </v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step
            complete-icon="mdi-text-box-outline"
            :step="4"
            :complete="step > 4"
          >
            {{ $t("Confirmation") }}
          </v-stepper-step>
        </v-stepper-header>
      </v-stepper>
      <v-stepper
        v-model="step"
        class="overflow-visible elevation-0"
      >
        <v-stepper-items class="overflow-visible">
          <v-stepper-content class="pa-0 overflow-visible" :step="1">
            <v-row>
              <v-col cols="12" lg="8">
                <v-card flat outlined class="mb-3">
                  <v-card-title class="ps-6 pe-0">{{ $t("Staying Time") }}</v-card-title>
                  <v-card-text class="px-6">
                    <input-section
                      dense
                      button-title="Apply"
                      class="mx-n3"
                      :hotel="$route.query.hotel"
                      :checkinDate="availData.checkinDate"
                      :checkoutDate="availData.checkoutDate"
                      @input:hotel="availData.hotel = $event"
                      @input:checkinDate="availData.checkinDate = $event"
                      @input:checkoutDate="availData.checkoutDate = $event"
                      @submit-params="updateRoute"
                    />
                  </v-card-text>
                </v-card>
                <v-alert
                  v-if="(notes !== '')"
                  dense
                  text
                  type="error"
                  class="py-3 mt-6 mb-3"
                >
                  <span v-html="notes.replace(/\n/gi, '<br>')"></span>
                </v-alert>
                <v-tabs
                  v-if="false && (ratePlans.length > 1)"
                  grow
                  show-arrows
                  center-active
                  centered
                  class="mt-6 mb-3 rounded overflow-hidden v-sheet--outlined"
                  :value="$store.state.avail.chosenRatePlan"
                  @change="$store.commit('avail/setRatePlan', $event)"
                  color="info"
                >
                  <v-tabs-slider/>
                  <v-tab v-for="item,idx in ratePlans" :key="idx" :value="idx">
                    {{(item.title)}}
                  </v-tab>
                </v-tabs>
                <section>
                  <rooms-step
                    :hotel="$route.query.hotel"
                    :checkinDate="availData.checkinDate"
                    :checkoutDate="availData.checkoutDate"
                  />
                  <v-btn
                    v-if="isMobile"
                    block
                    color="success"
                    class="mt-6 g-picked-rooms"
                    @click="step = 2"
                    :disabled="(totalRooms == 0) || totalIsMoreThanCredit"
                  >
                    <v-icon class="ms-n1 me-1">mdi-check-circle-outline</v-icon>
                    {{$t('Book Now')}}
                  </v-btn>
                </section>
              </v-col>
              <v-col v-if="!isMobile" cols="4">
                <aside class="sticky">
                  <v-card flat outlined>
                    <v-list>
                      <v-list-item>
                        <v-list-item-title class="font-weight-bold">
                          {{$t('Your Rooms')}}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-card-text class="pa-0" style="max-height:calc(100vh - 290px);overflow-x:hidden;overflow-y:auto">
                      <cart-list :hotel="$route.query.hotel"></cart-list>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-text class="py-0">
                      <v-row align="center" justify="space-between">
                        <v-col cols="auto">
                          <span class="black--text font-weight-bold">
                            {{$t('Reservation Date')}}
                          </span>
                        </v-col>
                        <v-col cols="auto">
                          {{dateRange}}
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider></v-divider>
                    <div class="pa-3">
                      <v-btn class="g-picked-rooms" block color="success" @click="step = 2" :disabled="(totalRooms == 0) || totalIsMoreThanCredit">
                        <v-icon class="ms-n1 me-1">mdi-check-circle-outline</v-icon>
                        {{$t('Book Now')}}
                      </v-btn>
                    </div>
                  </v-card>
                </aside>
              </v-col>
            </v-row>
          </v-stepper-content>
          <v-stepper-content class="pa-0 overflow-visible" :step="2">
            <user-info :hotel="$route.query.hotel" @go-back="step = 1" @submit="getPriceDetails($event)" />
          </v-stepper-content>
          <v-stepper-content class="pa-0 overflow-visible" :step="3">
            <payment-method
              :hotelsDic="hotelsDic"
              :hotel="$route.query.hotel"
              :submit-data="submitData"
              @proceed-to-payment="
              setSpecialRequest('martyr-gang', $event.martyrGang);
              setSpecialRequest('other', $event.other);
              submitGeneral();"
              @go-back="step = 2"
              :has-promo="!!promoCode"
              @apply-promo="promoCode=$event;getPriceDetails()"
              @rescind-promo="promoCode='';getPriceDetails()"
              @set-early-checkin="earlyCheckin=$event;getPriceDetails()"
              @set-late-checkout="lateCheckout=$event;getPriceDetails()"
            />
          </v-stepper-content>
          <v-stepper-content class="pa-0 overflow-visible" :step="4">
            <reservation-voucher v-if="!error" :reservation="voucher.data" @go-back="step = 1" :reference-id="'1000122775202576-1609060101'" />
            <reservation-error v-else :error="error ? error : 404" />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-container>

    <v-bottom-sheet v-model="cart" v-if="isMobile && (step <= 3)">
      <v-sheet
        class="text-center"
      >
        <v-row no-gutters justify="space-between" align="center">
          <v-col cols="auto">
            <v-card-title class="text-body-1 font-weight-bold">
              <v-icon class="me-4">mdi-bed-king-outline</v-icon>
              {{$t('Your Rooms')}}
            </v-card-title>
          </v-col>
          <v-col cols="auto">
            <v-btn class="me-1" icon @click="cart=false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-card-text style="max-height: 300px;overflow-x:hidden;overflow-y:auto" class="pa-0">
          <cart-list :hotel="$route.query.hotel" no-actions :readonly="(step != 1)"></cart-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text class="py-0">
          <v-row align="center" justify="space-between">
            <v-col cols="auto">
              <span class="font-weight-bold">
                {{$t('Reservation Date')}}
              </span>
            </v-col>
            <v-col cols="auto">
              {{dateRange}}
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider v-if="step == 1"></v-divider>
        <v-card-actions v-if="step == 1" class="px-2 pb-2">
          <v-btn block color="success" @click="step = 2;cart=false" :disabled="(totalRooms == 0) || totalIsMoreThanCredit" class="g-picked-rooms">
            <v-icon class="ms-n1 me-1">mdi-check-circle-outline</v-icon>
            {{$t('Book Now')}}
          </v-btn>
        </v-card-actions>
      </v-sheet>
    </v-bottom-sheet>

    <v-fab-transition>
      <v-btn
        elevation="1"
        v-if="isMobile"
        @click="cart = true"
        color="info"
        dark
        fixed
        bottom
        left
        fab
      >
        <v-badge
          :content="totalRooms"
          :value="totalRooms"
          color="error"
          overlap
          bottom left
        >
          <v-icon>mdi-cart-outline</v-icon>
        </v-badge>
      </v-btn>
    </v-fab-transition>

    <v-dialog
      v-if="submitLoading"
      content-class="elevation-0 h-100 d-flex flex-column align-center justify-center"
      light
      no-click-animation
      overlay-color="white"

      v-model="submitLoading"
      persistent
    >
      <v-progress-circular
        v-if="submitLoading"
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";

import {
  BOOKING_AVAILABILITY,
  BOOKING_PRICE,
  SUBMIT_RESERVATION,
  CONFIRM_RESERVATION,
  CANCEL_RESERVATION,
  VERIFY_RESERVATION,
  ENGINE_PAYMENT_METHODS
} from "~/api";

import TRANSLATE_CURRENCY from "~/util/translations/translate-currency"

import validateDate        from "~/util/functions/validate-date";
import generateReferenceId from "~/util/functions/generate-reference-id";

import RoomsStep          from "~/components/core/pages/booking/stepper-rooms";
import UserInfo           from "~/components/core/pages/booking/stepper-user-info";
import PaymentMethod      from "~/components/core/pages/booking/stepper-payment";
import ReservationVoucher from "~/components/core/pages/booking/stepper-voucher";
import ReservationError   from "~/components/core/pages/booking/stepper-error";

import InputSection from "~/components/core/pages/home/input-section";
import CartList     from "~/components/core/pages/booking/cart-list";

export default {
  head() {
    switch (this.step) {
      case 4:  return { title: this.$t('Confirmation'       ) }
      case 3:  return { title: this.$t('Payment'            ) }
      case 2:  return { title: this.$t('Reservation Holder' ) }
      case 1:  return { title: this.$t('Rooms'              ) }
      default: return { title: this.$t('Rooms'              ) }
    }
  },
  validate({ redirect, query, store, $moment }) {
    let yesterday = $moment().subtract(1, "days").format('YYYY-MM-DD');
    if ((
      validateDate(query.checkinDate) &&
      validateDate(query.checkoutDate) &&
      (yesterday < query.checkinDate) &&
      (query.checkinDate < query.checkoutDate) &&
      Object.keys(store.state.hotelsDic).includes(query.hotel)
    ) || (
      query.confirm &&
      typeof query.confirm == 'string' &&
      query.confirm.length > 0
    ))
      return true;
    redirect("/");
  },
  async fetch() {
    //todo: after redirect from payment gateway, the redirect uri should be decoded by Js method `decodeURLComponent` to extract query params
    console.log('this is route: ', this?.$route?.query)
    let decodedUri = decodeURIComponent(`${this?.$route?.query}`)
    console.log('this is decoded uri: ', decodedUri)
    if(this?.$route?.query?.confirm) {
      this.step = 4
      this.reference_id = this.$route.query.confirm
      await this.confirmReservation(this.reference_id)
      await this.getVoucher(this.reference_id)
    }
    else {
      await this.getAvail()
    }
  },
  data() {
    return {
      earlyCheckin: false,
      lateCheckout: false,
      chosenRatePlan: '',
      step: 1,
      reference_id: '',
      voucher: { data: {} },
      error: false,
      cart: false,
      submitLoading: false,
      promoCode: '',
      tempStayData: {},
      submitData: {
        customer: "",
        rooms: [],
        priceDetails: []
      },
      availData: {
        hotel: "",
        checkinDate: "",
        checkoutDate: "",
      },
      specialRequest: {
        martyrGang: '',
        guest: '',
        promoCode: '',
        other: '',
      }
    }
  },
  methods: {
    ...mapMutations('avail', ['clearCart']),
    concatSpecialRequests() {
      return [
        this.specialRequest.promoCode,
        this.specialRequest.guest,
        this.specialRequest.martyrGang,
        this.specialRequest.other,
      ].filter(i => !!i).join('\n')
    },
    setSpecialRequest(type, data) {
      switch (type) {
        case 'martyr-gang':
          this.specialRequest['martyrGang'] = data ? 'مسافر عضو خانواده‌ی محترم شهدا و از اعضای بنیاد شهید است' : ''
          break;
        case 'promo':
          this.specialRequest['promoCode'] = `رزرو با کد تخفیف ${data.promoCode} ثبت شد`
          break;
        case 'guest':
          let guests = data.map(({ first_name, last_name }) => ((first_name && last_name && `${first_name} ${last_name}`) || '')).filter(i => !!i).join(', ')
          this.specialRequest['guest'] = ((guests && `مسافران اصلی به شرح زیر میباشند: ${guests}`) || '')
          break;
        case 'other':
          this.specialRequest['other'] = `درخواست‌های ویژه مسافران: ${data}`
          break;
      }
    },
    async getAvail() {
      try {
        this.$store.commit("avail/setLoading", true);
        let { hotel, checkinDate, checkoutDate } = this.$route.query;
        this.availData.hotel = hotel;
        this.availData.checkinDate = checkinDate;
        this.availData.checkoutDate = checkoutDate;
        let data = await this.$api.post(BOOKING_AVAILABILITY, {
          api_version: "0",
          hotel_id: hotel,
          start_date: checkinDate,
          end_date: checkoutDate,
          lang: "fa_IR",
          currency: "IRR",
          user_country: "IR",
          cache: true,
        });
        this.$store.commit("avail/generateAvailLookup", data);
      } catch (e) {
        if(e?.response?.status == 403) {
          return false
        }
      } finally {
        this.$store.commit("avail/setLoading", false);
      }
      return true;
    },
    updateRoute(newParams) {
      for (let key of [
        ...new Set(
          Object.keys(newParams).concat(Object.keys(this.$route.query))
        ),
      ]) {
        if (newParams[key] != this.$route.query[key]) {
          this.$router.replace({
            path: this.$route.path,
            query: newParams,
          });
        }
      }
    },
    async getPriceDetails(stayData) {
      if(stayData)
        this.tempStayData = stayData
      const { rooms, customer } = this.tempStayData;
      this.setSpecialRequest('guest', rooms.flatMap(i => i.guests))
      const { hotel, checkinDate, checkoutDate } = this.availData;
      try {
        this.$store.commit("avail/setLoading", true);
        this.step = 3;
        const { data } = await this.$api.post(BOOKING_PRICE, {
          hotel_id: hotel,
          checkin_date: checkinDate,
          checkout_date: checkoutDate,
          rooms: rooms.map(i => ({
            ...i,
            early_checkin: this.earlyCheckin,
            late_checkout: this.lateCheckout,
          })),
          rate_plan_id: this.ratePlans[this.$store.state.avail.chosenRatePlan].id,
          ...this.promoParams
        });
        if(this.promoCode) {
          if(!data.discount) {
            this.$notify({
              group: 'default',
              text: 'This promotion code is not valid',
              type: 'error',
              duration: 5000,
            })
          }
          else {
            this.setSpecialRequest('promo', { promoCode: this.promoCode, discount: data.discount })
            this.$notify({
              group: 'default',
              text: this.$t('__PROMO_AMOUNT__ was deducted from your order').replace('__PROMO_AMOUNT__', `${data.discount} ${TRANSLATE_CURRENCY['IRR']}`),
              type: 'success',
              duration: 5000,
            })
          }
        }
        this.submitData = { ...this.availData, customer, rooms: rooms.map((r, idx) => ({...r, ...data.rooms[idx]})), discount: data.discount, price_to_pay: data.price_to_pay };
        this.$store.commit("avail/setLoading", false);
      } catch (e) {}
      finally {
        this.$store.commit("avail/setLoading", false);
      }
    },
    submitGeneral() {
      if(this.$store.state.club.isActive) {
        this.submitWithClub()
      }
      else {
        this.submitReservation()
      }
    },
    async submitWithClub() {
      try {
        let { data } = await this.$api.get(ENGINE_PAYMENT_METHODS.replace('__HOTEL_ID__', this.availData.hotel))
        let reference_id = generateReferenceId(this.$store.state.info.hostName)
        let payment_method = data.paymentMethod
        this.submitLoading = true
        let { response } = await this.$api.post(SUBMIT_RESERVATION, {
          reference_id,
          checkin_date     : this.availData.checkinDate,
          checkout_date    : this.availData.checkoutDate,
          hotel_id         : this.availData.hotel,
          customer         : this.submitData.customer,
          rooms            : this.submitData.rooms.map(i => ({
            ...i,
            early_checkin: this.earlyCheckin,
            late_checkout: this.lateCheckout,
          })),
          rate_plan_id     : this.ratePlans[this.$store.state.avail.chosenRatePlan].id,
          payment_method   : payment_method,
          ...this.promoParams,
          special_requests: this.concatSpecialRequests(),
        }, {})
        this.$router.push({ path: this.localePath('index-booking'), query: { confirm: reference_id } });
      } catch (e) {
        const errorCode = e?.response?.data?.code || null;
        if (errorCode && errorCode === 11) {
          this.$notify({
            group: 'default',
            text: 'Your selected rooms are full',
            type: 'error',
            duration: 10000,
          })
          this.$notify({
            group: 'default',
            text: 'Please change your stay date or rooms',
            type: 'info',
            duration: 10000,
          })
        } else {
          this.$notify({
            group: 'default',
            text: 'A problem occurred while submitting the reservation. Please try again',
            type: 'error',
            duration: 10000,
          })
        }
      } finally {
        this.submitLoading = false;
      }
    },
    async submitReservation() {
      try {
        let { origin, host } = window.location
        let reference_id = generateReferenceId(host)
        //todo: here should encode the redirect uri by encodeURLComponent() whit proper params
        let uri = `${origin}${this.$route.path}?confirm=${reference_id}&casTicket=amirrrrr`
        this.submitLoading = true
        let { data } = await this.$api.post(SUBMIT_RESERVATION, {
          reference_id,
          redirect_uri     : encodeURIComponent(uri),
          checkin_date     : this.availData.checkinDate,
          checkout_date    : this.availData.checkoutDate,
          hotel_id         : this.availData.hotel,
          customer         : this.submitData.customer,
          rooms            : this.submitData.rooms.map(i => ({
            ...i,
            early_checkin: this.earlyCheckin,
            late_checkout: this.lateCheckout,
          })),
          rate_plan_id     : this.ratePlans[this.$store.state.avail.chosenRatePlan].id,
          payment_method   : '5acf7b3a3dbd6c97c69b7428',
          ...this.promoParams,
          special_requests: this.concatSpecialRequests(),
        }, {})
        let paymentURL = data?.payment_details?.URL || false
        if(!paymentURL) {
          throw new Error()
        }
        else {
          this.clearCart(null)
          window.location.href = paymentURL
        }
      } catch (e) {
        const errorCode = e?.response?.data?.code || null;
        if (errorCode && errorCode === 11) {
          this.$notify({
            group: 'default',
            text: 'Your selected rooms are full',
            type: 'error',
            duration: 10000,
          })
          this.$notify({
            group: 'default',
            text: 'Please change your stay date or rooms',
            type: 'info',
            duration: 10000,
          })
        } else if (errorCode && errorCode === 21) {
          this.$notify({
            group: 'default',
            text: 'Minimum length of stay is not satisfied for given start date',
            type: 'error',
            duration: 10000,
          })
        } else if (errorCode && errorCode === 22) {
          this.$notify({
            group: 'default',
            text: 'Hotel is blocked for this date',
            type: 'error',
            duration: 10000,
          })
          this.$notify({
            group: 'default',
            text: 'Please change your stay date',
            type: 'info',
            duration: 10000,
          })
        } else {
          this.$notify({
            group: 'default',
            text: 'A problem occurred while submitting the reservation. Please try again',
            type: 'error',
            duration: 10000,
          })
        }
      } finally {
        this.submitLoading = false;
      }
    },
    async confirmReservation(reference_id) {
      try {
        await this.$api.post(CONFIRM_RESERVATION, { reference_id }, {})
        this.clearCart(null)
      } catch (error) {
        if(error?.response?.data?.code && error?.response?.data?.code != 60) {
          // this.cancelReservation(reference_id)
          this.error = error?.response?.data?.code
        }
      }
    },
    async cancelReservation(reference_id) {
      this.$api.delete(CANCEL_RESERVATION, { data: { reference_id, penalty: 0 } })
      .then(console.log)
      .catch(console.error)
    },
    async getVoucher(reference_id) {
      try {
        const response = await this.$api.post(VERIFY_RESERVATION, { reference_id });
        this.$set(this.voucher, 'data', response.data.reservation)
      } catch (error) {
        this.error = error?.response?.data?.code || 999
      }
    }
  },
  computed: {
    ...mapState(["hotelsDic", "info"]),
    ...mapState("avail", ["ratePlans", "loading"]),
    ...mapGetters('avail', ['totalRooms']),
    isMobile() {
      return ["xs", "sm", "md"].includes(this.$vuetify.breakpoint.name);
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
    notes() {
      return (this.$store.state.info?.notes?.[this.$i18n.locale]?.trim?.() || '')
    },
    promoParams() {
      if(this.promoCode !== '')
        return {
          promotion_code: {
            code: this.promoCode,
            engine: this.info.id,
            target: this.submitData.customer.phone_number
          },
        }
      else
        return {}
    },
    totalIsMoreThanCredit() {
      return this.$store.state.club.hasCredit &&  (this.$store.getters['avail/cartTotal'] > this.$store.getters['club/remainingCredit'])
    }
  },
  watch: {
    '$route.query': '$fetch',
    "$route.query.hotel"() {
      this.clearCart()
    },
    step(to,from) {
      this.$vuetify.goTo(0)
    },
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
  components: { InputSection, RoomsStep, ReservationVoucher, CartList, UserInfo, PaymentMethod, ReservationError },
};
</script>

<style lang="scss" scoped>
.sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 90px;
}
</style>
