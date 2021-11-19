<template>
  <div>
    <v-card flat outlined class="my-6">
      <div class="pt-4 d-flex flex-column align-center">
        <cross-mark></cross-mark>
        <v-card-title v-if="error == 60" class="px-6">{{ $t("Invalid Reference ID") }}</v-card-title>
        <v-card-title v-else-if="error == 15" class="px-6">{{ $t("Your transaction was not successful") }}</v-card-title>
        <v-card-title v-else class="px-6">{{ $t("A problem occurred") }}</v-card-title>
        <v-card-subtitle v-if="error == 15">{{ $t('There was a problem in the payment process') }}</v-card-subtitle>
        <v-card-subtitle v-else-if="error == 1">{{ $t('There was a problem with the payment process. Your money will be refunded within 72 hours.') }}</v-card-subtitle>
        <v-card-subtitle v-else-if="error == 60">{{ $t('The reservation was not found or has already been confirmed') }}</v-card-subtitle>
        <v-card-subtitle v-else>{{ $t('A problem occurred in the reservation process') }}</v-card-subtitle>
      </div>
    </v-card>
    <v-row justify="end" class="mt-n3">
      <v-col cols="auto">
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
    </v-row>
  </div>
</template>

<script>
import CrossMark from '~/components/core/pages/booking/animated-crossmark.vue'
export default {
  components: { CrossMark },
  props: ['error']
}
</script>