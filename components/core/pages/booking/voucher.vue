<template>
  <div :dir="$vuetify.rtl ? 'rtl' : 'ltr'">
    <v-row no-gutters justify="center" align="center" class="pt-4 d-none d-print-block">
      <v-col cols="auto">
        <img :src="info.logo" style="width:50px" class="mx-auto" eager />
      </v-col>
      <v-col cols="auto">
        <v-card-title class="px-6 black--text font-weight-bold">{{ info.title[$i18n.locale] }}</v-card-title>
      </v-col>
    </v-row>
    <div>
      <v-row>
        <v-col cols="12" md="6" :lg="4 + idx" v-for="(table,idx) in tables.main" :key="table.title">
          <v-card :elevation="print ? 0 : 1" :outlined="print">
            <v-card-title>
              <h5>{{ $t(table.title) }}</h5>
            </v-card-title>
            <v-card-text class="pb-4 px-4 overflow-hidden">
              <v-simple-table class="elevation-0 v-sheet--outlined overflow-hidden">
                <tbody>
                <tr v-for="(row,j) in table.items" :key="j">
                  <td class="font-weight-bold">{{ row.title }}</td>
                  <td>{{ row.value(reservation) }}</td>
                </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="d-none d-lg-block" cols="12" lg="3">
          <v-card :elevation="print ? 0 : 1" :outlined="print" class="h-100">
            <v-card-title>
              <h5>{{ $t('QR Code') }}</h5>
            </v-card-title>
            <v-card-text class="d-flex flex-row align-center justify-center">
              <client-only>
                <v-qr-code
                  :value="QRCodeURL"
                  errorCorrectionLevel="L"
                  :scale="6"
                  :margin="0"
                  :quality="1"
                  :color="{ dark: '#000000', light: '#ffffff' }"
                />
              </client-only>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="12">
          <v-card :elevation="print ? 0 : 1" :outlined="print">
            <v-card-title>
              <h5>{{ $t(tables.other.title) }}</h5>
            </v-card-title>
            <v-divider></v-divider>
            <v-data-table
              :headers="tables.other.headers"
              :items="reservation.rooms"
              class="elevation-0 overflow-hidden"
              hide-default-footer
              disable-filtering
              disable-pagination
              disable-sort
            >
              <template v-slot:item.name="{ item }">
                {{
                  hotelsDic
                  && reservation.hotelId
                  && hotelsDic[reservation.hotelId]
                  && hotelsDic[reservation.hotelId].rooms
                  && hotelsDic[reservation.hotelId].rooms[item.id]
                  && hotelsDic[reservation.hotelId].rooms[item.id].title
                  && hotelsDic[reservation.hotelId].rooms[item.id].title[$i18n.locale]
                }}
              </template>
              <template v-slot:item.customer="{ item }">
                {{ `${item.customer.firstName} ${item.customer.lastName}` }}
              </template>
              <template v-slot:item.price="{ item }">
                {{ (item.price + item.extraPrice) | thousandify }}
              </template>
              <template v-slot:body.append="{ isMobile, headers: { length } }">
                <template v-if="roomsSum != reservation.price">
                  <tr v-if="isMobile" class="v-data-table__mobile-table-row black--text" style="background-color:var(--v-primary-lighten3)">
                    <td class="v-data-table__mobile-row" style="background-color:var(--v-primary-lighten3)">
                      <div class="v-data-table__mobile-row__header" style="background-color:var(--v-primary-lighten3)">{{$t('Discount')}}</div>
                      <div class="v-data-table__mobile-row__cell" style="background-color:var(--v-primary-lighten3)">{{(roomsSum - reservation.price) | thousandify}}</div>
                    </td>
                  </tr>
                  <tr v-else class="black--text" style="background-color: var(--v-primary-lighten3);">
                    <td class="font-weight-bold black--text" :colspan="length - 1" style="background-color:var(--v-primary-lighten3)">{{$t('Discount')}}</td>
                    <td style="background-color:var(--v-primary-lighten3)">{{(roomsSum - reservation.price) | thousandify}}</td>
                  </tr>
                </template>
                <tr v-if="isMobile" class="v-data-table__mobile-table-row white--text sum-row">
                  <td class="v-data-table__mobile-row sum-row">
                    <div class="v-data-table__mobile-row__header sum-row">{{$t('Total Price')}}</div>
                    <div class="v-data-table__mobile-row__cell sum-row">{{reservation.price | thousandify}}</div>
                  </td>
                </tr>
                <tr v-else class="white--text sum-row">
                  <td :colspan="length - 1" class="font-weight-bold sum-row">
                    {{$t('Total Price')}}
                  </td>
                  <td class="sum-row">{{reservation.price | thousandify}}</td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  mounted() {
    this.QRCodeURL = `${this.$store.state.info.hostName}/verify?national_code=${this.reservation?.customer?.nationalCode}&reference_id=${this.reservation?.refId}`
  },
  data() {
    return {
      QRCodeURL: '',
      tables: {
        main: [
          {
            title: 'Holder Information',
            items: [
              { title: this.$t('First Name')      , value: r => r.customer?.firstName            },
              { title: this.$t('Last Name')       , value: r => r.customer?.lastName             },
              { title: this.$t('Mobile Number')   , value: r => (r.customer?.phoneNumber || '')  },
              { title: this.$t('National ID')     , value: r => (r.customer?.nationalCode || '') },
              { title: this.$t('Number of Rooms') , value: r => (r?.rooms?.length || 0)          },
            ]
          },
          {
            title: 'Information',
            items: [
              {
                title: this.$t('Hotel'),
                value: r => this?.hotelsDic?.[r?.hotelId]?.info?.hotel?.name?.[this.$i18n.locale]
              },
              {
                title: this.$t('Booking Date'),
                value: r => this.$moment(r.createdAt || '').format(this.outputDateFormat)
              },
              {
                title: this.$t('Staying Time'),
                value: r => `${this.$moment(r.checkinDate, 'YYYY-MM-DD').format(this.outputDateFormat)} ${this.$t('To')} ${this.$moment(r.checkoutDate, 'YYYY-MM-DD').format(this.outputDateFormat)}`
              },
              {
                title: this.$t('Reference Number'),
                value: r => (r.refId)
              },
              {
                title: this.$t('Hotel Confirmation Number'),
                value: r => (r?.confirmData?.confirmCode || this.$t('None'))
              },
            ]
          }
        ],
        other: {
          title: 'Rooms',
          items: this.reservation.rooms,
          headers: [
            { text: this.$t("Room")       , value: "name"           },
            { text: this.$t("Guest Name") , value: "customer"       },
            { text: this.$t("Adults")     , value: "party.adults"   },
            { text: this.$t("Children")   , value: "party.children" },
            { text: this.$t("Price")      , value: "price"          },
          ]
        },
      }
    }
  },
  props: {
    print: {
      type: Boolean,
      default: false,
    },
    reservation: {
      type: Object,
      default: {},
    }
  },
  computed: {
    ...mapState(['info', 'hotelsDic']),
    outputDateFormat() {
      return (this.$i18n.locale == 'fa') ? 'jYYYY/jMM/jDD' : 'YYYY/MM/DD'
    },
    roomsSum() {
      return this?.reservation?.rooms?.map?.(item => (item.price + item.extraPrice))?.reduce((acc,curr) => (acc+curr), 0) || 0
    }
  },
  components: {
    'v-qr-code': async () => {
      if(process.browser || process.client) {
        return import('vue-qrcode')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sum-row {
  background-color: var(--v-primary-darken1) !important;
}
</style>