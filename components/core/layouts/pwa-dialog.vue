<template>
  <v-card tile class="d-flex flex-column">
    <div class="text-h6 pa-6 d-flex flex-column align-center">
      <v-img eager :src="info.logo" width="40px" class="mx-auto mb-2" />
      <div class="text-center">{{webAppText}}</div>
    </div>
    <v-card-text class="pb-0">
      <template v-if="type=='ios'">
        <p class="text-justify" v-if="['android', 'ios'].includes(type)">{{$t('To install the web application, please follow the steps bellow')}}</p>
        <v-row>
          <v-col cols="auto">
            <v-icon>mdi-export-variant</v-icon>
          </v-col>
          <v-col cols="" class="black--text">
            <p class="ma-0 text-justify">
              <template v-if="$i18n.locale == 'fa'">در نوار پائین٬ روی</template>
              <template v-else-if="$i18n.locale == 'en'">Click on the</template>
              <span class="font-weight-bold">Share</span>
              <template v-if="$i18n.locale == 'fa'">کلیک کنید</template>
              <template v-else-if="$i18n.locale == 'en'">button on the bottom ribbon</template>
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-icon>mdi-plus-box-outline</v-icon>
          </v-col>
          <v-col cols="" class="black--text">
            <p class="ma-0 text-justify">
              <template v-if="$i18n.locale == 'fa'">در منو٬ گزینه‌ی</template>
              <template v-else-if="$i18n.locale == 'en'">Choose</template>
              <span class="font-weight-bold">Add to Home Screen</span>
              <template v-if="$i18n.locale == 'fa'">را انتخاب کنید</template>
              <template v-else-if="$i18n.locale == 'en'">in the menu</template>
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-icon>mdi-check</v-icon>
          </v-col>
          <v-col cols="" class="black--text">
            <p class="ma-0 text-justify">
              <template v-if="$i18n.locale == 'fa'">در قسمت بالا سمت راست روی</template>
              <template v-else-if="$i18n.locale == 'en'">Click on</template>
              <span class="font-weight-bold">Add</span>
              <template v-if="$i18n.locale == 'fa'">کلیک کنید</template>
              <template v-else-if="$i18n.locale == 'en'">on the top right corner</template>
            </p>
          </v-col>
        </v-row>
      </template>
      <template v-else-if="type=='android'">
        <p class="text-justify" v-if="['android', 'ios'].includes(type)">{{$t('To install the web application, please follow the steps bellow')}}</p>
        <v-row>
          <v-col cols="auto">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-col>
          <v-col cols="" class="black--text">
            <p class="ma-0 text-justify">
              <template v-if="$i18n.locale == 'fa'">در گوشه‌ی بالا سمت راست٬ روی</template>
              <template v-else-if="$i18n.locale == 'en'">Click on</template>
              <span class="font-weight-bold">Options</span>
              <template v-if="$i18n.locale == 'fa'">کلیک کنید</template>
              <template v-else-if="$i18n.locale == 'en'">in the top right corner</template>
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-icon>{{icons.addToHomescreen}}</v-icon>
          </v-col>
          <v-col cols="" class="black--text">
            <p class="ma-0 text-justify">
              <template v-if="$i18n.locale == 'fa'">در منو٬ گزینه‌ی</template>
              <template v-else-if="$i18n.locale == 'en'">Choose</template>
              <span class="font-weight-bold">Add to Home screen</span>
              <template v-if="$i18n.locale == 'fa'">را انتخاب کنید</template>
              <template v-else-if="$i18n.locale == 'en'">in the menu</template>
            </p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="auto">
            <v-icon>mdi-check</v-icon>
          </v-col>
          <v-col cols="" class="black--text">
            <p class="ma-0 text-justify">
              <template v-if="$i18n.locale == 'fa'">در اعلان٬ روی دکمه‌ی</template>
              <template v-else-if="$i18n.locale == 'en'">Click on</template>
              <span class="font-weight-bold">Add</span>
              <template v-if="$i18n.locale == 'fa'">کلیک کنید</template>
              <template v-else-if="$i18n.locale == 'en'">in the dialog</template>
            </p>
          </v-col>
        </v-row>
      </template>
      <template v-else>
        <p class="text-justify">{{$t('The web application is\'nt supported on your device')}}</p>
      </template>
    </v-card-text>
    <v-card-actions class="mt-auto">
      <v-btn block elevation="1" color="primary" @click="$emit('close')">{{ $t("OK") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex"

import addToHomescreen from "~/util/icons/add-to-homescreen"

export default {
  props: ['type'],
  data: () => ({ icons: { addToHomescreen } }),
  computed: {
    ...mapState(['info']),
    webAppText() {
      switch (this.$i18n.locale) {
        case 'fa':
          return `
            وب اپلیکیشن
            ${this.info.title.fa}
          `
        case 'en':
        default:
          return `
            ${this.info.title.en}
            Web App
          `
      }
    }
  },
}
</script>