<template>
  <div>
    <v-dialog max-width="500" v-model="codeDetailsDialog">
      <v-fade-transition>
        <code-targets-dialog
          v-if="codeDetailsDialog"
          @close="codeDetailsDialog=false"
          :targets="codeTargets"
          :title="codeTitle"
        />
      </v-fade-transition>
    </v-dialog>
    <v-dialog max-width="500" v-model="newCodeDialog">
      <v-fade-transition>
        <new-code-dialog
          v-if="newCodeDialog"
          @close="newCodeDialog=false"
          @submit="newCodeDialog=false;createNewCode($event)"
        />
      </v-fade-transition>
    </v-dialog>
    <v-card elevation="1">
      <v-row justify="space-between" align="center">
        <v-col cols="12" md="auto">
          <v-card-title>{{$t('Promotions')}}</v-card-title>
          <v-card-subtitle>{{$t('In this section, you can manage your hotels\' promotions')}}</v-card-subtitle>
        </v-col>
        <v-col cols="12" md="auto">
          <div class="px-4">
            <v-btn color="primary" block @click="newCodeDialog=true">
              <v-icon class="ms-n1 me-1">mdi-plus</v-icon>
              {{$t('New Promotion')}}
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-card-text>
        <client-only>
          <v-data-table
            :headers="headers"
            :items="promotions"
            :page.sync="page"
            :items-per-page="itemsPerPage"
            hide-default-footer
            disable-filtering
            disable-sort
            class="elevation-1"
            @page-count="pageCount = $event"
          >
            <template v-slot:item.usageAndLimit="{ item }">
              <div dir="ltr" class="text-center">
                {{item | countUsages}} / {{item.totalUse + $options.filters.countUsages(item)}} 
              </div>
            </template>
            <template v-slot:item.code="{ item }">
              <v-btn outlined small @click="$copyText(item.code)" style="text-transform:none">
                <v-icon small class="ms-n1 me-1">mdi-content-copy</v-icon>
                {{item.code}}
              </v-btn>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon>
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
            </template>
            <template v-slot:item.expirationDate="{ item }">
              <span dir="ltr">{{item.expirationDate | formatDate('', 'jYYYY/jMM/jDD')}}</span>
            </template>
            <template v-slot:item.amount="{ item }">
              {{item | translateAmount($t('up to')) }}
            </template>
            <template v-slot:item.noTarget="{ item }">
              <v-btn icon @click="codeDetailsDialog=true;codeTargets=item.targets;codeTitle=item.title">
                <v-icon>mdi-view-list</v-icon>
              </v-btn>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <v-pagination
              v-model="page"
              :length="pageCount"
            ></v-pagination>
          </div>
        </client-only>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import NewCodeDialog from "~/components/admin/new-code-dialog"
import CodeTargetsDialog from "~/components/admin/code-targets-dialog"

import { PROMOTION_CODE } from "~/api"

import TRANSLATE_CURRENCY from "~/util/translations/translate-currency"

export default {
  head() {
    return {
      title: this.$t('Promotions')
    }
  },
  async fetch() {
    try {
      let engineId = this.$store.state.info.id
      let { data } = await this.$axios.get(PROMOTION_CODE.replace('__ENGINE_ID__', engineId))
      this.promotions.splice(0, this.promotions.length, ...(data?.promotionCodes || []))
    } catch (error) {}
  },
  data() {
    return {
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      newCodeDialog: false,
      codeDetailsDialog: false,
      codeTitle: '',
      codeTargets: [],
      headers: [
        { text: this.$t('Title')                     , value: 'title'          },
        { text: this.$t('Promo Code')                , value: 'code'           },
        { text: this.$t('Usage / Limit')             , value: 'usageAndLimit'  , align: 'center' },
        { text: this.$t('Expiration Date')           , value: 'expirationDate' },
        { text: this.$t('Amount')                    , value: 'amount'         },
        { text: this.$t('Promotion Targets')         , value: 'noTarget'       },
      ],
      promotions: [],
    }
  },
  methods: {
    async createNewCode(data) {
      try {
        let engineId = this.$store.state.info.id
        await this.$axios.post(PROMOTION_CODE.replace('__ENGINE_ID__', engineId), data);
        await this.$fetch();
      } catch (error) {}
    }
  },
  filters: {
    countUsages(promo) {
      return promo?.targets?.map?.(i => i.numOfUse)?.reduce?.((i,j) => i+j, 0) || 0
    },
    translateAmount(promo, upToText) {
      switch (promo.__t) {
        case "ConstantPromotionCode":
          return `${promo.amount} ${TRANSLATE_CURRENCY['IRR']}`
        case "PercentPromotionCode":
          return `${promo.amount}%`
        case "PercentLimitPromotionCode":
          return `${promo.amount}% ${upToText} ${promo.limit} ${TRANSLATE_CURRENCY['IRR']}`
      }
    }
  },
  components: { NewCodeDialog, CodeTargetsDialog }
}
</script>