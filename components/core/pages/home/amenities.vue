<template>
  <v-container v-if="amenities.length > 0">
    <title-line>
      <v-card-title class="py-0 my-1 font-weight-bold">{{$t('Amenities & Attractions')}}</v-card-title>
    </title-line>
    <v-row>
      <v-col v-for="(amenity,idx) in amenities" :key="idx" cols="12" sm="6" lg="4">
        <blur-card>
          <template v-slot:background>
            <v-img :aspect-ratio="1" :src="amenity.image" />
          </template>
          <template v-slot:foreground>
            <v-sheet color="#0005" class="h-100 overflow-hidden">
              <title-underline>
                <v-card-title class="white--text">
                  <h3>{{amenity.title[$i18n.locale]}}</h3>
                </v-card-title>
              </title-underline>
            </v-sheet>
          </template>
        </blur-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

import TitleLine from "~/components/base/title-line";
import TitleUnderline from "~/components/base/title-underline";
import BlurCard from "~/components/base/blur-card";

export default {
  components: { TitleLine, TitleUnderline, BlurCard },
  props: ['hotel'],
  computed: {
    ...mapState(['hotelsDic']),
    amenities() {
      return this.hotelsDic?.[this?.hotel]?.info?.hotel?.amenities || []
    }
  }
};
</script>