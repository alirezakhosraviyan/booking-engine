<template>
  <v-row :dense="dense" justify="center">
    <v-col cols="12" sm="12" lg="" v-if="info.chain">
      <v-autocomplete
        v-model="hotel"
        :items="hotels"
        :item-text="hotel => `${hotel.hotel.name[$i18n.locale]} ${hotel.hotel.city[$i18n.locale]}`"
        :item-value="hotel => hotel.hotel._id"
        :dark="dark"
        outlined
        dense
        hide-details
        :label="$t('Hotel or City')"
        prepend-inner-icon="mdi-bed-double-outline"
        clearable
        @click:clear="hotel=''"
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title>
              {{item.hotel.name[$i18n.locale]}}
            </v-list-item-title>
            <v-list-item-subtitle v-if="item.hotel.city[$i18n.locale]">
              {{item.hotel.city[$i18n.locale]}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </template>
      </v-autocomplete>
    </v-col>
    <v-col cols="12" sm="" lg="">
      <v-menu
        v-if="$i18n.locale=='en'"
        v-model="checkinActive"
        :close-on-content-click="false"
        :nudge-right="40"
        left
        bottom
        nudge-left="18px"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :dark="dark"
            v-bind="attrs"
            v-on="on"
            @click:prepend-inner="checkinActive=true"
            :value="checkinDate | formatDate('YYYY-MM-DD', 'YYYY/MM/DD')"
            outlined
            dense
            hide-details
            readonly
            :label="$t('Check In Date')"
            prepend-inner-icon="mdi-calendar-week-begin"
            clearable
            @click:clear="checkinDate=''"
          />
        </template>
        <v-date-picker color="info" :locale="$i18n.locale" :min="today" v-model="checkinDate" @input="checkinActive=false;checkoutActive=true" />
      </v-menu>
      <template v-else-if="$i18n.locale=='fa'">
        <v-text-field
          :dark="dark"
          id="start-date"
          @click:prepend-inner="$refs.persianStartDate.visible = true"
          :value="checkinDate | formatDate('YYYY-MM-DD', 'jYYYY/jMM/jDD')"
          outlined
          dense
          hide-details
          readonly
          :label="$t('Check In Date')"
          prepend-inner-icon="mdi-calendar-week-begin"
          clearable
          @click:clear="checkinDate=''"
        />
        <client-only>
          <v-persian-date-picker
            ref="persianStartDate"
            @input="setEndInputView()"
            :color="$vuetify.theme.themes.light.info"
            element="start-date"
            v-model="checkinDate"
            format="YYYY-MM-DD"
            :min="today"
            auto-submit
          >
            <template v-slot:header-date="_">
              {{$t('Check In Date')}}
            </template>
          </v-persian-date-picker>
        </client-only>
      </template>
    </v-col>
    <v-col cols="12" sm="" lg="">
      <v-menu
        v-if="$i18n.locale=='en'"
        v-model="checkoutActive"
        :close-on-content-click="false"
        :nudge-right="40"
        left
        bottom
        nudge-left="18px"
        offset-y
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :dark="dark"
            v-bind="attrs"
            v-on="on"
            @click:prepend-inner="checkoutActive=true"
            :value="checkoutDate | formatDate('YYYY-MM-DD', 'YYYY/MM/DD')"
            outlined
            dense
            hide-details
            readonly
            :label="$t('Check Out Date')"
            prepend-inner-icon="mdi-calendar-week"
            clearable
            @click:clear="checkoutDate=''"
          />
        </template>
        <v-date-picker color="info" :min="minForCheckout" :locale="$i18n.locale" v-model="checkoutDate" @input="checkoutActive=false;" />
      </v-menu>
      <template v-else-if="$i18n.locale=='fa'">
        <v-text-field
          :dark="dark"
          id="end-date"
          @click:prepend-inner="$refs.persianEndDate.visible = true"
          :value="checkoutDate | formatDate('YYYY-MM-DD', 'jYYYY/jMM/jDD')"
          outlined
          dense
          hide-details
          readonly
          :label="$t('Check Out Date')"
          prepend-inner-icon="mdi-calendar-week"
          clearable
          @click:clear="checkoutDate=''"
        />
        <client-only>
          <v-persian-date-picker
            ref="persianEndDate"
            :color="$vuetify.theme.themes.light.info"
            element="end-date"
            v-model="checkoutDate"
            format="YYYY-MM-DD"
            :min="minForCheckout"
            auto-submit
          >
            <template v-slot:header-date="_">
              {{$t('Check Out Date')}}
            </template>
          </v-persian-date-picker>
        </client-only>
      </template>
    </v-col>

    <v-col cols="12" sm="auto" lg="auto" class="d-flex flex-row justify-center">
      <v-btn
        height="40px"
        elevation="1"
        color="primary"
        :class="`${dark ? 'white--text' : ''} g-get-avail`"
        @click="cantSubmit ? '' : $emit('submit-params', { hotel, checkinDate, checkoutDate })"
      >
        {{$t(buttonTitle)}}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex"

import formatNumber from '~/util/functions/format-number'

export default {
  data() {
    return {
      today: this.$moment().format('YYYY-MM-DD'),
      checkinActive: false,
      checkoutActive: false,
    }
  },
  props: {
    buttonTitle: {
      type: String,
      default: 'Submit'
    },
    hotel: {
      type: String
    },
    checkinDate: {
      type: String
    },
    checkoutDate: {
      type: String
    },
    dark: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
  },
  computed: {
    ...mapState(['info', 'hotelsDic']),
    cantSubmit() {
      return !(this.checkinDate && this.checkoutDate && (!this.info.chain || this.hotel))
    },
    hotels() {
      return Object.values(this.hotelsDic).map(i => i.info)
    },
    minForCheckout() {
      return (this.checkinDate && this.$moment(this.checkinDate,'YYYY-MM-DD').add(1,'days').format('YYYY-MM-DD')) || this.today
    },
    outputFormat() {
      switch (this.$i18n.locale) {
        case 'fa':
          return 'jYYYY/jMM/jDD'
        case 'en':
        default:
          return 'YYYY/MM/DD'
      }
    }
  },
  methods: {
    setEndInputView() {
      let requiredView = this.$moment(this.checkinDate, 'YYYY-MM-DD').add(1, 'days')
      let currentView  = this.$moment(this.$refs.persianEndDate?.month?.[0]?.find?.(({ date }) => date != null)?.date)
      let requiredMonths = ((parseInt(requiredView.format('jYYYY')) * 12) + parseInt(requiredView.format('jMM')))
      let currentMonths = ((parseInt(currentView.format('jYYYY')) * 12) + parseInt(currentView.format('jMM')))
      if(requiredMonths > currentMonths)
        for(let i = currentMonths; i < requiredMonths; i++)
          this.$refs.persianEndDate.nextMonth()
      else if(requiredMonths < currentMonths)
        for(let i = currentMonths; i > requiredMonths; i--)
          this.$refs.persianEndDate.prevMonth()
      this.$refs.persianEndDate.visible = true
    }
  },
  components: {
    'v-persian-date-picker': () => { if(process.browser || process.client) return import('vue-persian-datetime-picker') },
  },
  watch: {
    hotel(to, from) {
      this.$emit('input:hotel', to)
    },
    checkinDate(to, from) {
      this.$emit('input:checkinDate', to)
    },
    checkoutDate(to, from) {
      this.$emit('input:checkoutDate', to)
    },
  },
};
</script>