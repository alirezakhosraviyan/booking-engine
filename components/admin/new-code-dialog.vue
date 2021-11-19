<template>
  <v-card>
    <v-card-title class="pa-4">
      {{$t('New Promotion')}}
    </v-card-title>
    <v-divider></v-divider>
    <v-form v-model="valid" @submit.prevent="$emit('submit', { ...info, noTarget: !info.noTarget })">
      <v-card-text style="max-height:calc(100vh - 230px);overflow-y:auto" class="pa-4">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="info.title"
              outlined
              dense
              hide-details
              :label="$t('Title')"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="info.code"
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-alphabetical"
              dir="ltr"
              :label="$t('Code')"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              id="exp-date"
              :value="info.expirationDate | formatDate('YYYY-MM-DD', 'jYYYY/jMM/jDD')"
              outlined
              dense
              hide-details
              readonly
              :label="$t('Expiration Date')"
              prepend-inner-icon="mdi-calendar-week-begin"
              clearable
              @click:clear="info.expirationDate=''"
            />
            <client-only>
              <v-persian-date-picker
                ref="expDate"
                :color="$vuetify.theme.themes.light.info"
                element="exp-date"
                v-model="info.expirationDate"
                format="YYYY-MM-DD"
                :min="today"
                auto-submit
              >
                <template v-slot:header-date="_">
                  {{$t('Expiration Date')}}
                </template>
              </v-persian-date-picker>
            </client-only>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="info.numOfUse"
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-numeric"
              dir="ltr"
              :label="$t('Total Uses for Individual')"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="info.totalUse"
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-numeric"
              dir="ltr"
              :label="$t('Total Permissable Uses')"
            />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="info.type"
              outlined
              dense
              hide-details
              prepend-inner-icon="mdi-help"
              :items="promoTypeOptions"
              :label="$t('Promotion Type')"
            ></v-select>
          </v-col>
          <template v-if="info.type == 'PercentLimitPromotionCode'">
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="info.amount"
                outlined
                dense
                hide-details
                prepend-inner-icon="mdi-percent"
                dir="ltr"
                :label="$t('Amount')"
              />
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="info.limit"
                outlined
                dense
                hide-details
                prepend-inner-icon="mdi-cash"
                suffix="ریال"
                dir="ltr"
                :label="$t('Limit')"
              />
            </v-col>
          </template>
          <v-col cols="12" v-else-if="info.type == 'ConstantPromotionCode'">
            <v-text-field
              v-model="info.amount"
              outlined
              dense
              hide-details
              :prepend-inner-icon="'mdi-cash'"
              suffix="ریال"
              dir="ltr"
              :label="$t('Amount')"
            />
          </v-col>
          <v-col cols="12" v-else-if="info.type == 'PercentPromotionCode'">
            <v-text-field
              v-model="info.amount"
              outlined
              dense
              hide-details
              :prepend-inner-icon="'mdi-percent'"
              dir="ltr"
              :label="$t('Amount')"
            />
          </v-col>
          <v-col cols="12">
            <v-row justify="space-between">
              <v-col cols="auto">
                <v-switch
                  :ripple="false"
                  class="ma-0 pa-0"
                  hide-details
                  :label="$t('Promotion is Targeted')"
                  v-model="info.noTarget"
                  inset
                />
              </v-col>
              <v-col cols="auto">
                <v-expand-x-transition>
                  <div :key="info.noTarget" v-if="info.noTarget">
                    <v-btn outlined color="primary" @click="info.targets.push({ target: '' })">
                      <v-icon class="mr-n1 ml-1">mdi-plus</v-icon>
                      جدید
                    </v-btn>
                  </div>
                </v-expand-x-transition>
              </v-col>
            </v-row>
            <v-expand-transition>
              <div v-if="info.noTarget">
                <v-row align="end" v-for="(target,idx) in info.targets" :key="idx">
                  <v-col cols="">
                    <v-text-field
                      dense
                      outlined
                      hide-details
                      prepend-inner-icon="mdi-phone"
                      dir="ltr"
                      :label="$t('Promotion Target')"
                      v-model="info.targets[idx].target"
                    />
                  </v-col>
                  <v-col cols="auto">
                    <v-btn class="pa-1" icon @click="info.targets.splice(idx, 1);info.noTarget = (info.targets.length > 0)">
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </v-expand-transition>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-row dense justify="end">
          <v-col cols="6" md="auto">
            <v-btn block color="success" type="submit" :disabled="!valid">
              <v-icon class="ms-n1 me-1">mdi-check</v-icon>
              {{$t('Submit')}}
            </v-btn>
          </v-col>
          <v-col cols="6" md="auto">
            <v-btn block color="error" @click="$emit('close')">
              <v-icon class="ms-n1 me-1">mdi-close</v-icon>
              {{$t('Cancel')}}
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import TRANSLATE_PROMO_TYPE from '~/util/translations/translate-promo-type';

export default {
  data() {
    return {
      promoTypeOptions: Object.keys(TRANSLATE_PROMO_TYPE).reduce((acc,curr) => ([ ...acc, { text: this.$t(TRANSLATE_PROMO_TYPE[curr]) , value: curr } ]), []),
      info: {
        type: '',
        noTarget: false,
        targets: [],
        amount: '',
        limit: '',
        title: '',
        code: '',
        expirationDate: '',
        totalUse: '',
        numOfUse: '',
      },
      today: this.$moment().format('YYYY-MM-DD'),
    }
  },
  watch: {
    'info.noTarget'(to) {
      if(to) {
        this.info.targets.push({ target: '' })
      }
      else {
        this.info.targets.splice(0, this.info.targets.length)
      }
    }
  },
  components: {
    'v-persian-date-picker': () => { if(process.browser || process.client) return import('vue-persian-datetime-picker') },
  }
};
</script>