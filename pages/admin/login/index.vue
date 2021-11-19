<template>
  <div class="root">
    <v-card max-width="500" class="d-flex flex-column align-center">
      <v-img width="50" class="mt-4" :src="info.logo"></v-img>
      <v-card-title class="primary--text font-weight-bold">{{$t('Booking Engine Management')}}</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="submitLogin">
          <v-text-field
            outlined
            dense
            v-model="data.username"
            :label="$t('Username')"
            prepend-inner-icon="mdi-account-outline"
            dir="ltr"
          ></v-text-field>
          <v-text-field
            outlined
            dense
            v-model="data.password"
            :label="$t('Password')"
            :prepend-inner-icon="isPassword ? 'mdi-lock-outline' : 'mdi-lock-open-variant-outline'"
            @click:prepend-inner="isPassword = !isPassword"
            :type="isPassword ? 'password' : 'text'"
            dir="ltr"
          ></v-text-field>
          <div class="d-flex flex-row">
            <v-btn
              :disabled="Object.values(this.data).includes('')"
              type="submit"
              class="mx-auto"
              color="info"
            >
            {{$t('Sign In')}}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  validate({ redirect, $auth, app: { localePath } }) {
    if($auth.loggedIn) {
      redirect(localePath('admin-colors'))
      return false
    }
    return true
  },
  head() {
    return {
      title: this.$t('Login')
    }
  },
  data: () => {
    return {
      valid: false,
      isPassword: true,
      data: {
        username: '',
        password: '',
      }
    }
  },
  methods: {
    async submitLogin() {
      try {
        if(!Object.values(this.data).includes(''))
          await this.$auth.loginWith('local', {
            data: {
              ...this.data,
              hostName: this.$store.state.info.hostName
            }
          })
      } catch (e) {}
    }
  },
  computed: {
    ...mapState(['info']),
  }
}
</script>

<style>
.root {
  position:fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--v-secondary-base);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>