<template>
  <v-card elevation="1">
    <v-card-title>{{$t('Colors')}}</v-card-title>
    <v-card-subtitle>{{$t('In this section, you can edit the site\'s colors according to your brand image')}}</v-card-subtitle>
    <v-card-text>
      <v-form @submit.prevent="editColors">
        <v-row>
          <v-col
            v-for="color in Object.keys(colors)"
            :key="color"
            cols="12"
            sm="6"
            md="3"
          >
            <v-menu :close-on-content-click="false" v-model="menus[color]" >
              <template #activator="{ on, attrs }">
                <v-text-field
                  dir="ltr"
                  v-on="on"
                  v-bind="attrs"
                  outlined
                  dense
                  hide-details
                  :label="color"
                  readonly
                  :value="colors[color]"
                >
                  <template #prepend-inner>
                    <v-icon :color="colors[color]">mdi-checkbox-blank</v-icon>
                  </template>
                </v-text-field>
              </template>
              <v-card elevation="1">
                <v-card-text>
                  <v-color-picker
                    hide-mode-switch
                    mode="hexa"
                    elevation="1"
                    :value="colors[color]"
                    @input="colors[color]=$event"
                  ></v-color-picker>
                </v-card-text>
                <v-card-actions class="px-4 pb-4 pt-0">
                  <v-btn color="info" class="pa-2" block @click="menus[color] = false">
                    {{$t('Submit')}}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn height="40" block color="success" type="submit">
              {{$t('Submit')}}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { ENGINE_CONFIG_EDIT } from "~/api"

export default {
  validate({ redirect, $auth, app: { localePath } }) {
    if($auth.loggedIn) {
      return true
    }
    redirect(localePath('admin-login'))
  },
  head() {
    return {
      title: this.$t('Colors')
    }
  },
  data() {
    return {
      colors: { ...this.$store.state.colors },
      menus: {
        primary: false,
        accent: false,
        secondary: false,
        info: false,
        warning: false,
        error: false,
        success: false,
      }
    }
  },
  computed: mapState({ id: state => state.info.id }),
  methods: {
    ...mapMutations(['setColors']),
    async editColors() {
      try {
        await this.$axios.put(
          ENGINE_CONFIG_EDIT.replace('__ENGINE_ID__', this.id),
          {
            colors: this.colors
          }
        );
        this.setColors(this.colors)
      } catch (error) {}
    }
  }
}
</script>