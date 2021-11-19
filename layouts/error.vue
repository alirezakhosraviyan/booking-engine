<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card flat outlined class="overflow-hidden">
            <v-card-text>
              <pre dir="ltr">{{JSON.stringify(error,null,4)}}</pre>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <NuxtLink
        class="nuxt-link primary--text"
        :to="
          localePath('index') + 
          ($store.state.club.isActive
          ? `?${$store.state.info.authStrategy.param}=${$store.state.club.key}`
          : '')
        "
      >
        {{$t('Go to Homepage')}}
      </NuxtLink>
    </v-container>
  </div>
</template>

<script>
export default {
  head() {
    return {
      title: `${this.$t('Error')} ${this.error.statusCode}`
    }
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
}
</script>