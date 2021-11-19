<template>
  <v-card>
    <div class="text-h6 pa-6 d-flex flex-column align-center">
      <v-img eager :src="info.logo" width="40px" class="mx-auto mb-2" />
      <div class="text-center">{{$t('Terms and Conditions')}}</div>
    </div>
    <v-divider></v-divider>
    <v-card-text class="pa-6" style="max-height: calc(100vh - 240px)">
      <p
        class="ma-0 text-justify"
        v-html="
          info &&
          info.terms &&
          info.terms[$i18n.locale] &&
          info.terms[$i18n.locale].replace(/\n/gi,'<br>')
        "
      ></p>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-row align="center" justify="end" dense>
        <v-col cols="6" sm="auto">
          <v-btn block color="success" @click="$emit('agree')" id="g-accepted-terms">
            <v-icon class="d-none d-sm-block ms-n1 me-1">mdi-check</v-icon>
            {{$t('Accept')}}
          </v-btn>
        </v-col>
        <v-col cols="6" sm="auto">
          <v-btn block color="error" @click="$emit('decline')">
            <v-icon class="d-none d-sm-block ms-n1 me-1">
              {{$vuetify.rtl ? 'mdi-arrow-right' : 'mdi-arrow-left'}}
            </v-icon>
            {{$t('Return')}}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script>
import { mapState } from "vuex"

export default {
  computed: mapState(['info']),
}
</script>
