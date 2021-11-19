<template>
  <div>
    <v-dialog
      v-if="loading"
      content-class="elevation-0 h-100 d-flex flex-column align-center justify-center"
      light
      no-click-animation
      overlay-color="white"
      v-model="loading"
      persistent
    >
      <v-progress-circular
        v-if="loading"
        :size="70"
        :width="7"
        color="primary"
        indeterminate
      />
    </v-dialog>
    <v-dialog max-width="500" v-model="editImageDialog">
      <v-fade-transition>
        <new-image-dialog
          v-if="editImageDialog"
          aspect-ratio="16/9"
          @submit="submit"
          @close="editImageDialog=false"
        />
      </v-fade-transition>
    </v-dialog>
    <v-row align="center" justify="space-between" no-gutters>
      <v-col cols="auto">
        <v-card-title class="black--text pa-2">{{$t('Slider')}}</v-card-title>
      </v-col>
      <v-col cols="auto">
        <v-btn icon class="ma-2" @click="editImageDialog = true">
          <v-icon>
            mdi-pencil
          </v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-card-text class="pa-2">
      <v-card
        v-if="mainUrl"
        elevation="1"
        class="rounded"
      >
        <v-img class="secondary" :src="mainUrl" :aspect-ratio="16/9" />
      </v-card>
      <v-responsive v-else :aspect-ratio="16/9">
        <v-card
          flat
          style="border: 3px dashed var(--v-secondary-darken2)"
          class="h-100 v-100 d-flex flex-row align-center justify-center"
          @click="editImageDialog = true"
        >
          <v-icon x-large>mdi-plus</v-icon>
        </v-card>
      </v-responsive>
    </v-card-text>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"

import NewImageDialog from "~/components/admin/new-image-dialog"

import { IMAGES } from "~/api"

export default {
  head() {
    return {
      title: this.$t('Slider')
    }
  },
  asyncData({ params }) {
    return { id: params.id }
  },
  data: () => ({
    editImageDialog: false,
    loading: false,
  }),
  methods: {
    ...mapActions(['refreshConfig']),
    async submit(image) {
      this.editImageDialog = false
      this.loading = true
      let submitData = {
        image,
        type: 'hotel',
        hotelId: this.id,
        hostName: this.$store.state.info.hostName,
        caption: 'main',
        main: true,
      }
      let formData = Object.keys(submitData).reduce((acc, curr) => {
        acc.append(curr, submitData[curr])
        return acc
      }, new FormData())

      try {
        await this.$axios.post(IMAGES, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        await this.refreshConfig()
      } catch (error) {}
      finally {
        this.loading = false
      }
    }
  },
  computed: {
    ...mapState(['hotelsDic']),
    mainUrl() {
      return this.hotelsDic?.[this.id]?.info?.images?.main?.url
    }
  },
  components: { NewImageDialog },
}
</script>

<style lang="scss" scoped>
.actions {
  background: linear-gradient(0deg, rgba(0,0,0,0) 70%, rgba(0,0,0,0.5) 100%,);
}
</style>