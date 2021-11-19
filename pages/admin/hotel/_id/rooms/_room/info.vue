<template>
  <div>
    <v-card-title class="black--text pa-2">{{$t('Room Information')}}</v-card-title>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  head() {
    return {
      title: this.$t('Room Info')
    }
  },
  computed: mapState(['hotelsDic']),
}
</script>