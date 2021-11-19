<template>
  <div>
    <v-card flat outlined class="my-6">
      <v-card-title class="px-6">{{ $t('Reservation Holder') }}</v-card-title>
      <v-card-subtitle class="px-6">{{ $t('Please enter the following details') }}</v-card-subtitle>
      <v-card-text class="px-6">
        <v-form class="mx-n2 mb-n2" v-model="valid">
          <v-row>
            <v-col cols="12" sm="6" lg="3" v-for="(_, idx) in inputs" :key="`input-field-${idx}`">
              <v-text-field
                :disabled="disable"
                v-bind="inputs[idx].props"
                :rules="disable ? [] : inputs[idx].rules"
                v-model="outputs[idx].value"
                :prepend-inner-icon="inputs[idx].icon"
                :label="$t(inputs[idx].title)"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3" dir="ltr">
              <v-text-field
                :disabled="disable"
                pattern="[0-9]*"
                inputmode="numeric"
                dir="ltr"
                :label="$t('Mobile Number')"
                outlined
                dense
                v-model="outputs[3].value"
                :rules="disable ? [] : [
                  v => (v.length !== 0) || $t('This field is required'),
                  mobilePhoneValid
                ]"
              >
                <template #prepend>
                  <v-autocomplete
                    :disabled="disable"
                    dir="ltr"
                    class="mt-n2 mb-n1 ms-1 me-n2"
                    style="width: 85px"
                    append-icon=""
                    :items="countryCodes"
                    item-text="code"
                    :item-value="i => i"
                    :filter="countryCodeFilter"
                    outlined
                    v-model="countryCode"
                    dense
                    hide-details
                  >
                    <template #item="{ item, on, attrs }">
                      <v-list-item v-on="on" v-bind="attrs">
                        <v-list-item-action>
                          <v-list-item-subtitle dir="ltr">
                            {{item.code}}
                          </v-list-item-subtitle>
                        </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>{{item.name[$i18n.locale]}}</v-list-item-title>
                      </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-autocomplete>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card-title>{{$t('Guests')}}</v-card-title>
    <v-card-subtitle class="secondary--text text--darken-4">{{$t('Please enter the number of guests and the main guest\'s information (if desired) for each of the rooms below.')}}</v-card-subtitle>
    <v-card flat outlined class="mb-6" v-for="(room,idx) in singleRooms" :key="idx">
      <v-card-title class="text-body-1 black--text font-weight-bold">
        {{
          hotelsDic && 
          hotelsDic[hotel] && 
          hotelsDic[hotel].rooms && 
          hotelsDic[hotel].rooms[room.type_id] && 
          hotelsDic[hotel].rooms[room.type_id].title && 
          hotelsDic[hotel].rooms[room.type_id].title[$i18n.locale]
        }}
      </v-card-title>
      <v-card-subtitle class="pb-0">
        {{$t('Capacity')}}: {{room.capacity}} , {{$t('Extra Capacity')}}: {{room.extra_capacity}}
      </v-card-subtitle>
      <v-card-text>
        <v-row align="center">
          <v-col cols="12" sm="6" lg="3">
            <v-text-field
              v-model="singleRooms[idx].guests[0].first_name"
              prepend-inner-icon="mdi-account"
              :label="$t('Guest First Name')"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" lg="3">
            <v-text-field
              v-model="singleRooms[idx].guests[0].last_name"
              prepend-inner-icon="mdi-account"
              :label="$t('Guest Last Name')"
              outlined
              dense
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="6" lg="3">
            <div class="d-flex flex-row align-center justify-space-between justify-sm-start">
              <v-subheader class="select-none">{{$t('Adults')}}: </v-subheader>
              <plus-minus-input
                v-model="singleRooms[idx].party.adults"
                :max="singleRooms[idx].capacity + singleRooms[idx].extra_capacity - singleRooms[idx].party.children"
                :min="1"
              />
            </div>
          </v-col>
          <v-col cols="12" sm="6" lg="3">
            <div class="d-flex flex-row align-center justify-space-between justify-sm-start">
              <v-subheader class="select-none">{{$t('Children')}}: </v-subheader>
              <plus-minus-input
                v-model="singleRooms[idx].party.children"
                :max="(singleRooms[idx].party.adults == 0) ? 0 : singleRooms[idx].capacity + singleRooms[idx].extra_capacity - singleRooms[idx].party.adults"
              />
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-row align="center" justify="end" class="my-n3">
      <v-col cols="6" sm="auto">
        <v-btn block color="success" id="g-added-user-info" :disabled="!valid || !allRoomsHaveParty" @click="$emit('submit', getStayData())">
          <v-icon class="ms-n1 me-1">mdi-check</v-icon>
          {{$t('Submit')}}
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
import { mapState } from "vuex";

import PlusMinusInput from "~/components/base/plus-minus-input"

import countryCodes from "~/util/options/country-codes.json"
import formatNumber from "~/util/functions/format-number"

export default {
  mounted() {
    this.createRoomArr(this.cart)
    if(this.$store.state.club.isActive) {
      this.outputs[0].value = this.$store.state.club.userInfo.firstName[this.$i18n.locale];
      this.outputs[1].value = this.$store.state.club.userInfo.lastName[this.$i18n.locale];
      this.outputs[2].value = this.$store.state.club.userInfo.nationalCode;
      this.outputs[3].value = this.$store.state.club.userInfo.mobile.substr(1);
      this.disable = true
    }
  },
  data() {
    return {
      disable: false,
      valid: false,
      countryCodes,
      countryCode: {
        code: "+98",
        name: {
          fa: "ایران",
          en: "Iran"
        }
      },
      inputs: [
        {
          title: 'First Name',
          name: 'first_name',
          icon: 'mdi-account',
          rules: [
            v => (v.length !== 0) || this.$t('This field is required'),
          ]
        },
        {
          title: 'Last Name',
          name: 'last_name',
          icon: 'mdi-account',
          rules: [
            v => (v.length !== 0) || this.$t('This field is required'),
          ]
        },
        {
          props: {
            dir: 'ltr',
            pattern: '[0-9]*',
            inputmode: 'numeric',
          },
          title: 'National ID or Passport Number',
          name: 'national_code',
          icon: 'mdi-card-account-details-outline',
          rules: [
            v => (v.length !== 0)   || this.$t('This field is required'),
            v => v.match(/\d{10}/g) || this.$t('Please enter a valid national ID or passport number'),
          ]
        },
      ],
      outputs: [
        { name: 'first_name'    , value: '' },
        { name: 'last_name'   , value: '' },
        { name: 'national_code'   , value: '' },
        { name: 'phone_number'   , value: '' },
      ],
      singleRooms: [],
    }
  },
  props: ['hotel'],
  components: { PlusMinusInput },
  computed: {
    ...mapState("avail", ["loading", "roomLookup", "ratePlans", "cart"]),
    ...mapState(["hotelsDic"]),
    allRoomsHaveParty() {
      return this.singleRooms.reduce((acc,curr) => (acc && (curr?.party?.adults != 0)), true)
    }
  },
  watch: {
    cart: {
      deep: true,
      handler(to, from) {
        this.createRoomArr(to)
      }
    }
  },
  methods: {
    createRoomArr(cart) {
      this.singleRooms.splice(0,this.singleRooms.length)
      let ratePlanIndex = this.$store.state.avail.chosenRatePlan
      for(let roomType of cart) {
        for(let i = 0; i < roomType.count; i++) {
          this.singleRooms.push({
            type_id: this.roomLookup?.[roomType.id]?.info?.id,
            title: this.roomLookup?.[roomType.id]?.info?.title,
            capacity: this.roomLookup?.[roomType.id]?.info?.capacity,
            extra_capacity: this.roomLookup?.[roomType.id]?.info?.extra_capacity,
            price: this.roomLookup[roomType.id]?.rates?.[this.ratePlans?.[ratePlanIndex]?.id]?.price,
            extra_guest_cost: this.ratePlans[ratePlanIndex]?.extra_guest_cost,
            guests: [{
              first_name: '',
              last_name: '',
              national_code: '',
              phone_number: '',
            }],
            party: {
              adults: 1,
              children: 0,
            }
          })
        }
      }
    },
    getStayData() {
      let customer = {};
      for (const key of this.outputs)
        customer[key.name] = key.value;
      customer['phone_number'] = ('0' + customer['phone_number'])
      customer.country = "IR"
      return {
        customer,
        rooms: this.singleRooms.map(i => ({
          type_id: i.type_id,
          guests: i.guests,
          count: 1,
          party: {
            adults: i.party.adults,
            children: (i.party.children ? new Array(i.party.children).fill(5) : [])
          },
        }))
      }
    },
    mobilePhoneValid(i) {
      return (!isNaN(i) && [9,10,11].includes(formatNumber(i).toString().length)) || this.$t('Please enter a valid mobile number');
    },
    countryCodeFilter(item, queryText) {
      const textOne = item.code
      const textTwo = item.name[this.$i18n.locale]?.toLowerCase?.()
      const searchText = queryText?.toLowerCase?.()
      return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
    }
  },
};
</script>
