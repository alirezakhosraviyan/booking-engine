<template>
  <v-row v-if="loading" class="mb-n3">
    <v-col v-for="i in 2" :key="i" cols="12" sm="6" lg="12">
      <v-card flat outlined class="overflow-hidden">
        <v-row no-gutters align="stretch" justify="space-between">
          <v-col cols="12" lg="4">
            <v-skeleton-loader type="image" class="h-100" />
          </v-col>
          <v-col
            cols="12"
            lg=""
            class="d-flex flex-column justify-space-between"
          >
            <v-skeleton-loader type="article" />
            <v-skeleton-loader type="chip" class="ps-4 pb-4" />
          </v-col>
          <v-col
            align-self="stretch"
            cols="12"
            lg="auto"
            class="px-4 py-4 d-flex flex-row flex-lg-column align-end justify-space-between"
          >
            <v-skeleton-loader type="button" />
            <v-skeleton-loader type="chip" />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
  <v-row v-else class="mb-n3">
    <template v-for="i in sortedRooms">
      <v-col
        v-if="(hotelsDic[hotel] && hotelsDic[hotel].rooms) && hotelsDic[hotel].rooms[roomLookup[i].info.id]"
        :key="i"
        cols="12"
        sm="6"
        lg="12"
      >
        <room-card
          @change-count="changeCount(
            roomLookup[i].info.id,
            $options.filters.getCountByRoomId(roomLookup[i].info.id, cart),
            $event
          )"
          :checkinDate="checkinDate"
          :checkoutDate="checkoutDate"
          :count="roomLookup[i].info.id | getCountByRoomId(cart)"
          :ratePlan="`${ratePlanId}`"
          :dict="(hotelsDic[hotel] && hotelsDic[hotel].rooms) || {}"
          currency="IRR"
          :room="roomLookup[i]"
          class="room-card"
        ></room-card>
      </v-col>
    </template>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

import RoomCard from "~/components/core/pages/booking/room-card";

export default {
  props: ["hotel", "checkinDate", "checkoutDate"],
  components: { RoomCard },
  computed: {
    ...mapState("avail", ["loading", "roomLookup", "ratePlans", "cart"]),
    ...mapState(["hotelsDic"]),
    ratePlanId() {
      return this.ratePlans?.[this.$store.state.avail.chosenRatePlan]?.id
    },
    sortedRooms() {
      let result = Object.keys(this.roomLookup)
      result.sort((i, j) => {
        let iCapacity =  this?.roomLookup?.[i]?.info?.capacity;
        let iPrice = Object.values(this?.roomLookup?.[i]?.rates)?.[0]?.price?.price_to_pay || 0;
        let jCapacity =  this?.roomLookup?.[j]?.info?.capacity;
        let jPrice = Object.values(this?.roomLookup?.[j]?.rates)?.[0]?.price?.price_to_pay || 0;
        if(iCapacity > jCapacity) return 1;
        if(iCapacity < jCapacity) return -1;
        if(iPrice > jPrice) return 1;
        if(iPrice < jPrice) return -1;
        return 1
      })
      return result
    }
  },
  filters: {
    getCountByRoomId(id, cart) {
      for(let i of cart)
        if(i.id == id) return i.count
      return 0
    }
  },
  methods: {
    changeCount(id, from, to) {
      switch (from - to) {
        case 1:
          this.$store.commit('avail/removeFromCart', id)
          break;
        case -1:
          this.$store.commit('avail/addToCart', id)
          break;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.room-card {
  margin-bottom: 24px;
  &:last-of-type {
    margin-bottom: 0px;
  }
}
</style>
