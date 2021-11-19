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
    <v-dialog max-width="500" v-model="newImageDialog">
      <v-fade-transition>
        <new-image-dialog
          v-if="newImageDialog"
          aspect-ratio="8/5"
          @submit="createNewImage"
          @close="newImageDialog=false"
        />
      </v-fade-transition>
    </v-dialog>
    <v-card-title class="black--text pa-2">
      {{$t('Gallery')}}
    </v-card-title>
    <v-card-title class="black--text pa-2 text-body-1 mt-n4">
      {{hotelsDic[hotelId].rooms[roomId].title[$i18n.locale]}}
    </v-card-title>
    <v-card-subtitle class="pa-2">
      {{$t('In this section, you can manage your rooms\' images')}}
    </v-card-subtitle>
    <v-card-text class="pa-2 pb-0">
      <div class="images-container">
        <div class="image-item big" v-if="mainUrl">
          <v-card
            elevation="1"
            class="rounded"
          >
            <div class="p-relative overflow-hidden">
              <v-img class="secondary" :src="mainUrl" :aspect-ratio="8/5" />
              <div class="overlay d-flex flex-column actions">
                <div class="mt-auto px-3">
                  <v-row align="center" justify="end" dense>
                    <v-col cols="auto">
                      <v-btn icon color="white" @click="''">
                        <v-icon>
                          mdi-star
                        </v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </div>
          </v-card>
        </div>
        <template v-if="
          hotelsDic &&
          hotelsDic[hotelId] &&
          hotelsDic[hotelId].rooms &&
          hotelsDic[hotelId].rooms[roomId] &&
          hotelsDic[hotelId].rooms[roomId].images &&
          hotelsDic[hotelId].rooms[roomId].images.other
        ">
          <div
            v-for="(image,idx) in hotelsDic[hotelId].rooms[roomId].images.other"
            :key="idx"
            class="image-item"
          >
            <v-card
              elevation="1"
              class="rounded"
            >
              <div class="p-relative overflow-hidden">
                <v-img class="secondary" :src="image && image.url" :aspect-ratio="8/5" />
                <div class="overlay d-flex flex-column actions">
                  <div class="mt-auto px-3">
                    <v-row align="center" justify="end" dense>
                      <v-col cols="auto">
                        <v-btn icon color="white" @click="setAsMainImage(image._id)">
                          <v-icon>
                            mdi-star-outline
                          </v-icon>
                        </v-btn>
                        <v-btn icon color="white" @click="deleteImage(image._id)">
                          <v-icon>
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </div>
                </div>
              </div>
            </v-card>
          </div>
        </template>
        <div class="image-item">
          <v-responsive :aspect-ratio="8/5">
            <v-card
              flat
              style="border: 3px dashed var(--v-secondary-darken2)"
              class="h-100 v-100 d-flex flex-row align-center justify-center"
              @click="newImageDialog = true"
            >
              <v-icon x-large>mdi-image-plus</v-icon>
            </v-card>
          </v-responsive>
        </div>
      </div>
    </v-card-text>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex"

import NewImageDialog from "~/components/admin/new-image-dialog"

import { IMAGES, ROOM_IMAGES } from "~/api"

export default {
  head() {
    return {
      title: this.$t('Room Gallery')
    }
  },
  validate({ store, params, redirect, app: { localePath } }) {
    if(Object.keys(store.state.hotelsDic).includes(params.id))
      if(Object.keys(store.state.hotelsDic[params.id].rooms).includes(params.room))
        return true
    redirect(localePath('admin-hotel'))
  },
  asyncData({ params }) {
    return { hotelId: params.id, roomId: params.room }
  },
  data: () => ({
    newImageDialog: false,
    loading: false,
  }),
  methods: {
    ...mapActions(['refreshConfig']),
    async createNewImage(image) {
      this.newImageDialog = false
      this.loading = true
      let submitData = {
        image,
        type: 'roomType',
        hotelId: this.hotelId,
        roomTypeId: this.roomId,
        hostName: this.$store.state.info.hostName,
        main: false,
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
    },
    async setAsMainImage(imageId) {
      this.loading = true
      try {
        await this.$axios.put(ROOM_IMAGES, {
          hostName: this.$store.state.info.hostName,
          hotelId: this.hotelId,
          roomTypeId: this.roomId,
          imageId
        })
        await this.refreshConfig()
      } catch (error) {}
      finally {
        this.loading = false
      }
    },
    async deleteImage(imageId) {
      this.loading = true
      try {
        await this.$axios.delete(IMAGES, {
          data: {
            type: 'roomType',
            hostName: this.$store.state.info.hostName,
            hotelId: this.hotelId,
            roomTypeId: this.roomId,
            imageId
          }
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
      return this.hotelsDic?.[this.hotelId]?.rooms?.[this.roomId]?.images?.main?.url || ''
    }
  },
  components: { NewImageDialog },
}
</script>

<style lang="scss" scoped>
.actions {
  background: linear-gradient(0deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%);
}

.images-container {
  display: grid;
  grid-gap: 16px;
  grid-template-rows:    repeat(1, 1fr);
  grid-template-columns: repeat(4, 1fr);
}

.image-item.big {
  grid-row:    1 / 3;
  grid-column: 1 / 3;
}
</style>